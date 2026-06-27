> Tracked as Light-Brands/roses-os#644

---
slug: editor-fidelity-and-undo
title: Manual editor fidelity, undo, and image replace (Jennifer Brooke feedback)
target_repo: clients/light-brands/roses-os
target_kind: existing
architecture: update (D-22 through D-25)
run_id: roses-editor-fidelity-20260627-113228
---

# Manual editor fidelity, undo, and image replace

## Problem

Jennifer Brooke, a non-technical teacher who edits the manuals, reported four things on 2026-06-25: figures in the editor sit on a tan rectangle the downloaded PDF does not have; the blue rose renders large in the editor but is a tiny table-of-contents symbol in the real PDF; she cannot replace the images on the reconstructed figures; and there is no undo, while the editor auto-saves every 500ms. Her closing line names the real wound: "It's cool if this is how it is to update the front cover. It's just very different from the rest of the editor the way it's laid out." A non-technical editor excusing a confusion is an editor who has stopped trusting the tool.

The panel found that two of the four asks are the same defect, not two, and that one of the asks is a data-integrity landmine if built the obvious way.

- The tan rectangle and the oversized rose are one bug. A lone small centered ornament was wrongly wrapped into an N-column band by the column detection (D-16), so the renderer's correct rule `renderBlock(child, { fill: true })` overrides the figure's real `width_pct` (about 4 percent) to fill its wide cell, and the empty sibling cells paint as the tan side panels. The editor and the PDF web view are both faithful to the blocks; the blocks are wrong. The fix is a general geometry rule at column detection (D-25), never a renderer clamp or a per-page patch.
- Editor edits never reach the downloaded PDF. `DownloadMenu` serves the canonical hand-designed "Final Version" PDF through `getFinalPdfForSlug`. Issue #506 was closed by routing Download to that static file (commit 75427b5), which resolved the symptom and left the editor-versus-PDF fork undocumented. There is no regenerate-from-blocks exporter at runtime; the Puppeteer pipeline that exists renders separate hand-authored HTML, not blocks.
- Image replace already works on `image` and `image-row` blocks (drop, paste, click to `/api/manuals/upload`). It is missing only on `captioned-figure`, which is exactly what the reconstructed canon ornaments map to, so the teacher meets a paste-a-URL field where every other block has a button. A naive fix that writes only the block row gets clobbered by the next reconstruction re-run, because D-7 makes the recipe, not the row, the authority of human intent.
- There is no undo. `BlockEditor` holds a single `useState`, autosaves debounced at 500ms, and deletes hard-delete the row server-side. A mistaken edit or delete is unrecoverable from the UI.

## Why now

Jennifer is actively editing the live manuals and surfacing these in real time. The asks sit directly on the 002/003/004 reconstruction arc that exists to make blocks the source of truth, so resolving the editor-versus-PDF fork now keeps that arc honest. Undo and the captioned-figure replace button are small, safe wins that remove daily friction immediately.

## Scope

### In scope

- A client-side undo and redo history stack in `BlockEditor`, covering every mutating action (edit, reorder, add, delete, split column), re-persisted through the existing save path (D-23).
- Soft-delete for blocks so undo can restore a deleted block.
- An in-place image replace affordance on `captioned-figure` (and figures nested in column cells), reusing the existing upload path, with the swap also written through the per-manual recipe figure-to-asset map so a reconstruction re-run keeps it (D-24).
- Editor honesty: a persistent signal that the editor is the web view and the downloaded PDF is the hand-designed print master, plus muting the empty column side-cells so they stop reading as tan boxes around figures.
- The figure-size and tan-panel fix at column-band detection as a general geometry rule (D-25), regression-checked against the working two-column and three-up pages.
- A clearly-labeled "Draft PDF from your edits" download option, separate from the canonical "Designed print original", running the existing `blocksToHtml` output through the existing `html-to-pdf` Puppeteer step server-side (D-22), plus a fidelity-comparison scaffold that gates any future convergence onto one button.

### Out of scope

- Converging the draft PDF and the canonical master onto a single Download button. That stays gated behind a measured fidelity bar and a named signer (D-22), external: named-human-signoff.
- A faithful regenerate-from-blocks PDF that matches the hand-designed master pixel for pixel. The reconstruction arc (D-11) already proved the canon does not converge under estimation; "matches the master" has no fixed point and is not a shippable acceptance.
- Server-side durable block-version history (a versions table per edit). Undo is in-session and in-memory by D-23; durable recovery already exists through the D-8 backup and the D-7 recipe.
- Multi-session collaborative undo. The existing 409 autosave-conflict path (T-046) handles concurrent editors; undo addresses self-inflicted single-session mistakes only.

## Whole-problem surface

```yaml
surfaces:
  - id: S1
    surface: in-session undo and redo over the block array, including delete recovery via soft-delete
  - id: S2
    surface: in-place image replace on captioned-figure and column-nested figures, durable across reconstruction via the recipe (D-24)
  - id: S3
    surface: editor honesty chrome (web-view signal, print-master note, muted empty side-cells)
  - id: S4
    surface: figure-size and tan-panel correction at column-band detection as a general geometry rule (D-25)
  - id: S5
    surface: staged draft-PDF-from-edits download, separate and labeled, with a fidelity-comparison gate before any convergence (D-22)
```

## Acceptance criteria

1. Editing a text block then pressing Ctrl+Z in `BlockEditor` restores the prior text AND fires a save for the restored state. (S1)
2. The undo and redo controls render in the editor toolbar; undo is disabled at the bottom of the history stack and enabled after any mutating action; the same actions are reachable by keyboard (Ctrl+Z, Ctrl+Shift+Z). (S1)
3. Deleting a block then undoing restores a block with the same id; the `blocks` DELETE route and `db.ts` set a soft-delete flag rather than hard-deleting, and reads filter soft-deleted rows. (S1)
4. Hovering a `captioned-figure` in the editor shows a "Replace image" control; using it uploads through `/api/manuals/upload` and updates `content.src`; the shared upload logic lives in one `useImageUpload` hook consumed by `ImageBlock`, `ImageRowBlock`, and `CaptionedFigureBlock` (one POST-to-upload implementation in grep). (S2)
5. After replacing a captioned figure, the swap is recorded in the per-manual recipe figure-to-asset map keyed by the stable (page index, block ordinal) anchor, and a reconstruction re-run for that manual preserves the swapped `content.src`. (S2)
6. A human-replaced figure row carries the D-12 audit human-touch marker, and the D-18 promotion precheck passes it forward. (S2)
7. The editor canvas shows a persistent "Web view" chip, and the Download control shows a one-line note that the designed PDF is the print master. (S3)
8. An empty `two-column-section` sibling cell renders as a faint dashed placeholder in the editor, not a filled clay panel. (S3)
9. The column-band guard is tightened so a lone small centered figure with no real column siblings does not form a column band; the Level-1 table-of-contents ornament classifies as a single small centered figure honoring its `width_pct`, and renders small with no flanking cells in the editor. (S4)
10. The tightened guard is regression-checked: Level-1 pages 6 and 8 (figure two-columns) and page 7 (three-up) still detect real columns, and the corpus valid-block count is unchanged. (S4)
11. The Level-1 download menu shows two labeled entries, "Designed print original" and "Draft PDF from your edits"; the draft entry returns a PDF generated from the current blocks via `blocksToHtml` through the server `html-to-pdf` step. (S5)
12. A fidelity-comparison script renders the draft-from-blocks PDF and the canonical master and reports a per-page visual delta; the spec records that no convergence onto one Download button ships without that delta clearing a signed bar. (S5)

## Open questions

- Does Dario accept policy A (the downloaded PDF stays the hand-designed master; the editor is the web view) as the standing answer, with regenerate-from-blocks (B) deferred behind a teacher-signed fidelity bar? If he silently wants B now, undo plus a banner plus a labeled draft are not enough. Right person: Dario. Default if unanswered: proceed with staged-A per D-22.
- Does the editor currently write to STAGING rows (D-5) or directly to PROD `manual_blocks`? Promotion (D-8) must carry editor edits forward; if the editor writes prod directly, the recipe write-through in D-24 and the soft-delete in S1 still hold, but T-012 may open a follow-up to route editing to staging. Right person: panel re-deliberation or Amelia at build time. Default: confirm at T-012 before M2 closes.
- Is lb-cycle autodev meant to pick up the fidelity tasks (T-008, T-010) unsupervised, given they touch the reconstruction pipeline? Right person: Dario. Default: the pipeline-touching and re-run tasks are labeled `human`; the mechanical editor tasks are `autodev`.

## Mockup

The user-facing affordances were designed before implementation via a mockup synthesized from Kaze's Phase 3 review. The frozen mockup lives at `./mockups/index.html` and is the visual contract any /develop run inherits. Because this is an existing editor being modified, the mockup binds the affordance shapes (undo and redo controls, the captioned-figure replace pill, the web-view chip and print-master note, the muted dashed side-cells, the before and after figure-size treatment, the dual-download menu) rather than introducing a new page to port wholesale.

- **Surface:** the existing `BlockEditor` canvas plus its chrome.
- **States covered:** empty (no blocks), loading (skeleton), populated (PT Level 1 fixture), error (save-failed, upload-failed, read-only).
- **Iterations:** 1 (single-round synthesis) — see `./mockups/iterations.md`.
- **Approved on:** 2026-06-27 by Dario ("anda").
- **Design source:** Kaze (Phase 3 review), with Sally's information-architecture lens folded in by Quinn.

## Panelists who contributed

- Winston (architect, architecture-author): resolved the editor-versus-PDF fork as a staged two-output path and authored D-22 through D-25; found that #506 hid the fork rather than closing it.
- Amelia (developer): confirmed at code level which blocks have upload, that no runtime blocks-to-PDF exporter exists, and that undoing a hard-delete needs soft-delete; sized the safe wins into one short PR.
- Mary (analyst): framed the four asks as one mental-model break and protected against building the wrong thing well; kept the headline on naming what the editor is, not matching the PDF.
- Kaze (creative direction): named the HONESTY seam and designed the web-view signal, the calm undo, the canon-safe replace, and the muted side-cells.
- Custodian (data integrity): surfaced the recipe-clobber hazard that makes the obvious image-replace a data landmine, and the staging-versus-prod question.
- Mar'ah (adversarial, Emet): named option B as a trap framed as the endgame, named the least-verifiable acceptance ("matches the master"), and made the policy-A open question explicit.
