// Self-contained mockup driver. No frameworks. ES module.
// Renders the manual editor with the five new affordances:
//   1. undo / redo controls (history stack, wired)
//   2. "Web view" honesty chip + dual-download menu with print-master note
//   3. "Replace image" affordance on a captioned figure
//   4. the figure-size bug (before) vs the general-rule fix (after)
//   5. muted empty side-cells

const root = document.documentElement;
const canvas = document.getElementById('canvas');
const saveState = document.getElementById('saveState');
const blockCount = document.getElementById('blockCount');
const undoBtn = document.getElementById('undo');
const redoBtn = document.getElementById('redo');
const banner = document.getElementById('errBanner');

// --- realistic fixture: PT Level 1, the manual in Jennifer's screenshot ---
const baseBlocks = [
  { id: 'b1', kind: 'heading', eyebrow: 'Curso de Iniciacao', text: 'Nivel 1' },
  { id: 'b2', kind: 'rose-before' },
  { id: 'b3', kind: 'rose-after' },
  { id: 'b4', kind: 'heading', text: 'A respiracao da rosa' },
  { id: 'b5', kind: 'text', text: 'Comece sentando com a coluna ereta e os ombros soltos. Deixe a respiracao encontrar o seu ritmo natural antes de guiar a turma.' },
  { id: 'b6', kind: 'captioned-figure', caption: 'Campo aurico em equilibrio', alt: 'Aura field diagram' },
  { id: 'b7', kind: 'text', text: 'Conduza cada aluno a visualizar a rosa no centro do peito, abrindo uma petala a cada expiracao.' },
];

// history stack over the blocks array (D-23)
let blocks = clone(baseBlocks);
const past = [];
const future = [];
let saveTimer = null;

function clone(x) { return JSON.parse(JSON.stringify(x)); }

function pushHistory() {
  past.push(clone(blocks));
  if (past.length > 50) past.shift();
  future.length = 0;
  refreshHistoryButtons();
}
function refreshHistoryButtons() {
  undoBtn.disabled = past.length === 0;
  redoBtn.disabled = future.length === 0;
}
function markSaving() {
  saveState.textContent = 'Saving';
  saveState.className = 'save-state saving';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveState.textContent = 'All changes saved';
    saveState.className = 'save-state';
  }, 600);
}

undoBtn.addEventListener('click', () => {
  if (!past.length) return;
  future.push(clone(blocks));
  blocks = past.pop();
  render();
  refreshHistoryButtons();
  markSaving(); // re-persists through the existing save path
});
redoBtn.addEventListener('click', () => {
  if (!future.length) return;
  past.push(clone(blocks));
  blocks = future.pop();
  render();
  refreshHistoryButtons();
  markSaving();
});
document.addEventListener('keydown', (e) => {
  const z = e.key === 'z' || e.key === 'Z';
  if ((e.ctrlKey || e.metaKey) && z && !e.shiftKey) { e.preventDefault(); undoBtn.click(); }
  else if ((e.ctrlKey || e.metaKey) && (z && e.shiftKey || e.key === 'y')) { e.preventDefault(); redoBtn.click(); }
});

// download menu (wired toggle)
const downloadBtn = document.getElementById('downloadBtn');
const downloadMenu = document.getElementById('downloadMenu');
downloadBtn.addEventListener('click', () => {
  const open = !downloadMenu.hidden;
  downloadMenu.hidden = open;
  downloadBtn.setAttribute('aria-expanded', String(!open));
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.download')) { downloadMenu.hidden = true; downloadBtn.setAttribute('aria-expanded', 'false'); }
});

// state + viewport switchers
const stateSel = document.getElementById('stateSel');
const viewSel = document.getElementById('viewSel');
stateSel.addEventListener('change', () => { root.dataset.state = stateSel.value; render(); });
viewSel.addEventListener('change', () => { root.dataset.viewport = viewSel.value; });

// honor ?viewport=mobile|desktop and ?state=
const params = new URLSearchParams(location.search);
if (params.get('viewport')) { root.dataset.viewport = params.get('viewport'); viewSel.value = params.get('viewport'); }
if (params.get('state')) { root.dataset.state = params.get('state'); stateSel.value = params.get('state'); }

function el(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }

function renderBlock(b) {
  if (b.kind === 'heading') {
    return el(`<div class="block h-block">${b.eyebrow ? `<div class="eyebrow">${b.eyebrow}</div>` : ''}<span class="grip" aria-hidden="true">&#8942;&#8942;</span>${b.text}</div>`);
  }
  if (b.kind === 'text') {
    return el(`<div class="block p-block"><span class="grip" aria-hidden="true">&#8942;&#8942;</span>${b.text}</div>`);
  }
  if (b.kind === 'rose-before') {
    const node = el(`<div class="block">
      <div class="note-strip"><span class="tag before">before</span>Today: a lone ornament gets wrapped into a column band. It fills the wide center cell and the empty side cells paint as tan panels.</div>
      <div class="colband before">
        <div class="side" aria-hidden="true"></div>
        <figure class="fig"><span class="ph">rose</span>
          <button class="replace" type="button" aria-label="Replace image">Replace image</button>
        </figure>
        <div class="side" aria-hidden="true"></div>
      </div>
    </div>`);
    return node;
  }
  if (b.kind === 'rose-after') {
    return el(`<div class="block">
      <div class="note-strip"><span class="tag after">after D-25</span>Fixed at column detection: a small centered figure honoring its width_pct, no flanking cells. The empty side-cells of a real band become faint dashed placeholders, never filled boxes.</div>
      <div class="fixrow">
        <figure class="fig small"><span class="ph">rose</span>
          <button class="replace" type="button" aria-label="Replace image">Replace image</button>
        </figure>
      </div>
    </div>`);
  }
  if (b.kind === 'captioned-figure') {
    return el(`<div class="block">
      <figure class="fig big">
        <span class="ph">aura field</span>
        <button class="replace" type="button" aria-label="Replace image">Replace image</button>
        <figcaption>${b.caption}</figcaption>
      </figure>
    </div>`);
  }
  return el(`<div class="block p-block">${b.kind}</div>`);
}

function wireReplaceButtons() {
  canvas.querySelectorAll('.replace').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (root.dataset.state === 'error-upload') return; // handled by render
      pushHistory();
      markSaving();
      const ph = btn.parentElement.querySelector('.ph');
      if (ph) { ph.textContent = 'new image'; ph.style.background = 'linear-gradient(135deg,#e7dcc9,#d8c6a6)'; ph.style.color = '#6b5a37'; }
    });
  });
}

function render() {
  const state = root.dataset.state;
  canvas.innerHTML = '';
  banner.hidden = true;

  if (state === 'loading') {
    canvas.append(
      el('<div class="skel h"></div>'),
      el('<div class="skel l"></div>'),
      el('<div class="skel l"></div>'),
      el('<div class="skel l short"></div>'),
      el('<div class="skel fig"></div>'),
    );
    blockCount.textContent = 'loading';
    return;
  }

  if (state === 'empty') {
    canvas.append(el(`<div class="empty">
      <h2>This manual has no blocks yet</h2>
      <p>Add the first block to start building the web view.</p>
      <button class="primary" type="button">Add the first block</button>
    </div>`));
    blockCount.textContent = '0 blocks';
    return;
  }

  if (state === 'error-readonly') {
    canvas.append(el(`<div class="readonly-note">You are viewing as a teacher. You can read and download manuals, but editing is locked. Ask an admin for edit access.</div>`));
  }

  blocks.forEach((b) => canvas.append(renderBlock(b)));
  blockCount.textContent = `${blocks.length} blocks`;
  wireReplaceButtons();

  if (state === 'error-save') {
    saveState.textContent = 'Save failed';
    saveState.className = 'save-state error';
    showBanner('Could not save your last change. Your edit is still on screen.', 'Retry');
  } else if (state === 'error-upload') {
    showBanner('Image upload failed. The figure was not changed.', 'Try again');
  } else {
    saveState.textContent = 'All changes saved';
    saveState.className = 'save-state';
  }
}

function showBanner(msg, action) {
  banner.innerHTML = '';
  banner.append(document.createTextNode(msg));
  const b = document.createElement('button');
  b.type = 'button'; b.textContent = action;
  b.addEventListener('click', () => { stateSel.value = 'populated'; root.dataset.state = 'populated'; render(); });
  banner.append(b);
  banner.hidden = false;
}

refreshHistoryButtons();
render();
