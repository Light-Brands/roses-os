/**
 * Unit verification for the deterministic geometry transform (spec 003 T-009a,
 * AC1 + AC2). Runs the pure `extract-geometry.ts` over synthetic raw page
 * extracts that encode the documented behaviors: scrambled content-stream order,
 * x-gap word boundaries, font-bucket region splits, and figure min-area
 * filtering. No browser and no PDF needed; this proves the pure core.
 *
 * Run: node --experimental-strip-types scripts/verify-extract-geometry.ts
 */

import {
  extractPageGeometry,
  deriveReadingOrder,
  runFromRawItem,
  regionContentHash,
  type RawPageExtract,
  type RawTextItem,
} from '../src/lib/manuals/extract-geometry';

let failures = 0;
function check(name: string, cond: boolean, detail = ''): void {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.log(`  FAIL ${name}${detail ? '  -> ' + detail : ''}`);
  }
}

/** Build a raw text item at a top-left (x, yTop) with a given font size + string.
 *  The page is `H` points tall; the transform carries the bottom-left baseline. */
function item(str: string, x: number, yTop: number, size: number, H: number, font = 'f1'): RawTextItem {
  const baselineY = H - (yTop + size); // invert runFromRawItem's flip for a clean round-trip
  return { str, transform: [size, 0, 0, size, x, baselineY], width: str.length * size * 0.5, height: size, fontName: font };
}

// ---- AC2: reading order is derived, not content-stream order ----------------
{
  const H = 800;
  // Content-stream order deliberately scrambled: a later row emitted first, and a
  // right-column run before a left-column run on the same band.
  const raw: RawPageExtract = {
    page: 3,
    widthPt: 600,
    heightPt: H,
    images: [],
    items: [
      item('third line', 40, 300, 14, H), // emitted first, belongs last
      item('B-right', 300, 100, 14, H), // same band as A-left, but to the right
      item('A-left', 40, 100, 14, H),
      item('second line', 40, 200, 14, H),
    ],
  };
  const geo = extractPageGeometry(raw);
  const flatText = geo.textRegions.flatMap((r) => r.lines.map((l) => l.text));
  // Expected reading order: band1 "A-left B-right", then "second line", then "third line".
  check('AC2 first line is the top band, left-to-right', flatText[0] === 'A-left B-right', JSON.stringify(flatText));
  check('AC2 vertical order descends in page order', flatText[1] === 'second line' && flatText[2] === 'third line', JSON.stringify(flatText));

  // deriveReadingOrder over the runs directly: top-band-then-x.
  const runs = raw.items.map((it) => runFromRawItem(it, H));
  const ordered = deriveReadingOrder(runs).map((r) => r.str);
  check('AC2 deriveReadingOrder puts A-left before B-right', ordered.indexOf('A-left') < ordered.indexOf('B-right'), JSON.stringify(ordered));
  check('AC2 deriveReadingOrder ends with third line', ordered[ordered.length - 1] === 'third line', JSON.stringify(ordered));
}

// ---- AC1: byte-identical PageGeometry across two runs ------------------------
{
  const H = 1000;
  const raw: RawPageExtract = {
    page: 2,
    widthPt: 700,
    heightPt: H,
    images: [
      { objId: 'img_big', rect: [100, 100, 400, 400], kind: 'xobject' }, // 300x300, a real figure
      { objId: 'mask_sliver', rect: [10, 10, 30, 600], kind: 'xobject' }, // 20x590, aspect 29:1 -> rejected
      { objId: 'flower', rect: [292, 157, 319, 197], kind: 'xobject' }, // 27x40, the real page-2 decorative flower
    ],
    items: [
      item('Cleanse & Renew', 80, 120, 12, H), // a contents row near the decorative sliver
      item('A HEADING', 80, 60, 30, H), // big font -> its own region
      item('body text one', 80, 160, 12, H),
      item('body text two', 80, 178, 12, H),
    ],
  };
  const a = JSON.stringify(extractPageGeometry(raw));
  const b = JSON.stringify(extractPageGeometry(structuredClone(raw)));
  check('AC1 two runs produce byte-identical PageGeometry', a === b);

  const geo = extractPageGeometry(raw);
  const figIds = geo.figures.map((f) => f.objId);
  check('AC1 aspect filter drops the 29:1 sliver', !figIds.includes('mask_sliver'), JSON.stringify(figIds));
  check('AC3 real small decorative flower (27x40) is kept at its exact rect', figIds.includes('flower'), JSON.stringify(figIds));
  check('AC3 big figure kept', figIds.includes('img_big'), JSON.stringify(figIds));
  check('AC1 region content hash is stable', regionContentHash(geo.textRegions[0]) === regionContentHash(geo.textRegions[0]));
  // The big-font heading separates from the 12pt body by font bucket.
  const headingRegion = geo.textRegions.find((r) => r.text.includes('A HEADING'));
  check('AC1 heading splits from body on font-bucket change', !!headingRegion && !headingRegion.text.includes('body text'), headingRegion?.text);
}

// ---- x-gap-aware token joining ---------------------------------------------
{
  const H = 500;
  const raw: RawPageExtract = {
    page: 1,
    widthPt: 600,
    heightPt: H,
    images: [],
    items: [
      // Two runs on one line with a wide x-gap between them -> a space is inserted.
      { str: '1', transform: [12, 0, 0, 12, 80, H - 100 - 12], width: 8, height: 12, fontName: 'f1' },
      { str: 'Getting Ready', transform: [12, 0, 0, 12, 140, H - 100 - 12], width: 80, height: 12, fontName: 'f1' },
    ],
  };
  const geo = extractPageGeometry(raw);
  const line = geo.textRegions[0]?.lines[0]?.text;
  check('x-gap join inserts a space across a wide gap', line === '1 Getting Ready', JSON.stringify(line));
}

console.log(failures === 0 ? '\nVERIFY-EXTRACT-GEOMETRY: PASS (all checks green)' : `\nVERIFY-EXTRACT-GEOMETRY: FAIL (${failures} checks failed)`);
process.exit(failures === 0 ? 0 : 1);
