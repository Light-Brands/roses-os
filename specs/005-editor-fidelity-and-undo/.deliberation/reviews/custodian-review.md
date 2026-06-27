# Custodian review: roses-os manual editor fidelity

Faculty: data-shape and integrity. The questions I hold are: where does each piece of state live, who is its single writer, what is the invariant, and what breaks idempotency.

## 1. What problem is this actually solving

Two representations of one manual have drifted apart. The blocks drive the web page; a hand-designed static PDF is the download. Jennifer is reading the seam between them. Three of the four asks (image background, figure size, no in-place replace) are reconstruction-fidelity gaps in the blocks. The fourth (no undo) and the underlying fork (do edits reach the PDF) are the real problem: the editor lets a human write state into a place the pipeline does not treat as authoritative.

## 2. Smallest first version that proves the idea

Ship the honest label first. Set the expectation in the editor UI that Download serves the canonical print master, then add a second, clearly-named "draft PDF from your edits" download off the existing blocksToHtml plus Puppeteer path for unmapped manuals. This proves the regenerate path without letting it overwrite the canonical master, and it costs no schema change.

## 3. Three risks that would kill this

- A regenerated PDF that is visibly worse than the hand-designed master. Teachers reject it and trust in the whole reconstruction arc erodes.
- The editor writing edits that the next reconstruction re-run silently clobbers (see prompt 6). This is a data-loss invariant, not a polish issue.
- An undo stack built as a second writer to manual_blocks, colliding with the 500ms autosave and the D-10 position-uniqueness constraint.

## 4. Success at 90 days

Every Jennifer edit has a single, named writer and survives a reconstruction re-run because it lives where D-7 reads intent. Download has two honest options with the canonical master never silently replaced. Undo restores prior state without violating position-uniqueness or provenance. The editor states plainly which representation it edits.

## 5. Atomic tasks

- T1: Add UI copy stating Download serves the canonical print master. AC: copy visible on mapped manuals.
- T2: Wire a second "draft PDF from edits" download off the Puppeteer path. AC: a block edit changes the draft PDF, never the canonical file.
- T3: Add an in-place replace control to CaptionedFigureBlock and column figures. AC: replace posts to /api/manuals/upload and updates src.
- T4: Persist each image replace as a recipe figure-to-asset override (D-7). AC: a re-run keeps the replaced src.
- T5: Add an undo history stack scoped to the editor session. AC: undo restores prior blocks without a duplicate position insert.
- T6: Record editor edits as recipe overrides keyed on the D-7 anchor, not as bare row writes. AC: a re-run reproduces the edit.
- T7: Add a per-block "edited in editor" provenance flag in the audit column (D-12). AC: promotion can see which rows a human touched.
- T8: Confirm the editor targets staging rows, not prod (D-5). AC: a prod-id read never returns an editor draft.

## 6. The one thing only my faculty noticed

A Jennifer edit lives in the manual_blocks row. D-7 says those rows are a pure function of canon plus recipe, and a re-run computes them from the recipe, never from existing rows. So every editor edit, every image replace, every undo-restore is a row mutation the next reconstruction run will clobber, because the edit never reached the recipe. This is the exact hazard D-7 was built to prevent: the row becomes both input and output. The fix is that the editor must write through the recipe, on the stable anchor D-7 already guarantees, with provenance in the D-12 audit column so promotion (D-8) carries the human override forward. An undo that restores an old version must re-key on position to honor D-10, not insert a duplicate. Until edits land in the recipe, the editor and the pipeline are two writers to one store, and the pipeline wins.
