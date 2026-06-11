import type { ReactNode } from 'react';

/**
 * Canonical school name. Use this single-line string in SEO metadata, prose,
 * and image alt text — anywhere search engines and screen readers read it.
 */
export const BRAND_NAME = 'International Aura and Dream School';

/**
 * Render the school name as a visual brand label, stacked on two lines:
 *
 *   International Aura
 *   and Dream School
 *
 * Only use this where the name appears as a prominent label (header, footer
 * brand line, hero headings) — not in SEO titles, body prose, or alt text,
 * which keep the full single-line {@link BRAND_NAME}.
 *
 * Accepts an optional (e.g. i18n-resolved) string and breaks it at " and ",
 * falling back to {@link BRAND_NAME}.
 */
export function stackBrandName(name?: string): ReactNode {
  const value = name ?? BRAND_NAME;
  const idx = value.indexOf(' and ');
  if (idx === -1) return value;
  return (
    <>
      {value.slice(0, idx)}
      <br />
      {value.slice(idx + 1)}
    </>
  );
}
