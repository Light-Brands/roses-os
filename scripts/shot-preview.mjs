import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const D = '_qie-output/roses-os/reconstruction/l1-en';

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 1400, deviceScaleFactor: 1 });
  await page.goto('http://localhost:8099/preview.html', { waitUntil: 'networkidle2', timeout: 40000 });
  await new Promise((r) => setTimeout(r, 2500));
  const secs = await page.$$('.page');
  for (let i = 0; i < Math.min(10, secs.length); i++) {
    await secs[i].screenshot({ path: `${D}/_shot-page-${i + 1}.png` });
    console.log(`shot page ${i + 1}`);
  }
} finally { await browser.close(); }
