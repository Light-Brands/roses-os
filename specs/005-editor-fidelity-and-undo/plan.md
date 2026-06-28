# Plan: Manual editor fidelity, undo, and image replace

Architecture decisions this plan implements: D-22 (staged two-output PDF), D-23 (client-side undo stack), D-24 (image replace writes through the recipe), D-25 (figure-size fix as a general column-band rule). See `../../ARCHITECTURE.md`.

## Architecture sketch

Two writers touch one store (`manual_blocks`): the reconstruction pipeline and the editor. D-7 makes the pipeline the authority, so any editor mutation that must survive a re-run has to write through the per-manual recipe, not only the row. This plan keeps that invariant for the one mutation that is durable intent (image replace) and accepts row-only, in-session lifetimes for the one that is ephemeral (undo).

```
Teacher edits in BlockEditor (web view)
   |
   |-- ephemeral: undo/redo over the in-memory blocks array (D-23)
   |      restores via the existing debounced saveBlock path
   |      delete recovery needs soft-delete (row stays, flag flips)
   |
   |-- durable intent: image replace on captioned-figure (D-24)
   |      writes content.src to the row  AND  the recipe figure-to-asset map
   |      (stable page-index/ordinal anchor) so a re-run keeps it
   |
   v
manual_blocks  --reconstruction re-run = map(extract(canon), recipe)--  faithful blocks
   |
   |-- web pages on rosesos.com (the editor IS this view)
   |-- Download:
         "Designed print original"  -> canonical static PDF (unchanged)
         "Draft PDF from your edits" -> blocksToHtml -> html-to-pdf (D-22, labeled, separate)

Figure-size defect is upstream of all of this: a lone small ornament must not be
wrapped into an N-column band at detection time (D-25). Fix the read, not the render.
```

## Sequencing

| Milestone | Theme | Surfaces | Rough effort |
|-----------|-------|----------|--------------|
| M1 | Safe wins: undo/redo, soft-delete, captioned-figure replace button, editor honesty chrome, muted side-cells | S1, S3, part of S2 | ~3 days |
| M2 | Recipe-safe replace and the figure-size general-rule fix | S2 (recipe + promotion), S4 | ~3 days |
| M3 | Staged draft-PDF-from-edits and the fidelity gate | S5 | ~2 days |

M1 ships Jennifer's two unambiguous wins (undo, a real replace button) plus the labeling that dissolves asks 1 and 2 at the level of expectation. M2 makes the replace durable across re-runs and fixes the actual wrong-blocks defect behind the tan rose. M3 makes the regenerate path real but opt-in and gated.

`covers:` M1 covers S1, S3, and the row-level half of S2. M2 covers the recipe and promotion half of S2, and all of S4. M3 covers S5.

## Risks

| Risk | Mitigation |
|------|------------|
| Undo restores client state but not server state; the debounced PUT/reorder/DELETE already fired, so a naive in-memory undo silently desyncs the database. | Undo re-issues the matching server write through the existing save path on every pop; delete-undo depends on soft-delete (T-002) so the row still exists to un-flag. |
| The obvious image replace writes only the row and a reconstruction re-run clobbers it (D-7). | D-24: the swap is written through the recipe figure-to-asset map on the stable anchor, so a re-run preserves it; the row write makes it live now. |
| Chasing fork B and shipping a draft PDF that reads as the deliverable, worse than the hand-designed master. | D-22: the draft is a separate, labeled, opt-in output; the canonical master stays the default Download; convergence is gated behind a measured fidelity delta and a signer. |
| Tightening the column-band guard regresses the genuine two-column and three-up pages. | T-011 regression-checks pages 6, 7, 8 of Level 1 and asserts the corpus valid-block count is unchanged before the guard change lands. |
| The editor may write prod rows directly, so edits and soft-deletes touch live content. | T-012 confirms staging-versus-prod before M2 closes; if prod, a follow-up routes editing to staging (D-5). |

## Dependencies

- The reconstruction pipeline and the per-manual recipe YAML (D-7) for the durable image-replace write.
- `/api/manuals/upload` (exists) for the captioned-figure replace.
- `blocksToHtml` / `export-html.ts` and `scripts/pdf-manuals/html-to-pdf.ts` (exist) for the draft PDF; the draft route must be portable off the Mac-pinned Chrome path (T-014).
- The D-12 audit column and the D-18 promotion precheck for carrying a human-replaced figure forward.

## Cost-shaped considerations

M1 is a short PR with zero schema change and removes daily friction immediately, so it is the highest value-per-hour and ships first. M2 and M3 layer on top without blocking M1. No new infrastructure; the draft PDF and the fidelity check reuse code that already exists.
