# Mary: Business Analyst review

Run: faithful-content-reconstruction-20260531-014843. Spec: 002-faithful-content-reconstruction.

## 1. What problem is this actually solving

The stated problem is "rebuild every page into v2 primitives." The real problem is narrower and sharper: the editor can already reproduce a canon page pixel-faithfully, but the database still holds flat legacy blocks, so readers see run-on text where the canon shows a designed page. The bricks exist; the content was never rebuilt. So this is not a build problem, it is a data-migration problem with a human-curation step. The job is to get curated v2 content into the database safely, page by page, without ever breaking prod, and without losing a human correction on re-run.

## 2. The smallest first version that proves the idea

Slice 0: Rose Meditation L1, English, one manual, end to end, render to extract to map to staging to review to promote, landing on a staging manual only. Inside Slice 0 the smallest proving unit is one page, the contents page already proven this session, reconstructed not by hand but by the pipeline, then diffed against the canon image and signed off through the override file. If one page survives a re-run with a human edit intact, the idea is proven. Everything else is scale.

## 3. Three risks that would kill this if ignored

- Prod write path. The seed never resolves the write seam. db.ts writes only through the browser anon client. A bulk staging writer needs a server-side service-role path that does not exist yet. If that is not built first, the pipeline cannot write at all.
- Staging realization is undefined. Clone manual_id, reserved language tag, separate schema_version lane, or separate Supabase project each have different blast radius and different promotion shape. Picking late forces rework of E5 and R4.
- Idempotency on re-run. If the override file is not the single source of human corrections, a second run silently reverts curation. This is the constraint the operator named first, and it is the easiest to get wrong.

## 4. Success at 90 days

All four manuals reconstructed in English on staging, each page signed off against its canon image. Rose Meditation L1 has cleared the 7-day soak and been promoted to prod transactionally with a legacy backup and a working rollback. Re-running any manual's pipeline produces zero loss of human corrections. AC10's 12-block ceiling is formally retired with a recorded reason. Locales pt, es, el, ru, uk remain explicitly deferred, gated on translated canon, with no invented translations.

## 5. Atomic task decomposition

- P0 Commit capability locally. AC: git log on the branch shows the Section-1 files committed, scratch excluded.
- P1 Widen CHECK constraint. AC: migration 0003 lists all 18 types including contents; an insert of a contents block on staging succeeds.
- P1b Reconcile AC10. AC: spec records AC10 retired with the real block count and reason.
- P2 Confirm parser backward-compat. AC: parseManualBlocks over the 86 L1 legacy rows returns zero unknown fallbacks.
- P3 Choose and document staging realization. AC: ARCHITECTURE.md D-5 names the staging mechanism and its isolation boundary.
- P3b Build server-side admin write path. AC: a service-role writer inserts a block to a staging manual without the browser client.
- E1 Canon page renderer. AC: each L1 canon page emits one PNG via puppeteer plus system Chrome.
- E2 Page to draft extractor. AC: one L1 page yields registry-shaped block JSON.
- E3 Mapper and validator. AC: draft JSON passes validateBlockInput or is flagged, never silently dropped.
- E4 Per-manual recipe and override file. AC: a checked-in YAML holds L1 TOC collapses and one human correction.
- E5 Staging writer. AC: a full L1 page lands on the staging manual at correct position with schema_version 2.
- R1 Side-by-side review harness. AC: route shows canon image beside rendered reconstruction per page.
- R2 Review loop to override. AC: a sign-off and a correction both persist into E4 and survive a re-run.
- R3 Asset reconciliation. AC: every L1 figure maps to a repo asset or is flagged missing with alt text.
- R4 Promotion migration. AC: staging to prod runs transactionally with legacy backup and a tested rollback.

## 6. The one thing only my faculty would have noticed

The seed treats P0 through P3 as a flat prerequisite list, but two of them, the missing server-side write path and the undefined staging mechanism, are not chores, they are unspecified requirements wearing a checkbox. Every E and R task silently depends on both. Until P3 and P3b are decided, E5 and R4 cannot be specified at all, so they belong on the critical path before any extraction work, not beside it.
