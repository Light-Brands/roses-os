/**
 * Canonical-JSON serializer (T-019).
 *
 * TipTap's output shape is already a JSON tree close to our canonical shape.
 * The serializer's job is to:
 *   1. Drop any node/mark not in the closed allow-list.
 *   2. Normalize empty paragraphs to a stable shape so diffs are deterministic.
 *   3. Stamp the doc with a `type: 'doc'` root regardless of how it came in.
 *
 * Canonical shape lives in `types.ts::TiptapDoc`. Engine-side shape is
 * TipTap's own JSON tree.
 */

import type { TiptapDoc, TiptapNode, TiptapMark } from '../types';

const ALLOWED_NODES = new Set([
  'doc',
  'paragraph',
  'text',
  'bulletList',
  'orderedList',
  'listItem',
  'hardBreak',
]);

const ALLOWED_MARKS = new Set(['bold', 'italic', 'link']);

function filterMarks(marks?: TiptapMark[]): TiptapMark[] | undefined {
  if (!marks) return undefined;
  const out = marks.filter((m) => ALLOWED_MARKS.has(m.type));
  return out.length > 0 ? out : undefined;
}

function filterNode(node: TiptapNode): TiptapNode | null {
  if (!ALLOWED_NODES.has(node.type)) return null;
  const out: TiptapNode = { type: node.type };
  if (node.attrs) {
    // Drop non-link attrs from marked text to keep canonical shape tight.
    if (node.type === 'text' && node.text !== undefined) {
      out.text = node.text;
    }
  }
  if (node.text !== undefined) out.text = node.text;
  const marks = filterMarks(node.marks);
  if (marks) out.marks = marks;
  if (node.content) {
    const children = node.content
      .map((c) => filterNode(c))
      .filter((c): c is TiptapNode => c !== null);
    if (children.length > 0) out.content = children;
  }
  return out;
}

export function tiptapToCanonical(input: TiptapDoc): TiptapDoc {
  const filtered = filterNode({ type: 'doc', content: input.content }) ?? { type: 'doc' };
  return {
    type: 'doc',
    content: filtered.content ?? [],
  };
}

export function canonicalToTiptap(doc: TiptapDoc): TiptapDoc {
  return { type: 'doc', content: doc.content ?? [] };
}

/** Empty doc factory for use as a default. */
export function emptyDoc(): TiptapDoc {
  return { type: 'doc', content: [{ type: 'paragraph' }] };
}
