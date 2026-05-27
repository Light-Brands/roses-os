# Kaze review — faithful-pdf-export

## 1. What problem is this actually solving?

The current export is a tomb. `blocksToHtml` walks the array, wraps each item in a div, joins with newlines. That is a transcript, not a manual. It violates **BREATH** before any other law: every block sits at the same vertical density, the same margin, the same air. Jennifer's reference PDFs do the opposite. Page 3 of Level 1 opens with three numbered preparation steps tucked into a right-hand column while the body of the page is held open by a single illustration. Pages 5 and 6 do the image-then-text-then-image cadence Jennifer named. The originals breathe because the designer chose, per page, where the image sits relative to the text. The block stack cannot choose. The law most violated is BREATH. The law the new template most needs to honor is **PRESENCE**: when a teacher prints a copy and hands it to a student, the student must feel received by the page, not handed a printout.

## 2. Smallest first version that proves the idea

A single English render of `rose-meditation-level-1` through the Puppeteer route, with exactly two synthesis rules turned on: image-adjacent-to-text becomes a two-column panel, and a sequence of two image blocks fuses into a side-by-side row. Compare it side by side with the canonical 2022 PDF. If the rhythm reads, the synthesis idea is proven. Everything else (other languages, fallback chain, chromium tuning) is downstream.

## 3. Three risks that would kill this

- **Rhythm without intention.** Auto-grouping every image+text pair into two columns produces a magazine spread, not a meditation manual. The original alternates panels with full-bleed text. The synthesis rule must include a "let it breathe alone" branch.
- **"Designed" feel without weight.** Drop shadows, rounded corners, accent lines added because the template feels bare. The originals have almost no chrome. Decoration here is noise.
- **Defaulting to a safe gridded layout.** A 12-column CSS grid will land everything on tidy intervals. The originals are organic: a captioned illustration sits at 60% width with text wrapping past it; the next page is centered. Tidy is the enemy.

## 4. Success at 90 days

Jennifer prints a manual she edited that morning. A student reads it. Neither of them can point to anything that signals "this came from a CMS." The rhythm of the 2022 PDFs survives the round trip through Supabase. All six languages render with the same restraint. The static fallbacks at `public/manuals/pdf/` are still there but Jennifer has not needed them.

## 5. Atomic tasks for Phase 4.5 mockup iteration

1. Read every page of Level 1, Level 2, Level 3 and label each spread as image-led, text-led, or panel.
2. Encode three synthesis rules: text-then-image becomes a 60/40 panel; two adjacent image blocks fuse into a side-by-side row; image-row with caption becomes a centered captioned plate.
3. Set Cormorant Garamond for headings, Inter for body, with `font-feature-settings: "lnum" 1, "kern" 1`.
4. Define a per-section page-break rule: every numbered technique starts on its own page.
5. Reserve the right margin of right-hand panels for the small numbered step lists seen on page 3 of Level 1.
6. Run heading sizes at 26pt / 18pt / 14pt; body at 11pt / 1.6 line-height; caption at 9pt italic.
7. Mockup three covers (Level 1, 2, 3) before rendering body pages.
8. Compare every English mockup page-by-page against the 2022 PDF and kill any panel that drifts.

## 6. The one thing only Kaze would notice

The 2022 PDFs use the **right-hand vertical band** as a quiet rhythm device. Pages alternate body left / illustration right and illustration left / body right, never two of the same in a row. The block-render cannot see this. The template must track the previous page's image side and flip it. Without that flip, the export reads as a stack even when each page looks correct in isolation. Sally would catch the missing affordance. Only the editorial eye catches the alternation.
