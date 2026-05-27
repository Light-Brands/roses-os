# Design Notes — Kaze

## Atmosphere

Jennifer opens /manuals and clicks Download. The menu does not announce itself. It opens with the calm of a librarian sliding a card across a counter. When the preview lands next to it, she should feel that the printed object is already real, already her edits, already the manual she remembers from 2022. Warm silence over both surfaces. No machinery showing. The menu is a quiet conversation; the preview is the artifact at rest.

## Density and air

The Download menu is sparse. Four lines maximum at any state. Generous vertical padding so each line breathes. The PDF row carries a single subtitle in Inter 12pt italic naming the language source. No icons inside the menu rows. The print preview is the opposite of dense in body pages and the opposite of timid on the cover. Cover holds a full-bleed plate with the title set deep in the lower third. Body pages keep wide outer margins, 22mm minimum, with the inner gutter slightly tighter so the spread reads as one held composition.

## Motion grammar

Idle to requesting: the PDF row's subtitle softens, the row dims to 70 percent, no spinner yet. Requesting to rendering at 300ms: an indeterminate progress bar fades in beneath the row, 2px tall, Rose Clay Mauve at 60 percent opacity, traveling left to right with a 1.4s cubic-bezier(0.4, 0, 0.6, 1) loop. Elapsed-time text appears at 3s as plain Inter 11pt below the bar, no animation, just present. Cancel surfaces at 15s with a 400ms ease-out fade, never a slide. Fallback states do not move. They settle. The named explanation block arrives via opacity only. Under prefers-reduced-motion the progress bar becomes a static dotted underline that pulses opacity between 60 and 80 percent at 2s intervals, nothing else moves.

## Every visible element that earns its place

1. PDF row label "Print as PDF" in Inter 14pt.
2. Subtitle "English from your edits" in Inter 12pt italic, Soft Charcoal at 70 percent.
3. Progress bar, 2px Rose Clay Mauve, only during render.
4. Elapsed text "3s, 4s, 5s" in Inter 11pt, only after 3s.
5. Cancel link in Inter 13pt underlined, only after 15s.
6. Fallback explanation block, two lines maximum, in Inter 13pt on Peach Sand background.
7. Retry link in Inter 13pt underlined, only on failed-runtime.

## Every element that should NOT be there

1. Icons next to the PDF row.
2. Drop shadows on the menu container.
3. Gradient fills anywhere.
4. Rounded corners over 6px.
5. Spinner glyphs that rotate.
6. Border lines between menu rows.
7. Decorative dividers in the preview.

## Print template direction

The preview must telegraph four qualities. First, the side-by-side panel at 60/40 with the illustration on the right and body text wrapping toward the spine, demonstrating Q5's right-hand-band rule. Second, the alternation: page 2 mirrors page 3 with the band flipped. Third, the typography hierarchy: Cormorant Garamond 26pt for the page title, 18pt for section, 14pt for technique name; Inter 11pt body at 1.6 line-height; Inter 9pt italic for captions. Fourth, the full-bleed text page held by margin alone, no rules, no ornaments.

## Feel verdict

When a teacher prints this and hands it to a student, the student should feel the same hush they would feel receiving a hand-bound book. The teacher should feel that her edits arrived without being announced. That is the test.
