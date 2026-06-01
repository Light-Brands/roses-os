/**
 * M1 sample (layout-preserving): reconstruct the first N pages of Rose Meditation
 * Level 1 (en) from the rasterized canon pages into validated v2 blocks WITH
 * bounding boxes, crop the real figure images out of the page raster, and build a
 * side-by-side preview (canon page | positioned reconstruction with real images).
 *
 * Prereq: scripts/render-canon-pages.mjs has produced canon-page-NN.png.
 * Never writes to any database. Output under _qie-output/ (gitignored).
 *
 *   set -a; . ./.env.local; set +a; <compile> node reconstruct-l1-sample.js [N]
 */

import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { validateBlockInput } from '../src/lib/manuals/block-schema';

const KEY = process.env.GOOGLE_GEMINI_API_KEY || '';
const MODEL = 'gemini-2.5-pro';
const OUT_DIR = '_qie-output/roses-os/reconstruction/l1-en';
const N = Math.max(1, parseInt(process.argv[2] || '10', 10));

const PROMPT = `You are reconstructing ONE page of "Rose Meditation Level 1", a spiritual
meditation manual, from its page image into structured content blocks that
reproduce the page faithfully, preserving the original layout.

Return ONLY a JSON object: {"blocks":[ {"block_type":"...","content":{...},"box":[ymin,xmin,ymax,xmax]}, ... ]}
in reading order. "box" is the bounding box of that block on the page, with every
value an integer 0-1000 normalized to the page (y down, x right). Be tight and accurate.

Allowed block_type and the EXACT content shape:
- "cover": {"schema_version":2,"title":"...","subtitle"?:"...","eyebrow"?:"...","author"?:"...","illustrator"?:"..."}
- "contents": {"schema_version":2,"eyebrow"?:"CONTENTS","rows":[{"numeral"?:"1","title":"...","page"?:"4"}]}
- "heading": {"text":"...","level":1|2|3,"eyebrow"?:"..."}
- "text": {"html":"<p>...</p>"}  (use <p>, <ul>/<ol>/<li>, <em>, <strong>)
- "numbered-exercise": {"schema_version":2,"numeral":"1","title"?:"...","body":DOC}
- "spoken-instruction": {"schema_version":2,"spoken":"..."}
- "callout": {"schema_version":2,"variant":"note"|"warning"|"wisdom"|"summary","title"?:"...","body":DOC}
- "quote": {"schema_version":2,"body":DOC,"attribution"?:"..."}
- "captioned-figure": {"schema_version":2,"src":"","alt":"describe the image","caption"?:"..."}  (leave src empty; box must tightly enclose the image)
- "table": {"schema_version":2,"header":["..."],"rows":[["..."]]}
- "glossary": {"schema_version":2,"entries":[{"term":"...","definition":"..."}]}
- "footnote": {"schema_version":2,"body":DOC,"notes":{"1":"..."}}
- "divider": {}

DOC = {"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"..."}]}]}

Rules:
- Preserve wording EXACTLY. Never summarize, translate, or invent text.
- Choose the block type that matches the page DESIGN.
- TITLE / COVER PAGE: if the page is a title page (a large central illustration with
  the manual title), return EXACTLY these in order: one "cover" block (title, subtitle,
  eyebrow = the school name at top, author = the credits block verbatim) whose "box" is
  the central illustration's TIGHT bounds, and nothing else. Do not split a cover page
  into separate heading/text fragments.
- FIGURES: emit a "captioned-figure" ONLY for an actual illustration or photo. Its "box"
  must be TIGHT around just the image, excluding whitespace, title text, and body text.
  Never emit a figure for a region that is only text or a thin decorative line/sliver.
- Include "schema_version":2 on every v2 block.
- Output ONLY the JSON object, no markdown fences.`;

interface RawBlock { block_type: string; content?: unknown; box?: number[] }
interface OutBlock { block_type: string; content: any; box: number[] | null; valid: boolean; error: string | null; figure?: string }
interface PageResult { page: number; w: number; h: number; blocks: OutBlock[] }

async function extractPage(pngB64: string, pageNum: number): Promise<RawBlock[]> {
  const cacheFile = path.join(OUT_DIR, `.cache-page-${String(pageNum).padStart(2, '0')}.json`);
  let text: string;
  if (fs.existsSync(cacheFile)) {
    text = fs.readFileSync(cacheFile, 'utf-8');
  } else {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;
    const body = {
      contents: [{ parts: [
        { inline_data: { mime_type: 'image/png', data: pngB64 } },
        { text: PROMPT },
      ] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
    };
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 400)}`);
    const j = (await res.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    text = j.candidates?.[0]?.content?.parts?.[0]?.text ?? '{"blocks":[]}';
    fs.writeFileSync(cacheFile, text);
  }
  let arr: unknown[];
  try {
    const parsed = JSON.parse(text);
    arr = Array.isArray(parsed) ? parsed : ((parsed as { blocks?: unknown[] }).blocks ?? []);
  } catch {
    arr = salvageBlocks(text); // tolerant recovery when Gemini emits one malformed block
  }
  return (arr as RawBlock[]).filter((b) => b && typeof b.block_type === 'string');
}

/** Recover the well-formed block objects from a blocks array even when one is
 *  malformed (a stray field or an extra brace), by brace-matching top-level
 *  objects and parsing each independently. Strings/escapes are respected. */
function salvageBlocks(text: string): RawBlock[] {
  const at = text.indexOf('"blocks"');
  const start = at < 0 ? -1 : text.indexOf('[', at);
  if (start < 0) return [];
  const out: RawBlock[] = [];
  let depth = 0, objStart = -1, inStr = false, esc = false;
  for (let k = start + 1; k < text.length; k++) {
    const ch = text[k];
    if (inStr) {
      if (esc) esc = false; else if (ch === '\\') esc = true; else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') { inStr = true; continue; }
    if (ch === '{') { if (depth === 0) objStart = k; depth++; }
    else if (ch === '}') {
      depth--;
      if (depth === 0 && objStart >= 0) {
        try { const o = JSON.parse(text.slice(objStart, k + 1)); if (o && typeof o.block_type === 'string') out.push(o); } catch { /* skip broken block */ }
        objStart = -1;
      } else if (depth < 0) break;
    } else if (ch === ']' && depth === 0) break;
  }
  return out;
}

function normalizeContent(b: RawBlock): unknown {
  if (b.content !== undefined && b.content !== null) return b.content;
  const rest: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(b as unknown as Record<string, unknown>)) {
    if (k !== 'block_type' && k !== 'content' && k !== 'box') rest[k] = v;
  }
  return rest;
}

function clampBox(box: number[] | undefined): number[] | null {
  if (!Array.isArray(box) || box.length !== 4) return null;
  let [y0, x0, y1, x1] = box.map((n) => Math.max(0, Math.min(1000, Number(n) || 0)));
  if (x1 <= x0) x1 = Math.min(1000, x0 + 1);
  if (y1 <= y0) y1 = Math.min(1000, y0 + 1);
  return [y0, x0, y1, x1];
}

async function cropFigure(pngPath: string, box: number[], w: number, h: number, outPath: string): Promise<boolean> {
  try {
    const [y0, x0, y1, x1] = box;
    const left = Math.round((x0 / 1000) * w);
    const top = Math.round((y0 / 1000) * h);
    const width = Math.max(8, Math.round(((x1 - x0) / 1000) * w));
    const height = Math.max(8, Math.round(((y1 - y0) / 1000) * h));
    await sharp(pngPath)
      .extract({ left: Math.min(left, w - 1), top: Math.min(top, h - 1), width: Math.min(width, w - left), height: Math.min(height, h - top) })
      .toFile(outPath);
    return true;
  } catch {
    return false;
  }
}

// ---- preview ---------------------------------------------------------------

function esc(s: unknown): string {
  return String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
}
function docText(doc: any): string {
  const out: string[] = [];
  const d = doc || {};
  (d.content || []).forEach((p: any) => {
    const t = (p.content || []).map((n: any) => esc(n.text || '')).join('');
    if (t) out.push(`<p>${t}</p>`);
  });
  return out.join('');
}
function innerHtml(bt: string, c: any, figure?: string): string {
  c = c || {};
  switch (bt) {
    case 'cover': return `${c.eyebrow ? `<div class="eyebrow">${esc(c.eyebrow)}</div>` : ''}${figure ? `<img class="coverimg" src="${esc(figure)}"/>` : ''}<div class="title">${esc(c.title)}</div>${c.subtitle ? `<div class="subtitle">${esc(c.subtitle)}</div>` : ''}${c.author ? `<div class="byline">${esc(c.author)}</div>` : ''}`;
    case 'contents': return `${c.eyebrow ? `<div class="eyebrow">${esc(c.eyebrow)}</div>` : ''}<ul class="toc">${(c.rows || []).map((r: any) => `<li><span class="num">${esc(r.numeral || '')}</span><span class="tit">${esc(r.title)}</span><span class="pg">${esc(r.page || '')}</span></li>`).join('')}</ul>`;
    case 'heading': return `${c.eyebrow ? `<div class="eyebrow">${esc(c.eyebrow)}</div>` : ''}<div class="h h${c.level || 2}">${esc(c.text)}</div>`;
    case 'text': return `<div class="prose">${c.html || ''}</div>`;
    case 'numbered-exercise': return `<div class="ex"><span class="numeral">${esc(c.numeral)}</span><div>${c.title ? `<strong>${esc(c.title)}</strong>` : ''}${docText(c.body)}</div></div>`;
    case 'spoken-instruction': return `<div class="spoken">&ldquo;${esc(c.spoken)}&rdquo;</div>`;
    case 'callout': return `<div class="callout">${c.title ? `<div class="ct">${esc(c.title)}</div>` : ''}${docText(c.body)}</div>`;
    case 'quote': return `<blockquote>${docText(c.body)}${c.attribution ? `<cite>${esc(c.attribution)}</cite>` : ''}</blockquote>`;
    case 'captioned-figure': return `${figure ? `<img src="${esc(figure)}"/>` : `<div class="figph" title="${esc(c.alt)}">figura</div>`}${c.caption ? `<div class="cap">${esc(c.caption)}</div>` : ''}`;
    case 'table': return `<table>${(c.header ? `<tr>${c.header.map((x: string) => `<th>${esc(x)}</th>`).join('')}</tr>` : '')}${(c.rows || []).map((r: string[]) => `<tr>${r.map((x) => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</table>`;
    case 'glossary': return `<dl>${(c.entries || []).map((e: any) => `<dt>${esc(e.term)}</dt><dd>${esc(e.definition)}</dd>`).join('')}</dl>`;
    case 'footnote': return `${docText(c.body)}<ol class="fn">${Object.values(c.notes || {}).map((v) => `<li>${esc(v)}</li>`).join('')}</ol>`;
    case 'divider': return `<hr/>`;
    default: return `[${esc(bt)}]`;
  }
}
function readingOrder(blocks: OutBlock[]): OutBlock[] {
  // Sort by vertical band then horizontal: a stable reading order that keeps a
  // mostly single-column manual flowing top-to-bottom without absolute layout.
  return [...blocks].sort((a, b) => {
    const ay = a.box ? a.box[0] : 0, by = b.box ? b.box[0] : 0;
    if (Math.abs(ay - by) > 30) return ay - by;
    const ax = a.box ? a.box[1] : 0, bx = b.box ? b.box[1] : 0;
    return ax - bx;
  });
}
function renderLinear(b: OutBlock): string {
  const flag = b.valid ? '' : '<span class="bad" title="' + esc(b.error) + '">no valido</span>';
  return `<div class="blk ${esc(b.block_type)}${b.valid ? '' : ' invalid'}"><div class="bt">${esc(b.block_type)} ${flag}</div>${innerHtml(b.block_type, b.content, b.figure)}</div>`;
}

function buildPreview(pages: PageResult[]): void {
  const sections = pages.map((p) => {
    const tag = String(p.page).padStart(2, '0');
    const blocks = readingOrder(p.blocks).map(renderLinear).join('');
    return `<section class="page"><div class="pn">Pagina ${p.page}</div><div class="cols">
<div class="side canon"><div class="lbl">canon</div><img src="canon-page-${tag}.png"/></div>
<div class="side recon"><div class="lbl">reconstruccion (flujo lineal de bloques v2, imagenes reales recortadas del canon)</div>${blocks}</div>
</div></section>`;
  }).join('');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>L1 reconstruccion</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;600&display=swap');
:root{--ink:#3a2f28;--terra:#b56a4a;--warm:#fbf7f1;--line:#e7ddd0}
*{box-sizing:border-box}body{margin:0;background:#e9e0d3;color:var(--ink);font-family:'Cormorant Garamond',Georgia,serif}
header{position:sticky;top:0;background:#fff;border-bottom:1px solid var(--line);padding:12px 20px;font-family:Inter;z-index:9}
header h1{margin:0;font-size:17px}header .s{font-size:12px;color:#8a7a6a}
.page{max-width:1500px;margin:24px auto;background:#fff;border:1px solid var(--line);border-radius:10px;overflow:hidden}
.pn{font-family:Inter;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#a0896f;padding:9px 16px;border-bottom:1px solid var(--line)}
.cols{display:grid;grid-template-columns:1fr 1fr;align-items:start}
.side{padding:18px}.side.recon{border-left:1px solid var(--line);background:var(--warm)}
.lbl{font-family:Inter;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#bbab98;margin-bottom:10px}
.side.canon img{width:100%;border:1px solid var(--line);display:block}
.blk{margin:0 0 16px}
.bt{font-family:Inter;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#cdbfad;margin-bottom:3px}
.bad{color:#c0492b;font-weight:600}
.blk.invalid{outline:1px dashed #d9b3a6;outline-offset:4px}
.eyebrow{font-family:Inter;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--terra);margin-bottom:4px}
.cover{text-align:center;padding:10px 0}.cover .coverimg{max-width:58%;max-height:330px;width:auto;height:auto;display:block;margin:8px auto 14px}.cover .title{font-size:38px;font-weight:600}.cover .subtitle{font-style:italic;font-size:20px;color:#7a6553}.cover .byline{font-family:Inter;font-size:12px;color:#9a8a78;white-space:pre-line;margin-top:10px}
.h{font-weight:600}.h1{font-size:30px}.h2{font-size:23px}.h3{font-size:18px}
.prose{font-size:18px;line-height:1.6}.prose p{margin:.4em 0}.prose em{font-style:italic}.prose ol,.prose ul{margin:.4em 0;padding-left:1.4em}
.toc{list-style:none;margin:0;padding:0}.toc li{display:flex;gap:10px;align-items:baseline;border-bottom:1px solid var(--line);padding:6px 0}.toc .num{color:var(--terra);min-width:30px}.toc .tit{flex:1;font-size:17px}.toc .pg{color:#9a8a78}
.ex{display:flex;gap:14px;align-items:flex-start}.ex .numeral{color:var(--terra);font-weight:600;font-size:38px;line-height:.9}.ex>div{font-size:17px;line-height:1.55}
.spoken{font-size:20px;font-style:italic;color:#5a463a;border-left:3px solid var(--terra);padding-left:14px;margin:6px 0}
.callout{background:#fff;border:1px solid var(--line);border-left:4px solid var(--terra);border-radius:6px;padding:12px 14px;font-size:17px}.callout .ct{font-family:Inter;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--terra);margin-bottom:4px}
blockquote{margin:0;font-size:20px;font-style:italic;border-left:3px solid var(--terra);padding-left:14px}blockquote cite{display:block;font-size:14px;font-style:normal;color:#9a8a78;margin-top:6px}
.captioned-figure{text-align:center}.captioned-figure img{max-width:90%;max-height:360px;width:auto;height:auto;border:1px solid var(--line);border-radius:4px;display:inline-block;margin:4px auto}.cap{font-style:italic;color:var(--terra);font-size:15px;margin-top:6px;text-align:center}
.figph{display:inline-block;background:#efe7da;border:1px dashed #c9b9a6;border-radius:4px;padding:4px 10px;color:#b6a690;font-family:Inter;font-size:10px;letter-spacing:.06em;text-transform:uppercase}
table{border-collapse:collapse;width:100%;font-size:15px}th,td{border:1px solid var(--line);padding:6px 9px;text-align:left}th{background:#f4ece1}
dl dt{font-weight:600}dl dd{margin:0 0 8px;color:#5a463a}
.fn{font-size:14px;color:#5a463a}
hr{border:0;border-top:1px solid var(--line);margin:14px 0}
@media(max-width:1100px){.cols{grid-template-columns:1fr}.side.recon{border-left:0;border-top:1px solid var(--line)}}
</style></head><body>
<header><h1>Rose Meditation Level 1 — reconstruccion (${pages.length} paginas)</h1><div class="s">Izquierda: pagina canon. Derecha: los bloques v2 en orden de lectura, con las figuras reales recortadas del canon. Esto es lo que la app renderiza (flujo lineal de bloques), no posicion absoluta. Working-tree, sin tocar prod.</div></header>
${sections}</body></html>`;
  fs.writeFileSync(path.join(OUT_DIR, 'preview.html'), html);
}

async function main(): Promise<void> {
  if (!KEY) throw new Error('GOOGLE_GEMINI_API_KEY not set');
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const pages: PageResult[] = [];
  for (let i = 1; i <= N; i++) {
    const tag = String(i).padStart(2, '0');
    const pngPath = path.join(OUT_DIR, `canon-page-${tag}.png`);
    if (!fs.existsSync(pngPath)) { console.log(`page ${i}: no raster (run render-canon-pages.mjs first), skip`); continue; }
    const meta = await sharp(pngPath).metadata();
    const w = meta.width || 1224, h = meta.height || 1584;
    const pngB64 = fs.readFileSync(pngPath).toString('base64');

    process.stdout.write(`  page ${i}/${N}: extracting... `);
    let raw: RawBlock[] = [];
    try { raw = await extractPage(pngB64, i); } catch (e) { console.log(`ERROR ${(e as Error).message}`); }

    const blocks: OutBlock[] = [];
    let figIdx = 0;
    for (const b of raw) {
      const content = normalizeContent(b);
      const v = validateBlockInput({ block_type: b.block_type, content });
      const box = clampBox(b.box);
      const out: OutBlock = { block_type: b.block_type, content: v.ok ? (v.value as any).content : content, box, valid: v.ok, error: v.ok ? null : v.body.error.message };
      if ((b.block_type === 'captioned-figure' || b.block_type === 'cover') && box) {
        const pw = ((box[3] - box[1]) / 1000) * w;
        const ph = ((box[2] - box[0]) / 1000) * h;
        if (pw >= 90 && ph >= 90) { // crop real figures; drop small/mis-boxed regions (shown as a discrete chip)
          const figName = `fig-p${tag}-${String(++figIdx).padStart(2, '0')}.png`;
          const ok = await cropFigure(pngPath, box, w, h, path.join(OUT_DIR, figName));
          if (ok) { out.figure = figName; if (b.block_type === 'captioned-figure') (out.content as any).src = figName; }
        } else if (b.block_type === 'captioned-figure') {
          out.error = `figure box too small (${Math.round(pw)}x${Math.round(ph)}px), dropped crop`;
        }
      }
      blocks.push(out);
    }
    const ok = blocks.filter((b) => b.valid).length;
    const figs = blocks.filter((b) => b.figure).length;
    console.log(`${blocks.length} blocks, ${ok} valid, ${figs} figs cropped`);
    fs.writeFileSync(path.join(OUT_DIR, `page-${tag}.json`), JSON.stringify(blocks, null, 2));
    pages.push({ page: i, w, h, blocks });
  }
  fs.writeFileSync(path.join(OUT_DIR, 'l1-sample.json'), JSON.stringify(pages, null, 2));
  buildPreview(pages);
  const tb = pages.reduce((a, p) => a + p.blocks.length, 0);
  const tv = pages.reduce((a, p) => a + p.blocks.filter((b) => b.valid).length, 0);
  const tf = pages.reduce((a, p) => a + p.blocks.filter((b) => b.figure).length, 0);
  console.log(`\nDONE: ${pages.length} pages, ${tb} blocks, ${tv} valid, ${tf} figures cropped.`);
}

main().catch((e) => { console.error('reconstruct error:', e instanceof Error ? e.message : e); process.exit(1); });
