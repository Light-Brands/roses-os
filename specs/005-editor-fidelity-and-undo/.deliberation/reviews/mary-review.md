# Mary (Analyst) review — roses-os editor fidelity

## 1. What problem is this actually solving?

Jennifer's four bullets are symptoms of one root cause: the editor looks like a document, so she reads it as WYSIWYG, but it is a block-based web view and the PDF is a separate hand-designed print master. Asks 1 and 2 (tan box, oversized rose) are not feature requests. They are her testing a hypothesis: do my edits reach the PDF? The honest answer is no, and that answer is the real deliverable. Her closing line is the headline, not a footnote. A non-technical editor who excuses a confusion ("it's cool if this is how it is") has stopped trusting the tool and started adapting to it. That is the failure to fix. Asks 3 (replace images) and 4 (undo) are genuine product needs independent of the fork. Asks 1 and 2 are mental-model gaps that correct labeling plus one rendering fix resolve.

## 2. Smallest first version that proves the idea

Set the expectation, then remove the two real points of fear. Concretely: relabel Download as the designed print master, add a one-line note that the editor drives the web page, add undo, add in-place image replace, and fix the one rendering bug where a small centered ornament is wrapped in an empty tinted column band. No PDF regeneration. Prove that Jennifer edits without fear and stops filing "is this broken" questions.

## 3. Three risks that would kill this

- Chasing fork B (regenerate a faithful PDF from blocks). The reconstruction arc (D-11 through D-21) already shows how hard the canon geometry is. A regenerated PDF visibly worse than the master gets rejected by teachers. That is building the wrong thing well.
- Treating the tan box as only a label problem. Per the Q2 facts it is also a reconstruction bug: the ornament was wrapped in an N-column band, so the web page itself is wrong. Labeling alone leaves Jennifer staring at a wrong large rose.
- Undo that fights the 500ms autosave and conflict handling (AC14). A history stack that writes outside the existing setBlocks/debounce path can corrupt server state or reach toward promoted rows.

## 4. Success at 90 days

Jennifer edits without fear because undo exists, replaces any image in place, and understands Download is the print master. The TOC ornament renders small and centered on the web view with no empty tan cells. The fork is recorded as a decision (web view now, staged draft PDF only when fidelity clears a bar), so the team stops relitigating it.

## 5. Atomic tasks

1. Add bounded undo/redo to BlockEditor with Ctrl+Z/Ctrl+Y. AC: delete a block, undo restores it.
2. Route undo through the existing setBlocks/debounce path. AC: undo then autosave yields consistent server state, no conflict error.
3. Probe and confirm captioned-figure, image-row, and figures-in-columns lack a replace control. AC: finding documented.
4. Add in-place replace to CaptionedFigureBlock reusing ImageBlock upload. AC: replaced image persists after reload.
5. Extend replace to image-row and column-cell figures. AC: each shows a replace control.
6. General rule: a small centered figure below a width_pct threshold is not wrapped in a column band. AC: TOC rose renders small, centered.
7. Suppress empty tint side-cell rendering when the cell has no content. AC: no tan rectangle behind a lone figure.
8. Relabel Download as "the original designed PDF (print master)". AC: copy reads as such.
9. Add editor-header note that the editor is the web view. AC: visible on the edit page.
10. Record D-22 fixing the fork (web view now; staged draft PDF later). AC: ARCHITECTURE.md gains D-22.

## 6. The one thing only my faculty would notice

Her excuse is the alarm. "It's cool if this is how it is" from a non-technical editor means she has accepted a broken mental model rather than trust the tool. Name what the editor is. Do not make it match the PDF.
