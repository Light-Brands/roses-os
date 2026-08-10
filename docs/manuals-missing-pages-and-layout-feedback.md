# Manuals -- Missing Pages & Layout Feedback for Designer

> Feedback on the current state of the manuals at `/manuals` (Rose Meditation 1, 2, 3 and Aura 1). Captured April 2026.

---

## Summary

Two issues to address in the `/manuals` section:

1. **Missing structural pages** -- front covers and tables of contents are missing on several manuals.
2. **Image sizing & layout drift** -- imagery is rendering very large and the page layout no longer matches the original Rose Meditation manuals you designed.

---

## 1. Missing Pages

### Rose Meditation -- Level 1
- [ ] **Front cover** -- missing
- [ ] **Table of contents** -- missing

### Rose Meditation -- Level 2
- [ ] **Front cover** -- missing
- [ ] **Table of contents** -- missing

### Rose Meditation -- Level 3
- [ ] **Front cover** -- missing
- [ ] **Table of contents** -- missing

### Aura 1
- [ ] **Front cover** -- missing
- Table of contents is present

> All four manuals should open with a cover and a table of contents, consistent with the original Rose Meditation manual design.

---

## 2. Image Sizing & Layout Consistency

The current rendering has two problems compared to the original Rose Meditation manuals:

- **Images are very large** -- they dominate the page and break the rhythm of the layout.
- **Layout has drifted** -- spacing, image-to-text ratio, and page composition no longer match the original Rose Meditation manuals you designed.

### Ask
Could you bring the image sizing and overall page layout back in line with the original Rose Meditation manuals? Specifically:

- Match the **image dimensions / max-width** used in the originals so figures sit within the text column rather than spanning the full page.
- Restore the **page composition** (margins, image captions, spacing above/below illustrations, image-to-text ratio).
- Keep the look consistent across Rose Meditation Levels 1-3 and Aura 1 so the four manuals read as a single set.

### Reference
- Original Rose Meditation manuals (your previous design) -- the visual baseline we want to return to.
- Source PDFs in repo for layout reference:
  - `Rose Meditation Level 1 - Final Version.pdf`
  - `ROSES MANUAL 1 and 2 _2022_ English V1 .pdf`
  - `ROSES 3 MANUAL _2022 English_ V1.pdf`

---

## 3. iPad header overlap

On iPad, the **"International Aura School"** wordmark in the top header overlaps with the **"Teachers"** link/label. The header gets crowded and the two collide visually.

### Ask
- If the "Teachers" entry in the top header is what's causing the collision, **remove it from the top header on iPad (and similar widths)** and keep it only in the **footer**.
- Alternative: tighten spacing / shrink type so the wordmark and nav items don't overlap. Removing it from the top header is the preferred quick fix if it keeps interfering.

---

## Where to look

- Live route: `/manuals` on the platform (each manual has a viewer + download).
- Manual structure / blocks live in the collaborative editor; covers and TOCs are normally the first two blocks of each manual.

---

## Priority

Covers and TOCs are blocking a clean student/teacher experience -- please prioritize these alongside the image sizing fix so all four manuals look like one consistent set.
