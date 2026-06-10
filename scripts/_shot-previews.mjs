import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const puppeteer = require(process.cwd() + '/node_modules/puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = '_qie-output/roses-os/site-ready-screenshots';
fs.mkdirSync(OUT, { recursive: true });
const MANUALS = ['rose-meditation-level-1', 'rose-meditation-level-2', 'rose-meditation-level-3', 'aura-level-1'];
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--allow-file-access-from-files'] });
for (const slug of MANUALS) {
  const dir = `_qie-output/roses-os/reconstruction/${slug}-en`;
  let html = path.resolve(`${dir}/preview-geometry-portable.html`);
  if (!fs.existsSync(html)) html = path.resolve(`${dir}/preview-geometry.html`);
  if (!fs.existsSync(html)) { console.log(`${slug}: NO preview`); continue; }
  const p = await b.newPage();
  await p.setViewport({ width: 1500, height: 1400 });
  await p.goto('file:///' + html.replace(/\\/g, '/'), { waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 2500));
  const f = `${OUT}/${slug}-canon-vs-reconstruction.png`;
  await p.screenshot({ path: f, fullPage: false });
  const info = await p.evaluate(() => ({ pages: document.querySelectorAll('.page').length, txt: (document.body.innerText || '').length }));
  console.log(`${slug}: ${f}  preview-pages=${info.pages} textLen=${info.txt}`);
  await p.close();
}
await b.close();
