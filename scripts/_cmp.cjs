const puppeteer = require('puppeteer-core');
const path = require('path');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = '_qie-output/roses-os/reconstruction/l1-en';
(async () => {
  const url = 'file:///' + path.resolve(OUT, 'preview-geometry.html').replace(/\\/g, '/');
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const pg = await b.newPage();
  await pg.setViewport({ width: 1500, height: 1200, deviceScaleFactor: 1 });
  await pg.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 800));
  const secs = await pg.$$('section.page');
  const only = process.argv[2] ? process.argv[2].split(',').map(Number) : null;
  for (let i = 0; i < secs.length; i++) {
    const n = i + 1;
    if (only && !only.includes(n)) continue;
    const tag = String(n).padStart(2, '0');
    await secs[i].screenshot({ path: path.join(OUT, '_cmp-page-' + tag + '.png') });
    console.log('shot page', n);
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
