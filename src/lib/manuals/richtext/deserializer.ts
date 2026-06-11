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

import type { TiptapDoc } from '../types';

/** Wrap a v1 plain-html string into a single-paragraph canonical doc. */
export function htmlToCanonicalParagraph(html: string): TiptapDoc {
  // Strip tags; preserve only the visible text. Marks are reconstructed at the
  // boundary because v1 `{ html }` can carry any browser-emitted markup
  // (execCommand → `<b>` on Chrome, `<strong>` on Safari, etc).
  const text = html.replace(/<[^>]+>/g, '').trim();
  if (!text) return { type: 'doc', content: [{ type: 'paragraph' }] };
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text }],
      },
    ],
  };
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
