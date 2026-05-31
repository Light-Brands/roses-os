# Winston review: Faithful content reconstruction

## 1. What problem is this actually solving

The bricks exist; the building does not. Spec 001 shipped 18 v2 primitives and a parser that reads them, and this session proved one page can match canon pixel for pixel. But `manual_blocks` still holds 86 flat legacy rows for L1 alone, and the same for three other manuals. The problem is purely a data problem: move curated canon content into v2 rows without breaking the live read path and without ever corrupting prod. It is a migration of meaning, not a feature.

## 2. The smallest first version that proves the idea

Slice 0, as the seed states, and no smaller: Rose Meditation L1 English, end to end, render then extract then map then stage then review then promote, landing on a staging lane. The loop is the deliverable, not the page. A single hand-built page proves the editor (already done); it does not prove the pipeline. The proof is that a re-run after a human correction loses nothing and the promotion is reversible. If those two properties hold on one manual, scale is bookkeeping.

## 3. The three risks that would kill this if ignored

One: the write path. `db.ts` uses the browser anon client only. A bulk staging writer through the anon key either fails on RLS or runs unaudited under whatever policy is loosest. No server path means no safe pipeline.

Two: idempotency collapse. If the override file is not the single source of human intent, a second pipeline run silently reverts a reviewer's correction. That destroys trust in the loop and the work stops.

Three: staging realized as a fake. If "staging" is a reserved language tag or a flag on the same rows, a promotion bug writes prod. Isolation has to be structural, not conventional.

## 4. What success looks like at 90 days

All four manuals reconstructed in English on staging, each having passed page-by-page review and a 7-day soak, each promoted to prod with a backed-up legacy snapshot and a tested rollback. Every prod read still parses (zero new `unknown` fallbacks introduced by reconstruction). The per-manual recipe files are checked in and a re-run reproduces the approved state byte for byte. Locales remain plumbing only; no invented translations exist.

## 5. Atomic tasks (each at most one day, each with a verifiable acceptance)

1. P0 commit the capability locally on the branch. AC: `git log` shows the Section-1 files committed, scratch excluded, `pnpm type-check` clean.
2. P1 migration 0003 adds `contents` to the CHECK. AC: re-run migration, insert a `contents` row, it succeeds.
3. P2 confirm parser reads a v2 `contents` row. AC: `parseManualBlock` returns ok for a `contents` fixture.
4. Server-side service-role write module (`db.admin.ts`). AC: a script inserts one block server-side; anon path untouched.
5. Staging lane realization (clone manual_id). AC: staging manual id resolves, prod L1 id unchanged, both queryable.
6. Recipe file schema + loader for L1. AC: loader parses `recipes/rose-l1.yaml`, round-trips with no field loss.
7. E1 canon renderer to per-page images for L1. AC: 13 page PNGs land in a build dir.
8. E2 page-to-draft extractor for L1. AC: each page yields draft block JSON validated by Zod.
9. E3 mapper merges draft plus recipe overrides into v2 rows. AC: override wins over draft on a seeded conflict.
10. E5 staging writer bulk-inserts L1 to the staging lane idempotently. AC: two runs yield identical staging rows; corrections survive.
11. R1 side-by-side review route. AC: route shows canon image beside rendered staging page per page.
12. R4 promotion migration with legacy backup and rollback. AC: dry-run promotes L1, rollback restores legacy exactly.
13. Retire AC10 formally in the spec ledger. AC: spec records the 18-type reality and the reason the 12-ceiling died.

## 6. The one thing only my faculty would have noticed

Idempotency and promotion are in tension and the seed treats them as separate items. The override file is the authority for staging, but promotion copies staging into prod, and after promotion a re-run regenerates staging from canon plus overrides. If promotion does not also re-derive from the same overrides, prod and a fresh staging diverge silently. The override file, not the staging rows, must be the thing promotion is defined against. Otherwise staging becomes a second source of truth and the no-lost-corrections guarantee is a coincidence, not a property.
