/**
 * Region classification for the manual reconstruction pipeline (spec 003 T-009b,
 * AC4 + AC6 + AC7; decision D-11). This is the ONLY place a model is called, and
 * the model never produces a coordinate and never receives one.
 *
 * Two layers:
 *   1. A deterministic rule layer (`classifyByRules`) decides the unambiguous
 *      majority with no model call: figures, the cover, the contents block,
 *      headings by font rank, eyebrows by small-caps-above-heading, and plain
 *      body paragraphs. On a Level 1 page this is most of the page.
 *   2. A model classifier (`ModelClassifier`) is consulted ONLY for the residue
 *      the rules leave undecided (a paragraph that might be a quote, a callout, a
 *      spoken instruction, a numbered exercise). Its request carries text, font
 *      size, and a region thumbnail. It carries NO box and NO coordinate field
 *      and no instruction to produce one (AC4); the deterministic side already
 *      owns every coordinate.
 *
 * Every label is cached by the region's deterministic content hash (AC6), so a
 * re-run over an unchanged page makes zero model calls and re-derives the same
 * labels. The run logs how many regions went to rules vs the model vs the cache
 * (AC7).
 */

import type { BlockRegion, FigureRegion, FillRegion, PageGeometry, Rect } from './extract-geometry';
import { regionContentHash } from './extract-geometry';
import { xyCut, flattenLayout, assignLeaves, type LayoutBox, type LayoutSlot } from './layout';

/** A block type from the 18-type registry (subset the pipeline emits). */
export type ClassBlockType =
  | 'cover'
  | 'contents'
  | 'heading'
  | 'text'
  | 'numbered-exercise'
  | 'spoken-instruction'
  | 'callout'
  | 'quote'
  | 'captioned-figure'
  | 'table'
  | 'glossary'
  | 'footnote';

export type DecidedBy = 'rule' | 'model' | 'cache' | 'undecided';

export interface ClassifiedRegion {
  ordinal: number;
  block_type: ClassBlockType;
  /** Partial content fields the layer produced; finalized + validated by
   *  map-to-blocks against the Zod schema (D-1). */
  content: Record<string, unknown>;
  decidedBy: DecidedBy;
  /** The deterministic cache key for this region. */
  cacheKey: string;
  /** Bounding rect of this block in PDF points (union of its folded members for a
   *  grouped block). Carried so a later pass can detect side-by-side columns. */
  rect?: Rect;
  /** When this region belongs to a multi-column band: the band id (shared by every
   *  member), this region's 0-based column index, and the band's column count.
   *  Derived from the XY-cut layout. */
  colGroup?: string;
  colIndex?: number;
  colCount?: number;
  /** Name of the rule that fired, when decidedBy === 'rule'. */
  rule?: string;
  /** True when this region needed the model but no model was available; the
   *  region falls back to a safe `text` label and is surfaced, never silently
   *  dropped. */
  modelUnavailable?: boolean;
}

/** The request handed to the model. NO box, NO coordinate field (AC4). The model
 *  understands size/position from the thumbnail and font size, not a number. */
export interface ClassifierRequest {
  text: string;
  fontSize: number;
  fontName: string;
  /** A `data:image/png;base64,...` thumbnail of just this region's rect, or null
   *  when the driver did not render one. */
  thumbnail: string | null;
}

/** The model's response: a block type plus content fields, NEVER a coordinate. */
export interface ClassifierResponse {
  block_type: ClassBlockType;
  content: Record<string, unknown>;
}

export interface ModelClassifier {
  classify(req: ClassifierRequest): Promise<ClassifierResponse>;
}

/** The coordinate keys AC4 forbids in the request. Exported so a test can assert
 *  the built request contains none of them. */
export const FORBIDDEN_REQUEST_KEYS = ['box', 'rect', 'bbox', 'x', 'y', 'x0', 'y0', 'x1', 'y1', 'coordinates', 'coordinate', 'position'];

/** Build the model request for a text region. By construction it has only text,
 *  fontSize, fontName, thumbnail; the assertion guards against drift. */
export function buildClassifierRequest(region: BlockRegion, thumbnail: string | null): ClassifierRequest {
  const req: ClassifierRequest = { text: region.text, fontSize: region.fontSize, fontName: region.fontName, thumbnail };
  for (const k of FORBIDDEN_REQUEST_KEYS) {
    if (k in (req as unknown as Record<string, unknown>)) {
      throw new Error(`classifier request must not carry a coordinate field: ${k}`);
    }
  }
  return req;
}

// ----- The per-region cache --------------------------------------------------

export interface CachedLabel {
  block_type: ClassBlockType;
  content: Record<string, unknown>;
  decidedBy: 'rule' | 'model';
  rule?: string;
}

export type RegionCache = Record<string, CachedLabel>;

// ----- Deterministic rule helpers -------------------------------------------

const PAGE_NUM_RE = /(\d{1,4})\s*$/;
const LEADING_NUMERAL_RE = /^(\d{1,3})[.)]?\s+/;
/** A TOC leading numeral, including a range ("3–5", "3 - 5") and the case where
 *  the page glued the numeral straight onto the title with no space ("3–5Aura").
 *  Scoped to the contents path only; prose ambiguity still uses the strict
 *  space-required `LEADING_NUMERAL_RE` so a number opening a sentence is not eaten. */
const TOC_NUMERAL_RE = /^(\d{1,3}(?:\s*[–—-]\s*\d{1,3})?)[.)]?\s*/;

/**
 * Collapse PDF letter-spacing (tracking) that pdf.js extracts as literal spaces
 * between glyphs: "C O N T E N T S" -> "CONTENTS". General over the corpus — any
 * tracked eyebrow/label/running-head reads as single-char tokens. A run of ≥3
 * single-character tokens (separated by single spaces) is a tracked word and is
 * joined; a word boundary the PDF kept as a wider gap (2+ spaces) is preserved,
 * so "A U R A  L I M I T S" -> "AURA LIMITS". Real words ("Rose Meditation") have
 * multi-char tokens and pass through untouched. The visual tracking is restored
 * by the renderer's letter-spacing style, never by literal spaces in the data.
 *
 * A word boundary the PDF kept as a wider gap (2+ spaces) is preserved. The
 * harder case is a multi-word tracked phrase the extractor flattened to single
 * spaces ("I N T E R N A T I O N A L  A U R A …"): the word breaks are
 * unrecoverable from the string alone, so a single-space run that would join into
 * a very long token (> MAX, i.e. clearly several words, not one) is left spaced
 * rather than fused into an unreadable wall. The common single-word eyebrow
 * ("CONTENTS", "PREPARATION") always collapses cleanly. */
const MAX_TRACKED_WORD = 16;
export function collapseLetterSpacing(text: string): string {
  return text
    .trim()
    .split(/\s{2,}/)
    .map((group) => {
      const toks = group.split(/\s+/);
      const allSingle = toks.length >= 3 && toks.every((t) => t.length === 1);
      return allSingle && toks.length <= MAX_TRACKED_WORD ? toks.join('') : group;
    })
    .join(' ');
}

/** Letter-spaced or plain small-caps eyebrow: strip whitespace, all uppercase,
 *  short. e.g. "C O N T E N T S", "PREPARATION", "INTERNATIONAL". */
export function looksLikeEyebrow(text: string, fontSize: number, bodySize: number): boolean {
  const oneLine = text.split('\n')[0];
  const stripped = oneLine.replace(/\s+/g, '');
  if (stripped.length === 0 || stripped.length > 28) return false;
  const hasLetter = /[A-Za-z]/.test(stripped);
  const isUpper = stripped === stripped.toUpperCase();
  return hasLetter && isUpper && fontSize <= bodySize + 0.5;
}

/** Distinct font sizes on the page, largest first. */
export function fontRanks(regions: BlockRegion[]): number[] {
  const sizes = [...new Set(regions.map((r) => Math.round(r.fontSize)))];
  return sizes.sort((a, b) => b - a);
}

/** The body font size: the size in which the MOST characters are set, not the
 *  most-common region. Weighting by character mass is robust on a page where
 *  every region has a distinct size (an exercise page is numeral 28pt + title
 *  15pt + paragraph 9pt + folio 7pt; counting regions ties at one each and would
 *  wrongly pick the folio, while the paragraph carries the most characters). */
export function bodyFontSize(regions: BlockRegion[]): number {
  const chars = new Map<number, number>();
  for (const r of regions) {
    const s = Math.round(r.fontSize);
    chars.set(s, (chars.get(s) ?? 0) + r.text.replace(/\s/g, '').length);
  }
  let best = 12;
  let bestN = -1;
  for (const [s, n] of [...chars.entries()].sort((a, b) => a[0] - b[0])) {
    if (n > bestN) {
      bestN = n;
      best = s;
    }
  }
  return best;
}

/** A folio / page-number footer: a short purely-numeric region near the page
 *  bottom. e.g. "6", "1 0" at y near the foot. Dropped, never a content block. */
export function isFolio(region: BlockRegion, pageHeightPt: number): boolean {
  const stripped = region.text.replace(/\s+/g, '');
  if (!/^\d{1,4}$/.test(stripped)) return false;
  return region.rect[1] > pageHeightPt * 0.9;
}

/** A running header/footer: a short, sub-body-size, single-line region pinned in
 *  the extreme top (<8%) or bottom (>92%) band — the page's running title/folio
 *  furniture, not content. Dropped, never a block. The bottom threshold is 0.92
 *  (not the 0.90 the contents-row filter uses) precisely so a body-size pull-quote
 *  sitting at ~0.90 of the page height is NOT mistaken for footer furniture. */
export function isRunningHeadFoot(region: BlockRegion, bodySize: number, pageHeightPt: number): boolean {
  const stripped = region.text.replace(/\s+/g, '');
  if (stripped.length === 0 || stripped.length > 40) return false;
  if (region.lines.length > 1) return false;
  if (region.fontSize >= bodySize) return false;
  const inFoot = region.rect[1] > pageHeightPt * 0.92;
  const inHead = region.rect[3] < pageHeightPt * 0.08;
  return inFoot || inHead;
}

/** A standalone exercise numeral: a short numeral set markedly larger than body
 *  (the 28pt "1" that opens an exercise), not a folio. */
export function isExerciseNumeral(region: BlockRegion, bodySize: number): boolean {
  const stripped = region.text.replace(/\s+/g, '');
  return /^\d{1,3}$/.test(stripped) && region.fontSize >= bodySize + 8;
}

/** Build a minimal TipTap doc from text lines (one paragraph per non-empty line). */
function toDoc(lines: string[]): Record<string, unknown> {
  const content = lines
    .map((l) => l.trim())
    .filter(Boolean)
    .map((t) => ({ type: 'paragraph', content: [{ type: 'text', text: t }] }));
  return { type: 'doc', content };
}

const PURE_NUM_RE = /^\d{1,4}$/;

/** Parse a contents page's text regions into rows. A row carries a page number,
 *  inline at the end of the line OR (when the PDF set the page number as a
 *  separate right-aligned run) in the next pure-number line, which is consumed.
 *  The big title/eyebrow and the running header/footer bands are excluded, and a
 *  line with no page number at all is not a row (so a footer note never becomes
 *  one). Returns null when the page is not contents-shaped. */
export interface ContentsParse {
  rows: Array<{ numeral?: string; title: string; page?: string }>;
  /** The region ordinals that contributed a TOC row (including a separate
   *  right-aligned page-number region that was consumed into a row). These — and
   *  only these — fold into the contents block; the page title, subtitle, and any
   *  footer pull-quote are NOT here and classify on their own. */
  rowOrdinals: Set<number>;
}

export function parseContentsRows(regions: BlockRegion[], bodySize: number, pageHeightPt: number): ContentsParse | null {
  // Collect candidate lines in reading order, excluding the big title (well above
  // body size) and the footer/header bands (a running "Rose Meditation - Level 1"
  // footer ends in a digit and would otherwise read as a bogus row). Each line
  // carries its source region ordinal so the caller can fold exactly the row
  // regions and leave the rest of the page to the per-region rules.
  const lines: Array<{ text: string; ord: number }> = [];
  for (const r of regions) {
    if (r.fontSize > bodySize + 6) continue;
    if (r.rect[1] > pageHeightPt * 0.9) continue; // footer band
    if (r.rect[3] < pageHeightPt * 0.08) continue; // header band
    for (const l of r.lines) lines.push({ text: l.text.trim(), ord: r.ordinal });
  }
  const rows: Array<{ numeral?: string; title: string; page?: string }> = [];
  const rowOrdinals = new Set<number>();
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].text;
    if (!line || PURE_NUM_RE.test(line)) continue; // blank, or a page-number fragment already consumed
    let page: string | undefined;
    let consumedNextOrd: number | undefined;
    const pageM = line.match(PAGE_NUM_RE);
    if (pageM && /\d\s*$/.test(line)) {
      page = pageM[1];
      line = line.slice(0, pageM.index).trim();
    } else {
      // No inline page: a separate right-aligned page-number run follows.
      const next = lines[i + 1];
      if (next && PURE_NUM_RE.test(next.text)) {
        page = next.text;
        consumedNextOrd = next.ord;
        lines[i + 1].text = ''; // consume it
      }
    }
    if (!page) continue; // a line with no page number is not a TOC row (drops footer notes)
    line = line.replace(/[.·\s]+$/, '').trim(); // strip trailing dot/middot leaders
    const numM = line.match(TOC_NUMERAL_RE);
    let numeral: string | undefined;
    if (numM) {
      numeral = numM[1].replace(/\s+/g, ''); // normalize "3 – 5" -> "3–5"
      line = line.slice(numM[0].length).trim();
    }
    if (line.length === 0) continue;
    rows.push({ ...(numeral ? { numeral } : {}), title: line, page });
    rowOrdinals.add(lines[i].ord);
    if (consumedNextOrd !== undefined) rowOrdinals.add(consumedNextOrd);
  }
  return rows.length >= 3 ? { rows, rowOrdinals } : null;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string));
}

/**
 * Split a region's lines into structural blocks — paragraphs and bullet lists —
 * from the geometry, never from punctuation. The tightest inter-line gap is the
 * normal leading; a gap notably larger is a paragraph break (a "punto y aparte"),
 * so a region holding two real paragraphs (the page-4 grounding-cord body) splits
 * at the break the canon shows, while a wrapped single paragraph (the page-2
 * pull-quote, uniform gap) stays ONE paragraph. A run of ≥2 consecutive lines
 * indented past the region's base margin is a BULLET LIST (the page-6 "Cut the
 * old cord / Create a new cord / …") — pdf.js dropped the bullet glyph, but the
 * indentation is in the geometry and the renderer restores the marker. Each
 * indented line is one item (single-line bullets).
 */
export type RegionBlock = { kind: 'p'; text: string } | { kind: 'ul'; items: string[] };

export function regionStructure(lines: BlockRegion['lines']): RegionBlock[] {
  const ls = lines.filter((l) => l.text.trim().length > 0);
  if (ls.length === 0) return [];
  const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
  if (ls.length === 1) return [{ kind: 'p', text: norm(ls[0].text) }];
  const base = Math.min(...ls.map((l) => l.rect[0]));
  const indented = (l: BlockRegion['lines'][number]) => l.rect[0] > base + 6;
  const gaps: number[] = [];
  for (let i = 1; i < ls.length; i++) gaps.push(ls[i].rect[1] - ls[i - 1].rect[3]);
  const baseline = Math.min(...gaps); // tightest line gap = intra-paragraph leading
  // Segment: a new segment starts on an indent-class change OR a paragraph break.
  const segs: Array<BlockRegion['lines']> = [];
  let cur: BlockRegion['lines'] = [ls[0]];
  for (let i = 1; i < ls.length; i++) {
    const classChanged = indented(ls[i]) !== indented(ls[i - 1]);
    const paraBreak = gaps[i - 1] > baseline * 1.5 && gaps[i - 1] - baseline > 2;
    if (classChanged || paraBreak) { segs.push(cur); cur = [ls[i]]; }
    else cur.push(ls[i]);
  }
  segs.push(cur);
  return segs.map((seg): RegionBlock =>
    indented(seg[0]) && seg.length >= 2
      ? { kind: 'ul', items: seg.map((l) => norm(l.text)) }
      : { kind: 'p', text: norm(seg.map((l) => l.text).join(' ')) },
  );
}

function blockToHtml(b: RegionBlock): string {
  return b.kind === 'ul'
    ? `<ul>${b.items.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ul>`
    : `<p>${escapeHtml(b.text)}</p>`;
}

/** A body region rendered as HTML for the `text` block — paragraphs and bullet
 *  lists as the line gaps and indentation reveal. */
function bodyToHtml(region: BlockRegion): string {
  return regionStructure(region.lines).map(blockToHtml).join('');
}

/** A tiptap doc from a region: paragraph + bulletList nodes (TipTap-native). */
function docFromRegion(region: BlockRegion): Record<string, unknown> {
  const content = regionStructure(region.lines).map((b) =>
    b.kind === 'ul'
      ? { type: 'bulletList', content: b.items.map((t) => ({ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: t }] }] })) }
      : { type: 'paragraph', content: [{ type: 'text', text: b.text }] },
  );
  return { type: 'doc', content };
}

/** The tightest tint box that contains a region's rect (with a small tolerance for
 *  padding/rounding), or null. A region inside a tint box is a callout/aside. */
function containingFill(rect: Rect, fills: FillRegion[]): FillRegion | null {
  const T = 4;
  let best: FillRegion | null = null;
  let bestArea = Infinity;
  for (const f of fills) {
    const inside = f.rect[0] - T <= rect[0] && rect[2] <= f.rect[2] + T && f.rect[1] - T <= rect[1] && rect[3] <= f.rect[3] + T;
    if (!inside) continue;
    const area = (f.rect[2] - f.rect[0]) * (f.rect[3] - f.rect[1]);
    if (area < bestArea) { bestArea = area; best = f; }
  }
  return best;
}

// ----- D-19 table detection (spec 004 T-005) --------------------------------

/** A horizontal rule fill: thin in y, wide in x. These are a table's row dividers
 *  (the L3 grid draws filled rectangles, not strokes — the engine captures them as
 *  fills). Thin = height <= 3.5pt; wide = at least 25% of the page width. */
function isHorizontalRule(f: FillRegion, pageWidthPt: number): boolean {
  const h = f.rect[3] - f.rect[1];
  const w = f.rect[2] - f.rect[0];
  return h > 0 && h <= 3.5 && w >= pageWidthPt * 0.25;
}

/** A vertical rule fill: thin in x, tall in y. These are a table's cell walls (the
 *  x=322 wall on L3 page 9). Thin = width <= 3.5pt; tall = >= 12pt. */
function isVerticalRule(f: FillRegion): boolean {
  const h = f.rect[3] - f.rect[1];
  const w = f.rect[2] - f.rect[0];
  return w > 0 && w <= 3.5 && h >= 12;
}

export interface TableDetection {
  /** Anchor ordinal: the table block sits at the first cell region's position. */
  anchorOrd: number;
  content: Record<string, unknown>;
  rect: Rect;
  /** Every region ordinal the table consumed (folded into it). */
  members: number[];
}

/**
 * Deterministic D-19 table rule: at least three evenly spaced horizontal fill-rects
 * plus at least two stable x-columns make a `table`. Columns come from vertical rule
 * fills (cell walls) when present, else from clustering the cell text's left edges.
 * Rows are the bands the horizontal rules cut. The cell text is read straight from
 * the geometry; the model is never consulted. Returns null when the page carries no
 * table-shaped grid (the common case), so this never fires on a normal page.
 */
export function detectTable(geometry: PageGeometry): TableDetection | null {
  // Two real geometries carry a table in this corpus:
  //  (a) >=3 evenly spaced horizontal rule fills (the original D-19 probe shape), or
  //  (b) ONE container tint box holding text laid out in a >=2 column x >=3 row grid
  //      (the actual L3 page-9 "label / action / chakra" grid: a single fill box, the
  //      cell walls are the gaps between aligned text columns, not drawn rules).
  // Try the rule-grid first, then the gridded-text-in-a-box. Both honor D-19's
  // ">=3 evenly spaced rows + >=2 stable x-columns" — only the row evidence differs
  // (drawn rules vs aligned text baselines). Generalized per ARCHITECTURE D-13.
  return detectTableByRules(geometry) ?? detectTableByGrid(geometry);
}

function detectTableByRules(geometry: PageGeometry): TableDetection | null {
  const hrules = geometry.fills
    .filter((f) => isHorizontalRule(f, geometry.widthPt))
    .sort((a, b) => a.rect[1] - b.rect[1]);
  if (hrules.length < 3) return null;

  // Even spacing: consecutive pitches within 40% of the median pitch.
  const pitches: number[] = [];
  for (let i = 1; i < hrules.length; i++) pitches.push(hrules[i].rect[1] - hrules[i - 1].rect[1]);
  const sorted = [...pitches].sort((a, b) => a - b);
  const medPitch = sorted[sorted.length >> 1];
  if (medPitch <= 0) return null;
  const even = pitches.every((p) => Math.abs(p - medPitch) <= medPitch * 0.4);
  if (!even) return null;

  // Table bounds: x from the rules, y from first to last rule (extended by a pitch
  // so text in the top/bottom bands, outside the rule strokes, is still captured).
  const tx0 = Math.min(...hrules.map((f) => f.rect[0]));
  const tx1 = Math.max(...hrules.map((f) => f.rect[2]));
  const topY = hrules[0].rect[1] - medPitch;
  const botY = hrules[hrules.length - 1].rect[3] + medPitch;

  const inTable = (r: BlockRegion): boolean => {
    const cx = (r.rect[0] + r.rect[2]) / 2;
    const cy = (r.rect[1] + r.rect[3]) / 2;
    return cx >= tx0 - 4 && cx <= tx1 + 4 && cy >= topY && cy <= botY;
  };
  const cells = geometry.textRegions.filter(inTable);
  if (cells.length < 2) return null;

  // Columns: prefer real vertical cell walls; else cluster cell left-edges.
  const walls = geometry.fills
    .filter((f) => isVerticalRule(f) && f.rect[0] >= tx0 - 4 && f.rect[2] <= tx1 + 4)
    .map((f) => (f.rect[0] + f.rect[2]) / 2)
    .sort((a, b) => a - b);
  let boundaries: number[];
  if (walls.length >= 1) {
    boundaries = walls; // interior walls split the x-span into columns
  } else {
    // cluster left-edges: a gap > 24pt opens a new column; boundary at the midpoint.
    const lefts = [...new Set(cells.map((c) => Math.round(c.rect[0])))].sort((a, b) => a - b);
    const clusters: number[][] = [];
    for (const x of lefts) {
      const last = clusters[clusters.length - 1];
      if (last && x - last[last.length - 1] <= 24) last.push(x);
      else clusters.push([x]);
    }
    if (clusters.length < 2) return null;
    boundaries = [];
    for (let i = 1; i < clusters.length; i++) {
      const prev = clusters[i - 1];
      const cur = clusters[i];
      boundaries.push((prev[prev.length - 1] + cur[0]) / 2);
    }
  }
  const colCount = boundaries.length + 1;
  if (colCount < 2) return null;
  const colOf = (r: BlockRegion): number => {
    const cx = (r.rect[0] + r.rect[2]) / 2;
    let c = 0;
    for (const b of boundaries) { if (cx > b) c++; else break; }
    return c;
  };

  // Row bands: virtual boundaries at topY, each rule's y, then botY. A cell's band
  // is the interval containing its y-center. Drop empty bands.
  const rowBounds = [topY, ...hrules.map((f) => (f.rect[1] + f.rect[3]) / 2), botY];
  const bandOf = (r: BlockRegion): number => {
    const cy = (r.rect[1] + r.rect[3]) / 2;
    for (let i = 1; i < rowBounds.length; i++) if (cy <= rowBounds[i]) return i - 1;
    return rowBounds.length - 2;
  };

  // Assemble band -> column -> text, in reading order within a cell.
  const grid = new Map<number, Map<number, BlockRegion[]>>();
  for (const r of cells) {
    const band = bandOf(r);
    const col = colOf(r);
    if (!grid.has(band)) grid.set(band, new Map());
    const row = grid.get(band)!;
    if (!row.has(col)) row.set(col, []);
    row.get(col)!.push(r);
  }
  const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
  const cellText = (regs: BlockRegion[] | undefined): string =>
    (regs ?? []).sort((a, b) => a.ordinal - b.ordinal).map((r) => norm(r.text)).join(' ').trim();

  const bands = [...grid.keys()].sort((a, b) => a - b);
  const rows: string[][] = bands.map((band) => {
    const row = grid.get(band)!;
    return Array.from({ length: colCount }, (_, c) => cellText(row.get(c)));
  });
  if (rows.length < 2) return null; // a single band is not a table

  const members = cells.map((c) => c.ordinal).sort((a, b) => a - b);
  const content: Record<string, unknown> = { schema_version: 2, header: [], rows };
  return {
    anchorOrd: members[0],
    content,
    rect: [tx0, hrules[0].rect[1], tx1, hrules[hrules.length - 1].rect[3]],
    members,
  };
}

/** Cluster sorted numbers into groups; a gap larger than `gap` opens a new group.
 *  Returns the group means in ascending order. */
function clusterMeans(values: number[], gap: number): number[] {
  if (!values.length) return [];
  const sorted = [...values].sort((a, b) => a - b);
  const groups: number[][] = [[sorted[0]]];
  for (let i = 1; i < sorted.length; i++) {
    const g = groups[groups.length - 1];
    if (sorted[i] - g[g.length - 1] <= gap) g.push(sorted[i]);
    else groups.push([sorted[i]]);
  }
  return groups.map((g) => g.reduce((a, b) => a + b, 0) / g.length);
}

/**
 * Detect a table from gridded text inside a container fill box (the real L3 page-9
 * shape). A table is: one wide, tall tint box; text whose LINES inside it form >=2
 * stable x-columns (by line left edge) AND >=3 row bands (by line y-center) with a
 * roughly even pitch. Cells are read line-by-line so a single multi-line column
 * region (one region holding five stacked labels) contributes one line per row.
 * Returns null when no such grid exists — a plain callout tint box (one column) and
 * a normal page (no wide box) both fall through, so this never over-fires.
 */
function detectTableByGrid(geometry: PageGeometry): TableDetection | null {
  const boxes = geometry.fills
    .filter((f) => (f.rect[2] - f.rect[0]) >= geometry.widthPt * 0.4 && (f.rect[3] - f.rect[1]) >= 24)
    .sort((a, b) => (b.rect[2] - b.rect[0]) * (b.rect[3] - b.rect[1]) - (a.rect[2] - a.rect[0]) * (a.rect[3] - a.rect[1]));
  if (!boxes.length) return null;
  const [bx0, by0, bx1, by1] = boxes[0].rect;

  // Collect the lines whose center sits inside the box.
  interface Cell { x0: number; yc: number; text: string; ord: number }
  const lines: Cell[] = [];
  const memberOrds = new Set<number>();
  for (const r of geometry.textRegions) {
    for (const ln of r.lines) {
      const cx = (ln.rect[0] + ln.rect[2]) / 2;
      const cy = (ln.rect[1] + ln.rect[3]) / 2;
      const t = ln.text.trim();
      if (!t) continue;
      if (cx >= bx0 - 4 && cx <= bx1 + 4 && cy >= by0 - 4 && cy <= by1 + 4) {
        lines.push({ x0: ln.rect[0], yc: cy, text: t, ord: r.ordinal });
        memberOrds.add(r.ordinal);
      }
    }
  }
  if (lines.length < 4) return null;

  // Columns from line left-edges; rows from line y-centers.
  const colCenters = clusterMeans(lines.map((l) => l.x0), 40);
  if (colCenters.length < 2) return null;
  const rowCenters = clusterMeans(lines.map((l) => l.yc), 10);
  if (rowCenters.length < 3) return null;

  // Even pitch: row spacings within 50% of the median (a real grid is regular).
  const pitches: number[] = [];
  for (let i = 1; i < rowCenters.length; i++) pitches.push(rowCenters[i] - rowCenters[i - 1]);
  const medPitch = [...pitches].sort((a, b) => a - b)[pitches.length >> 1];
  if (!(medPitch > 0) || !pitches.every((p) => Math.abs(p - medPitch) <= medPitch * 0.5)) return null;

  const nearestIdx = (v: number, centers: number[]): number => {
    let bi = 0, bd = Infinity;
    centers.forEach((c, i) => { const d = Math.abs(c - v); if (d < bd) { bd = d; bi = i; } });
    return bi;
  };
  const grid: string[][] = rowCenters.map(() => colCenters.map(() => ''));
  for (const l of lines) {
    const ri = nearestIdx(l.yc, rowCenters);
    const ci = nearestIdx(l.x0, colCenters);
    grid[ri][ci] = grid[ri][ci] ? `${grid[ri][ci]} ${l.text}` : l.text;
  }
  // A table needs at least two populated columns across the rows.
  const colsUsed = colCenters.map((_, c) => grid.some((row) => row[c] !== '')).filter(Boolean).length;
  if (colsUsed < 2) return null;

  const members = [...memberOrds].sort((a, b) => a - b);
  return {
    anchorOrd: members[0],
    content: { schema_version: 2, header: [], rows: grid },
    rect: [bx0, by0, bx1, by1],
    members,
  };
}

// ----- Page-level rule classification ---------------------------------------

export interface PageContext {
  /** 1-based page index in the manual. */
  pageIndex: number;
  /** True for the cover page (largest-centered-top figure + dominant title). */
  isCoverPage: boolean;
}

interface RuleOutcome {
  block_type: ClassBlockType;
  content: Record<string, unknown>;
  rule: string;
  /** Bounding rect of the block; set for grouped blocks (exercise) so the
   *  column detector sees the whole span, not just the anchor region. */
  rect?: Rect;
}

/** Bounding box of a set of rects. */
function unionOf(rects: Rect[]): Rect {
  return [
    Math.min(...rects.map((r) => r[0])),
    Math.min(...rects.map((r) => r[1])),
    Math.max(...rects.map((r) => r[2])),
    Math.max(...rects.map((r) => r[3])),
  ];
}

/**
 * Classify the page's text regions by the deterministic rules. Returns a map from
 * region ordinal to a rule outcome for every region the rules can decide; regions
 * absent from the map are the residue for the model. Figures are handled
 * separately by `classifyFigures`.
 */
export function classifyByRules(geometry: PageGeometry, ctx: PageContext, slotKeyOf?: (ordinal: number) => string): Map<number, RuleOutcome> {
  const slotKey = slotKeyOf ?? (() => 'all');
  const regions = geometry.textRegions;
  const out = new Map<number, RuleOutcome>();
  if (regions.length === 0) return out;
  const ranks = fontRanks(regions);
  const bodySize = bodyFontSize(regions);
  const topSize = ranks[0] ?? bodySize;

  // --- contents page: detect once at page level ---
  const contentsParse = parseContentsRows(regions, bodySize, geometry.heightPt);
  const isContentsPage = !!contentsParse;

  // --- cover page ---
  if (ctx.isCoverPage) {
    // eyebrow = a small all-caps line above the title; title = the largest text;
    // subtitle = the next size below. Every OTHER region is a centered credit /
    // edition / disclaimer line — fold them all into the cover and carry each with
    // its real font size so the renderer reproduces the canon's size hierarchy
    // (the old code spilled them as left-aligned same-size text blocks).
    const sorted = [...regions].sort((a, b) => b.fontSize - a.fontSize);
    const titleRegion = sorted[0];
    const title = titleRegion ? titleRegion.text.replace(/\n/g, ' ').trim() : '';
    const eyebrowRegion = regions.find((r) => looksLikeEyebrow(r.text, r.fontSize, bodySize) && r.ordinal < (titleRegion?.ordinal ?? 0));
    const subtitleRegion = sorted.find((r) => r !== titleRegion && r !== eyebrowRegion && r.fontSize < topSize && !looksLikeEyebrow(r.text, r.fontSize, bodySize));
    const content: Record<string, unknown> = { schema_version: 2, title, align: 'center' };
    if (eyebrowRegion) content.eyebrow = collapseLetterSpacing(eyebrowRegion.text);
    if (subtitleRegion) content.subtitle = subtitleRegion.text.replace(/\n/g, ' ').trim();
    const used = new Set<number>([titleRegion?.ordinal, eyebrowRegion?.ordinal, subtitleRegion?.ordinal].filter((o): o is number => o !== undefined));
    const credits = regions
      .filter((r) => !used.has(r.ordinal))
      .sort((a, b) => a.ordinal - b.ordinal)
      .map((r) => ({ text: collapseLetterSpacing(r.lines.map((l) => l.text.trim()).filter(Boolean).join(' ')), sizePt: r.fontSize }))
      .filter((c) => c.text.length > 0);
    if (credits.length) content.credits = credits;
    if (titleRegion) out.set(titleRegion.ordinal, { block_type: 'cover', content, rule: 'cover-largest-centered-top' });
    // Fold every non-title region into the cover (do not emit them as own blocks).
    for (const r of regions) {
      if (r.ordinal === titleRegion?.ordinal) continue;
      out.set(r.ordinal, { block_type: 'cover', content: { __folded: true }, rule: 'cover-fold' });
    }
    return out;
  }

  const consumed = new Set<number>();

  // --- contents block: emit ONE block carrying the rows, and fold ONLY the row
  // regions into it. The page title, subtitle, a decorative figure, and any
  // footer pull-quote are NOT part of the contents and are deliberately left for
  // the per-region rules below — the old "contents page swallows the whole page"
  // rule silently dropped them. Generalize: the contents is the rows, not the page. ---
  if (isContentsPage && contentsParse) {
    const { rows, rowOrdinals } = contentsParse;
    const content: Record<string, unknown> = { schema_version: 2, rows };
    // Anchor at the first row region so the block sits in the rows' position; the
    // page eyebrow above the title is handled by the eyebrow-above-heading rule.
    const anchorOrd = Math.min(...rowOrdinals);
    out.set(anchorOrd, { block_type: 'contents', content, rule: 'contents-rows-by-column-x' });
    consumed.add(anchorOrd);
    for (const ord of rowOrdinals) {
      if (ord === anchorOrd) continue;
      out.set(ord, { block_type: 'contents', content: { __folded: true }, rule: 'contents-fold' });
      consumed.add(ord);
    }
  }

  // --- running headers/footers: drop, never a content block ---
  for (const r of regions) {
    if (consumed.has(r.ordinal)) continue;
    if (isRunningHeadFoot(r, bodySize, geometry.heightPt)) {
      out.set(r.ordinal, { block_type: 'text', content: { __drop: true }, rule: 'running-head-foot-drop' });
      consumed.add(r.ordinal);
    }
  }

  // --- folio footers: drop, never a content block ---
  for (const r of regions) {
    if (consumed.has(r.ordinal)) continue;
    if (isFolio(r, geometry.heightPt)) {
      out.set(r.ordinal, { block_type: 'text', content: { __drop: true }, rule: 'folio-footer-drop' });
      consumed.add(r.ordinal);
    }
  }

  // --- D-19 table: a grid of >=3 evenly spaced horizontal rules + >=2 columns is
  // ONE table block; its cell regions fold into it. Detected before exercises so a
  // leading numeral in a table's first column is never mistaken for an exercise. ---
  if (!isContentsPage) {
    const table = detectTable(geometry);
    if (table) {
      out.set(table.anchorOrd, { block_type: 'table', content: table.content, rule: 'table-grid-d19', rect: table.rect });
      consumed.add(table.anchorOrd);
      for (const ord of table.members) {
        if (ord === table.anchorOrd) continue;
        out.set(ord, { block_type: 'table', content: { __folded: true }, rule: 'table-fold' });
        consumed.add(ord);
      }
    }
  }

  // --- numbered exercises: numeral + title + body, grouped deterministically ---
  // A big standalone numeral opens an exercise; the next short medium-font line is
  // its title; the body runs (sub-headings + paragraphs) until the next numeral.
  const ordered = [...regions].sort((a, b) => a.ordinal - b.ordinal);
  for (let i = 0; i < ordered.length; i++) {
    const num = ordered[i];
    if (consumed.has(num.ordinal) || !isExerciseNumeral(num, bodySize)) continue;
    const numeral = num.text.replace(/\s+/g, '');
    consumed.add(num.ordinal);
    const memberRects: Rect[] = [num.rect];
    let title: string | undefined;
    const bodyLines: string[] = [];
    const numSlot = slotKey(num.ordinal);
    let j = i + 1;
    // optional title: the immediately following short line clearly above body size,
    // in the SAME layout slot (an exercise never crosses a column or a figure).
    if (j < ordered.length && slotKey(ordered[j].ordinal) === numSlot && !isExerciseNumeral(ordered[j], bodySize) && !isFolio(ordered[j], geometry.heightPt) && ordered[j].fontSize > bodySize + 1.5 && ordered[j].lines.length <= 2) {
      title = ordered[j].text.replace(/\n/g, ' ').trim();
      memberRects.push(ordered[j].rect);
      out.set(ordered[j].ordinal, { block_type: 'numbered-exercise', content: { __folded: true }, rule: 'exercise-fold' });
      consumed.add(ordered[j].ordinal);
      j += 1;
    }
    // body: regions in the same slot until the next numeral (folios dropped). The
    // slot bound stops an exercise from swallowing a neighbouring column's text.
    for (; j < ordered.length; j++) {
      const r = ordered[j];
      if (slotKey(r.ordinal) !== numSlot) break;
      if (isExerciseNumeral(r, bodySize)) break;
      if (isFolio(r, geometry.heightPt)) { out.set(r.ordinal, { block_type: 'text', content: { __drop: true }, rule: 'folio-footer-drop' }); consumed.add(r.ordinal); continue; }
      for (const l of r.lines) bodyLines.push(l.text);
      memberRects.push(r.rect);
      out.set(r.ordinal, { block_type: 'numbered-exercise', content: { __folded: true }, rule: 'exercise-fold' });
      consumed.add(r.ordinal);
    }
    const content: Record<string, unknown> = { schema_version: 2, numeral, body: toDoc(bodyLines) };
    if (title) content.title = title;
    out.set(num.ordinal, { block_type: 'numbered-exercise', content, rule: 'numbered-exercise-numeral-title-body', rect: unionOf(memberRects) });
    // fold the consumed title/body regions
    i = j - 1;
  }

  // --- per-region rules on the remaining (non-folio, non-exercise) regions ---
  for (const r of regions) {
    if (consumed.has(r.ordinal)) continue;

    // A region sitting inside a tint box is a callout/aside — the page-2 pull-quote
    // sits in a pale warm box. The box is real fill geometry, so this is a general
    // rule, not a page patch: any text inside a content tint box reads as a callout.
    const fill = containingFill(r.rect, geometry.fills);
    if (fill) {
      const body = docFromRegion(r);
      if ((body.content as unknown[]).length > 0) {
        out.set(r.ordinal, { block_type: 'callout', content: { schema_version: 2, variant: 'note', body }, rule: 'callout-inside-tint-box' });
        continue;
      }
    }

    const isEyebrow = looksLikeEyebrow(r.text, r.fontSize, bodySize);
    const rankIdx = ranks.indexOf(Math.round(r.fontSize));
    const isHeadingSize = r.fontSize > bodySize + 1.5 && rankIdx >= 0 && rankIdx <= 2;
    const lineCount = r.lines.length;

    if (isEyebrow && r.fontSize <= bodySize + 0.5) {
      // A standalone eyebrow above the next heading: attach to the following
      // heading region if there is one; otherwise emit as a heading eyebrow.
      const next = regions.find((x) => x.ordinal === r.ordinal + 1);
      if (next && next.fontSize > bodySize + 1.5) {
        out.set(r.ordinal, { block_type: 'heading', content: { __eyebrowFor: next.ordinal, eyebrow: collapseLetterSpacing(r.text) }, rule: 'eyebrow-small-caps-above-heading' });
        continue;
      }
    }

    if (isHeadingSize && lineCount <= 2 && !isEyebrow) {
      const level = (rankIdx === 0 ? 1 : rankIdx === 1 ? 2 : 3) as 1 | 2 | 3;
      const content: Record<string, unknown> = { text: r.text.replace(/\n/g, ' ').trim(), level };
      // pick up a preceding eyebrow folded onto this heading
      out.set(r.ordinal, { block_type: 'heading', content, rule: 'heading-by-font-rank' });
      continue;
    }

    // Plain body paragraph at body size with no special signal -> text. The
    // residue (numbered exercise, quote, callout, spoken instruction) is left for
    // the model: a leading numeral, a quotation mark, or an isolated single line
    // are signals the rule layer deliberately does NOT resolve.
    const firstLine = r.lines[0]?.text ?? '';
    const hasLeadingNumeral = LEADING_NUMERAL_RE.test(firstLine.trim());
    const startsQuote = /^["“«]/.test(firstLine.trim());
    const ambiguous = hasLeadingNumeral || startsQuote;
    if (!ambiguous && Math.abs(r.fontSize - bodySize) <= 1.5) {
      out.set(r.ordinal, { block_type: 'text', content: { html: bodyToHtml(r) }, rule: 'body-paragraph' });
      continue;
    }
    // else: residue, not added to the map -> goes to the model.
  }

  return out;
}

// ----- Figures: rule classification -----------------------------------------

/** Figures classify deterministically: the cover image folds into the cover
 *  block on page 1; every other figure is a `captioned-figure` whose src is the
 *  extracted pixel file (filled by the driver) and whose alt is a neutral
 *  placeholder until a human or the model captions it. No model box, ever. */
export function classifyFigures(figures: FigureRegion[], ctx: PageContext, pageWidthPt: number): Map<number, RuleOutcome> {
  const out = new Map<number, RuleOutcome>();
  for (const f of figures) {
    // The figure's real fraction of the page width, so a small decorative ornament
    // (the Level 1 page-2 flower is 27pt on a 612pt page ≈ 4%) renders small and a
    // full-bleed plate renders large. General: the on-page size is in the geometry,
    // so carry it instead of letting every figure inflate to the renderer's max.
    const width_pct = pageWidthPt > 0 ? Math.round((f.widthPt / pageWidthPt) * 100) : null;
    if (ctx.isCoverPage) {
      out.set(f.ordinal, { block_type: 'captioned-figure', content: { schema_version: 2, src: '', alt: 'cover illustration', __coverImage: true, ...(width_pct ? { width_pct } : {}) }, rule: 'figure-cover-image' });
    } else {
      out.set(f.ordinal, { block_type: 'captioned-figure', content: { schema_version: 2, src: '', alt: 'figure', ...(width_pct ? { width_pct } : {}) }, rule: 'figure-xobject-bounds' });
    }
  }
  return out;
}

/**
 * Header-row attachment: a row of N short boxes sitting directly above an N-column
 * block, each aligned over one column, is a row of COLUMN HEADERS — fold each into
 * the top of its column so the column reads heading-then-body (the page-7 three-up
 * "Protection | Separation | Observation"). Short headers do not self-column (a
 * lone short box is not a "real column"), so without this they detach into a
 * stacked row above the body columns. Targeted and deterministic: it fires only
 * when a flow slot of exactly N boxes precedes a cols slot of N columns, every box
 * aligns over a distinct column, and the boxes sit above the columns. Any other
 * layout (a single-column page, a figure+text band) never matches, so this cannot
 * over-column.
 */
export function attachHeadersToColumns(slots: LayoutSlot[], rectOf: (key: number) => Rect | undefined): LayoutSlot[] {
  const out: LayoutSlot[] = [];
  for (let i = 0; i < slots.length; i++) {
    const f = slots[i];
    const c = slots[i + 1];
    const n = c && c.kind === 'cols' ? c.columns.length : 0;
    // The headers are the LAST n keys of the preceding flow (flatten pours every
    // leaf before a columns node into one run, so the header row lands at its tail).
    if (f.kind === 'flow' && c && c.kind === 'cols' && n >= 2 && f.keys.length >= n) {
      const head = f.keys.slice(f.keys.length - n);
      const headRects = head.map((k) => rectOf(k));
      const colX = c.columns.map((col) => {
        const rects = col.map((k) => rectOf(k)).filter((r): r is Rect => !!r);
        return rects.length ? [Math.min(...rects.map((r) => r[0])), Math.max(...rects.map((r) => r[2])), Math.min(...rects.map((r) => r[1]))] as [number, number, number] : null;
      });
      let ok = colX.every((x) => x !== null) && headRects.every((r): r is Rect => !!r);
      // the candidate headers must form a single row (similar tops)
      if (ok) {
        const tops = (headRects as Rect[]).map((r) => r[1]);
        if (Math.max(...tops) - Math.min(...tops) > 6) ok = false;
      }
      const assign = new Map<number, number>();
      const usedCols = new Set<number>();
      if (ok) {
        for (const k of head) {
          const r = rectOf(k)!;
          const cx = (r[0] + r[2]) / 2;
          // a header aligns over an unclaimed column and sits above its top
          const j = colX.findIndex((x, idx) => x !== null && !usedCols.has(idx) && cx >= x[0] - 4 && cx <= x[1] + 4 && r[3] <= x[2] + 4);
          if (j < 0) { ok = false; break; }
          assign.set(k, j);
          usedCols.add(j);
        }
      }
      if (ok && usedCols.size === n) {
        const lead = f.keys.slice(0, f.keys.length - n);
        if (lead.length) out.push({ kind: 'flow', keys: lead });
        const columns = c.columns.map((col, j) => {
          const hk = [...assign.entries()].find(([, jj]) => jj === j)?.[0];
          return hk !== undefined ? [hk, ...col] : col;
        });
        out.push({ kind: 'cols', columns });
        i += 1; // consume the cols slot
        continue;
      }
    }
    out.push(f);
  }
  return out;
}

// ----- The page classifier (rules -> cache -> model) ------------------------

export interface ClassifyCounts {
  rule: number;
  cache: number;
  model: number;
  undecided: number;
}

export interface ClassifyPageResult {
  regions: ClassifiedRegion[];
  counts: ClassifyCounts;
}

export interface ClassifyOptions {
  ctx: PageContext;
  cache: RegionCache;
  model: ModelClassifier | null;
  /** Optional thumbnail provider, keyed by region ordinal, for the model path. */
  thumbnailFor?: (ordinal: number) => string | null;
}

/**
 * Classify one page. Order per region: cache hit -> rule -> model -> undecided
 * fallback. Mutates `cache` with any new rule/model label so a re-run reads it
 * back. Returns the classified regions and the rule/cache/model counts (AC7).
 */
export async function classifyPage(geometry: PageGeometry, opts: ClassifyOptions): Promise<ClassifyPageResult> {
  const { ctx, cache, model } = opts;
  const counts: ClassifyCounts = { rule: 0, cache: 0, model: 0, undecided: 0 };
  const regions: ClassifiedRegion[] = [];

  const allRegions: Array<BlockRegion | FigureRegion> = [...geometry.textRegions, ...geometry.figures];
  const byOrd = new Map<number, BlockRegion | FigureRegion>(allRegions.map((r) => [r.ordinal, r]));

  // --- XY-cut layout: reading order AND column structure from the geometry ---
  const lineH = bodyFontSize(geometry.textRegions) || 12;
  const boxes: LayoutBox[] = allRegions.map((r) => ({ key: r.ordinal, rect: r.rect, kind: r.kind === 'figure' ? 'figure' : 'text' }));
  const tree = boxes.length ? xyCut(boxes, lineH) : { type: 'leaf' as const, boxes: [] };
  // Fold a row of column headers into the tops of their columns (page-7 three-up).
  const slots = attachHeadersToColumns(flattenLayout(tree), (k) => byOrd.get(k)?.rect);

  // Exercise grouping is bounded by the XY-cut LEAF (a contiguous run with no
  // figure or column break), so an exercise never spans a figure or a column.
  const leafOf = assignLeaves(tree);

  const ruleMap = classifyByRules(geometry, ctx, (o) => `L${leafOf.get(o) ?? o}`);
  const figureMap = classifyFigures(geometry.figures, ctx, geometry.widthPt);

  // Only the cover ignores the layout split (it is genuinely one centered, whole-
  // page composition). A contents page is NOT whole-page: it can carry a title, a
  // subtitle, a decorative figure, and a footer pull-quote around its rows, so it
  // reads in XY-cut geometric order like any other page, with the contents block
  // sitting in its rows' position.
  const specialPage = [...ruleMap.values()].some((o) => o.block_type === 'cover' && !(o.content as Record<string, unknown>).__folded);

  type Slotted = { region: BlockRegion | FigureRegion; colGroup?: string; colIndex?: number; colCount?: number };
  const orderedSlots: Slotted[] = [];
  if (specialPage) {
    for (const r of [...allRegions].sort((a, b) => a.ordinal - b.ordinal)) orderedSlots.push({ region: r });
  } else {
    slots.forEach((slot, s) => {
      if (slot.kind === 'flow') {
        for (const k of slot.keys) { const r = byOrd.get(k); if (r) orderedSlots.push({ region: r }); }
      } else {
        const cg = `${ctx.pageIndex}:col${s}`;
        const colCount = slot.columns.length;
        slot.columns.forEach((col, idx) => {
          for (const k of col) { const r = byOrd.get(k); if (r) orderedSlots.push({ region: r, colGroup: cg, colIndex: idx, colCount }); }
        });
      }
    });
  }

  for (const { region, colGroup, colIndex, colCount } of orderedSlots) {
    const cacheKey = regionContentHash(region);
    const ruleHit = region.kind === 'figure' ? figureMap.get(region.ordinal) : ruleMap.get(region.ordinal);
    const tag = (cr: ClassifiedRegion): ClassifiedRegion => (colGroup ? { ...cr, colGroup, colIndex, colCount } : cr);

    // 1. cache
    const cached = cache[cacheKey];
    if (cached) {
      regions.push(tag({ ordinal: region.ordinal, block_type: cached.block_type, content: cached.content, decidedBy: 'cache', cacheKey, rule: cached.rule, rect: ruleHit?.rect ?? region.rect }));
      counts.cache += 1;
      continue;
    }

    // 2. rule
    if (ruleHit) {
      cache[cacheKey] = { block_type: ruleHit.block_type, content: ruleHit.content, decidedBy: 'rule', rule: ruleHit.rule };
      regions.push(tag({ ordinal: region.ordinal, block_type: ruleHit.block_type, content: ruleHit.content, decidedBy: 'rule', cacheKey, rule: ruleHit.rule, rect: ruleHit.rect ?? region.rect }));
      counts.rule += 1;
      continue;
    }

    // 3. model (text residue only; figures are always rule-decided)
    if (region.kind === 'text' && model) {
      const req = buildClassifierRequest(region, opts.thumbnailFor?.(region.ordinal) ?? null);
      const resp = await model.classify(req);
      cache[cacheKey] = { block_type: resp.block_type, content: resp.content, decidedBy: 'model' };
      regions.push(tag({ ordinal: region.ordinal, block_type: resp.block_type, content: resp.content, decidedBy: 'model', cacheKey, rect: region.rect }));
      counts.model += 1;
      continue;
    }

    // 4. undecided: no rule, no model. Fall back to a safe `text` label and
    // surface it; never silently drop the region.
    const fallbackContent = region.kind === 'text' ? { html: bodyToHtml(region) } : { schema_version: 2, src: '', alt: 'figure' };
    regions.push(tag({ ordinal: region.ordinal, block_type: 'text', content: fallbackContent, decidedBy: 'undecided', cacheKey, modelUnavailable: region.kind === 'text', rect: region.rect }));
    counts.undecided += 1;
  }

  return { regions, counts };
}
