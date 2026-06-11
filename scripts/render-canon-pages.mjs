/**
 * Rasterize each single-page canon PDF (canon-page-NN.pdf) to a PNG using pdfjs
 * inside headless Chrome. Reliable per page because each input is one page (no
 * scroll/pagination guesswork). Output: canon-page-NN.png alongside the PDFs.
 *
 *   node scripts/render-canon-pages.mjs [N]
 */
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const D = '_qie-output/roses-os/reconstruction/l1-en';
const N = Math.max(1, parseInt(process.argv[2] || '10', 10));
const SCALE = 2.0;

const htmlUrl = 'file:///' + path.resolve('scripts/vendor/pdfjs/render.html').replace(/\\/g, '/');

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--allow-file-access-from-files', '--disable-web-security'],
});
try {
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.log('  pageerror:', e.message));
  await page.goto(htmlUrl, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.waitForFunction('window.__ready===true', { timeout: 20000 });

  for (let i = 1; i <= N; i++) {
    const tag = String(i).padStart(2, '0');
    const pdf = path.join(D, `canon-page-${tag}.pdf`);
    if (!fs.existsSync(pdf)) { console.log(`page ${i}: no pdf, skip`); continue; }
    const b64 = fs.readFileSync(pdf).toString('base64');
    const res = await page.evaluate((b, s) => window.renderPdf(b, s), b64, SCALE);
    const png = Buffer.from(res.dataUrl.split(',')[1], 'base64');
    fs.writeFileSync(path.join(D, `canon-page-${tag}.png`), png);
    console.log(`page ${i}: ${res.w}x${res.h}  ${png.length} bytes`);
  }
} finally {
  await browser.close();
}
console.log('render done');
