/*
 * _editor-images-pdf.cjs — verify (A) paste-to-upload into an Image block and
 * (B) the PDF/HTML export renders all block types with resolvable images.
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = process.env.BASE || 'http://localhost:3005';
const MANUAL = '2ab33901-9633-4b83-96dd-c5edcc918ce1';
const URL = `${BASE}/manuals/${MANUAL}`;
const OUT = path.resolve('tests/_manuals-editor', 'images-pdf');
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = [];
const rec = (id, ok, msg) => { out.push({ id, ok }); console.log(`[${ok ? 'PASS' : 'FAIL'}] ${id}${msg ? ' :: ' + msg : ''}`); };
// 1x1 png
const PNG_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

(async () => {
  const initial = (await (await fetch(`${BASE}/api/manuals/${MANUAL}/blocks?language=en`)).json()).data.length;
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('roses-manual-auth', JSON.stringify({ role: 'editor', timestamp: Date.now() })); } catch {} });
  const net = []; const created = [];
  page.on('response', (r) => { if (r.url().includes('/api/manuals')) net.push({ url: r.url(), status: r.status(), method: r.request().method() }); });
  page.on('response', async (r) => { try { if (r.request().method() === 'POST' && /\/blocks$/.test(r.url()) && r.status() === 201) { const j = await r.json().catch(() => null); if (j && j.data && j.data.id) created.push(j.data.id); } } catch {} });
  const since = (m, p) => net.slice(m).filter(p);
  const wait = async (p, ms = 12000) => { const t = Date.now(); while (Date.now() - t < ms) { if (await p()) return true; await sleep(150); } return false; };
  const count = () => page.evaluate(() => { for (const s of document.querySelectorAll('span')) { const m = s.textContent.trim().match(/^(\d+)\s+blocks?$/); if (m) return +m[1]; } return null; });

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 90000 });
  await wait(async () => (await count()) !== null, 60000);
  await sleep(500);

  // ===== A) PASTE INTO AN IMAGE BLOCK =====
  try {
    // add an Image block at top
    let mark = net.length;
    await page.evaluate(() => { const b = document.querySelector('button[aria-label="Add block"]'); if (b) { b.scrollIntoView({ block: 'center' }); b.click(); } });
    await sleep(280);
    await page.evaluate(() => { const t = [...document.querySelectorAll('button')].find((x) => { const d = x.querySelector('.text-sm.font-medium'); return d && d.textContent.trim() === 'Image'; }); if (t) t.click(); });
    await wait(() => since(mark, (e) => /\/blocks$/.test(e.url) && e.method === 'POST' && e.status === 201).length > 0);
    await sleep(600);
    const imageBlockId = created[created.length - 1];
    // the dropzone should be present and focusable
    const zonePresent = await page.evaluate(() => !!document.querySelector('[aria-label="Upload image: paste, drop, or click"]'));
    // dispatch a paste carrying a PNG file
    mark = net.length;
    const dispatched = await page.evaluate((b64) => {
      const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
      const file = new File([bytes], 'paste.png', { type: 'image/png' });
      const dt = new DataTransfer(); dt.items.add(file);
      const zone = document.querySelector('[aria-label="Upload image: paste, drop, or click"]');
      if (!zone) return false;
      const ev = new Event('paste', { bubbles: true, cancelable: true });
      Object.defineProperty(ev, 'clipboardData', { value: dt });
      zone.dispatchEvent(ev);
      return true;
    }, PNG_B64);
    const uploadOk = await wait(() => since(mark, (e) => /\/upload$/.test(e.url) && e.method === 'POST' && e.status === 201).length > 0, 10000);
    // autosave PUT persists the new src
    await wait(() => since(mark, (e) => /\/blocks$/.test(e.url) && e.method === 'PUT' && e.status === 200).length > 0, 8000);
    await sleep(600);
    // an <img> with /uploads/ src should now render in place of the dropzone
    const imgSrc = await page.evaluate(() => { const img = document.querySelector('.group\\/img img, img[src*="/uploads/"]'); return img ? img.getAttribute('src') : null; });
    // confirm DB persisted the uploads path
    const dbBlock = (await (await fetch(`${BASE}/api/manuals/${MANUAL}/blocks?language=en`)).json()).data.find((b) => b.id === imageBlockId);
    const dbSrc = dbBlock && dbBlock.content && dbBlock.content.src;
    await page.screenshot({ path: path.join(OUT, 'A-paste.png') });
    rec('A-paste-into-image', zonePresent && dispatched && uploadOk && !!imgSrc && /\/uploads\//.test(imgSrc) && /\/uploads\//.test(dbSrc || ''), `zone=${zonePresent} disp=${dispatched} upload201=${uploadOk} domSrc=${imgSrc} dbSrc=${dbSrc}`);
  } catch (e) { rec('A-paste-into-image', false, 'ex ' + e.message); }

  // ===== B) PDF/HTML EXPORT =====
  try {
    // capture the export HTML by overriding window.open in the page
    await page.evaluate(() => { window.__openedUrl = null; const orig = window.open; window.open = (u) => { window.__openedUrl = u; return { focus() {}, addEventListener() {}, print() {} }; window.__origOpen = orig; };
    });
    // open Download menu, click Print as PDF
    await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /Download/.test(x.textContent)); if (b) b.click(); });
    await sleep(300);
    await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /Print as PDF/.test(x.textContent)); if (b) b.click(); });
    await sleep(400);
    const html = await page.evaluate(async () => { if (!window.__openedUrl) return null; const r = await fetch(window.__openedUrl); return await r.text(); });
    if (!html) throw new Error('no export html captured');
    fs.writeFileSync(path.join(OUT, 'export.html'), html);
    // assertions on the exported HTML
    const checks = {
      hasCover: /class="cover"/.test(html),
      hasCallout: /class="callout/.test(html),
      hasFigure: /class="figure"/.test(html),
      hasTwoCol: /class="two-col"/.test(html),
      hasContents: /class="contents"/.test(html),
      hasExercise: /class="exercise"/.test(html),
    };
    // collect absolute image srcs and verify they resolve
    const srcs = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]);
    const absImgs = srcs.filter((s) => /^https?:\/\//.test(s));
    let resolved = 0;
    for (const s of absImgs.slice(0, 6)) { try { const r = await fetch(s); if (r.status === 200) resolved++; } catch {} }
    const allTypesOk = Object.values(checks).every(Boolean);
    rec('B-pdf-block-types', allTypesOk, JSON.stringify(checks));
    rec('B-pdf-images-present', srcs.length > 0 && absImgs.length > 0, `imgTags=${srcs.length} absolute=${absImgs.length}`);
    rec('B-pdf-images-resolve', resolved > 0 && resolved === Math.min(6, absImgs.length), `resolved ${resolved}/${Math.min(6, absImgs.length)}`);
    rec('B-pdf-has-styles', /<style>[\s\S]*\.callout[\s\S]*\.two-col[\s\S]*<\/style>/.test(html), 'inline brand styles present');
  } catch (e) { rec('B-pdf-export', false, 'ex ' + e.message); }

  // cleanup scratch
  for (const id of created) await fetch(`${BASE}/api/manuals/${MANUAL}/blocks`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }).catch(() => {});
  await sleep(600);
  const rows = (await (await fetch(`${BASE}/api/manuals/${MANUAL}/blocks?language=en`)).json()).data.slice().sort((a, b) => a.position - b.position).map((r) => r.id);
  await fetch(`${BASE}/api/manuals/${MANUAL}/blocks/reorder`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ block_ids: rows, updated_by: 'qa-cleanup' }) }).catch(() => {});
  await sleep(400);
  const final = (await (await fetch(`${BASE}/api/manuals/${MANUAL}/blocks?language=en`)).json()).data.length;
  rec('cleanup', final === initial, `en rows ${initial} -> ${final}`);

  await browser.close();
  const pass = out.filter((o) => o.ok).length, fail = out.filter((o) => !o.ok).length;
  console.log(`\n==== IMAGES+PDF pass=${pass} fail=${fail} ====`);
  process.exit(fail > 0 ? 1 : 0);
})().catch((e) => { console.error('CRASH', e); process.exit(2); });
