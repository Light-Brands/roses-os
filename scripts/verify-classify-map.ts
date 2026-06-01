/**
 * Unit verification for AC4 (the model request carries no coordinate) and AC5
 * (a mislabelled region is rejected with the named-error envelope and surfaced,
 * never silently dropped). Pure; no browser, no PDF.
 *
 *   npx tsx scripts/verify-classify-map.ts
 */

import { buildClassifierRequest, FORBIDDEN_REQUEST_KEYS, collapseLetterSpacing, classifyByRules, classifyFigures, parseContentsRows } from '../src/lib/manuals/classify-regions';
import type { BlockRegion, FigureRegion, PageGeometry } from '../src/lib/manuals/extract-geometry';
import { isTintBox } from '../src/lib/manuals/extract-geometry';
import { mapToBlocks, type PageInput, type MappedBlock } from '../src/lib/manuals/map-to-blocks';
import { groupTwoColumns } from '../src/lib/manuals/columns';
import { analyzePageLayout, xyCut, assignLeaves, flattenLayout, type LayoutBox } from '../src/lib/manuals/layout';
import type { ClassifiedRegion } from '../src/lib/manuals/classify-regions';

let failures = 0;
function check(name: string, cond: boolean, detail = ''): void {
  console.log(cond ? `  ok   ${name}` : `  FAIL ${name}${detail ? '  -> ' + detail : ''}`);
  if (!cond) failures += 1;
}

// ---- AC4: the classifier request has no box / coordinate field ---------------
{
  const region: BlockRegion = {
    ordinal: 0,
    kind: 'text',
    text: 'Some ambiguous paragraph the rules left for the model.',
    rect: [40, 100, 540, 160],
    fontSize: 10,
    fontName: 'g_d0_f1',
    lines: [{ text: 'Some ambiguous paragraph.', rect: [40, 100, 540, 120], fontSize: 10, fontName: 'g_d0_f1', runCount: 1 }],
  };
  const req = buildClassifierRequest(region, 'data:image/png;base64,iVBOR');
  const keys = Object.keys(req);
  const leaked = FORBIDDEN_REQUEST_KEYS.filter((k) => keys.includes(k));
  check('AC4 request keys are only text/fontSize/fontName/thumbnail', JSON.stringify(keys.sort()) === JSON.stringify(['fontName', 'fontSize', 'text', 'thumbnail']), JSON.stringify(keys));
  check('AC4 no forbidden coordinate key present', leaked.length === 0, leaked.join(','));
  // The rect is INPUT context the deterministic side owns; it never reaches the request.
  check('AC4 request does not echo the region rect', !JSON.stringify(req).includes('"rect"') && !JSON.stringify(req).includes('100,160'), JSON.stringify(req).slice(0, 80));
}

// ---- AC5: a mislabel is rejected with the envelope and surfaced --------------
{
  // A 'cover' with no title is a schema violation (cover requires title).
  const mislabel: ClassifiedRegion = { ordinal: 0, block_type: 'cover', content: { schema_version: 2 }, decidedBy: 'model', cacheKey: 'x' };
  // A 'heading' missing its required `level`.
  const mislabel2: ClassifiedRegion = { ordinal: 1, block_type: 'heading', content: { text: 'A real heading line' }, decidedBy: 'model', cacheKey: 'y' };
  // A clean text block that must pass.
  const good: ClassifiedRegion = { ordinal: 2, block_type: 'text', content: { html: '<p>clean body</p>' }, decidedBy: 'rule', cacheKey: 'z' };

  const pages: PageInput[] = [{ page: 1, regions: [mislabel, mislabel2, good], figureFiles: new Map() }];
  const blocks = mapToBlocks(pages, { runId: 'r', signer: 's' });

  check('AC5 all three regions are emitted (none silently dropped)', blocks.length === 3, String(blocks.length));
  const cover = blocks.find((b) => b.block_type === 'cover');
  check('AC5 mislabelled cover is marked invalid', !!cover && cover.valid === false, JSON.stringify(cover?.valid));
  check('AC5 invalid carries the INVALID_BLOCK envelope', !!cover?.error && cover.error.ok === false && cover.error.error.code === 'INVALID_BLOCK', JSON.stringify(cover?.error?.error.code));
  const heading = blocks.find((b) => b.block_type === 'heading');
  check('AC5 heading missing level is invalid', !!heading && heading.valid === false, JSON.stringify(heading?.valid));
  const text = blocks.find((b) => b.block_type === 'text');
  check('AC5 the valid text block passes', !!text && text.valid === true && text.error === null, JSON.stringify(text?.valid));
  // Every block carries provenance regardless of validity (D-12).
  check('AC8 every block carries source_page + run_id + signer provenance', blocks.every((b) => b.provenance.source_page === 1 && b.provenance.run_id === 'r' && b.provenance.signer === 's'));
}

// ---- two-column detection (spec 003 extension) ------------------------------
{
  const mk = (over: Partial<MappedBlock>): MappedBlock => ({
    id: 'x', position: 0, block_type: 'text', content: {}, valid: true, error: null,
    anchor: { page: 6, ordinal: 0 }, provenance: { source_page: 6, run_id: 'r', signer: 's' },
    decidedBy: 'rule', rect: null, ...over,
  });
  // The XY-cut layout tagged the side-by-side band: text left, figure right, both
  // sharing colGroup '6:col1'. The wide block carries no colGroup (single column).
  const text = mk({ id: '6:0', position: 0, block_type: 'numbered-exercise', content: { schema_version: 2, numeral: '3', body: { type: 'doc', content: [] } }, anchor: { page: 6, ordinal: 0 }, rect: [83, 111, 345, 184], colGroup: '6:col1', colIndex: 0, colCount: 2 });
  const fig = mk({ id: '6:10', position: 1, block_type: 'captioned-figure', content: { schema_version: 2, src: 'a.png', alt: 'aura' }, anchor: { page: 6, ordinal: 10 }, rect: [389, 40, 539, 265], colGroup: '6:col1', colIndex: 1, colCount: 2 });
  // a full-width block with no colGroup must NOT column.
  const wide = mk({ id: '6:6', position: 2, block_type: 'numbered-exercise', content: { schema_version: 2, numeral: '5', body: { type: 'doc', content: [] } }, anchor: { page: 6, ordinal: 6 }, rect: [83, 534, 554, 662] });

  const { blocks: out, columnsFormed } = groupTwoColumns([text, fig, wide]);
  check('COL side-by-side figure+text forms exactly one two-column-section', columnsFormed === 1, String(columnsFormed));
  const sec = out.find((b) => b.block_type === 'two-column-section');
  check('COL section content references both children by id', !!sec && (sec.content as any).left[0] === '6:0' && (sec.content as any).right[0] === '6:10', JSON.stringify(sec?.content));
  check('COL section validates against the schema', !!sec && sec.valid === true, JSON.stringify(sec?.error?.error.code));
  check('COL paired children are flagged nested', !!out.find((b) => b.id === '6:0')?.nested && !!out.find((b) => b.id === '6:10')?.nested);
  check('COL full-width block stays single (not columned)', !out.find((b) => b.id === '6:6')?.nested, 'wide block was wrongly nested');
}

// ---- XY-cut layout: the general geometry rule ------------------------------
{
  // Page-6 style: text left + figure right, overlapping in y -> one two-col slot;
  // a full-width block below stays a single flow.
  const boxes: LayoutBox[] = [
    { key: 0, rect: [83, 111, 345, 184], kind: 'text' },   // ex3 text, left
    { key: 10, rect: [389, 40, 539, 265], kind: 'figure' }, // aura figure, right
    { key: 6, rect: [83, 534, 554, 662], kind: 'text' },    // ex5 full width below
  ];
  const slots = analyzePageLayout(boxes, 10);
  const twoCol = slots.find((s) => s.kind === 'cols') as { kind: 'cols'; columns: number[][] } | undefined;
  check('LAYOUT side-by-side text/figure becomes one cols slot', !!twoCol && twoCol.columns.length === 2 && twoCol.columns[0].includes(0) && twoCol.columns[1].includes(10), JSON.stringify(slots));
  check('LAYOUT full-width block stays a single flow (not columned)', slots.some((s) => s.kind === 'flow' && s.keys.includes(6)), JSON.stringify(slots));

  // Page-4 style: a centered figure between the title and the body must put the
  // body in a different LEAF from the title (so an exercise cannot swallow it).
  const p4: LayoutBox[] = [
    { key: 0, rect: [53, 35, 67, 63], kind: 'text' },    // numeral
    { key: 1, rect: [83, 48, 182, 63], kind: 'text' },   // title
    { key: 5, rect: [194, 80, 419, 417], kind: 'figure' }, // centered figure
    { key: 2, rect: [47, 431, 540, 478], kind: 'text' }, // body
  ];
  const leaves = assignLeaves(xyCut(p4, 10));
  check('LAYOUT numeral and title share a leaf', leaves.get(0) === leaves.get(1), JSON.stringify([...leaves]));
  check('LAYOUT a figure between title and body splits the body into its own leaf', leaves.get(2) !== leaves.get(1), JSON.stringify([...leaves]));

  // Page-7 style: a three-up "Protection | Separation | Observation" block, each
  // column a heading + a body. With the paragraph-gap H-threshold (so the heading
  // row is NOT split off the body row), it must become ONE cols slot with THREE
  // columns, each carrying its own heading+body in reading order.
  const lineH = 9;
  const p7: LayoutBox[] = [
    { key: 0, rect: [47, 448, 95, 459], kind: 'text' },   // Protection heading
    { key: 1, rect: [47, 470, 205, 521], kind: 'text' },  // Protection body
    { key: 2, rect: [226, 448, 276, 459], kind: 'text' }, // Separation heading
    { key: 3, rect: [226, 470, 371, 507], kind: 'text' }, // Separation body
    { key: 4, rect: [404, 448, 461, 459], kind: 'text' }, // Observation heading
    { key: 5, rect: [404, 470, 562, 507], kind: 'text' }, // Observation body
  ];
  const p7slots = flattenLayout(xyCut(p7, lineH, 1.6 * lineH));
  const cols3 = p7slots.find((s) => s.kind === 'cols') as { kind: 'cols'; columns: number[][] } | undefined;
  check('LAYOUT a three-up block becomes one cols slot with three columns', !!cols3 && cols3.columns.length === 3, JSON.stringify(p7slots));
  check('LAYOUT each column keeps its heading WITH its body', !!cols3 && cols3.columns[0].join() === '0,1' && cols3.columns[1].join() === '2,3' && cols3.columns[2].join() === '4,5', JSON.stringify(cols3?.columns));
}

// ---- three columns wrap into nested two-column-sections (in-schema) ----------
{
  const mk = (id: string, pos: number, idx: number, rect: [number, number, number, number]): MappedBlock => ({
    id, position: pos, block_type: 'text', content: { html: '<p>x</p>' }, valid: true, error: null,
    anchor: { page: 7, ordinal: pos }, provenance: { source_page: 7, run_id: 'r', signer: 's' },
    decidedBy: 'rule', rect, colGroup: '7:col1', colIndex: idx, colCount: 3,
  });
  const members = [
    mk('7:0', 0, 0, [47, 448, 95, 459]), mk('7:1', 1, 0, [47, 470, 205, 521]),
    mk('7:2', 2, 1, [226, 448, 276, 459]), mk('7:3', 3, 1, [226, 470, 371, 507]),
    mk('7:4', 4, 2, [404, 448, 461, 459]), mk('7:5', 5, 2, [404, 470, 562, 507]),
  ];
  const { blocks: out, columnsFormed } = groupTwoColumns(members);
  check('COL3 a three-column band forms exactly one column band', columnsFormed === 1, String(columnsFormed));
  const secs = out.filter((b) => b.block_type === 'two-column-section');
  check('COL3 three columns become two nested two-column-sections', secs.length === 2, String(secs.length));
  const outer = secs.find((b) => !b.nested);
  const inner = secs.find((b) => b.nested);
  check('COL3 outer section is top-level and references the inner on its right', !!outer && !!inner && (outer.content as any).right[0] === inner!.id, JSON.stringify(outer?.content));
  check('COL3 outer left is column 0; inner splits columns 1 and 2', !!outer && (outer.content as any).left.join() === '7:0,7:1' && !!inner && (inner.content as any).left.join() === '7:2,7:3' && (inner.content as any).right.join() === '7:4,7:5', JSON.stringify({ o: outer?.content, i: inner?.content }));
  check('COL3 all six members are flagged nested', members.every((m) => m.nested === true));
  check('COL3 both sections validate against the schema', secs.every((s) => s.valid === true), JSON.stringify(secs.map((s) => s.error?.error.code)));
}

// ---- letter-spacing collapse (general: tracked eyebrows across the corpus) ---
{
  check('TRACK "C O N T E N T S" collapses to CONTENTS', collapseLetterSpacing('C O N T E N T S') === 'CONTENTS', collapseLetterSpacing('C O N T E N T S'));
  check('TRACK a real two-word title is untouched', collapseLetterSpacing('Rose Meditation') === 'Rose Meditation', collapseLetterSpacing('Rose Meditation'));
  check('TRACK a tracked two-word label keeps its word break', collapseLetterSpacing('A U R A  L I M I T S') === 'AURA LIMITS', collapseLetterSpacing('A U R A  L I M I T S'));
}

// ---- contents page no longer monopolizes: title/subtitle/quote survive --------
// A page-2-shaped contents page: eyebrow + title + subtitle + rows (one with a
// range numeral) + a footer pull-quote + a tracked running footer + a small bud
// figure. The OLD rule folded the whole page into the contents block and dropped
// the title, subtitle, and quote. The general rule folds ONLY the rows.
{
  const line = (text: string, y0: number, y1: number, fs: number, x0 = 47, x1 = 565) => ({ text, rect: [x0, y0, x1, y1] as const, fontSize: fs, fontName: 'g', runCount: 1 });
  const reg = (ordinal: number, text: string, fs: number, y0: number, y1: number, x0 = 47, x1 = 565, lines?: ReturnType<typeof line>[]): BlockRegion => ({
    ordinal, kind: 'text', text, rect: [x0, y0, x1, y1], fontSize: fs, fontName: 'g',
    lines: lines ?? [line(text, y0, y1, fs, x0, x1)],
  });
  const fig: FigureRegion = { ordinal: 9, kind: 'figure', objId: 'img', source: 'xobject', rect: [293, 158, 320, 198], widthPt: 27, heightPt: 40, pixelsHash: null };
  const geo: PageGeometry = {
    page: 2, widthPt: 612, heightPt: 792,
    textRegions: [
      reg(0, 'C O N T E N T S', 6.5, 63, 69, 47, 96),
      reg(1, 'Rose Meditation', 26, 75, 101, 47, 214),
      reg(2, 'Level 1 — Initiation Course', 13, 113, 126, 47, 192),
      reg(3, 'Getting Ready to Start 3', 9, 197, 207, 66, 565),
      reg(4, '1 Grounding Cord 4', 10.5, 225, 238),
      reg(5, '2 Golden Sun 5', 10.5, 250, 263),
      reg(6, '3–5Aura Limits, Cord Expansion & Renewal 6', 10.5, 275, 288),
      reg(7, 'Roses represent the spirit. They absorb all the energies that do not belong to you.', 10, 713, 739, 60, 548, [line('Roses represent the spirit.', 713, 726, 10, 60, 548), line('They absorb all the energies that do not belong to you.', 727, 739, 10, 60, 548)]),
      reg(8, 'R o s e M e d i t a t i o n', 7, 754, 761, 253, 358),
    ],
    figures: [fig],
    fills: [],
  };
  const m = classifyByRules(geo, { pageIndex: 2, isCoverPage: false });

  check('CONTENTS title region is a heading (not folded away)', m.get(1)?.block_type === 'heading', JSON.stringify(m.get(1)));
  check('CONTENTS subtitle region is a heading (not folded away)', m.get(2)?.block_type === 'heading', JSON.stringify(m.get(2)));
  const titleEyebrow = m.get(0);
  check('CONTENTS the tracked eyebrow attaches to the title, collapsed', titleEyebrow?.block_type === 'heading' && (titleEyebrow.content as any).eyebrow === 'CONTENTS' && (titleEyebrow.content as any).__eyebrowFor === 1, JSON.stringify(titleEyebrow));
  const contents = [...m.values()].find((o) => o.block_type === 'contents' && !(o.content as any).__folded);
  check('CONTENTS block carries the rows', !!contents && Array.isArray((contents.content as any).rows) && (contents.content as any).rows.length >= 3, JSON.stringify(contents?.content));
  const rangeRow = (contents?.content as any)?.rows?.find((r: any) => r.numeral === '3–5');
  check('CONTENTS a range numeral "3–5" is parsed and split off its title', !!rangeRow && rangeRow.title.startsWith('Aura Limits'), JSON.stringify(rangeRow));
  check('CONTENTS the footer pull-quote is NOT folded into contents (kept as text)', m.get(7)?.block_type === 'text', JSON.stringify(m.get(7)));
  check('CONTENTS the tracked running footer is dropped', (m.get(8)?.content as any)?.__drop === true, JSON.stringify(m.get(8)));

  // parseContentsRows reports exactly the row ordinals (3..6), not the title/quote.
  const parsed = parseContentsRows(geo.textRegions, 10, 792);
  check('CONTENTS rowOrdinals exclude title(1)/subtitle(2)/quote(7)/footer(8)', !!parsed && ![1, 2, 7, 8].some((o) => parsed.rowOrdinals.has(o)), JSON.stringify(parsed && [...parsed.rowOrdinals]));

  // a small ornament figure carries its real width fraction (~4% of the page).
  const figMap = classifyFigures([fig], { pageIndex: 2, isCoverPage: false }, 612);
  check('FIGURE small bud records width_pct ≈ 4 (not inflated to full width)', (figMap.get(9)?.content as any)?.width_pct === 4, JSON.stringify(figMap.get(9)?.content));
}

// ---- tint box -> callout (general rule from a real fill, not a page patch) ----
{
  const ln = (text: string, y0: number, y1: number, fs: number, x0 = 60, x1 = 548) => ({ text, rect: [x0, y0, x1, y1] as const, fontSize: fs, fontName: 'g', runCount: 1 });
  const region = (ordinal: number, text: string, fs: number, y0: number, y1: number, x0 = 60, x1 = 548): BlockRegion => ({ ordinal, kind: 'text', text, rect: [x0, y0, x1, y1], fontSize: fs, fontName: 'g', lines: [ln(text, y0, y1, fs, x0, x1)] });

  // A plain body region sitting inside a pale tint box; a second identical-style
  // region with NO box over it. bodySize forced to ~10 by char mass on the boxed one.
  const boxed = region(0, 'Roses represent the spirit. They absorb all the energies that no longer serve you.', 10, 713, 739);
  const loose = region(1, 'A plain paragraph elsewhere on the page with no tint behind it at all here.', 10, 400, 426);
  const geo2 = {
    page: 5, widthPt: 612, heightPt: 792,
    textRegions: [boxed, loose],
    figures: [],
    fills: [{ rect: [55, 708, 553, 744] as const, color: [245, 225, 221] as const }],
  };
  const m2 = classifyByRules(geo2 as any, { pageIndex: 5, isCoverPage: false });
  check('CALLOUT a region inside a tint box becomes a callout', m2.get(0)?.block_type === 'callout', JSON.stringify(m2.get(0)));
  check('CALLOUT the callout body carries the region text as one paragraph', (() => { const b = (m2.get(0)?.content as any)?.body; return b?.content?.length === 1 && b.content[0].content[0].text.startsWith('Roses represent'); })(), JSON.stringify((m2.get(0)?.content as any)?.body));
  check('CALLOUT a region NOT under any box is not a callout', m2.get(1)?.block_type !== 'callout', JSON.stringify(m2.get(1)));

  // isTintBox filters: white ground rejected, hairline rejected, real box kept.
  const big = 612 * 792;
  check('TINTBOX a pale warm box is kept', isTintBox({ rect: [55, 708, 553, 744], color: [245, 225, 221] }, 612, 792), '');
  check('TINTBOX a white page ground is rejected', !isTintBox({ rect: [0, 0, 612, 792], color: [255, 255, 255] }, 612, 792), '');
  check('TINTBOX a 1pt hairline rule is rejected', !isTintBox({ rect: [60, 300, 540, 301], color: [250, 240, 238] }, 612, 792), '');
  check('TINTBOX a near-full-page tint is rejected as ground', !isTintBox({ rect: [0, 0, 612, 700], color: [245, 240, 235] }, 612, 792), String(612 * 700 / big));
}

console.log(failures === 0 ? '\nVERIFY-CLASSIFY-MAP: PASS (all checks green)' : `\nVERIFY-CLASSIFY-MAP: FAIL (${failures} checks failed)`);
process.exit(failures === 0 ? 0 : 1);
