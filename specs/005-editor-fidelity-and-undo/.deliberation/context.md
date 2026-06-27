# Context packet — roses-os manual editor: Jennifer Brooke fidelity feedback

Run id: roses-editor-fidelity-20260627-113228
Target repo: clients/light-brands/roses-os (Light-Brands/roses-os)
target_kind: existing
architecture_author: true, mode: update (ARCHITECTURE.md exists at D-21; next ordinal D-22)
Domains: BuildOS (editor + pipeline), Kaze (user-facing editor surface)

Each panelist writes against THIS packet, in their own voice, in their own review file. Answer the same six prompts. Hard limit 600 words.

## The raw idea (verbatim)

RosesOS manual editor. Address Jennifer Brooke's feedback (2026-06-25). Four asks plus the underlying architecture gap:

1. Image blocks in the editor show a tan/clay rectangle background (the multi-column side panels) that does not appear in the downloaded PDF. The core question Jennifer asks: do editor edits regenerate the downloadable PDF? Today they do NOT. The Download button serves the static canonical "Final Version" PDF, so the editor and the deliverable PDF are two disconnected representations.
2. Images like the blue rose render large in the editor but are tiny table-of-contents symbols in the real PDF. Editor geometry does not match the canonical PDF.
3. Cannot edit or replace images directly within the block editor. Requested as an easy enable.
4. No undo button. The editor auto-saves every 500ms (debounced) with no history stack, so a mistaken edit is unrecoverable.

Jennifer's verbatim closing fragment: "It's cool if this is how it is to update the front cover. It's just very different from the rest of the editor the way it's laid out."

## Established facts (probed at code level, 2026-06-27)

This repo is a mature pipeline: canon PDF -> deterministic geometry extraction -> vision classification -> manual_blocks -> staging manual_id -> promotion to prod. Documented in ARCHITECTURE.md D-1 through D-21. Read ARCHITECTURE.md before reviewing. Highlights:

- **D-1**: manual_blocks are a discriminated union with schema_version per row; 18 block types; reads through block-parser.ts, writes through validateBlockInput.
- **D-3**: rich text is TipTap, serialized to canonical JSON.
- **D-5/D-6/D-7/D-8**: staging is a cloned manual_id; bulk writes go through a server service-role module; a per-manual recipe YAML is the authority of human intent; promotion is one transaction with backup + rollback, gated on signer + 7-day soak.
- **D-11/D-13/D-14/D-16/D-17**: extraction is deterministic geometry (pdf.js rects) + vision classification only; layout by recursive XY-cut; figures carry width_pct (figure width / page width); two-column and N-column bands render side-by-side; tint boxes become callouts; the operating rule is "fix the general parser, never a page-specific patch."

### Q1 facts (editor vs downloaded PDF)
- `src/components/manuals/DownloadMenu.tsx`: `getFinalPdfForSlug(slug, language)` (from `src/lib/manuals/pdf-map.ts`) returns the canonical static "Final Version" PDF for mapped manuals. `handleDownloadPdf` serves that file directly when `finalPdf` is truthy. Editor block edits do NOT flow into it.
- Unmapped manuals (e.g. el/ru/uk, aura-level-1) fall back to `blocksToHtml(blocks, ...)` then browser print-to-PDF. That path DOES reflect block edits but renders the placeholder HTML layout, not the designed layout.
- Issue #506 ("Faithful manual PDF export, replace blocksToHtml placeholder with the Puppeteer pipeline") is CLOSED, yet DownloadMenu still routes mapped manuals to the canonical static PDF. So a faithful regenerate-from-blocks export is not wired to Download for the main manuals. PROBE THIS: is a Puppeteer/HTML-to-PDF faithful exporter already partly built? Where? Why is it not wired?

### Q2 facts (figure size mismatch)
- `src/components/manuals/blocks/CaptionedFigureBlock/index.tsx` HONORS width_pct: `style={{ width: widthPct%, maxWidth: 100% }}`, with a `fill` mode where "a figure in a column fills its cell (the cell carries the width)".
- BlockEditor.tsx line ~507: "fill: a figure in a column fills its cell (the cell carries the width)."
- The screenshot shows the TOC blue rose centered between two tan/clay rectangles. That reads as a two-column or N-column band where the rose fills a wide center cell and the side cells are tinted and empty. So the figure renders large because it fills a wide cell, while the canonical PDF places the same ornament as a ~4% centered figure. This is a reconstruction-layout fidelity gap (the ornament was wrapped in a column band) crossed with editor rendering.

### Q3 facts (replace images in editor)
- `src/components/manuals/blocks/ImageBlock.tsx` ALREADY has upload: drag-drop + file input -> POST `/api/manuals/upload`, with uploading state and error handling. So plain `image` blocks can be replaced.
- The reconstructed canon figures are `captioned-figure` blocks (and figures inside two-column-section cells). CaptionedFigureBlock honors width_pct but appears to have NO replace/upload control. PROBE: confirm captioned-figure (and image-row, and figures-in-columns) lack an in-place replace affordance. That is the real gap behind "we can't update the images directly within the editor."

### Q4 facts (undo)
- `src/components/manuals/BlockEditor.tsx`: `const [blocks, setBlocks] = useState`. Auto-save is debounced 500ms (line ~261). Many `setBlocks(...)` mutation sites (edit content, reorder, add, delete, split column). There is NO undo/redo, NO history stack. Autosave conflict handling exists (T-046 / AC14). A mistaken edit (or delete) is unrecoverable from the UI.

## The strategic fork the panel must resolve

Two coherent end states:

- **(A) Editor is a web-only view.** The blocks drive rosesos.com manual pages. The downloaded PDF stays the hand-designed canonical "Final Version" forever. Edits never reach the PDF. Set this expectation explicitly in the UI and accept that "Download PDF" means "download the original designed print master."
- **(B) Blocks become the single source of truth and the PDF is regenerated from blocks.** This is the endgame the whole 002/003/004 reconstruction arc points at: faithfully reconstruct the canon into blocks, edit blocks, regenerate a faithful PDF. The risk is fidelity. The reconstruction already shows how hard it is to clave the canon geometry; a regenerated PDF that is visibly worse than the hand-designed master is a regression teachers will reject.

The panel must take a position on the fork, or define the honest staged path between A and B (for example: keep canonical download now, ship a clearly-labeled "draft PDF from your edits" as a second download option, converge the two only when fidelity clears a bar).

## Operating constraints
- pnpm only. `pnpm type-check` (tsc noEmit), `pnpm lint`, `pnpm test` is a placeholder that exits 0 (no real suite). `pnpm build` is a full Next prod build.
- Voice rule for all artifacts: no em-dashes, no en-dashes, no hype words, no emojis, no exclamation marks. Plain English.
- The deliberate operating rule from D-13: every fidelity fix is a GENERAL rule over the geometry, never a per-page or per-manual patch.

## The six prompts (answer all six)
1. What problem is this actually solving?
2. What is the smallest first version that proves the idea?
3. What 3 risks would kill this if ignored?
4. What does success look like at 90 days?
5. What atomic tasks does this break into? List 5 to 15, each <= 1 day of work, each with a one-line verifiable acceptance.
6. What is the one thing only your faculty would have noticed?
