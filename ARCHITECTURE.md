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

---

Last updated 2026-05-31 by spec 003-deterministic-extraction-geometry (added D-11, D-12, update mode). D-1 through D-10 unchanged.
