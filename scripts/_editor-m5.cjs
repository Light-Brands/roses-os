/*
 * _editor-m5.cjs — focused check for in-column authoring (M5).
 * Adds a two-column block, creates a Text block inside its left column, types,
 * reloads to prove persistence, moves/removes, then deletes the scratch rows.
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = process.env.BASE || 'http://localhost:3005';
const MANUAL = '2ab33901-9633-4b83-96dd-c5edcc918ce1';
const URL = `${BASE}/manuals/${MANUAL}`;
const OUT = path.resolve('tests/_manuals-editor', 'm5');
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = [];
const log = (s, msg) => { out.push({ s, msg }); console.log(`[${s}] ${msg}`); };

(async () => {
  const initial = (await (await fetch(`${BASE}/api/manuals/${MANUAL}/blocks?language=en`)).json()).data.length;
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  const page = await b.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('roses-manual-auth', JSON.stringify({ role: 'editor', timestamp: Date.now() })); } catch {} });
  const net = [];
  const created = [];
  page.on('response', (r) => { if (r.url().includes('/api/manuals')) net.push({ url: r.url(), status: r.status(), method: r.request().method() }); });
  page.on('response', async (r) => { try { if (r.request().method() === 'POST' && /\/blocks$/.test(r.url()) && r.status() === 201) { const j = await r.json().catch(() => null); if (j && j.data && j.data.id) created.push(j.data.id); } } catch {} });
  const since = (m, p) => net.slice(m).filter(p);
  const wait = async (p, ms = 12000) => { const t = Date.now(); while (Date.now() - t < ms) { if (await p()) return true; await sleep(150); } return false; };
  const count = () => page.evaluate(() => { for (const s of document.querySelectorAll('span')) { const m = s.textContent.trim().match(/^(\d+)\s+blocks?$/); if (m) return +m[1]; } return null; });

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 90000 });
  await wait(async () => (await count()) !== null, 60000);
  await sleep(500);
  const c0 = await count();

  // 1) add a two-column block via the top add menu
  let mark = net.length;
  await page.evaluate(() => { const x = document.querySelector('button[aria-label="Add block"]'); if (x) { x.scrollIntoView({ block: 'center' }); x.click(); } });
  await sleep(280);
  await page.evaluate(() => { const t = [...document.querySelectorAll('button')].find((x) => { const d = x.querySelector('.text-sm.font-medium'); return d && d.textContent.trim() === 'Two Columns'; }); if (t) t.click(); });
  const addedContainer = await wait(() => since(mark, (e) => /\/blocks$/.test(e.url) && e.method === 'POST' && e.status === 201).length > 0);
  await wait(() => since(mark, (e) => /reorder$/.test(e.url) && e.method === 'PUT' && e.status === 200).length > 0);
  await sleep(600);
  const containerId = created[created.length - 1];
  log(addedContainer ? 'PASS' : 'FAIL', `add two-column container 201 (${String(containerId).slice(0, 8)})`);

  // 2) add a Text block into the LEFT column of the new container
  mark = net.length;
  // the new container is the first grid in the doc; click its left cell's add button
  const opened = await page.evaluate(() => {
    const grid = document.querySelector('div[style*="grid-template-columns"]');
    if (!grid) return false;
    const leftCell = grid.children[0];
    const addBtn = leftCell && leftCell.querySelector('button[aria-label="Add block"]');
    if (addBtn) { addBtn.scrollIntoView({ block: 'center' }); addBtn.click(); return true; }
    return false;
  });
  await sleep(300);
  await page.evaluate(() => { const t = [...document.querySelectorAll('button')].find((x) => { const d = x.querySelector('.text-sm.font-medium'); return d && d.textContent.trim() === 'Text'; }); if (t) t.click(); });
  const childPost = await wait(() => since(mark, (e) => /\/blocks$/.test(e.url) && e.method === 'POST' && e.status === 201).length > 0);
  const containerPut = await wait(() => since(mark, (e) => /\/blocks$/.test(e.url) && e.method === 'PUT' && e.status === 200).length > 0);
  await sleep(600);
  const childId = created[created.length - 1];
  const nestedRendered = await page.evaluate(() => {
    const grid = document.querySelector('div[style*="grid-template-columns"]');
    const leftCell = grid && grid.children[0];
    return !!(leftCell && leftCell.querySelector('[contenteditable="true"]'));
  });
  log(opened && childPost && containerPut && nestedRendered ? 'PASS' : 'FAIL', `create Text inside left column: opened=${opened} childPOST=${childPost} containerPUT=${containerPut} nestedEditable=${nestedRendered}`);

  // 3) type into the nested text and confirm autosave
  mark = net.length;
  await page.evaluate(() => { const grid = document.querySelector('div[style*="grid-template-columns"]'); const ed = grid.children[0].querySelector('[contenteditable="true"]'); if (ed) ed.focus(); });
  await page.keyboard.type('M5 nested content', { delay: 15 });
  const savedPut = await wait(() => since(mark, (e) => /\/blocks$/.test(e.url) && e.method === 'PUT' && e.status === 200).length > 0, 8000);
  await sleep(400);
  await page.screenshot({ path: path.join(OUT, 'm5-after-add.png') });
  log(savedPut ? 'PASS' : 'FAIL', `type in nested block autosave PUT 200 = ${savedPut}`);

  // 4) reload — prove the child persists inside the column (DB has both the row
  //    and the container's left[] reference)
  await page.reload({ waitUntil: 'networkidle2', timeout: 60000 });
  await wait(async () => (await count()) !== null, 60000);
  await sleep(700);
  const persisted = await page.evaluate(() => {
    const grid = document.querySelector('div[style*="grid-template-columns"]');
    const leftCell = grid && grid.children[0];
    return !!(leftCell && /M5 nested content/.test(leftCell.innerText));
  });
  await page.screenshot({ path: path.join(OUT, 'm5-after-reload.png') });
  log(persisted ? 'PASS' : 'FAIL', `nested child + text persist across reload = ${persisted}`);

  // 5) the child must NOT also render at top level (childIdSet pulls it out)
  const c1 = await count();
  const notDoubled = c1 === c0 + 2; // container + child
  log(notDoubled ? 'PASS' : 'FAIL', `row count ${c0} -> ${c1} (container+child, no double-render leak)`);

  // 6) remove the child from the column via the nested control
  mark = net.length;
  await page.evaluate(() => { const grid = document.querySelector('div[style*="grid-template-columns"]'); const leftCell = grid.children[0]; const node = leftCell.querySelector('.group\\/nested'); if (node) { const evt = new MouseEvent('mouseover', { bubbles: true }); node.dispatchEvent(evt); } });
  await sleep(200);
  const removed = await page.evaluate(() => { const btn = document.querySelector('button[title="Remove from column"]'); if (btn) { btn.click(); return true; } return false; });
  await wait(() => since(mark, (e) => /\/blocks$/.test(e.url) && e.method === 'DELETE').length > 0, 8000);
  await sleep(500);
  const c2 = await count();
  log(removed && c2 === c1 - 1 ? 'PASS' : 'FAIL', `remove from column: clicked=${removed} ${c1} -> ${c2}`);

  // cleanup: delete every scratch row, then renumber the lane contiguous
  for (const id of created) await fetch(`${BASE}/api/manuals/${MANUAL}/blocks`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }).catch(() => {});
  await sleep(600);
  const rows = (await (await fetch(`${BASE}/api/manuals/${MANUAL}/blocks?language=en`)).json()).data.slice().sort((a, c) => a.position - c.position).map((r) => r.id);
  await fetch(`${BASE}/api/manuals/${MANUAL}/blocks/reorder`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ block_ids: rows, updated_by: 'qa-cleanup' }) }).catch(() => {});
  await sleep(400);
  const final = (await (await fetch(`${BASE}/api/manuals/${MANUAL}/blocks?language=en`)).json()).data.length;
  log(final === initial ? 'PASS' : 'FAIL', `cleanup en rows ${initial} -> ${final}`);

  await b.close();
  const pass = out.filter((o) => o.s === 'PASS').length, fail = out.filter((o) => o.s === 'FAIL').length;
  console.log(`\n==== M5 SUMMARY pass=${pass} fail=${fail} ====`);
  process.exit(fail > 0 ? 1 : 0);
})().catch((e) => { console.error('CRASH', e); process.exit(2); });
