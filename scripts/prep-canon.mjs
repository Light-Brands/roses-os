/**
 * Prepare the per-page canon assets a reconstruction needs (spec 004 support tool).
 *
 * The reconstruct-geometry driver reads canon-page-NN.pdf + canon-page-NN.png from
 * the manual's out dir. This generalizes the asset prep the L1 lane got by hand:
 * split a source manual PDF into single-page PDFs and rasterize each to a PNG, into
 * `_qie-output/roses-os/reconstruction/<manual>-<lang>/`. General by slug; no L1 path.
 *
 *   node scripts/prep-canon.mjs --manual rose-meditation-level-2 --pdf <path-to.pdf> [--lang en] [--scale 2.0]
 */
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const { PDFDocument } = require('pdf-lib');
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
function arg(name, fb) { const i = process.argv.indexOf(`--${name}`); return i !== -1 && i + 1 < process.argv.length ? process.argv[i + 1] : fb; }
const MANUAL = arg('manual');
const PDF = arg('pdf');
const LANG = arg('lang', 'en');
const SCALE = parseFloat(arg('scale', '2.0'));
if (!MANUAL || !PDF) { console.error('✗ --manual <slug> and --pdf <path> are required.'); process.exit(2); }

const OUT = path.join('_qie-output', 'roses-os', 'reconstruction', `${MANUAL}-${LANG}`);
fs.mkdirSync(OUT, { recursive: true });

// 1) split the source PDF into single-page canon-page-NN.pdf files.
const srcBytes = fs.readFileSync(PDF);
const src = await PDFDocument.load(srcBytes);
const n = src.getPageCount();
console.log(`🧾 prep-canon ${MANUAL} [${LANG}] — ${n} pages from ${PDF}`);
for (let i = 0; i < n; i++) {
  const one = await PDFDocument.create();
  const [pg] = await one.copyPages(src, [i]);
  one.addPage(pg);
  const bytes = await one.save();
  const tag = String(i + 1).padStart(2, '0');
  fs.writeFileSync(path.join(OUT, `canon-page-${tag}.pdf`), bytes);
}
console.log(`   split → ${n} canon-page-NN.pdf in ${OUT}`);

// 2) rasterize each single-page PDF to a PNG via the vendored pdf.js render.html.
const htmlUrl = 'file:///' + path.resolve('scripts/vendor/pdfjs/render.html').replace(/\\/g, '/');
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--allow-file-access-from-files', '--disable-web-security'] });
try {
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.log('  pageerror:', e.message));
  await page.goto(htmlUrl, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.waitForFunction('window.__ready===true', { timeout: 20000 });
  for (let i = 1; i <= n; i++) {
    const tag = String(i).padStart(2, '0');
    const pdf = path.join(OUT, `canon-page-${tag}.pdf`);
    const b64 = fs.readFileSync(pdf).toString('base64');
    const res = await page.evaluate((b, s) => window.renderPdf(b, s), b64, SCALE);
    const png = Buffer.from(res.dataUrl.split(',')[1], 'base64');
    fs.writeFileSync(path.join(OUT, `canon-page-${tag}.png`), png);
    console.log(`   page ${i}: ${res.w}x${res.h}  ${png.length} bytes`);
  }
} finally {
  await browser.close();
}
console.log(`✓ canon assets ready in ${OUT}`);
