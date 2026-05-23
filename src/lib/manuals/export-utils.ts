/**
 * Resolve a possibly root-relative asset path to an absolute URL.
 *
 * Manual exports (Print-as-PDF, Download HTML, Download Markdown) render
 * outside the app origin — inside a `blob:` document or a file saved to
 * disk — where a root-relative path like `/images/covers/rose-level-1.jpg`
 * has no host to resolve against and shows as a broken image. Absolutizing
 * the path against the page origin survives that move.
 *
 * Already-absolute URLs (`https://…`), protocol-relative URLs (`//…`), and
 * inline `data:` URIs pass through untouched.
 */
export function absolutizeSrc(src: string, origin: string): string {
  if (!origin || !src.startsWith('/') || src.startsWith('//')) return src;
  return `${origin.replace(/\/$/, '')}${src}`;
}
