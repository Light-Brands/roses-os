# Custodian review — roses-os site-ready

Compliance and audit faculty. Weighted to data shape, provenance, and what a destructive write does to history.

## 1. What problem is this solving

Four manuals must reach the editor in six languages with auditable provenance, staged for review, then promoted to live by a human. The real problem is not extraction. It is making every promoted row carry a trustworthy signer and source page so prod content can be traced back to the canon it came from.

## 2. Smallest first version

Drive the reconstruction script with `--manual` for L2 EN into its staging lane and verify the lane holds the blocks with `source_page` and `run_id` set. That alone proves the engine, the lane isolation, and the provenance columns end to end without touching prod.

## 3. Three risks that would kill this

- The promotion script is a delete-then-insert against live client rows. If the insert fails after the delete, the live locale is empty and there is no rollback. This is the single highest-severity gap.
- The "held for native review" marker has no column. Carrying it informally loses it.
- L3 tables, glossary, footnotes have no block type. Forcing them into the 18 shapes corrupts content silently.

## 4. Success at 90 days

Every prod manual_blocks row in a promoted locale carries a non-empty `updated_by` and a `source_page`. A promotion that half-fails leaves the prior live rows intact, not a mixed state. el/ru/uk are queryable as still-held, by a real predicate.

## 5. Atomic tasks (mapped to cohorts)

Reconstruction EN: (T1) generalize the driver to `--manual`; (T2) stage L2/L3/Aura EN; (T3) probe L3 geometry before any new block-type decision.
Translation: (T4) wire the MT call to the source.json -> translations.lang.json contract; (T5) stage pt for L2/L3/Aura; (T6) stage el/ru/uk carrying the held marker; (T7) verify zero residual EN per lane.
Promotion + cierre: (T8) write the promotion as ONE server-side transaction (RPC, like reorder_blocks_atomic) that deletes the prod (manual,language) slot and inserts the staged rows in the same txn, so a mid-flight failure rolls back to the prior live rows; (T9) add the child-ref remap inside that txn; (T10) add a hard NOT-NULL check that every promoted row has a non-empty `updated_by`, refusing the batch otherwise; (T11) `--dry-run` and per manual+language granularity.

## 6. The one thing only my faculty noticed

The held-for-native-review marker has nowhere to live. manual_blocks has language, position, updated_by, source_page, run_id. No status. Adding a column is DDL, which needs a service token, which is a human gate the headless anon-key run cannot cross. So the marker must be a non-DDL signal. The clean choice is the existing run_id: stamp el/ru/uk with a run_id like `translate-<manual>-<lang>-HELD`, and the provenance sidecar already records signer and run per block, so "held" becomes a queryable predicate with zero schema change. Do not invent a status column in this run.

Two grounded data-shape facts. First, the promotion must be ONE transaction. The staging scripts already show the unsafe pattern: stage-translation deletes the lane then inserts in two separate anon calls. On prod that ordering is data loss on failure. Promotion needs reorder_blocks_atomic-style server-side atomicity. Second, the UNIQUE(manual_id, language, position) from 0006 means promotion cannot insert while old rows occupy the same positions. Same-txn delete-then-insert respects it; the staging scripts already renumber by carrying position straight through, so the key holds as long as positions stay dense and unique per lane.

The promotion NOT-NULL on signer is a real audit check, not a content-schema concern. Enforce it on `updated_by` in the txn, not in Zod.
