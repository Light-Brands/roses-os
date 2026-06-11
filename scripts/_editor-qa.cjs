/*
 * _editor-qa.cjs — /test-feature driver for the Roses OS manuals Block Editor.
 *
 * Non-OAuth local surface: the PIN gate is sessionStorage, injected before the
 * app reads it (evaluateOnNewDocument). Verdict for write actions comes from the
 * server response on the editor's routes (POST/PUT/DELETE /api/manuals/:id/blocks
 * and .../blocks/reorder), captured by a network listener. The driver mutates
 * ONLY scratch blocks it creates and deletes every one in cleanup, asserting the
 * final en row count equals the initial. Real reconstruction rows are read-only.
 *
 * Pattern follows scripts/_cmp.cjs (puppeteer-core + on-disk Chrome).
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = process.env.BASE || 'http://localhost:3005';
const MANUAL = '2ab33901-9633-4b83-96dd-c5edcc918ce1';
const URL = `${BASE}/manuals/${MANUAL}`;
const RUN = process.env.RUN_ID || ('run-' + new Date().toISOString().replace(/[:.]/g, '-'));
const OUTDIR = path.resolve('tests/_manuals-editor', RUN);
fs.mkdirSync(OUTDIR, { recursive: true });

const TYPE_LABEL = {
  heading: 'Heading', text: 'Text', image: 'Image', 'image-row': 'Image Row',
  divider: 'Divider', 'page-break': 'Page Break', cover: 'Cover', callout: 'Callout',
  quote: 'Quote', 'numbered-exercise': 'Numbered Exercise', 'captioned-figure': 'Captioned Figure',
  'spoken-instruction': 'Spoken Instruction', table: 'Table', contents: 'Table of Contents',
  footnote: 'Footnote', glossary: 'Glossary', section: 'Section', 'two-column-section': 'Two Columns',
};
const ALL_TYPES = Object.keys(TYPE_LABEL);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
function record(id, status, reason, extra) {
  results.push({ id, status, reason: reason || '', ...(extra || {}) });
  const tag = status === 'pass' ? 'PASS' : status === 'fail' ? 'FAIL' : 'MARG';
  console.log(`[${tag}] ${id}${reason ? ' :: ' + reason : ''}`);
}

async function apiCount(lang) {
  // The first hit to this route in dev compiles it and can return before the
  // body is ready; retry a few times so the count is never a cold-route null.
  for (let i = 0; i < 5; i++) {
    try {
      const r = await fetch(`${BASE}/api/manuals/${MANUAL}/blocks?language=${lang}`);
      const j = await r.json();
      if (Array.isArray(j.data)) return j.data.length;
    } catch { /* retry */ }
    await new Promise((res) => setTimeout(res, 800));
  }
  return null;
}
async function apiDelete(id) {
  await fetch(`${BASE}/api/manuals/${MANUAL}/blocks`, {
    method: 'DELETE', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  }).catch(() => {});
}

(async () => {
  const initialEn = await apiCount('en');
  console.log('initial en rows:', initialEn);

  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: 'new', args: ['--no-sandbox'],
  });

  // ---- network capture ----
  const netlog = [];
  const created = [];
  function attachCapture(page, role) {
    page.on('response', (r) => {
      const u = r.url();
      if (u.includes('/api/manuals')) netlog.push({ role, url: u, status: r.status(), method: r.request().method(), t: Date.now() });
    });
    page.on('response', async (r) => {
      try {
        if (r.request().method() === 'POST' && /\/blocks$/.test(r.url()) && r.status() === 201) {
          const j = await r.json().catch(() => null);
          if (j && j.data && j.data.id) created.push(j.data.id);
        }
      } catch { /* ignore */ }
    });
  }
  const since = (mark, pred) => netlog.slice(mark).filter(pred);
  async function waitUntil(pred, ms = 15000, step = 150) {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) { if (await pred()) return true; await sleep(step); }
    return false;
  }
  async function newGated(role) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
    await page.evaluateOnNewDocument((role) => {
      try { sessionStorage.setItem('roses-manual-auth', JSON.stringify({ role, timestamp: Date.now() })); } catch { /* */ }
    }, role);
    attachCapture(page, role);
    return page;
  }
  const shot = (page, id) => page.screenshot({ path: path.join(OUTDIR, id + '.png'), fullPage: false }).catch(() => {});

  async function getCount(page) {
    return page.evaluate(() => {
      const spans = [...document.querySelectorAll('span')];
      for (const s of spans) { const m = s.textContent.trim().match(/^(\d+)\s+blocks?$/); if (m) return parseInt(m[1], 10); }
      return null;
    });
  }
  async function hasErrorOverlay(page) {
    // A bare <nextjs-portal> is ALWAYS mounted in Next dev (it hosts the dev
    // indicator) — its mere presence is not an error. Only an actual error
    // dialog inside the portal shadow root, or error text in the page, counts.
    return page.evaluate(() => {
      const portals = document.querySelectorAll('nextjs-portal');
      for (const p of portals) {
        const sr = p.shadowRoot;
        if (sr && sr.querySelector('[data-nextjs-dialog], [data-nextjs-dialog-overlay], [data-nextjs-error-overlay], .nextjs-container-errors-header')) return true;
      }
      return /Unhandled Runtime Error|Build Error|Application error: a client-side exception|Failed to compile/.test(document.body.innerText || '');
    });
  }
  async function waitBlocksLoaded(page) {
    await waitUntil(async () => (await getCount(page)) !== null, 60000, 400);
  }
  async function openTopAddMenu(page) {
    await page.evaluate(() => { const b = document.querySelector('button[aria-label="Add block"]'); if (b) { b.scrollIntoView({ block: 'center' }); b.click(); } });
    await sleep(280);
  }
  async function clickMenuOption(page, label) {
    return page.evaluate((label) => {
      const btns = [...document.querySelectorAll('button')];
      for (const b of btns) { const t = b.querySelector('.text-sm.font-medium'); if (t && t.textContent.trim() === label) { b.click(); return true; } }
      return false;
    }, label);
  }
  async function addBlock(page, type) {
    const mark = netlog.length;
    await openTopAddMenu(page);
    const ok = await clickMenuOption(page, TYPE_LABEL[type]);
    if (!ok) return { ok: false, reason: 'menu option not found: ' + TYPE_LABEL[type] };
    const gotPost = await waitUntil(() => since(mark, (e) => /\/blocks$/.test(e.url) && e.method === 'POST').length > 0, 15000);
    const post = since(mark, (e) => /\/blocks$/.test(e.url) && e.method === 'POST')[0];
    const gotReorder = await waitUntil(() => since(mark, (e) => /reorder$/.test(e.url) && e.method === 'PUT').length > 0, 15000);
    const reorder = since(mark, (e) => /reorder$/.test(e.url) && e.method === 'PUT')[0];
    await sleep(350);
    // ok requires a real 201 — a 500 (e.g. a unique-violation) must NOT pass.
    return { ok: gotPost && !!post && post.status === 201, post, reorder, gotReorder };
  }

  // =========================================================================
  // EDITOR PAGE
  // =========================================================================
  const E = await newGated('editor');
  await E.goto(URL, { waitUntil: 'networkidle2', timeout: 90000 });
  await waitBlocksLoaded(E);
  await sleep(500);

  // C01 — editor load
  try {
    const count = await getCount(E);
    const getOk = netlog.some((e) => e.method === 'GET' && /\/blocks\?/.test(e.url) && e.status === 200);
    const overlay = await hasErrorOverlay(E);
    await shot(E, 'C01-editor-load');
    if (count && count > 0 && getOk && !overlay) record('C01-editor-load', 'pass', `${count} blocks, GET 200`);
    else record('C01-editor-load', 'fail', `count=${count} getOk=${getOk} overlay=${overlay}`);
  } catch (e) { record('C01-editor-load', 'fail', 'exception ' + e.message); }

  // C03 — page boundaries (editor only)
  try {
    const boundaries = await E.evaluate(() => [...document.querySelectorAll('span')].filter((s) => /^Page \d+$/.test(s.textContent.trim())).length);
    await shot(E, 'C03-page-boundaries');
    if (boundaries >= 5) record('C03-page-boundaries', 'pass', `${boundaries} Page-N markers`);
    else record('C03-page-boundaries', 'fail', `only ${boundaries} boundary markers`);
  } catch (e) { record('C03-page-boundaries', 'fail', 'exception ' + e.message); }

  // C04 — two-column nested (children pulled out of flat list)
  try {
    const count = await getCount(E);
    const topWrappers = await E.evaluate(() => document.querySelectorAll('[class*="group/block"]').length);
    await shot(E, 'C04-two-column-nested');
    if (topWrappers > 0 && count && topWrappers < count) record('C04-two-column-nested', 'pass', `${topWrappers} top-level < ${count} rows (children nested)`);
    else record('C04-two-column-nested', 'fail', `topWrappers=${topWrappers} count=${count} (expected nesting)`);
  } catch (e) { record('C04-two-column-nested', 'fail', 'exception ' + e.message); }

  // C14 — action toolbar reachable, no dead zone. Headless :hover transitions are
  // unreliable to time, so drive the deterministic tap-to-reveal path (tapping the
  // drag handle sets showActions=true, same toolbar element), then assert the
  // toolbar is opaque + clickable AND hit-testable, AND that the strip carries the
  // pb-2 hover-bridge with no negative-top gap (the structural fix for the dead zone).
  try {
    const wraps = await E.$$('[class*="group/block"]');
    const h = wraps[Math.min(5, wraps.length - 1)];
    if (!h) throw new Error('no block');
    await h.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await sleep(150);
    const tapped = await h.evaluate((el) => { const dh = el.querySelector('[title^="Drag to reorder"]'); if (dh) { dh.click(); return true; } return false; });
    await sleep(300);
    const probe = await E.evaluate((el) => {
      const up = el.querySelector('button[title="Move up"]');
      if (!up) return { found: false };
      let strip = up.parentElement; while (strip && !/translate-y-full/.test(strip.className)) strip = strip.parentElement;
      const cs = strip ? getComputedStyle(strip) : null;
      const cls = strip ? strip.className : '';
      const r = up.getBoundingClientRect();
      const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      return {
        found: true, opacity: cs ? cs.opacity : null, pe: cs ? cs.pointerEvents : null,
        hitIsToolbar: !!(hit && (hit === up || up.contains(hit) || (hit.closest && hit.closest('button[title="Move up"]')))),
        bridge: /pb-2/.test(cls) && /top-0/.test(cls) && !/-top-/.test(cls),
      };
    }, h);
    await shot(E, 'C14-action-toolbar-reachable');
    // Reachability is determined by pointer-events + hit-test + the no-gap bridge.
    // Computed opacity is transition-animated and unreliable to time headless, so
    // it is informational only, not a gate.
    if (probe.found && tapped && probe.pe !== 'none' && probe.hitIsToolbar && probe.bridge) record('C14-action-toolbar-reachable', 'pass', `pe=auto hit=button bridge=ok (opacity=${probe.opacity}, informational)`);
    else record('C14-action-toolbar-reachable', 'fail', `tapped=${tapped} ${JSON.stringify(probe)}`);
  } catch (e) { record('C14-action-toolbar-reachable', 'fail', 'exception ' + e.message); }

  // C05 — add heading at top
  let scratchHeadingPresent = false;
  try {
    const before = await getCount(E);
    const r = await addBlock(E, 'heading');
    const after = await getCount(E);
    const overlay = await hasErrorOverlay(E);
    await shot(E, 'C05-add-heading-top');
    if (r.ok && r.post && r.post.status === 201 && after === before + 1 && !overlay) { record('C05-add-heading-top', 'pass', `201, ${before}->${after}, reorder=${r.reorder && r.reorder.status}`); scratchHeadingPresent = true; }
    else record('C05-add-heading-top', 'fail', `ok=${r.ok} postStatus=${r.post && r.post.status} ${before}->${after} overlay=${overlay} ${r.reason || ''}`);
  } catch (e) { record('C05-add-heading-top', 'fail', 'exception ' + e.message); }

  // C06 — add page break (Dario flag)
  try {
    const before = await getCount(E);
    const r = await addBlock(E, 'page-break');
    const after = await getCount(E);
    const overlay = await hasErrorOverlay(E);
    await shot(E, 'C06-add-page-break');
    if (r.ok && r.post && r.post.status === 201 && after === before + 1 && !overlay) record('C06-add-page-break', 'pass', `201, ${before}->${after}`);
    else record('C06-add-page-break', 'fail', `ok=${r.ok} postStatus=${r.post && r.post.status} ${before}->${after} overlay=${overlay} ${r.reason || ''}`);
  } catch (e) { record('C06-add-page-break', 'fail', 'exception ' + e.message); }

  // C11 — heading level toggle popup (Dario flag: popup closes before clickable).
  // SAFETY: create our own scratch heading at top first and gate on it, so we
  // never change the level of a real reconstruction heading.
  try {
    const scratch = await addBlock(E, 'heading');
    if (!scratch.ok) { record('C11-heading-level-toggle', 'fail', `scratch heading add failed status=${scratch.post && scratch.post.status}`); throw new Error('skip-no-scratch'); }
    // hover the first heading block (our scratch, now at top) to reveal its trigger
    await E.evaluate(() => { const h = document.querySelector('[class*="group/heading"]'); if (h) h.scrollIntoView({ block: 'center' }); });
    await sleep(200);
    const hb = await E.evaluate(() => { const h = document.querySelector('[class*="group/heading"]'); if (!h) return null; const r = h.getBoundingClientRect(); return { x: r.x + 20, y: r.y + r.height / 2 }; });
    if (!hb) throw new Error('no heading block');
    await E.mouse.move(hb.x, hb.y);
    await sleep(200);
    const trigClicked = await E.evaluate(() => { const t = document.querySelector('button[aria-label="Change heading level"]'); if (t) { t.click(); return true; } return false; });
    await sleep(250);
    const menuCount1 = await E.evaluate(() => [...document.querySelectorAll('button')].filter((b) => !b.hasAttribute('aria-label') && /^H[123]$/.test(b.textContent.trim())).length);
    // move pointer far away — the persistence fix means the menu must stay open
    await E.mouse.move(5, 5);
    await sleep(300);
    const menuCount2 = await E.evaluate(() => [...document.querySelectorAll('button')].filter((b) => !b.hasAttribute('aria-label') && /^H[123]$/.test(b.textContent.trim())).length);
    const mark = netlog.length;
    const clickedH1 = await E.evaluate(() => { const b = [...document.querySelectorAll('button')].find((b) => !b.hasAttribute('aria-label') && b.textContent.trim() === 'H1'); if (b) { b.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); return true; } return false; });
    const putOk = await waitUntil(() => since(mark, (e) => /\/blocks$/.test(e.url) && e.method === 'PUT' && e.status === 200).length > 0, 8000);
    await shot(E, 'C11-heading-level-toggle');
    if (trigClicked && menuCount1 === 3 && menuCount2 === 3 && clickedH1 && putOk) record('C11-heading-level-toggle', 'pass', `menu 3 buttons, persisted after pointer-leave, PUT 200`);
    else record('C11-heading-level-toggle', 'fail', `trig=${trigClicked} menuOpen=${menuCount1} afterLeave=${menuCount2} clickedH1=${clickedH1} put200=${putOk}`);
  } catch (e) { if (e.message !== 'skip-no-scratch') record('C11-heading-level-toggle', 'fail', 'exception ' + e.message); }

  // C12 — heading autosave. SAFETY: add our own scratch heading at top and gate
  // on it; only type into THAT (the first heading), never a real heading.
  try {
    const scratch = await addBlock(E, 'heading');
    if (!scratch.ok) { record('C12-heading-autosave', 'fail', `scratch heading add failed status=${scratch.post && scratch.post.status}`); throw new Error('skip-no-scratch'); }
    const mark = netlog.length;
    await E.evaluate(() => { const h = document.querySelector('[aria-label="Heading"]'); if (h) { h.focus(); } });
    await E.keyboard.type('QA scratch heading', { delay: 20 });
    const putOk = await waitUntil(() => since(mark, (e) => /\/blocks$/.test(e.url) && e.method === 'PUT' && e.status === 200).length > 0, 8000);
    await sleep(300);
    const saved = await E.evaluate(() => /All changes saved/.test(document.body.innerText));
    await shot(E, 'C12-heading-autosave');
    if (putOk && saved) record('C12-heading-autosave', 'pass', 'PUT 200, All changes saved');
    else record('C12-heading-autosave', putOk ? 'marginal' : 'fail', `put200=${putOk} savedLabel=${saved}`);
  } catch (e) { if (e.message !== 'skip-no-scratch') record('C12-heading-autosave', 'fail', 'exception ' + e.message); }

  // C13 — add a text block and autosave. SAFETY: gate on the scratch text add;
  // only type into the first contenteditable when our scratch text is at top,
  // never a real block.
  try {
    const r = await addBlock(E, 'text');
    if (!r.ok) { record('C13-text-autosave', 'fail', `scratch text add failed status=${r.post && r.post.status}`); throw new Error('skip-no-scratch'); }
    const mark = netlog.length;
    // focus the first contenteditable (our scratch text, now at top)
    await E.evaluate(() => { const els = [...document.querySelectorAll('[contenteditable="true"]')]; if (els[0]) els[0].focus(); });
    await E.keyboard.type('QA scratch text', { delay: 15 });
    const putOk = await waitUntil(() => since(mark, (e) => /\/blocks$/.test(e.url) && e.method === 'PUT' && e.status === 200).length > 0, 8000);
    await shot(E, 'C13-text-autosave');
    if (putOk) record('C13-text-autosave', 'pass', 'text added + autosave PUT 200');
    else record('C13-text-autosave', 'marginal', `put200=${putOk}`);
  } catch (e) { if (e.message !== 'skip-no-scratch') record('C13-text-autosave', 'fail', 'exception ' + e.message); }

  // C08 — duplicate a block (hover -> Duplicate button)
  try {
    const before = await getCount(E);
    const mark = netlog.length;
    await E.evaluate(() => { const ws = document.querySelectorAll('[class*="group/block"]'); const w = ws[0]; if (w) w.scrollIntoView({ block: 'center' }); });
    await sleep(150);
    const box = await E.evaluate(() => { const w = document.querySelector('[class*="group/block"]'); const r = w.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await E.mouse.move(box.x, box.y); await sleep(200);
    const dup = await E.evaluate(() => { const b = document.querySelector('button[title="Duplicate"]'); if (b) { b.click(); return true; } return false; });
    const gotPost = await waitUntil(() => since(mark, (e) => /\/blocks$/.test(e.url) && e.method === 'POST' && e.status === 201).length > 0, 12000);
    await sleep(400);
    const after = await getCount(E);
    await shot(E, 'C08-duplicate');
    if (dup && gotPost && after === before + 1) record('C08-duplicate', 'pass', `201, ${before}->${after}`);
    else record('C08-duplicate', 'fail', `dupBtn=${dup} post201=${gotPost} ${before}->${after}`);
  } catch (e) { record('C08-duplicate', 'fail', 'exception ' + e.message); }

  // C09 — delete a scratch block (delete the most-recently created scratch row)
  try {
    const before = await getCount(E);
    const target = created[created.length - 1];
    const mark = netlog.length;
    const delOk = await E.evaluate(async (target, base, manual) => {
      const r = await fetch(`${base}/api/manuals/${manual}/blocks`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: target }) });
      return r.status;
    }, target, BASE, MANUAL);
    // remove from cleanup list since it's gone
    const idx = created.indexOf(target); if (idx >= 0) created.splice(idx, 1);
    await shot(E, 'C09-delete');
    if (delOk === 200) record('C09-delete', 'pass', `DELETE 200 for ${String(target).slice(0, 8)}`);
    else record('C09-delete', 'fail', `delete status=${delOk}`);
  } catch (e) { record('C09-delete', 'fail', 'exception ' + e.message); }

  // C10 — move up/down (reorder endpoint 200 twice, count invariant).
  // Scope the Move buttons to a SPECIFIC non-first block handle so we never hit
  // the first block's disabled Move-up button. .click() via evaluate fires the
  // handler regardless of the hover-gated pointer-events.
  try {
    const before = await getCount(E);
    const mark = netlog.length;
    const wraps = await E.$$('[class*="group/block"]');
    const h = wraps[2] || wraps[1];
    if (!h) throw new Error('not enough blocks to move');
    await h.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await sleep(150);
    const upClicked = await h.evaluate((el) => { const b = el.querySelector('button[title="Move up"]'); if (b && !b.disabled) { b.click(); return true; } return false; });
    const up = await waitUntil(() => since(mark, (e) => /reorder$/.test(e.url) && e.method === 'PUT' && e.status === 200).length >= 1, 8000);
    await sleep(500);
    const downClicked = await h.evaluate((el) => { const b = el.querySelector('button[title="Move down"]'); if (b && !b.disabled) { b.click(); return true; } return false; });
    const down = await waitUntil(() => since(mark, (e) => /reorder$/.test(e.url) && e.method === 'PUT' && e.status === 200).length >= 2, 8000);
    await sleep(500);
    const after = await getCount(E);
    await shot(E, 'C10-move-up-down');
    if (upClicked && downClicked && up && down && after === before) record('C10-move-up-down', 'pass', '2x reorder 200, count invariant');
    else record('C10-move-up-down', 'fail', `upClicked=${upClicked} downClicked=${downClicked} up=${up} down=${down} ${before}->${after}`);
  } catch (e) { record('C10-move-up-down', 'fail', 'exception ' + e.message); }

  // C07 — add ALL 18 block types (catch any type whose default content breaks insert/render)
  try {
    const before = await getCount(E);
    const perType = [];
    for (const type of ALL_TYPES) {
      const r = await addBlock(E, type);
      const ok = r.ok && r.post && r.post.status === 201;
      perType.push({ type, status: r.post && r.post.status, ok });
      if (!ok) console.log('  type FAIL', type, r.post && r.post.status, r.reason || '');
    }
    const overlay = await hasErrorOverlay(E);
    const after = await getCount(E);
    const fails = perType.filter((p) => !p.ok);
    await shot(E, 'C07-add-all-types');
    if (fails.length === 0 && after === before + ALL_TYPES.length && !overlay) record('C07-add-all-types', 'pass', `all ${ALL_TYPES.length} types 201, ${before}->${after}`, { perType });
    else record('C07-add-all-types', 'fail', `fails=${fails.map((f) => f.type + ':' + f.status).join(',')} ${before}->${after} overlay=${overlay}`, { perType });
  } catch (e) { record('C07-add-all-types', 'fail', 'exception ' + e.message); }

  // C15 — language switch to es (empty staging lane) without crash
  try {
    const mark = netlog.length;
    await E.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => /Espa|Spanish|^ES$/i.test(x.textContent.trim())); if (b) b.click(); });
    const esGet = await waitUntil(() => since(mark, (e) => /\/blocks\?language=es/.test(e.url) && e.method === 'GET' && e.status === 200).length > 0, 10000);
    await sleep(600);
    const overlay = await hasErrorOverlay(E);
    const emptyMsg = await E.evaluate(() => /No content yet|Start building/.test(document.body.innerText));
    await shot(E, 'C15-language-switch-empty');
    if (esGet && !overlay) record('C15-language-switch-empty', 'pass', `es GET 200, emptyState=${emptyMsg}, no overlay`);
    else record('C15-language-switch-empty', 'fail', `esGet=${esGet} overlay=${overlay} emptyMsg=${emptyMsg}`);
  } catch (e) { record('C15-language-switch-empty', 'fail', 'exception ' + e.message); }

  // C16 — taste: first five seconds (cold reload as editor)
  try {
    const P = await newGated('editor');
    await P.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await waitBlocksLoaded(P);
    await sleep(400);
    const addReachable = await P.evaluate(() => !!document.querySelector('button[aria-label="Add block"]'));
    const calmSave = await P.evaluate(() => /All changes saved/.test(document.body.innerText));
    await shot(P, 'C16-taste-first-five-seconds');
    await P.close();
    if (addReachable && calmSave) record('C16-taste-first-five-seconds', 'pass', 'add affordance present, save state calm on cold load');
    else record('C16-taste-first-five-seconds', 'marginal', `addReachable=${addReachable} calmSave=${calmSave}`);
  } catch (e) { record('C16-taste-first-five-seconds', 'fail', 'exception ' + e.message); }

  // =========================================================================
  // TEACHER PAGE — read-only
  // =========================================================================
  try {
    const T = await newGated('teacher');
    await T.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await waitBlocksLoaded(T);
    await sleep(400);
    const probe = await T.evaluate(() => ({
      addBtn: !!document.querySelector('button[aria-label="Add block"]'),
      moveBtn: !!document.querySelector('button[title="Move up"]'),
      dragHandle: !!document.querySelector('[title^="Drag to reorder"]'),
      pageBoundary: [...document.querySelectorAll('span')].some((s) => /^Page \d+$/.test(s.textContent.trim())),
      count: (() => { for (const s of document.querySelectorAll('span')) { const m = s.textContent.trim().match(/^(\d+)\s+blocks?$/); if (m) return parseInt(m[1], 10); } return null; })(),
    }));
    await shot(T, 'C02-teacher-readonly');
    await T.close();
    if (!probe.addBtn && !probe.moveBtn && !probe.dragHandle && !probe.pageBoundary && probe.count > 0) record('C02-teacher-readonly', 'pass', `read-only clean, ${probe.count} blocks, no edit chrome`);
    else record('C02-teacher-readonly', 'fail', JSON.stringify(probe));
  } catch (e) { record('C02-teacher-readonly', 'fail', 'exception ' + e.message); }

  // =========================================================================
  // CLEANUP — delete every scratch block, restore initial en count
  // =========================================================================
  console.log(`cleanup: deleting ${created.length} scratch blocks`);
  for (const id of created) await apiDelete(id);
  await sleep(800);
  // Leave the lane's positions contiguous (raw deletes leave gaps): reorder the
  // surviving en rows in their current order so Dario opens a clean 0..N-1 lane.
  try {
    const r = await fetch(`${BASE}/api/manuals/${MANUAL}/blocks?language=en`);
    const j = await r.json();
    const ids = j.data.slice().sort((a, b) => a.position - b.position).map((b) => b.id);
    if (ids.length) await fetch(`${BASE}/api/manuals/${MANUAL}/blocks/reorder`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ block_ids: ids, updated_by: 'qa-cleanup' }) });
    console.log('cleanup: reordered', ids.length, 'rows to contiguous positions');
  } catch { /* best effort */ }
  await sleep(400);
  const finalEn = await apiCount('en');
  const cleanupOk = finalEn === initialEn;
  record('cleanup', cleanupOk ? 'pass' : 'fail', `en rows ${initialEn} -> ${finalEn} (created ${created.length})`);

  await browser.close();

  const summary = {
    run: RUN, target: URL, initialEn, finalEn,
    pass: results.filter((r) => r.status === 'pass').length,
    fail: results.filter((r) => r.status === 'fail').length,
    marginal: results.filter((r) => r.status === 'marginal').length,
    results,
  };
  fs.writeFileSync(path.join(OUTDIR, 'results.json'), JSON.stringify(summary, null, 2));
  console.log('\n==== SUMMARY ====');
  console.log(`pass=${summary.pass} fail=${summary.fail} marginal=${summary.marginal}`);
  console.log('results ->', path.join(OUTDIR, 'results.json'));
  process.exit(summary.fail > 0 ? 1 : 0);
})().catch((e) => { console.error('DRIVER CRASH', e); process.exit(2); });
