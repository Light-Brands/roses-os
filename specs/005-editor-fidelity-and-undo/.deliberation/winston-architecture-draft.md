## D-22: The editor-vs-PDF fork is resolved as a staged two-output path, not a single converged Download

**Date:** 2026-06-27
**Spec:** roses-editor-fidelity (Jennifer Brooke feedback)
**Status:** active

Download keeps serving the canonical hand-designed PDF (the `getFinalPdfForSlug` static file produced by the `scripts/build-manuals.ts` Puppeteer-over-hand-HTML pipeline). A second, separately labeled "Draft PDF from your edits" option is added that runs the existing `blocksToHtml` output through the existing `scripts/pdf-manuals/html-to-pdf.ts` Puppeteer step server-side. The two outputs stay separate and labeled. Convergence onto one button happens only when regenerate-from-blocks fidelity clears a measured bar against the canonical master, decided by a named signer, not by code default. Until then the UI states plainly that Download serves the designed print original.

**Alternatives considered:**

- **(A) Editor is web-only forever; PDF never reflects edits.** Honest and cheap, but strands the whole 002/003/004 reconstruction arc, which exists to make blocks the source of truth. It tells a teacher her edits can never reach the deliverable.
- **(B) Blocks become the single source of truth now; one Download regenerates from blocks.** This is the endgame, but shipping it today serves a PDF visibly worse than the hand-designed master. A regression teachers reject kills trust in the editor.

**Why this won:** the staged path keeps the canonical master safe while making the regenerate path real and visible, so fidelity can be measured on an opt-in output instead of risked on the only output. The fork was previously hidden: #506 ("replace blocksToHtml placeholder with the Puppeteer pipeline") was closed by routing Download to the static file (commit 75427b5), which resolved the symptom and left the fork undocumented. This decision names it. A and B both force a one-way door before the evidence exists.

**Implications downstream:** the regenerate path reuses code that already exists (`blocksToHtml`, `html-to-pdf.ts`); no new pipeline. A fidelity-comparison harness against the canonical master becomes the gate for any future convergence. The labeled-output contract is load-bearing: no later change may collapse the two onto one button without clearing the bar.

**Source:** Winston, on the operator fork in the packet.

---

## D-23: Undo is a client-side bounded history stack over the blocks array, not server-side block-version snapshots

**Date:** 2026-06-27
**Spec:** roses-editor-fidelity
**Status:** active

`BlockEditor` keeps a bounded in-memory stack of prior block states. An undo pops the stack, sets `blocks`, and re-persists through the existing debounced `saveBlock` path. The stack is session-scoped and capped; it is not durable across reloads. Durable recovery at the manual level already exists through the D-8 promotion backup and the D-7 recipe.

**Alternatives considered:**

- **Server-side block-version snapshots (a versions table per block edit).** Durable and multi-session, but heavy: a new table, a write on every 500ms autosave, and a retention policy, to solve a single-session "I just made a mistake" need.
- **No undo; rely on autosave conflict handling.** The existing 409 path (T-046) handles concurrent editors, not self-inflicted mistakes. It does not recover a wrong delete.

**Why this won:** the mistake undo addresses is in-session and in-memory, so the cheapest correct home is the in-memory array the editor already holds. It reuses the existing save path, adds no schema, and stays reversible. Server-side versioning pays durable-storage cost for an ephemeral need and would couple undo to the autosave write rate. The manual-level safety net (backup plus recipe) already covers the durable case.

**Implications downstream:** undo must capture state at every `setBlocks` mutation site (content edit, reorder, add, delete, split column) for coverage to be honest; a missed site is an un-undoable action. The stack cap bounds memory. No new server contract.

**Source:** Winston, against the existing autosave and service-role write path.

---

## D-24: In-place image replacement on reconstructed figures writes both the block row and the recipe figure-to-asset map

**Date:** 2026-06-27
**Spec:** roses-editor-fidelity
**Status:** active

`CaptionedFigureBlock` (and figures nested in column cells) gains the same upload affordance `ImageBlock` and `ImageRowBlock` already carry: drop, paste, or click to `/api/manuals/upload`, swapping `content.src`. Because D-7 makes staging a pure function of canon plus recipe, the swap is ALSO recorded in the per-manual recipe's figure-to-asset mapping, keyed by the same stable (page index, block ordinal) anchor. The DB write makes the change live now; the recipe write makes it survive a reconstruction re-run.

**Alternatives considered:**

- **Write only the block row.** Simplest, and it matches the plain `image` block path. But a reconstruction re-run recomputes `map(extract(canon), recipe)` and clobbers any `src` not in the recipe. Silent loss of the teacher's replacement.
- **Block re-runs once a figure has been hand-replaced.** Rejected; it freezes the manual against every future general-rule improvement to protect one asset swap, inverting D-13.

**Why this won:** D-7 already designates the recipe as the single authority of human intent, and an image replacement IS human intent. Routing the swap through the recipe keeps the pipeline idempotent and keeps the correction durable across re-runs, exactly as text corrections already are. Writing only the row reintroduces the input-equals-output hazard D-7 was built to remove.

**Implications downstream:** the upload handler (or a thin server step behind it) gains a recipe-write for reconstructed figures; plain `image` blocks, which have no recipe anchor, keep the row-only path. The recipe stays the place a re-run reads, so prod and a fresh staging cannot diverge on a swapped asset.

**Source:** Winston, with D-7 (recipe authority) and D-13 (general rule over per-page patch).

---

## D-25: The figure-size defect is corrected at column-band detection as a general rule, never in the renderer

**Date:** 2026-06-27
**Spec:** roses-editor-fidelity (extends D-13, D-16)
**Status:** active

The "blue rose renders large between two tan rectangles" defect is a reconstruction-layout error, not a rendering error. A lone small centered ornament was wrapped into an N-column band by the D-16 column detection, so the renderer's correct rule `renderBlock(child, { fill: true })` overrides the figure's real `width_pct` (about 4 percent) to fill its wide cell, and the empty sibling cells paint as the tan side panels. The fix tightens the D-16 / D-13 column guard so a single small centered figure with no real column siblings does not form a column band; it then renders at its `width_pct` with no flanking cells. The fix is expressed as a deterministic rule over the geometry and is verified to hold across the corpus, per D-13.

**Alternatives considered:**

- **Clamp figure width in `CaptionedFigureBlock` when it looks too large.** Rejected; a renderer clamp is a per-symptom patch that hides the bad wrap and violates D-13. The block would still be structurally a column band.
- **Per-page recipe override to un-wrap this ornament.** Rejected; the recipe is for human curation, not for working around a general-parser defect. A page-specific un-wrap does not scale to the corpus.

**Why this won:** the column band is whitespace in the geometry, read by D-16; if the read is wrong, the read is the bug. Correcting the guard fixes every ornament the same way and keeps `fill: true` correct for genuine columns. A renderer clamp or a recipe patch would leave the defect in the blocks and only mask it on one surface, which is the exact failure D-13 names.

**Implications downstream:** the editor figure-size complaint and the tan-rectangle complaint both resolve from this one extraction-rule change; no editor or PDF code changes for the size issue. The corrected guard must be regression-checked against the working two-column and three-up pages (D-16) so a real column is still detected.

**Source:** Winston, on the BlockEditor `fill` path and D-16 N-column detection.
