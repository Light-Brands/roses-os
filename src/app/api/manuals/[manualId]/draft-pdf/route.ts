import { NextRequest, NextResponse } from 'next/server';
import type { ManualBlock } from '@/lib/manuals/types';
import { blocksToPdf } from '@/lib/manuals/draft-pdf';

// Puppeteer needs the Node runtime, not the edge runtime. The render can take a
// few seconds on a cold Chrome launch, so lift the function timeout.
export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * POST /api/manuals/[manualId]/draft-pdf
 * Body: { blocks: ManualBlock[], title: string, origin?: string }
 *
 * The "Draft PDF from your edits" path (D-22, T-013): render the CURRENT editor
 * blocks to a PDF via blocksToHtml -> Puppeteer, separate from the canonical
 * "Designed print original" static PDF. Errors return the named envelope
 * { ok: false, error: { code, message } } (Section D).
 */
export async function POST(request: NextRequest) {
  let body: { blocks?: ManualBlock[]; title?: string; origin?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: 'BAD_JSON', message: 'Request body is not valid JSON' } },
      { status: 400 },
    );
  }

  const { blocks, title, origin } = body;
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return NextResponse.json(
      { ok: false, error: { code: 'NO_BLOCKS', message: 'No blocks to render' } },
      { status: 400 },
    );
  }

  try {
    const pdf = await blocksToPdf(blocks, title || 'Manual', origin || '');
    const filename = `${(title || 'manual').replace(/[^\w.-]+/g, '-')}-draft.pdf`;
    return new NextResponse(pdf as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'PDF generation failed';
    // NO_CHROME (no executable resolvable) is the most likely deploy-env failure;
    // surface it explicitly so the operator knows to set PUPPETEER_EXECUTABLE_PATH.
    const code = message.startsWith('NO_CHROME') ? 'NO_CHROME' : 'PDF_FAILED';
    return NextResponse.json(
      { ok: false, error: { code, message } },
      { status: 500 },
    );
  }
}
