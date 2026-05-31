# Kaze review: editor-richer-blocks

Walked Aura 1 (only InDesign original) and Rose Meditation Level 1 (Chromium template, pp 0-13).

## 1. What problem is this actually solving

The 6-block model cannot speak the canon. Patterns the editor cannot express: eyebrow caps above an h1; numbered exercise with outsize serif numeral in terracotta + body in a second column; spoken-instruction line with orange rose-icon marker + bold quoted text the practitioner says aloud (40+ in Aura); captioned figure with italic terracotta caption; tinted blockquote with left-rule; three-column callout; diagram-as-block; summary card on tinted surface; corner-frame chrome on every page.

TextBlock storing raw `html` is the load-bearing failure. The author cannot guarantee output rhymes with the canon because the model permits anything.

## 2. Smallest first version that proves the idea

Ship the spoken-instruction block end to end: schema, palette, renderer, canon-comparison preview. It is the platform's most recognizable signature. When an author hits "say-aloud" and the page gets the orange rose marker + bold quoted text matching Aura p 4, the future is proven.

## 3. Three risks that kill this

- TipTap or Lexical with default toolbars becomes Microsoft Word. Marks close at bold, italic, link, soft-break. No font picker, no color picker, no alignment. The discipline IS the product.
- Block proliferation kills rhythm. Twelve types and the palette is a furniture catalog. Every block traces to a named PDF pattern; the palette is a Brand Wall.
- Mobile authoring surface betrays the print-shaped canon. These manuals live as PDFs because they are print objects. An editor that treats mobile reflow as fidelity ships work that renders broken in PDF. The author surface honors the page.

## 4. Success at 90 days

Daria opens the editor. The cover breathes: pink corner brackets, serif title in plum, rose photo in its circle. She drops a numbered-exercise block: outsize terracotta numeral left, body right, rhythm already there. She pastes a spoken instruction; the orange rose marker appears, the line goes bold. Live Preview shows the rendered PDF beside the canvas, the same page she will print. She closes the laptop and notices she did not fight the tool once.

## 5. Atomic tasks

- T-001 Pattern inventory at `docs/canon/patterns.yaml`, citing page + PDF
- T-002 Typography tokens (Cormorant Garamond, body sans, eyebrow caps, terracotta + plum + mute-gold)
- T-003 Spoken-instruction block (schema, renderer, palette, storybook)
- T-004 Numbered-exercise block (outsize numeral + body)
- T-005 Captioned-figure block (image + italic caption)
- T-006 Eyebrow + h1 paired heading block
- T-007 Tinted blockquote with left-rule
- T-008 Multi-column callout block (2 / 3 / 4)
- T-009 Summary card block (tinted surface, eyebrow, h2, list)
- T-010 Diagram block (image + hotspots, stub OK)
- T-011 Palette redesign as Brand Wall
- T-012 Canon-comparison preview UI, page-locked
- T-013 Corner-frame chrome at page-template layer
- T-014 Marks-closed rich-text, no toolbar
- T-015 Empty-state per block
- T-016 Reduced-motion + keyboard-reorder per kaze-build-doctrine

## 6. What only Kaze would have noticed

The corner-frame brackets. They appear on every Rose Level 1 page and nowhere in the spec docs. They are not a block. They are page-template chrome the model does not know exists. Dario and Winston will scope this as "add a frame block" because it looks like a CRUD problem. It is the platform's signature, the fingerprint that says "this is a Roses manual" before the reader has read a word. It belongs at the page-template layer, set once per manual. Miss it and every block ships looking like generic CMS output. Honor it and the first page feels like the canon.