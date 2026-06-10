# Roses OS architecture draft — site-ready arc (mode: UPDATE, D-18 onward)

Pre-existing D-1 through D-17 stand unchanged. New decisions start at D-18. D-18 refines the gate D-8 already named.

## System shape

The arc adds no new subsystem; it generalizes four existing ones and implements one named-but-unbuilt gate. The reconstruction ENGINE (`src/lib/manuals/`) is already corpus-general; only its DRIVER is L1-bound, so the work is one driver, one new deterministic table rule grounded in L3 geometry, an MT producer slotted into the existing translate contract, and the promotion executor D-8 described but nobody wrote. Each piece is a pure function of canon plus recipe (D-7) or of an aligned string array (translate contract), so idempotency stays a property, not a hope.

| Module | Today | Change |
| --- | --- | --- |
| `scripts/reconstruct-l1-geometry.ts` | L1 paths/pages/metadata hardcoded | becomes `reconstruct-geometry.ts --manual <slug>`; per-manual render metadata in a checked-in map |
| `classify-regions.ts` + registry | 18 types, no table rule | one `table` block type + one deterministic rule from row fill-rects and aligned x-columns |
| `scripts/extract-translatable.ts` + MT | contract built, translate step inline-once | MT producer writes `translations.<lang>.json` against the frozen `source.json` contract |
| promotion | D-8 named, no script | `scripts/promote.ts`, one transaction, dry-run, per manual+language, staging-to-staging in the headless run |

## Decision log

### D-18: Promotion executor implements D-8; the headless run exercises it staging-to-staging only and never against prod (refines D-8 dated 2026-05-31)

**Chosen.** `scripts/promote.ts` is the concrete D-8 transaction: snapshot to `manual_blocks_backup`, delete target rows, insert source rows under the target manual_id, commit; the obligatory child-ref remap (export `page:ordinal` ids to DB uuids by position, per `stage-reconstruction.ts`) runs inside the insert. Granularity is `--manual <slug> --language <lang>`. A `--dry-run` prints the row delta and runs no write. A signer NOT-NULL precheck reads the D-12 audit column and refuses an unsigned source. In the headless run the executor is built and tested with BOTH endpoints on a staging lane, so prod is never a connection the run holds.

**Alternatives.** (a) Build promotion to run prod-to-prod under a guard flag in the same run: rejected; one flag flip from a headless bot is exactly the failure the operator contract removes, and a guard the bot can disable is not a boundary. (b) Skip building it and leave D-8 named: rejected; #596/#597/#598 need a tested promotion path, and an untested transaction discovered on prod-day is the worst time to find the remap bug. **Why it won:** the executor is fully validated without ever putting prod within reach, so Gate G1 (service token) is the only thing standing between staging and prod, exactly where the operator wants the human. **Downstream:** the service-role key and prod connection are absent from the headless environment; the run uses anon-key only. Source: Winston, operator contract.

### D-19: The L3 table is one deterministic rule over row fill-rects plus aligned text x-columns; it adds exactly one block type

**Empirical basis (I ran a probe over the real L3 PDF, all 12 pages, dumping text-run positions, fills, and strokes).** Page 9 is a genuine table: five rows at regular y (547,568,589,610,631), each row a thin FILLED rectangle the existing driver already captures, every row split at a cell wall x=322, with text aligned to fixed columns (label x=63, value x=126, annotation x=432-463). Page 2 contents has the same full-width row fills but a single column, so it stays a TOC under D-14, not a table. Strokes are nearly empty (1-2 per page, the page border); table grids are fills, so no driver change is needed.

**Chosen.** Add ONE block type `table` (CHECK then registry then TS, D-2 order). A deterministic rule in `classify-regions.ts`: when a band carries ≥3 evenly-spaced horizontal fill-rects of equal width and the text runs between them cluster into ≥2 stable x-columns, emit a `table` whose cells are the runs bucketed by (row band, x-column). Cell walls come from rule x-segments (the x=322 split), never inferred. Rows and columns fall out of geometry the engine already extracts.

**Alternatives.** (a) Render the table as a `two-column-section` of text (D-16): rejected; it loses row alignment and the third annotation column, and a reader cannot scan label-to-value. (b) A model label per cell: rejected by D-11; position is in the PDF, do not estimate it. (c) Three new types (table, glossary, footnote): rejected as ungrounded; the probe shows no glossary-with-definitions and no footnotes exist. **Why it won:** one rule over already-captured geometry generalizes across the corpus (D-13) and keeps the type surface minimal. **Downstream:** registry guard and CHECK widen by one; the HTML/MD exporters gain one serializer; the editor gets one renderer. Source: Winston, on the L3 probe.

### D-20: L3 footnotes and the page-11 "glossary" are non-goals because the probe shows neither structure exists

**Empirical basis.** Across all 12 L3 pages every small-font (6.5-7pt) run is a letter-spaced section eyebrow ("FOUNDATION", "POST-SESSION CLEANSING STEPS"), a running header/footer, a page number, or page-1 copyright print. None sits below a mid-content separator rule, which is the footnote signature. Page 11 is a two-column LIST of term names with no definitions, which D-16 N-column rendering already handles.

**Chosen.** No footnote block type and no glossary block type. The eyebrow and furniture cases are already covered by D-14 running-header/footer dropping. Page 11 stages as a two-column-section of text/list blocks.

**Alternatives.** Add footnote/glossary types speculatively: rejected; a type with no producer is dead weight on the registry and the CHECK constraint, and the deterministic-extraction lesson is to ground a type in real geometry before committing it. **Why it won:** it keeps the frozen schema honest. **Downstream:** if a later manual (Aura) carries a real footnote, the rule is added then against that geometry, not now. Source: Winston, on the L3 probe.

### D-21: The MT engine is a producer of `translations.<lang>.json` against the frozen source.json contract; el/ru/uk carry a held-for-native-review marker as data

**Chosen.** A `scripts/translate-mt.ts` reads the existing `source.json` `strings: [{idx, position, path, kind, text}]`, calls the MT provider (the repo carries `GOOGLE_GEMINI_API_KEY`), and writes `translations.<lang>.json` of `{idx, text}` aligned by idx, which `stage-translation.ts` already joins back by path and validates through `validateBlockInput`. The MT call touches only `strings`; it never sees structure, src, child refs, enums, colors, or schema_version. For el/ru/uk the stager writes a `review_status: held` audit value so the row is staged but visibly not promotable.

**Alternatives.** (a) Have the MT call emit blocks directly: rejected; it would bypass the structure-preserving boundary `collectStrings`/`applyStrings` enforce and could mutate child refs. (b) Carry the held marker only in a sidecar: rejected; the promotion precheck (D-18) reads audit columns, so the marker must be a row-level value the gate can refuse on. **Why it won:** the MT engine is one more producer of the same flat-string contract, so all six languages scale off one code path and the held state is enforceable at promotion. **Downstream:** D-18 promotion refuses a `held` row; Gate G2 (native review) clears it by flipping the marker after signoff. Source: Winston, operator contract.

## Conventions implementing agents must follow

- `.ts` imports are EXTENSIONLESS; run scripts with `tsx`, never `node`.
- Generalize the fix, never patch the page (D-13). Every L3 fidelity error becomes a rule over geometry that holds corpus-wide.
- Render metadata (color, serif, font family, width_pct) is joined to a block by its (page, ordinal) anchor and lives in geometry, NEVER in content JSON or the schema (D-12, D-1).
- The headless run uses the anon key only. The service-role key and any prod connection are absent from its environment.
- New block type lands CHECK first, then registry, then TS union (D-2).

## Non-goals

- No prod write in the headless run; promotion to prod is Dario's later command behind Gate G1.
- No new authoring system; the 18-type editor plus the one new `table` type is the whole surface.
- el/ru/uk are not promoted without native review (Gate G2); they stage held.
- No footnote or glossary type until a manual's real geometry demands one.

## Open architectural questions (each with a fallback)

1. **Does the table rule generalize to Aura's tables, if any?** Fallback: if Aura carries a table shape the L3 rule misses, extend the same rule over Aura's fill geometry, never a per-page patch; until then Aura tables stage as two-column-section and are flagged for review.
2. **MT idempotency across re-runs.** A non-deterministic MT call breaks the D-7 idempotency the rest of the pipeline holds. Fallback: cache `translations.<lang>.json` by a hash of the source strings, so a re-run with unchanged source reuses the cached translation and only changed strings re-call MT.
3. **Cell-to-block mapping for the table renderer.** Fallback: if the editor's table renderer is not ready in this arc, store the table content as structured rows/columns in the new type's schema and render a minimal grid; richer in-cell authoring is a later refinement, named so the next iteration improves the general renderer.
