# Mar`ah review — editor-richer-blocks

The mirror reveals; the blade cuts concealment.

## 1. What is this actually solving?

Not what the brief says. The brief says "el modelo de bloques es lossy". The model carries `<p>`, `<ul>`, `<ol>`, `<strong>`, `<em>`, `<u>` through `TextBlock`'s `contentEditable.innerHTML` (verified `TextBlock.tsx:18-27, 109-110`). The exporter throws nearly all of that visual chrome away. `export-html.ts:25-27` collapses every `text` block into a single `<div>` with one inline style. There is no cover, no table of contents, no sidebar callout, no hanging-indent numbered exercise, no captioned figure floating beside a paragraph, no decorative rule between sections. All of those are present in `docs/canon/Rose Meditation Level 1.pdf` (cover with "Teachings by Angelina Ataide", numbered TOC with right-aligned page numbers, numbered steps with hanging indent, italic preamble blocks, page numbers in the corner) and in `docs/canon/Aura 1 - Jan2026.pdf` (cover with author + illustrator credits, bullet steps embedded inside narrative, two-column figure-beside-text on the cleansing section).

The faithful PDF export PR by itself, rendering today's blocks through Chromium with a richer template, recovers ~60% of canon fidelity. The block model is not the bottleneck the brief frames it as. The bottleneck is split: ~60% exporter chrome (cover, TOC, page numbers, callout box, captioned-figure layout, decorated rule), ~25% one missing primitive (numbered exercise with hanging indent and two-column figure), ~15% authoring UX (no author today knows when to reach for which block).

Calling it "the model is lossy" risks shipping a TipTap or Lexical rewrite that solves the wrong 15%.

## 2. Smallest first version that proves the idea

One-day spike. Two halves.

Morning: render the four currently-seeded manuals through the in-flight Chromium adapter with a hand-tuned template that uses ONLY today's six block types plus a single new wrapper concept (section). Diff each rendered page against the canon PDF with `pdfdiff` or pixel-overlay. Publish the per-page delta score.

Afternoon: pick the worst-scoring page. Ask honestly which delta is exporter chrome (cover, TOC, rule, two-column, caption) and which delta is genuinely model-missing (e.g. there is no way to represent "step 3 of 7 with hanging indent" in `BlockType`). If exporter chrome dominates, the rich-text rewrite is the wrong cut and the spec collapses to "richer exporter + 2 new block primitives + authoring UX". If model gaps dominate, the rewrite is justified.

This kills or confirms the thesis in one day. Without it, the spec ships on intuition.

## 3. Three risks that kill this

1. **TipTap / Lexical becomes the source of truth and the canon PDFs become decorative.** Authors edit in the live preview, the rendered PDF drifts, and the lineage doctrine in `Aura 1 - Jan2026.pdf` page 1 ("do not share this information") is no longer the constraint the engine respects.
2. **Pasted-Word garbage and contentEditable HTML soup.** `TextBlock.tsx:29-32` uses `document.execCommand`, which is deprecated and produces inconsistent HTML across browsers. A rich-text rewrite without a strict allow-list inherits this and gets worse: every paste from Word, Notion, Google Docs injects style attributes the renderer cannot legitimize.
3. **The 22 new block types graveyard.** Inventory yields 18 patterns. Six months later 14 are used twice, four are used everywhere, and the editor has a "more" submenu that authors learned to avoid. Block proliferation is not fidelity, it is the appearance of fidelity.

## 4. Success at 90 days, and the failure mode of "success"

Failure mode of "success as written": the spec ships, every PDF renders pixel-close to canon, and the authoring UX is a tree of 22 block variants with a TipTap surface in each text node. Authors stop authoring and start asking the editor team to add bespoke blocks for each new manual. The cost of a new manual goes up, not down. A year later the canon PDFs are still the source of truth and the editor is a museum of half-used primitives.

Real success: authors can produce a new manual from blank in one afternoon and the rendered output is within visible-tolerance of canon. Number of block types stays under 12.

## 5. Atomic tasks

- T-001: visual-diff harness (Chromium-render today's blocks vs canon page-by-page), publish baseline score per manual per page.
- T-002: classify each delta as exporter-chrome OR model-missing OR authoring-UX. Posted as a table on the spec.
- T-003: kill-or-proceed gate on T-002. If exporter-chrome ≥50% of delta surface, spec re-scopes to exporter-first.
- T-004: one-block-deep TipTap spike on `TextBlock` with strict schema (paragraph, strong, em, ul, ol, link). Measure paste-from-Word behaviour. One day.
- T-005: one-page-deep Lexical spike on the same. One day. Compare.
- T-006: stack decision recorded in ARCHITECTURE.md with the diff outcomes from T-004 and T-005 as evidence, not preference.
- T-007: inventory of canon visual patterns mapped to BLOCK vs EXPORTER vs WRAPPER classification.
- T-008: schema migration plan with backwards-compat assertion: load all 4 seeded manuals, assert zero block lost.
- T-009: paste-sanitizer with allow-list, integration test on Word, Notion, Google Docs paste.
- T-010: keyboard-accessible drag reorder (Reorder.Item today is mouse-only — verified `BlockEditor.tsx:64-77`).
- T-011: telemetry on block-add, block-delete, block-edit-then-undo (signal for "wrong primitive picked").
- T-012: deprecation policy for block types added then unused after 90 days.

## 6. The one seam only this faculty would catch

The framing in `[[project_roses_os_manual_exports]]` says "the block model is lossy". That memory entry is 5 days old, written before the faithful-pdf-export work. It was true relative to the hand-rolled `blocksToHtml` exporter. It is partially false relative to Chromium-through-template. The other panelists will treat the memory as ground truth and the brief will inherit a frame that bakes "rich-text rewrite required" into the spec before T-001 has a chance to falsify it.

The seam: this spec almost ships a TipTap or Lexical migration whose justification is a 5-day-old observation against an exporter that is being replaced this week. Run T-001 before the architecture choice is made. If the diff is small after the new exporter lands, the spec re-scopes to exporter-chrome + two new primitives + authoring UX and the rich-text rewrite goes into a follow-on spec gated on real evidence.

## Sacred check (light)

Truth: violated by the brief framing if T-001 is not run before stack choice. The "model is lossy" claim is stronger than the evidence currently supports.

Beauty: the canon PDFs ARE the beauty standard. Any preview that becomes the new source of truth without continuous diff against canon erodes it silently.
