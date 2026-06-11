# Amelia review — roses-os site-ready

I read the engine, the four pipeline drivers, the staging module, and the schema. Notes are grounded in those files, not the framing.

## 1. What problem is this actually solving
Three manuals (L2, L3, Aura) are still English text wearing locale labels, and only L1 EN is reconstructed and staged. The site looks multilingual and rebuilt; it is neither. This run makes the staging lane the true source for every manual in every language, verified, so Dario's manual promotion is the only remaining step.

## 2. Smallest first version that proves the idea
L2 EN reconstructed via the generalized `--manual` driver, staged, then L2 pt machine-translated through `extract -> MT -> stage-translation`, verified in the editor at the staging manual_id. That single slice exercises every new seam: driver generalization, the MT contract, the staging join. If L2 pt renders clean, the rest is repetition plus L3's unknown geometry.

## 3. Three risks that would kill this
- **L3 geometry is unprobed.** Tables, glossary, footnotes have no block type and no rule. Committing a block-type decision before driving pdf.js over L3 violates D-13 and burns the run. Probe first, decide D-18 from evidence.
- **Service-key fail-closed in `stage-reconstruction.ts`.** It hard-exits without `SUPABASE_SERVICE_ROLE_KEY` (lines 73-76). The packet says the run uses anon only. A headless run staging EN reconstruction will die at the first manual unless this is reconciled (see Q6).
- **MT silent-drop.** `stage-translation.ts` keeps source text on any missing `idx` (line 117). An MT call that returns short, mis-indexed, or partial output stages English under a foreign locale and passes validation. Needs a coverage assert.

## 4. Success at 90 days
All four manuals reconstructed EN in staging; L2/L3/Aura staged in all six languages; el/ru/uk marked held-for-native-review; en/es/pt promotable. #596/#597/#598 closed. Promotion script tested staging->staging, never run on prod.

## 5. Atomic tasks, dependency-ordered

**Reconstruction EN**
1. Commit the uncommitted L1 baseline. *Accept: `git status` clean on the worktree branch.*
2. Generalize the driver to `--manual <slug> --lang <lang>` (paths, RUN_ID, MANUAL, LANG, page count from PDF, prod uuid lookup by slug). *Accept: `npx tsx scripts/reconstruct-geometry.ts --manual rose-meditation-level-2` writes `editor-blocks.json` under an L2 out dir.*
3. Reconcile the staging key path so EN reconstruction stages on the run's key (see Q6). *Accept: `scripts/stage-reconstruction.ts --manual rose-meditation-level-2 --dry-run` prints a block distribution with no service-key exit.*
4. Stage L2/Aura EN. *Accept: stager prints non-zero block count for each `__staging` lane.*
5. Probe L3 geometry; record D-18. *Accept: a `docs/canon/l3-geometry-probe.md` naming what table/footnote/glossary structure is recoverable.*
6. Reconstruct + stage L3 EN per D-18. *Accept: L3 staging lane holds blocks, `verify-classify-map.ts` green.*

**Translation**
7. Wire an MT step: `source.json` -> `translations.<lang>.json` of `[{idx,text}]` via Gemini, html-kind preserved. *Accept: `scripts/translate.ts --manual ... --to pt` writes a file whose length equals `source.json` strings length.*
8. Add MT coverage assert (no untranslated `idx`). *Accept: stager warns/exits when missing > 0.*
9. Run extract+MT+stage for L2/L3/Aura x pt/el/ru/uk. *Accept: each `__staging` lane shows the target-language block count, 0 residual EN sampled.*
10. Mark el/ru/uk held-for-native-review (see Q6). *Accept: a query filters held rows by the agreed marker.*

**Promotion + cierre**
11. Build `promote.ts` (one txn, child-ref remap, `--dry-run`, per manual+lang, signer check). *Accept: `--dry-run` staging->staging prints the row delta, no prod write.*
12. Full verify sweep + close #596/#597/#598. *Accept: `verify-extract-geometry.ts` and `verify-classify-map.ts` green; three issues closed.*

## 6. The one thing only my faculty noticed
The packet's "anon key only, no service token" contract contradicts the code. `stage-reconstruction.ts` requires the service role and fails closed; only `stage-translation.ts` uses anon. EN reconstruction staging is service-role today. Either the reconstruction stager gets an anon path (RLS already allows it, the policy is `USING(true)`) or the contract is wrong. Pick one before task 3, or the headless run halts on manual one. Separately: there is no review-status column; held-for-native-review has nothing to ride but `run_id`. Riding `run_id` is zero-migration but overloads provenance; a one-line `ADD COLUMN IF NOT EXISTS review_status text` is cleaner and re-runnable. Decide this in the spec, not at stage time.
