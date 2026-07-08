/**
 * Translation field surface (generalize-the-fix, ARCHITECTURE D-13).
 *
 * A manual block's `content` is a heterogeneous JSON shape (18 block types,
 * some carrying TipTap documents). Translation must touch ONLY the
 * human-readable text and leave every structural field untouched: ids, child
 * references (`left`/`right`/`children`), image `src`, colors, enums
 * (`variant`, `align`), numerals, page refs, proportions, `schema_version`,
 * heading `level`, and all TipTap `attrs`/`marks`.
 *
 * This module owns the single source of truth for "what is translatable in a
 * block", expressed per block type against the shapes in `types.ts`. Both the
 * extractor (pull strings out) and the stager (write translations back) drive
 * off it, so the two halves can never drift. It is pure (no IO, no client) and
 * therefore unit-testable and safe to import anywhere.
 *
 * Path scheme: each extracted string carries a JSON path (mixed string keys /
 * array indices) from the block's `content` root. `getByPath`/`setByPath`
 * resolve arbitrary depth, including into TipTap document trees.
 */

export type TextKind = 'plain' | 'html';

export interface FieldString {
  /** JSON path from the content root to this string. */
  path: (string | number)[];
  /** `html` carries inline markup the translator must preserve; `plain` is bare text. */
  kind: TextKind;
  /** The source text. */
  text: string;
}

/** Read a value at a mixed string/number path. Returns undefined on any miss. */
export function getByPath(obj: unknown, path: (string | number)[]): unknown {
  let cur: unknown = obj;
  for (const key of path) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string | number, unknown>)[key];
  }
  return cur;
}

/** Set a value at a mixed string/number path. No-op if the parent chain is missing. */
export function setByPath(obj: unknown, path: (string | number)[], value: unknown): void {
  let cur: unknown = obj;
  for (let i = 0; i < path.length - 1; i++) {
    if (cur == null || typeof cur !== 'object') return;
    cur = (cur as Record<string | number, unknown>)[path[i]];
  }
  if (cur == null || typeof cur !== 'object') return;
  (cur as Record<string | number, unknown>)[path[path.length - 1]] = value;
}

function pushIfStr(
  content: unknown,
  path: (string | number)[],
  kind: TextKind,
  out: FieldString[]
): void {
  const v = getByPath(content, path);
  if (typeof v === 'string' && v.trim() !== '') out.push({ path, kind, text: v });
}

/**
 * Collect every translatable text node inside a TipTap document rooted at
 * `basePath` (e.g. `['body']`, `['doc']`, `['prose']`). Only `text` leaves of
 * `type: 'text'` nodes are taken; structural nodes, marks, and attrs are left
 * alone, so bold/italic/links survive translation untouched.
 */
function collectTiptap(content: unknown, basePath: (string | number)[], out: FieldString[]): void {
  const doc = getByPath(content, basePath);
  if (doc == null || typeof doc !== 'object') return;
  const walk = (node: unknown, nodePath: (string | number)[]): void => {
    if (node == null || typeof node !== 'object') return;
    const n = node as { type?: string; text?: unknown; content?: unknown };
    if (n.type === 'text' && typeof n.text === 'string' && n.text !== '') {
      out.push({ path: [...nodePath, 'text'], kind: 'plain', text: n.text });
    }
    if (Array.isArray(n.content)) {
      n.content.forEach((ch, i) => walk(ch, [...nodePath, 'content', i]));
    }
  };
  const root = doc as { content?: unknown };
  if (Array.isArray(root.content)) {
    root.content.forEach((ch, i) => walk(ch, [...basePath, 'content', i]));
  }
}

/**
 * Extract every translatable string from a block's content, per block type.
 * The cases mirror the content interfaces in `types.ts` exactly. Anything not
 * listed here is structural and is never translated.
 */
export function collectStrings(blockType: string, content: unknown): FieldString[] {
  const out: FieldString[] = [];
  const c = content as Record<string, unknown>;
  switch (blockType) {
    case 'heading':
      pushIfStr(c, ['text'], 'plain', out);
      pushIfStr(c, ['eyebrow'], 'plain', out);
      break;
    case 'text':
      pushIfStr(c, ['html'], 'html', out);
      collectTiptap(c, ['doc'], out);
      break;
    case 'image':
      pushIfStr(c, ['alt'], 'plain', out);
      pushIfStr(c, ['caption'], 'plain', out);
      break;
    case 'image-row': {
      pushIfStr(c, ['caption'], 'plain', out);
      const images = c.images;
      if (Array.isArray(images)) images.forEach((_, i) => pushIfStr(c, ['images', i, 'alt'], 'plain', out));
      break;
    }
    case 'cover':
      for (const k of ['title', 'subtitle', 'author', 'illustrator', 'eyebrow', 'credits', 'edition', 'notice']) pushIfStr(c, [k], 'plain', out);
      break;
    case 'contents': {
      pushIfStr(c, ['eyebrow'], 'plain', out);
      const rows = c.rows;
      if (Array.isArray(rows)) rows.forEach((_, i) => pushIfStr(c, ['rows', i, 'title'], 'plain', out));
      break;
    }
    case 'callout':
      pushIfStr(c, ['title'], 'plain', out);
      collectTiptap(c, ['body'], out);
      break;
    case 'quote':
      collectTiptap(c, ['body'], out);
      pushIfStr(c, ['attribution'], 'plain', out);
      break;
    case 'numbered-exercise':
      pushIfStr(c, ['title'], 'plain', out);
      collectTiptap(c, ['body'], out);
      break;
    case 'captioned-figure':
      for (const k of ['alt', 'caption', 'credit']) pushIfStr(c, [k], 'plain', out);
      break;
    case 'spoken-instruction':
      pushIfStr(c, ['spoken'], 'plain', out);
      collectTiptap(c, ['prose'], out);
      break;
    case 'table': {
      const header = c.header;
      if (Array.isArray(header)) header.forEach((_, i) => pushIfStr(c, ['header', i], 'plain', out));
      const rows = c.rows;
      if (Array.isArray(rows)) {
        rows.forEach((row, i) => {
          if (Array.isArray(row)) row.forEach((_, j) => pushIfStr(c, ['rows', i, j], 'plain', out));
        });
      }
      pushIfStr(c, ['caption'], 'plain', out);
      break;
    }
    case 'footnote': {
      collectTiptap(c, ['body'], out);
      const notes = c.notes;
      if (notes && typeof notes === 'object') {
        Object.keys(notes as Record<string, unknown>).forEach((k) => pushIfStr(c, ['notes', k], 'plain', out));
      }
      break;
    }
    case 'glossary': {
      const entries = c.entries;
      if (Array.isArray(entries)) {
        entries.forEach((_, i) => {
          pushIfStr(c, ['entries', i, 'term'], 'plain', out);
          pushIfStr(c, ['entries', i, 'definition'], 'plain', out);
        });
      }
      break;
    }
    case 'section':
      pushIfStr(c, ['title'], 'plain', out);
      break;
    // two-column-section, page-break, divider: no translatable text (structure only).
    default:
      break;
  }
  return out;
}

/**
 * Return a deep clone of `content` with each `{path, text}` written in. Only the
 * given paths change; every other field (structure, refs, enums) is preserved.
 */
export function applyStrings(
  content: unknown,
  items: { path: (string | number)[]; text: string }[]
): unknown {
  const clone = structuredClone(content);
  for (const it of items) setByPath(clone, it.path, it.text);
  return clone;
}
