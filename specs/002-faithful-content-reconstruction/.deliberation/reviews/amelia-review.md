# Amelia review: Faithful content reconstruction

## 1. What problem is this actually solving

The bricks exist; the wall was never rebuilt. The 18-type registry in `src/lib/manuals/block-registry.ts` and the Zod union in `block-schema.ts` can already reproduce a canon page, proven at `_fidelity-proof-v4.png`. The DB still holds flat legacy rows (L1 = 86 of them, its TOC a single `text` block with a `<ul>`). So the real problem is a one-time, page-by-page data migration of curated content from PDF into v2 block JSON, done safely against prod and without losing human corrections on re-run. This is a data pipeline problem with a verification gate, not a feature problem.

## 2. Smallest first version that proves the idea

Slice-0: Rose Meditation L1 (`afd5453c-...`), en only, end to end, into a staging lane (not prod). The thinnest honest proof is one already-proven page (the contents page) re-derived through the full E1 to E5 pipeline rather than hand-built, then diffed by the R1 harness, then promoted to staging. If the contents page that we know is reproducible survives the automated render to extract to map to validate to stage to diff loop, the loop is real. Everything else is scaling.

## 3. Three risks that would kill this

- **The write path does not exist.** `db.ts` `createBlock`/`updateBlock` go through `@/lib/supabase/client`, the anon browser client. Bulk-writing hundreds of staging rows from a Node script needs a service-role server client, which is not in the repo. Build it wrong and you either cannot write at all or you write with anon RLS gaps.
- **Vision extraction cost and drift.** A per-page LLM layout pass on ~16 pages per manual times 4 manuals is roughly 60-plus vision calls per full run, each re-run paying again. Failure modes: hallucinated rows, dropped figures, page-number invention, non-determinism between runs that the override file must absorb. Without idempotency keyed on canon page, every re-run re-litigates corrections.
- **No test suite means no automatic gate.** `pnpm test` exits 0. If "passes" is not defined as a concrete `canon-diff` threshold plus human sign-off, "faithful" is opinion, and a bad reconstruction promotes silently.

## 4. Success at 90 days

All 4 manuals, en, reconstructed into v2 blocks living on the staging lane, each page signed off against its canon image through the R1 harness, each manual having cleared the 7-day soak, and at least L1 promoted to prod transactionally with legacy rows backed up and a tested rollback. Re-running the pipeline reproduces identical blocks except where an override file deliberately overrides. pt/es/el/ru/uk remain plumbing-only, untranslated.

## 5. Atomic tasks (each <= 1 day, with verifiable acceptance)

1. **Add `contents` to the CHECK migration.** New `supabase/migrations/0005_*.sql` widens `manual_blocks_block_type_check` to 18 types; `SELECT pg_get_constraintdef` lists `contents`.
2. **Retire or document AC10.** `specs/002-.../spec.md` states the 12-ceiling is void and names the real count 18 from `block-registry.ts`.
3. **Build the service-role write client.** New `src/lib/supabase/admin.ts` reads `SUPABASE_SERVICE_ROLE_KEY`; a smoke insert lands one staging row.
4. **Decide and implement the staging lane (D-5).** `ARCHITECTURE.md` gains D-5 naming the realization (clone manual_id vs reserved language tag); `getBlocks` returns staging rows for it.
5. **E1 canon page renderer.** `scripts/render-canon.ts` writes one PNG per page of `docs/canon/Rose Meditation Level 1.pdf` via puppeteer-core + system Chrome.
6. **E2 page-to-draft extractor.** `scripts/extract-page.ts` emits draft block JSON for one page; output is a JSON array.
7. **E3 mapper plus validator.** `scripts/map-blocks.ts` runs each draft through `validateBlockInput` from `block-schema.ts`; invalid rows are rejected with the named-error envelope, count printed.
8. **E4 per-manual recipe file.** `recipes/rose-meditation-level-1.en.yaml` checked in; captures the TOC collapse and page-template config; re-run reads it.
9. **E5 staging writer.** `scripts/write-staging.ts` inserts validated blocks via the admin client with `schema_version: 2` and correct `position`; row count matches draft.
10. **Idempotency key.** Writer upserts keyed on (manual, canon-page, position); a second run changes zero rows, verified by diff count 0.
11. **R1 diff gate from canon-diff.** Extend `scripts/canon-diff.ts` to diff rendered staging vs canon image; exit non-zero above a pixel-delta threshold.
12. **R4 promotion migration.** `scripts/promote.ts` copies staging to prod in a transaction, backs up legacy rows to a table, prints rollback SQL.

## 6. The one thing only my faculty would notice

`block-parser.ts` is the read path and degrades to `unknown`; it never rejects. The actual write guard is `validateBlockInput` (`block-schema.ts:233`), which the staging writer must call on every block, because the CHECK constraint only guards `block_type`, not the JSONB shape. A draft that passes the CHECK but violates the Zod union will insert into staging silently and only surface as an `unknown` fallback at render. The pipeline must treat `validateBlockInput` as the hard gate before any insert, not the CHECK.
