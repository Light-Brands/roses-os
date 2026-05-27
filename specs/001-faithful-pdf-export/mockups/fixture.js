// fixture.js — mockup state driver for the Download menu.
// Vanilla ES module. No framework. No fetches.

const LOCALES = {
  en: 'English',
  es: 'Spanish',
  pt: 'Portuguese',
  el: 'Greek',
  ru: 'Russian',
  uk: 'Ukrainian',
};

const STATE_COPY = {
  idle: {
    label: 'Download PDF',
    subtitle: (loc) => `${LOCALES[loc]} from your live edits`,
    showElapsed: false,
    showCancel: false,
    showTier: false,
    showFallback: false,
    chipState: 'idle',
    a11y: 'Idle. Click PDF to generate from your live edits.',
  },
  requesting: {
    label: 'Generating PDF',
    subtitle: (loc) => `${LOCALES[loc]} from your live edits`,
    showElapsed: false,
    showCancel: false,
    showTier: false,
    showFallback: false,
    chipState: 'requesting',
    a11y: 'Generating PDF. The server is starting the render.',
  },
  rendering: {
    label: 'Generating PDF',
    subtitle: (loc) => `${LOCALES[loc]} from your live edits`,
    elapsedText: '3s',
    showElapsed: true,
    showCancel: false,
    showTier: false,
    showFallback: false,
    chipState: 'rendering',
    a11y: 'Rendering for 3 seconds.',
  },
  'rendering-15s': {
    label: 'Generating PDF',
    subtitle: (loc) => `${LOCALES[loc]} from your live edits`,
    elapsedText: '15s',
    showElapsed: true,
    showCancel: true,
    showTier: false,
    showFallback: false,
    chipState: 'rendering-15s',
    a11y: 'Rendering for 15 seconds. Cancel is available.',
  },
  downloading: {
    label: 'Download PDF',
    subtitle: () => 'Saved to your downloads',
    showElapsed: false,
    showCancel: false,
    showTier: true,
    tierText: 'Live from your edits',
    showFallback: false,
    chipState: 'idle',
    a11y: 'Saved to your downloads.',
  },
  'failed-runtime': {
    label: 'Retry PDF',
    subtitle: () => 'Live render did not return',
    showElapsed: false,
    showCancel: false,
    showTier: false,
    showFallback: true,
    fallbackText: 'The live render did not return. Retry, or fall back to the 2022 print original.',
    chipState: 'failed-runtime',
    a11y: 'Render failed. Retry is available.',
  },
  'fallback-static': {
    label: 'Download PDF',
    subtitle: () => '2022 print original',
    showElapsed: false,
    showCancel: false,
    showTier: true,
    tierText: '2022 print original',
    showFallback: true,
    fallbackText: 'Serving 2022 print original because the live render failed. Your recent edits will not appear in this PDF.',
    chipState: 'idle',
    a11y: 'Serving the 2022 print original. Edits not included.',
  },
  'fallback-html': {
    label: 'Download PDF',
    subtitle: () => 'Rough layout fallback',
    showElapsed: false,
    showCancel: false,
    showTier: true,
    tierText: 'Browser-printed from your edits',
    showFallback: true,
    fallbackText: 'This layout is rough. We have not designed a print template for this manual yet. The HTML option may read better.',
    chipState: 'idle',
    a11y: 'Rough layout fallback selected.',
  },
};

const EDITOR_VIEWS = ['populated', 'empty', 'loading', 'forbidden'];

const state = {
  viewport: 'desktop',
  menuState: 'idle',
  locale: 'en',
  editor: 'populated',
};

const $ = (id) => document.getElementById(id);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function applyViewport() {
  document.body.dataset.viewport = state.viewport;
  $$('button[data-set-viewport]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.setViewport === state.viewport));
  });
}

function applyLocale() {
  $('lang-name').textContent = LOCALES[state.locale];
  $('lang-chip').textContent = state.locale;
  $$('button[data-set-locale]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.setLocale === state.locale));
  });
  applyMenuState();
}

function applyEditor() {
  EDITOR_VIEWS.forEach((view) => {
    const el = view === 'populated' ? $('editor-body') : $(`editor-${view}`);
    if (!el) return;
    el.hidden = view !== state.editor;
  });
  $$('button[data-set-editor]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.setEditor === state.editor));
  });
}

function applyMenuState() {
  const copy = STATE_COPY[state.menuState];
  const row = $('row-pdf');
  row.dataset.state = state.menuState;

  $('pdf-label').textContent = copy.label;
  $('pdf-subtitle').textContent = copy.subtitle(state.locale);

  const elapsed = $('pdf-elapsed');
  elapsed.hidden = !copy.showElapsed;
  if (copy.showElapsed) elapsed.textContent = copy.elapsedText;

  const actionSlot = $('pdf-action-slot');
  actionSlot.innerHTML = '';
  if (copy.showCancel) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'download__cancel';
    btn.textContent = 'Cancel';
    btn.addEventListener('click', (e) => { e.stopPropagation(); setMenuState('idle'); });
    actionSlot.appendChild(btn);
  }

  const tier = $('tier-line');
  tier.hidden = !copy.showTier;
  if (copy.showTier) tier.textContent = copy.tierText;

  const fb = $('fallback-block');
  const fbText = $('fallback-text');
  fb.hidden = !copy.showFallback;
  if (copy.showFallback) fbText.textContent = copy.fallbackText;

  $$('button[data-set-state]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.setState === state.menuState));
  });

  $('sr-announce').textContent = copy.a11y;
}

function setViewport(v) { state.viewport = v; applyViewport(); }
function setMenuState(s) { state.menuState = s; applyMenuState(); }
function setLocale(l) { state.locale = l; applyLocale(); }
function setEditor(e) { state.editor = e; applyEditor(); }

// Bind control strip
document.addEventListener('click', (e) => {
  const t = e.target.closest('button');
  if (!t) return;
  if (t.dataset.setViewport) setViewport(t.dataset.setViewport);
  else if (t.dataset.setState) setMenuState(t.dataset.setState);
  else if (t.dataset.setLocale) setLocale(t.dataset.setLocale);
  else if (t.dataset.setEditor) setEditor(t.dataset.setEditor);
});

// Bind PDF row click — kicks off the requesting state for demo purposes
$('row-pdf').addEventListener('click', (e) => {
  if (state.menuState === 'failed-runtime') {
    // Retry resets to requesting
    setMenuState('requesting');
    return;
  }
  if (state.menuState === 'idle') {
    setMenuState('requesting');
  }
});

// Bind keyboard parity: Esc closes (no-op in mockup), Enter activates focused row, arrows move
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    setMenuState('idle');
  }
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    const rows = $$('.download__row');
    if (rows.length === 0) return;
    const current = rows.findIndex((r) => r === document.activeElement);
    const next = e.key === 'ArrowDown'
      ? Math.min(current + 1, rows.length - 1)
      : Math.max(current - 1, 0);
    rows[next].focus();
    e.preventDefault();
  }
});

// Initial paint
applyViewport();
applyLocale();
applyEditor();
applyMenuState();
