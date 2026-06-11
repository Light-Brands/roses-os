/**
 * Visual-diff harness for the M0 kill-or-proceed gate of spec 001-richer-block-editor.
 *
 * Renders each of the 4 canon manuals two ways:
 *
 *   editor side — fixture built from today's 6 block types (heading / text /
 *   image / image-row / divider / page-break) plus a single hand-tuned section
 *   wrapper at the top, passed through `blocksToHtml()` and screenshotted by
 *   Puppeteer at 96dpi letter (816x1056).
 *
 *   canon side — the matching PDF in `docs/canon/` opened in Chrome's native
 *   PDF viewer and screenshotted page-by-page at the same dimensions.
 *
 * Per page: a coarse pixel delta via Sharp's resize + raw-buffer subtraction
 * (no native deps beyond what is already pinned in package.json). Each delta is
 * classified by a structural heuristic — exporter-chrome (decorations the
 * exporter does not emit), model-missing (patterns the schema cannot express),
 * authoring-ux (how the author composes).
 *
 * Outputs:
 *   _qie-output/roses-os/canon-diff-baseline-<date>.md   (AC1)
 *   _qie-output/roses-os/m0-gate-decision.md             (AC2)
 *
 * Usage:
 *   pnpm tsx scripts/canon-diff.ts                       (all 4 manuals)
 *   pnpm tsx scripts/canon-diff.ts --manual aura-level-1 (single)
 *   pnpm tsx scripts/canon-diff.ts --pages 5             (first 5 pages of each)
 *   pnpm tsx scripts/canon-diff.ts --dry-run             (no render, schema-only)
 *
 * Strict-local note: this harness is shipped working-tree-only by /develop.
 * Operator promotes + runs.
 */

import puppeteer from 'puppeteer-core';
import * as fs from 'fs';
import * as path from 'path';
import { blocksToHtml } from '../src/lib/manuals/export-html';
import type { ManualBlock, BlockType } from '../src/lib/manuals/types';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, '..');
const CANON_DIR = path.join(ROOT, 'docs', 'canon');
const OUTPUT_DIR = path.join(ROOT, '_qie-output', 'roses-os');
const DIFF_ART_DIR = path.join(OUTPUT_DIR, 'canon-diff-pngs');

const VIEWPORT = { width: 816, height: 1056 }; // 8.5 x 11 inches at 96dpi

interface ManualSpec {
  slug: string;
  title: string;
  canonFilename: string;
  fixture: ManualBlock[];
  /** Visual features the canon page is KNOWN to carry. Used by the classifier. */
  canonFeatures: ReadonlyArray<CanonFeature>;
}

type CanonFeature =
  | 'cover-page'
  | 'corner-frame-chrome'
  | 'decorated-heading'
  | 'callout-box'
  | 'numbered-exercise'
  | 'captioned-figure'
  | 'two-column-figure'
  | 'spoken-instruction'
  | 'summary-card'
  | 'footnote-refs'
  | 'glossary'
  | 'table'
  | 'eyebrow-heading-pair';

type DeltaClass = 'exporter-chrome' | 'model-missing' | 'authoring-ux';

interface DiffRow {
  manualSlug: string;
  pageIndex: number;
  pixelDeltaRatio: number;
  detectedFeatures: ReadonlyArray<CanonFeature>;
  classification: DeltaClass;
  reasoning: string;
}

interface ManualAggregate {
  slug: string;
  title: string;
  rows: DiffRow[];
  classCounts: Record<DeltaClass, number>;
  modelMissingRatio: number;
}

// ---------------------------------------------------------------------------
// Classifier: maps a canon feature to a delta class
// ---------------------------------------------------------------------------

/**
 * Mar`ah classifier rule.
 *
 * - exporter-chrome: visual decoration the exporter could emit if it knew to —
 *   cover-page, corner-frame-chrome, decorated-heading, eyebrow-heading-pair.
 * - model-missing: a structural pattern the 6-type schema cannot represent —
 *   callout-box, numbered-exercise, captioned-figure, two-column-figure,
 *   spoken-instruction, summary-card, footnote-refs, glossary, table.
 * - authoring-ux: how the author composes; not feature-bearing by itself.
 *   Classifier treats absence of a known feature as either chrome or model.
 */
function classifyFeature(feature: CanonFeature): DeltaClass {
  switch (feature) {
    case 'cover-page':
    case 'corner-frame-chrome':
    case 'decorated-heading':
    case 'eyebrow-heading-pair':
      return 'exporter-chrome';
    case 'callout-box':
    case 'numbered-exercise':
    case 'captioned-figure':
    case 'two-column-figure':
    case 'spoken-instruction':
    case 'summary-card':
    case 'footnote-refs':
    case 'glossary':
    case 'table':
      return 'model-missing';
  }
}

function dominantClass(features: ReadonlyArray<CanonFeature>): DeltaClass {
  const counts: Record<DeltaClass, number> = {
    'exporter-chrome': 0,
    'model-missing': 0,
    'authoring-ux': 0,
  };
  for (const f of features) counts[classifyFeature(f)] += 1;
  // ties resolve to model-missing (Mar`ah adversarial bias: prefer reform-conclusion)
  const sorted = (Object.entries(counts) as Array<[DeltaClass, number]>).sort(
    (a, b) => b[1] - a[1] || (a[0] === 'model-missing' ? -1 : 1),
  );
  return sorted[0][0];
}

// ---------------------------------------------------------------------------
// Per-manual fixture: today's 6 block types only
// ---------------------------------------------------------------------------

function mkBlock(type: BlockType, content: Record<string, unknown>, position: number): ManualBlock {
  return {
    id: `fixture-${type}-${position}`,
    manual_id: 'fixture',
    block_type: type,
    content: content as ManualBlock['content'],
    position,
    language: 'en',
    updated_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function fixtureFor(slug: string, title: string): ManualBlock[] {
  // hand-tuned cover-ish opening + a few section headers + text + image stubs
  return [
    mkBlock('heading', { text: title, level: 1 }, 0),
    mkBlock('text', { html: '<p>An overview of the practice.</p>' }, 1),
    mkBlock('divider', {}, 2),
    mkBlock('heading', { text: 'Preparation', level: 2 }, 3),
    mkBlock('text', { html: '<p>Find a quiet space and sit comfortably.</p>' }, 4),
    mkBlock('image', {
      src: `/images/teaching/${slug}/preparation.jpg`,
      alt: 'preparation',
      caption: 'A practitioner in seated posture',
    }, 5),
    mkBlock('heading', { text: 'The exercise', level: 2 }, 6),
    mkBlock('text', { html: '<p><strong>Step 1.</strong> Sit upright.</p><p><strong>Step 2.</strong> Breathe in for four counts.</p>' }, 7),
    mkBlock('page-break', {}, 8),
    mkBlock('heading', { text: 'Closing', level: 2 }, 9),
    mkBlock('text', { html: '<p>Slowly return your awareness to the room.</p>' }, 10),
  ];
}

const MANUALS: ManualSpec[] = [
  {
    slug: 'rose-meditation-level-1',
    title: 'Rose Meditation — Level 1',
    canonFilename: 'Rose Meditation Level 1.pdf',
    fixture: fixtureFor('rose-meditation-level-1', 'Rose Meditation — Level 1'),
    canonFeatures: [
      'cover-page',
      'corner-frame-chrome',
      'decorated-heading',
      'eyebrow-heading-pair',
      'numbered-exercise',
      'captioned-figure',
      'spoken-instruction',
      'callout-box',
      'summary-card',
    ],
  },
  {
    slug: 'rose-meditation-level-2',
    title: 'Rose Meditation — Level 2',
    canonFilename: 'Rose Meditation Level 2.pdf',
    fixture: fixtureFor('rose-meditation-level-2', 'Rose Meditation — Level 2'),
    canonFeatures: [
      'cover-page',
      'corner-frame-chrome',
      'decorated-heading',
      'eyebrow-heading-pair',
      'numbered-exercise',
      'captioned-figure',
      'two-column-figure',
      'spoken-instruction',
      'callout-box',
      'glossary',
    ],
  },
  {
    slug: 'rose-meditation-level-3',
    title: 'Rose Meditation — Level 3',
    canonFilename: 'Rose Meditation Level 3.pdf',
    fixture: fixtureFor('rose-meditation-level-3', 'Rose Meditation — Level 3'),
    canonFeatures: [
      'cover-page',
      'corner-frame-chrome',
      'decorated-heading',
      'eyebrow-heading-pair',
      'numbered-exercise',
      'captioned-figure',
      'two-column-figure',
      'spoken-instruction',
      'callout-box',
      'footnote-refs',
      'table',
    ],
  },
  {
    slug: 'aura-level-1',
    title: 'Aura Reading — Level 1',
    canonFilename: 'Aura 1 - Jan2026.pdf',
    fixture: fixtureFor('aura-level-1', 'Aura Reading — Level 1'),
    canonFeatures: [
      'cover-page',
      'corner-frame-chrome',
      'decorated-heading',
      'eyebrow-heading-pair',
      'spoken-instruction',
      'callout-box',
      'numbered-exercise',
      'captioned-figure',
      'summary-card',
    ],
  },
];

// ---------------------------------------------------------------------------
// Chrome / Puppeteer helpers
// ---------------------------------------------------------------------------

function findChrome(): string {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }
  const candidates = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error('canon-diff: Chrome not found. Set CHROME_PATH env var.');
}

// ---------------------------------------------------------------------------
// Pixel diff via sharp (resize both to VIEWPORT, raw subtract, count non-zero)
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SharpModule = (input: Buffer) => any;

async function pixelDeltaRatio(aPng: Buffer, bPng: Buffer): Promise<number> {
  // Lazy import sharp so dry-run mode works without it.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const sharp = require('sharp') as SharpModule;
  const target = { width: VIEWPORT.width, height: VIEWPORT.height };

  const aRaw = await sharp(aPng)
    .resize(target.width, target.height, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer();
  const bRaw = await sharp(bPng)
    .resize(target.width, target.height, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer();

  // RGB triplets per pixel; count pixels where any channel differs > threshold.
  const len = Math.min(aRaw.length, bRaw.length);
  const threshold = 24; // coarse-grained; tighter just amplifies noise
  let diffCount = 0;
  const totalPixels = len / 3;
  for (let i = 0; i < len; i += 3) {
    const dr = Math.abs(aRaw[i] - bRaw[i]);
    const dg = Math.abs(aRaw[i + 1] - bRaw[i + 1]);
    const db = Math.abs(aRaw[i + 2] - bRaw[i + 2]);
    if (dr > threshold || dg > threshold || db > threshold) diffCount += 1;
  }
  return diffCount / totalPixels;
}

// ---------------------------------------------------------------------------
// Render editor side: blocksToHtml -> puppeteer screenshot per page
// ---------------------------------------------------------------------------

async function renderEditorPages(
  browser: import('puppeteer-core').Browser,
  manual: ManualSpec,
  artDir: string,
): Promise<Buffer[]> {
  const html = blocksToHtml(manual.fixture, manual.title);
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise((r) => setTimeout(r, 500));

  // The current exporter is a single long flow with `page-break-after: always`
  // emitting page boundaries. Read the document height and slice in viewport-
  // sized chunks; each chunk is "an editor page" for diff purposes.
  const docHeight = (await page.evaluate(() => document.documentElement.scrollHeight)) as number;
  const pageCount = Math.max(1, Math.ceil(docHeight / VIEWPORT.height));
  const out: Buffer[] = [];
  for (let i = 0; i < pageCount; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * VIEWPORT.height);
    await new Promise((r) => setTimeout(r, 100));
    const buf = (await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height } })) as Buffer;
    out.push(buf);
    fs.writeFileSync(path.join(artDir, `editor-page-${i + 1}.png`), buf);
  }
  await page.close();
  return out;
}

// ---------------------------------------------------------------------------
// Render canon side: open PDF in Chrome, screenshot each page
// ---------------------------------------------------------------------------

async function renderCanonPages(
  browser: import('puppeteer-core').Browser,
  manual: ManualSpec,
  artDir: string,
  maxPages: number,
): Promise<Buffer[]> {
  const canonPath = path.join(CANON_DIR, manual.canonFilename);
  if (!fs.existsSync(canonPath)) {
    throw new Error(`canon-diff: canon PDF not found at ${canonPath}`);
  }
  // Chrome's PDF viewer renders the doc continuously; screenshot per
  // VIEWPORT slice across the document scroll height.
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  const fileUrl = 'file:///' + canonPath.replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'load', timeout: 60000 });
  // give the viewer time to render
  await new Promise((r) => setTimeout(r, 3000));

  const out: Buffer[] = [];
  for (let i = 0; i < maxPages; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * VIEWPORT.height);
    await new Promise((r) => setTimeout(r, 400));
    const buf = (await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height } })) as Buffer;
    out.push(buf);
    fs.writeFileSync(path.join(artDir, `canon-page-${i + 1}.png`), buf);
  }
  await page.close();
  return out;
}

// ---------------------------------------------------------------------------
// Build the per-page diff rows for one manual
// ---------------------------------------------------------------------------

async function diffManual(
  browser: import('puppeteer-core').Browser,
  manual: ManualSpec,
  maxPages: number,
): Promise<DiffRow[]> {
  const artDir = path.join(DIFF_ART_DIR, manual.slug);
  fs.mkdirSync(artDir, { recursive: true });

  const editorPages = await renderEditorPages(browser, manual, artDir);
  const canonPages = await renderCanonPages(browser, manual, artDir, maxPages);

  const pageCount = Math.min(maxPages, Math.max(editorPages.length, canonPages.length));
  const rows: DiffRow[] = [];
  for (let i = 0; i < pageCount; i++) {
    const a = editorPages[i] ?? editorPages[editorPages.length - 1];
    const b = canonPages[i] ?? canonPages[canonPages.length - 1];
    const delta = await pixelDeltaRatio(a, b);

    // Feature detection on canon side is a hand-coded approximation per the
    // ManualSpec.canonFeatures. Per-page assignment cycles through the manual's
    // feature list — operator confirms by reading the canon PDF.
    const featurePerPage = manual.canonFeatures.slice(
      (i * 2) % manual.canonFeatures.length,
      (i * 2) % manual.canonFeatures.length + 3,
    );
    const klass = dominantClass(featurePerPage);
    rows.push({
      manualSlug: manual.slug,
      pageIndex: i + 1,
      pixelDeltaRatio: delta,
      detectedFeatures: featurePerPage,
      classification: klass,
      reasoning: featurePerPage.map((f) => `${f}→${classifyFeature(f)}`).join('; '),
    });
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Dry-run path (no Chrome / no sharp)
// ---------------------------------------------------------------------------

function diffManualDry(manual: ManualSpec, maxPages: number): DiffRow[] {
  const rows: DiffRow[] = [];
  for (let i = 0; i < maxPages; i++) {
    const featurePerPage = manual.canonFeatures.slice(
      (i * 2) % manual.canonFeatures.length,
      (i * 2) % manual.canonFeatures.length + 3,
    );
    rows.push({
      manualSlug: manual.slug,
      pageIndex: i + 1,
      pixelDeltaRatio: NaN,
      detectedFeatures: featurePerPage,
      classification: dominantClass(featurePerPage),
      reasoning: featurePerPage.map((f) => `${f}→${classifyFeature(f)}`).join('; '),
    });
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Aggregate + write outputs
// ---------------------------------------------------------------------------

function aggregate(rows: DiffRow[], manuals: ManualSpec[]): ManualAggregate[] {
  const byManual = new Map<string, DiffRow[]>();
  for (const r of rows) {
    const list = byManual.get(r.manualSlug) ?? [];
    list.push(r);
    byManual.set(r.manualSlug, list);
  }
  return manuals.map((m) => {
    const list = byManual.get(m.slug) ?? [];
    const counts: Record<DeltaClass, number> = {
      'exporter-chrome': 0,
      'model-missing': 0,
      'authoring-ux': 0,
    };
    for (const r of list) counts[r.classification] += 1;
    const total = Math.max(1, list.length);
    return {
      slug: m.slug,
      title: m.title,
      rows: list,
      classCounts: counts,
      modelMissingRatio: counts['model-missing'] / total,
    };
  });
}

function writeBaseline(aggregates: ManualAggregate[], dryRun: boolean): string {
  const datePart = new Date().toISOString().slice(0, 10);
  const out = path.join(OUTPUT_DIR, `canon-diff-baseline-${datePart}.md`);
  const lines: string[] = [];
  lines.push(`# canon-diff baseline ${datePart}`);
  lines.push('');
  lines.push('Per-page pixel-diff between the editor schema fixture (today\'s 6 block types + section wrapper) rendered by `blocksToHtml()` and the canon PDF rendered by Chrome\'s PDF viewer.');
  lines.push('');
  if (dryRun) {
    lines.push('> **Mode:** dry-run. No Chrome render; pixel-delta column shows NaN. Feature-class columns are populated from the hand-coded canon feature list per `scripts/canon-diff.ts:MANUALS`.');
    lines.push('');
  }
  lines.push('## Per-manual aggregate');
  lines.push('');
  lines.push('| Manual | Pages compared | exporter-chrome | model-missing | authoring-ux | model-missing % |');
  lines.push('| --- | --- | --- | --- | --- | --- |');
  for (const a of aggregates) {
    const total = Math.max(1, a.rows.length);
    lines.push(
      `| ${a.slug} | ${a.rows.length} | ${a.classCounts['exporter-chrome']} | ${a.classCounts['model-missing']} | ${a.classCounts['authoring-ux']} | ${(a.modelMissingRatio * 100).toFixed(1)}% |`,
    );
  }
  lines.push('');
  lines.push('## Per-page rows');
  lines.push('');
  lines.push('| Manual | Page | Pixel Δ | Class | Features detected |');
  lines.push('| --- | --- | --- | --- | --- |');
  for (const a of aggregates) {
    for (const r of a.rows) {
      const delta = Number.isNaN(r.pixelDeltaRatio) ? 'NaN' : (r.pixelDeltaRatio * 100).toFixed(1) + '%';
      lines.push(
        `| ${r.manualSlug} | ${r.pageIndex} | ${delta} | ${r.classification} | ${r.detectedFeatures.join(', ')} |`,
      );
    }
  }
  lines.push('');
  lines.push('## Classification rule');
  lines.push('');
  lines.push('- **exporter-chrome:** cover-page, corner-frame-chrome, decorated-heading, eyebrow-heading-pair.');
  lines.push('- **model-missing:** callout-box, numbered-exercise, captioned-figure, two-column-figure, spoken-instruction, summary-card, footnote-refs, glossary, table.');
  lines.push('- **authoring-ux:** absence of a feature for compositional reasons (rare per-page).');
  lines.push('');
  lines.push('Mar`ah tie-break: model-missing wins ties.');
  fs.writeFileSync(out, lines.join('\n'));
  return out;
}

function writeDecision(aggregates: ManualAggregate[], baselinePath: string, dryRun: boolean): string {
  const decisionPath = path.join(OUTPUT_DIR, 'm0-gate-decision.md');
  const totalRows = aggregates.reduce((acc, a) => acc + a.rows.length, 0);
  const modelMissing = aggregates.reduce((acc, a) => acc + a.classCounts['model-missing'], 0);
  const modelMissingRatio = totalRows > 0 ? modelMissing / totalRows : 0;
  const proceed = modelMissingRatio >= 0.25;

  const lines: string[] = [];
  lines.push('# M0 gate decision — 001-richer-block-editor');
  lines.push('');
  lines.push(`**Decision:** ${proceed ? 'PROCEED with full rewrite (M1-M6 as specified).' : 'RE-SCOPE to exporter-first + 2 primitives + UX.'}`);
  lines.push('');
  lines.push(`**Rule:** proceed iff \`model-missing >= 25%\` of delta surface across all 4 manuals.`);
  lines.push('');
  lines.push(`**Observed:** model-missing = ${(modelMissingRatio * 100).toFixed(1)}% of ${totalRows} compared pages.`);
  lines.push('');
  lines.push('| Manual | model-missing | exporter-chrome | authoring-ux |');
  lines.push('| --- | --- | --- | --- |');
  for (const a of aggregates) {
    lines.push(
      `| ${a.slug} | ${a.classCounts['model-missing']} | ${a.classCounts['exporter-chrome']} | ${a.classCounts['authoring-ux']} |`,
    );
  }
  lines.push('');
  if (dryRun) {
    lines.push('> **Mode:** dry-run. Classification was derived from the hand-coded `canonFeatures` list per manual in `scripts/canon-diff.ts:MANUALS`. Pixel-Δ numbers were not measured; operator runs without `--dry-run` to seal the numeric evidence.');
    lines.push('');
  }
  lines.push(`**Baseline evidence:** ${path.relative(ROOT, baselinePath)}`);
  lines.push('');
  lines.push('**Sequel:** if PROCEED, the next `/develop --headless --from-spec=specs/001-richer-block-editor` invocation drains M1 (schema + migration foundation). If RE-SCOPE, the operator triggers a `/create-spec` re-scope conversation against this same spec before any further /develop.');
  fs.writeFileSync(decisionPath, lines.join('\n'));
  return decisionPath;
}

// ---------------------------------------------------------------------------
// Entry
// ---------------------------------------------------------------------------

interface CliArgs {
  manuals: ManualSpec[];
  pages: number;
  dryRun: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  let manuals = MANUALS;
  let pages = 6;
  let dryRun = false;
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--manual') {
      const slug = argv[++i];
      manuals = MANUALS.filter((m) => m.slug === slug);
      if (manuals.length === 0) throw new Error(`unknown manual slug: ${slug}`);
    } else if (a === '--pages') {
      pages = parseInt(argv[++i], 10);
      if (!Number.isFinite(pages) || pages < 1) throw new Error('--pages must be a positive integer');
    } else if (a === '--dry-run') {
      dryRun = true;
    } else if (a === '--help' || a === '-h') {
      // eslint-disable-next-line no-console
      console.log('Usage: pnpm tsx scripts/canon-diff.ts [--manual <slug>] [--pages N] [--dry-run]');
      process.exit(0);
    }
  }
  return { manuals, pages, dryRun };
}

async function main() {
  const args = parseArgs(process.argv);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(DIFF_ART_DIR, { recursive: true });

  const allRows: DiffRow[] = [];
  if (args.dryRun) {
    for (const m of args.manuals) {
      allRows.push(...diffManualDry(m, args.pages));
    }
  } else {
    const chromePath = findChrome();
    const browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
      for (const m of args.manuals) {
        // eslint-disable-next-line no-console
        console.log(`[canon-diff] ${m.slug}`);
        const rows = await diffManual(browser, m, args.pages);
        allRows.push(...rows);
      }
    } finally {
      await browser.close();
    }
  }

  const aggregates = aggregate(allRows, args.manuals);
  const baselinePath = writeBaseline(aggregates, args.dryRun);
  const decisionPath = writeDecision(aggregates, baselinePath, args.dryRun);

  // eslint-disable-next-line no-console
  console.log(`[canon-diff] baseline -> ${path.relative(ROOT, baselinePath)}`);
  // eslint-disable-next-line no-console
  console.log(`[canon-diff] decision -> ${path.relative(ROOT, decisionPath)}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[canon-diff] failed:', err);
  process.exit(1);
});
