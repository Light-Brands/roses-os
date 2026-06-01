/**
 * Unit verification for AC4 (the model request carries no coordinate) and AC5
 * (a mislabelled region is rejected with the named-error envelope and surfaced,
 * never silently dropped). Pure; no browser, no PDF.
 *
 *   npx tsx scripts/verify-classify-map.ts
 */

import { buildClassifierRequest, FORBIDDEN_REQUEST_KEYS } from '../src/lib/manuals/classify-regions';
import type { BlockRegion } from '../src/lib/manuals/extract-geometry';
import { mapToBlocks, type PageInput, type MappedBlock } from '../src/lib/manuals/map-to-blocks';
import { groupTwoColumns } from '../src/lib/manuals/columns';
import { analyzePageLayout, xyCut, assignLeaves, type LayoutBox } from '../src/lib/manuals/layout';
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
  const text = mk({ id: '6:0', position: 0, block_type: 'numbered-exercise', content: { schema_version: 2, numeral: '3', body: { type: 'doc', content: [] } }, anchor: { page: 6, ordinal: 0 }, rect: [83, 111, 345, 184], colGroup: '6:col1', colSide: 'left' });
  const fig = mk({ id: '6:10', position: 1, block_type: 'captioned-figure', content: { schema_version: 2, src: 'a.png', alt: 'aura' }, anchor: { page: 6, ordinal: 10 }, rect: [389, 40, 539, 265], colGroup: '6:col1', colSide: 'right' });
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
  const twoCol = slots.find((s) => s.kind === 'two-col') as { kind: 'two-col'; left: number[]; right: number[] } | undefined;
  check('LAYOUT side-by-side text/figure becomes one two-col slot', !!twoCol && twoCol.left.includes(0) && twoCol.right.includes(10), JSON.stringify(slots));
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
}

console.log(failures === 0 ? '\nVERIFY-CLASSIFY-MAP: PASS (all checks green)' : `\nVERIFY-CLASSIFY-MAP: FAIL (${failures} checks failed)`);
process.exit(failures === 0 ? 0 : 1);
