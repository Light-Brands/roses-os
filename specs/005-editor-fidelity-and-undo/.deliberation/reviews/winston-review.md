# Winston review: roses-os editor fidelity

System-shape first. Before the four asks, the seam.

## 1. What problem is this actually solving

Two representations of one manual have drifted apart and the seam between them was never named. The editor edits `manual_blocks`. The Download button serves a static hand-authored PDF built by a separate Puppeteer-over-hand-HTML pipeline (`scripts/build-manuals.ts`, not blocks). Issue #506 was closed (commit 75427b5) by short-circuiting Download to that static file, which papered over the fork rather than resolving it. Jennifer is the first person to stand on both sides of the seam at once and feel the gap. The real problem is an unresolved source-of-truth fork, with three editor defects sitting on top of it.

## 2. Smallest first version that proves the idea

A labeled second download: keep "Download PDF (designed original)" exactly as is, add "Draft PDF from your edits" that runs the existing `blocksToHtml` output through the existing `html-to-pdf.ts` Puppeteer step server-side. It proves the regenerate path end to end without touching the canonical master or promising fidelity parity. The label carries the honesty the UI currently lacks.

## 3. Three risks that would kill this

- **Convergence by stealth.** If anyone wires regenerate-from-blocks onto the single Download button before fidelity clears a bar, teachers get a visibly worse PDF than the print master and reject the whole editor. The two outputs must stay separate and labeled until measured parity.
- **In-place image replace clobbered by the next reconstruction.** `/api/manuals/upload` swaps `content.src` on the DB row, but D-7 makes staging a pure function of canon plus recipe. A re-run overwrites any swap not recorded in the recipe figure-to-asset map. Replace that only writes the row is a silent-loss trap.
- **Per-page patching the figure-size bug.** The blue-rose-too-large defect is tempting to fix in the renderer. That violates D-13 and rots the general parser.

## 4. Success at 90 days

The fork is documented and visible in the UI. Captioned-figure and figures-in-columns have the same upload affordance ImageBlock and ImageRowBlock already have, and a replacement survives a reconstruction re-run because it lands in the recipe. Undo recovers any mistaken edit in the same session. The blue-rose defect is gone because the column-band detection rule was corrected, and the same rule held across the corpus.

## 5. Atomic tasks

1. Add upload control to `CaptionedFigureBlock` reusing `/api/manuals/upload`. AC: a reconstructed figure can be replaced by drop or paste, not only URL paste.
2. Record an image replacement in the recipe figure-to-asset map. AC: a reconstruction re-run preserves the replaced asset.
3. Add the same upload to figures nested in column cells (`fill` path). AC: a figure inside a two-column-section replaces in place.
4. Client-side bounded undo stack over the blocks array. AC: Ctrl+Z restores the prior block state and re-saves through the existing path.
5. Second labeled "Draft PDF from your edits" download via server-side Puppeteer. AC: the draft PDF reflects current block edits.
6. UI copy stating Download = designed original. AC: the menu names which file each option serves.
7. Fix column-band detection so a lone small centered ornament is not wrapped into a column band (D-16 guard). AC: the TOC blue rose renders at its `width_pct`, no flanking tinted cells, verified as a general rule.

## 6. The one thing only my faculty noticed

Q1 (tan rectangles) and Q2 (rose too large) are not two bugs. They are one reconstruction defect. The ornament was wrongly wrapped in an N-column band, so `renderBlock(child, { fill: true })` overrides its 4 percent `width_pct` to 100 percent and the empty sibling cells render as the tan side panels. The editor and the PDF are both faithful to the blocks. The blocks are wrong. Fix the wrap, not the surface.
