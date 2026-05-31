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

---

Last updated 2026-05-31 by spec 002-faithful-content-reconstruction (added D-5 through D-10, update mode). D-1 through D-4 unchanged.
