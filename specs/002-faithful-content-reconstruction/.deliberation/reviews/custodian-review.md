# Custodian review: Faithful content reconstruction of the Roses OS manuals

Faculty: data integrity, append-only vs mutable semantics, backup and rollback discipline, migration safety, soak-gate integrity. I read db.ts and migrations 0002, 0003, 0004. I did not edit or build.

## 1. What problem is this actually solving

The bricks exist, the content does not. The editor reproduces the DB faithfully, but the DB still holds 86 flat legacy blocks per manual. This spec replaces flat legacy data with v2 blocks that match the curated canon PDF, without ever putting prod manual_blocks at risk. The real problem is a guarded data migration, not a rendering problem.

## 2. The smallest first version that proves the idea

Slice 0: Rose Meditation L1, en only, one full loop. Render to image, extract to draft, map to v2 JSON, write to a STAGING lane, review page by page against the canon image, then promote into a backed-up prod with a rehearsed rollback. The promote step is the part that proves the idea, not the extract step. A Slice 0 that skips backup and rollback proves nothing about safety.

## 3. The three risks that would kill this

R-a Silent prod write during reconstruction. db.ts uses the browser anon client for every write and there is no separate staging Supabase project in code. If staging is realized as a clone manual_id or a reserved language tag inside the SAME table, one wrong manual_id constant points the writer at the 86 live blocks. Staging must be a structurally distinct connection, not a string constant a human can fat-finger.

R-b Promotion that is not transactional. No promote or backup migration exists. 0004 deletes and inserts through separate client calls, not one transaction. A promote that does delete-legacy then insert-v2 across two anon calls can strand a manual with zero blocks if the second call fails.

R-c A re-run clobbering a human correction. The recipe and override file (E4) is the only thing standing between an idempotent re-run and erased curation. If the writer regenerates from canon and overwrites, every page-by-page sign-off is lost.

## 4. Success at 90 days

L1 en promoted to prod and serving, with the legacy 86 blocks preserved in a named backup that an operator can restore in one statement. A re-run of the full pipeline produces byte-identical staging output and touches no overridden field. The 7-day soak has at least one observable that can fail it, not merely elapse. L2, L3, Aura 1 staged. No prod write ever occurred outside a promote migration.

## 5. Atomic tasks

T1 Widen the CHECK to include contents. Acceptance: migration 0005 adds contents, and an insert of a contents row on a fresh DB succeeds.

T2 Build a service-role staging writer separate from db.ts. Acceptance: the writer cannot resolve the prod connection string at all, proven by a unit that fails closed when the staging env var is absent.

T3 Realize staging as a structurally distinct lane. Acceptance: a write to staging is invisible to getBlocks against the prod manual_id.

T4 Write the per-manual recipe and override file with a stable key per page-block. Acceptance: a second pipeline run reports zero diffs on any field marked override.

T5 Backup legacy blocks before promote. Acceptance: a manual_blocks_backup row count equals the live count for that manual_id before any delete runs.

T6 Make promote one transaction. Acceptance: a forced failure mid-promote leaves the prod manual at its pre-promote block set, verified by count and checksum.

T7 Write the rollback procedure as a runnable statement. Acceptance: running rollback after a promote restores the exact pre-promote rows, verified by checksum.

T8 Define one soak observable. Acceptance: the soak fails if the canon-diff harness reports any nonzero page delta during the 7 days, not on time alone.

T9 Reconcile or retire AC10. Acceptance: ARCHITECTURE.md D-5 records the real block count and either retires the 12 ceiling or justifies it.

## 6. The one thing only my faculty noticed

0003 backfills schema_version=1 by merge, so v1 and v2 rows live in the same table keyed only by a JSONB field. A promote that filters on schema_version rather than a separate lane will, on a re-run, either double-insert v2 rows or silently skip them, because nothing enforces uniqueness on manual_id, language, position. There is no unique constraint protecting position. Two reconstruction runs can produce two blocks at position 0 and the editor will render whichever Postgres returns first. The backup must capture position and a content checksum, or rollback restores rows it cannot prove are the originals.
