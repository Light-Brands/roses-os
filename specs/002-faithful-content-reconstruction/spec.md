---
slug: 002-faithful-content-reconstruction
title: Faithful content reconstruction of the Roses OS manuals
target_repo: Light-Brands/roses-os
status: scoped
created: 2026-05-31
run_id: faithful-content-reconstruction-20260531-014843
architecture: update (D-5 through D-10 in ARCHITECTURE.md)
mockup: none (kaze_attach = false, see Mockup note)
mode: strict-local
---

# Faithful content reconstruction of the Roses OS manuals

## Problem

Spec 001 built the editor capability: the block registry now carries 18 v2 primitives, the read path parses them, and this session proved one page (the Rose Meditation Level 1 contents page) can match its canon PDF pixel-faithfully. But `manual_blocks` still holds flat legacy rows. Level 1 alone is 86 legacy blocks, its table of contents stored as a single `text` block with a flat unordered list, so the live page reads as run-on text where the canon shows a designed page. The bricks exist; the content was never rebuilt. This spec rebuilds the content of all four canonical manuals into the v2 primitives so each page reproduces its `docs/canon` PDF, replacing the flat legacy blocks, without ever putting production data at risk and without losing a human correction on re-run. It is a migration of meaning, not a feature.

## Why now

The capability work (spec 001, milestones M0 through M5) is built but uncommitted in this worktree. It is working-tree-only, so a fresh session would not see it and the proof would be lost. The fidelity proof this session closed the open question of whether the primitives can reproduce a canon page. They can. The only remaining gap between every manual and its PDF is content reconstruction, and that gap is now the single thing standing between the editor investment and a reader seeing a designed page.

## Scope

### In scope

- Commit the spec 001 capability locally to the branch so reconstruction has a stable floor (P0).
- Widen the `manual_blocks.block_type` CHECK constraint to include `contents`, the one v2 type present in the registry and TypeScript union but absent from migration 0002 (P1).
- Add a uniqueness guarantee on `(manual_id, language, position)` so two pipeline runs cannot strand two blocks at the same position (Custodian).
- Confirm the backward-compat parser keeps every legacy row readable while v2 rows land (P2).
- Build a server-side service-role write path for bulk staging inserts, since `db.ts` writes only through the browser anon client (P3, D-6).
- Realize a structurally isolated staging lane so a reconstruction write is invisible to any production read (P3, D-5).
- Build the semi-automated pipeline: render canon page to image (E1), extract page to draft block JSON (E2), map and validate the draft through `validateBlockInput` (E3), capture curation and human corrections in a per-manual recipe YAML (E4), write to the staging lane (E5).
- Build the review and promotion surface: a side-by-side review route (R1), a canon-diff harness that fails on a nonzero page delta, a word-level prose diff against the legacy text, a human page sign-off loop that persists into the recipe (R2), asset reconciliation (R3), and a transactional promotion with legacy backup and tested rollback (R4).
- Carry provenance on every reconstructed block (source canon page, extraction run id, signer).
- Enforce a hard locale guard so a no-canon locale cannot receive generated text.
- Run Slice 0 first: Rose Meditation Level 1, English, end to end through the whole loop, landing on staging, before scaling to Level 2, Level 3, and Aura 1.
- Formally retire spec 001 AC10 (block-type count under 12); the registry's 18 types are the canon surface (D-9).

### Out of scope (not part of this arc)

- Content for the non-English locales (pt, es, el, ru, uk). The operator scoped this arc to English, where canon exists. The locale plumbing (the gap indicator and the hard guard at T-013 and T-034) is in scope, but emitting non-English text is structurally blocked because no translated canon exists to reconstruct from. Reason: `external: named-human-signoff` (a translated canon must be authored and attested by a teacher before any non-English row can exist).
- Changes to the editor capability itself (block primitives, the TipTap engine of D-3). Those are owned by spec 001; this spec consumes them unchanged.
- Automating the human review judgment. The fidelity sign-off stays a human act by design.
- A separate Supabase project for staging (D-5 weighs and rejects it).
- The faithful PDF export renderer, owned by a separate spec (faithful-pdf-export, issue 537).

## Acceptance criteria

Each criterion names its surface and its trigger, and is verifiable on its own.

1. **CHECK includes contents.** After the new migration applies, `SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'manual_blocks_block_type_check'` lists all 18 registry types including `contents`, and an insert of a `contents` row on a fresh database succeeds. (Surface: migration. Trigger: migration apply + insert.)
2. **Position is unique per lane.** A unique constraint on `(manual_id, language, position)` exists; a second insert at an occupied `(manual_id, language, position)` is rejected by the database, not silently accepted. (Surface: migration. Trigger: duplicate insert.)
3. **Legacy rows still read.** `parseManualBlocks` over the 86 Level 1 legacy rows returns zero `unknown` fallbacks, and a `contents` v2 fixture returns `ok`. (Surface: `block-parser.ts`. Trigger: parse batch.)
4. **Server write path exists and is server-only.** A service-role write module inserts one block to the staging lane; the module fails closed when the staging service-role env var is absent, and the service-role key is never bundled to the client. (Surface: `db.admin` module. Trigger: script insert + missing-env unit.)
5. **Staging is invisible to prod reads.** A write to the staging lane does not appear in `getBlocks(prodManualId, 'en')`; the production manual id row set is byte-identical before and after a staging write. (Surface: staging lane, D-5. Trigger: staging write then prod read.)
6. **Validation is the write gate.** The staging writer calls `validateBlockInput` on every block before insert; a draft that passes the `block_type` CHECK but violates the Zod union is rejected with the named-error envelope, never inserted. (Surface: E3 mapper + E5 writer, D-1. Trigger: seeded invalid draft.)
7. **Canon renders to per-page images.** The renderer emits one PNG per Level 1 canon page via `puppeteer-core` plus system Chrome. (Surface: E1 renderer. Trigger: run on `docs/canon/Rose Meditation Level 1.pdf`.)
8. **A page extracts to a registry-shaped draft.** The extractor turns one Level 1 page into block JSON whose every entry validates against the registry schema or is flagged, never silently dropped. (Surface: E2 + E3. Trigger: extract one page.)
9. **The recipe is the authority of intent.** Re-running the pipeline preserves every field marked as a human override in `recipes/rose-meditation-level-1.en.yaml` unchanged, and the override wins over the extracted draft on a seeded conflict. (Surface: E4 recipe, D-7. Trigger: re-run after seeding an override.)
10. **Idempotent re-run.** Two consecutive full runs of the Level 1 pipeline produce identical staging rows (diff count zero on non-override fields). (Surface: E5 writer + D-7. Trigger: run twice.)
11. **Provenance per block.** Every reconstructed block carries its source canon page, extraction run id, and a signer field; a promoted block with an empty signer field does not exist. (Surface: block content provenance. Trigger: inspect staging rows.)
12. **Side-by-side review.** The review route shows the canon image beside the rendered staging page, per page, for Level 1. (Surface: R1 route. Trigger: open the route.)
13. **Canon-diff is a real gate.** The canon-diff harness diffs the rendered staging page against its canon image and exits non-zero above a defined pixel-delta threshold. (Surface: `scripts/canon-diff.ts`. Trigger: run on a deliberately broken page.)
14. **Prose fidelity is shown.** The review surface shows a word-level diff of reconstructed prose against the legacy prose, with every divergence either marked as canon-explained or flagged. (Surface: R1 prose diff, Edut C3. Trigger: open a page whose wording changed.) Human-review.
15. **Named teacher sign-off gates promotion.** Promotion refuses to run unless a named human signer who attests faithfulness to the teaching is recorded for the manual. (Surface: R4 gate, Edut C4. Trigger: attempt promotion with no signer.) Human-review.
16. **Promotion is one transaction with backup and rollback.** Promotion snapshots the production rows (with position and a content checksum) into a backup table, replaces them with the staging rows under the production manual id, all in one transaction; a forced mid-promotion failure leaves production at its pre-promotion block set; the rollback statement restores the exact pre-promotion rows verified by checksum. (Surface: R4 migration, D-8. Trigger: dry-run promote + forced-failure + rollback.)
17. **Backup is immutable.** The legacy backup has no prune path; Level 1 legacy prose is recoverable verbatim after promotion. (Surface: backup table, Edut C2. Trigger: read backup after promote.)
18. **Soak has a failing observable.** The 7-day soak fails if the canon-diff harness reports any nonzero page delta during the window; it does not pass on elapsed time alone, and intentional content changes surface to a human during the soak. (Surface: soak gate, Custodian + Mar'ah. Trigger: introduce a delta mid-soak.) Partly human-review.
19. **Hard locale guard.** A pipeline run targeting a locale with no translated canon (pt, es, el, ru, uk) exits non-zero before any write. (Surface: pipeline entry, Edut C5. Trigger: run with a no-canon locale.)
20. **Slice 0 closes.** Rose Meditation Level 1 English is reconstructed through the whole loop onto staging, every page signed off against its canon image, the promotion dry-run and rollback both verified, before any other manual starts. (Surface: the whole loop. Trigger: Slice-0 completion.) Partly human-review.
21. **AC10 is retired in writing.** The architecture ledger records that spec 001 AC10 is void, names the real count of 18, and reinstates no count ceiling. (Surface: `ARCHITECTURE.md` D-9. Trigger: read the ledger.)

## Whole-problem surface

```yaml
surfaces:
  - id: S1
    surface: block_type CHECK constraint and type-set integrity (contents + retired AC10 ceiling)
  - id: S2
    surface: server-side service-role bulk-write path, separate from the browser anon client
  - id: S3
    surface: structurally isolated staging lane (cloned manual_id) invisible to prod reads
  - id: S4
    surface: position uniqueness guarantee on (manual_id, language, position)
  - id: S5
    surface: canon render to image and per-page vision extraction to draft block JSON
  - id: S6
    surface: write-time Zod validation gate (validateBlockInput) before any insert
  - id: S7
    surface: recipe-as-authority idempotency model (pipeline is a pure function of canon plus recipe)
  - id: S8
    surface: provenance per block and the hard no-canon-locale guard
  - id: S9
    surface: side-by-side review route and the canon-diff fidelity oracle
  - id: S10
    surface: prose and meaning fidelity diff plus the named-teacher sign-off gate
    external: named-human-signoff
  - id: S11
    surface: legacy backup, transactional promotion, and tested rollback
  - id: S12
    surface: 7-day soak gate with a failing observable
  - id: S13
    surface: scale to Level 2, Level 3, Aura 1 in English and locale plumbing for the rest
```

## Open questions

1. **Figure-to-asset reconciliation (R3).** Are the canon figures already in the repo, or must they be extracted from the PDFs and stored? Answerer: Dario plus a repo asset audit. Default the workflow proceeds with: extract per-page raster crops into Supabase storage under a `manuals/<id>/` prefix and reference by URL, flagging any figure with no clean source for human upload (Winston).
2. **Soak timer location.** Where the 7-day soak timestamp is recorded. Answerer: panel re-deliberation if it bites. Default: a `promoted_after` field in the recipe set at review sign-off, read by the promotion gate; no separate table (Winston).
3. **Vision extractor model and per-page cost ceiling.** A full run is roughly 60-plus vision calls and each re-run pays again. Answerer: Dario (cost). Default: cache the extraction JSON per canon page keyed by a page-image hash so a re-run does not re-call the model unless the page changed (Amelia).
4. **The named teacher signer.** Who is the human who knows the practice and can attest meaning fidelity, not just layout? Answerer: Dario. Default: promotion blocks until a recorded signer name is present; the spec does not invent who that is (Edut).
5. **Whether prod content is replaced at all.** Mar'ah's necessity question: Slice 0 needs no production write, and staging could stay the canonical render. Answerer: Dario. Default: staging stays canonical until an explicit, soaked, signed promotion per manual; promotion is opt-in and is the last cohort, never the proof (Mar'ah).

## Mockup

No mockup. `kaze_attach = false`. The one user-facing surface this spec introduces, the side-by-side review route (R1), is an internal operator tool that generalizes the proven `/fidelity-proof` route from this session. The end-reader manual surface was designed and shipped under spec 001, and the canon PDF is itself the pre-existing visual contract this spec reproduces. There is no new end-user surface to design, so Phase 4.5 did not run. If the review route grows into something an end reader sees, that is a separate user-facing spec.

## Panelists who contributed

- **Mary** (Business Analyst): framed P3 and the missing server write path as unspecified requirements wearing a checkbox, on the critical path before any extraction.
- **Winston** (System Architect, architecture-author): authored decisions D-5 through D-9, including staging as a cloned manual_id and the recipe as the single authority promotion is defined against.
- **Amelia** (Senior Developer): named `validateBlockInput` as the real write gate the CHECK cannot stand in for, and sized the vision-extraction cost and drift.
- **Custodian** (data integrity): found the missing position uniqueness constraint, required position-plus-checksum in the backup, and required the soak to carry a failing observable.
- **Mar'ah** (Mirrorblade, Legion Action Gate): named that fidelity here is a human yes, not a measured match, and that promotion is the last task, not the proof.
- **Edut** (moral conscience): separated meaning fidelity from layout fidelity, and added provenance, immutable legacy preservation, the prose diff, the named-teacher sign-off, and the hard locale guard.
