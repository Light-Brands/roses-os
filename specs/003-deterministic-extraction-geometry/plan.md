---
slug: 003-deterministic-extraction-geometry
title: Plan for deterministic extraction geometry
created: 2026-05-31
run_id: deterministic-extraction-geometry-20260531
refines: 002-faithful-content-reconstruction (M1, E2)
---

# Plan

## Architecture sketch

E2 splits at a hard seam between geometry and semantics. Geometry is a deterministic read of the PDF; semantics is the only place a model is called, and the model never produces a coordinate. The decision is recorded as D-11 (and D-12 for provenance) in ARCHITECTURE.md.

```
docs/canon/<manual>.pdf  (born-digital, real text layer + image XObjects)
        |
   (E1) render to per-page PNG ............. existing render-canon-pages.mjs (kept; used for crop fallback + region thumbnails + preview)
        |
   (E2a) extract-geometry.ts .............. pure pdf.js, no network, no model
        |     getTextContent()  -> text runs {str, x, yTop, fontSize, fontName, rect}
        |     getOperatorList() -> paintImageXObject rects + objIds (figure regions)
        |     sort by (y-band, x) -> reading order ; coalesce runs -> line -> block regions
        |
   (E2b) classify-regions.ts ............. rule-engine first; model only for the residue
        |     rules: heading by font rank, contents-rows by column x, cover by largest-centered-top
        |     model: {text, fontSize, rect, region-thumbnail} -> block_type + content fields  (NO coordinate)
        |     cache: per-region content hash -> label  (re-run reads cache, zero model calls)
        |
   (E3) map-to-blocks.ts ................. assemble {block_type, content}, fill schema_version + provenance,
        |     validateBlockInput (D-1) is the hard gate ; recipe overrides (D-7) applied on the stable anchor
        |
   figure pixels: page.objs.get(objId) -> ImageBitmap -> canvas -> PNG (native res, primary)
        |          fallback: sharp(canon-page-NN.png).extract(operator-list rect)  (pure node, no canvas)
        |
   validated v2 blocks + real figure images  ->  E5 staging writer (spec 002 M2, unchanged)
```

The only non-deterministic step is region classification, and its single output (a label) is cached by a deterministic key, validated by the Zod union, and overridable by the recipe. Every failure mode of the prior sample (too-large box, too-small box, mislocated figure) is structurally impossible because no box comes from the model.

## Sequencing

This is a single milestone cohort that re-cuts M1's E2. It does not add a milestone to spec 002 and does not touch M2 through M5.

| Task | Theme | AC |
|---|---|---|
| T-009a | `extract-geometry.ts`: pdf.js text runs + figure rects + reading-order sort, deterministic | AC1, AC2 |
| T-009b | `classify-regions.ts`: rule-engine-first classifier, model for residue, per-region cache | AC4, AC6, AC7 |
| T-FIG | figure pixel extraction (native bitmap primary, sharp rect-crop fallback) + non-XObject fallback | AC3, AC9 |
| T-010r | refit `map-to-blocks.ts`: assemble + validateBlockInput gate against classified regions | AC5 |
| T-012p | provenance sidecar + audit columns (D-12); the two nullable columns ride the existing M0 migration | AC8 |
| T-VER | render the Level 1 sample to the preview, screenshot page by page, look and confirm | AC10, AC11 |

T-009a is the spine and lands first; everything else consumes its `PageGeometry`. T-FIG and T-009b can proceed in parallel once T-009a is stable. T-010r is the existing E3 gate refit and changes only its input. T-VER is the close gate and runs last, against the whole Level 1 sample.

## Risks

| Risk | Mitigation |
|---|---|
| pdf.js text runs do not coalesce cleanly into line and paragraph regions (irregular spacing, out-of-order runs). | Make the grouping rules a separately tested unit with Level 1 pages as fixtures; `map-to-blocks` flags any region that fails a sanity check (empty, single glyph, wildly out of reading order) rather than feeding garbage to the classifier. The flag path already exists (AC5). |
| The classifier still mislabels a region (a quote read as a spoken-instruction, the wrong callout variant). | Three coupled backstops: the rule layer decides the unambiguous majority so the model judges only the residue; `validateBlockInput` rejects any label whose required fields are absent; the recipe pins the correct type on the stable anchor and survives every re-run. A wrong label is recipe-fixable, not a moving target. |
| A figure is vector art or tiled images, not one XObject, so the rect read finds nothing or fragments. | Detect the vector-art case (a dense path-op cluster with no covering XObject) and crop the cluster's computed operator-geometry bounds, still a deterministic rect. Where ambiguous, emit a flagged `captioned-figure` for the human-upload path with the rect as a hint. Figure pixels never come from a model coordinate under any branch. |
| Item order from getTextContent is mistaken for reading order. | The (y-band, x) sort is a mandatory step in T-009a, proven on page 3 where only 5 of 24 items were already in order. Reading order is always derived, never assumed. |
| Native-bitmap path returns an ImageBitmap with empty raw data. | Go through a canvas (`drawImage` then `toBuffer`) for the native path; keep the pure-node sharp rect-crop as the fallback that needs no canvas. Branch on whether the bitmap resolves. |

## Dependencies

- pdf.js v4.7.76 vendored at `scripts/vendor/pdfjs/` (present), driven in headless Chrome per `scripts/render-canon-pages.mjs`.
- `sharp` (present) for the pure-node rect-crop fallback and region thumbnails.
- System Chrome at the known path plus `puppeteer-core` (present).
- The four canon PDFs at `docs/canon/` (present, gitignored).
- `src/lib/manuals/block-schema.ts` `validateBlockInput` and the 18-type union (D-1), consumed unchanged.
- The M0 migration that adds the position-uniqueness constraint (spec 002 T-006) gains two nullable provenance columns in the same migration (D-12), so M0's task count does not grow.

## Cost-shaped considerations

Vision now only classifies pre-extracted regions, a small text-only call with a region thumbnail, against the prior full-page raster upload that asked the model to author content, coordinates, and types at once. The per-region cache means the model is consulted once per distinct region in the life of the corpus, not once per run, so re-runs are free on unchanged pages. Net cost is materially lower and far lower variance than the mechanism it replaces.

## Strict-local note

This spec runs offline. No GitHub issues, no push, no PR. `/develop` consumes it from the local spec path. No acceptance criterion depends on a merged main. The verification path is the worktree, the pdf.js extractor, and the screenshotted side-by-side preview.
