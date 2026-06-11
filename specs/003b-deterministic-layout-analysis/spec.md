---
slug: 003b-deterministic-layout-analysis
title: Deterministic layout analysis for the manual reconstruction pipeline
target_repo: Light-Brands/roses-os
status: in-progress
created: 2026-06-01
extends: 003-deterministic-extraction-geometry (D-11)
architecture: D-13 in ARCHITECTURE.md
mode: strict-local
---

# Deterministic layout analysis for the manual reconstruction pipeline

## Problem

Spec 003 made figure pixels and text deterministic, but it still assumed a single
linear column and patched the exceptions by hand: a global vertical band sort for
reading order, a separate pass to interleave figures, and a bolt-on detector for
the one two-column page that surfaced. That is whack-a-mole. The canon manuals use
real print layout (figures beside their text, alternating columns, sub-sections),
and the corpus is thousands of pages across four manuals. A single-column
assumption with per-page patches does not scale: every new page becomes hand-work,
and a fix for one page regresses another.

## The rule

Derive the page structure from the geometry, the same way spec 003 derives figure
position from the geometry. The page already encodes its structure in the
whitespace between its content rects, so cut it, do not estimate it.

`src/lib/manuals/layout.ts` runs a recursive XY-cut (the classic document-layout
algorithm) over the page's text regions and figures:

- A horizontal cut at the widest full-width whitespace band separates stacked
  sections, read top-to-bottom.
- A vertical cut at the widest whitespace gutter separates columns, read
  left-to-right. It fires only when both sides are real columns (≥2 boxes, or one
  box spanning ≥1.8 line-heights), so a numeral never splits off its title.
- Reading order and column structure both fall out of the same cut.

`classify-regions.ts` bounds semantic grouping (a numbered exercise = numeral +
title + body) by the XY-cut LEAF, so an exercise never spans a figure or a column.
`columns.ts` wraps each side-by-side band the cut finds in a real
`two-column-section` block (the D-1 registry type from spec 001), referencing its
members by id.

## The operating principle (this is the point)

From here forward, the corpus is built page by the thousands, not reviewed page by
page. So:

- Every observed error is fixed by improving the GENERAL parser or the
  layout/classification rules, expressed as a deterministic rule over the
  geometry. Marked errors become rules, never page-specific patches or templates.
- A fix that only helps one page is rejected. The test of a fix is that it holds
  across the corpus.
- No model on the coordinate or layout path (D-11, D-13). The model only labels
  the residue the rules leave, and never returns a coordinate.

## Module map

- `layout.ts` — XY-cut: `xyCut`, `flattenLayout` (reading order + two-col slots),
  `assignLeaves` (the per-box bound for grouping), `analyzePageLayout`.
- `extract-geometry.ts` — deterministic geometry (spec 003 T-009a), unchanged.
- `figure-extract.ts` — figure pixels native + sharp fallback (spec 003 T-FIG).
- `classify-regions.ts` — rule-first classifier, leaf-bounded exercise grouping,
  per-region cache, no-coordinate model request.
- `map-to-blocks.ts` — assemble + `validateBlockInput` write gate (spec 003 T-010r).
- `columns.ts` — wrap XY-cut two-column bands in `two-column-section`.
- `provenance.ts` — D-12 sidecar + audit columns.
- `scripts/reconstruct-l1-geometry.ts` — driver (puppeteer + pdf.js + preview).

## State at this checkpoint (Level 1, 10 pages)

- 70 blocks, all valid; geometry byte-identical across runs; 14 figures whole; 8
  two-column sections; AC6 cache re-run makes zero model calls.
- Page 4: title then figure then body (canon order). Pages 6, 8: alternating
  figure/text columns. Page 2 contents: all 11 rows. Page 9: figures with their
  sub-techniques.
- Verified by `scripts/verify-extract-geometry.ts` and
  `scripts/verify-classify-map.ts` (both green, including XY-cut layout cases) plus
  a looked-at screenshot pass over the side-by-side preview.

## Open (improve the general rule, not a page)

- Text that wraps around a floating figure: a full-width intro paragraph above an
  alternating-column body renders correctly but as its own row, not wrapped. The
  general fix is a wrap-aware row rule, not a page edit.
- Tables, glossary, footnotes on the denser manuals (Level 3): new deterministic
  rules when those pages are exercised.
- Live-app staging of nested container children (`two-column-section` references
  children by id): the editor's nested-write path is spec-001 M4/M5 territory. The
  reconstruction already produces the correct structure; wiring it end-to-end to
  the DB is the remaining integration on the editor side.

## How to run

```
node scripts/render-canon-pages.mjs 10            # rasterize canon pages (once)
npx tsx scripts/reconstruct-l1-geometry.ts 10     # full pipeline + preview
node scripts/shot-geometry-preview.mjs            # screenshot each page
npx tsx scripts/verify-extract-geometry.ts        # AC1/AC2/AC3 unit checks
npx tsx scripts/verify-classify-map.ts            # AC4/AC5/AC8 + columns + layout
```

Preview: `_qie-output/roses-os/reconstruction/l1-en/preview-geometry.html` (gitignored).
