---
slug: 004-site-ready-all-manuals
title: Site ready, all manuals reconstructed translated and staged
status: draft
run_id: roses-os-site-ready-20260609-185905
architecture: ../../ARCHITECTURE.md (D-18 through D-21)
---

# Spec: Site ready, all manuals reconstructed, translated, and staged

## Problem

Roses OS looks rebuilt and multilingual. It is neither yet. Only Level 1 English is reconstructed with the deterministic-geometry engine and staged in Supabase; Level 2, Level 3, and Aura are still English text wearing locale labels (the per-manual audit confirms L2 and L3 are English duplicated into all six languages, Aura is partial). The reconstruction engine in `src/lib/manuals/` is corpus-general, but its driver is hardcoded to Level 1, the translation pipeline is built but its actual machine-translation step ran inline once by hand, and the staging-to-prod promotion that ARCHITECTURE D-8 names was never written. This spec drains the whole arc in one `/develop --headless` run so that every manual, in every language, is reconstructed, verified, and staged, leaving Dario one manual promotion command per manual as the only remaining step.

## Why now

Dario asked to leave the site totally ready in one headless run. Three open `lb-task` issues on the repo are exactly this surface: #596 (editor functional and live), #597 (PDF generation correct), #598 (i18n features working). Draining this spec satisfies all three. The L1 reconstruction work, the editor fixes, and the translation pipeline are all built and uncommitted on the worktree branch right now, so the baseline is at risk until it is committed.

## Operator decisions (fixed contract, not open questions)

1. The headless run takes everything to staging and verifies it. It never promotes to prod. Promotion staging-to-prod is Dario's manual command, per manual, after the run. The headless run uses the anon key only and holds no service token and no prod connection.
2. Machine translation generates all six languages. Greek, Russian, and Ukrainian are staged with a held-for-native-review marker until a native speaker signs off. English, Spanish, and Portuguese are staged ready to promote.

## Human gates (the headless run names them and does not cross them)

- G1 service token. Promoting staging-to-prod (Dario's later step) needs a fresh Supabase service token; the ones used on 2026-06-07 were rotated. The promotion script and the `review_status` migration are written in this run but applied later, by Dario, with the token. external: operator-credential.
- G2 native review. el/ru/uk stay held at staging until a native speaker clears them. external: named-human-signoff.

## Scope

In scope:

- Generalize the reconstruction driver to any manual selected by slug (D-18 module table).
- Give `stage-reconstruction.ts` an anon staging path so English reconstruction stages without a service role key, preserving the anon-only contract.
- Add one `table` block type and one deterministic rule grounded in the L3 geometry probe (D-19). No footnote or glossary type (D-20, the probe shows neither exists).
- Reconstruct and stage English for Level 2, Level 3, and Aura, each visually verified with a looked-at screenshot.
- Wire a machine-translation producer to the frozen `source.json` to `translations.<lang>.json` contract using Gemini, with a coverage assert and an idempotency cache (D-21).
- Translate and stage es and pt (ready to promote) and el, ru, uk (held for native review) for Level 2, Level 3, and Aura.
- Write the staging-to-prod promotion executor as one transaction with the child-ref remap, a dry-run, per manual and language granularity, a signer not-null precheck, a default refusal without an explicit confirm flag, and no prod id in the headless code path (D-18).
- Write the `review_status` migration file (not applied in the run).
- A staging-review route so Dario can open a `__staging` lane in the editor with the PIN injected.
- A full verify and /test-feature sweep with no new bugs, satisfying #596, #597, #598.
- Commit the baseline first and everything at the end.

## Out of scope

- Any write to a production manual row. Promotion to prod is Dario's later command behind G1.
- Promoting el/ru/uk without native review (G2).
- A new authoring system. The 18-type editor plus the one new `table` type is the whole surface.
- A footnote or glossary block type. The L3 probe shows neither structure exists; a later manual that carries one gets the rule then, against its real geometry.
- Re-translating Level 1, which is genuinely human-translated and left untouched.

## Whole-problem surface

```yaml
- id: S1
  surface: generalized multi-manual reconstruction driver (reconstruct-geometry.ts --manual <slug>)
- id: S2
  surface: anon staging path for English reconstruction (stage-reconstruction.ts without service-role hard-exit)
- id: S3
  surface: L3 table block type plus deterministic rule (classify-regions.ts, registry, CHECK, TS union)
- id: S4
  surface: all four manuals reconstructed in English, staged, visually verified per manual
- id: S5
  surface: MT producer wired to the source.json contract (translate-mt.ts, Gemini) with coverage assert and idempotency cache
- id: S6
  surface: L2/L3/Aura staged in es/pt (ready) and el/ru/uk (held-for-native-review marker)
- id: S7
  surface: staging-to-prod promotion executor (promote.ts, one txn, remap, dry-run, signer check, default-refuse) plus review_status migration file
- id: S8
  surface: staging-review route (direct PIN-injected editor route to a __staging lane)
- id: S9
  surface: full verify plus /test-feature sweep, no new bugs, #596/#597/#598 satisfied
- id: S10
  surface: baseline committed first and everything committed at the end
```

## Acceptance criteria

1. Running `npx tsx scripts/reconstruct-geometry.ts --manual rose-meditation-level-2` in the worktree writes an `editor-blocks.json` under a Level 2 output directory. The script carries no Level-1-specific path, page count, or prod uuid. (S1)
2. Running `npx tsx scripts/stage-reconstruction.ts --manual rose-meditation-level-2 --dry-run` prints a block-type distribution and exits zero with no `SUPABASE_SERVICE_ROLE_KEY` present. The staging path uses the anon key into the `__staging` lane. (S2)
3. A `table` block type exists in the CHECK constraint, the block registry, and the TS discriminated union, in that order. `npx tsx scripts/verify-classify-map.ts` is green, and the rule emits a `table` block for Level 3 page 9 (the five-row label-value-annotation grid at the x=322 cell wall). (S3)
4. The Level 2, Level 3, and Aura staging lanes each hold a non-zero reconstructed English block count after the run, and a looked-at screenshot of each is saved under the run's screenshots directory. `npx tsx scripts/verify-extract-geometry.ts` and `npx tsx scripts/verify-classify-map.ts` are green. (S4)
5. Running `npx tsx scripts/translate-mt.ts --manual rose-meditation-level-2 --to pt` writes a `translations.pt.json` whose entry count equals the `source.json` strings count, preserving html-kind strings as html. A second run with unchanged source reads the cache and makes zero MT calls. (S5)
6. The stager exits non-zero when a `translations.<lang>.json` is missing any source idx, so a short or mis-indexed MT output cannot stage English under a foreign locale. (S5)
7. For Level 2, Level 3, and Aura, the es and pt staging rows carry the target-language text (0 residual English on a sampled set) and no held marker. (S6)
8. For Level 2, Level 3, and Aura, the el, ru, and uk staging rows carry the target-language text and a held-for-native-review marker, and a query returns exactly those rows filtered by the marker. (S6)
9. `npx tsx scripts/promote.ts --manual rose-meditation-level-2 --language pt --dry-run` against two staging endpoints prints the row delta and performs no write. Running `promote.ts` without an explicit confirm flag refuses, and the headless code path holds no prod manual id. (S7)
10. `promote.ts` refuses a source row whose signer audit column is null and refuses a row carrying the held marker. The promotion is one transaction that snapshots before swapping, so a mid-flight failure does not leave a live locale emptied. (S7)
11. A `supabase/migrations/0008_*.sql` file exists, parses as valid SQL, and adds `review_status` plus the promotion RPC. It is not applied in the headless run. (S7)
12. Opening `/manuals/<staging-id>` after injecting the editor PIN renders the staged blocks for that lane, even though `getManuals` filters `__staging` slugs out of the reader list. (S8)
13. `node scripts/_editor-qa.cjs` reports all cases green, a results doc is written under `_qie/core/data/`, and issues #596, #597, #598 each carry a comment linking this spec. (S9)
14. The worktree branch is committed clean at the start (baseline) and at the end (full arc), and `bin/qie checkpoint` records the run. (S10)

## Open questions

1. Author assent (Edut). The whole arc treats fidelity as a property of geometry, but for a client's living spiritual teaching, fidelity is also a property of consent. Nowhere does the plan show the reconstructed and machine-translated corpus to the author (International Aura School / Jen) before it becomes the live teaching her students read. The no-prod-write boundary already creates the space for this. Question for Dario: before he promotes any reconstructed or machine-translated manual, has the author or her steward seen and assented to this rendering. Default: the run proceeds to staging; the question rides into the promotion step Dario owns.
2. The held-for-native-review marker substrate (Custodian, Amelia). In the anon-only headless run the marker rides a `run_id` convention because adding a `review_status` column is DDL and DDL needs the service token (G1). The clean `review_status` column ships as the 0008 migration applied at promotion time. Question: is the run_id convention acceptable for the held state until the column lands, or should the held languages simply not stage until the column exists. Default: ride run_id now; promote.ts reads review_status when applied, run_id pattern until then.
3. Destructive-promote rollback (Mar'ah, Custodian). The promotion snapshots to a backup table inside the transaction. Question for the promotion step: is a snapshot table the rollback Dario wants, or a Supabase point-in-time restore. Default: snapshot table plus dry-run; this run only tests staging-to-staging.
4. MT provider quality for el/ru/uk (Edut, Mar'ah). Gemini machine translation of sacred meditation content is held for native review by design, but es and pt go ready-to-promote on the same engine. Question: do es and pt also want a light human read before promotion. Default: es and pt promotable; the resilience is that promotion is still Dario's manual per-manual command.

## Panelists who contributed

- Winston (Architect) authored the architecture decisions D-18 through D-21 and ran the empirical L3 geometry probe that collapsed the long pole to one table rule.
- Amelia (Dev) grounded the task breakdown in the real driver, pipeline, and schema, and caught the anon-key-versus-service-key contradiction.
- Custodian (Compliance and Audit) named the delete-then-insert promotion seam and the held-marker substrate question.
- Mar'ah (Mirrorblade, Legion Action Gate) ran the Truth, Compassion, Necessity, Beauty gates over the destructive prod effect and insisted on the per-manual visual-verification gate.
- Edut (moral conscience) named author assent as the moral seam the engineers would not see, phrased as resilience that survives an operator override.
