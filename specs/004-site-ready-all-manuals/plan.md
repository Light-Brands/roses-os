---
slug: 004-site-ready-all-manuals
run_id: roses-os-site-ready-20260609-185905
---

# Plan: Site ready, all manuals

## Architecture sketch

The arc adds no new subsystem. It generalizes four existing pieces and writes one named-but-unbuilt gate. The reconstruction engine in `src/lib/manuals/` is already corpus-general; only its driver is Level-1-bound. See ARCHITECTURE.md D-18 through D-21 for the decision log.

```
canon PDF --> reconstruct-geometry.ts --manual <slug> --> editor-blocks.json
                         |                                        |
              (engine: extract-geometry / layout / classify /     |
               columns / map-to-blocks, unchanged + table rule)   |
                                                                   v
                                              stage-reconstruction.ts (anon --> __staging lane)
                                                                   |
   source.json <-- extract-translatable.ts <-- staged EN          |
        |                                                          |
   translate-mt.ts (Gemini, cache, coverage assert)               |
        |                                                          |
   translations.<lang>.json --> stage-translation.ts (anon --> __staging lane, held marker for el/ru/uk)
                                                                   |
                                                                   v
                              promote.ts (one txn, remap, dry-run, signer check, default-refuse)
                                  tested staging --> staging only; prod is G1 (Dario, later)
```

## Sequencing

| Milestone | Theme | Covers | Rough effort |
| --- | --- | --- | --- |
| M1 | Reconstruction English: driver, anon staging, table type, all four manuals EN staged and verified | S1, S2, S3, S4, S10 (baseline) | 2 to 3 days |
| M2 | Translation: MT producer, coverage assert, cache, es/pt ready, el/ru/uk held | S5, S6 | 1 to 2 days |
| M3 | Promotion and close: promote.ts, review_status migration file, staging-review route, verify and test-feature sweep, commit | S7, S8, S9, S10 | 1 to 2 days |

## Atomic tasks

### M1 Reconstruction English

- T-000 Commit the uncommitted L1 baseline on the worktree branch. autodev. Accept: `git status` clean on the branch. Covers S10.
- T-001 Generalize `reconstruct-l1-geometry.ts` to `reconstruct-geometry.ts --manual <slug> --lang <lang>` (per-manual render-metadata map, page count read from the PDF, prod uuid resolved by slug). autodev. Accept: `npx tsx scripts/reconstruct-geometry.ts --manual rose-meditation-level-2` writes `editor-blocks.json` under an L2 out dir. Covers S1. Depends on T-000.
- T-002 Add an anon staging path to `stage-reconstruction.ts` so EN reconstruction stages into `__staging` via the anon key (RLS policy is USING(true), proven by stage-translation.ts and the editor); drop the service-role hard-exit for the staging lane. autodev. Accept: `scripts/stage-reconstruction.ts --manual rose-meditation-level-2 --dry-run` prints a block distribution with no service-key exit. Covers S2. Depends on T-001.
- T-003 Reconstruct and stage Level 2 EN; save a looked-at screenshot. autodev. Accept: L2 `__staging` lane non-zero block count; screenshot under the run screenshots dir; verify suites green. Covers S4. Depends on T-002.
- T-004 Reconstruct and stage Aura 1 EN; save a looked-at screenshot. autodev. Accept: Aura lane non-zero; screenshot; verify green. Covers S4. Depends on T-002.
- T-005 Add the `table` block type (CHECK, then registry, then TS union, D-2 order) and the deterministic rule from D-19 (>=3 evenly spaced horizontal fill-rects plus >=2 stable x-columns, cell walls from rule x-segments). autodev. Accept: `verify-classify-map.ts` green; a `table` emits on L3 page 9. Covers S3. Depends on T-001.
- T-006 Reconstruct and stage Level 3 EN per D-19 and D-20; save a screenshot. autodev. Accept: L3 lane non-zero; screenshot; verify green. Covers S4. Depends on T-005, T-002.

### M2 Translation

- T-007 Build `scripts/translate-mt.ts`: reads `source.json` strings, calls Gemini, writes `translations.<lang>.json` of {idx,text} aligned by idx, preserves html-kind strings, caches by a hash of the source strings. autodev. Accept: `--to pt` writes a file whose entry count equals source strings count; a re-run with unchanged source makes zero MT calls. Covers S5. Depends on T-003.
- T-008 Add an MT coverage assert: the stager (or translator) exits non-zero when any source idx is missing from the translation file. autodev. Accept: a deliberately short translations file makes `stage-translation.ts` exit non-zero. Covers S5. Depends on T-007.
- T-009 Run extract, MT, and stage for es and pt across L2, L3, Aura (ready to promote). autodev. Accept: each `__staging` lane shows the target-language block count with 0 residual English on a sampled set, no held marker. Covers S6. Depends on T-008.
- T-010 Run extract, MT, and stage for el, ru, uk across L2, L3, Aura with the held-for-native-review marker (run_id convention in the anon run). autodev. Accept: a query returns exactly the el/ru/uk rows filtered by the marker. Covers S6. Depends on T-008.

### M3 Promotion and close

- T-011 Write `scripts/promote.ts`: one transaction (snapshot to backup, delete target, insert source under target manual_id), child-ref remap inside the insert, `--dry-run`, per `--manual` and `--language`, signer not-null precheck, refuses held rows, default-refuses without `--confirm`, holds no prod manual id in the headless path. autodev. Accept: `--dry-run` staging-to-staging prints the row delta with no write; no-confirm run refuses. Covers S7. Depends on T-009.
- T-012 Write `supabase/migrations/0008_review_status_and_promote_rpc.sql` (ADD COLUMN IF NOT EXISTS review_status, plus the promotion RPC) as a file only; not applied in the run. autodev. Accept: the SQL file exists and parses. Covers S7. Depends on T-011.
- T-013 Add a staging-review route: a direct path to a `__staging` lane in the editor with the PIN injected (getManuals filters `__staging` out of the reader list). autodev. Accept: opening `/manuals/<staging-id>` after PIN inject renders the staged blocks. Covers S8. Depends on T-003.
- T-014 Run the /test-feature sweep over the editor and reconstruction; fix any reds. autodev. Accept: `node scripts/_editor-qa.cjs` all green; results doc under `_qie/core/data/`. Covers S9. Depends on T-013, T-006.
- T-015 Collect the per-manual visual-verification screenshots and assert no reconstructed manual closes on a data-only claim (the spec 003 AC10 gate). human. Accept: a screenshots dir holds one looked-at frame per reconstructed manual lane, reviewed against canon. Covers S9. Depends on T-006, T-004.
- T-016 Commit the full arc; run `bin/qie checkpoint`; comment on #596, #597, #598 linking this spec. autodev. Accept: `git status` clean; checkpoint written; the three issues carry the comment. Covers S9, S10. Depends on T-014.

## Risks

| Risk | Mitigation |
| --- | --- |
| L3 geometry unknown | Probed already (D-19, D-20): tables are filled-rect grids the engine captures, no footnotes, glossary is a D-16 two-column list. One table rule covers it. Visual gate per manual catches any residual. |
| Anon-key contract contradicts the staging code | T-002 gives `stage-reconstruction.ts` an anon path into `__staging`; RLS already allows it. Without T-002 the headless run halts on manual one, so T-002 gates T-003 onward. |
| MT silent drop stages English under a foreign locale | T-008 coverage assert: the stager exits non-zero on any missing idx. `stage-translation.ts` keeps source text on a missing idx, so the assert is the only guard. |
| Destructive promotion empties a live locale on mid-flight failure | T-011 is one transaction that snapshots before swapping, never delete-then-insert across two anon calls; tested staging-to-staging only. |
| A fat-finger writes prod from a headless bot | The headless env holds no service token and no prod id; promote.ts default-refuses without `--confirm`. The anon-only contract (T-002) makes no-prod-write a property, not an intention. |

## Dependencies

- Supabase staging lanes for L3 and Aura (created by migration 0007). L1 lane 2ab33901, L2 lane 503f961a already exist.
- `GOOGLE_GEMINI_API_KEY` in the worktree env for the MT producer.
- G1 (service token) and G2 (native review) are Dario's, after the run. The run names them and stops before them.

## Decisions (see ARCHITECTURE.md)

- D-18 promotion executor implements D-8; headless exercises it staging-to-staging only.
- D-19 the L3 table is one deterministic rule; adds exactly one block type.
- D-20 no footnote or glossary type (the probe shows neither exists).
- D-21 the MT engine is a producer of the frozen source.json contract; el/ru/uk carry a held-for-native-review marker as data.
