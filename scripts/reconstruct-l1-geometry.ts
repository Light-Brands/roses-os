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
  type BlockRegion,
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

// ----- faithful render style (axes: size, leading, centering) -----------------
// The side-by-side's job is to let the editor TRUST the block stream reproduces
// the canon page. Three of the four style axes Dario asked for are pure RENDER
// metadata read from the geometry that already exists — they never touch the
// editable content/schema, classify, or map. They ride alongside the block (like
// `rect`), are joined to it by (page, ordinal), and are applied ONLY in the
// side-by-side preview, never in the clean reader copy. Color (axis 4) needs a
// geometry-layer change (text fill color is not extracted yet) and lands later.

interface PageRender { page: number; blocks: MappedBlock[]; counts: ClassifyCounts; heightPt: number; widthPt: number; regions: BlockRegion[] }

/** What the preview renderer applies inline, overriding the class CSS with real
 *  values. Sizes are cqw strings (see scaleCqwPerPt). Any field omitted falls
 *  back to the class default. */
interface Faithful { fontCss?: string; lineH?: number; align?: 'left' | 'center'; colorCss?: string; familyCss?: string; numeralCss?: string; numeralColorCss?: string; numeralFamilyCss?: string }

// The canon is set in the Office defaults: Liberation Serif (= Times New Roman)
// for headings/numerals, Liberation Sans (= Arial) for body. Both are system
// fonts, so the side-by-side matches exactly with no embedding. Dario's call:
// match the canon, not the Cormorant brand upgrade.
const SERIF_STACK = "'Times New Roman', Times, 'Liberation Serif', serif";
const SANS_STACK = "Arial, Helvetica, 'Liberation Sans', sans-serif";

/** A region's real RGB fill color as a CSS color, or null if absent/pure ink. */
function colorCssOf(region: BlockRegion): string | null {
  const c = region.color;
  if (!c) return null;
  return `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;
}

/** Font family for a region from its real serif flag, or null when unknown. */
function familyCssOf(region: BlockRegion): string | null {
  if (region.serif === true) return SERIF_STACK;
  if (region.serif === false) return SANS_STACK;
  return null;
}

/** The page-to-screen scale, in container-query width units per point. The recon
 *  side is a query container whose content box (100cqw) is exactly the width the
 *  canon page image is displayed at (equal grid columns, equal side padding). So
 *  a glyph rendered at `pt * 100/widthPt cqw` lands at the SAME on-screen size as
 *  the canon page's glyph, at any viewport — the only way the two sizes truly
 *  coincide. Derived from the page width in points, never a hand constant. */
function scaleCqwPerPt(perPage: PageRender[]): number {
  const widths = perPage.map((p) => p.widthPt).filter((w) => w > 0).sort((a, b) => a - b);
  const w = widths.length ? widths[widths.length >> 1] : 612;
  return 100 / w;
}
/** Format a point size as a cqw length at the given scale, clamped to a sane band. */
function cqw(pt: number, s: number): string {
  const clamped = Math.min(44, Math.max(5, pt));
  return `${(clamped * s).toFixed(3)}cqw`;
}

/** Page content frame (left/right text margins in points), derived from the body
 *  text regions so centering is judged against the real column, not the paper
 *  edge. Skips one-glyph regions (exercise numerals, folios) that sit outside the
 *  text column. */
function pageFrame(regions: BlockRegion[]): { l: number; r: number } {
  const body = regions.filter((r) => (r.text || '').trim().length > 3);
  if (!body.length) return { l: 47, r: 565 };
  return { l: Math.min(...body.map((r) => r.rect[0])), r: Math.max(...body.map((r) => r.rect[2])) };
}

/** Real line-height of a region: the TIGHTEST top-to-top line pitch / fontSize.
 *  The tightest gap is the normal in-paragraph leading; the median or max would be
 *  inflated by a paragraph break or a gap straddling a figure (a 2-line region's
 *  "median" is literally the larger gap). One-line regions carry no pitch and
 *  return null (the class default applies). */
function regionLeading(r: BlockRegion): number | null {
  const lines = r.lines || [];
  if (lines.length < 2 || !r.fontSize) return null;
  const gaps: number[] = [];
  for (let i = 1; i < lines.length; i++) {
    const g = lines[i].rect[1] - lines[i - 1].rect[1];
    if (g > 0) gaps.push(g);
  }
  if (!gaps.length) return null;
  const pitch = Math.min(...gaps);
  return Math.min(2.0, Math.max(1.1, pitch / r.fontSize));
}

/** Compute the faithful style for a block from its source region. Returns null
 *  for composite/special blocks (cover, contents, figure, two-column) whose
 *  single-ordinal join is not representative — those keep their tuned CSS. */
function faithfulFor(b: MappedBlock, region: BlockRegion | undefined, frame: { l: number; r: number }, s: number): Faithful | null {
  if (!region) return null;
  switch (b.block_type) {
    case 'numbered-exercise': {
      // The anchor region IS the big numeral; size + color + family it faithfully.
      // The body keeps the body scale (its own region is not the anchor).
      const nc = colorCssOf(region);
      const nf = familyCssOf(region);
      return { numeralCss: cqw(region.fontSize, s), ...(nc ? { numeralColorCss: nc } : {}), ...(nf ? { numeralFamilyCss: nf } : {}) };
    }
    case 'heading':
    case 'text':
    case 'callout':
    case 'quote':
    case 'spoken-instruction': {
      const f: Faithful = { fontCss: cqw(region.fontSize, s) };
      const lead = regionLeading(region);
      if (lead != null) f.lineH = Number(lead.toFixed(2));
      // Centering only for top-level blocks (frame = page). A nested block's frame
      // is its column, not the page, so alignment is left to the column CSS.
      if (!b.nested) f.align = alignOf(region, frame);
      const cc = colorCssOf(region);
      if (cc) f.colorCss = cc;
      const ff = familyCssOf(region);
      if (ff) f.familyCss = ff;
      return f;
    }
    default:
      return null;
  }
}

/** Alignment from geometry: centered only when the region is NARROW relative to
 *  the content frame AND its left/right margins are near-symmetric. A full-width
 *  region (body paragraph, TOC row) reads as left/justified, never centered. */
function alignOf(r: BlockRegion, frame: { l: number; r: number }): 'left' | 'center' {
  const fw = frame.r - frame.l;
  if (fw <= 0) return 'left';
  const w = r.rect[2] - r.rect[0];
  const leftGap = r.rect[0] - frame.l;
  const rightGap = frame.r - r.rect[2];
  const narrow = w < 0.82 * fw;
  const symmetric = Math.abs(leftGap - rightGap) < 0.09 * fw;
  const inset = leftGap > 0.05 * fw;
  return narrow && symmetric && inset ? 'center' : 'left';
}

/** Build an inline style string from a Faithful (size/leading/align only). */
function faithfulStyle(f: Faithful | null): string {
  if (!f) return '';
  const parts: string[] = [];
  if (f.fontCss) parts.push(`font-size:${f.fontCss}`);
  if (f.lineH) parts.push(`line-height:${f.lineH}`);
  if (f.align) parts.push(`text-align:${f.align}`);
  if (f.colorCss) parts.push(`color:${f.colorCss}`);
  if (f.familyCss) parts.push(`font-family:${f.familyCss}`);
  return parts.length ? ` style="${parts.join(';')}"` : '';
}

function blockInner(b: MappedBlock, fst: Faithful | null = null, s = 0): string {
  const c = b.content as Record<string, any>;
  const fs = faithfulStyle(fst);
  switch (b.block_type) {
    case 'cover': {
      // Credits/edition/disclaimer lines render centered at a size scaled from
      // their real point size, so the cover keeps the canon's hierarchy.
      const credits = Array.isArray(c.credits) ? c.credits as Array<{ text: string; sizePt: number }> : [];
      // Scale credits to the canon page scale (cqw) in the side-by-side; the clean
      // reader copy (s=0) keeps a clamped px size.
      const creditSize = (pt: number) => (s > 0 ? cqw(Math.max(8, pt || 9), s) : `${Math.max(9, Math.min(15, Math.round((pt || 9) * 1.35)))}px`);
      const creditsHtml = credits.length
        ? `<div class="cover-rule"></div>${credits.map((cr) => `<div class="credit" style="font-size:${creditSize(cr.sizePt)}">${esc(cr.text)}</div>`).join('')}`
        : (c.author ? `<div class="byline">${esc(c.author)}</div>` : '');
      return `${c.eyebrow ? `<div class="eyebrow">${esc(c.eyebrow)}</div>` : ''}${c.cover_image ? `<img class="coverimg" src="${esc(c.cover_image)}"/>` : ''}<div class="title">${esc(c.title)}</div>${c.subtitle ? `<div class="subtitle">${esc(c.subtitle)}</div>` : ''}${creditsHtml}`;
    }
    case 'contents':
      return `${c.eyebrow ? `<div class="eyebrow">${esc(c.eyebrow)}</div>` : ''}<ul class="toc">${(c.rows || []).map((r: any) => `<li><span class="num">${esc(r.numeral || '')}</span><span class="tit">${esc(r.title)}</span><span class="pg">${esc(r.page || '')}</span></li>`).join('')}</ul>`;
    case 'heading':
      return `${c.eyebrow ? `<div class="eyebrow">${esc(c.eyebrow)}</div>` : ''}<div class="h h${c.level || 2}"${fs}>${esc(c.text)}</div>`;
    case 'text':
      return `<div class="prose"${fs}>${c.html || ''}</div>`;
    case 'captioned-figure': {
      // A figure INSIDE a column fills its cell — the column's proportion already
      // encodes the figure's on-page width (a 36%-of-page figure sits in a
      // 36%-wide cell). A top-level figure uses its own width_pct so a small
      // ornament stays small. Sizing by width_pct inside a cell shrinks twice.
      const pct = b.nested ? 100 : typeof c.width_pct === 'number' ? Math.min(90, Math.max(2, c.width_pct)) : 60;
      const style = ` style="width:${pct}%"`;
      return `${c.src ? `<img src="${esc(c.src)}"${style}/>` : `<div class="figph">figura</div>`}${c.caption ? `<div class="cap">${esc(c.caption)}</div>` : ''}`;
    }
    case 'numbered-exercise': {
      const numParts = [fst?.numeralCss ? `font-size:${fst.numeralCss}` : '', fst?.numeralColorCss ? `color:${fst.numeralColorCss}` : '', fst?.numeralFamilyCss ? `font-family:${fst.numeralFamilyCss}` : ''].filter(Boolean);
      const numStyle = numParts.length ? ` style="${numParts.join(';')}"` : '';
      return `<div class="ex"><span class="numeral"${numStyle}>${esc(c.numeral)}</span><div>${c.title ? `<strong>${esc(c.title)}</strong>` : ''}${docText(c.body)}</div></div>`;
    }
    case 'spoken-instruction':
      return `<div class="spoken"${fs}>&ldquo;${esc(c.spoken)}&rdquo;</div>`;
    case 'quote':
      return `<blockquote${fs}>${docText(c.body)}</blockquote>`;
    case 'callout':
      return `<div class="callout"${fs}>${docText(c.body)}</div>`;
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

/** Render context for the faithful (size/leading/centering) pass: the region join
 *  map, per-page content frame, and the manual-wide pt->px scale. */
interface FCtx { regionByKey: Map<string, BlockRegion>; frameByPage: Map<number, { l: number; r: number }>; s: number }

function renderBlock(b: MappedBlock, byId: Map<string, MappedBlock>, fctx: FCtx): string {
  const flag = b.valid ? '' : `<span class="bad" title="${esc(b.error?.error.message)}">INVALID</span>`;
  const tag = `${esc(b.block_type)} · ${esc(b.decidedBy)} ${flag}`;
  if (b.block_type === 'two-column-section') {
    const c = b.content as { left: string[]; right: string[]; proportions?: [number, number] };
    const [lp, rp] = c.proportions ?? [1, 1];
    const col = (ids: string[]) => ids.map((id) => byId.get(id)).filter(Boolean).map((child) => renderBlock(child as MappedBlock, byId, fctx)).join('');
    return `<div class="blk two-column-section"><div class="bt">${tag}</div><div class="twocol" style="grid-template-columns:${lp}fr ${rp}fr">
<div class="colcell">${col(c.left)}</div><div class="colcell">${col(c.right)}</div></div></div>`;
  }
  const region = fctx.regionByKey.get(`${b.anchor.page}:${b.anchor.ordinal}`);
  const frame = fctx.frameByPage.get(b.anchor.page) ?? { l: 47, r: 565 };
  const fst = faithfulFor(b, region, frame, fctx.s);
  return `<div class="blk ${esc(b.block_type)}${b.valid ? '' : ' invalid'}"><div class="bt">${tag}</div>${blockInner(b, fst, fctx.s)}</div>`;
}

// ----- reader (clean, portable, single-column client copy) -------------------
// The side-by-side preview is an engineering QA artifact (canon vs blocks, dev
// labels, remote Google Fonts). The reader is what a client actually sees: one
// column, no diagnostics, fonts EMBEDDED as base64 woff2 (so titles render
// identical in iOS Quick Look / offline / any device, never a network font hit)
// and images INLINED as data URLs (so the file is a single self-contained .html).

function embeddedFontCss(): string {
  const faces = [
    { fam: 'Cormorant Garamond', wt: 400, file: 'CormorantGaramond-400.woff2' },
    { fam: 'Cormorant Garamond', wt: 500, file: 'CormorantGaramond-500.woff2' },
    { fam: 'Cormorant Garamond', wt: 600, file: 'CormorantGaramond-600.woff2' },
    { fam: 'Cormorant Garamond', wt: 700, file: 'CormorantGaramond-700.woff2' },
    { fam: 'Inter', wt: 400, file: 'Inter-400.woff2' },
    { fam: 'Inter', wt: 600, file: 'Inter-600.woff2' },
  ];
  return faces
    .map((f) => {
      const p = path.join('public', 'fonts', f.file);
      if (!fs.existsSync(p)) return '';
      const b64 = fs.readFileSync(p).toString('base64');
      return `@font-face{font-family:'${f.fam}';font-style:normal;font-weight:${f.wt};font-display:swap;src:url(data:font/woff2;base64,${b64}) format('woff2')}`;
    })
    .filter(Boolean)
    .join('\n');
}

/** Inline every relative <img src> as a data URL (paths resolve against OUT).
 *  data: and http(s) srcs pass through; a missing file is left untouched. */
function inlineImages(html: string): string {
  return html.replace(/src="([^"]+)"/g, (m, src) => {
    if (/^(data:|https?:)/.test(src)) return m;
    const p = path.join(OUT, src);
    if (!fs.existsSync(p)) return m;
    const ext = (path.extname(p).slice(1) || 'png').toLowerCase();
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
    return `src="data:${mime};base64,${fs.readFileSync(p).toString('base64')}"`;
  });
}

function renderReader(b: MappedBlock, byId: Map<string, MappedBlock>): string {
  if (b.block_type === 'two-column-section') {
    const c = b.content as { left: string[]; right: string[]; proportions?: [number, number] };
    const [lp, rp] = c.proportions ?? [1, 1];
    const col = (ids: string[]) => ids.map((id) => byId.get(id)).filter(Boolean).map((child) => renderReader(child as MappedBlock, byId)).join('');
    return `<div class="twocol" style="grid-template-columns:${lp}fr ${rp}fr"><div class="colcell">${col(c.left)}</div><div class="colcell">${col(c.right)}</div></div>`;
  }
  return `<div class="rblk ${esc(b.block_type)}">${blockInner(b)}</div>`;
}

function buildReader(perPage: PageRender[]): void {
  const byId = new Map<string, MappedBlock>();
  for (const p of perPage) for (const b of p.blocks) byId.set(b.id, b);
  const pages = perPage
    .map((p) => {
      const blocks = p.blocks.filter((b) => !b.nested).map((b) => renderReader(b, byId)).join('');
      return `<section class="rpage">${blocks}</section>`;
    })
    .join('');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rose Meditation — Level 1</title>
<style>
${embeddedFontCss()}
:root{--ink:#3a2f28;--terra:#b56a4a;--line:#e7ddd0}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:#fbf7f1;color:var(--ink);font-family:'Cormorant Garamond',Georgia,serif;font-size:15px;line-height:1.55}
.reader{max-width:720px;margin:0 auto;padding:36px 26px 64px}
.rpage{padding:10px 0}
.rpage + .rpage{border-top:1px solid var(--line);margin-top:18px;padding-top:26px}
.rblk{margin:0 0 12px}
.eyebrow{font-family:Inter;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--terra);margin-bottom:4px}
.cover{text-align:center;padding:8px 0 4px}
.cover .coverimg{max-width:64%;max-height:320px;width:auto;height:auto;display:block;margin:6px auto 14px}
.cover .title{font-size:34px;font-weight:600;line-height:1.1}
.cover .subtitle{font-style:italic;font-size:18px;color:#7a6553}
.cover .cover-rule{width:42px;height:1px;background:var(--terra);opacity:.5;margin:16px auto}
.cover .credit{color:#8a7a6a;margin:4px 0;line-height:1.35}.cover .credit:last-child{color:#b08a7a;font-style:italic;margin-top:10px}
.cover .byline{font-family:Inter;font-size:12px;color:#9a8a78;white-space:pre-line;margin-top:10px}
.h{font-weight:600;line-height:1.15}.h1{font-size:26px}.h2{font-size:20px}.h3{font-size:16px}
.prose p{margin:0 0 .55em}.prose p:last-child{margin-bottom:0}.prose ul{margin:.3em 0 .55em;padding-left:1.4em}.prose li{margin:.14em 0}
.toc{list-style:none;margin:0;padding:0}.toc li{display:flex;gap:10px;align-items:baseline;border-bottom:1px solid var(--line);padding:3px 0}.toc .num{color:var(--terra);min-width:26px}.toc .tit{flex:1;line-height:1.3}.toc .pg{color:#9a8a78}
.ex{display:flex;gap:13px;align-items:flex-start}.ex .numeral{color:var(--terra);font-weight:600;font-size:32px;line-height:.9}.ex>div{line-height:1.55}
.spoken{font-size:18px;font-style:italic;color:#5a463a;border-left:3px solid var(--terra);padding-left:13px;margin:6px 0}
.rblk>.callout{background:#fbeee9;border-left:3px solid var(--terra);border-radius:4px;padding:9px 15px;font-style:italic;color:#7a5a50}.callout p{margin:0 0 .4em}.callout p:last-child{margin-bottom:0}
blockquote{margin:0;font-size:18px;font-style:italic;border-left:3px solid var(--terra);padding-left:13px}
.captioned-figure{text-align:center}.captioned-figure img{max-width:90%;max-height:340px;width:auto;height:auto;border-radius:4px;display:inline-block;margin:4px auto}.cap{font-style:italic;color:var(--terra);font-size:14px;margin-top:6px}
.figph{display:inline-block;background:#efe7da;border:1px dashed #c9b9a6;border-radius:4px;padding:4px 10px;color:#b6a690;font-family:Inter;font-size:10px;text-transform:uppercase}
.twocol{display:grid;gap:16px;align-items:start}.colcell{min-width:0}.colcell .rblk{margin-bottom:8px}
img{max-width:100%}
</style></head><body><main class="reader">${pages}</main></body></html>`;
  fs.writeFileSync(path.join(OUT, 'reading-mode.html'), inlineImages(html));
}

function buildPreview(perPage: PageRender[]): void {
  const byId = new Map<string, MappedBlock>();
  for (const p of perPage) for (const b of p.blocks) byId.set(b.id, b);
  // Build the faithful-style context: join regions by (page, ordinal), the
  // content frame per page, and the manual-wide pt->px scale anchored at body.
  const regionByKey = new Map<string, BlockRegion>();
  const frameByPage = new Map<number, { l: number; r: number }>();
  for (const p of perPage) {
    frameByPage.set(p.page, pageFrame(p.regions));
    for (const r of p.regions) regionByKey.set(`${p.page}:${r.ordinal}`, r);
  }
  const s = scaleCqwPerPt(perPage);
  const fctx: FCtx = { regionByKey, frameByPage, s };
  // Class-default content sizes, also in cqw so non-faithful blocks (exercise
  // body, TOC rows, cover) share the canon page scale. Typical point sizes for L1.
  const cq = (pt: number) => cqw(pt, s);
  const sections = perPage.map((p) => {
    const tag = String(p.page).padStart(2, '0');
    // Skip nested children at top level; they render inside their column.
    const blocks = p.blocks.filter((b) => !b.nested).map((b) => renderBlock(b, byId, fctx)).join('');
    const isCover = p.page === 1;
    // Vertical placement from canon geometry: the first KEPT block's top edge is
    // the real content margin (running head/foot were dropped, so they don't
    // appear here). Pushing the recon content down by that fraction reproduces
    // the canon's vertical distribution — centered exercise pages stay centered,
    // top-weighted pages stay at the top. Capped so a stray rect can't over-push.
    const tops = p.blocks.filter((b) => !b.nested && b.rect).map((b) => b.rect![1]);
    const topFrac = tops.length ? Math.max(0, Math.min(0.5, Math.min(...tops) / p.heightPt)) : 0;
    const vtop = isCover ? '' : `<div class="vtop" style="height:${(topFrac * 100).toFixed(1)}%"></div>`;
    return `<section class="page"><div class="cols">
<div class="side canon"><div class="lbl">original</div><img src="canon-page-${tag}.png"/></div>
<div class="side recon"><div class="lbl">reconstruction</div><div class="reconpage${isCover ? ' coverpage' : ''}"><div class="reconbody">${vtop}${blocks}</div><div class="foot">${p.page}</div></div></div>
</div></section>`;
  }).join('');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>L1 deterministic reconstruction</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;600&display=swap');
:root{--ink:#3a2f28;--terra:#b56a4a;--warm:#fbf7f1;--line:#e7ddd0;--frame:#dcc6b6}
*{box-sizing:border-box}body{margin:0;background:#e9e0d3;color:var(--ink);font-family:'Cormorant Garamond',Georgia,serif}
header{position:sticky;top:0;background:#fff;border-bottom:1px solid var(--line);padding:12px 20px;font-family:Inter;z-index:9}
header h1{margin:0;font-size:17px}header .s{font-size:12px;color:#8a7a6a}
.page{max-width:1500px;margin:24px auto;background:#fff;border:1px solid var(--line);border-radius:10px;overflow:hidden}
.cols{display:grid;grid-template-columns:1fr 1fr;align-items:stretch}
.side{padding:16px}.side.recon{border-left:1px solid var(--line);background:#efe6d8;display:flex;flex-direction:column;container-type:inline-size}
.side.canon{display:flex;flex-direction:column}.side.canon img{margin-top:auto;margin-bottom:auto}
.lbl{font-family:Inter;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#bbab98;margin-bottom:10px}
.side.canon img{width:100%;border:1px solid var(--line);display:block}
/* recon page card: frame + bottom page number, to mirror the canon page */
.reconpage{flex:1;background:#fff;border:1px solid var(--frame);padding:${cq(34)} ${cq(47)};display:flex;flex-direction:column;position:relative;font-family:${SANS_STACK}}
/* Canon type system: serif (Times) for headings/numerals/TOC/quote/caption/cover
   title, sans (Arial) for body — matches the original. Atomic blocks override
   per-region from the real serif flag; this is the composite/fallback default. */
.reconpage .h,.reconpage .toc,.reconpage blockquote,.reconpage .callout,.reconpage .spoken,.reconpage .cap,.reconpage .ex .numeral,.reconpage .cover .title,.reconpage .cover .subtitle{font-family:${SERIF_STACK}}
.reconbody{flex:1;min-height:0}
.vtop{flex:none}
.reconpage>.foot{text-align:center;font-family:Inter;font-size:10px;letter-spacing:.12em;color:#c2b3a0;padding-top:22px}
.reconpage.coverpage .reconbody{display:flex;flex-direction:column;justify-content:center}.reconpage.coverpage>.foot{display:none}
.blk{margin:0 0 9px}
.bt{display:none;font-family:Inter;font-size:9px;letter-spacing:.06em;text-transform:uppercase;color:#cdbfad;margin-bottom:3px}
body.tags .bt{display:block}
.bad{color:#c0492b;font-weight:600}
.blk.invalid{outline:1px dashed #d9b3a6;outline-offset:4px}
.eyebrow{font-family:Inter;font-size:${cq(7)};letter-spacing:.18em;text-transform:uppercase;color:var(--terra);margin-bottom:4px}
.cover{text-align:center;padding:6px 0}.cover .coverimg{max-width:54%;max-height:300px;width:auto;height:auto;display:block;margin:6px auto 12px}.cover .title{font-size:${cq(27)};font-weight:600}.cover .subtitle{font-style:italic;font-size:${cq(13)};color:#7a6553}.cover .byline{font-family:Inter;font-size:${cq(9)};color:#9a8a78;white-space:pre-line;margin-top:10px}
.cover .cover-rule{width:42px;height:1px;background:var(--terra);opacity:.5;margin:14px auto}.cover .credit{color:#8a7a6a;margin:3px 0;line-height:1.35;font-size:${cq(10)}}.cover .credit:last-child{color:#b08a7a;font-style:italic;margin-top:9px}
.h{font-weight:600}.h1{font-size:${cq(22)}}.h2{font-size:${cq(17)}}
/* h3 = the italic-terra sub-titles (Cleansing Rose, Protection, Circuit of Energy of…); centered standalone, left inside a column, matching canon */
.h3{font-size:${cq(13)};font-weight:500;font-style:italic;color:var(--terra);text-align:center;margin-bottom:2px}.colcell .h3{text-align:left}
.prose{font-size:${cq(9.5)};line-height:1.5}.prose p{margin:0 0 .5em}.prose p:last-child{margin-bottom:0}.prose ul{margin:.3em 0 .5em;padding-left:1.4em}.prose li{margin:.12em 0}
.toc{list-style:none;margin:0;padding:0}.toc li{display:flex;gap:10px;align-items:baseline;border-bottom:1px solid var(--line);padding:2px 0}.toc .num{color:var(--terra);min-width:26px}.toc .tit{flex:1;font-size:${cq(10.5)};line-height:1.3}.toc .pg{color:#9a8a78}
.ex{display:flex;gap:13px;align-items:flex-start}.ex .numeral{color:var(--terra);font-weight:600;font-size:${cq(28)};line-height:.9}.ex>div{font-size:${cq(9.5)};line-height:1.55}
.spoken{font-size:${cq(11)};font-style:italic;color:#5a463a;border-left:3px solid var(--terra);padding-left:13px;margin:6px 0}
.blk>.callout{background:#fbeee9;border-left:3px solid var(--terra);border-radius:4px;padding:9px 15px;font-size:${cq(10)};font-style:italic;color:#7a5a50;line-height:1.45}.callout p{margin:0 0 .4em}.callout p:last-child{margin-bottom:0}
blockquote{margin:0;font-size:${cq(11)};font-style:italic;border-left:3px solid var(--terra);padding-left:13px}
.captioned-figure{text-align:center}.captioned-figure img{max-width:90%;max-height:300px;width:auto;height:auto;border:1px solid var(--line);border-radius:4px;display:inline-block;margin:4px auto}.cap{font-style:italic;color:var(--terra);font-size:${cq(9)};margin-top:6px}
.figph{display:inline-block;background:#efe7da;border:1px dashed #c9b9a6;border-radius:4px;padding:4px 10px;color:#b6a690;font-family:Inter;font-size:10px;text-transform:uppercase}
.twocol{display:grid;gap:16px;align-items:center}.colcell{min-width:0}.colcell .blk{margin-bottom:0}.two-column-section>.bt{color:#c2a6d0}
@media(max-width:1100px){.cols{grid-template-columns:1fr}.side.recon{border-left:0;border-top:1px solid var(--line)}}
</style></head><body>
<header><button id="tagtog" onclick="document.body.classList.toggle('tags')" style="float:right;font-family:Inter;font-size:11px;border:1px solid var(--line);background:#fff;color:#8a7a6a;border-radius:6px;padding:5px 10px;cursor:pointer">block tags</button><h1>Rose Meditation Level 1 — deterministic reconstruction (${perPage.length} pages)</h1><div class="s">Left: canon page. Right: linear v2 blocks. Figure pixels and reading order come from pdf.js geometry, never a model box. The model classifies only the residue the rules cannot decide. Working tree, prod untouched.</div></header>
${sections}</body></html>`;
  fs.writeFileSync(path.join(OUT, 'preview-geometry.html'), html);
  // Self-contained copy for sharing: swap the remote Google-Fonts @import for
  // embedded base64 woff2 and inline every canon/figure image as a data URL, so
  // the side-by-side is a single portable .html that renders identically offline.
  const portable = inlineImages(
    html.replace(
      "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;600&display=swap');",
      embeddedFontCss()
    )
  );
  fs.writeFileSync(path.join(OUT, 'preview-geometry-portable.html'), portable);
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

  const perPage: PageRender[] = [];
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
      perPage.push({ page: i, blocks: [], counts, heightPt: geo.heightPt, widthPt: geo.widthPt, regions: geo.textRegions });
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
  buildReader(perPage);

  const totalCounts = perPage.reduce((a, p) => ({ rule: a.rule + p.counts.rule, model: a.model + p.counts.model, cache: a.cache + p.counts.cache, undecided: a.undecided + p.counts.undecided }), { rule: 0, model: 0, cache: 0, undecided: 0 });
  const modelCalls = (model === gemini ? gemini.calls : stub.calls);
  console.log(`\n== reconstruction summary ==`);
  console.log(`pages: ${perPage.length}  blocks: ${summary.total} (valid ${summary.valid}, invalid ${summary.invalid})`);
  console.log(`classification: rules ${totalCounts.rule}, model ${totalCounts.model}, cache ${totalCounts.cache}, undecided ${totalCounts.undecided}`);
  console.log(`model backend: ${model === gemini ? 'gemini' : 'stub'}  model calls this run: ${modelCalls}`);
  console.log(`geometry deterministic: ${determinismOk}  figures whole: ${figuresWhole}  two-column sections: ${columnsFormed}`);
  console.log(`preview: ${path.join(OUT, 'preview-geometry.html')}`);
  console.log(`reader:  ${path.join(OUT, 'reading-mode.html')}`);
  console.log(`provenance sidecar: ${path.join(RECON, sidecarFileName(MANUAL, LANG))}`);
  if (summary.invalid > 0) {
    console.log(`invalid blocks (surfaced, not dropped):`);
    summary.invalidReasons.forEach((r) => console.log(`  pos ${r.position} ${r.block_type}: ${r.message}`));
  }
}

main().catch((e) => { console.error('reconstruct-geometry error:', e instanceof Error ? e.stack : e); process.exit(1); });
