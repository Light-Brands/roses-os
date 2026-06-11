---
slug: 003-deterministic-extraction-geometry
title: Deterministic extraction geometry for the manual reconstruction pipeline
target_repo: Light-Brands/roses-os
status: scoped
created: 2026-05-31
run_id: deterministic-extraction-geometry-20260531
architecture: update (D-11, D-12 in ARCHITECTURE.md)
refines: 002-faithful-content-reconstruction (M1, step E2)
mockup: none (kaze_attach = false; internal pipeline, operator preview only)
mode: strict-local
---

# Deterministic extraction geometry for the manual reconstruction pipeline

## Problem

Spec 002 milestone M1 turns a canon PDF page into v2 content blocks in three steps: render (E1), extract (E2), map and validate (E3). The first build of E2 sends each page raster to a vision model and asks it to return, per block, a bounding box. Figures are then cropped by those boxes and blocks positioned by them. This does not converge. The model's boxes are unreliable in three ways, all observed empirically on Rose Meditation Level 1 this session: too large, so a figure box swallows adjacent body text; too small or offset, so a figure box cuts the subject in half (the "Getting Ready to Start" meditating figure came back as legs and a torso); and mislocated, so a small decorative figure box lands on a table-of-contents text row and crops the words "Cleanse &" instead of the flower. Every prompt change that fixes one page regresses another, because the box behavior is a page-global quantity the model produces by estimation, and estimation has no fixed point across a heterogeneous page set.

The root cause is a category error: the page already carries the exact coordinates as data. A born-digital PDF has a real text layer (every glyph run with its transform matrix) and embedded image XObjects (every figure with its real bounds and real pixels). Asking a vision model to re-estimate what the PDF can be read for exactly is paying a non-deterministic tax to approximate a deterministic fact, and it breaks the idempotency that spec 002 D-7 depends on (a re-run moves the boxes, so a human correction in the recipe is clobbered by a box that drifted).

This spec replaces E2's mechanism. It does not change E2's contract, its acceptance shape, or anything downstream (E3 validation, the recipe authority, the staging lane, promotion, the scale to other manuals all stay as spec 002 wrote them).

## Why now

The M1 extraction sample is the current blocker on showing a reader a faithful page. The fix is empirically de-risked: this session drove pdf.js v4.7.76 (already vendored at `scripts/vendor/pdfjs/`) over the real Level 1 PDF and confirmed that `getTextContent()` returns verbatim text with intact ligatures and correct Unicode, that the page operator list yields each embedded figure's exact rect and real pixels at native resolution, and that a simple geometry-only clustering heuristic separates eyebrow, heading, body, contents rows, and numbered exercises cleanly on both a contents page and an exercise page. The thesis is not speculative; it ran. What remains is to land it as the production E2.

## Scope

### In scope

- A deterministic geometry extractor (`extract-geometry.ts`): pure pdf.js over a page, no network and no model, producing an ordered list of text runs and figure regions, each with an exact rect in PDF user space, text runs carrying their string, font name, and font size, figure regions carrying a handle to the embedded image's real pixels.
- A reading-order derivation that sorts runs by a vertical band then horizontal position, since pdf.js emits runs in content-stream order, not reading order.
- A rule-first region classifier (`classify-regions.ts`): the only place a model is called, and only for the regions the deterministic rules cannot decide. The model receives pre-extracted text and an exact rect and returns a `block_type` from the 18-type registry plus the content fields that type needs. It never returns a coordinate.
- A deterministic rule layer that classifies the unambiguous majority without a model call (heading by font rank, contents rows by column x positions, cover by largest-centered-top, eyebrow by small-caps-above-heading).
- Figure pixel extraction from the embedded XObject (primary, native resolution via the page object cache and a canvas) with a pure-node fallback that crops the page raster by the exact operator-list rect (no canvas dependency).
- A per-region classification cache keyed by a content hash of the region (text, font name, font size, rect, figure-bytes hash), so a re-run reads every label from cache and re-derives byte-identical staging rows.
- Provenance per reconstructed block carried in a sidecar plus the staging row audit columns, keyed by the same stable anchor the recipe uses, leaving the 18 content schemas untouched (D-12).
- A mandatory visual-verification step: the side-by-side canon-versus-reconstruction preview is screenshotted and the images are looked at, per page, before a slice is called done. A data-only "every block valid" claim with no captured screenshot does not close.
- Re-cutting M1's E2 task T-009 into T-009a (geometry) and T-009b (classification) and refitting T-010 (map and validate) and T-012 (provenance) to the new mechanism.

### Out of scope (not part of this arc)

- Pixel-perfect absolute-position layout in the reader app. By spec 002 D-1 the app renders a linear flow of blocks, not an absolutely positioned canvas. This spec reproduces the page content and reading order faithfully into linear blocks. It does not place blocks at canon x and y in the live app. Reason: the product ships linear blocks by design; the canon-diff oracle (spec 002 T-019) measures the linear render, which is the fidelity that ships.
- OCR of scanned or photographed pages. This mechanism assumes a born-digital PDF with a real text layer and embedded image XObjects, which the four canon PDFs are. A scanned page with no text layer is a different problem. Reason: no such page exists in scope.
- Non-English locales. Unchanged from spec 002. The hard locale guard still blocks any no-canon locale before a write. Reason: `external: named-human-signoff`, a translated canon must be authored and attested by a teacher before any non-English row can exist.
- Reflowing, re-paginating, or re-styling canon. Curation decisions (TOC collapses, page-template config) stay the recipe's job per spec 002 D-7, not the extractor's.
- The M2 through M5 stages of spec 002 (staging write, review harness, promotion and soak, scale to the other manuals). They consume this extractor's output unchanged and are not re-opened here.

## Acceptance criteria

Each criterion names its surface and trigger, and is verifiable on its own.

1. **Geometry extraction is deterministic.** Running `extract-geometry.ts` over the same page twice produces a byte-identical `PageGeometry` (same runs, same rects, same order), with no network or model call in the path. (Surface: `extract-geometry.ts`. Trigger: run twice, diff.)
2. **Text is verbatim with correct reading order.** Over Level 1 pages 2 (contents) and 3 (exercises), every extracted text run's string matches the canon text layer with zero replacement characters and intact ligatures, and the runs sorted by vertical band then x are in true reading order (the contents rows descend in page order, the exercise paragraphs follow their numerals). (Surface: `extract-geometry.ts`. Trigger: extract pages 2 and 3, inspect.)
3. **Figure pixels come from the PDF, never a model box.** Each `captioned-figure` and the cover image is sourced from the embedded XObject's real bounds or the deterministic operator-list rect crop; the page 3 meditating figure extracts whole, subject not cut, and no figure crop contains body text. (Surface: figure extraction. Trigger: extract Level 1 pages 1 through 10, look at every figure.)
4. **The model never emits a coordinate.** The classifier request contains no box or coordinate field and no instruction to produce one; a captured classification returns only `block_type` plus content fields. (Surface: `classify-regions.ts`. Trigger: inspect the request payload and one response.)
5. **Validation is still the write gate.** Every classified region is assembled and run through `validateBlockInput` before it goes downstream; a region the classifier mislabels into a shape whose required fields are absent is rejected with the named-error envelope `{ok:false,error:{code:'INVALID_BLOCK',message}}` and surfaced, never silently dropped. (Surface: `map-to-blocks.ts`. Trigger: seed a mislabel, run.)
6. **Re-run is idempotent through a per-region cache.** A second run over an unchanged page makes zero model calls (every label served from the region cache) and produces byte-identical staging rows on non-override fields. (Surface: classification cache. Trigger: run twice, count model calls, diff rows.)
7. **The rule layer decides the unambiguous majority without the model.** On a Level 1 page, the deterministic rules classify heading, eyebrow, contents rows, and cover with no model call; the model is consulted only for the regions the rules leave undecided, and the run logs how many regions went to rules versus the model. (Surface: rule layer in `classify-regions.ts`. Trigger: classify a page, read the counts.)
8. **Provenance per block, schemas untouched.** Every reconstructed block carries its source canon page, extraction run id, and signer via the provenance sidecar and the staging audit columns; the 18 `content` schemas in `block-schema.ts` are unchanged and still pass `validateBlockInput`. (Surface: provenance sidecar plus audit columns, D-12. Trigger: inspect a staging row and the sidecar.)
9. **A non-XObject figure has a deterministic fallback.** A figure that is vector art (a path-paint cluster with no covering image XObject) is extracted by a bounded raster crop of that cluster's computed operator-geometry bounds, or flagged for the human-upload path, never by a model box. (Surface: figure extraction fallback. Trigger: a vector-art figure region.)
10. **Visual verification gates the slice.** The Level 1 sample is rendered to the side-by-side preview, screenshotted page by page, and the screenshots are looked at and confirmed to match the canon before the slice is called done. A close that asserts validity from data alone, with no captured and inspected screenshot, does not stamp done. (Surface: the preview plus a screenshot pass. Trigger: slice close.) Partly human-review.
11. **The three failure modes are structurally absent.** Re-running the extractor over Level 1 pages 1 through 10 produces no figure that swallows adjacent text, no figure that cuts its subject, and no figure mislocated onto a text row, because no figure rect comes from the model. (Surface: the Level 1 sample. Trigger: run pages 1 through 10, compare against the documented prior failures.)

## Open questions

1. **pdf.js text fidelity on the denser manuals.** Level 3 carries tables, footnotes, and a glossary with patterns Level 1 does not exercise. Answerer: panel re-deliberation after Level 1 and Level 2 ship. Default: proceed on the proven Level 1 path, and flag any region whose text fails a sanity check (empty, single glyph, or wildly out of reading order) rather than feeding it to the classifier.
2. **How much clustering to leave to the model.** The deterministic splitter (lines by vertical band, font-size buckets, breaks on large gaps) leaves artifacts on dense pages (concatenated TOC numerals, wrapped exercise lines). Answerer: empirical, Amelia. Default: keep the splitter dumb with x-gap-aware token joining (insert a space when the inter-run x-gap exceeds about a quarter of the font size) and let the model do the final block-type assignment and line merge.
3. **The FlateDecode image decode path.** The native-bitmap path returns an ImageBitmap that needs a browser canvas to become a PNG; the raster-crop path is pure node via sharp. Answerer: empirical, Amelia. Default: native bitmap primary for resolution, sharp operator-list-rect crop as the pure-node fallback, branch only on whether the bitmap resolves.
4. **Vector-art figures.** A figure drawn as paths has no XObject to extract. Answerer: panel. Default: a deterministic raster crop of the path cluster's operator-geometry bounds, and where even that is ambiguous, a flagged `captioned-figure` routed to the human-upload path of spec 002 OQ1 with the rect as the crop hint.
5. **Per-region cost now that vision only classifies.** A text-only classification call is materially cheaper than the prior full-page vision extraction, but the per-region budget is still Dario's call. Answerer: Dario (cost). Default: rule-engine-first so the model judges only the ambiguous residue, and cache every label per region so the model is consulted once per distinct region in the life of the corpus.

## Mockup

No mockup. `kaze_attach = false`. This spec changes the internal mechanism of the extraction pipeline. Its only human surface is the side-by-side review preview, an internal operator tool that spec 002 already scoped as not a new end-user surface. There is no new reader-facing surface to design, so Phase 4.5 did not run.

## Panelists who contributed

- **Amelia** (Senior Developer): ran the empirical probe over the real Level 1 PDF, confirmed pdf.js text fidelity and image extraction, surfaced the item-order-is-not-reading-order caveat and the ImageBitmap-needs-canvas wrinkle, and produced the concrete implementation path.
- **Winston** (System Architect, architecture-author): authored D-11 (deterministic geometry, vision classifies only) and D-12 (provenance sidecar), weighed the four alternatives, and framed the change as a new local spec refining M1's E2 without disturbing M2 through M5.
- **Custodian** (data integrity, channeled): required the per-region cache that makes the D-7 idempotency a property, and the visual-verification gate.
- **Edut** (moral conscience, channeled): held the honesty line that a "valid" claim from data alone, without a looked-at screenshot, does not close, after this session shipped a broken preview claimed as working.
- **Mar'ah** (Mirrorblade, channeled): held that fidelity here is a human yes, and that the deterministic mechanism serves that yes rather than replacing it.
