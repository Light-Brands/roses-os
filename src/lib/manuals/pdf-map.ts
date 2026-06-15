/**
 * Map (manual slug, language) -> canonical Final Version PDF URL.
 *
 * The Final Version PDFs were professionally designed and carry layout the block
 * model cannot reproduce (phase pills, reference cards, colored chakra lists). We
 * serve them directly on download so the file matches the original — and we serve
 * the file in the reader's selected language (en/es/pt). Files live under
 * `public/manuals/pdf/`, regenerated from `scripts/pdf-manuals/roses-manual-*.html`.
 *
 * A (slug, language) pair without a designed PDF (e.g. el/ru/uk, or aura-level-1)
 * returns null and the caller falls back to the in-app `blocksToHtml` Print-as-PDF
 * flow, which renders current content but not the original layout (roses-os#506).
 */

export interface FinalPdf {
  /** Path served from `public/`. */
  url: string;
  /** Filename the browser saves under. */
  downloadName: string;
}

/** Manuals that have a designed PDF, with the display name used in the filename. */
const PDF_MANUALS: Record<string, { stem: string; name: string }> = {
  'rose-meditation-level-1': { stem: 'rose-meditation-level-1', name: 'Rose Meditation Level 1' },
  'rose-meditation-level-2': { stem: 'rose-meditation-level-2', name: 'Rose Meditation Level 2' },
  'rose-meditation-level-3': { stem: 'rose-meditation-level-3', name: 'Rose Meditation Level 3' },
  // aura-level-1: no designed PDF yet; falls back to the live export flow.
};

/** Languages with a designed PDF, mapped to the file suffix. Others fall back. */
const LANG_SUFFIX: Record<string, string> = { en: '', es: '-es', pt: '-pt' };

export function getFinalPdfForSlug(
  slug: string | null | undefined,
  language: string = 'en',
): FinalPdf | null {
  if (!slug) return null;
  const manual = PDF_MANUALS[slug];
  if (!manual) return null;
  if (!(language in LANG_SUFFIX)) return null; // el/ru/uk → live export fallback
  const suffix = LANG_SUFFIX[language];
  const langTag = language === 'en' ? '' : ` (${language.toUpperCase()})`;
  return {
    url: `/manuals/pdf/${manual.stem}${suffix}.pdf`,
    downloadName: `${manual.name}${langTag}.pdf`,
  };
}
