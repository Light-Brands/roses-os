/**
 * Deterministic geometry extraction for the manual reconstruction pipeline
 * (spec 003-deterministic-extraction-geometry, T-009a, AC1 + AC2; decision D-11).
 *
 * This is the GEOMETRY half of E2: a pure read of a born-digital PDF page. It
 * carries no network call and no model call. The page already carries the exact
 * coordinates as data (a real text layer with per-run transform matrices and
 * embedded image XObjects with real bounds), so we read them instead of asking a
 * vision model to re-estimate them. Re-estimation is what did not converge; a
 * deterministic read is what lets D-7 idempotency be a property rather than a
 * hope.
 *
 * The browser-side driver (`scripts/extract-geometry-browser.mjs`, run inside the
 * vendored pdf.js v4.7.76) produces the RAW page extract: text items with their
 * transform matrices and image ops with their device-space rects. THIS module is
 * the pure, deterministic transform from that raw extract into an ordered
 * `PageGeometry`. Keeping it pure means it unit-tests in plain node with no
 * browser, and the same bytes come out every run (AC1).
 *
 * pdf.js emits text items in content-stream order, NOT reading order. The
 * `(y-band, x)` sort in `deriveReadingOrder` is mandatory, not optional: on the
 * Level 1 exercise page only 5 of 24 items arrive already in order (Amelia's
 * probe). Reading order is always derived from the rects, never assumed.
 */

// ----- Coordinate convention -----------------------------------------------
//
// Every rect in this module is `[x0, y0, x1, y1]` in PDF *points*, top-left
// origin (y grows DOWN the page). pdf.js text transforms carry the baseline in a
// bottom-left origin; the raw driver flips y once so everything here is top-left.
// Values are rounded to ROUND_DP decimal places so two runs over the same page
// serialize byte-identically even if a downstream float reformats.

export type Rect = readonly [number, number, number, number];

/** Decimal places every coordinate is rounded to. Guards byte-identical output. */
export const ROUND_DP = 3;

/** Vertical tolerance (points) for grouping runs into a horizontal band/line. */
export const BAND_TOLERANCE_PT = 4;

/** A line-break between regions fires when the vertical gap exceeds this multiple
 *  of the median line height. */
export const REGION_GAP_FACTOR = 1.6;

/** A space is inserted between two runs on one line when their x-gap exceeds this
 *  fraction of the font size (x-gap-aware token joining, Amelia probe 3). */
export const SPACE_GAP_FRACTION = 0.25;

/** A figure must clear this on its SHORTER side (points). Below it the op is a
 *  hairline rule, a tiny mask, or a dot, not a figure. Tuned to keep a real
 *  small decorative XObject (the Level 1 page-2 flower is 27x40pt) while
 *  rejecting slivers (Amelia risk 2). */
export const MIN_FIGURE_DIM_PT = 12;

/** A figure must also clear this area (square points), so a 12x14pt speck is not
 *  promoted to a content figure. */
export const MIN_FIGURE_AREA_PT = 200;

/** Reject extreme aspect ratios: a long/thin op (a rule, a column divider) is not
 *  a figure even when its longer side is large. The page-2 flower is ~1.5:1; a
 *  hairline rule is 30:1 or worse. */
export const MAX_FIGURE_ASPECT = 12;

// ----- Raw shapes (the browser driver's output) ----------------------------

/** One text item exactly as pdf.js `getTextContent()` yields it. */
export interface RawTextItem {
  /** The verbatim string for this run (ligatures intact, real Unicode). */
  str: string;
  /** pdf.js transform `[a, b, c, d, e, f]` in the page's bottom-left user space. */
  transform: [number, number, number, number, number, number];
  /** Advance width in points. */
  width: number;
  /** Glyph height in points. */
  height: number;
  /** Font resource name (e.g. `g_d0_f1`); a stable per-font handle, not a family. */
  fontName: string;
}

/** Kind of figure source. `xobject` is an embedded image; `vector` is a
 *  path-paint cluster with no covering image XObject (AC9 fallback). */
export type FigureKind = 'xobject' | 'vector';

/** One image/figure region the operator-list walk recovered, rect already in
 *  top-left PDF points. */
export interface RawImageOp {
  /** pdf.js object id for the embedded image (`page.objs.get(objId)`), or null
   *  for a vector-art cluster that has no XObject to fetch. */
  objId: string | null;
  /** Placed rect `[x0, y0, x1, y1]`, top-left PDF points. */
  rect: Rect;
  kind: FigureKind;
}

/** The full raw extract of one page from the browser driver. */
export interface RawPageExtract {
  page: number;
  /** Page width/height in PDF points (the unscaled viewport). */
  widthPt: number;
  heightPt: number;
  items: RawTextItem[];
  images: RawImageOp[];
}

// ----- Geometry shapes (this module's deterministic output) -----------------

/** A single text run with its exact rect, string, font name, and font size. */
export interface TextRun {
  str: string;
  rect: Rect;
  fontName: string;
  fontSize: number;
}

/** One coalesced line: consecutive runs in one band, x-gap-joined into text. */
export interface LineRegion {
  text: string;
  rect: Rect;
  fontSize: number;
  fontName: string;
  runCount: number;
}

/** A block region: one or more lines with a shared font bucket and no large gap.
 *  This is the unit `classify-regions.ts` labels. */
export interface BlockRegion {
  /** Stable ordinal in reading order on the page (0-based). */
  ordinal: number;
  kind: 'text';
  text: string;
  rect: Rect;
  /** Representative (median) font size across the region's lines. */
  fontSize: number;
  /** Representative (modal) font name across the region's lines. */
  fontName: string;
  lines: LineRegion[];
}

/** A figure region: a real embedded image or a vector-art cluster, never a model
 *  box. `pixelsHash` is filled by figure extraction (T-FIG); null until then. */
export interface FigureRegion {
  ordinal: number;
  kind: 'figure';
  objId: string | null;
  source: FigureKind;
  rect: Rect;
  widthPt: number;
  heightPt: number;
  /** Hash of the extracted pixel bytes once T-FIG has cropped them; null before. */
  pixelsHash: string | null;
}

/** The deterministic geometry of one page: ordered text + figure regions. */
export interface PageGeometry {
  page: number;
  widthPt: number;
  heightPt: number;
  textRegions: BlockRegion[];
  figures: FigureRegion[];
}

// ----- Pure helpers ---------------------------------------------------------

function round(n: number): number {
  // toFixed then back to Number drops trailing-zero noise and pins precision so
  // the JSON serialization is byte-stable. Guard NaN/Infinity to 0.
  if (!Number.isFinite(n)) return 0;
  return Number(n.toFixed(ROUND_DP));
}

function roundRect(r: Rect): Rect {
  return [round(r[0]), round(r[1]), round(r[2]), round(r[3])];
}

/** Font size of a raw item: the magnitude of the transform's vertical basis
 *  vector, `hypot(b, d)`, per Amelia's probe. Falls back to glyph height. */
export function fontSizeOf(item: RawTextItem): number {
  const [, b, , d] = item.transform;
  const s = Math.hypot(b, d);
  return s > 0.01 ? s : Math.max(item.height, 1);
}

/** Build a `TextRun` (top-left rect) from a raw item and the page height. */
export function runFromRawItem(item: RawTextItem, heightPt: number): TextRun {
  const x0 = item.transform[4];
  const baselineY = item.transform[5];
  const size = fontSizeOf(item);
  const h = item.height > 0.01 ? item.height : size;
  // baselineY is bottom-left origin; flip to top-left. The baseline sits near the
  // glyph bottom, so the rect runs from (baseline - height) down to the baseline.
  const bottomTop = heightPt - baselineY;
  const topTop = bottomTop - h;
  return {
    str: item.str,
    rect: roundRect([x0, topTop, x0 + item.width, bottomTop]),
    fontName: item.fontName,
    fontSize: round(size),
  };
}

function median(xs: number[]): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function mode(xs: string[]): string {
  if (xs.length === 0) return '';
  const counts = new Map<string, number>();
  for (const x of xs) counts.set(x, (counts.get(x) ?? 0) + 1);
  // Deterministic tie-break: highest count, then lexicographically smallest.
  let best = xs[0];
  let bestN = -1;
  for (const [k, n] of [...counts.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    if (n > bestN) {
      bestN = n;
      best = k;
    }
  }
  return best;
}

const top = (r: Rect): number => r[1];
const bottom = (r: Rect): number => r[3];
const left = (r: Rect): number => r[0];

function unionRect(rects: Rect[]): Rect {
  const x0 = Math.min(...rects.map((r) => r[0]));
  const y0 = Math.min(...rects.map((r) => r[1]));
  const x1 = Math.max(...rects.map((r) => r[2]));
  const y1 = Math.max(...rects.map((r) => r[3]));
  return roundRect([x0, y0, x1, y1]);
}

// ----- Reading order (AC2) --------------------------------------------------

/**
 * Sort text runs into true reading order by a column-aware top-to-bottom band
 * sort. pdf.js gives content-stream order; this derives the real order from the
 * rects. Deterministic: runs are bucketed into bands by their top coordinate
 * (within BAND_TOLERANCE_PT), then sorted by `(bandIndex, x, originalIndex)`,
 * which is a total order, not a tolerance-comparator (which would be
 * non-transitive and could shuffle run-to-run).
 */
export function deriveReadingOrder(runs: TextRun[]): TextRun[] {
  const indexed = runs.map((run, i) => ({ run, i }));
  // Stable pre-sort by top, then x, then original index.
  indexed.sort((a, b) => {
    const dt = top(a.run.rect) - top(b.run.rect);
    if (Math.abs(dt) > 1e-6) return dt;
    const dx = left(a.run.rect) - left(b.run.rect);
    if (Math.abs(dx) > 1e-6) return dx;
    return a.i - b.i;
  });
  // Assign band ids by walking the top-sorted list.
  let bandId = 0;
  let bandTop = indexed.length ? top(indexed[0].run.rect) : 0;
  const banded = indexed.map((entry, k) => {
    if (k > 0 && top(entry.run.rect) - bandTop > BAND_TOLERANCE_PT) {
      bandId += 1;
      bandTop = top(entry.run.rect);
    }
    return { ...entry, bandId };
  });
  // Final order: band, then x within band, then original content-stream index.
  banded.sort((a, b) => {
    if (a.bandId !== b.bandId) return a.bandId - b.bandId;
    const dx = left(a.run.rect) - left(b.run.rect);
    if (Math.abs(dx) > 1e-6) return dx;
    return a.i - b.i;
  });
  return banded.map((e) => e.run);
}

// ----- Coalescing runs -> lines -> regions ----------------------------------

/** Join two run strings with a space only when their x-gap is wide enough that
 *  the original had a real word boundary there (x-gap-aware token joining). */
function joinRuns(runs: TextRun[]): string {
  let out = '';
  for (let i = 0; i < runs.length; i++) {
    const cur = runs[i];
    if (i === 0) {
      out = cur.str;
      continue;
    }
    const prev = runs[i - 1];
    const gap = left(cur.rect) - prev.rect[2];
    const threshold = SPACE_GAP_FRACTION * Math.max(cur.fontSize, prev.fontSize);
    const needsSpace = gap > threshold && !out.endsWith(' ') && !cur.str.startsWith(' ');
    out += (needsSpace ? ' ' : '') + cur.str;
  }
  return out;
}

/** Group reading-ordered runs into lines: consecutive runs whose tops fall within
 *  BAND_TOLERANCE_PT of the line's first run. */
export function groupIntoLines(orderedRuns: TextRun[]): LineRegion[] {
  const lines: LineRegion[] = [];
  let bucket: TextRun[] = [];
  let lineTop = 0;
  const flush = () => {
    if (bucket.length === 0) return;
    const rects = bucket.map((r) => r.rect);
    lines.push({
      text: joinRuns(bucket),
      rect: unionRect(rects),
      fontSize: round(median(bucket.map((r) => r.fontSize))),
      fontName: mode(bucket.map((r) => r.fontName)),
      runCount: bucket.length,
    });
    bucket = [];
  };
  for (const run of orderedRuns) {
    if (bucket.length === 0) {
      lineTop = top(run.rect);
      bucket.push(run);
      continue;
    }
    if (Math.abs(top(run.rect) - lineTop) <= BAND_TOLERANCE_PT) {
      bucket.push(run);
    } else {
      flush();
      lineTop = top(run.rect);
      bucket.push(run);
    }
  }
  flush();
  return lines;
}

/** Bucket a font size to a coarse rank so a 17.9pt and 18.1pt line read as one
 *  block, but a 30pt heading breaks from 18pt body. Rounds to the nearest point. */
function fontBucket(size: number): number {
  return Math.round(size);
}

/**
 * Group lines into block regions. A new region starts on a font-bucket change or
 * a vertical gap larger than REGION_GAP_FACTOR x the median line height. The
 * splitter stays deliberately dumb (Amelia probe 3): it separates structurally
 * distinct blocks and leaves the final block-type assignment and any line merge
 * to the classifier.
 */
export function groupLinesIntoRegions(lines: LineRegion[], startOrdinal = 0): BlockRegion[] {
  if (lines.length === 0) return [];
  const heights = lines.map((l) => bottom(l.rect) - top(l.rect)).filter((h) => h > 0);
  const medLineH = median(heights) || lines[0].fontSize || 12;
  const regions: BlockRegion[] = [];
  let bucket: LineRegion[] = [lines[0]];
  const flush = () => {
    const rects = bucket.map((l) => l.rect);
    regions.push({
      ordinal: startOrdinal + regions.length,
      kind: 'text',
      text: bucket.map((l) => l.text).join('\n'),
      rect: unionRect(rects),
      fontSize: round(median(bucket.map((l) => l.fontSize))),
      fontName: mode(bucket.map((l) => l.fontName)),
      lines: bucket,
    });
    bucket = [];
  };
  for (let i = 1; i < lines.length; i++) {
    const prev = lines[i - 1];
    const cur = lines[i];
    const gap = top(cur.rect) - bottom(prev.rect);
    const fontChanged = fontBucket(cur.fontSize) !== fontBucket(prev.fontSize);
    const bigGap = gap > REGION_GAP_FACTOR * medLineH;
    if (fontChanged || bigGap) {
      flush();
    }
    bucket.push(cur);
  }
  flush();
  return regions;
}

// ----- Figures --------------------------------------------------------------

/** True when an image op's placed rect is a genuine figure (a real embedded image
 *  or vector cluster), not a mask, hairline rule, or speck. Deterministic, and
 *  the rect always comes from the operator list, never a model box. */
export function isFigureRect(rect: Rect): boolean {
  const w = rect[2] - rect[0];
  const h = rect[3] - rect[1];
  const short = Math.min(w, h);
  const long = Math.max(w, h);
  if (short < MIN_FIGURE_DIM_PT) return false;
  if (w * h < MIN_FIGURE_AREA_PT) return false;
  if (short > 0 && long / short > MAX_FIGURE_ASPECT) return false;
  return true;
}

/** Keep only image ops whose placed rect passes `isFigureRect`, so masks, rules,
 *  and decorative slivers do not masquerade as figures while real small figures
 *  (the page-2 flower) are kept at their exact bounds. */
export function figuresFromRaw(images: RawImageOp[], startOrdinal: number): FigureRegion[] {
  const out: FigureRegion[] = [];
  for (const img of images) {
    const w = img.rect[2] - img.rect[0];
    const h = img.rect[3] - img.rect[1];
    if (!isFigureRect(img.rect)) continue;
    out.push({
      ordinal: startOrdinal + out.length,
      kind: 'figure',
      objId: img.objId,
      source: img.kind,
      rect: roundRect(img.rect),
      widthPt: round(w),
      heightPt: round(h),
      pixelsHash: null,
    });
  }
  return out;
}

// ----- The deterministic transform: raw -> PageGeometry ---------------------

/**
 * The single deterministic entry point (AC1). Given the raw page extract from the
 * browser driver, produce a `PageGeometry` whose JSON is byte-identical across
 * runs over the same page. No network, no model, no clock, no randomness.
 */
export function extractPageGeometry(raw: RawPageExtract): PageGeometry {
  const runs = raw.items
    // Drop whitespace-only runs early; they carry no content and only perturb
    // the band sort. A run that is purely spaces contributes nothing to a block.
    .filter((it) => it.str.length > 0 && it.str.trim().length > 0)
    .map((it) => runFromRawItem(it, raw.heightPt));
  const ordered = deriveReadingOrder(runs);
  const lines = groupIntoLines(ordered);
  const textRegions = groupLinesIntoRegions(lines, 0);
  const figures = figuresFromRaw(raw.images, textRegions.length);
  return {
    page: raw.page,
    widthPt: round(raw.widthPt),
    heightPt: round(raw.heightPt),
    textRegions,
    figures,
  };
}

// ----- Per-region content hash (the classification cache key, AC6) ----------

/** A small, dependency-free FNV-1a 32-bit hash rendered as 8 hex chars. Pure and
 *  identical in browser and node, so the cache key is portable. */
export function fnv1a(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  // >>> 0 forces unsigned; pad to 8 hex chars.
  return (h >>> 0).toString(16).padStart(8, '0');
}

/**
 * The deterministic cache key for one region: a content hash over its text, font
 * name, font size, rect, and (for a figure) the extracted pixel-bytes hash. A
 * re-run over an unchanged page produces the same key, so every label is served
 * from cache and the staging rows re-derive byte-identically (AC6).
 */
export function regionContentHash(region: BlockRegion | FigureRegion): string {
  if (region.kind === 'figure') {
    const parts = ['figure', region.source, region.rect.join(','), region.pixelsHash ?? ''];
    return fnv1a(parts.join('|'));
  }
  const parts = ['text', region.text, region.fontName, String(region.fontSize), region.rect.join(',')];
  return fnv1a(parts.join('|'));
}
