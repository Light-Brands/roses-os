import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, getServerUser } from '@/lib/supabase/server';
import { PDFDocument, PDFName, PDFDict, PDFStream, rgb } from 'pdf-lib';
import { readFile, writeFile, access } from 'fs/promises';
import path from 'path';

type Action = 'list' | 'replace' | 'add' | 'remove';

interface PdfImageInfo {
  index: number;
  page: number;
  name: string;
  width: number;
  height: number;
}

function apiResponse<T>(data: T | null, error: string | null = null, status = 200) {
  return NextResponse.json({ data, error }, { status });
}

async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const user = await getServerUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') return null;
  return user;
}

async function loadPdfBytes(formData: FormData): Promise<Uint8Array | null> {
  const pdfFile = formData.get('pdf') as File | null;
  const pdfPath = formData.get('pdfPath') as string | null;

  if (pdfFile) {
    return new Uint8Array(await pdfFile.arrayBuffer());
  }

  if (pdfPath) {
    const safePath = path.basename(pdfPath);
    // Check both PDF directories — Level 1 lives in public/manuals/,
    // Level 2/3 live in public/resources/manuals/
    const candidates = [
      path.join(process.cwd(), 'public', 'manuals', safePath),
      path.join(process.cwd(), 'public', 'resources', 'manuals', safePath),
    ];
    for (const fullPath of candidates) {
      try {
        const buffer = await readFile(fullPath);
        return new Uint8Array(buffer);
      } catch {
        // Try next candidate
      }
    }
    return null;
  }

  return null;
}

async function embedImage(pdfDoc: PDFDocument, imageBytes: Uint8Array, mimeType: string) {
  if (mimeType === 'image/png') {
    return pdfDoc.embedPng(imageBytes);
  }
  return pdfDoc.embedJpg(imageBytes);
}

function listImages(pdfDoc: PDFDocument): PdfImageInfo[] {
  const pages = pdfDoc.getPages();
  const images: PdfImageInfo[] = [];
  let globalIndex = 0;

  for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
    const page = pages[pageIdx];
    const resources = page.node.Resources();
    if (!resources) continue;

    const xObjectRef = resources.get(PDFName.of('XObject'));
    if (!xObjectRef) continue;

    const xObjectDict = pdfDoc.context.lookup(xObjectRef);
    if (!(xObjectDict instanceof PDFDict)) continue;

    const entries = xObjectDict.entries();
    for (const [nameObj, valueRef] of entries) {
      const obj = pdfDoc.context.lookup(valueRef);
      if (!(obj instanceof PDFStream)) continue;

      const subtype = obj.dict.get(PDFName.of('Subtype'));
      if (!subtype || subtype.toString() !== '/Image') continue;

      const w = obj.dict.get(PDFName.of('Width'));
      const h = obj.dict.get(PDFName.of('Height'));

      images.push({
        index: globalIndex++,
        page: pageIdx + 1,
        name: nameObj.toString(),
        width: w ? parseInt(w.toString()) : 0,
        height: h ? parseInt(h.toString()) : 0,
      });
    }
  }

  return images;
}

async function savePdf(pdfDoc: PDFDocument, formData: FormData): Promise<NextResponse> {
  const modifiedBytes = await pdfDoc.save();
  const pdfPath = formData.get('pdfPath') as string | null;

  if (pdfPath) {
    const safePath = path.basename(pdfPath);
    // Save to whichever directory the PDF was loaded from
    const candidates = [
      path.join(process.cwd(), 'public', 'manuals', safePath),
      path.join(process.cwd(), 'public', 'resources', 'manuals', safePath),
    ];
    let fullPath = candidates[0];
    for (const candidate of candidates) {
      try {
        await access(candidate);
        fullPath = candidate;
        break;
      } catch {
        // Try next
      }
    }
    await writeFile(fullPath, modifiedBytes);
    const publicDir = path.join(process.cwd(), 'public');
    const relativePath = fullPath.slice(publicDir.length);
    return NextResponse.json({ data: { saved: true, path: relativePath }, error: null });
  }

  return new NextResponse(Buffer.from(modifiedBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="edited.pdf"',
    },
  });
}

/**
 * POST /api/pdf/edit
 *
 * Actions:
 * - list: List images in a PDF (returns JSON)
 * - replace: Cover old image area with white, draw new image on top
 * - add: Add a new image to a specific page
 * - remove: Cover image area with white rectangle
 *
 * FormData fields:
 * - pdf (File) or pdfPath (string, filename in /public/manuals/)
 * - action: "list" | "replace" | "add" | "remove"
 * - image (File): new image for add/replace
 * - page (number): 1-indexed page number
 * - x, y, width, height (number): position and dimensions
 */
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return apiResponse(null, 'Unauthorized - admin access required', 401);
    }

    const formData = await request.formData();
    const action = formData.get('action') as Action;

    if (!action || !['list', 'replace', 'add', 'remove'].includes(action)) {
      return apiResponse(null, 'Invalid action. Use: list, replace, add, remove', 400);
    }

    const pdfBytes = await loadPdfBytes(formData);
    if (!pdfBytes) {
      return apiResponse(null, 'No PDF provided. Use "pdf" (file) or "pdfPath" (filename in /public/manuals/)', 400);
    }

    const pdfDoc = await PDFDocument.load(pdfBytes);

    if (action === 'list') {
      const images = listImages(pdfDoc);
      return apiResponse({ images, pageCount: pdfDoc.getPageCount() });
    }

    const pageNum = parseInt(formData.get('page') as string);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > pdfDoc.getPageCount()) {
      return apiResponse(null, `Invalid page number. PDF has ${pdfDoc.getPageCount()} pages.`, 400);
    }
    const page = pdfDoc.getPages()[pageNum - 1];

    const x = parseFloat(formData.get('x') as string);
    const y = parseFloat(formData.get('y') as string);
    const width = parseFloat(formData.get('width') as string);
    const height = parseFloat(formData.get('height') as string);

    if ([x, y, width, height].some(isNaN)) {
      return apiResponse(null, 'x, y, width, and height are required numbers', 400);
    }

    if (action === 'remove') {
      page.drawRectangle({ x, y, width, height, color: rgb(1, 1, 1) });
      return savePdf(pdfDoc, formData);
    }

    // replace and add both need an image
    const imageFile = formData.get('image') as File | null;
    if (!imageFile) {
      return apiResponse(null, 'No image file provided', 400);
    }

    const imageBytes = new Uint8Array(await imageFile.arrayBuffer());
    const embeddedImage = await embedImage(pdfDoc, imageBytes, imageFile.type);

    if (action === 'replace') {
      page.drawRectangle({ x, y, width, height, color: rgb(1, 1, 1) });
    }

    page.drawImage(embeddedImage, { x, y, width, height });
    return savePdf(pdfDoc, formData);
  } catch (error) {
    console.error('POST /api/pdf/edit error:', error);
    return apiResponse(null, 'Internal server error', 500);
  }
}
