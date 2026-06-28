# Decisions and build-time confirmations — editor-fidelity-and-undo

Build-time resolutions for the open questions in `spec.md`, recorded during the
/develop run `editor-fidelity-undo-20260627`.

## T-012 (AC, M2): which manual_id does the editor write — staging or prod?

**Confirmed: the editor writes whatever `manual_id` is in the URL, and the normal
teacher flow opens a PROD manual_id, so the editor writes PROD directly.**

Trace:

- `src/app/(manuals)/manuals/[manualId]/page.tsx` reads `manualId` from the route
  params and passes it straight to `BlockEditor` with no staging resolution.
- `BlockEditor` sends every mutation (`PUT`/`POST`/`DELETE`/reorder) to
  `/api/manuals/${manualId}/blocks`, and the route queries `manual_blocks` on that
  exact `manual_id` (`src/app/api/manuals/[manualId]/blocks/route.ts`).
- The teacher manual list (`db.ts getManuals`) filters `__staging` slugs out, so
  the only manuals a teacher can open from the list are PROD. Therefore the normal
  entry point edits prod rows.
- The one staging entry point is `/staging-review/<staging-manual-id>`
  (`src/app/staging-review/[manualId]/page.tsx`), which redirects into the same
  editor against a staging `manual_id`. `resolveStagingManualId` /
  `stagingSlugFor` (`staging.ts`) exist but no normal editor path calls them.

**Consequence for this spec:** the M1 soft-delete (T-002) and the M2 recipe
write-through (T-008) both hold regardless of staging vs prod — soft-delete keeps
the row by id, and the recipe override is keyed by the stable `<page>:<ordinal>`
anchor independent of which `manual_id` carries it. Undo and figure-replace work
the same on either lane.

**Follow-up recommended (not in this spec's scope):** route normal teacher editing
to the STAGING lane (D-5) with an explicit promotion step (the D-8 promote RPC
already exists, migration 0008), so a mistaken live edit is contained until
promoted. This is a structural editing-lane change beyond the M1–M3 fidelity/undo
arc and should be its own spec. Filed as a recommendation here per T-012; the
panel or Dario decides whether to open it.

## Open question 1 (spec): policy A vs B for the downloaded PDF

Answered in the issue body 2026-06-27 ("yes"): policy A stands — the downloaded
PDF stays the hand-designed master; the editor is the web view; regenerate-from-
blocks (B) is deferred behind a teacher-signed fidelity bar (D-22). M3 ships the
labeled, separate "Draft PDF from your edits" and the fidelity-comparison scaffold
(T-013, T-015) without converging onto one Download button.

## T-008 build note: recipe override store location and the editor write path

The durable-intent mechanism for D-24 is built and unit-verified: the override map
(`src/lib/manuals/figure-overrides.ts`, keyed by the same `<page>:<ordinal>`
anchor the provenance sidecar uses) and the reconstruction merge
(`scripts/reconstruct-l1-geometry.ts` reads
`reconstruct/<slug>.<lang>.figure-overrides.json` and merges it into the extracted
`figureFiles` before mapping). A re-run that finds an override preserves the human
`content.src` instead of clobbering it.

Two pieces remain operator/human-gated (why T-008 is labeled `human`):

1. **The (page, ordinal) anchor is not persisted on the DB row.** The reconstructed
   row's synthetic `<page>:<ordinal>` id is replaced by a uuid on insert
   (`scripts/stage-reconstruction.ts`), and only `source_page` survives as an audit
   column. For the editor to write an override keyed by the anchor, the figure
   ordinal must be persisted too (a `source_ordinal` audit column, consistent with
   `source_page`). That is a schema change the panel should ratify alongside the
   editing-lane decision above.
2. **End-to-end verification needs a reconstruction re-run + visual confirm** against
   the canon PDFs, which is the operator's pipeline run, not something this
   strict-local /develop run can exercise.
