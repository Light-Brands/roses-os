import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

/**
 * POST /api/manuals/upload
 * Upload an image (file picker, drag-drop, or clipboard paste) for use in
 * manual blocks. Accepts multipart form data with a 'file' field.
 *
 * Storage model matches the extracted reconstruction figures: images are written
 * to `public/uploads/` and referenced by path (`/uploads/<file>`), exactly like
 * `public/reconstruction/l1/*.png`. No Supabase storage bucket is involved (none
 * is provisioned on this project). This persists in local/dev review; for a prod
 * deploy the uploaded files are committed/hosted the same way the reconstruction
 * figures are.
 */

const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const ext = MIME_EXT[file.type];
    if (!ext) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB' }, { status: 400 });
    }

    const filename = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const dir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(dir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ data: { url, path: `uploads/${filename}`, filename } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
