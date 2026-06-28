# Mar'ah (Mirrorblade) review — TRUTH gate

*The mirror reveals; the blade cuts the concealment; what is hidden is hidden no more.*

The comfortable lie in this packet: the editor pretends to be the PDF and is not. Jennifer's four asks are not four features. Three of them are one mental-model break. Her own closing words name it: "very different from the rest of the editor." She is not asking for a regenerated PDF. She is asking the tool to stop lying about what it is.

## 1. What problem is this actually solving?
The editor presents itself as a preview of the downloadable deliverable, and it is not one. The blocks drive the web manual pages; the Download button serves a disconnected hand-designed master. Every one of Jennifer's confusions (tan panels absent from the PDF, a rose huge here and tiny there) is a symptom of that single unstated divergence. Ask 3 (replace images) is a genuine missing affordance. Ask 4 (undo) is a genuine safety hole. The other two evaporate the moment the UI tells the truth.

## 2. Smallest first version that proves the idea
Two honest, self-contained wins: (a) a persistent label on the editor stating "This is the web view. Download PDF gives the original designed print master, which your edits do not change." (b) an undo stack over the existing `setBlocks` sites. Neither touches the pipeline. Both directly answer the real complaint.

## 3. Three risks that kill this
- **Option B as endgame is a trap.** A regenerated-from-blocks PDF that is visibly worse than the hand-designed Final Version is a regression teachers reject. Name B as out-of-scope OR gate it behind an explicit fidelity bar that a named teacher signs. Do not let the spec frame B as the natural next step.
- **Image edit on captioned-figure is a D-7 landmine.** The recipe is the authority; a re-run recomputes `map(extract(canon), recipe)` and clobbers any in-editor image swap that does not live in the recipe. "Easy enable" is false. An in-place replace on a reconstructed figure is a silent data-integrity break unless the swap writes through the recipe, not the row.
- **Over-build temptation.** The panel will be tempted to wire the closed-but-unshipped #506 Puppeteer exporter to Download and call it B. That is the gold-plate. Resist it this spec.

## 4. Success at 90 days
Jennifer edits without fear (undo works), is never surprised by the PDF (the UI states the boundary plainly), and can replace a plain image. The cover/PDF question is settled as policy A, with B parked behind a written fidelity gate. No teacher has rejected a regenerated PDF, because none was shipped blind.

## 5. Atomic tasks
1. Add editor banner stating web-view vs print-master. AC: banner visible on `/manuals/[slug]/edit`, copy matches D-line.
2. Undo/redo history stack in BlockEditor. AC: Ctrl+Z after a delete restores the deleted block.
3. Undo coalescing vs 500ms autosave. AC: one undo reverts one user action, not one autosave tick.
4. Probe + document #506 exporter state in ARCHITECTURE (new D-22). AC: D-22 states where the exporter is and why Download still serves static.
5. In-place replace on captioned-figure, recipe-routed. AC: a swap survives a pipeline re-run.
6. Fidelity-bar definition for option B. AC: a written, teacher-signable pass/fail, not "looks good."

## 6. What only TRUTH would notice
Task 6's acceptance is the one most likely written unverifiably. "Regenerated PDF matches the canonical master" has no fixed point; the reconstruction arc already proved the canon does not converge under estimation. Any AC reading "faithful" or "matches" without a per-element numeric tolerance is a promise the spec cannot keep.

## Open question (mandatory)
Does Dario accept policy A (PDF stays the hand-designed master forever) as the standing answer, with B explicitly deferred behind a teacher-signed fidelity bar? If he silently wants B now, tasks 1 and 4 are not enough and the spec must say so.
