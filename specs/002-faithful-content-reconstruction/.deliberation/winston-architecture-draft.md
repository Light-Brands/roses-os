# ARCHITECTURE-AUTHOR ADDENDUM: mode: update

Spec: 002-faithful-content-reconstruction. Author: Winston. Read ARCHITECTURE.md first; D-1 through D-4 stand. This addendum emits D-5 through D-9 only. None of D-1 through D-4 is superseded.

## System shape

Reconstruction is a one-directional data pipeline that turns canon PDFs into v2 `manual_blocks` rows on an isolated staging lane, holds them for human review and a soak, then promotes them to prod under a reversible transaction. The read path (D-1 parser) is untouched; the pipeline only writes, and only ever to staging until promotion. Human intent lives in checked-in recipe files, which are the authority the pipeline re-derives from on every run. The seam this spec resolves is that the existing write path is browser-anon only and there is no isolation or promotion concept yet.

| Module | Responsibility | New or existing |
|---|---|---|
| `db.ts` | Browser read/write, anon key | existing, untouched |
| `db.admin.ts` | Server service-role bulk writes to staging | new (D-6) |
| `recipes/<manual>.yaml` | Curation plus human corrections, authority of intent | new (D-7) |
| pipeline scripts E1 to E5 | render, extract, map, write to staging | new |
| staging lane (cloned manual_id) | isolated reconstruction target | new (D-5) |
| promotion migration | backup, swap, rollback | new (D-8) |
| `block-parser.ts` | read path, unknown fallback | existing, untouched |

## Decision log

### D-5: Staging is a cloned manual_id row in the same table and project

**Chosen:** Realize staging as a sibling `manuals` row carrying its own `id`, with reconstructed blocks written under that staging `manual_id`. Prod manual ids stay frozen. `getBlocks(stagingId, 'en')` reads the reconstruction; `getBlocks(prodId, 'en')` reads untouched legacy. Promotion (D-8) moves rows from the staging id to the prod id.

**Alternatives:** (a) reserved language tag, e.g. `en-staging` on the same prod manual_id; (b) a `schema_version` lane reusing the version field as a stage flag; (c) a separate Supabase project.

**Why this won:** isolation is structural. A query that targets the prod id cannot see staging rows, so no promotion bug can leak a draft into a live read. The clone reuses the existing `manual_id + language` index path with zero schema change.

**Why alternatives lost:** the language tag overloads a column whose only writer today is locale, and a single wrong filter writes prod (the fake-staging risk Winston flagged). The schema_version lane corrupts D-1's meaning of that field. A separate Supabase project doubles env, migration, and asset surface for a four-manual job, and makes promotion a cross-project copy with no transaction.

**Downstream:** staging ids are recorded in each recipe file. The review route (R1) and promotion (D-8) both key off the staging id.

**Source:** Winston, with the staging-first constraint from the operator.

### D-6: Bulk writes go through a server-side service-role module, never the browser client

**Chosen:** Add `src/lib/manuals/db.admin.ts` constructed from `@/lib/supabase/server` with the `SUPABASE_SERVICE_ROLE_KEY`. It exposes `bulkUpsertBlocks(manualId, language, rows)` and runs only in pipeline scripts and route handlers, never bundled to the client. `db.ts` is unchanged; the editor keeps the anon path.

**Alternatives:** (a) keep using the anon browser client from a script; (b) a Postgres RPC that takes a block array.

**Why this won:** the anon client is governed by RLS scoped to interactive editing, not hundreds of inserts, and it cannot be trusted to bypass policy safely. A dedicated admin module keeps the service-role key on the server and gives the pipeline one audited entry point.

**Why alternatives lost:** the anon path either fails RLS or runs under an over-broad policy nobody reviewed. An RPC hides the upsert logic in SQL where the recipe-merge model (D-7) cannot reach it cleanly; the merge belongs in TypeScript next to the Zod validators.

**Downstream:** E5 calls `bulkUpsertBlocks` only against the staging id (D-5). The reorder RPC pattern already in `db.ts` is the model for transactional intent, but staging writes do not need SERIALIZABLE because nothing else writes the staging lane.

**Source:** Winston, from the open write-path seam in the packet.

### D-7: The per-manual recipe YAML is the single authority of human intent; the pipeline is a pure function of canon plus recipe

**Chosen:** One checked-in `recipes/<manual>-<lang>.yaml` per manual holds curation decisions (TOC collapses, page-template config, figure-to-asset mapping) and human corrections keyed by a stable per-block anchor (page index plus block ordinal, not a DB id). Each pipeline run computes staging rows as `map(extract(canon), recipe)`. The recipe override always wins over the extracted draft. Re-running never mutates the recipe and never reads existing staging rows as input.

**Alternatives:** (a) corrections written back into staging DB rows directly; (b) a free-form diff/patch file.

**Why this won:** idempotency becomes a property, not a hope. Because staging is a pure output of canon plus recipe, two runs produce identical rows and a human correction survives because it lives in the recipe, not in a row a re-run overwrites. Stable anchors mean an upstream extraction change does not orphan a correction.

**Why alternatives lost:** correcting the DB row makes the row both input and output, so the next run either clobbers the fix or must diff against itself, which is the divergence Winston named. A free-form patch file has no schema and no validation, so a malformed correction fails silently at write time.

**Downstream:** the review loop (R2) records sign-off by appending to the recipe, never by editing staging. Promotion (D-8) is defined against the recipe-derived staging, so prod and a fresh staging cannot diverge.

**Source:** Winston (review prompt 6).

### D-8: Promotion is a single transaction: snapshot legacy, replace, with a tested rollback path

**Chosen:** Promotion runs server-side in one Postgres transaction: copy the prod manual's current rows into a `manual_blocks_backup` table tagged with manual_id and a promotion timestamp, delete the prod rows for that manual and language, insert the staging rows under the prod manual_id, commit. Rollback is a named inverse that restores from the tagged backup. Promotion is gated on review sign-off in the recipe plus the 7-day soak timestamp.

**Alternatives:** (a) per-row upsert without a transaction; (b) swap by renaming the staging manual_id to the prod id.

**Why this won:** all or nothing. A failed promotion leaves prod exactly as it was, and the tagged backup makes rollback a data operation, not a re-run of the whole pipeline.

**Why alternatives lost:** per-row upsert can half-apply and leave a manual in a mixed legacy/v2 state mid-failure. Renaming ids breaks every external reference to the prod id and orphans the staging clone's own identity.

**Downstream:** the backup table is a new migration. Rollback is exercised in a dry run during Slice 0 before any real prod write.

**Source:** Winston, from the prod-data-loss risk row.

### D-9: AC10 block-type ceiling is formally retired; the registry's 18 types are the canon surface

**Chosen:** Record in the spec ledger that AC10 of spec 001 (block-type count under 12) is retired. The 12 figure was an early-M0 estimate; the real canon surface needs 18, and the compile-time completeness guard plus the CHECK constraint are the actual enforcement of the type set. No count ceiling is reinstated.

**Alternatives:** (a) keep AC10 and treat the overage as debt; (b) prune types back under 12.

**Why this won:** the ceiling was a guess that reality exceeded; pretending it holds hides the truth. The registry guard already prevents drift, which is what AC10 was reaching for.

**Why alternatives lost:** keeping a violated AC as live debt rots the ledger. Pruning real, used types to satisfy an estimate is the tail wagging the dog.

**Source:** packet, established facts.

## Conventions

- Pipeline writes target only a staging manual_id (D-5) through `db.admin.ts` (D-6).
- Recipe files are the only place a human correction lives (D-7). Reviewers append; they do not edit DB rows.
- New variants still follow D-2: CHECK widens before TS references it. The `contents` migration (P1) pays the one outstanding instance.
- All written artifacts: plain English, no dashes, no hype.

## Non-goals

- No translations for pt, es, el, ru, uk. Locale work is plumbing-only until translated canon exists.
- No changes to D-3 (TipTap) or the editor surface.
- No automation of human review; the sign-off gate stays human.
- No new Supabase project.

## Open architectural questions

- **Figure-to-asset reconciliation (R3):** are canon figures already in the repo, or must they be extracted from the PDFs and stored? Fallback I would ship: extract per-page raster crops into Supabase storage under a `manuals/<id>/` prefix and reference by URL, flagging any figure with no clean source for human upload.
- **Soak timer location:** where the 7-day soak timestamp is recorded. Fallback: a `promoted_after` field in the recipe set at review sign-off, read by D-8 as the gate; no separate table.
