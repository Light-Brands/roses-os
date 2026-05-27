# Mockup iterations — faithful-pdf-export

Audit trail for Phase 4.5. Each iteration appends an entry. Approval at the bottom is the gate to Phase 5 (child issues materialize).

## Iter 01 — 2026-05-27T19:25Z

**Initial mockup synthesis.**

Two surfaces shipped:

1. `index.html` — Download menu in its seven states, with a control strip at the top so Dario can walk the state machine without timers. Locale and editor-state switchers included.
2. `print-preview.html` — four-page print template preview: cover, side-by-side panel with right-hand band, flipped panel page, full-bleed text page.

Both pages serve from the same `styles.css` and use Google-served Cormorant Garamond + Inter, matching the production stack.

### Mockup completion checklist (genesis-spec Section E)

| Floor | Status | Feel verdict |
|-------|--------|--------------|
| E.1 empty | OK — `editor-empty` block with one-sentence purpose + primary CTA | the empty state feels like an invitation, not a void |
| E.1 loading | OK — `editor-loading` block with three skeletons that pulse opacity | the loading state feels like a soft anticipation, not a frozen panel |
| E.1 populated | OK — full editor canvas with cover, headings, side-by-side images, two paragraphs | the populated state reads at a glance: title, idea, image, more idea, in that order |
| E.1 error (5xx / 4xx / 403) | OK — `failed-runtime` (5xx-class), `fallback-static` (auth-style recovery), `editor-forbidden` (403) | the error states own the failure in one sentence and offer the next step |
| E.2 mobile (375px) | OK — viewport switcher applies `data-viewport="mobile"`, menu width adjusts, editor body collapses image row to two columns | the mobile menu still breathes; nothing crowds the language line |
| E.2 desktop (1280px+) | OK — canvas at 880px with the menu positioned to the right of the Download trigger | the desktop layout holds the menu away from the canvas without floating loose |
| E.3 wired interactions | OK — click PDF kicks idle→requesting; Cancel button (mounts at 15s) resets to idle; arrow keys move between menu rows; Esc closes (resets to idle); Enter triggers focused row; state buttons in the control strip walk the machine | every AC verb has a visible response, no dead clicks |
| E.4 affordance clarity | OK — spinner inside the chip (no glyph swap, label opacity drops to reveal spinner ring); Cancel as underlined text button distinct from row hit area; Retry chip in amber-warm bg with counter-clockwise arrow shape distinct from idle PDF row; preview link sits below a rule and reads as "Preview the print layout" not "Open page 2" | every interactive element shows where to click before the user hovers |
| E.5 accessibility | OK — visible focus rings (2px Rose Clay outline + offset); `aria-live="polite"` on the sr-announce span; menu marked `role="menu"` with `aria-haspopup`; touch targets at 44px+ on Cancel/Download trigger; reduced motion replaces spinner ring with steady-opacity dot and removes skeleton pulse | the surface is reachable with keyboard alone, and never moves underneath the cursor |
| E.6 feel clause | one line per row above |  |
| E.7 free-form pass | see below |  |

### Free-form pass (Kaze + Sally + Custodian — first vuelta)

What is alive: the language line under the PDF button (Sally's catch — names the path before the click), the tier label that mounts only in resolved states (Custodian's audit slot), the amber-warm Retry treatment that does not feel like the same broken click (Sally), the side-by-side panel preview with the alternation rule on the next page (Kaze's right-hand-band catch), the cover plate's depth without ornament, the full-bleed text page held by margin alone.

What is dead: nothing visibly dead yet, but the trust dot in the canvas chrome is a candidate for cut on the next pass if Dario reads it as noise. The "All changes saved" line in the canvas chrome may also read as duplication next to the trust dot; if so, one of them goes.

One cut prescribed before next vuelta: if Dario opens this and either the trust dot or "All changes saved" feels like extra furniture, we drop the trust dot. The audit-trail line under the language line is enough transparency for the first runtime download; the dot is a luxury.

### Live URL

Mockup served at `http://127.0.0.1:4287/` (port 4180 was taken by an existing Mission Control daemon). Open `http://127.0.0.1:4287/` for the menu, `http://127.0.0.1:4287/print-preview.html` for the four-page template walk.

Serve command (in case the server stops):

```
cd clients/light-brands/.worktrees/roses-os--faithful-pdf-export/specs/001-faithful-pdf-export/mockups && python -m http.server 4287 --bind 127.0.0.1
```

### What Dario should walk first

1. Open the menu mockup. Stay on `idle` and click PDF in the actual menu — it kicks to `requesting`.
2. Use the control strip to walk through `rendering` → `at 15s` → `downloading`.
3. Step into `failed-runtime` → click `Use 2022 original` (Retry path) → see `fallback-static`.
4. Step into `fallback-html` separately.
5. Switch viewport to mobile (375). The menu should still breathe.
6. Switch locale to es / pt / el. The language line updates. The subtitle still names the path before the click.
7. Switch editor to `empty`, `loading`, `forbidden`. See the three sub-states.
8. Click `Preview the print layout` to open `print-preview.html`. Walk the four pages.

If anything in those eight steps reads wrong, that is the feedback for iter 02.

---

## Iter 02 — 2026-05-27T19:45Z

**Cosmetic class** (Dario: "no se levantan las imagenes"). The CSS-only placeholders read as broken images even though they were intentional skeletons. Replaced with real assets from the Roses repo.

**Change:**
- Copied 6 real assets into `mockups/assets/`: `cover-level-1.jpg`, `01-the-rose.jpeg`, `02-meditation-posture.png`, `04-golden-sun.jpeg`, `09-cosmos-circuit.jpeg`, `10-cosmosearth.png`.
- `index.html`: editor cover `<div>` becomes `<img src="assets/cover-level-1.jpg">`; editor body's three placeholder divs become real `<img>` tags pointing at cosmos-circuit, cosmos-earth, golden-sun.
- `print-preview.html`: cover plate becomes `<img>` of the designed cover; page 2 panel-figure carries the meditation-posture illustration; page 3 (flipped panel) carries cosmos-circuit.
- `styles.css`: object-fit and aspect-ratio rules updated so real photos render correctly inside the figure containers.

**Re-dispatched:** none (cosmetic, no design pair recall).

## Approved — 2026-05-27T19:55Z

**Dario:** "dale, hagamos esa"

(Approval context: confirms the mockup as design contract AND endorses the Vercel-preview iteration path for /develop. The mockup proves the user-facing shape; chromium-on-Vercel is validated on per-PR preview deploys without touching production.)

**Final iter:** 2.
**Mockup files frozen at:**
- `specs/001-faithful-pdf-export/mockups/index.html`
- `specs/001-faithful-pdf-export/mockups/styles.css`
- `specs/001-faithful-pdf-export/mockups/fixture.js`
- `specs/001-faithful-pdf-export/mockups/print-preview.html`
- `specs/001-faithful-pdf-export/mockups/assets/` (6 real Roses illustrations + cover)

**Carry-forward to /develop:** every visible affordance, copy line, state transition, tier label, fallback explanation, and language affordance in the approved mockup is binding for the implementation. Tasks in Phase 5.2 reference the mockup as the visual contract.

**Iteration cadence agreed:** /develop pushes M1 to `claude/p18070-470-faithful-pdf-export`, opens a draft PR, Vercel auto-builds preview at `roses-os-pr-NNN-light-brands.vercel.app`. All M1 acceptance criteria (AC1 in particular) verified on the preview URL. Production main stays untouched until M4 cutover.

**Mockup server:** http://127.0.0.1:4287/ left running for /develop reference.

