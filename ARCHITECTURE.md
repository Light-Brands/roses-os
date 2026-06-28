# Roses OS: architecture decisions

This file is the durable record of load-bearing decisions across the roses-os codebase. Each entry is dated, names the spec that asked the question, and cites the evidence behind the answer. Decisions can be revised; revisions land as a new entry referencing the old.

## D-1: Manual block model uses discriminated unions with schema_version per row

**Date:** 2026-05-29
**Spec:** 001-richer-block-editor M1
**Status:** active

Each row in `manual_blocks` carries `content.schema_version` (1 for legacy, 2 for new variants). The `BlockType` TypeScript union and the `block_type` SQL CHECK constraint both list every variant; new variants are added to BOTH (sequence: CHECK first, then TS) before any code references them. Reads route through `block-parser.ts::parseManualBlock` which falls back to `{ kind: 'unknown', raw }` on validation failure. Writes route through `validateBlockInput` which refuses invalid payloads with the named-error envelope `{ok:false,error:{code:'INVALID_BLOCK',message}}`.

**Why:** the previous schema had a single `content JSONB` blob with no per-row version. Migrations could not introduce new shapes without breaking the read path; lints could not enforce shape contracts; producers and consumers drifted (e.g., the TS union carried `image-row` long before the CHECK constraint did, a silent insert hazard per AC3 back-fix).

## D-2: CHECK constraint widens before TypeScript union references new variants

**Date:** 2026-05-29
**Spec:** 001-richer-block-editor M1
**Status:** active

Migration 0002 lands every new variant in the SQL CHECK constraint BEFORE any TypeScript code references them in `BlockType`. The reverse order would silently fail inserts on production until someone noticed the constraint was rejecting valid v2 rows.

**Why:** Winston's review flagged that the legacy drift on `image-row` was caused exactly by reversed sequencing.

## D-3: Rich-text engine is TipTap (default per OQ2)

**Date:** 2026-05-29
**Spec:** 001-richer-block-editor M2 (resolves OQ2)
**Status:** active

Adopt TipTap (`@tiptap/react` + `@tiptap/starter-kit`) as the rich-text engine. The engine is wrapped behind `src/lib/manuals/richtext/engine.tsx`; its document state is serialized to canonical JSON via `serializer.ts` and deserialized via `deserializer.ts`. Marks are closed at `bold`, `italic`, `link`, `bulletList`, `orderedList`, `softBreak`. No toolbar UI (Kaze discipline rule).

**Evidence basis (T-015 and T-016 formal spikes deferred under integral-drain):**

- **Bundle weight.** TipTap-core + StarterKit gzipped is ~80-120kb (Amelia's review); StarterKit ships ProseMirror with a permissive license, no extra peer deps beyond `@tiptap/pm` (also installed). The editor surface only loads via dynamic import on `/manuals/[slug]/edit`, keeping the read-path bundle untouched.
- **Paste-from-Word.** TipTap's `paste-sanitizer` integration accepts a node + mark filter; the planned allow-list (`paragraph`, `strong`, `em`, `bullet_list`, `ordered_list`, `link`, `soft_break`) matches Kaze's closed-marks discipline. Paste integration tests at `paste-sanitizer.spec.ts` confirm sanitization across Word, Notion, Google Docs paste sources.
- **Next 16 RSC compatibility.** TipTap is client-only (`'use client'` directive on the wrapper). The editor is dynamic-imported into the edit page so the server component tree does not need a TipTap import path. RSC compatibility is achieved by the import barrier, not by TipTap itself being RSC-safe.

**Default-resolution path per spec OQ2:** "default if no signal: TipTap." The formal spikes were Lattice + Winston requests; with the engine wrapper isolating the choice behind a canonical-JSON boundary, swapping to Lexical post-ship is a contained refactor (engine.tsx + serializer.ts + deserializer.ts). The decision is reversible at the cost of those three files.

**Revisit triggers:** if paste-from-Word produces > 1% drift on the M5 staging soak, OR if Next 16 RSC produces unexpected hydration failures, OR if bundle delta exceeds 200kb gzipped at editor entry.

## D-4: Block registry centralizes per-type metadata; adapters consume it

**Date:** 2026-05-29
**Spec:** 001-richer-block-editor M1
**Status:** active

Each block type declares its `kind`, `validator`, `defaultContent`, `renderer`, `preview`, `serializeHtml`, `serializeMd`, and `isContainer` flag in `src/lib/manuals/block-registry.ts`. The HTML and MD exporters consume the registry's serializers; the editor canvas and preview consume the renderer/preview components. Adding a new block type means one registry entry plus one Zod schema. The completeness type-level guard in registry.ts fails to compile if a `BlockType` variant is missing from the registry.

**Why:** the legacy exporter (`export-html.ts`) hand-codes a switch on block_type; adding a variant required editing the exporter AND the editor AND the importer in parallel. The registry collapses that to one entry.

## D-5: Staging is a cloned manual_id row in the same table and project

**Date:** 2026-05-31
**Spec:** 002-faithful-content-reconstruction M0
**Status:** active

Staging is realized as a sibling `manuals` row carrying its own `id`. Reconstructed blocks are written under that staging `manual_id`. Production manual ids stay frozen. `getBlocks(stagingId, 'en')` reads the reconstruction; `getBlocks(prodId, 'en')` reads untouched legacy. Promotion (D-8) moves rows from the staging id to the prod id. Alternatives considered: a reserved language tag such as `en-staging` on the same prod manual_id; a `schema_version` lane reusing the version field as a stage flag; a separate Supabase project.

**Why:** isolation becomes structural. A query that targets the prod id cannot see staging rows, so no promotion bug can leak a draft into a live read. The clone reuses the existing `manual_id + language` index path with zero schema change. The language tag overloads a column whose only writer today is locale, and a single wrong filter writes prod. The schema_version lane corrupts D-1's meaning of that field. A separate project doubles env, migration, and asset surface for a four-manual job and makes promotion a cross-project copy with no transaction. Source: Winston, with the staging-first constraint from the operator.

## D-6: Bulk writes go through a server-side service-role module, never the browser client

**Date:** 2026-05-31
**Spec:** 002-faithful-content-reconstruction M0
**Status:** active

A new `db.admin` module, constructed from the server Supabase client with `SUPABASE_SERVICE_ROLE_KEY`, exposes `bulkUpsertBlocks(manualId, language, rows)`. It runs only in pipeline scripts and route handlers, never bundled to the client. `db.ts` is unchanged; the editor keeps the anon path. Alternatives considered: keep using the anon browser client from a script; a Postgres RPC that takes a block array.

**Why:** the anon client is governed by RLS scoped to interactive editing, not hundreds of inserts, and cannot be trusted to bypass policy safely. A dedicated admin module keeps the service-role key on the server and gives the pipeline one audited entry point. The anon path either fails RLS or runs under an over-broad policy nobody reviewed. An RPC hides the upsert in SQL where the recipe-merge model of D-7 cannot reach it cleanly; the merge belongs in TypeScript next to the Zod validators. The module fails closed when its env var is absent. Source: Winston.

## D-7: The per-manual recipe YAML is the single authority of human intent; the pipeline is a pure function of canon plus recipe

**Date:** 2026-05-31
**Spec:** 002-faithful-content-reconstruction M1 and M2
**Status:** active

One checked-in `recipes/<manual>-<lang>.yaml` per manual holds curation decisions (TOC collapses, page-template config, figure-to-asset mapping) and human corrections keyed by a stable per-block anchor (page index plus block ordinal, not a DB id). Each run computes staging rows as `map(extract(canon), recipe)`. The recipe override always wins over the extracted draft. A re-run never mutates the recipe and never reads existing staging rows as input. Alternatives considered: corrections written back into staging DB rows directly; a free-form diff or patch file.

**Why:** idempotency becomes a property, not a hope. Because staging is a pure output of canon plus recipe, two runs produce identical rows and a human correction survives because it lives in the recipe, not in a row a re-run overwrites. Stable anchors mean an upstream extraction change does not orphan a correction. Correcting the DB row makes the row both input and output, so the next run either clobbers the fix or must diff against itself. A free-form patch has no schema and fails silently. Promotion (D-8) is defined against the recipe-derived staging, so prod and a fresh staging cannot diverge. Source: Winston.

## D-8: Promotion is a single transaction: snapshot legacy, replace, with a tested rollback

**Date:** 2026-05-31
**Spec:** 002-faithful-content-reconstruction M4
**Status:** active

Promotion runs server-side in one Postgres transaction: copy the prod manual's current rows into a `manual_blocks_backup` table tagged with manual_id and a promotion timestamp and carrying position plus a content checksum, delete the prod rows for that manual and language, insert the staging rows under the prod manual_id, commit. Rollback is a named inverse that restores from the tagged backup. Promotion is gated on review sign-off in the recipe, the named-teacher signer, and the 7-day soak timestamp. Alternatives considered: per-row upsert without a transaction; swap by renaming the staging manual_id to the prod id.

**Why:** all or nothing. A failed promotion leaves prod exactly as it was, and the tagged backup makes rollback a data operation, not a re-run of the whole pipeline. Per-row upsert can half-apply and strand a manual in a mixed legacy and v2 state. Renaming ids breaks every external reference to the prod id and orphans the staging clone's identity. The backup table is a new migration. Source: Winston, with the backup-checksum requirement from Custodian.

## D-9: AC10 block-type ceiling is retired; the registry's 18 types are the canon surface

**Date:** 2026-05-31
**Spec:** 002-faithful-content-reconstruction M0
**Status:** active, supersedes the AC10 ceiling of spec 001-richer-block-editor

Spec 001 AC10 (block-type count under 12) is retired. The 12 figure was an early-M0 estimate; the real canon surface needs 18, and the compile-time completeness guard in `block-registry.ts` plus the `block_type` CHECK constraint are the actual enforcement of the type set. No count ceiling is reinstated. Alternatives considered: keep AC10 and treat the overage as debt; prune types back under 12.

**Why:** the ceiling was a guess that reality exceeded; pretending it holds hides the truth. The registry guard already prevents drift, which is what AC10 was reaching for. Keeping a violated AC as live debt rots the ledger. Pruning real, used types to satisfy an estimate is the tail wagging the dog. Source: packet established facts.

## D-10: Block position is unique per (manual_id, language)

**Date:** 2026-05-31
**Spec:** 002-faithful-content-reconstruction M0
**Status:** active

A unique constraint on `(manual_id, language, position)` is added by migration. Today nothing enforces position uniqueness, so two reconstruction runs can produce two blocks at position 0 and the editor renders whichever Postgres returns first. With the constraint, the staging writer upserts on that key and a duplicate insert is rejected by the database rather than silently accepted. Alternatives considered: enforce uniqueness only in application code in the writer.

**Why:** the database is the only place a uniqueness invariant cannot be bypassed by a second writer or a future script. Application-only enforcement is a convention the next caller can break. This constraint also makes the D-7 idempotent upsert well-defined: the key the writer upserts on is the key the database guarantees is unique. Source: Custodian.

## D-11: Extraction separates deterministic geometry from vision classification

**Date:** 2026-05-31
**Spec:** 002-faithful-content-reconstruction M1 (refines E2); landed by local spec 003-deterministic-extraction-geometry
**Status:** active

E2 splits into two modules with a hard seam between geometry and semantics. `extract-geometry.ts` is pure pdf.js over the source page, no network and no model: it calls `getTextContent()` for the exact text runs with their transform matrices (x, y, font size, font name) and walks the page operator list to find `paintImageXObject` ops, recovering each embedded image's device-space rect and its decoded pixels. Its output is a deterministic `PageGeometry`: an ordered list of text runs and figure regions, each with an exact rect in PDF user space, reading order derived from the rects by a column-aware top-to-bottom band sort (pdf.js emits runs in content-stream order, not reading order, so the sort is mandatory). `classify-regions.ts` is the only place the model is called: it receives pre-extracted regions, each as text plus font size plus exact rect plus a thumbnail of that region's own rect, and returns per region a `block_type` from the 18-type registry plus the content fields that type needs. The model never returns a coordinate and never sees a box. A deterministic rule layer classifies the unambiguous majority first (heading by font rank, contents rows by column x, cover by largest-centered-top), so the model judges only the residue. `map-to-blocks.ts` (E3, unchanged in role) assembles each classified region into a `{block_type, content}` payload and runs every payload through `validateBlockInput` (D-1) before it goes downstream; recipe overrides (D-7) apply on the same stable anchor. Classification is cached per region by a content hash of (text, font name, font size, rect, figure-bytes hash), so a re-run reads every label from cache and re-derives byte-identical staging rows.

**Alternatives considered:**

- **Keep the vision bounding box plus a second tightening pass.** Rejected. It treats non-convergence as a tuning problem when it is a category error: the page already carries the exact rects as data, so re-estimating them with a model pays a non-deterministic tax to approximate a deterministic fact. Two non-deterministic passes still cannot make idempotency a property, and they double the cost against the OQ3 budget. It reduces the failure rate, not the failure class.
- **Full deterministic, no vision, classify from font and position by rule alone.** Cheapest and fully deterministic, kept as the rule-first layer but rejected as the sole mechanism. Several of the 18 types are semantic reads, not typographic ones: the callout variant is a read of the words, a quote and a spoken-instruction can share italic styling, a wisdom callout carries no label strip. A rule engine tuned to Level 1 typography would regress on Level 3 the way the box prompt regresses today, moving the brittleness from coordinates to font thresholds.
- **The chosen hybrid: deterministic geometry, vision classifies only.** Selected. It puts each half on the tool that is correct for it, and its one fallible output (a label) is cached, schema-validated, and recipe-overridable. Every failure mode of the prior sample is structurally impossible because no box comes from the model.
- **A third-party layout-analysis service (Textract, Document AI, Document Intelligence, LayoutLM, Surya).** Rejected. These return their own coordinate estimates and reading order, reintroducing the non-determinism D-11 removes, plus an external dependency and a vendor data path. They earn their keep on scanned documents with no text layer, which is out of scope here.

**Why:** the empirical fact is non-convergence, and no prompt fixes it because the model is asked for a page-global continuous quantity it produces by estimation, which has no fixed point across a heterogeneous page set. The chosen path removes the question from the model. It is also the only alternative that makes D-7 idempotency a property rather than a hope: `extract` is deterministic and `classify` is cached on a deterministic key, so the composed function is deterministic, which is what D-7 reaches for. Determinism here is what lets a human correction in the recipe survive a re-run instead of being clobbered by a box that drifted a few pixels and re-flowed the page. Source: Winston, on Amelia's empirical probe over the real Level 1 PDF.

**Non-goals:** pixel-perfect absolute-position layout in the reader app (the app renders linear blocks by D-1; this reproduces content and reading order, not canon x and y); OCR of scanned pages (a born-digital text layer is assumed); non-English locales (unchanged from spec 002, still blocked by the hard locale guard); reflowing or re-typesetting canon (curation stays the recipe's job).

## D-12: Reconstruction provenance is carried in a sidecar and audit columns, not inside block content

**Date:** 2026-05-31
**Spec:** 002-faithful-content-reconstruction M1 (supports T-012, AC11)
**Status:** active

Provenance (source canon page, extraction run id, signer) is required on every reconstructed block by AC11, but the 18 content schemas are a closed discriminated union and adding a provenance field to each would dilute the read-path contract and force 18 schema edits. Provenance is instead carried in a per-run sidecar `reconstruct/<manual>.<lang>.provenance.json` keyed by the same stable (page index, block ordinal) anchor the recipe uses, plus the staging row audit columns: `updated_by` carries the signer, and a `source_page` and `run_id` pair lands via the D-6 admin writer into two nullable columns added by the M0 migration alongside the position-uniqueness constraint. The block content JSON stays exactly the 18 shapes the registry guard and `validateBlockInput` enforce. The promotion gate (D-8) reads the signer from the audit column, so AC11's "a promoted block with an empty signer does not exist" is a NOT NULL check at promotion time, not a content-schema concern.

**Alternatives considered:**

- **Add a provenance field to each of the 18 content schemas.** Rejected. It dilutes D-1's discriminated-union contract, forces 18 edits, and puts how-a-row-was-made metadata into the content a reader's renderer consumes.
- **A separate provenance table joined by block id.** Rejected for v1 as heavier than the job needs; the sidecar plus two audit columns covers the AC, and the block id is not stable across re-runs the way the anchor is.

**Why:** provenance is a property of how a row was made, which belongs in audit columns and a checked-in sidecar, not in content. The anchor key is the one D-7 already guarantees stable, so provenance, recipe overrides, and the classification cache all index off one deterministic coordinate. Source: Winston, with the content-schema-purity requirement from D-1.

**Non-goals:** a full audit trail of every classification decision (the events log and the sidecar suffice); provenance for legacy v1 rows (only reconstructed blocks carry it).

## D-13: Page structure is derived by deterministic layout analysis, improved as a general rule, never page-by-page

**Date:** 2026-06-01
**Spec:** 003b-deterministic-layout-analysis (extends 003 D-11)
**Status:** active

Reading order and multi-column structure are derived from the page geometry by a recursive XY-cut (the classic document-layout algorithm), pure and deterministic, in `src/lib/manuals/layout.ts`. The cut alternates horizontal cuts (a full-width whitespace band separates stacked sections, read top-to-bottom) and vertical cuts (a whitespace gutter separates columns, read left-to-right); reading order AND columns fall out of the same cut. A vertical cut fires only when both sides are real columns (≥2 boxes, or one box that spans ≥1.8 line-heights), so a numeral never splits from its title. Semantic grouping (a numbered exercise = numeral + title + body) is bounded by the XY-cut LEAF, so an exercise never crosses a figure or a column. A side-by-side band the cut finds is emitted as a real `two-column-section` (D-1's registry), referencing its members by id; `columns.ts` does that wrap. This replaced three earlier single-column-plus-patch heuristics (a global band sort, a figure-interleave pass, a geometric two-column detector) with one geometry-driven pass.

**The operating rule (load-bearing for scale):** the corpus is thousands of pages across four manuals. Every observed error is fixed by improving the GENERAL parser or the layout/classification rules, NEVER by a page-specific patch or template. A fix that only helps one page is rejected; the test of a fix is that it is expressed as a deterministic rule over the geometry that holds across the corpus. Marked errors become rules, not exceptions.

**Alternatives considered:**

- **Per-page or per-manual layout templates.** Rejected. It does not scale to thousands of heterogeneous pages and turns every new page into hand-work.
- **A model-based layout/reading-order pass.** Rejected for the same reason D-11 rejects model boxes: it reintroduces the non-determinism D-11 removed. The position is already in the PDF; cut it, do not estimate it.

**Why:** the page already encodes its structure in the whitespace between its content rects. Deriving structure from that whitespace is deterministic, idempotent (D-7), and generalizes across the corpus, where a single-column assumption with per-page patches does not. Source: Quinn with Dario, after the page-6 two-column win was generalized into the XY-cut rule rather than left as a special case.

**Non-goals (v1):** text that wraps around a floating figure (a full-width intro paragraph above an alternating-column body renders correctly but as its own row, not wrapped); table and glossary structure on the denser manuals (Level 3), which get their own rules when those pages are exercised. These are named so the next iteration improves the general rule, not a page.

---

## D-14: A page-template block (cover, contents) folds only its own constituents, never the whole page

**Date:** 2026-06-01
**Spec:** extends D-11 / D-13 (classification general rules)
**Status:** active

A "whole-page" block type is the cover ONLY. A contents page is NOT whole-page: it routinely carries a page title, a subtitle, a decorative ornament, and a footer pull-quote around its rows. The earlier contents rule folded *every* region on the page into the contents block and returned early, silently dropping the title, subtitle, and pull-quote (observed on Level 1 page 2). Generalized: `parseContentsRows` now reports the exact region ordinals that contributed a TOC row, the contents block folds ONLY those, and every other region classifies on its own (title → heading, subtitle → heading, footer prose → text). The contents page also flows in XY-cut geometric order (D-13) instead of a flat ordinal sort, so the ornament lands between the subtitle and the rows as it does in the canon. Three more general rules landed in the same pass:

- **Letter-spacing (tracking) is collapsed, not literalized** (`collapseLetterSpacing`). pdf.js extracts a tracked label as single-char tokens ("C O N T E N T S"); the data carries the clean word ("CONTENTS") and the renderer restores tracking as a style. A wider gap (2+ spaces) keeps a word break; a single-spaced multi-word phrase whose join would exceed `MAX_TRACKED_WORD` is left spaced rather than fused (word breaks are unrecoverable from the flattened string — a geometry-level fix is the named non-goal).
- **Figures carry their real on-page size** (`width_pct` = figure width / page width). A small ornament (the page-2 flower is 27pt on 612pt ≈ 4%) renders small; a full plate renders large. No renderer inflates every figure to its max box.
- **Running headers/footers are dropped** (`isRunningHeadFoot`): a short, sub-body-size, single-line region in the extreme top (<8%) or bottom (>92%) band. The bottom threshold is 0.92, not the 0.90 the row filter uses, so a body-size pull-quote at ~0.90 is kept, not mistaken for furniture.
- **TOC range numerals** ("3–5", and the glued "3–5Aura" with no space) are parsed by a contents-scoped numeral regex; prose ambiguity still uses the strict space-required form.

**Non-goals (v1):** word-break recovery for a multi-word phrase the extractor flattened to single spaces (needs a wider-gap marker emitted at geometry time); merging a body region's physical lines into one paragraph when there is no real paragraph break (a multi-line pull-quote currently renders one `<p>` per source line). Named so the next iteration improves the general rule, not a page.

**Why:** classification is per-region (or per-XY-cut-leaf), never "this whole page is type X, swallow everything." The monopoly shortcut is what dropped real content. Source: Quinn with Dario, generalizing the Level 1 page-2 fidelity gaps.

---

## D-15: A filled rectangle behind text is a tint box; text inside one is a callout

**Date:** 2026-06-01
**Spec:** extends D-11 (geometry is read, not estimated) and D-14 (per-region classification)
**Status:** active

The canon sets asides and pull-quotes in a pale tinted box with a colored left border. That box is real geometry — a filled vector rectangle — not something to infer from wording. The browser extractor (`scripts/vendor/pdfjs/extract.html`) now walks the operator list for `constructPath` → `fill`, reads the path's bounding box from pdf.js's `args[2]` minMax (CTM-transformed to top-left points) and the active fill color, and emits a `fills` stream. Glyphs are drawn by text operators, not path fills, so this captures vector boxes/rules only, never letters. `extract-geometry.ts::fillBoxesFromRaw` keeps only **tint boxes** — light-but-not-white, area ≥ `MIN_FILL_AREA_PT`, short side ≥ `MIN_FILL_DIM_PT`, aspect ≤ `MAX_FILL_ASPECT`, and below `MAX_FILL_PAGE_FRACTION` of the page (so the page ground and hairline rules are dropped) — and surfaces them, rounded and sorted, on `PageGeometry.fills` (AC1 byte-stable). `classify-regions.ts` then applies one general rule: a text region whose rect sits inside the tightest containing tint box is a `callout` (its lines joined to one paragraph body). Verified across Level 1: 6 of 10 pages carry a real callout box and all 6 are detected, with no false positives on the 4 pages that have none; block count unchanged (a text→callout swap, nothing added or dropped); geometry still deterministic.

**Non-goals (v1):** callout `variant` is always `note` (mapping a box's tint hue to warning/wisdom/summary is a later refinement); a tint box that contains several regions yields one callout per region rather than one grouped callout (Level 1 boxes are single-region). Named so the next iteration improves the general rule, not a page.

**Why:** same principle as D-11 — the position and the box are in the PDF; read them, do not estimate. A page-specific "this paragraph is a quote" patch would not scale; a tint-box primitive over the geometry does. Source: Quinn with Dario, after the page-2 pull-quote.

---

## D-16: Multi-column reading order at the run level; N columns render side-by-side

**Date:** 2026-06-01
**Spec:** extends D-13 (XY-cut layout)
**Status:** active

Multi-column body text (a three-up "Protection | Separation | Observation" block) was jumbled: the flat band sort merged runs sharing a y-band across the column gutters, so the page read left-to-right across the columns and the three headings collapsed into one. Two coordinated fixes, both deterministic:

1. **Column-aware extraction** (`extract-geometry.ts::groupRegionsColumnAware`). Before grouping runs into lines, XY-cut the *runs* into sections and columns, then group lines into regions WITHIN each column leaf so a line never spans a gutter. A vertical cut only fires on a gutter empty across the whole section, so an accidental wide word-gap never splits a single column (other lines cross it). The horizontal-cut threshold is the region grouper's own paragraph gap (`REGION_GAP_FACTOR × median line height`), so a single-column page partitions exactly as the old flat pass did — only true columns change. `xyCut`/`findHCut` take an optional `minHGap`; `orderedLeaves` returns leaf box-groups preserving the leaf boundary.

2. **N-column rendering.** `flattenLayout` emits an N-ary `cols` slot (flattening nested `columns` nodes into sibling columns). Regions are tagged `colGroup` + `colIndex` + `colCount`; `columns.ts` wraps a band of N columns into nested `two-column-section`s — left = first column, right = a section over the rest — so three-up renders side-by-side while staying inside the frozen 18-type schema (D-1). Proportions track real column widths, so three equal columns render ~1/3 each.

3. **Header-row attachment** (`attachHeadersToColumns`). A short column heading does not self-column (a lone short box is not a "real column" by the D-13 guard), so at the default 6pt H-threshold the heading ROW splits off from the body row and the three headings ("Protection | Separation | Observation") detach into a stacked row above the body columns. The fix is targeted, NOT a global threshold change: when a flow slot ends in N boxes that form a single row, each aligned over one of the next `cols` slot's N columns and sitting above it, fold each header onto the top of its column. It fires only for that exact pattern — a single-column page, a figure+text band, or a TOC never matches — so it cannot over-column.

**Why a global threshold was rejected (twice):** (a) preferring the larger of (h-gap, v-gutter) globally tore TOC page numbers and big exercise numerals into bogus columns; (b) raising the column-detection H-threshold to the paragraph gap merged page 6's figure-flanked exercises into one cramped, over-nested column stack. Both regressed working pages. Header-attachment leaves every other layout untouched and only repairs the detached-header case.

**Non-goals (v1):** more than the nesting depth needed for the observed three-up (the nested two-column-section pattern generalizes, but very many columns would read as a deep right-spine); a multi-row column body whose rows are not a clean header+body (only the leading header row attaches). Verified on Level 1: page 7's three-up renders as three side-by-side columns, each heading with its body; pages 2 (TOC), 6 and 8 (figure two-columns) unchanged; geometry deterministic; 81/81 valid.

**Why:** the column structure is whitespace in the geometry — cut it, do not estimate it (D-11). Source: Quinn with Dario, after the page-7 three-up jumbled.

---

## D-17: Sub-region structure (paragraphs + bullet lists) is derived from line geometry

**Date:** 2026-06-01
**Spec:** extends D-11 / D-14 (classification from geometry)
**Status:** active

The region splitter (`extract-geometry`) groups lines into a region at the coarse `REGION_GAP_FACTOR` gap, so one region can still hold more than one paragraph, or a paragraph followed by a bullet list. `classify-regions::regionStructure` derives that finer structure from the line rects — never from punctuation:

- **Paragraph breaks.** The tightest inter-line gap in the region is its normal leading; a gap > 1.5× that (and > 2pt larger) is a paragraph break. A wrapped single paragraph (uniform gap) stays one `<p>`; a region with two real paragraphs (the page-4 grounding-cord body) splits where the canon breaks.
- **Bullet lists.** A run of ≥2 consecutive lines indented past the region's base left margin (> 6pt) is a bullet list, one item per line. pdf.js dropped the bullet glyph (`•` is a vector path, not text), but the indentation survives in the geometry, so the list is recovered and the renderer restores the marker (`<ul>`/TipTap `bulletList`).

`bodyToHtml` (text blocks) and `docFromRegion` (callouts) both render this structure; the TipTap `bulletList`/`listItem` nodes validate against the loose tiptap node schema, so the DB path gets a real list.

**Non-goals (v1):** multi-line (wrapped) bullet items — each indented line is taken as its own item, so a bullet that wraps would over-split (the glyph that would disambiguate is gone); nested lists; ordered lists. Verified on Level 1: page-4 body = two paragraphs; page-6 ex5 = intro paragraph + three-item bullet list; page-2 pull-quote still one paragraph; 76/76 valid; deterministic.

**Why:** the structure is in the whitespace and indentation of the real line rects — derive it, do not guess from text. Source: Quinn with Dario, after the page-4 punto-y-aparte and page-6 bullets.

---

## D-18: The promotion executor implements D-8; the headless run exercises it staging-to-staging only and never against prod

**Date:** 2026-06-09
**Spec:** 004-site-ready-all-manuals (refines D-8 dated 2026-05-31)
**Status:** active

`scripts/promote.ts` is the concrete D-8 transaction: snapshot the target rows to a backup, delete them, insert the source rows under the target manual_id, commit. The obligatory child-ref remap (export `page:ordinal` ids to DB uuids by position, per `stage-reconstruction.ts`) runs inside the insert. Granularity is `--manual <slug> --language <lang>`. A `--dry-run` prints the row delta and runs no write. A signer not-null precheck reads the D-12 audit column and refuses an unsigned source; the held marker (D-21) is also refused. In the headless run the executor is built and tested with BOTH endpoints on a staging lane, so prod is never a connection the run holds.

**Alternatives.** (a) Build promotion to run prod-to-prod under a guard flag in the same run: rejected; one flag flip from a headless bot is exactly the failure the operator contract removes, and a guard the bot can disable is not a boundary. (b) Skip building it and leave D-8 named: rejected; #596/#597/#598 need a tested promotion path, and an untested transaction discovered on prod-day is the worst time to find the remap bug. (c) Delete-then-insert across two anon calls (the stage-translation.ts pattern): rejected; a mid-flight failure empties the live locale with no rollback (Custodian).

**Why:** the executor is fully validated without ever putting prod within reach, so Gate G1 (service token) is the only thing standing between staging and prod, exactly where the operator wants the human. The service-role key and prod connection are absent from the headless environment; the run uses the anon key only. Source: Winston, on the operator contract, with Custodian's rollback seam.

---

## D-19: The L3 table is one deterministic rule over row fill-rects plus aligned text x-columns; it adds exactly one block type

**Date:** 2026-06-09
**Spec:** 004-site-ready-all-manuals (extends D-11 geometry-is-read, D-13 general-rule)
**Status:** active

**Empirical basis:** Winston ran a probe over the real Level 3 PDF, all 12 pages, dumping text-run positions, fills, and strokes. Page 9 is a genuine table: five rows at regular y (547, 568, 589, 610, 631), each row a thin filled rectangle the existing driver already captures, every row split at a cell wall x=322, text aligned to fixed columns (label x=63, value x=126, annotation x=432-463). Page 2 contents has the same full-width row fills but a single column, so it stays a TOC under D-14, not a table. Strokes are nearly empty (1-2 per page, the page border); table grids are fills, so no driver change is needed.

Add ONE block type `table` (CHECK then registry then TS, the D-2 order). A deterministic rule in `classify-regions.ts`: when a band carries >=3 evenly spaced horizontal fill-rects of equal width and the text runs between them cluster into >=2 stable x-columns, emit a `table` whose cells are the runs bucketed by (row band, x-column). Cell walls come from rule x-segments (the x=322 split), never inferred.

**Alternatives.** (a) Render the table as a `two-column-section` of text (D-16): rejected; it loses row alignment and the third annotation column, and a reader cannot scan label-to-value. (b) A model label per cell: rejected by D-11; position is in the PDF, do not estimate it. (c) Three new types (table, glossary, footnote): rejected as ungrounded; the probe shows no glossary-with-definitions and no footnotes exist.

**Why:** one rule over already-captured geometry generalizes across the corpus (D-13) and keeps the type surface minimal. The registry guard and CHECK widen by one; the HTML/MD exporters gain one serializer; the editor gets one renderer. Source: Winston, on the L3 probe.

---

## D-20: L3 footnotes and the page-11 glossary are non-goals because the probe shows neither structure exists

**Date:** 2026-06-09
**Spec:** 004-site-ready-all-manuals (extends D-19)
**Status:** active

**Empirical basis:** across all 12 Level 3 pages every small-font (6.5-7pt) run is a letter-spaced section eyebrow ("FOUNDATION", "POST-SESSION CLEANSING STEPS"), a running header or footer, a page number, or page-1 copyright print. None sits below a mid-content separator rule, which is the footnote signature. Page 11 is a two-column LIST of term names with no definitions, which D-16 N-column rendering already handles.

No footnote block type and no glossary block type. The eyebrow and furniture cases are already covered by D-14 running-header/footer dropping. Page 11 stages as a two-column-section of text/list blocks.

**Alternatives.** Add footnote/glossary types speculatively: rejected; a type with no producer is dead weight on the registry and the CHECK constraint, and the deterministic-extraction lesson is to ground a type in real geometry before committing it.

**Why:** it keeps the frozen schema honest. If a later manual (Aura) carries a real footnote, the rule is added then, against that geometry, not now. Source: Winston, on the L3 probe.

---

## D-21: The MT engine is a producer of translations.<lang>.json against the frozen source.json contract; el/ru/uk carry a held-for-native-review marker as data

**Date:** 2026-06-09
**Spec:** 004-site-ready-all-manuals (extends the translate-fields contract)
**Status:** active

`scripts/translate-mt.ts` reads the existing `source.json` `strings: [{idx, position, path, kind, text}]`, calls the Gemini provider, and writes `translations.<lang>.json` of `{idx, text}` aligned by idx, which `stage-translation.ts` already joins back by path and validates through `validateBlockInput`. The MT call touches only `strings`; it never sees structure, src, child refs, enums, colors, or schema_version. For el/ru/uk the stager writes a held-for-native-review marker so the row is staged but visibly not promotable. In the anon-only headless run the marker rides a `run_id` convention; the clean `review_status` column ships as the 0008 migration applied at promotion time (G1).

**Alternatives.** (a) Have the MT call emit blocks directly: rejected; it would bypass the structure-preserving boundary `collectStrings`/`applyStrings` enforce and could mutate child refs. (b) Carry the held marker only in a sidecar: rejected; the promotion precheck (D-18) reads row-level state, so the marker must be a value the gate can refuse on. (c) Block el/ru/uk from staging until the column exists: rejected; staging them now is useful for native review as long as the marker is honest.

**Why:** the MT engine is one more producer of the same flat-string contract, so all six languages scale off one code path and the held state is enforceable at promotion. A non-deterministic MT call would break the D-7 idempotency the rest of the pipeline holds, so translations cache by a hash of the source strings: a re-run with unchanged source reuses the cache and only changed strings re-call MT. D-18 promotion refuses a held row; Gate G2 (native review) clears it by flipping the marker after signoff. Source: Winston, on the operator contract, with Amelia and Custodian on the marker substrate.

---

## D-22: The editor-vs-PDF fork is resolved as a staged two-output path, not a single converged Download

**Date:** 2026-06-27
**Spec:** 005-editor-fidelity-and-undo (Jennifer Brooke feedback)
**Status:** active

Download keeps serving the canonical hand-designed PDF (the `getFinalPdfForSlug` static file produced by the `scripts/build-manuals.ts` Puppeteer-over-hand-HTML pipeline). A second, separately labeled "Draft PDF from your edits" option is added that runs the existing `blocksToHtml` output through the existing `scripts/pdf-manuals/html-to-pdf.ts` Puppeteer step server-side. The two outputs stay separate and labeled. Convergence onto one button happens only when regenerate-from-blocks fidelity clears a measured bar against the canonical master, decided by a named signer, not by code default. Until then the UI states plainly that Download serves the designed print original.

**Alternatives considered:**

- **(A) Editor is web-only forever; PDF never reflects edits.** Honest and cheap, but strands the whole 002/003/004 reconstruction arc, which exists to make blocks the source of truth. It tells a teacher her edits can never reach the deliverable.
- **(B) Blocks become the single source of truth now; one Download regenerates from blocks.** This is the endgame, but shipping it today serves a PDF visibly worse than the hand-designed master. A regression teachers reject kills trust in the editor.

**Why this won:** the staged path keeps the canonical master safe while making the regenerate path real and visible, so fidelity can be measured on an opt-in output instead of risked on the only output. The fork was previously hidden: #506 ("replace blocksToHtml placeholder with the Puppeteer pipeline") was closed by routing Download to the static file (commit 75427b5), which resolved the symptom and left the fork undocumented. This decision names it. A and B both force a one-way door before the evidence exists.

**Implications downstream:** the regenerate path reuses code that already exists (`blocksToHtml`, `html-to-pdf.ts`); no new pipeline. A fidelity-comparison harness against the canonical master becomes the gate for any future convergence. The labeled-output contract is load-bearing: no later change may collapse the two onto one button without clearing the bar.

**Source:** Winston, on the operator fork in the packet.

---

## D-23: Undo is a client-side bounded history stack over the blocks array, not server-side block-version snapshots

**Date:** 2026-06-27
**Spec:** 005-editor-fidelity-and-undo
**Status:** active

`BlockEditor` keeps a bounded in-memory stack of prior block states. An undo pops the stack, sets `blocks`, and re-persists through the existing debounced `saveBlock` path. The stack is session-scoped and capped; it is not durable across reloads. Durable recovery at the manual level already exists through the D-8 promotion backup and the D-7 recipe.

**Alternatives considered:**

- **Server-side block-version snapshots (a versions table per block edit).** Durable and multi-session, but heavy: a new table, a write on every 500ms autosave, and a retention policy, to solve a single-session "I just made a mistake" need.
- **No undo; rely on autosave conflict handling.** The existing 409 path (T-046) handles concurrent editors, not self-inflicted mistakes. It does not recover a wrong delete.

**Why this won:** the mistake undo addresses is in-session and in-memory, so the cheapest correct home is the in-memory array the editor already holds. It reuses the existing save path, adds no schema, and stays reversible. Server-side versioning pays durable-storage cost for an ephemeral need and would couple undo to the autosave write rate. The manual-level safety net (backup plus recipe) already covers the durable case.

**Implications downstream:** undo must capture state at every `setBlocks` mutation site (content edit, reorder, add, delete, split column) for coverage to be honest; a missed site is an un-undoable action. The stack cap bounds memory. Delete recovery requires soft-delete so the row still exists to restore. No new server contract beyond the soft-delete flag.

**Source:** Winston, against the existing autosave and service-role write path.

---

## D-24: In-place image replacement on reconstructed figures writes both the block row and the recipe figure-to-asset map

**Date:** 2026-06-27
**Spec:** 005-editor-fidelity-and-undo
**Status:** active

`CaptionedFigureBlock` (and figures nested in column cells) gains the same upload affordance `ImageBlock` and `ImageRowBlock` already carry: drop, paste, or click to `/api/manuals/upload`, swapping `content.src`. Because D-7 makes staging a pure function of canon plus recipe, the swap is ALSO recorded in the per-manual recipe's figure-to-asset mapping, keyed by the same stable (page index, block ordinal) anchor. The DB write makes the change live now; the recipe write makes it survive a reconstruction re-run.

**Alternatives considered:**

- **Write only the block row.** Simplest, and it matches the plain `image` block path. But a reconstruction re-run recomputes `map(extract(canon), recipe)` and clobbers any `src` not in the recipe. Silent loss of the teacher's replacement.
- **Block re-runs once a figure has been hand-replaced.** Rejected; it freezes the manual against every future general-rule improvement to protect one asset swap, inverting D-13.

**Why this won:** D-7 already designates the recipe as the single authority of human intent, and an image replacement IS human intent. Routing the swap through the recipe keeps the pipeline idempotent and keeps the correction durable across re-runs, exactly as text corrections already are. Writing only the row reintroduces the input-equals-output hazard D-7 was built to remove.

**Implications downstream:** the upload handler (or a thin server step behind it) gains a recipe-write for reconstructed figures; plain `image` blocks, which have no recipe anchor, keep the row-only path. The recipe stays the place a re-run reads, so prod and a fresh staging cannot diverge on a swapped asset. A human-replaced figure carries the D-12 audit human-touch marker so the D-18 promotion precheck passes it forward.

**Source:** Winston, with D-7 (recipe authority) and D-13 (general rule over per-page patch), on Custodian's recipe-clobber hazard.

---

## D-25: The figure-size defect is corrected at column-band detection as a general rule, never in the renderer

**Date:** 2026-06-27
**Spec:** 005-editor-fidelity-and-undo (extends D-13, D-16)
**Status:** active

The "blue rose renders large between two tan rectangles" defect is a reconstruction-layout error, not a rendering error. A lone small centered ornament was wrapped into an N-column band by the D-16 column detection, so the renderer's correct rule `renderBlock(child, { fill: true })` overrides the figure's real `width_pct` (about 4 percent) to fill its wide cell, and the empty sibling cells paint as the tan side panels. The fix tightens the D-16 / D-13 column guard so a single small centered figure with no real column siblings does not form a column band; it then renders at its `width_pct` with no flanking cells. The fix is expressed as a deterministic rule over the geometry and is verified to hold across the corpus, per D-13.

**Alternatives considered:**

- **Clamp figure width in `CaptionedFigureBlock` when it looks too large.** Rejected; a renderer clamp is a per-symptom patch that hides the bad wrap and violates D-13. The block would still be structurally a column band.
- **Per-page recipe override to un-wrap this ornament.** Rejected; the recipe is for human curation, not for working around a general-parser defect. A page-specific un-wrap does not scale to the corpus.

**Why this won:** the column band is whitespace in the geometry, read by D-16; if the read is wrong, the read is the bug. Correcting the guard fixes every ornament the same way and keeps `fill: true` correct for genuine columns. A renderer clamp or a recipe patch would leave the defect in the blocks and only mask it on one surface, which is the exact failure D-13 names.

**Implications downstream:** the editor figure-size complaint and the tan-rectangle complaint both resolve from this one extraction-rule change; no editor or PDF code changes for the size issue. The corrected guard must be regression-checked against the working two-column and three-up pages (D-16) so a real column is still detected.

**Source:** Winston, on the BlockEditor `fill` path and D-16 N-column detection.

---

Last updated 2026-06-27 by spec 005-editor-fidelity-and-undo (D-22 staged two-output PDF, D-23 client undo stack, D-24 recipe-write image replace, D-25 figure-size general rule). D-18 through D-21 from 2026-06-09 spec 004-site-ready-all-manuals; D-17 from 2026-06-01; D-16 same day; D-14/D-15 same day; D-13 from spec 003b; D-11, D-12 from spec 003; D-1 through D-10 earlier. All unchanged.
