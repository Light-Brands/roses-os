/** Screenshot each page section of the deterministic reconstruction preview
 *  (spec 003 T-VER, AC10/AC11). Opens the file:// URL directly; no server. */
import { createRequire } from 'module';
import path from 'path';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const D = '_qie-output/roses-os/reconstruction/l1-en';
const url = 'file:///' + path.resolve(`${D}/preview-geometry.html`).replace(/\\/g, '/');

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--allow-file-access-from-files'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 1400, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 40000 });
  await new Promise((r) => setTimeout(r, 1500));
  const secs = await page.$$('.page');
  for (let i = 0; i < Math.min(10, secs.length); i++) {
    await secs[i].screenshot({ path: `${D}/_geom-shot-page-${i + 1}.png` });
    console.log(`shot page ${i + 1}`);
  }
} finally { await browser.close(); }
