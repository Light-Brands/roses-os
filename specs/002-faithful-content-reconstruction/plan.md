---
slug: 002-faithful-content-reconstruction
title: Plan for faithful content reconstruction of the Roses OS manuals
created: 2026-05-31
run_id: faithful-content-reconstruction-20260531-014843
---

# Plan

## Architecture sketch

Reconstruction is a one-directional pipeline. It turns curated canon PDFs into v2 `manual_blocks` rows on a structurally isolated staging lane, holds them for human review and a 7-day soak, then promotes them to production under a single reversible transaction. The read path is untouched. Human intent lives in checked-in recipe files, which are the authority the pipeline re-derives from on every run, so idempotency is a property and not a hope.

```
docs/canon/<manual>.pdf
        |
   (E1) render to per-page PNG  ........ puppeteer-core + system Chrome
        |
   (E2) extract page to draft JSON ..... vision pass, cached by page-image hash
        |
   (E3) map + validate ................. validateBlockInput is the hard gate (D-1)
        |          ^
        |          |  recipes/<manual>.<lang>.yaml  (E4, D-7: authority of intent)
        |          |
   (E5) write to staging lane .......... db.admin bulkUpsert (D-6) to cloned manual_id (D-5)
        |
   (R1) side-by-side + canon-diff + prose diff
   (R2) human page sign-off -> recipe
   (R3) asset reconciliation
        |
   (soak: 7 days, canon-diff must stay zero-delta)
        |
   (R4) promote: snapshot legacy -> replace -> commit, one transaction (D-8), rollback ready
        |
   prod manual_id  (unchanged until this last step)
```

The seam this spec resolves is that the existing write path is browser-anon only, and there is no isolation or promotion concept yet. Decisions D-5 through D-10 in `ARCHITECTURE.md` close that seam.

## Sequencing

Milestone cohorts are sized at most 10 children each so `/develop` drains one cohort per session honestly. The arc is the whole problem; Slice 0 (Level 1 English end to end) is proven through M0 to M4 before M5 scales to the remaining manuals.

| Milestone | Theme | Tasks | Covers surfaces | Rough effort |
|---|---|---|---|---|
| M0 | Floor: prerequisites, isolation, integrity | T-001 to T-007 | S1, S2, S3, S4 | 2 to 3 days |
| M1 | Extraction engine on Level 1 | T-008 to T-013 | S5, S6, S8 | 3 to 4 days |
| M2 | Staging write and idempotency | T-014 to T-017 | S6, S7 | 2 to 3 days |
| M3 | Review harness and fidelity gate | T-018 to T-023 | S9, S10 | 3 to 4 days |
| M4 | Promotion and soak for Level 1 | T-024 to T-029 | S11, S12 | 3 to 4 days |
| M5 | Scale to Level 2, Level 3, Aura 1 | T-030 to T-034 | S13 | 4 to 6 days |

### M0: Floor (covers S1, S2, S3, S4)

- T-001 Commit the spec 001 capability locally on the branch. AC: `git log` shows the Section-1 capability files committed, scratch excluded, `pnpm type-check` clean.
- T-002 Widen the CHECK to include `contents`. AC: new migration lists all 18 types; a `contents` insert succeeds on a fresh database (AC1).
- T-003 Confirm parser backward-compat. AC: `parseManualBlocks` over the 86 Level 1 legacy rows returns zero `unknown` fallbacks; a `contents` fixture returns ok (AC3).
- T-004 Build the server-side service-role write module. AC: a script inserts one staging block server-side; the module fails closed when the staging env var is absent; the key is not bundled to the client (AC4).
- T-005 Realize the staging lane as a cloned manual_id. AC: a staging write is invisible to `getBlocks(prodId, 'en')`; the prod row set is unchanged (AC5).
- T-006 Add the unique constraint on `(manual_id, language, position)`. AC: a duplicate-position insert is rejected by the database (AC2).
- T-007 Retire AC10 formally. AC: `ARCHITECTURE.md` D-9 records the 18-type reality and the reason the 12-ceiling died (AC21). Human-review.

### M1: Extraction engine on Level 1 (covers S5, S6, S8)

- T-008 E1 canon page renderer. AC: one PNG per Level 1 canon page lands in a build dir via puppeteer-core plus system Chrome (AC7).
- T-009 E2 page-to-draft extractor with per-page cache. AC: a Level 1 page yields draft block JSON; a re-run on an unchanged page hits the cache and does not re-call the model (AC8, OQ3).
- T-010 E3 mapper and validator. AC: every draft block runs through `validateBlockInput`; invalid blocks are rejected with the named-error envelope, never silently dropped (AC6).
- T-011 E4 recipe schema and loader for Level 1. AC: `recipes/rose-meditation-level-1.en.yaml` parses, holds the TOC collapse and page-template config, round-trips with no field loss (AC9).
- T-012 Provenance per block. AC: each reconstructed block carries source canon page, extraction run id, and a signer field (AC11).
- T-013 Hard locale guard. AC: a run targeting a no-canon locale exits non-zero before any write (AC19).

### M2: Staging write and idempotency (covers S6, S7)

- T-014 E5 staging writer. AC: validated Level 1 blocks land on the staging lane via the admin client with `schema_version: 2` and correct position (AC5, AC6).
- T-015 Idempotency: pipeline is a pure function of canon plus recipe. AC: two consecutive full runs produce identical staging rows on non-override fields (AC10).
- T-016 Recipe override precedence. AC: a seeded override wins over the extracted draft, and survives a re-run unchanged (AC9).
- T-017 Slice-0 contents-page proof. AC: the already-proven Level 1 contents page, re-derived through the full E1 to E5 pipeline, lands on staging matching the hand-built clone.

### M3: Review harness and fidelity gate (covers S9, S10)

- T-018 R1 side-by-side review route. AC: canon image beside rendered staging page, per page, for Level 1 (AC12).
- T-019 Canon-diff as a real gate. AC: `scripts/canon-diff.ts` diffs rendered staging vs canon image and exits non-zero above a defined pixel-delta threshold (AC13).
- T-020 Word-level prose fidelity diff. AC: the review surface flags every sentence-level divergence from the legacy prose as canon-explained or flagged (AC14). Human-review.
- T-021 R2 review loop to recipe. AC: a page sign-off and a correction both persist into the recipe and survive a re-run (AC9). Human-review on the sign-off.
- T-022 R3 asset reconciliation. AC: every Level 1 figure maps to a repo asset or is flagged missing with alt text (OQ1).
- T-023 Named teacher sign-off gate. AC: promotion refuses to run without a recorded signer who attests faithfulness to the teaching (AC15). Human-review.

### M4: Promotion and soak for Level 1 (covers S11, S12)

- T-024 Backup migration with checksum. AC: `manual_blocks_backup` captures every legacy row including position and a content checksum; backup row count equals the live count before any delete (AC16, AC17).
- T-025 Transactional promotion. AC: snapshot then delete then insert runs in one Postgres transaction; a forced mid-promotion failure leaves prod at its pre-promotion block set (AC16).
- T-026 Rollback procedure. AC: running rollback after a promote restores the exact pre-promote rows, verified by checksum (AC16).
- T-027 Immutable legacy preservation. AC: the backup has no prune path; Level 1 legacy prose is recoverable verbatim after promotion (AC17).
- T-028 Soak observable. AC: the soak fails if canon-diff reports any nonzero page delta during the 7 days, not on elapsed time alone; intentional content changes surface to a human (AC18). Partly human-review.
- T-029 Slice-0 promotion dry-run. AC: Level 1 promotes in a dry run and rollback restores legacy exactly, before any real prod write (AC20).

### M5: Scale to the remaining manuals (covers S13)

- T-030 Reconstruct Rose Meditation Level 2 (en) to staging. AC: every Level 2 page signed off against its canon image on staging.
- T-031 Reconstruct Rose Meditation Level 3 (en) to staging. AC: every Level 3 page signed off, including the table, footnote, and glossary canon patterns the registry now carries.
- T-032 Reconstruct Aura 1 (en) to staging. AC: every Aura 1 page signed off against its canon image on staging.
- T-033 Promote each soaked manual to prod. AC: each manual promotes transactionally with legacy backup and a tested rollback, gated per-manual on its soak and signer (AC16).
- T-034 Locale plumbing verification. AC: pt, es, el, ru, uk carry the locale-gap indicator, hold zero generated text, and the hard guard is verified per manual (AC19).

## Risks

| Risk | Mitigation |
|---|---|
| The bulk write path does not exist (db.ts is anon-browser only). | T-004 builds a server-side service-role module (D-6) before any extraction work; it fails closed without its env var. |
| Staging realized as a string-constant fake, one filter bug from a prod write. | T-005 realizes staging as a structurally distinct cloned manual_id (D-5); AC5 proves a staging write is invisible to a prod read. |
| A re-run silently reverts a human correction. | T-015 makes the pipeline a pure function of canon plus recipe (D-7); the recipe, not a DB row, is the authority; AC10 proves byte-identical re-runs. |
| Two runs strand two blocks at the same position (no unique constraint today). | T-006 adds the unique constraint on (manual_id, language, position); AC2 proves the duplicate is rejected. |
| Fidelity claimed by eye, never measured. | T-019 makes canon-diff a build-failing oracle; T-020 adds a prose diff; "exactly" is named as a human sign-off, not a byte guarantee (Mar'ah). |
| Meaning drift the pixel diff cannot catch. | T-020 prose diff plus T-023 named-teacher sign-off; promotion blocks without a signer who knows the teaching (Edut). |
| Irreversible loss of the original author's words. | T-024 plus T-027: the backup captures full prose with checksum and has no prune path. |
| Invented translations for no-canon locales. | T-013 hard guard exits non-zero before any write to a locale with no translated canon. |
| Vision extraction cost on re-runs (60-plus calls per full run). | T-009 caches extraction JSON per canon page keyed by image hash; re-runs only re-call changed pages (OQ3). |
| Promotion half-applies and strands a manual at zero blocks. | T-025 wraps snapshot, delete, insert in one transaction; a forced failure leaves prod untouched (D-8). |

## Dependencies

- Spec 001 capability (block primitives, registry, parser, schema) committed locally (T-001). This is the floor.
- `SUPABASE_SERVICE_ROLE_KEY` available to the pipeline environment for the admin write module (T-004).
- System Chrome at the known path plus `puppeteer-core` for the renderer (present this session).
- The four canon PDFs at `docs/canon/` (present) and `docs/canon/patterns.yaml` for the block-pattern mapping.
- A named human signer who knows the teaching, for the promotion gate (OQ4, Dario).

## Cost-shaped considerations

- Vision extraction is the only recurring spend. A full four-manual run is roughly 60-plus vision calls; the per-page cache (T-009) bounds re-run cost to changed pages only. Measure per-page cost during Slice 0 before deciding automation depth for M5.
- Human review time is the real throughput limit, not compute. Page-by-page sign-off across four manuals is the long pole; the recipe file makes that time reusable across re-runs.

## Strict-local note

This spec runs offline. No GitHub issues, no push, no PR. `/develop` consumes it from the local spec path. No acceptance criterion depends on a merged main; the verification path is the worktree, the local staging lane, and the canon-diff harness (Section G of genesis-spec).
