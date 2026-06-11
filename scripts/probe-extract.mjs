/**
 * One-off probe: drive scripts/vendor/pdfjs/extract.html over the real Level 1
 * single-page canon PDFs and dump what the deterministic extraction sees. Used to
 * de-risk the new CTM-walk image-rect code before the pipeline is built on it.
 *
 *   node scripts/probe-extract.mjs 2 3
 */
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const D = '_qie-output/roses-os/reconstruction/l1-en';
const pages = process.argv.slice(2).map((n) => parseInt(n, 10)).filter(Boolean);
const htmlUrl = 'file:///' + path.resolve('scripts/vendor/pdfjs/extract.html').replace(/\\/g, '/');

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new',
  args: ['--no-sandbox', '--allow-file-access-from-files', '--disable-web-security'],
});
try {
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.log('  pageerror:', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.log('  console.error:', m.text()); });
  await page.goto(htmlUrl, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.waitForFunction('window.__ready===true', { timeout: 20000 });

  for (const i of pages) {
    const tag = String(i).padStart(2, '0');
    const pdf = path.join(D, `canon-page-${tag}.pdf`);
    if (!fs.existsSync(pdf)) { console.log(`page ${i}: no pdf`); continue; }
    const b64 = fs.readFileSync(pdf).toString('base64');
    const r = await page.evaluate((b) => window.extractGeometry(b), b64);
    console.log(`\n=== page ${i}: ${r.widthPt.toFixed(1)} x ${r.heightPt.toFixed(1)} pt, ${r.items.length} text items, ${r.images.length} images ===`);
    const repl = r.items.filter((it) => /�/.test(it.str)).length;
    console.log(`  replacement chars: ${repl}`);
    console.log('  first 6 items (content-stream order):');
    r.items.slice(0, 6).forEach((it) => console.log(`    "${it.str.slice(0, 40)}"  x=${it.transform[4].toFixed(0)} f=${it.transform[5].toFixed(0)} size=${Math.hypot(it.transform[1], it.transform[3]).toFixed(1)}`));
    r.images.forEach((im, k) => {
      const [x0, y0, x1, y1] = im.rect;
      console.log(`  image ${k}: obj=${im.objId} rect=[${x0.toFixed(0)},${y0.toFixed(0)},${x1.toFixed(0)},${y1.toFixed(0)}] ${(x1 - x0).toFixed(0)}x${(y1 - y0).toFixed(0)}pt png=${im.png ? im.png.naturalW + 'x' + im.png.naturalH : 'none'}`);
    });
  }
} finally {
  await browser.close();
}
