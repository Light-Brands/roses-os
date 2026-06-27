# Amelia review — roses-os manual editor fidelity

Implementation truth first. I opened the files.

**Replace/upload affordances (Q3), confirmed at code level:**
- `image` block (`ImageBlock.tsx`): full upload, drag/drop/paste/click plus a hover "Replace image" button. Has it.
- `image-row` block (`ImageRowBlock.tsx`): every cell has upload plus a per-cell "Replace". Has it.
- `captioned-figure` block (`CaptionedFigureBlock/index.tsx`): NO upload. Only a raw "Image URL" text input and an alt input. This is the real gap. The reconstructed canon ornaments (the blue rose) are exactly these blocks, often nested in `two-column-section` cells, so the teacher meets a paste-a-URL field where every other block has a button.

**Regenerate-from-blocks PDF (Q1), confirmed:** there is no runtime blocks-to-PDF exporter. `DownloadMenu.tsx:59` serves the static canonical PDF for mapped slugs (`pdf-map.ts`). The puppeteer pipeline that does exist (`scripts/build-manuals.ts`, `scripts/pdf-manuals/html-to-pdf.ts`) renders separate hand-designed HTML, not the block model, and is pinned to a Mac Chrome path. So #506 closed without wiring blocks into Download. `blocksToHtml` (`export-html.ts`) is the only block-driven path and it renders placeholder layout.

**Undo (Q4), confirmed:** `BlockEditor.tsx:193` is one `useState`, no history. Saves are debounced 500ms (`saveBlock`), reorder 300ms. Delete (`handleDeleteBlock:385`) hard-DELETEs the row server-side.

## 1. What problem is this solving
Two of the four asks are real and small: captioned-figure has no replace button, and there is no undo. The other two (PDF mismatch, figure size) are not editor bugs. They are the honest cost of two disconnected representations: an edited block model and a hand-designed print master that never meet.

## 2. Smallest first version
Add the upload control to `CaptionedFigureBlock` and a client undo stack to `BlockEditor`. That clears Jennifer's asks 3 and 4 in one short PR with zero schema change.

## 3. Three risks that kill this
- Chasing fork B (regenerate the PDF from blocks) and shipping a PDF visibly worse than the designed master. Teachers reject it and trust drops.
- Undo that restores client state but not server state. The debounced PUT/reorder/DELETE already fired, so a naive in-memory undo silently desyncs the database.
- Undoing a delete: the row is gone server-side. Without soft-delete or re-create, undo cannot bring back the same block.

## 4. Success at 90 days
Every image block type has the same replace button. Undo and redo work for edit, reorder, add, and delete and re-persist correctly. The UI states plainly that edits drive the web pages and the designed PDF is the print master. Fork B is gated behind a fidelity bar, not shipped on hope.

## 5. Atomic tasks
1. `CaptionedFigureBlock/index.tsx`: add upload/replace reusing `/api/manuals/upload`. Accept: hovering shows "Replace image", upload updates src, `pnpm type-check` passes.
2. New `blocks/useImageUpload.ts`; refactor Image, ImageRow, CaptionedFigure onto it. Accept: one POST-to-upload implementation in grep, `pnpm lint` clean.
3. `BlockEditor.tsx`: bounded undo stack snapshotting `blocks` before each mutating `setBlocks`, Ctrl+Z restores and re-persists. Accept: edit text, Ctrl+Z restores prior text, a save fires.
4. `blocks/route.ts` DELETE plus `db.ts` deleteBlock: soft-delete flag. Accept: delete then undo restores the same block id.
5. `DownloadMenu.tsx`: add a labeled "Draft PDF from your edits" entry beside "Designed print original" for mapped slugs. Accept: level-1 menu shows both.
6. `BlockEditor.tsx`: one-line banner that edits drive web pages, PDF is the print master. Accept: note visible in editor.
7. `CaptionedFigureBlock`/`renderColumnChildren`: a lone figure in a band keeps `width_pct` instead of `fill`. Accept: TOC rose renders small in editor.

## 6. What only I noticed
The build-time puppeteer pipeline already proves fork B is reachable, but it renders a separate designed HTML source, not blocks. The honest path is to make `blocksToHtml` the input to that exact pipeline behind a fidelity gate, not to invent a new exporter.
