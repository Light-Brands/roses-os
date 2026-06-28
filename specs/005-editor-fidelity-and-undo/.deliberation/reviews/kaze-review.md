# Kaze review — roses-os manual editor fidelity

The editor is lying. It shows Jennifer a layout, lets her change it, and then hands her a different document on Download. That is the wound. Every one of her four complaints grows from the same root: the surface does not tell the truth about what it is.

## 1. What problem is this actually solving

Honesty of representation. Jennifer trusts what she sees. The editor renders tan side cells, an oversized rose, and a Save that feels final, then the PDF arrives looking like something else. She is not confused about images. She is confused about which thing is real. The fix is not more features. It is making the editor admit its own role: this is the web view, the PDF is the print master, and here is the seam between them.

## 2. The smallest first version that proves the idea

One quiet line of truth and one safety net. Place a single status line near Download: "You are editing the web version. The PDF download is the original print master." That sentence kills the disconnect Jennifer felt without a wall of text. Pair it with a working undo. Those two together resolve the feeling, not the architecture.

## 3. Three risks that would kill this

- Shipping a regenerated PDF that looks worse than the hand-designed master. A teacher rejects a downgrade instantly. Do not converge A and B until fidelity clears a visible bar.
- Explaining the seam with a paragraph. If it needs three sentences, the design failed. One line, or a small "web view" tag on the canvas.
- A replace-image control that invites breaking canon geometry. Give her replace, never free-resize on reconstructed figures.

## 4. What success looks like at 90 days

Jennifer edits without fear. She knows the PDF is the print master because the editor said so, plainly, once. She replaces a rose image and it lands at the right size because the cell, not her, owns the geometry. She makes a mistake, presses undo, and the mistake is gone. The tan cells no longer read as boxes around her figures.

## 5. Atomic tasks

1. Add a one-line web-view notice beside Download, copy approved against the voice rule. Acceptance: the line is visible above Download on every manual editor.
2. Tag the editor canvas with a small persistent "Web view" chip. Acceptance: chip renders fixed in the editor chrome, absent in the rendered PDF.
3. Mute reconstructed column-band side cells in edit mode: render them as faint dashed placeholders, not filled tan blocks. Acceptance: empty side cells show no clay fill in the editor.
4. Show each figure's effective rendered width as a quiet caption ("renders at 4 percent") on reconstructed figures. Acceptance: width label visible on captioned-figure blocks.
5. Add an in-place Replace control to CaptionedFigureBlock and figures-in-columns, reusing ImageBlock upload, geometry locked. Acceptance: clicking Replace swaps the image while width_pct stays unchanged.
6. Add Undo to the editor toolbar driven by a history stack. Acceptance: after a delete, Undo restores the prior block state.
7. Make autosave and undo coexist: autosave persists, undo walks the in-session history. Acceptance: undo works after an autosave fires.
8. Add a subtle "Saved" pulse on autosave so save stops feeling silent and heavy. Acceptance: indicator animates on each debounced save.

## 6. The one thing only my faculty noticed

Autosave plus no undo means every keystroke carries the full weight of permanence. That is why a 500ms debounce feels frightening. Undo is the platform remembering for her, so a mistake is a moment, not a verdict. Add undo and the same autosave suddenly feels gentle.
