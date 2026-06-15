/**
 * Canonical-JSON deserializer (T-020).
 *
 * The inverse of `serializer.ts`. Canonical input → engine-state.
 *
 * The boundary is symmetric: an editor that round-trips through both functions
 * sees identical canonical JSON. Tests live at `serializer.spec.ts`.
 *
 * In practice TipTap can accept canonical-form JSON directly via `editor.setContent(doc)`,
 * so this function is also the place where legacy v1 `{ html }` shapes get
 * converted to v2 canonical JSON during the migration window.
 */

import type { TiptapDoc, TiptapNode, TiptapMark } from '../types';

/**
 * Convert a legacy v1 `{ html }` string into a canonical doc.
 *
 * v1 blocks were stored as raw HTML, and many carry real STRUCTURE: `<ul>/<ol>`
 * lists (e.g. the manual Table of Contents), multiple `<p>` paragraphs, and
 * inline `<strong>/<em>/<a>` marks. The previous implementation stripped every
 * tag and collapsed the whole block into one run-on paragraph, so a TOC list
 * loaded in the editor as "Getting Ready to Start1. Grounding Cord2. Golden
 * Sun…" — and re-saving the block would then persist that flattened text over
 * the good html. This walks the parsed DOM and preserves list/paragraph
 * structure plus the allowed marks, so the editor shows and re-saves the block
 * faithfully.
 *
 * Runs in the browser (TextBlock is a client component). With no DOM available
 * (SSR / non-DOM tests) it falls back to the legacy tag-strip, so the function
 * is always safe to call.
 */
export function htmlToCanonicalParagraph(html: string): TiptapDoc {
  if (typeof DOMParser !== 'undefined') {
    try {
      const parsed = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
      const blocks = blocksFromContainer(parsed.body);
      if (blocks.length > 0) return { type: 'doc', content: blocks };
    } catch {
      // fall through to the tag-strip fallback below
    }
  }
  const text = html.replace(/<[^>]+>/g, '').trim();
  if (!text) return { type: 'doc', content: [{ type: 'paragraph' }] };
  return {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
  };
}

/** Block-level tags handled structurally (everything else is treated as inline). */
const BLOCK_TAGS = new Set(['P', 'DIV', 'SECTION', 'UL', 'OL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE']);

function collapseWs(text: string): string {
  return text.replace(/\s+/g, ' ');
}

function addMark(marks: TiptapMark[], mark: TiptapMark): TiptapMark[] {
  if (marks.some((m) => m.type === mark.type)) return marks;
  return [...marks, mark];
}

/** Inline subtree → canonical inline nodes (text + bold/italic/link marks, hardBreak). */
function inlineFromNode(node: Node, marks: TiptapMark[]): TiptapNode[] {
  if (node.nodeType === 3) {
    const text = collapseWs(node.textContent ?? '');
    if (!text) return [];
    const out: TiptapNode = { type: 'text', text };
    if (marks.length) out.marks = marks.slice();
    return [out];
  }
  if (node.nodeType !== 1) return [];
  const el = node as Element;
  const tag = el.tagName;
  if (tag === 'BR') return [{ type: 'hardBreak' }];
  let next = marks;
  if (tag === 'STRONG' || tag === 'B') next = addMark(marks, { type: 'bold' });
  else if (tag === 'EM' || tag === 'I') next = addMark(marks, { type: 'italic' });
  else if (tag === 'A') next = addMark(marks, { type: 'link', attrs: { href: el.getAttribute('href') ?? '#' } });
  const out: TiptapNode[] = [];
  el.childNodes.forEach((child) => out.push(...inlineFromNode(child, next)));
  return out;
}

/** Gather a container's direct inline content, skipping nested block children. */
function inlineFromContainer(el: Element): TiptapNode[] {
  const out: TiptapNode[] = [];
  el.childNodes.forEach((child) => {
    if (child.nodeType === 1 && BLOCK_TAGS.has((child as Element).tagName)) return;
    out.push(...inlineFromNode(child, []));
  });
  return out;
}

function listNode(el: Element, type: 'bulletList' | 'orderedList'): TiptapNode {
  const items: TiptapNode[] = [];
  el.childNodes.forEach((li) => {
    if (li.nodeType !== 1 || (li as Element).tagName !== 'LI') return;
    const liEl = li as Element;
    const inline = inlineFromContainer(liEl);
    const content: TiptapNode[] = [{ type: 'paragraph', content: inline.length ? inline : undefined }];
    // Preserve any nested lists inside the list item.
    liEl.childNodes.forEach((c) => {
      if (c.nodeType !== 1) return;
      const ct = (c as Element).tagName;
      if (ct === 'UL') content.push(listNode(c as Element, 'bulletList'));
      else if (ct === 'OL') content.push(listNode(c as Element, 'orderedList'));
    });
    items.push({ type: 'listItem', content });
  });
  return { type, content: items };
}

/** Walk a container's children into canonical block nodes, wrapping stray inline runs in paragraphs. */
function blocksFromContainer(el: Node): TiptapNode[] {
  const out: TiptapNode[] = [];
  let run: TiptapNode[] = [];
  const flush = () => {
    if (run.length) {
      out.push({ type: 'paragraph', content: run });
      run = [];
    }
  };
  el.childNodes.forEach((child) => {
    if (child.nodeType === 3) {
      const text = collapseWs(child.textContent ?? '');
      if (text.trim()) run.push({ type: 'text', text });
      return;
    }
    if (child.nodeType !== 1) return;
    const tag = (child as Element).tagName;
    if (tag === 'UL' || tag === 'OL') {
      flush();
      out.push(listNode(child as Element, tag === 'OL' ? 'orderedList' : 'bulletList'));
      return;
    }
    if (tag === 'BR') {
      run.push({ type: 'hardBreak' });
      return;
    }
    if (BLOCK_TAGS.has(tag)) {
      flush();
      // A wrapper that itself holds blocks (lists/paragraphs) is recursed; a
      // leaf block (p, heading) becomes one paragraph of its inline content.
      if ((child as Element).querySelector('ul, ol, p, div')) {
        blocksFromContainer(child).forEach((b) => out.push(b));
      } else {
        const inline = inlineFromContainer(child as Element);
        out.push({ type: 'paragraph', content: inline.length ? inline : undefined });
      }
      return;
    }
    // Inline element at container level (span, strong, em, a…).
    run.push(...inlineFromNode(child, []));
  });
  flush();
  return out;
}

/** Lift a canonical doc out of either a v2 `doc` field or a v1 `html` field. */
export function deserializeTextContent(
  content: { html?: string; doc?: TiptapDoc },
): TiptapDoc {
  if (content.doc) return content.doc;
  if (content.html) return htmlToCanonicalParagraph(content.html);
  return { type: 'doc', content: [{ type: 'paragraph' }] };
}

/** Render canonical doc back to plain HTML for the legacy export path. */
export function canonicalToHtml(doc: TiptapDoc): string {
  const out: string[] = [];
  function renderNode(node: import('../types').TiptapNode): void {
    switch (node.type) {
      case 'doc':
        node.content?.forEach(renderNode);
        return;
      case 'paragraph':
        out.push('<p>');
        node.content?.forEach(renderNode);
        out.push('</p>');
        return;
      case 'text': {
        let s = node.text ?? '';
        if (node.marks) {
          for (const m of node.marks) {
            if (m.type === 'bold') s = `<strong>${s}</strong>`;
            else if (m.type === 'italic') s = `<em>${s}</em>`;
            else if (m.type === 'link') {
              const href = (m.attrs?.href as string) ?? '#';
              s = `<a href="${href}">${s}</a>`;
            }
          }
        }
        out.push(s);
        return;
      }
      case 'bulletList':
        out.push('<ul>');
        node.content?.forEach(renderNode);
        out.push('</ul>');
        return;
      case 'orderedList':
        out.push('<ol>');
        node.content?.forEach(renderNode);
        out.push('</ol>');
        return;
      case 'listItem':
        out.push('<li>');
        node.content?.forEach(renderNode);
        out.push('</li>');
        return;
      case 'hardBreak':
        out.push('<br/>');
        return;
      default:
        // Unknown node type: skip rather than throw.
        return;
    }
  }
  renderNode({ type: 'doc', content: doc.content });
  return out.join('');
}
