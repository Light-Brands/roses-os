/**
 * Map (manual slug, language) -> canonical Final Version PDF URL.
 *
 * The Final Version PDFs were professionally designed and carry layout the block
 * model cannot reproduce (phase pills, reference cards, colored chakra lists). We
 * serve them directly on download so the file matches the original — and we serve
 * the file in the reader's selected language (en/es/pt). These are the SAME prod
 * manuals the public teaching pages serve, under `public/resources/manuals/`. The
 * redundant `public/manuals/pdf/` staging copies were removed (a broken staging
 * set had leaked to prod); this is now the single source of truth.
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

/** Manuals with a designed PDF: level number + the display name used in the filename. */
const PDF_MANUALS: Record<string, { level: number; name: string }> = {
  'rose-meditation-level-1': { level: 1, name: 'Rose Meditation Level 1' },
  'rose-meditation-level-2': { level: 2, name: 'Rose Meditation Level 2' },
  'rose-meditation-level-3': { level: 3, name: 'Rose Meditation Level 3' },
  // aura-level-1: no designed PDF yet; falls back to the live export flow.
};

/** Languages with a designed PDF, mapped to the prod filename code. Others fall back. */
const LANG_CODE: Record<string, string> = { en: 'EN', es: 'ES', pt: 'PT', de: 'DE' };

export function getFinalPdfForSlug(
  slug: string | null | undefined,
  language: string = 'en',
): FinalPdf | null {
  if (!slug) return null;
  const manual = PDF_MANUALS[slug];
  if (!manual) return null;
  const code = LANG_CODE[language];
  if (!code) return null; // el/ru/uk → live export fallback
  const langTag = language === 'en' ? '' : ` (${language.toUpperCase()})`;
  return {
    url: `/resources/manuals/Rose-Level-${manual.level}-Manual-${code}.pdf`,
    downloadName: `${manual.name}${langTag}.pdf`,
  };
}
