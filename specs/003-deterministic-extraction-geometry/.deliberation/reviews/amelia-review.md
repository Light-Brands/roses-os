# Amelia review: pdf.js feasibility probe (empirical)

Bottom line: the thesis holds. pdf.js delivers verbatim text with exact positions and exact figure rects on the real PDF. Every probe ran against the actual 14-page canon PDF in the vendored pdf.js v4.7.76 in headless Chrome.

## Probe 1, text fidelity: WORKS

`getTextContent()` on pages 2 and 3 returned verbatim, correctly-encoded text. Zero replacement characters, ligatures intact, em-dash/en-dash/middle-dot preserved as proper Unicode. Positions sane: x and y from `transform[4,5]` (flip y with `viewportHeight - f`), font size from `hypot(transform[1], transform[3])`.

Caveat that cuts for the thesis: raw item order is NOT reading order. On page 3 only 5 of 24 items were already in order (pdf.js emits in content-stream order). A naive sort by (y-band, x) reconstructs correct reading order perfectly. Never trust item order; always sort.

## Probe 2, image extraction: WORKS (both paths)

22 image XObjects (4 DCTDecode, 57 FlateDecode references). The operator-list walk recovered exact placed rects (page 3 meditating figure rect 210x210pt, native 1024x1024). Path (a): `page.objs.get(objId)` returns an ImageBitmap in this build (not raw RGBA), draw to canvas then toBuffer, native resolution, transparent background preserved. Path (b): crop the page raster by the CTM rect via `sharp().extract()`, pure node, no canvas. The DCTDecode-vs-FlateDecode difference does not bite here; pdf.js normalizes before `page.objs`. Use path (a) primary, path (b) fallback.

## Probe 3, clustering: WORKS-WITH-CAVEAT (good enough for v1)

Heuristic: group items into lines by top-y within 4pt; font-size buckets from transform scale; break on a vertical gap over 1.6x median line height or a font-size change. Cleanly separated eyebrow, heading, body, TOC, numbered-exercise on both page types. Limits: TOC numerals concatenate with titles without x-gap-aware joining; a wrapped exercise line split from its numeral on font-size change. Do not over-engineer the splitter; feed clustered lines plus geometry to the model and let it assign the final type.

## Probe 4, cost: favorable

A small text-only classification call (a few hundred tokens plus a region thumbnail) versus the current full-page raster upload that asked the model to author content, coordinates, and types at once. Materially cheaper and lower variance, and the model is off the coordinate path entirely.

## Adversarial adjustments

- pd.js text on this PDF is excellent; it is a born-digital text layer, not scanned. Go looking for a reason to kill the thesis and you will not find one.
- The (y, x) sort is mandatory, not optional. Page 3 scrambles without it.
- Path (a) returns an ImageBitmap, not RGBA, so the naive "sharp(rawBuffer)" plan fails; go through a canvas. Path (b) is the pure-node path. Plan for both.
- Budget figure work against about 22 figure candidates across 14 pages, not 57; the FlateDecode count is inflated by content streams and masks.

## Three risks plus mitigation

1. `page.objs` async timing / ImageBitmap-only decode. Resolve via the callback form, branch on `img.bitmap` vs `img.data`, fall to path (b) if a bitmap fails.
2. SMask / image-mask XObjects masquerading as figures. Only treat `paintImageXObject` with placed area above about 80x80pt as a figure.
3. Cluster-vs-true-block mismatch on dense pages. Do x-gap-aware token joining; keep the splitter dumb and the classifier smart.
