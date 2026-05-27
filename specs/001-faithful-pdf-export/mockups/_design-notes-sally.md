# Sally design note — faithful-pdf-export Phase 4.5

Two surfaces in scope: the Download menu state machine on `/manuals`, and a print-template preview page that shows what the rendered PDF will look like before the click.

## Information architecture

The menu opens beneath the Download button as a single column, top-to-bottom in order of trust:

1. **PDF row** at the top. Icon chip on the left, two-line label on the right. Line 1 names the action (`Download PDF`, `Generating PDF`, `Retry PDF`). Line 2 is the live subtitle that names the path before the click (`From your live edits`, `2022 print original`, `Rough layout fallback`).
2. **Language line** directly under the PDF row, indented to match the label column. Reads `<Language> from your edits` with a small locale chip (`en`, `es`, `pt`, `el`, `ru`, `uk`). It is a passive line, not a selector; the editor owns locale.
3. **HTML row** and **Markdown row** below, unchanged from today. They are escape hatches.
4. **Fallback explanation block**. Reserved-height region that only renders text when the menu is in a fallback state. Sits between the PDF row and the language line so the explanation reads before the subtitle, never after. One sentence, plain English, never an alert color; this is information, not failure.

The print template preview is its own page at `/manuals/[manualId]/print?preview=1`. It opens in a new tab from a discrete "Preview the print layout" link at the bottom of the menu, separated by a divider. Three frames stacked vertically: cover, side-by-side panel page, full-bleed text page. No navigation chrome; the URL is the affordance.

## Affordance choices

- **Spinner.** Indeterminate ring spinner, 16px, replaces the PDF chip glyph during `requesting` and `rendering`. Same shape across both states; the state difference shows as label text, not glyph swap.
- **Elapsed text.** Appears after 3 seconds as a faint counter beneath the subtitle. Right-aligned. Never replaces the subtitle.
- **Cancel button.** Surfaces at 15 seconds as a ghost-style text button inline to the right of the PDF row label. Distinct from the PDF row's hit area so accidental cancels do not fire.
- **Retry button.** On `failed-runtime`, the PDF row becomes a Retry row with a counter-clockwise arrow glyph and a warm amber chip background. Different shape from the original PDF row so retry never feels like the same broken click.
- **Focus rings.** 2px solid ring in `--color-accent`, 2px offset. Visible on every interactive primitive including Cancel and Retry. Tab order: menu trigger, PDF row, Cancel (when present), HTML, Markdown, Preview link.

## State transitions

- **idle to requesting.** PDF row label swaps to `Generating PDF`. Chip glyph swaps to spinner. Button gains `aria-busy=true`. Subtitle locks to `From your live edits`. DOM: add `data-state="requesting"` on the row.
- **requesting to rendering.** Same visual; internal flag flips when the route streams its first byte. Elapsed counter mounts at 3s as a sibling node under the subtitle.
- **rendering to 15s threshold.** Cancel button mounts inline. Focus stays on PDF row. DOM: append `<button data-action="cancel">` to the row's action slot.
- **rendering to downloading.** Spinner unmounts, chip glyph returns, subtitle reads `Saved to your downloads`. Menu auto-closes after 1.5s.
- **rendering to failed-runtime.** Row swaps to Retry row, chip background becomes amber, subtitle reads `Live render failed. Retry, or fall back to the 2022 print original.` Fallback explanation block mounts above the language line with a `Use 2022 original` text button.
- **failed-runtime to fallback-static.** Explanation block shows `Serving 2022 print original because the live render failed.` for 1.2s before the download dialog fires. DOM: insert `<p data-fallback="static">`.
- **any to fallback-html.** Explanation block reads `This layout is rough. We have not designed a print template for this manual yet.` Subtitle on PDF row reads `Rough layout fallback`. No retry surfaces; HTML row gains a focus pulse to suggest the better escape.

## Accessibility floor

- `aria-live="polite"` on the fallback explanation block and on a visually-hidden span that announces state transitions (`Generating`, `Render failed`, `Saved`).
- Focus management: on `failed-runtime` entry, focus moves to the Retry row. On menu close after success, focus returns to the Download trigger.
- Keyboard parity: Esc closes the menu, Enter activates the focused row, arrow keys move between PDF, HTML, Markdown. Cancel and Retry are tab-reachable and Enter-activatable.
- Touch targets: every row is 56px tall on mobile, every inline button (Cancel, Retry text) is at least 44px on its longest dimension.
- `prefers-reduced-motion: reduce` collapses the menu enter/exit animation to opacity-only and stops the spinner ring (replaces with a static dot that pulses on the aria-live timer).

## Anti-patterns to avoid

1. Spinner that runs past 15 seconds without surfacing Cancel.
2. Subtitle that names the path after the click instead of before.
3. Retry button shaped identically to the original PDF row.
4. Fallback explanation that appears after the file leaves.
5. Language line styled as a selector when it is passive.
6. Hover-only affordances on Cancel or Retry without focus parity.
7. Auto-closing the menu during `failed-runtime` (traps the user out of Retry).

## Feel verdict

When this works, the menu feels honest. The teacher clicks PDF and sees the surface admit what it is doing: rendering live, taking a beat, naming the language. If render fails, the surface owns the failure in one sentence and offers a clear next step without shame. The print preview is a quiet promise the teacher can verify before committing the download. Nothing in the surface lies about which path produced the file.
