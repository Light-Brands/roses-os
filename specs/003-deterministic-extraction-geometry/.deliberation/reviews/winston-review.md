# Winston review: architecture decision

Framing: a new decision in spec 002's ARCHITECTURE.md (D-11, with D-12 follow-on) consumed by a new local spec 003, not a rewrite of M1. M1's surfaces (extraction, validation gate, provenance) and acceptance criteria stay as written. What changes is the internal mechanism of E2, which spec 002 deliberately left as "vision pass" without committing to vision-for-coordinates. D-11 fills that under-specified seam. E3 validation, recipe authority, and the staging write do not move.

The full D-11 and D-12 text is landed in `ARCHITECTURE.md`. Summary of the decision:

## D-11 chosen path

Three modules with a hard seam: `extract-geometry.ts` (pure pdf.js: text runs with transforms, figure rects and pixels from the operator list, reading order by a column-aware band sort), `classify-regions.ts` (the only model call; rule-engine-first for the unambiguous majority, model for the residue; returns block_type plus content fields, never a coordinate; cached per region by content hash), and `map-to-blocks.ts` (E3, unchanged in role; `validateBlockInput` is the hard gate; recipe overrides on the stable anchor). The composed function is deterministic because the only non-deterministic step (classification) is cached on a deterministic key, which makes D-7 idempotency a property rather than a hope.

## Alternatives

(a) bbox plus a tightening pass: rejected, category error, two non-deterministic passes still cannot make idempotency a property. (b) full deterministic no vision: kept as the rule-first layer, rejected as the sole mechanism because several of the 18 types are semantic reads not typographic ones. (c) the chosen hybrid: selected, each half on the correct tool, the one fallible output is cached/validated/overridable. (d) third-party layout service: rejected, reintroduces non-determinism plus an external dependency, earns its keep only on scanned documents.

## D-12

Provenance in a sidecar plus two nullable audit columns (riding the existing M0 migration), keyed by the stable anchor, leaving the 18 content schemas untouched. The promotion gate reads the signer as a NOT NULL check.

## Slotting

Spec 003 re-cuts only M1's E2: T-009 splits into T-009a (geometry) and T-009b (classification); T-010 (validate) refits its input; T-012 (provenance) picks up D-12. No new milestone; M2 through M5 untouched. AC7, AC8, AC11 of spec 002 are restated against the new mechanism.

## Three risks plus mitigation

1. Text runs do not coalesce cleanly: test the grouping rules as a unit with Level 1 fixtures; flag bad regions rather than feed garbage.
2. Classifier mislabels: rule-first majority, validateBlockInput rejects missing-field labels, recipe pins the type on the anchor.
3. Figure is vector art not an XObject: crop the path-cluster's operator-geometry bounds, else flag for human upload; figure pixels never come from a model coordinate.
