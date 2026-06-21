/**
 * Faithful canonical-HTML -> editor-blocks generator.
 *
 * The geometry reconstruction (reconstruct-geometry.ts) derives block order from
 * pdf.js geometry and gets local reading-order wrong: it flattens the PDF's
 * "image left / text right" split rows into one image-row + a pile of headings +
 * a pile of paragraphs, losing the per-section grouping and the two-column layout.
 *
 * This generator instead walks the hand-authored canonical HTML in true DOM order
 * (the SAME source the downloadable PDF is rendered from) and maps each structural
 * element to the editor's block schema, reproducing:
 *   - .split / inline-flex rows  -> two-column-section (left/right child ids)
 *   - .step (sn + h-md)          -> heading level 2 ("N. Title")
 *   - h-xl/h-lg/h-md / h-sm      -> heading level 1/2/2 / 3
 *   - p.body/.body-sm            -> text (em/strong/i/b/br preserved)
 *   - .call/.call-gold           -> callout
 *   - .img-center/circle/full    -> image  (images/ -> /rose med images/)
 *   - ul/.bul/ol                 -> text (list html)
 *   - .line/.line-c              -> divider
 *   - cover page (.cover-bg)     -> cover block
 *   - TOC table                  -> contents block
 *   - page boundary              -> page-break
 *
 * Output is a local JSON file ONLY. It never touches the database. Staging the
 * result is a separate, gated step.
 *
 *   node scripts/manual-from-canon.mjs --file scripts/pdf-manuals/roses-manual-1.html \
 *     --slug rose-meditation-level-1 --lang en
 */

import { createRequire } from 'module';
import { writeFileSync, mkdirSync } from 'fs';
import { randomUUID as uuid } from 'crypto';
import * as path from 'path';

const require = createRequire(import.meta.url);
const puppeteer = require('puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && i + 1 < process.argv.length ? process.argv[i + 1] : fallback;
}
const FILE = arg('file', 'scripts/pdf-manuals/roses-manual-1.html');
const SLUG = arg('slug', 'rose-meditation-level-1');
const LANG = arg('lang', 'en');
const OUT = arg('out', `_qie-output/roses-os/canon-blocks/${SLUG}-${LANG}.json`);

// The in-page DOM walker. Returns an ordered list of pages, each an ordered list
// of "intents" (plain JSON). Two-column rows nest left/right intent lists. Runs in
// the browser so child order is exact DOM order, never a type-grouped regex pass.
function walkInPage(schoolName) {
  const SKIP_LABELS = new Set([schoolName, 'Quick Reference', 'Contents']);
  const remap = (src) => (src && src.startsWith('images/')) ? '/' + src.replace('images/', 'rose med images/') : src;
  const clean = (s) => (s || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
  const cls = (el) => (typeof el.className === 'string' ? el.className : (el.getAttribute && el.getAttribute('class')) || '');
  const has = (el, c) => (' ' + cls(el) + ' ').includes(' ' + c + ' ');
  const elChildren = (el) => Array.from(el.children || []);
  const isSpacer = (el) => /^s\d+$/.test(cls(el).trim());
  const isDecor = (el) => has(el, 'ck') || has(el, 'pn') || has(el, 'grow') || isSpacer(el);
  // Keep only inline emphasis tags in text html; drop spans/styles/etc.
  function inlineHtml(el) {
    let h = el.innerHTML || '';
    h = h.replace(/<br\s*\/?>/gi, '<br>');
    h = h.replace(/<(?!\/?(?:em|strong|b|i|br)\b)[^>]*>/gi, '');
    return clean(h.replace(/<br>/g, ' <br> ')).replace(/\s*<br>\s*/g, '<br>');
  }
  function imgIntent(imgEl) {
    return { t: 'image', src: remap(imgEl.getAttribute('src') || ''), alt: clean(imgEl.getAttribute('alt') || '') };
  }
  function calloutText(el) {
    const ps = Array.from(el.querySelectorAll('p'));
    const txt = ps.length ? ps.map((p) => clean(p.textContent)).filter(Boolean).join('\n') : clean(el.textContent);
    return txt;
  }
  function tocRows(tableEl) {
    return Array.from(tableEl.querySelectorAll('tr')).map((tr) => {
      const tds = Array.from(tr.children);
      const numeral = clean(tds[0] ? tds[0].textContent : '');
      const title = clean(tds[1] ? tds[1].textContent : '');
      const page = clean(tds[2] ? tds[2].textContent : '');
      return { numeral, title, page };
    }).filter((r) => r.title);
  }
  // A real data table (not the table of contents) -> header + rows of cells.
  function tableData(tableEl) {
    const trs = Array.from(tableEl.querySelectorAll('tr'));
    const cellsOf = (tr) => Array.from(tr.children).map((td) => clean(td.textContent));
    const hasTh = trs[0] && trs[0].querySelector('th');
    const header = hasTh ? cellsOf(trs[0]) : [];
    const body = (hasTh ? trs.slice(1) : trs).map(cellsOf).filter((r) => r.some((c) => c));
    return { header, rows: body };
  }
  // True while walking the table-of-contents page, so its table becomes a
  // `contents` block; data tables on any other page become `table` blocks.
  let tocActive = false;
  // One element -> array of intents (recurses for wrappers and columns).
  function nodeIntents(el) {
    if (el.nodeType !== 1) return [];
    if (isDecor(el)) return [];
    const tag = el.tagName.toLowerCase();
    const style = el.getAttribute('style') || '';

    if (has(el, 'line') || has(el, 'line-c')) return [{ t: 'divider' }];

    if (tag === 'img') return [imgIntent(el)];
    if (has(el, 'img-center') || has(el, 'img-circle') || has(el, 'img-full')) {
      const img = el.querySelector('img');
      return img ? [imgIntent(img)] : [];
    }

    if (has(el, 'step')) {
      const snEl = el.querySelector('.sn');
      const sn = clean(snEl ? snEl.textContent : '');
      const h = el.querySelector('h1,h2,h3,h4');
      const title = clean(h ? h.textContent : '');
      const level = h && h.tagName.toLowerCase() === 'h4' ? 3 : 2;
      const out = [{ t: 'heading', level, text: sn ? `${sn}. ${title}` : title }];
      // Consume the numeral + heading, then recurse the REST of the step (the
      // body paragraph / bullet list that follows the heading inside the step).
      if (snEl) snEl.remove();
      if (h) h.remove();
      out.push(...elChildren(el).flatMap(nodeIntents));
      return out;
    }
    if (tag === 'h1' || has(el, 'h-xl')) return [{ t: 'heading', level: 1, text: clean(el.textContent) }];
    if (tag === 'h2' || has(el, 'h-lg')) return [{ t: 'heading', level: 2, text: clean(el.textContent) }];
    if (tag === 'h3' || has(el, 'h-md')) return [{ t: 'heading', level: 2, text: clean(el.textContent) }];
    if (tag === 'h4' || has(el, 'h-sm')) return [{ t: 'heading', level: 3, text: clean(el.textContent) }];

    if (has(el, 'label')) {
      const t = clean(el.textContent);
      return SKIP_LABELS.has(t) || !t ? [] : [{ t: 'heading', level: 3, text: t }];
    }

    if (has(el, 'call') || has(el, 'call-gold')) {
      const txt = calloutText(el);
      return txt ? [{ t: 'callout', text: txt }] : [];
    }

    if (tag === 'ul' || tag === 'ol' || has(el, 'bul')) {
      const items = Array.from(el.querySelectorAll('li')).map((li) => inlineHtml(li)).filter(Boolean);
      if (!items.length) return [];
      const wrap = tag === 'ol' ? 'ol' : 'ul';
      return [{ t: 'text', html: `<${wrap}>${items.map((i) => `<li>${i}</li>`).join('')}</${wrap}>` }];
    }

    if (tag === 'table') return tocActive ? [{ t: 'contents', rows: tocRows(el) }] : [{ t: 'table', ...tableData(el) }];

    if (tag === 'p') {
      if (has(el, 'sub')) { const s = clean(el.textContent); return s ? [{ t: 'text', html: `<p><em>${s}</em></p>` }] : []; }
      const h = inlineHtml(el);
      const plain = clean(el.textContent);
      return plain.length > 2 ? [{ t: 'text', html: `<p>${h}</p>` }] : [];
    }

    // Multi-column row, detected by COMPUTED style (catches class-based flex/grid
    // like .chakra-card / .chakra-cols, not just inline styles or .split/.cols).
    // Each element child is one column. 2 cols -> one two-column-section; 3+ ->
    // nested two-column-sections. .step is already handled above, so its sn|heading
    // flex never reaches here.
    const kids = elChildren(el);
    if (kids.length >= 2) {
      const cs = getComputedStyle(el);
      const flexRow = cs.display.includes('flex') && !/column/.test(cs.flexDirection);
      const gridRow = cs.display.includes('grid') && cs.gridTemplateColumns.split(' ').filter((x) => x && x !== '0px' && x !== 'none').length >= 2;
      if (flexRow || gridRow || has(el, 'split') || has(el, 'cols')) {
        const columns = kids.map((k) => nodeIntents(k)).filter((c) => c.length);
        if (columns.length >= 2) return [{ t: 'cols', columns }];
        if (columns.length === 1) return columns[0];
        return [];
      }
    }

    // Leaf element carrying text (no block-level child) -> a text block. Manuals
    // put real content in styled <div>s (chakra-name, sanskrit, statement,
    // blockages), which would otherwise be silently dropped.
    const blockChild = kids.some((c) => /^(DIV|P|H1|H2|H3|H4|UL|OL|TABLE|SECTION|IMG|BLOCKQUOTE|FIGURE)$/.test(c.tagName));
    if (!blockChild) {
      const txt = clean(el.textContent);
      return txt.length > 1 ? [{ t: 'text', html: `<p>${inlineHtml(el)}</p>` }] : [];
    }

    // Wrapper -> recurse in DOM order.
    return kids.flatMap(nodeIntents);
  }

  const pages = [];
  let pageNum = 0;
  for (const page of Array.from(document.querySelectorAll('.page'))) {
    pageNum += 1;
    const inner = page.querySelector('.inner') || page;
    const isCover = !!page.querySelector('.cover-bg') || has(page, 'cover-bg') || /cover/i.test(page.outerHTML.slice(0, 200)) && !!page.querySelector('h1.h-xl');
    const isClosing = !!page.querySelector('.closing-bg') || has(page, 'closing-bg');
    if (isClosing) { pages.push({ kind: 'closing', intents: [] }); continue; }
    if (page.querySelector('h1.h-xl') && page.querySelector('.img-circle')) {
      // Cover page: emit a single cover block.
      const title = clean((page.querySelector('h1.h-xl') || {}).textContent || '');
      const subEl = page.querySelector('p.sub');
      const subtitle = clean(subEl ? subEl.textContent : '');
      const coverImg = page.querySelector('.img-circle img');
      const cover_image = coverImg ? remap(coverImg.getAttribute('src') || '') : '';
      const authorEl = page.querySelector('.inner strong');
      const author = clean(authorEl ? authorEl.textContent : '');
      pages.push({ kind: 'cover', intents: [{ t: 'cover', title, subtitle, cover_image, author }] });
      continue;
    }
    // The table-of-contents page: a page carrying a table plus a "Contents" label.
    // Only there does a <table> become a `contents` block; elsewhere it is a data table.
    // TOC is the 2nd page (right after the cover) when it carries a table —
    // language-agnostic so 'Contents' / 'Contenido' / 'Conteúdo' all work. A
    // label match is kept as a fallback for any manual whose TOC isn't page 2.
    const labels = Array.from(page.querySelectorAll('.label')).map((l) => clean(l.textContent));
    tocActive = !!page.querySelector('table') && (pageNum === 2 || labels.some((t) => /contents|contenido|conte[úu]do|[ií]ndice/i.test(t)));
    pages.push({ kind: 'content', intents: elChildren(inner).flatMap(nodeIntents) });
    tocActive = false;
  }
  return pages;
}

// ----- node-side assembly ----------------------------------------------------

function newRow(rows, block_type, content) {
  const id = uuid();
  rows.push({ id, block_type, content });
  return id;
}

// Build a multi-column row. 2 columns -> one two-column-section. 3+ columns ->
// nested two-column-sections (left = first column, right = the rest nested), with
// proportions [1, n-1] at each level so the columns come out roughly equal width.
// The editor renders nested two-column-sections natively, so no new block type.
function buildCols(columns, rows) {
  if (columns.length === 2) {
    const left = columns[0].map((i) => toBlock(i, rows));
    const right = columns[1].map((i) => toBlock(i, rows));
    return newRow(rows, 'two-column-section', { schema_version: 2, left, right, proportions: [1, 1] });
  }
  const left = columns[0].map((i) => toBlock(i, rows));
  const restId = buildCols(columns.slice(1), rows);
  return newRow(rows, 'two-column-section', { schema_version: 2, left, right: [restId], proportions: [1, columns.length - 1] });
}

function toBlock(intent, rows) {
  // Pushes block row(s) for an intent. Returns the id of the top-level row (for
  // two-column child wiring). Children rows are pushed BEFORE their container.
  const push = (block_type, content) => newRow(rows, block_type, content);
  switch (intent.t) {
    case 'heading': return push('heading', { text: intent.text, level: intent.level });
    case 'text': return push('text', { html: intent.html });
    case 'divider': return push('divider', { schema_version: 1 });
    case 'image': return push('image', { src: intent.src, alt: intent.alt, caption: '' });
    case 'callout': return push('callout', {
      schema_version: 2, variant: 'note',
      body: { type: 'doc', content: intent.text.split('\n').map((line) => ({ type: 'paragraph', content: line ? [{ type: 'text', text: line }] : [] })) },
    });
    case 'cover': {
      const c = { schema_version: 2, title: intent.title };
      if (intent.subtitle) c.subtitle = intent.subtitle;
      if (intent.cover_image) c.cover_image = intent.cover_image;
      if (intent.author) c.author = intent.author;
      return push('cover', c);
    }
    case 'contents': return push('contents', {
      schema_version: 2,
      rows: intent.rows.map((r) => ({ ...(r.numeral ? { numeral: r.numeral } : {}), title: r.title, ...(r.page ? { page: r.page } : {}) })),
    });
    case 'table': return push('table', { schema_version: 2, header: intent.header || [], rows: intent.rows || [] });
    case 'cols': return buildCols(intent.columns, rows);
    default: return null;
  }
}

async function main() {
  const htmlUrl = 'file:///' + path.resolve(FILE).replace(/\\/g, '/');
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--allow-file-access-from-files'] });
  let pages;
  try {
    const page = await browser.newPage();
    await page.goto(htmlUrl, { waitUntil: 'load', timeout: 30000 });
    pages = await page.evaluate(walkInPage, 'International Aura and Dream School');
  } finally {
    await browser.close();
  }

  const rows = [];
  let anyPageEmitted = false;
  for (const pg of pages) {
    if (pg.kind === 'closing') continue;
    if (anyPageEmitted) rows.push({ id: uuid(), block_type: 'page-break', content: { schema_version: 1 } });
    anyPageEmitted = true;
    for (const intent of pg.intents) toBlock(intent, rows);
  }

  // Assign final positions and the editor row scaffolding.
  const STAMP = '2026-06-19T00:00:00.000Z';
  const out = rows.map((r, i) => ({
    id: r.id,
    language: LANG,
    block_type: r.block_type,
    content: r.content,
    position: i,
    updated_by: 'canon-import',
    source_page: null,
    created_at: STAMP,
    updated_at: STAMP,
  }));

  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify({ slug: SLUG, language: LANG, data: out }, null, 2));

  const counts = {};
  for (const b of out) counts[b.block_type] = (counts[b.block_type] || 0) + 1;
  console.log(`✓ ${SLUG} [${LANG}]: ${out.length} blocks -> ${OUT}`);
  console.log('  ' + Object.entries(counts).map(([k, v]) => `${k}:${v}`).join('  '));
}

main().catch((e) => { console.error('manual-from-canon error:', e && e.stack ? e.stack : e); process.exit(1); });
