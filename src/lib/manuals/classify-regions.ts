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

import type { BlockRegion, FigureRegion, PageGeometry, Rect } from './extract-geometry';
import { regionContentHash } from './extract-geometry';
import { xyCut, flattenLayout, assignLeaves, type LayoutBox } from './layout';

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
  /** When this region belongs to a two-column band, the band id (shared by its
   *  partner) and which side it is on. Derived from the XY-cut layout. */
  colGroup?: string;
  colSide?: 'left' | 'right';
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
export function parseContentsRows(regions: BlockRegion[], bodySize: number, pageHeightPt: number): Array<{ numeral?: string; title: string; page?: string }> | null {
  // Collect candidate lines in reading order, excluding the big title (well above
  // body size) and the footer/header bands (a running "Rose Meditation - Level 1"
  // footer ends in a digit and would otherwise read as a bogus row).
  const lines: string[] = [];
  for (const r of regions) {
    if (r.fontSize > bodySize + 6) continue;
    if (r.rect[1] > pageHeightPt * 0.9) continue; // footer band
    if (r.rect[3] < pageHeightPt * 0.08) continue; // header band
    for (const l of r.lines) lines.push(l.text.trim());
  }
  const rows: Array<{ numeral?: string; title: string; page?: string }> = [];
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (!line || PURE_NUM_RE.test(line)) continue; // blank, or a page-number fragment already consumed
    let page: string | undefined;
    const pageM = line.match(PAGE_NUM_RE);
    if (pageM && /\d\s*$/.test(line)) {
      page = pageM[1];
      line = line.slice(0, pageM.index).trim();
    } else {
      // No inline page: a separate right-aligned page-number run follows.
      const next = lines[i + 1];
      if (next && PURE_NUM_RE.test(next)) {
        page = next;
        lines[i + 1] = ''; // consume it
      }
    }
    if (!page) continue; // a line with no page number is not a TOC row (drops footer notes)
    line = line.replace(/[.·\s]+$/, '').trim(); // strip trailing dot/middot leaders
    const numM = line.match(LEADING_NUMERAL_RE);
    let numeral: string | undefined;
    if (numM) {
      numeral = numM[1];
      line = line.slice(numM[0].length).trim();
    }
    if (line.length === 0) continue;
    rows.push({ ...(numeral ? { numeral } : {}), title: line, page });
  }
  return rows.length >= 3 ? rows : null;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string));
}

/** A multi-line body region rendered as paragraph HTML for the `text` block. */
function bodyToHtml(region: BlockRegion): string {
  return region.lines
    .map((l) => l.text.trim())
    .filter(Boolean)
    .map((t) => `<p>${escapeHtml(t)}</p>`)
    .join('');
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
  const contentsRows = parseContentsRows(regions, bodySize, geometry.heightPt);
  const isContentsPage = !!contentsRows;

  // --- cover page ---
  if (ctx.isCoverPage) {
    // eyebrow = a small all-caps line; title = the largest text; subtitle = the
    // next size below the title; author/credits = the remaining small block.
    const sorted = [...regions].sort((a, b) => b.fontSize - a.fontSize);
    const titleRegion = sorted[0];
    const title = titleRegion ? titleRegion.text.replace(/\n/g, ' ').trim() : '';
    const eyebrowRegion = regions.find((r) => looksLikeEyebrow(r.text, r.fontSize, bodySize) && r.ordinal < (titleRegion?.ordinal ?? 0));
    const subtitleRegion = sorted.find((r) => r !== titleRegion && r.fontSize < topSize && !looksLikeEyebrow(r.text, r.fontSize, bodySize));
    const creditRegion = regions.find((r) => r.fontSize <= bodySize && r.lines.length >= 2 && r !== subtitleRegion);
    const content: Record<string, unknown> = { schema_version: 2, title };
    if (eyebrowRegion) content.eyebrow = eyebrowRegion.text.replace(/\s+/g, ' ').trim();
    if (subtitleRegion) content.subtitle = subtitleRegion.text.replace(/\n/g, ' ').trim();
    if (creditRegion) content.author = creditRegion.text.trim();
    if (titleRegion) out.set(titleRegion.ordinal, { block_type: 'cover', content, rule: 'cover-largest-centered-top' });
    // Fold the eyebrow/subtitle/credit regions into the cover (do not emit them
    // again as their own blocks).
    for (const r of [eyebrowRegion, subtitleRegion, creditRegion]) {
      if (r && r !== titleRegion) out.set(r.ordinal, { block_type: 'cover', content: { __folded: true }, rule: 'cover-fold' });
    }
    return out;
  }

  // --- contents block: emit one block, fold the rows + eyebrow into it ---
  if (isContentsPage && contentsRows) {
    const eyebrowRegion = regions.find((r) => looksLikeEyebrow(r.text, r.fontSize, bodySize));
    const content: Record<string, unknown> = { schema_version: 2, rows: contentsRows };
    if (eyebrowRegion) content.eyebrow = eyebrowRegion.text.replace(/\s+/g, ' ').trim();
    // The contents block anchors at the first contents-ish region.
    const anchor = regions.find((r) => r.fontSize <= bodySize + 6) ?? regions[0];
    out.set(anchor.ordinal, { block_type: 'contents', content, rule: 'contents-rows-by-column-x' });
    for (const r of regions) {
      if (r.ordinal === anchor.ordinal) continue;
      // title/subtitle on a contents page above the rows -> fold into the block's
      // eyebrow already; everything else on this page belongs to contents.
      out.set(r.ordinal, { block_type: 'contents', content: { __folded: true }, rule: 'contents-fold' });
    }
    return out;
  }

  // --- folio footers: drop, never a content block ---
  const consumed = new Set<number>();
  for (const r of regions) {
    if (isFolio(r, geometry.heightPt)) {
      out.set(r.ordinal, { block_type: 'text', content: { __drop: true }, rule: 'folio-footer-drop' });
      consumed.add(r.ordinal);
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
    const isEyebrow = looksLikeEyebrow(r.text, r.fontSize, bodySize);
    const rankIdx = ranks.indexOf(Math.round(r.fontSize));
    const isHeadingSize = r.fontSize > bodySize + 1.5 && rankIdx >= 0 && rankIdx <= 2;
    const lineCount = r.lines.length;

    if (isEyebrow && r.fontSize <= bodySize + 0.5) {
      // A standalone eyebrow above the next heading: attach to the following
      // heading region if there is one; otherwise emit as a heading eyebrow.
      const next = regions.find((x) => x.ordinal === r.ordinal + 1);
      if (next && next.fontSize > bodySize + 1.5) {
        out.set(r.ordinal, { block_type: 'heading', content: { __eyebrowFor: next.ordinal, eyebrow: r.text.replace(/\s+/g, ' ').trim() }, rule: 'eyebrow-small-caps-above-heading' });
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
export function classifyFigures(figures: FigureRegion[], ctx: PageContext): Map<number, RuleOutcome> {
  const out = new Map<number, RuleOutcome>();
  for (const f of figures) {
    if (ctx.isCoverPage) {
      out.set(f.ordinal, { block_type: 'captioned-figure', content: { schema_version: 2, src: '', alt: 'cover illustration', __coverImage: true }, rule: 'figure-cover-image' });
    } else {
      out.set(f.ordinal, { block_type: 'captioned-figure', content: { schema_version: 2, src: '', alt: 'figure' }, rule: 'figure-xobject-bounds' });
    }
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
  const slots = flattenLayout(tree);
  // Exercise grouping is bounded by the XY-cut LEAF (a contiguous run with no
  // figure or column break), so an exercise never spans a figure or a column.
  const leafOf = assignLeaves(tree);

  const ruleMap = classifyByRules(geometry, ctx, (o) => `L${leafOf.get(o) ?? o}`);
  const figureMap = classifyFigures(geometry.figures, ctx);

  // A whole-page block (cover, contents) ignores the layout split; everything
  // else reads in XY-cut order with two-column bands annotated.
  const specialPage = [...ruleMap.values()].some((o) => (o.block_type === 'cover' || o.block_type === 'contents') && !(o.content as Record<string, unknown>).__folded);

  type Slotted = { region: BlockRegion | FigureRegion; colGroup?: string; colSide?: 'left' | 'right' };
  const orderedSlots: Slotted[] = [];
  if (specialPage) {
    for (const r of [...allRegions].sort((a, b) => a.ordinal - b.ordinal)) orderedSlots.push({ region: r });
  } else {
    slots.forEach((slot, s) => {
      if (slot.kind === 'flow') {
        for (const k of slot.keys) { const r = byOrd.get(k); if (r) orderedSlots.push({ region: r }); }
      } else {
        const cg = `${ctx.pageIndex}:col${s}`;
        for (const k of slot.left) { const r = byOrd.get(k); if (r) orderedSlots.push({ region: r, colGroup: cg, colSide: 'left' }); }
        for (const k of slot.right) { const r = byOrd.get(k); if (r) orderedSlots.push({ region: r, colGroup: cg, colSide: 'right' }); }
      }
    });
  }

  for (const { region, colGroup, colSide } of orderedSlots) {
    const cacheKey = regionContentHash(region);
    const ruleHit = region.kind === 'figure' ? figureMap.get(region.ordinal) : ruleMap.get(region.ordinal);
    const tag = (cr: ClassifiedRegion): ClassifiedRegion => (colGroup ? { ...cr, colGroup, colSide } : cr);

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
