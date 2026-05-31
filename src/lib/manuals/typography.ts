/**
 * Typography tokens (T-039).
 *
 * Single source for the manual editor's print typography. Consumed by the
 * editor canvas, the preview pane, and (post-M5) the Chromium adapter via the
 * shared print CSS.
 *
 * Tokens are exposed as both CSS custom property names + concrete values so
 * Tailwind utilities, inline styles, and print stylesheets can reference the
 * same vocabulary.
 */

export const typography = {
  fonts: {
    serif: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    eyebrow: "'Inter', -apple-system, sans-serif",
  },
  sizes: {
    cover_title: '32pt',
    h1: '26pt',
    h2: '20pt',
    h3: '16pt',
    body: '11pt',
    caption: '9pt',
    eyebrow: '8pt',
    footnote: '8pt',
  },
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    body: 1.7,
    heading: 1.25,
    caption: 1.4,
  },
  tracking: {
    eyebrow: '0.18em',
    smallcaps: '0.06em',
  },
  palette: {
    ink: '#3F3E3C',
    terracotta: '#9C6F6E',
    rose_hairline: '#E8C4BF',
    rose_tint: '#FDF4F2',
    plum: '#5E4A5F',
    mute_gold: '#B89360',
    paper: '#FFFFFF',
  },
} as const;

/** CSS custom properties block, ready to embed in a `<style>` or a print sheet. */
export function typographyCssVars(): string {
  return `
    :root {
      --type-font-serif: ${typography.fonts.serif};
      --type-font-sans: ${typography.fonts.sans};
      --type-font-eyebrow: ${typography.fonts.eyebrow};
      --type-size-cover-title: ${typography.sizes.cover_title};
      --type-size-h1: ${typography.sizes.h1};
      --type-size-h2: ${typography.sizes.h2};
      --type-size-h3: ${typography.sizes.h3};
      --type-size-body: ${typography.sizes.body};
      --type-size-caption: ${typography.sizes.caption};
      --type-size-eyebrow: ${typography.sizes.eyebrow};
      --type-size-footnote: ${typography.sizes.footnote};
      --type-line-body: ${typography.lineHeights.body};
      --type-line-heading: ${typography.lineHeights.heading};
      --type-line-caption: ${typography.lineHeights.caption};
      --type-track-eyebrow: ${typography.tracking.eyebrow};
      --type-track-smallcaps: ${typography.tracking.smallcaps};
      --type-ink: ${typography.palette.ink};
      --type-terracotta: ${typography.palette.terracotta};
      --type-rose-hairline: ${typography.palette.rose_hairline};
      --type-rose-tint: ${typography.palette.rose_tint};
      --type-plum: ${typography.palette.plum};
      --type-mute-gold: ${typography.palette.mute_gold};
      --type-paper: ${typography.palette.paper};
    }
  `.trim();
}

export type Typography = typeof typography;
