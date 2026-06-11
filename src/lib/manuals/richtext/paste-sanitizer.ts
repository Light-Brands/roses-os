/**
 * Paste sanitizer (T-022 + R2 + Kaze marks-closed rule).
 *
 * Accepts HTML or plain-text clipboard content and produces a string the
 * engine can insertContent() without inheriting Word/Notion/GoogleDocs
 * styling debris.
 *
 * Allow-list per the discipline rule:
 *   - Tags: p, strong, em, b, i, ul, ol, li, br, a (href only)
 *   - Marks: bold, italic, link
 *   - Drops style/class/id/data-* attributes and unknown tags
 *
 * Returns:
 *   string  — sanitized HTML ready to insertContent
 *   null    — no usable content, caller falls back to default paste behavior
 */

const ALLOWED_TAGS = new Set(['p', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li', 'br', 'a']);
const ALLOWED_HREF_PROTOCOLS = new Set(['http:', 'https:', 'mailto:']);

function isSafeUrl(href: string): boolean {
  try {
    const u = new URL(href, 'https://placeholder.invalid');
    return ALLOWED_HREF_PROTOCOLS.has(u.protocol);
  } catch {
    return false;
  }
}

function sanitizeHtmlNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent ?? '').replace(/[<>&]/g, (c) =>
      c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&amp;',
    );
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return '';
  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  if (!ALLOWED_TAGS.has(tag)) {
    // Strip the wrapper but recurse into children.
    let inner = '';
    el.childNodes.forEach((c) => {
      inner += sanitizeHtmlNode(c);
    });
    return inner;
  }
  if (tag === 'br') return '<br/>';
  if (tag === 'a') {
    const href = el.getAttribute('href') ?? '';
    if (!isSafeUrl(href)) {
      let inner = '';
      el.childNodes.forEach((c) => {
        inner += sanitizeHtmlNode(c);
      });
      return inner;
    }
    let inner = '';
    el.childNodes.forEach((c) => {
      inner += sanitizeHtmlNode(c);
    });
    return `<a href="${href.replace(/"/g, '&quot;')}">${inner}</a>`;
  }
  let inner = '';
  el.childNodes.forEach((c) => {
    inner += sanitizeHtmlNode(c);
  });
  return `<${tag}>${inner}</${tag}>`;
}

export function sanitizePaste(html: string, fallbackText: string): string | null {
  if (html && typeof DOMParser !== 'undefined') {
    const dom = new DOMParser().parseFromString(html, 'text/html');
    // Drop everything inside <head> and <script> + <style> tags.
    dom.querySelectorAll('script, style, head').forEach((n) => n.remove());
    const body = dom.body;
    if (!body) return fallbackText || null;
    let out = '';
    body.childNodes.forEach((c) => {
      out += sanitizeHtmlNode(c);
    });
    return out.trim() || (fallbackText || null);
  }
  if (fallbackText) {
    return escapeText(fallbackText);
  }
  return null;
}

function escapeText(s: string): string {
  return s
    .split(/\n\n+/)
    .map((para) =>
      `<p>${para
        .split(/\n/)
        .map((line) =>
          line.replace(/[<>&]/g, (c) =>
            c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&amp;',
          ),
        )
        .join('<br/>')}</p>`,
    )
    .join('');
}

/**
 * Node-side variant: same allow-list but operates on a string without DOMParser.
 * Used by paste-sanitizer.spec.ts under vitest/jest/tsx.
 */
export function sanitizePasteNode(html: string, fallbackText: string): string | null {
  // Naive regex-based sanitizer for test envs without DOMParser.
  if (!html) {
    if (!fallbackText) return null;
    return escapeText(fallbackText);
  }
  let s = html
    .replace(/<(script|style|head)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  // Strip attributes EXCEPT href on anchors.
  s = s.replace(/<a\s+([^>]*?)href=("([^"]*)"|'([^']*)')([^>]*)>/gi, (_m, _p1, _full, hQ, hS) => {
    const href = hQ || hS || '';
    if (!isSafeUrl(href)) return '';
    return `<a href="${href.replace(/"/g, '&quot;')}">`;
  });
  // For every other tag, drop attrs.
  s = s.replace(/<([a-z][a-z0-9]*)\s[^>]*>/gi, (_m, tag) => {
    const t = tag.toLowerCase();
    return ALLOWED_TAGS.has(t) ? `<${t}>` : '';
  });
  // Drop unknown tags entirely (open + close).
  s = s.replace(/<\/?([a-z][a-z0-9]*)>/gi, (m, tag) => {
    const t = tag.toLowerCase();
    return ALLOWED_TAGS.has(t) ? m.toLowerCase() : '';
  });
  return s.trim() || (fallbackText || null);
}
