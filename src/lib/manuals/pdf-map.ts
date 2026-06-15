/**
 * Map manual slug -> canonical Final Version PDF URL.
 *
 * The Final Version PDFs at repo root were professionally designed and
 * carry layout the block model cannot reproduce (phase pills, reference
 * cards, colored chakra lists). We serve them directly on download so
 * the file matches the original.
 *
 * Copies live under `public/manuals/pdf/`. Source originals stay at
 * repo root (referenced by docs and humans comparing layouts).
 *
 * Manuals without an entry here fall back to the in-app `blocksToHtml`
 * Print-as-PDF flow, which renders content but not the original layout.
 * That trade-off is documented in roses-os#506.
 */

export interface FinalPdf {
  /** Path served from `public/`. */
  url: string;
  /** Filename the browser saves under. */
  downloadName: string;
}

const SLUG_TO_PDF: Record<string, FinalPdf> = {
  'rose-meditation-level-1': {
    url: '/manuals/pdf/rose-meditation-level-1.pdf',
    downloadName: 'Rose Meditation Level 1.pdf',
  },
  'rose-meditation-level-2': {
    url: '/manuals/pdf/rose-meditation-level-2.pdf',
    downloadName: 'Rose Meditation Level 2.pdf',
  },
  'rose-meditation-level-3': {
    url: '/manuals/pdf/rose-meditation-level-3.pdf',
    downloadName: 'Rose Meditation Level 3.pdf',
  },
  // aura-level-1: no canonical PDF yet; falls back to the placeholder
  // export flow.
};

export function getFinalPdfForSlug(slug: string | null | undefined): FinalPdf | null {
  if (!slug) return null;
  return SLUG_TO_PDF[slug] ?? null;
}
