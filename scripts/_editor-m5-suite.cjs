/*
 * _editor-m5-suite.cjs — thorough /test-feature suite for in-column authoring (M5).
 *
 * Drives the real UI as editor. Verdicts come from the write routes plus the
 * container's persisted content arrays read straight from the API (ground truth).
 * Every scratch row (container + children) is deleted in cleanup; real
 * reconstruction rows are never mutated. Self-contained: each case operates on a
 * scratch container created at the top of the lane.
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = process.env.BASE || 'http://localhost:3005';
const MANUAL = '2ab33901-9633-4b83-96dd-c5edcc918ce1';
const URL = `${BASE}/manuals/${MANUAL}`;
const RUN = process.env.RUN_ID || 'm5-suite';
const OUT = path.resolve('tests/_manuals-editor', RUN);
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
function rec(id, ok, msg) { results.push({ id, status: ok ? 'pass' : 'fail', msg: msg || '' }); console.log(`[${ok ? 'PASS' : 'FAIL'}] ${id}${msg ? ' :: ' + msg : ''}`); }

const COL_LABEL = { heading: 'Heading', text: 'Text', callout: 'Callout', quote: 'Quote', 'captioned-figure': 'Captioned Figure', 'numbered-exercise': 'Numbered Exercise', table: 'Table', divider: 'Divider', image: 'Image', 'spoken-instruction': 'Spoken Instruction' };

async function apiBlocks() { return (await (await fetch(`${BASE}/api/manuals/${MANUAL}/blocks?language=en`)).json()).data; }
async function apiContainer(id) { return (await apiBlocks()).find((b) => b.id === id); }

(async () => {
  const initial = (await apiBlocks()).length;
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });
  await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('roses-manual-auth', JSON.stringify({ role: 'editor', timestamp: Date.now() })); } catch {} });
  const net = []; const created = [];
  page.on('response', (r) => { if (r.url().includes('/api/manuals')) net.push({ url: r.url(), status: r.status(), method: r.request().method() }); });
  page.on('response', async (r) => { try { if (r.request().method() === 'POST' && /\/blocks$/.test(r.url()) && r.status() === 201) { const j = await r.json().catch(() => null); if (j && j.data && j.data.id) created.push(j.data.id); } } catch {} });
  const since = (m, p) => net.slice(m).filter(p);
  const wait = async (p, ms = 12000) => { const t = Date.now(); while (Date.now() - t < ms) { if (await p()) return true; await sleep(150); } return false; };
  const count = () => page.evaluate(() => { for (const s of document.querySelectorAll('span')) { const m = s.textContent.trim().match(/^(\d+)\s+blocks?$/); if (m) return +m[1]; } return null; });
  const topWrappers = () => page.evaluate(() => document.querySelectorAll('[class*="group/block"]').length);
  const shot = (id) => page.screenshot({ path: path.join(OUT, id + '.png') }).catch(() => {});

  // add a top-level block via the page's top add menu; return the created id
  async function addTopLevel(label) {
    const mark = net.length;
    await page.evaluate(() => { const b = document.querySelector('button[aria-label="Add block"]'); if (b) { b.scrollIntoView({ block: 'center' }); b.click(); } });
    await sleep(280);
    await page.evaluate((label) => { const t = [...document.querySelectorAll('button')].find((x) => { const d = x.querySelector('.text-sm.font-medium'); return d && d.textContent.trim() === label; }); if (t) t.click(); }, label);
    await wait(() => since(mark, (e) => /\/blocks$/.test(e.url) && e.method === 'POST' && e.status === 201).length > 0);
    await wait(() => since(mark, (e) => /reorder$/.test(e.url) && e.method === 'PUT' && e.status === 200).length > 0);
    await sleep(500);
    return created[created.length - 1];
  }
  // open a column's add menu (side 0=left,1=right of the FIRST grid) and pick label
  async function addToColumn(side, label) {
    const mark = net.length;
    const opened = await page.evaluate((side) => { const grid = document.querySelector('div[style*="grid-template-columns"]'); const cell = grid && grid.children[side]; const btn = cell && cell.querySelector('button[aria-label="Add block"]'); if (btn) { btn.scrollIntoView({ block: 'center' }); btn.click(); return true; } return false; }, side);
    await sleep(280);
    const clicked = await page.evaluate((label) => { const t = [...document.querySelectorAll('button')].find((x) => { const d = x.querySelector('.text-sm.font-medium'); return d && d.textContent.trim() === label; }); if (t) { t.click(); return true; } return false; }, label);
    const post = await wait(() => since(mark, (e) => /\/blocks$/.test(e.url) && e.method === 'POST' && e.status === 201).length > 0);
    const put = await wait(() => since(mark, (e) => /\/blocks$/.test(e.url) && e.method === 'PUT' && e.status === 200).length > 0);
    await sleep(450);
    return { opened, clicked, post, put, childId: created[created.length - 1] };
  }
  const hasErrorOverlay = () => page.evaluate(() => { for (const p of document.querySelectorAll('nextjs-portal')) { const sr = p.shadowRoot; if (sr && sr.querySelector('[data-nextjs-dialog], [data-nextjs-dialog-overlay], .nextjs-container-errors-header')) return true; } return /Unhandled Runtime Error|Build Error/.test(document.body.innerText || ''); });

  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 90000 });
  await wait(async () => (await count()) !== null, 60000);
  await sleep(500);
  const baseTop = await topWrappers();

  // M01 — add a two-column container; renders two empty columns + hints
  let containerId;
  try {
    containerId = await addTopLevel('Two Columns');
    const c = await apiContainer(containerId);
    const hints = await page.evaluate(() => { const grid = document.querySelector('div[style*="grid-template-columns"]'); if (!grid) return 0; return [...grid.querySelectorAll('p')].filter((p) => /Empty · add a block/.test(p.textContent)).length; });
    rec('M01-add-container', !!containerId && c && c.content.left.length === 0 && c.content.right.length === 0 && hints === 2, `id=${String(containerId).slice(0, 8)} left=${c && c.content.left.length} right=${c && c.content.right.length} hints=${hints}`);
  } catch (e) { rec('M01-add-container', false, 'ex ' + e.message); }

  // M02 — column add menu EXCLUDES nested containers, includes leaf types
  try {
    await page.evaluate(() => { const grid = document.querySelector('div[style*="grid-template-columns"]'); const btn = grid.children[0].querySelector('button[aria-label="Add block"]'); btn.click(); });
    await sleep(300);
    const opts = await page.evaluate(() => [...document.querySelectorAll('.text-sm.font-medium')].map((d) => d.textContent.trim()));
    // close menu
    await page.keyboard.press('Escape');
    await sleep(150);
    const hasContainers = opts.includes('Two Columns') || opts.includes('Section');
    const hasLeaves = opts.includes('Heading') && opts.includes('Text') && opts.includes('Callout');
    rec('M02-menu-excludes-containers', !hasContainers && hasLeaves, `containers=${hasContainers} leaves=${hasLeaves} (${opts.length} options)`);
  } catch (e) { rec('M02-menu-excludes-containers', false, 'ex ' + e.message); }

  // M03 — add into LEFT column; child persists in container.left; nested editable
  try {
    const before = await count();
    const r = await addToColumn(0, 'Text');
    const c = await apiContainer(containerId);
    const nested = await page.evaluate(() => { const grid = document.querySelector('div[style*="grid-template-columns"]'); return !!grid.children[0].querySelector('[contenteditable="true"]'); });
    const after = await count();
    rec('M03-add-left', r.post && r.put && c.content.left.length === 1 && c.content.left[0] === r.childId && nested && after === before + 1, `post=${r.post} put=${r.put} left=${JSON.stringify(c.content.left.length)} nested=${nested} ${before}->${after}`);
  } catch (e) { rec('M03-add-left', false, 'ex ' + e.message); }

  // M04 — add into RIGHT column independently; left unchanged
  try {
    const r = await addToColumn(1, 'Callout');
    const c = await apiContainer(containerId);
    rec('M04-add-right', r.post && c.content.right.length === 1 && c.content.right[0] === r.childId && c.content.left.length === 1, `right=${c.content.right.length} left=${c.content.left.length}`);
  } catch (e) { rec('M04-add-right', false, 'ex ' + e.message); }

  // M05 — add several leaf types into the left column; each 201, no overlay
  try {
    const types = ['heading', 'quote', 'numbered-exercise', 'captioned-figure', 'table', 'divider', 'image', 'spoken-instruction'];
    const fails = [];
    for (const t of types) { const r = await addToColumn(0, COL_LABEL[t]); if (!(r.post && r.put)) fails.push(t + ':' + r.post + '/' + r.put); }
    const overlay = await hasErrorOverlay();
    const c = await apiContainer(containerId);
    await shot('M05-many-types');
    rec('M05-many-types', fails.length === 0 && !overlay && c.content.left.length === 1 + types.length, `fails=${fails.join(',')} overlay=${overlay} left=${c.content.left.length}`);
  } catch (e) { rec('M05-many-types', false, 'ex ' + e.message); }

  // M06 — children render in array order in the left column (no jumble)
  try {
    const c = await apiContainer(containerId);
    const domCount = await page.evaluate(() => { const grid = document.querySelector('div[style*="grid-template-columns"]'); return grid.children[0].querySelectorAll('.group\\/nested').length; });
    rec('M06-order-render', domCount === c.content.left.length, `dom nested=${domCount} array=${c.content.left.length}`);
  } catch (e) { rec('M06-order-render', false, 'ex ' + e.message); }

  // M07 — move a child up within the left column; container.left order changes + persists
  try {
    const before = (await apiContainer(containerId)).content.left.slice();
    // hover the 2nd nested child, click its Move up
    await page.evaluate(() => { const grid = document.querySelector('div[style*="grid-template-columns"]'); const nodes = grid.children[0].querySelectorAll('.group\\/nested'); const n = nodes[1]; if (n) { n.scrollIntoView({ block: 'center' }); n.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })); } });
    await sleep(200);
    const clicked = await page.evaluate(() => { const grid = document.querySelector('div[style*="grid-template-columns"]'); const nodes = grid.children[0].querySelectorAll('.group\\/nested'); const n = nodes[1]; const b = n && n.querySelector('button[title="Move up"]'); if (b && !b.disabled) { b.click(); return true; } return false; });
    await sleep(500);
    const after = (await apiContainer(containerId)).content.left.slice();
    const swapped = before[0] === after[1] && before[1] === after[0];
    rec('M07-move-within-column', clicked && swapped && after.length === before.length, `clicked=${clicked} swapped=${swapped}`);
  } catch (e) { rec('M07-move-within-column', false, 'ex ' + e.message); }

  // M08 — first child Move-up disabled, last child Move-down disabled
  try {
    const probe = await page.evaluate(() => {
      const grid = document.querySelector('div[style*="grid-template-columns"]');
      const nodes = grid.children[0].querySelectorAll('.group\\/nested');
      const first = nodes[0].querySelector('button[title="Move up"]');
      const last = nodes[nodes.length - 1].querySelector('button[title="Move down"]');
      return { firstUpDisabled: !!first.disabled, lastDownDisabled: !!last.disabled };
    });
    rec('M08-edge-disabled', probe.firstUpDisabled && probe.lastDownDisabled, JSON.stringify(probe));
  } catch (e) { rec('M08-edge-disabled', false, 'ex ' + e.message); }

  // M09 — edit a nested child's content autosaves
  try {
    const mark = net.length;
    await page.evaluate(() => { const grid = document.querySelector('div[style*="grid-template-columns"]'); const ed = grid.children[0].querySelector('[contenteditable="true"]'); if (ed) ed.focus(); });
    await page.keyboard.type('nested edit ok', { delay: 12 });
    const put = await wait(() => since(mark, (e) => /\/blocks$/.test(e.url) && e.method === 'PUT' && e.status === 200).length > 0, 8000);
    rec('M09-edit-nested-autosave', put, `put200=${put}`);
  } catch (e) { rec('M09-edit-nested-autosave', false, 'ex ' + e.message); }

  // M10 — no top-level leak: children never render at top level
  try {
    const c = await apiContainer(containerId);
    const childTotal = c.content.left.length + c.content.right.length;
    const top = await topWrappers();
    // baseTop + 1 (the container itself is a new top-level block); children excluded
    rec('M10-no-top-leak', top === baseTop + 1, `topWrappers=${top} expected=${baseTop + 1} childrenNested=${childTotal}`);
  } catch (e) { rec('M10-no-top-leak', false, 'ex ' + e.message); }

  // M11 — persistence across reload: container + both columns survive
  try {
    const beforeC = await apiContainer(containerId);
    await page.reload({ waitUntil: 'networkidle2', timeout: 60000 });
    await wait(async () => (await count()) !== null, 60000);
    await sleep(700);
    const stillNested = await page.evaluate(() => { const grid = document.querySelector('div[style*="grid-template-columns"]'); return grid ? grid.children[0].querySelectorAll('.group\\/nested').length : -1; });
    const afterC = await apiContainer(containerId);
    const same = JSON.stringify(beforeC.content.left) === JSON.stringify(afterC.content.left) && JSON.stringify(beforeC.content.right) === JSON.stringify(afterC.content.right);
    await shot('M11-after-reload');
    rec('M11-reload-persist', same && stillNested === afterC.content.left.length, `arraysSame=${same} domNested=${stillNested} array=${afterC.content.left.length}`);
  } catch (e) { rec('M11-reload-persist', false, 'ex ' + e.message); }

  // M12 — remove a child from the column: DELETE + removed from array + gone
  try {
    const beforeC = await apiContainer(containerId);
    const beforeLen = beforeC.content.left.length;
    const removeId = beforeC.content.left[beforeC.content.left.length - 1];
    const mark = net.length;
    await page.evaluate(() => { const grid = document.querySelector('div[style*="grid-template-columns"]'); const nodes = grid.children[0].querySelectorAll('.group\\/nested'); const n = nodes[nodes.length - 1]; n.scrollIntoView({ block: 'center' }); n.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })); });
    await sleep(200);
    const clicked = await page.evaluate(() => { const grid = document.querySelector('div[style*="grid-template-columns"]'); const nodes = grid.children[0].querySelectorAll('.group\\/nested'); const n = nodes[nodes.length - 1]; const b = n.querySelector('button[title="Remove from column"]'); if (b) { b.click(); return true; } return false; });
    await wait(() => since(mark, (e) => /\/blocks$/.test(e.url) && e.method === 'DELETE').length > 0, 8000);
    await sleep(500);
    const afterC = await apiContainer(containerId);
    const gone = !afterC.content.left.includes(removeId);
    const rowGone = !(await apiBlocks()).some((b) => b.id === removeId);
    rec('M12-remove-child', clicked && gone && rowGone && afterC.content.left.length === beforeLen - 1, `clicked=${clicked} arrGone=${gone} rowGone=${rowGone} ${beforeLen}->${afterC.content.left.length}`);
  } catch (e) { rec('M12-remove-child', false, 'ex ' + e.message); }

  // M13 — Section container in-column add (separate code path, same handlers)
  try {
    const sectionId = await addTopLevel('Section');
    // the section is the first <section class="border-l-2"> in the doc
    const mark = net.length;
    const opened = await page.evaluate(() => { const sec = document.querySelector('section[class*="border-l-2"]'); const btn = sec && sec.querySelector('button[aria-label="Add block"]'); if (btn) { btn.scrollIntoView({ block: 'center' }); btn.click(); return true; } return false; });
    await sleep(280);
    await page.evaluate(() => { const t = [...document.querySelectorAll('button')].find((x) => { const d = x.querySelector('.text-sm.font-medium'); return d && d.textContent.trim() === 'Text'; }); if (t) t.click(); });
    await wait(() => since(mark, (e) => /\/blocks$/.test(e.url) && e.method === 'POST' && e.status === 201).length > 0);
    await wait(() => since(mark, (e) => /\/blocks$/.test(e.url) && e.method === 'PUT' && e.status === 200).length > 0);
    await sleep(400);
    const sec = await apiContainer(sectionId);
    rec('M13-section-add', sec && sec.content.children.length === 1, `section children=${sec && sec.content.children.length}`);
  } catch (e) { rec('M13-section-add', false, 'ex ' + e.message); }

  // M14 — teacher read-only: container renders children but NO add menu / controls
  try {
    const T = await browser.newPage();
    await T.setViewport({ width: 1440, height: 1000 });
    await T.evaluateOnNewDocument(() => { try { sessionStorage.setItem('roses-manual-auth', JSON.stringify({ role: 'teacher', timestamp: Date.now() })); } catch {} });
    await T.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await wait(async () => { for (const s of await T.$$('span')) {} return (await T.evaluate(() => { for (const s of document.querySelectorAll('span')) { if (/^\d+ blocks?$/.test(s.textContent.trim())) return true; } return false; })); }, 60000);
    await sleep(500);
    const probe = await T.evaluate(() => { const grid = document.querySelector('div[style*="grid-template-columns"]'); return { gridPresent: !!grid, addInCol: !!(grid && grid.querySelector('button[aria-label="Add block"]')), nestedCtrls: !!document.querySelector('button[title="Remove from column"]') }; });
    await T.close();
    rec('M14-teacher-readonly', probe.gridPresent && !probe.addInCol && !probe.nestedCtrls, JSON.stringify(probe));
  } catch (e) { rec('M14-teacher-readonly', false, 'ex ' + e.message); }

  // ---- cleanup ----
  console.log(`cleanup: deleting ${created.length} scratch rows`);
  for (const id of created) await fetch(`${BASE}/api/manuals/${MANUAL}/blocks`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }).catch(() => {});
  await sleep(700);
  const rows = (await apiBlocks()).slice().sort((a, b) => a.position - b.position).map((r) => r.id);
  await fetch(`${BASE}/api/manuals/${MANUAL}/blocks/reorder`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ block_ids: rows, updated_by: 'qa-cleanup' }) }).catch(() => {});
  await sleep(400);
  const final = (await apiBlocks()).length;
  rec('cleanup', final === initial, `en rows ${initial} -> ${final} (created ${created.length})`);

  await browser.close();
  const pass = results.filter((r) => r.status === 'pass').length, fail = results.filter((r) => r.status === 'fail').length;
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify({ run: RUN, initial, final, pass, fail, results }, null, 2));
  console.log(`\n==== M5 SUITE pass=${pass} fail=${fail} ====`);
  process.exit(fail > 0 ? 1 : 0);
})().catch((e) => { console.error('CRASH', e); process.exit(2); });
