/**
 * Unit verification for AC4 (the model request carries no coordinate) and AC5
 * (a mislabelled region is rejected with the named-error envelope and surfaced,
 * never silently dropped). Pure; no browser, no PDF.
 *
 *   npx tsx scripts/verify-classify-map.ts
 */

import { buildClassifierRequest, FORBIDDEN_REQUEST_KEYS, collapseLetterSpacing, classifyByRules, classifyFigures, parseContentsRows, attachHeadersToColumns, regionStructure, detectTable } from '../src/lib/manuals/classify-regions';
import type { BlockRegion, FigureRegion, PageGeometry } from '../src/lib/manuals/extract-geometry';
import { isTintBox } from '../src/lib/manuals/extract-geometry';
import { mapToBlocks, type PageInput, type MappedBlock } from '../src/lib/manuals/map-to-blocks';
import { groupTwoColumns } from '../src/lib/manuals/columns';
import { applyFigureOverrides, withFigureOverride, humanTouchedAnchors, figureAnchorKey } from '../src/lib/manuals/figure-overrides';
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

  // Real pipeline: at the DEFAULT 6pt H-threshold the heading row splits off the
  // bodies (flow[...,h0,h1,h2] then cols[[b0],[b1],[b2]]); attachHeadersToColumns
  // must fold each header onto the top of its column. Headers arrive at the TAIL
  // of the flow (flatten pours leading content into the same run), and a leading
  // box (the intro) must remain a flow ahead of the columns.
  const rectOf = (k: number) => p7.find((b) => b.key === k)?.rect;
  const intro = { key: 9, rect: [47, 405, 554, 431] as [number, number, number, number], kind: 'text' as const };
  const withIntro = flattenLayout(xyCut([intro, ...p7], lineH));
  const attached = attachHeadersToColumns(withIntro, (k) => (k === 9 ? intro.rect : rectOf(k)));
  const ac = attached.find((s) => s.kind === 'cols') as { kind: 'cols'; columns: number[][] } | undefined;
  check('ATTACH headers at the flow tail fold onto their columns', !!ac && ac.columns[0].join() === '0,1' && ac.columns[1].join() === '2,3' && ac.columns[2].join() === '4,5', JSON.stringify(attached));
  check('ATTACH a leading box (intro) stays a flow before the columns', attached.some((s) => s.kind === 'flow' && s.keys.includes(9)), JSON.stringify(attached));
  // a flow with no aligned header row is left untouched.
  const noHead = attachHeadersToColumns([{ kind: 'flow', keys: [9] }, { kind: 'cols', columns: [[0, 1], [2, 3]] }], (k) => (k === 9 ? intro.rect : rectOf(k)));
  check('ATTACH leaves an unaligned flow untouched', noHead.length === 2 && noHead[0].kind === 'flow', JSON.stringify(noHead));
}

// ---- D-25 / T-010: a lone small figure is not a column band -----------------
// Regression guard for the tan-rose bug: a narrow centered ornament beside a
// text column must NOT form a two-column band (which would fill:true it to 100%
// and paint the empty sibling as a tan panel). The real two-column and three-up
// pages (6, 7, 8) must keep detecting columns (T-011).
{
  const lineH = 10;
  // A wide text column on the left and a NARROW ornament on the right, overlapping
  // in y. The ornament (~10% of the content width) is not a real column.
  const text = { key: 0, rect: [47, 150, 250, 400] as [number, number, number, number], kind: 'text' as const };
  const bud = { key: 1, rect: [293, 158, 320, 198] as [number, number, number, number], kind: 'figure' as const };
  const slotsLone = analyzePageLayout([text, bud], lineH);
  check('D25 a lone small centered figure does NOT form a column band',
    !slotsLone.some((s) => s.kind === 'cols'), JSON.stringify(slotsLone));

  // Same geometry but a WIDE figure (a real page-8-style figure two-column) MUST
  // still detect a column band.
  const wideFig = { key: 2, rect: [300, 100, 560, 400] as [number, number, number, number], kind: 'figure' as const };
  const slotsWide = analyzePageLayout([text, wideFig], lineH);
  const wideCols = slotsWide.find((s) => s.kind === 'cols') as { kind: 'cols'; columns: number[][] } | undefined;
  check('T011 page-8 style wide figure beside text still detects two columns',
    !!wideCols && wideCols.columns.length === 2, JSON.stringify(slotsWide));

  // Page-6 (two-col) and page-7 (three-up) fixtures above already assert columns
  // still form. The valid-block-count invariant: the lone-figure page yields the
  // figure as a single top-level block (no band, no empty sibling cell), so the
  // block count is unchanged by the guard.
  const mk = (over: Partial<MappedBlock>): MappedBlock => ({
    id: 'x', position: 0, block_type: 'text', content: {}, valid: true, error: null,
    anchor: { page: 2, ordinal: 0 }, provenance: { source_page: 2, run_id: 'r', signer: 's' },
    decidedBy: 'rule', rect: null, ...over,
  });
  // A lone figure left untagged (no colGroup) by the guard groups into zero bands.
  const loneFig = mk({ id: '2:9', block_type: 'captioned-figure', content: { schema_version: 2, src: 'bud.png', alt: 'rose' }, rect: [293, 158, 320, 198] });
  const { columnsFormed: loneCols, blocks: loneOut } = groupTwoColumns([loneFig]);
  check('T011 a lone figure with no colGroup forms zero bands and stays one block',
    loneCols === 0 && loneOut.length === 1 && !loneOut[0].nested, JSON.stringify({ loneCols, n: loneOut.length }));
}

// ---- D-24 / T-008: recipe figure-to-asset override survives a re-run ----------
// A human swaps the figure at anchor 6:10 in the editor. The override is recorded
// keyed by (page, ordinal); the next reconstruction merges it into the extracted
// figureFiles so the swap is preserved instead of clobbered (D-24). The override
// carries the D-12 human-touch marker (T-009).
{
  const extracted = new Map<number, string>([[10, 'fig-geom/figg-p6-o10.png'], [11, 'fig-geom/figg-p6-o11.png']]);
  const overrides = withFigureOverride({}, 6, 10, '/uploads/teacher-aura.png', 'Editor', '2026-06-27T00:00:00Z');
  check('T008 override key is the stable page:ordinal anchor', figureAnchorKey(6, 10) === '6:10', figureAnchorKey(6, 10));
  const mergedP6 = applyFigureOverrides(extracted, overrides, 6);
  check('T008 a re-run on the same page honors the human figure swap',
    mergedP6.get(10) === '/uploads/teacher-aura.png' && mergedP6.get(11) === 'fig-geom/figg-p6-o11.png',
    JSON.stringify([...mergedP6]));
  const mergedP7 = applyFigureOverrides(extracted, overrides, 7);
  check('T008 the override only applies to its own page',
    mergedP7.get(10) === 'fig-geom/figg-p6-o10.png', JSON.stringify([...mergedP7]));
  check('T009 the override carries the human-touch marker for D-18 promotion',
    overrides['6:10'].human === true && overrides['6:10'].replaced_by === 'Editor' && humanTouchedAnchors(overrides).join() === '6:10',
    JSON.stringify(overrides));
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

// ---- paragraph breaks ("punto y aparte") inside a region, by line gaps --------
{
  const L = (text: string, y0: number, y1: number) => ({ text, rect: [47, y0, 540, y1] as const, fontSize: 9.5, fontName: 'g', runCount: 1 });
  // page-4 grounding-cord body: a wide gap before line 2 = paragraph break.
  const twoPara = regionStructure([L('Create a taut grounding cord to the center of the Earth.', 430.8, 440.3), L('The cord eliminates distractions and blockages. It brings', 451.8, 461.3), L('security, stability and helps clear energies.', 468.3, 477.8)]);
  check('PARA a wide inter-line gap splits a region into two paragraphs', twoPara.length === 2 && twoPara[0].kind === 'p' && (twoPara[0] as any).text.endsWith('Earth.') && (twoPara[1] as any).text.startsWith('The cord'), JSON.stringify(twoPara));
  // page-2 pull-quote: two wrapped lines, uniform gap = ONE paragraph.
  const onePara = regionStructure([L("Roses represent the spirit. They absorb all the energies that don't belong to you or that no longer", 713, 726), L('serve your present moment. We can create and explode them as needed.', 727, 740)]);
  check('PARA a wrapped single paragraph stays one paragraph', onePara.length === 1 && onePara[0].kind === 'p', JSON.stringify(onePara));

  // page-6 ex5 body: intro paragraph + three indented single-line bullets -> a ul.
  const li = (text: string, y0: number, y1: number, x0: number) => ({ text, rect: [x0, y0, x0 + 120, y1] as const, fontSize: 9.5, fontName: 'g', runCount: 1 });
  const withList = regionStructure([
    li('Using your imagination, cut the grounding cord whenever you need to. This tool', 573, 582, 83),
    li('will always be the same and become more powerful every time you use it.', 589, 599, 83),
    li('Cut the old cord.', 613, 623, 95),
    li('Create a new cord.', 633, 642, 95),
    li('Expand the cord sideways to the width of the Aura every time you create one.', 652, 662, 95),
  ]);
  const ul = withList.find((b) => b.kind === 'ul') as { kind: 'ul'; items: string[] } | undefined;
  check('LIST a run of indented lines becomes a bullet list with one item per line', !!ul && ul.items.length === 3 && ul.items[0] === 'Cut the old cord.', JSON.stringify(withList));
  check('LIST the un-indented intro stays a paragraph before the list', withList[0].kind === 'p' && (withList[0] as any).text.startsWith('Using your imagination'), JSON.stringify(withList[0]));
}

// ---- cover folds every line, centered, with the real size hierarchy ----------
{
  const ln = (text: string, y0: number, y1: number, fs: number, x0 = 220, x1 = 392) => ({ text, rect: [x0, y0, x1, y1] as const, fontSize: fs, fontName: 'g', runCount: 1 });
  const reg = (ordinal: number, text: string, fs: number, y0: number, y1: number): BlockRegion => ({ ordinal, kind: 'text', text, rect: [220, y0, 392, y1], fontSize: fs, fontName: 'g', lines: [ln(text, y0, y1, fs)] });
  const geo = {
    page: 1, widthPt: 612, heightPt: 792,
    textRegions: [
      reg(0, 'C O M P A N Y', 6.5, 60, 67),
      reg(1, 'Big Title', 36, 200, 240),
      reg(2, 'A subtitle here', 15, 250, 266),
      reg(3, 'Teachings by Someone', 9, 400, 410),
      reg(4, 'a small closing note', 7, 700, 710),
    ],
    figures: [],
    fills: [],
  };
  const m = classifyByRules(geo as any, { pageIndex: 1, isCoverPage: true });
  const cover = m.get(1);
  check('COVER the title region is the cover block', cover?.block_type === 'cover' && (cover.content as any).title === 'Big Title', JSON.stringify(cover?.content));
  check('COVER is centered + carries subtitle + eyebrow', !!cover && (cover.content as any).align === 'center' && (cover.content as any).subtitle === 'A subtitle here' && (cover.content as any).eyebrow === 'COMPANY', JSON.stringify(cover?.content));
  const credits = (cover?.content as any)?.credits as Array<{ text: string; sizePt: number }> | undefined;
  check('COVER remaining lines become credits with their real size', !!credits && credits.length === 2 && credits[0].sizePt === 9 && credits[1].sizePt === 7, JSON.stringify(credits));
  check('COVER every non-title region is folded (none spills as its own block)', [0, 2, 3, 4].every((o) => (m.get(o)?.content as any)?.__folded === true), JSON.stringify([0, 2, 3, 4].map((o) => m.get(o)?.content)));
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

// ---- D-19 table: >=3 evenly spaced horizontal rules + >=2 columns -> table ----
{
  const ln = (text: string, y0: number, y1: number, fs: number, x0: number, x1: number) => ({ text, rect: [x0, y0, x1, y1] as const, fontSize: fs, fontName: 'g', runCount: 1 });
  const reg = (ordinal: number, text: string, y0: number, y1: number, x0: number, x1: number): BlockRegion =>
    ({ ordinal, kind: 'text', text, rect: [x0, y0, x1, y1], fontSize: 9, fontName: 'g', lines: [ln(text, y0, y1, 9, x0, x1)] });
  // Three evenly spaced horizontal fill-rules (pitch 24) cut a 3-row grid; two text
  // columns (left edges 80 and 320). Mirrors the L3 page-9 label-value grid shape.
  const geoT: PageGeometry = {
    page: 9, widthPt: 612, heightPt: 792,
    textRegions: [
      reg(0, 'Label A', 183, 193, 80, 160), reg(1, 'Value A', 183, 193, 320, 420),
      reg(2, 'Label B', 208, 218, 80, 160), reg(3, 'Value B', 208, 218, 320, 420),
      reg(4, 'Label C', 232, 242, 80, 160), reg(5, 'Value C', 232, 242, 320, 420),
    ],
    figures: [],
    fills: [
      { rect: [80, 200, 540, 202], color: [40, 40, 40] },
      { rect: [80, 224, 540, 226], color: [40, 40, 40] },
      { rect: [80, 248, 540, 250], color: [40, 40, 40] },
    ],
  };
  const t = detectTable(geoT);
  check('TABLE D-19 grid is detected', !!t, JSON.stringify(t));
  check('TABLE has 3 rows x 2 columns', !!t && (t.content as any).rows.length === 3 && (t.content as any).rows[0].length === 2, JSON.stringify((t?.content as any)?.rows));
  check('TABLE cells read in row/column order', !!t && (t.content as any).rows[0].join('|') === 'Label A|Value A' && (t.content as any).rows[2].join('|') === 'Label C|Value C', JSON.stringify((t?.content as any)?.rows));
  // classifyByRules emits exactly one table block at the first cell ordinal; cells fold.
  const m = classifyByRules(geoT, { pageIndex: 9, isCoverPage: false });
  const anchor = m.get(0);
  check('TABLE classifyByRules emits a table at the anchor', anchor?.block_type === 'table' && !(anchor.content as any).__folded, JSON.stringify(anchor));
  check('TABLE the other cell regions are folded into the table', [1, 2, 3, 4, 5].every((o) => (m.get(o)?.content as any)?.__folded === true), JSON.stringify([1, 2, 3, 4, 5].map((o) => m.get(o)?.block_type)));
  // A page with no rule fills never produces a table (no false positives).
  const geoNone: PageGeometry = { ...geoT, fills: [] };
  check('TABLE a page with no horizontal rules yields no table', detectTable(geoNone) === null, JSON.stringify(detectTable(geoNone)));
  // Two rules only (below the >=3 threshold) is not a table.
  const geoTwo: PageGeometry = { ...geoT, fills: geoT.fills.slice(0, 2) };
  check('TABLE fewer than three rules is not a table', detectTable(geoTwo) === null, '');
}

// ---- D-19 table by gridded text in a container box (the real L3 page-9 shape) --
{
  const ln = (text: string, y0: number, y1: number, x0: number, x1: number) => ({ text, rect: [x0, y0, x1, y1] as const, fontSize: 9, fontName: 'g', runCount: 1 });
  const reg = (ordinal: number, text: string, y0: number, y1: number, x0: number, x1: number): BlockRegion =>
    ({ ordinal, kind: 'text', text, rect: [x0, y0, x1, y1], fontSize: 9, fontName: 'g', lines: [ln(text, y0, y1, x0, x1)] });
  // One container tint box; text in 3 columns x 3 rows (pitch 40). No drawn rules.
  const geoG: PageGeometry = {
    page: 9, widthPt: 612, heightPt: 792,
    textRegions: [
      reg(0, 'Intention', 215, 225, 60, 120), reg(1, 'I want', 215, 225, 250, 360), reg(2, '7th chakra', 215, 225, 440, 540),
      reg(3, 'Thought', 255, 265, 60, 120), reg(4, 'I think', 255, 265, 250, 360), reg(5, '6th chakra', 255, 265, 440, 540),
      reg(6, 'Word', 295, 305, 60, 120), reg(7, 'I say', 295, 305, 250, 360), reg(8, '5th chakra', 295, 305, 440, 540),
    ],
    figures: [],
    fills: [{ rect: [40, 200, 560, 320], color: [63, 62, 60] }],
  };
  const t = detectTable(geoG);
  check('TABLE-GRID a container box with gridded text is detected', !!t, JSON.stringify(t));
  check('TABLE-GRID has 3 rows x 3 columns', !!t && (t.content as any).rows.length === 3 && (t.content as any).rows[0].length === 3, JSON.stringify((t?.content as any)?.rows));
  check('TABLE-GRID cells read in row/column order', !!t && (t.content as any).rows[0].join('|') === 'Intention|I want|7th chakra' && (t.content as any).rows[2].join('|') === 'Word|I say|5th chakra', JSON.stringify((t?.content as any)?.rows));
  // A single-column callout tint box (the L1 pull-quote shape) is NOT a table.
  const geoCallout: PageGeometry = {
    page: 5, widthPt: 612, heightPt: 792,
    textRegions: [reg(0, 'Roses represent the spirit', 715, 725, 60, 540), reg(1, 'they absorb energies', 730, 740, 60, 540)],
    figures: [],
    fills: [{ rect: [55, 708, 553, 744], color: [245, 225, 221] }],
  };
  check('TABLE-GRID a one-column callout box is not a table', detectTable(geoCallout) === null, JSON.stringify(detectTable(geoCallout)));
}

console.log(failures === 0 ? '\nVERIFY-CLASSIFY-MAP: PASS (all checks green)' : `\nVERIFY-CLASSIFY-MAP: FAIL (${failures} checks failed)`);
process.exit(failures === 0 ? 0 : 1);
