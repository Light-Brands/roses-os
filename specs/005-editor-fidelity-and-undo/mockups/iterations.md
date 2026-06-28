# Mockup iterations: editor fidelity, undo, replace

## Adaptation note

This surface is an existing editor being modified, not a new screen. Kaze produced a full design review in Phase 3 (`../.deliberation/reviews/kaze-review.md`); this mockup is synthesized directly from that review as a single first-round synthesis, with Sally's information-architecture lens folded in by Quinn. The four mandatory states are reframed for an editing surface: empty = a manual with no blocks; loading = blocks fetching; populated = the editor with the PT Level 1 fixture (the manual in Jennifer's screenshot); error = save-failed, upload-failed, and read-only (role-gated).

## Round 01 (synthesis) 2026-06-27

### Section E checklist

**E.1 states**
- empty: `state=empty`, one purpose line plus one CTA ("Add the first block"). feel: the empty manual feels like an invitation to begin, not a broken page.
- loading: `state=loading`, skeleton of heading, lines, and a figure block. feel: the wait feels like the page composing itself, not a frozen blank.
- populated: default. PT Level 1 blocks, the before/after rose, a captioned figure. The three-volume mandate is softened by a documented cap: a manual page is a bounded artifact (Level 1 runs ~10 pages of blocks, not thousands of rows), so the mockup ships the realistic per-page volume plus the empty-plus-one (empty state) rather than a 5000-row volume. feel: the populated editor feels like a calm document, and the one loud thing (the before-rose tan panels) is exactly what we are fixing.
- error: save-failed (banner plus red save pill, edit stays on screen), upload-failed (banner, figure unchanged), read-only (role-gated note). feel: each failure feels recoverable, never a dead end; nothing the teacher did is lost.

**E.2 viewports**
- mobile 375 (default, `?viewport=mobile`) and desktop 1280 (`?viewport=desktop`), toggled in the toolbar. feel: the mobile editor feels readable at a glance; desktop just gives the canvas more air.

**E.3 wired interactions**
- undo (Ctrl+Z) and redo (Ctrl+Shift+Z): real history stack over the blocks array, buttons enable/disable, replace actions push history. AC verbs click/press wired.
- download: menu toggle, two labeled entries with the print-master note.
- replace: hover or focus reveals "Replace image" on every figure including the captioned figure; click swaps the placeholder and fires a save. feel: replacing an image feels like one quiet click, the same gesture on every figure type.

**E.4 affordance clarity**
- undo/redo: discrete glyph buttons with tooltips and disabled states, grouped.
- replace: a labeled pill that appears on hover AND focus-within (keyboard reach), co-located on the figure.
- download: a primary button with aria-haspopup; the menu items carry their own note so the difference between the two PDFs is visible, not hidden.
- web-view chip: a persistent labeled chip with a title attribute; the honesty signal is always present, never a one-time toast.
- side cells: the "after" row shows empty band cells as faint dashed placeholders, not filled clay boxes. feel: the muted side-cell stops shouting; a figure no longer looks boxed-in.

**E.5 accessibility**
- contrast: rose-clay on aura-white and the menu notes meet AA; verified against the brand palette.
- focus order: visible terracotta focus rings on every control; tab order matches visual order.
- keyboard parity: undo, redo, download, replace all reachable and operable by keyboard.
- touch targets: controls are at least 36 to 44px on the longest dimension on mobile.
- reduced motion: `prefers-reduced-motion` disables the skeleton shimmer and transitions.
- dark mode: `prefers-color-scheme: dark` repaints the palette at the same AA contrast. feel: at night the editor dims with the room instead of glaring.

**E.6 feel clauses** present per row above.

**E.7 free-form note**
What is alive: the before/after rose makes the abstract bug ("the rose is too big") into something Dario and Jennifer can see in one glance, and the dual-download menu turns the disconnected-PDF confusion into a plain, labeled choice. What is dead on arrival if we are not careful: a second loud banner explaining "this is the web view" would re-create the wall of text Jennifer is already tired of, so the honesty lives in one quiet chip, not a paragraph. The one cut prescribed before any next round: do not add a settings panel for undo depth or PDF options; the depth is a constant and the PDF choice is two labeled lines.

### MISSING-CUE / MISSING-FEEL audit
None. Every AC verb (press, click, hover, toggle) has a co-located cue; every E.1 to E.5 row carries a feel line.

## Approved 2026-06-27T17:56Z

**Dario:** "anda."
**Final round:** 1.
**Mockup files frozen at:** ./index.html, ./styles.css, ./fixture.js.
**Carry-forward to /develop:** every visible affordance in the approved mockup is binding for the implementation. The undo/redo controls, the captioned-figure replace pill, the web-view chip, the muted dashed side-cells, the before/after figure-size treatment, and the dual-download menu are the visual contract for tasks T-001, T-003, T-005, T-006, T-007, and T-011.
