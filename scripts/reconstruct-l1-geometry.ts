/**
 * Deterministic Level 1 reconstruction (spec 003 T-VER, AC10 + AC11). The
 * production replacement for the model-box mechanism in reconstruct-l1-sample.ts.
 *
 * Pipeline per page:
 *   E2a  extract-geometry  (pure pdf.js, no model)  -> PageGeometry
 *   T-FIG figure pixels    (native XObject PNG | sharp rect crop)
 *   E2b  classify-regions  (rule-first; model only for residue; per-region cache)
 *   E3   map-to-blocks     (assemble + validateBlockInput write gate)
 *        provenance sidecar (D-12)
 *   render the side-by-side canon|reconstruction preview
 *
 * Offline + strict-local: the geometry and figures need no network; the model is
 * a deterministic stub by default (--model gemini opts into the live classifier
 * when GOOGLE_GEMINI_API_KEY is set). No database is ever written.
 *
 *   npx tsx scripts/reconstruct-l1-geometry.ts [N] [--model gemini] [--reuse-cache]
 */

import * as fs from 'fs';
import * as path from 'path';
import { createRequire } from 'module';
import {
  extractPageGeometry,
  type RawPageExtract,
  type RawImageOp,
  type FigureRegion,
} from '../src/lib/manuals/extract-geometry';
import { extractFigurePixels } from '../src/lib/manuals/figure-extract';
import {
  classifyPage,
  type RegionCache,
  type ModelClassifier,
  type ClassifierRequest,
  type ClassifierResponse,
  type ClassifiedRegion,
  type ClassifyCounts,
} from '../src/lib/manuals/classify-regions';
import { mapToBlocks, summarizeBlocks, type PageInput, type MappedBlock } from '../src/lib/manuals/map-to-blocks';
import { groupTwoColumns } from '../src/lib/manuals/columns';
import { buildProvenanceSidecar, sidecarFileName } from '../src/lib/manuals/provenance';

const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = '_qie-output/roses-os/reconstruction/l1-en';
const RECON = path.join(OUT, 'reconstruct'); // sidecar dir
const RUN_ID = 'deterministic-extraction-geometry-20260531';
const SIGNER = 'quinn@develop';
const MANUAL = 'rose-meditation-level-1';
const LANG = 'en';

const args = process.argv.slice(2);
const N = Math.max(1, parseInt(args.find((a) => /^\d+$/.test(a)) || '10', 10));
const USE_GEMINI = args.includes('--model') && args[args.indexOf('--model') + 1] === 'gemini';
const REUSE_CACHE = args.includes('--reuse-cache');

// ----- model classifiers -----------------------------------------------------

/** Deterministic stub: any residue the rules could not decide is labelled `text`.
 *  It is a real ModelClassifier from the pipeline's view (consulted only for the
 *  residue, counted as a model call), so it exercises AC6/AC7 mechanics offline
 *  without a network dependency. The request it receives carries NO coordinate
 *  (AC4), guaranteed by buildClassifierRequest. */
class StubClassifier implements ModelClassifier {
  calls = 0;
  async classify(req: ClassifierRequest): Promise<ClassifierResponse> {
    this.calls += 1;
    const html = req.text.split('\n').filter(Boolean).map((t) => `<p>${t.replace(/[&<>]/g, '')}</p>`).join('');
    return { block_type: 'text', content: { html } };
  }
}

/** Live Gemini classifier. Same interface; the request still carries no
 *  coordinate. Used only with --model gemini and a key present. */
class GeminiClassifier implements ModelClassifier {
  calls = 0;
  key = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  async classify(req: ClassifierRequest): Promise<ClassifierResponse> {
    this.calls += 1;
    const sys = `Classify this pre-extracted manual region into ONE block_type from:
heading,text,numbered-exercise,spoken-instruction,callout,quote,table,glossary,footnote.
Return ONLY JSON {"block_type":"...","content":{...}}. NEVER return a box, rect, or any coordinate.
content shapes: text {"html":"<p>..</p>"}; numbered-exercise {"schema_version":2,"numeral":"1","body":{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"..."}]}]}};
quote {"schema_version":2,"body":<doc>}; callout {"schema_version":2,"variant":"note","body":<doc>}; spoken-instruction {"schema_version":2,"spoken":"..."}.
Preserve wording exactly.`;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${this.key}`;
    const body = { contents: [{ parts: [{ text: `${sys}\n\nREGION (fontSize ${req.fontSize}):\n${req.text}` }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0 } };
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`gemini ${res.status}`);
    const j = (await res.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const text = j.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
    const parsed = JSON.parse(text) as ClassifierResponse;
    return { block_type: parsed.block_type, content: parsed.content ?? {} };
  }
}

// ----- figure native-png correlation ----------------------------------------

interface RawImage { objId: string | null; rect: [number, number, number, number]; kind: 'xobject' | 'vector'; png: { dataUrl: string; naturalW: number; naturalH: number } | null }

function nativePngFor(region: FigureRegion, rawImages: RawImage[]): { dataUrl: string; naturalW: number; naturalH: number } | null {
  // Match by objId + approximate rect (rects are rounded; allow 1pt slack).
  const near = (a: number, b: number) => Math.abs(a - b) <= 1.5;
  const hit = rawImages.find((im) => im.objId === region.objId && near(im.rect[0], region.rect[0]) && near(im.rect[1], region.rect[1]));
  return hit?.png ?? null;
}

// ----- preview ---------------------------------------------------------------

function esc(s: unknown): string {
  return String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
}

function blockInner(b: MappedBlock): string {
  const c = b.content as Record<string, any>;
  switch (b.block_type) {
    case 'cover': {
      // Credits/edition/disclaimer lines render centered at a size scaled from
      // their real point size, so the cover keeps the canon's hierarchy.
      const credits = Array.isArray(c.credits) ? c.credits as Array<{ text: string; sizePt: number }> : [];
      const creditPx = (pt: number) => Math.max(9, Math.min(15, Math.round((pt || 9) * 1.35)));
      const creditsHtml = credits.length
        ? `<div class="cover-rule"></div>${credits.map((cr) => `<div class="credit" style="font-size:${creditPx(cr.sizePt)}px">${esc(cr.text)}</div>`).join('')}`
        : (c.author ? `<div class="byline">${esc(c.author)}</div>` : '');
      return `${c.eyebrow ? `<div class="eyebrow">${esc(c.eyebrow)}</div>` : ''}${c.cover_image ? `<img class="coverimg" src="${esc(c.cover_image)}"/>` : ''}<div class="title">${esc(c.title)}</div>${c.subtitle ? `<div class="subtitle">${esc(c.subtitle)}</div>` : ''}${creditsHtml}`;
    }
    case 'contents':
      return `${c.eyebrow ? `<div class="eyebrow">${esc(c.eyebrow)}</div>` : ''}<ul class="toc">${(c.rows || []).map((r: any) => `<li><span class="num">${esc(r.numeral || '')}</span><span class="tit">${esc(r.title)}</span><span class="pg">${esc(r.page || '')}</span></li>`).join('')}</ul>`;
    case 'heading':
      return `${c.eyebrow ? `<div class="eyebrow">${esc(c.eyebrow)}</div>` : ''}<div class="h h${c.level || 2}">${esc(c.text)}</div>`;
    case 'text':
      return `<div class="prose">${c.html || ''}</div>`;
    case 'captioned-figure': {
      // A figure INSIDE a column fills its cell — the column's proportion already
      // encodes the figure's on-page width (a 36%-of-page figure sits in a
      // 36%-wide cell). A top-level figure uses its own width_pct so a small
      // ornament stays small. Sizing by width_pct inside a cell shrinks twice.
      const pct = b.nested ? 100 : typeof c.width_pct === 'number' ? Math.min(90, Math.max(2, c.width_pct)) : 60;
      const style = ` style="width:${pct}%"`;
      return `${c.src ? `<img src="${esc(c.src)}"${style}/>` : `<div class="figph">figura</div>`}${c.caption ? `<div class="cap">${esc(c.caption)}</div>` : ''}`;
    }
    case 'numbered-exercise':
      return `<div class="ex"><span class="numeral">${esc(c.numeral)}</span><div>${c.title ? `<strong>${esc(c.title)}</strong>` : ''}${docText(c.body)}</div></div>`;
    case 'spoken-instruction':
      return `<div class="spoken">&ldquo;${esc(c.spoken)}&rdquo;</div>`;
    case 'quote':
      return `<blockquote>${docText(c.body)}</blockquote>`;
    case 'callout':
      return `<div class="callout">${docText(c.body)}</div>`;
    default:
      return `<div class="prose">${esc(JSON.stringify(c))}</div>`;
  }
}
function docText(doc: any): string {
  const out: string[] = [];
  (doc?.content || []).forEach((p: any) => {
    const t = (p.content || []).map((n: any) => esc(n.text || '')).join('');
    if (t) out.push(`<p>${t}</p>`);
  });
  return out.join('');
}

function renderBlock(b: MappedBlock, byId: Map<string, MappedBlock>): string {
  const flag = b.valid ? '' : `<span class="bad" title="${esc(b.error?.error.message)}">INVALID</span>`;
  const tag = `${esc(b.block_type)} · ${esc(b.decidedBy)} ${flag}`;
  if (b.block_type === 'two-column-section') {
    const c = b.content as { left: string[]; right: string[]; proportions?: [number, number] };
    const [lp, rp] = c.proportions ?? [1, 1];
    const col = (ids: string[]) => ids.map((id) => byId.get(id)).filter(Boolean).map((child) => renderBlock(child as MappedBlock, byId)).join('');
    return `<div class="blk two-column-section"><div class="bt">${tag}</div><div class="twocol" style="grid-template-columns:${lp}fr ${rp}fr">
<div class="colcell">${col(c.left)}</div><div class="colcell">${col(c.right)}</div></div></div>`;
  }
  return `<div class="blk ${esc(b.block_type)}${b.valid ? '' : ' invalid'}"><div class="bt">${tag}</div>${blockInner(b)}</div>`;
}

function buildPreview(perPage: Array<{ page: number; blocks: MappedBlock[]; counts: ClassifyCounts }>): void {
  const byId = new Map<string, MappedBlock>();
  for (const p of perPage) for (const b of p.blocks) byId.set(b.id, b);
  const sections = perPage.map((p) => {
    const tag = String(p.page).padStart(2, '0');
    // Skip nested children at top level; they render inside their column.
    const blocks = p.blocks.filter((b) => !b.nested).map((b) => renderBlock(b, byId)).join('');
    const cc = p.counts;
    return `<section class="page"><div class="pn">Page ${p.page} — rules ${cc.rule}, model ${cc.model}, cache ${cc.cache}, undecided ${cc.undecided}</div><div class="cols">
<div class="side canon"><div class="lbl">canon</div><img src="canon-page-${tag}.png"/></div>
<div class="side recon"><div class="lbl">deterministic reconstruction (linear v2 blocks, real figures cropped from the PDF)</div>${blocks}</div>
</div></section>`;
  }).join('');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>L1 deterministic reconstruction</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;600&display=swap');
:root{--ink:#3a2f28;--terra:#b56a4a;--warm:#fbf7f1;--line:#e7ddd0}
*{box-sizing:border-box}body{margin:0;background:#e9e0d3;color:var(--ink);font-family:'Cormorant Garamond',Georgia,serif}
header{position:sticky;top:0;background:#fff;border-bottom:1px solid var(--line);padding:12px 20px;font-family:Inter;z-index:9}
header h1{margin:0;font-size:17px}header .s{font-size:12px;color:#8a7a6a}
.page{max-width:1500px;margin:24px auto;background:#fff;border:1px solid var(--line);border-radius:10px;overflow:hidden}
.pn{font-family:Inter;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#a0896f;padding:9px 16px;border-bottom:1px solid var(--line)}
.cols{display:grid;grid-template-columns:1fr 1fr;align-items:stretch}
.side{padding:18px}.side.recon{border-left:1px solid var(--line);background:var(--warm)}
.side.canon{display:flex;flex-direction:column}.side.canon img{margin-top:auto;margin-bottom:auto}
.lbl{font-family:Inter;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#bbab98;margin-bottom:10px}
.side.canon img{width:100%;border:1px solid var(--line);display:block}
.blk{margin:0 0 11px}
.bt{display:none;font-family:Inter;font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:#cdbfad;margin-bottom:3px}
body.tags .bt{display:block}
.bad{color:#c0492b;font-weight:600}
.blk.invalid{outline:1px dashed #d9b3a6;outline-offset:4px}
.eyebrow{font-family:Inter;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--terra);margin-bottom:4px}
.cover{text-align:center;padding:10px 0}.cover .coverimg{max-width:58%;max-height:330px;width:auto;height:auto;display:block;margin:8px auto 14px}.cover .title{font-size:38px;font-weight:600}.cover .subtitle{font-style:italic;font-size:20px;color:#7a6553}.cover .byline{font-family:Inter;font-size:12px;color:#9a8a78;white-space:pre-line;margin-top:10px}
.cover .cover-rule{width:42px;height:1px;background:var(--terra);opacity:.5;margin:16px auto}.cover .credit{color:#8a7a6a;margin:4px 0;line-height:1.35}.cover .credit:last-child{color:#b08a7a;font-style:italic;margin-top:10px}
.h{font-weight:600}.h1{font-size:30px}.h2{font-size:23px}.h3{font-size:18px}
.prose{font-size:16px;line-height:1.4}.prose p{margin:0 0 .5em}.prose p:last-child{margin-bottom:0}.prose ul{margin:.3em 0 .5em;padding-left:1.5em}.prose li{margin:.12em 0}
.toc{list-style:none;margin:0;padding:0}.toc li{display:flex;gap:10px;align-items:baseline;border-bottom:1px solid var(--line);padding:3px 0}.toc .num{color:var(--terra);min-width:28px}.toc .tit{flex:1;font-size:15px;line-height:1.3}.toc .pg{color:#9a8a78}
.ex{display:flex;gap:14px;align-items:flex-start}.ex .numeral{color:var(--terra);font-weight:600;font-size:38px;line-height:.9}.ex>div{font-size:17px;line-height:1.55}
.spoken{font-size:20px;font-style:italic;color:#5a463a;border-left:3px solid var(--terra);padding-left:14px;margin:6px 0}
.callout{background:#fbeee9;border-left:3px solid var(--terra);border-radius:4px;padding:10px 16px;font-size:14px;font-style:italic;color:#7a5a50;line-height:1.4}.callout p{margin:0 0 .4em}.callout p:last-child{margin-bottom:0}
blockquote{margin:0;font-size:20px;font-style:italic;border-left:3px solid var(--terra);padding-left:14px}
.captioned-figure{text-align:center}.captioned-figure img{max-width:90%;max-height:360px;width:auto;height:auto;border:1px solid var(--line);border-radius:4px;display:inline-block;margin:4px auto}.cap{font-style:italic;color:var(--terra);font-size:15px;margin-top:6px}
.figph{display:inline-block;background:#efe7da;border:1px dashed #c9b9a6;border-radius:4px;padding:4px 10px;color:#b6a690;font-family:Inter;font-size:10px;text-transform:uppercase}
.twocol{display:grid;gap:18px;align-items:center}.colcell{min-width:0}.colcell .blk{margin-bottom:0}.two-column-section>.bt{color:#c2a6d0}
@media(max-width:1100px){.cols{grid-template-columns:1fr}.side.recon{border-left:0;border-top:1px solid var(--line)}}
</style></head><body>
<header><button id="tagtog" onclick="document.body.classList.toggle('tags')" style="float:right;font-family:Inter;font-size:11px;border:1px solid var(--line);background:#fff;color:#8a7a6a;border-radius:6px;padding:5px 10px;cursor:pointer">block tags</button><h1>Rose Meditation Level 1 — deterministic reconstruction (${perPage.length} pages)</h1><div class="s">Left: canon page. Right: linear v2 blocks. Figure pixels and reading order come from pdf.js geometry, never a model box. The model classifies only the residue the rules cannot decide. Working tree, prod untouched.</div></header>
${sections}</body></html>`;
  fs.writeFileSync(path.join(OUT, 'preview-geometry.html'), html);
}

// ----- main ------------------------------------------------------------------

async function main(): Promise<void> {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(RECON, { recursive: true });
  const figDir = path.join(OUT, 'fig-geom');
  fs.mkdirSync(figDir, { recursive: true });

  const cachePath = path.join(OUT, 'region-cache.json');
  const cache: RegionCache = REUSE_CACHE && fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf-8')) : {};
  const stub = new StubClassifier();
  const gemini = new GeminiClassifier();
  const model: ModelClassifier = USE_GEMINI && gemini.key ? gemini : stub;

  const htmlUrl = 'file:///' + path.resolve('scripts/vendor/pdfjs/extract.html').replace(/\\/g, '/');
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--allow-file-access-from-files', '--disable-web-security'] });

  const perPage: Array<{ page: number; blocks: MappedBlock[]; counts: ClassifyCounts }> = [];
  const pageInputs: PageInput[] = [];
  let determinismOk = true;
  let figuresWhole = 0;

  try {
    const page = await browser.newPage();
    page.on('pageerror', (e: Error) => console.log('  pageerror:', e.message));
    await page.goto(htmlUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForFunction('window.__ready===true', { timeout: 20000 });

    for (let i = 1; i <= N; i++) {
      const tag = String(i).padStart(2, '0');
      const pdf = path.join(OUT, `canon-page-${tag}.pdf`);
      const raster = path.join(OUT, `canon-page-${tag}.png`);
      if (!fs.existsSync(pdf)) { console.log(`page ${i}: no pdf, skip`); continue; }
      const b64 = fs.readFileSync(pdf).toString('base64');
      const rawExtract = await page.evaluate((b: string) => (window as any).extractGeometry(b), b64) as { widthPt: number; heightPt: number; items: any[]; images: RawImage[]; fills?: Array<{ rect: [number, number, number, number]; color: [number, number, number] }> };

      const raw: RawPageExtract = {
        page: i,
        widthPt: rawExtract.widthPt,
        heightPt: rawExtract.heightPt,
        items: rawExtract.items,
        images: rawExtract.images.map((im): RawImageOp => ({ objId: im.objId, rect: im.rect, kind: im.kind })),
        fills: (rawExtract.fills ?? []).map((f) => ({ rect: f.rect, color: f.color })),
      };

      // AC1: byte-identical geometry across two pure extractions of the same raw.
      const g1 = JSON.stringify(extractPageGeometry(raw));
      const g2 = JSON.stringify(extractPageGeometry(structuredClone(raw)));
      if (g1 !== g2) { determinismOk = false; console.log(`  page ${i}: NON-DETERMINISTIC geometry`); }
      const geo = extractPageGeometry(raw);

      // figures: extract pixels (native primary, sharp fallback), fill hashes.
      const figureFiles = new Map<number, string>();
      for (const f of geo.figures) {
        const fileName = `figg-p${tag}-o${f.ordinal}.png`;
        const res = await extractFigurePixels({
          region: f,
          nativePng: nativePngFor(f, rawExtract.images),
          rasterPath: raster,
          pageWidthPt: raw.widthPt,
          pageHeightPt: raw.heightPt,
          outDir: figDir,
          fileName,
        });
        f.pixelsHash = res.pixelsHash;
        figureFiles.set(f.ordinal, path.join('fig-geom', res.file).replace(/\\/g, '/'));
        // AC11 whole-figure heuristic: the extracted figure should be a real,
        // non-degenerate image (native path keeps native res; crop keeps the rect).
        if (res.naturalWidth >= 32 && res.naturalHeight >= 32) figuresWhole += 1;
      }

      // classify (rule -> cache -> model) + counts (AC7), thumbnails null for stub.
      const { regions, counts } = await classifyPage(geo, { ctx: { pageIndex: i, isCoverPage: i === 1 }, cache, model, thumbnailFor: () => null });

      pageInputs.push({ page: i, regions: regions as ClassifiedRegion[], figureFiles });
      fs.writeFileSync(path.join(OUT, `geometry-page-${tag}.json`), JSON.stringify(geo, null, 2));
      console.log(`  page ${i}: ${geo.textRegions.length} text regions, ${geo.figures.length} figures | rules ${counts.rule}, model ${counts.model}, cache ${counts.cache}, undecided ${counts.undecided}`);
      perPage.push({ page: i, blocks: [], counts });
    }
  } finally {
    await browser.close();
  }

  // map -> validate (AC5)
  const mapped = mapToBlocks(pageInputs, { runId: RUN_ID, signer: SIGNER });
  // detect side-by-side figure+text and wrap in two-column-section blocks
  const { blocks, columnsFormed } = groupTwoColumns(mapped);
  const summary = summarizeBlocks(blocks);
  // attach blocks to their page for the preview
  for (const pp of perPage) pp.blocks = blocks.filter((b) => b.anchor.page === pp.page);

  // provenance sidecar (D-12, AC8)
  const sidecar = buildProvenanceSidecar(blocks, MANUAL, LANG, RUN_ID);
  fs.writeFileSync(path.join(RECON, sidecarFileName(MANUAL, LANG)), JSON.stringify(sidecar, null, 2));

  // persist the region cache (AC6: a re-run with --reuse-cache reads it back)
  fs.writeFileSync(path.join(OUT, 'region-cache.json'), JSON.stringify(cache, null, 2));

  buildPreview(perPage);

  const totalCounts = perPage.reduce((a, p) => ({ rule: a.rule + p.counts.rule, model: a.model + p.counts.model, cache: a.cache + p.counts.cache, undecided: a.undecided + p.counts.undecided }), { rule: 0, model: 0, cache: 0, undecided: 0 });
  const modelCalls = (model === gemini ? gemini.calls : stub.calls);
  console.log(`\n== reconstruction summary ==`);
  console.log(`pages: ${perPage.length}  blocks: ${summary.total} (valid ${summary.valid}, invalid ${summary.invalid})`);
  console.log(`classification: rules ${totalCounts.rule}, model ${totalCounts.model}, cache ${totalCounts.cache}, undecided ${totalCounts.undecided}`);
  console.log(`model backend: ${model === gemini ? 'gemini' : 'stub'}  model calls this run: ${modelCalls}`);
  console.log(`geometry deterministic: ${determinismOk}  figures whole: ${figuresWhole}  two-column sections: ${columnsFormed}`);
  console.log(`preview: ${path.join(OUT, 'preview-geometry.html')}`);
  console.log(`provenance sidecar: ${path.join(RECON, sidecarFileName(MANUAL, LANG))}`);
  if (summary.invalid > 0) {
    console.log(`invalid blocks (surfaced, not dropped):`);
    summary.invalidReasons.forEach((r) => console.log(`  pos ${r.position} ${r.block_type}: ${r.message}`));
  }
}

main().catch((e) => { console.error('reconstruct-geometry error:', e instanceof Error ? e.stack : e); process.exit(1); });
