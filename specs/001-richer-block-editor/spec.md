# Spec: Richer block editor for Roses OS manuals

## Problem

The manual editor at `src/components/manuals/BlockEditor.tsx` (442 lines), `src/components/manuals/blocks/*` (7 files), and `src/lib/manuals/types.ts` (94 lines) cannot express the visual fidelity of the 4 canonical PDFs now sitting in `docs/canon/`. The model carries 6 block types (`heading`, `text`, `image`, `image-row`, `divider`, `page-break`). `TextContent` is `{ html: string }` populated by `document.execCommand` inside `TextBlock.tsx:29`, so the database holds whatever the browser emitted (Chrome `<b>`, Safari `<strong>`, Word paste `<span style="font-family:...">`). Canon-shaped patterns (cover, decorated headings, callouts, numbered exercises with hanging indent, two-column figures, captioned images, spoken-instruction with rose-icon marker, summary cards) do not exist as primitives. The author cannot author what the canon needs and the renderer cannot recover what was never captured.

There is one structural diagnosis the panel did NOT converge on. Mar`ah's review argues the framing "the model is lossy" mis-attributes the gap: by code inspection, `TextBlock` already preserves `<p> <ul> <ol> <strong> <em> <u>`, and `export-html.ts:25-27` flattens it. Mar`ah's classification of the canon-vs-current delta: 60% exporter chrome, 25% one missing primitive (numbered exercise + two-column figure), 15% authoring UX. The other panelists frame the model itself as load-bearing. The spec resolves the disagreement with a kill-or-proceed gate in M0; see Open Questions.

## Why now

The sister arc `faithful-pdf-export` shipped M1-M5 locally on 2026-05-27 in worktree `clients/light-brands/.worktrees/roses-os--faithful-pdf-export` (chromium adapter at `src/lib/manuals/chromium-adapter.ts`, ruta `src/app/api/manuals/[manualId]/pdf/route.ts`, ruta `print`, synthesize-rhythm). The PR for that arc has not landed on `origin/main` yet. Lattice's review reframes the sequencing: this spec is a **precondition** to faithful-pdf-export, not a sibling. If the renderer PR lands first on the legacy schema, it bakes the lossy contract and a later editor refactor has to negotiate against two consumers. The honest cut is: editor publishes schema v1, renderer consumes schema v1, schema versioning carries both.

## Scope

### In scope

- Visual-diff harness that classifies the canon-vs-current delta per page per manual (exporter / model / UX).
- Kill-or-proceed gate after the harness. The spec proceeds with the full rewrite only when model-missing classification ≥ 25% of delta surface.
- Pattern inventory across the 4 PDFs in `docs/canon/`, mapped to block-vs-page-template-chrome vs exporter responsibility.
- Discriminated-union block schema with per-block-row `schema_version` field; Zod validators at every read and write boundary.
- Migration of the 4 seeded manuals to schema v1 with lossless round-trip; backward-compat parser that accepts every currently-loaded `content` shape and falls back to `unknown` for unparseable rows rather than 500-ing.
- SQL `CHECK` constraint at `supabase/manuals-schema.sql:79` widened to include every new block type name BEFORE any TS code references those names. Including back-fix for the already-drifted `image-row`.
- Rich-text engine adoption (TipTap default, Lexical fallback) wrapped behind a canonical-JSON serialization contract the engine does not own. Marks closed at `bold`, `italic`, `link`, `bulletList`, `orderedList`, `softBreak`. No toolbar.
- Paste sanitizer with allow-list; integration tests on Word, Notion, Google Docs paste.
- New block primitives derived from the inventory: at minimum `callout`, `quote`, `numbered-exercise`, `captioned-figure`, `spoken-instruction`, `two-column-section`, `table`, `footnote`, `glossary`, plus whatever else the inventory closes on. Total block-type count stays under 12 (Mar`ah deprecation guardrail).
- Layout containers: `section` and `two-column-section` as parent blocks with `children: Block[]`.
- Corner-frame chrome at page-template layer (Kaze finding), set per-manual, not a block.
- Live preview in the editor surface using the same print CSS as the Chromium renderer; "final check" button reaches the request-time Chromium adapter once faithful-pdf-export lands.
- Drag-reorder via `dnd-kit` (replaces Framer Motion `Reorder.Group`); keyboard sensor mandatory.
- Autosave conflict detection via `updated_at` precondition; 409 surfaces a banner naming the other editor. Last-write-wins.
- `reorderBlocks` wrapped in single transaction (Postgres RPC) with concurrent-edit integration test.
- Editor refuses invalid block state pre-save with inline error.
- Locale parity surface across the 6 declared locales (`en`, `pt`, `es`, `el`, `ru`, `uk`); locale-gap indicator.
- Telemetry on block-add, block-delete, block-edit-then-undo (signal for wrong-primitive-picked); routed through a `track()` helper, backend swappable.
- Sentry breadcrumbs tagged by `manual_id`, `language`, `schema_version` on block-load, block-save, block-validate.
- PIN-gated `/manuals/_status` page exposing last migration run, schema version per row, parser-fallback rows.
- 7-day staging soak against a clone of production `manual_blocks` before the prod migration.
- ARCHITECTURE.md at repo root (first formal architecture doc for roses-os).

### Out of scope

- Real-time collaborative editing (CRDT, Yjs, operational transform). Canonical JSON stays CRDT-amenable for a future spec.
- Mobile-native editing surface. Read on mobile stays in scope; edit is desktop-first.
- Translation tooling beyond locale plumbing. Translation drift detection is a follow-on spec.
- Replacing the build-time PDF pipeline (`scripts/build-manuals.ts`); coexists with the request-time adapter.
- The render server itself (`faithful-pdf-export` sister arc).
- Auth / PIN system (`ManualPinGate.tsx`, `AdminPinManager.tsx`).
- Public reader/viewer surface (read code path stays unchanged).
- A general CMS beyond the 4 manuals.

## Acceptance criteria

Each AC is independently verifiable per Section A of `genesis-spec.md`.

**AC1.** The visual-diff harness at `scripts/canon-diff.ts` renders the 4 manuals (`rose-meditation-level-1`, `rose-meditation-level-2`, `rose-meditation-level-3`, `aura-level-1`) through the in-flight Chromium adapter with a hand-tuned template using only today's 6 block types plus a single `section` wrapper, and publishes per-page pixel-diff scores plus per-delta classification (exporter / model / UX) to `_qie-output/roses-os/canon-diff-baseline-2026-05-28.md`. Verified by file presence and table parsability.

**AC2.** The kill-or-proceed gate at the end of M0 records the classification outcome and the decision (proceed with full rewrite OR re-scope to exporter-first + 2 primitives + UX) in `_qie-output/roses-os/m0-gate-decision.md`. Decision rule: proceed iff model-missing classification ≥ 25% of delta surface across all 4 manuals. Verified by file presence and decision-line parsability.

**AC3.** The SQL `CHECK` constraint on `manual_blocks.block_type` (currently at `supabase/manuals-schema.sql:79`) is widened by migration `supabase/migrations/0002_richer_blocks_check.sql` to include `image-row` (back-fix) plus every new variant name that lands in this spec. Verified by `psql ... -c "SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = '<name>'"`.

**AC4.** Every row in `manual_blocks` carries a `schema_version` field inside `content`. The migration script `supabase/migrations/0003_schema_version_backfill.sql` defaults existing rows to `1`; new variants land at `2`. Verified by `SELECT DISTINCT content->>'schema_version' FROM manual_blocks` returning at least `1` (and `2` once new variants ship).

**AC5.** The Zod discriminated-union validator at `src/lib/manuals/block-schema.ts` rejects invalid blocks at `/api/manuals/[manualId]/blocks` POST and PUT with structured error code `INVALID_BLOCK` and a human-readable message. Verified by integration test at `src/app/api/manuals/[manualId]/blocks/route.spec.ts` asserting on the response shape.

**AC6.** The backward-compat parser at `src/lib/manuals/block-parser.ts` loads every row of `manual_blocks` from a clone of production, producing zero throws. Rows that fail strict validation fall back to a `{ kind: 'unknown', raw: <original> }` block that the renderer degrades gracefully. Verified by running the parser script over the staging clone and asserting zero throws plus a published count of fallback rows in `_qie-output/roses-os/prod-row-validation-<date>.md`.

**AC7.** The rich-text engine decision (TipTap or Lexical) is recorded in `ARCHITECTURE.md` decision D-3 citing the T-004 and T-005 spike evidence (bundle size, paste-from-Word behavior, RSC compatibility on Next 16). Verified by reading D-3 in the committed `ARCHITECTURE.md`.

**AC8.** `src/components/manuals/blocks/TextBlock.tsx` no longer calls `document.execCommand`. The replacement engine writes canonical JSON conforming to the v1 schema. Verified by `grep -r "document.execCommand" src/` returning zero hits in `src/components/manuals/`.

**AC9.** Each new block primitive named in scope (callout, quote, numbered-exercise, captioned-figure, spoken-instruction, two-column-section, table, footnote, glossary) ships in `src/components/manuals/blocks/<BlockName>/` with `index.tsx`, `schema.ts`, `default.ts`, `preview.tsx`, plus a Storybook entry at `stories/<BlockName>.stories.tsx`, plus a JSONB round-trip unit test. Verified by file existence per block + `pnpm test` passing on the per-block round-trip suites.

**AC10.** Block-type count after M3 is strictly less than 12. Verified by counting variant names in the `BlockType` discriminated union in `src/lib/manuals/types.ts`.

**AC11.** The live preview component `src/components/manuals/PreviewPane.tsx` renders the canonical JSON client-side with the shared print CSS within 800ms of edit on a `5000ms` slow-3G profile in Chrome DevTools throttling. Verified by manual stopwatch + a `pnpm test:e2e preview-perf` budget assertion.

**AC12.** Drag-reorder works via mouse AND keyboard (`dnd-kit` with the `KeyboardSensor` registered). Verified by `pnpm test:e2e drag-keyboard` asserting reorder via `Tab` + `Space` + arrow keys.

**AC13.** `reorderBlocks` in `src/lib/manuals/db.ts` runs as a single Postgres transaction (via RPC `reorder_blocks_atomic`). Verified by an integration test that fires two concurrent reorders against a seeded manual and asserts the final order matches the last successful write, with zero partial states.

**AC14.** Autosave conflict surfaces a visible banner in the editor when a 409 is returned (precondition on `updated_at` failed), naming the other editor by PIN role and offering a refresh button. Verified by integration test simulating two PUTs with stale `updated_at`.

**AC15.** The editor refuses save when the canonical JSON fails Zod validation, surfaces the validation error inline next to the offending block, and does not call the API. Verified by Playwright test that mutates a callout to an invalid state and asserts the API was not called.

**AC16.** The locale-gap indicator on the editor shows, per manual, which of the 6 declared locales (`en`, `pt`, `es`, `el`, `ru`, `uk`) carry zero blocks vs partial-coverage vs full-coverage. Verified by manual walk on `/manuals/aura-level-1/edit` and a screenshot in the Mockup section.

**AC17.** Telemetry events fire on block-add, block-delete, block-edit-then-undo, routed through `src/lib/telemetry/track.ts` with no direct PostHog import. Verified by `grep -r "posthog\." src/components/manuals/` returning zero hits.

**AC18.** Sentry breadcrumbs tagged `manual_id`, `language`, `schema_version` appear on block-load, block-save, block-validate. Verified by Sentry MCP query for breadcrumbs on the staging project.

**AC19.** The PIN-gated `/manuals/_status` page renders the last migration run timestamp, the count of rows per `schema_version`, and the list of rows where the parser fell back to `unknown`. Verified by GET on the route while authenticated as admin PIN.

**AC20.** The 7-day staging soak runs against a snapshot of production `manual_blocks` cloned into a staging Supabase project. Pass = zero unparseable rows, zero Zod validation failures across all rows. Verified by the soak-runner script publishing `_qie-output/roses-os/staging-soak-<date>.md` with the pass/fail line.

## Mockup

The user-facing surface was designed before implementation via a Phase 4.5 deliberation with Kaze and Sally. The frozen mockup lives at `./mockups/index.html` and is the visual contract any /develop run inherits.

- **Screens covered:** Editor canvas with new block palette; section with two-column + callout populated; preview mode side-by-side with `docs/canon/Aura 1 - Jan2026.pdf`.
- **States:** empty (no blocks yet), loading (saving in flight), populated (3 fixture volumes: 1 block / ~50 blocks / ~200 blocks), error (Zod-rejected save + 409 conflict + 403 stale PIN).
- **Iterations:** see `./mockups/iterations.md`.
- **Design panelists:** Kaze, Sally.

## Open questions

**OQ1 (load-bearing).** Is the "model is lossy" framing correct? Mar`ah's review argues 60% of the canon-vs-current delta is exporter chrome, 25% one missing primitive, 15% authoring UX, and that a TipTap/Lexical rewrite solves the wrong 15%. The other panelists (Winston, Amelia, Kaze, Alexander, Lattice) frame the block model as load-bearing. **Resolver:** AC1 + AC2 (M0 visual-diff harness + kill-or-proceed gate). **Default if no signal:** proceed with the full rewrite. **Right person:** the gate itself; the data resolves it.

**OQ2.** TipTap vs Lexical. Winston picks TipTap; Amelia notes RSC compatibility risk on Next 16; Mar`ah requires both spikes before commitment. **Resolver:** T-013 + T-014 spikes. **Default if no signal:** TipTap. **Right person:** Winston with Amelia consultation.

**OQ3.** Where the canonical print CSS lives. Sharing one stylesheet between the React preview and Puppeteer couples to the export worktree's structure. **Resolver:** deferred to M5 after `faithful-pdf-export` lands on `main`. **Default:** duplicate temporarily, dedupe later.

**OQ4.** Corner-frame brackets. Kaze's finding: page-template chrome, not block. **Default:** page-template layer (`src/components/manuals/PageTemplate.tsx`), set per-manual via a manual-level config row, not per-block.

**OQ5.** Telemetry backend. PostHog (org standard) vs other. Per-block events may overload the free tier. **Default:** PostHog behind `track()` helper, swappable.

## Panelists who contributed

- **Winston** (BuildOS architect, architecture-author): system shape, 10 decisions, CHECK-before-TS sequencing, discriminated union + Zod validation.
- **Amelia** (BuildOS dev): smallest-first-version (callout + 3 marks), bundle weight risk, the CHECK-vs-TS drift on `image-row`.
- **Kaze** (creative direction): visual-pattern inventory, page-template-chrome distinction (corner frames), discipline-as-product (marks closed, no toolbar).
- **Alexander** (InvestOS, paid product): migration safety, parser fallback to `unknown`, prod-row validation surface, 7-day staging soak.
- **Mar`ah** (SoulOS Mirrorblade): adversarial reframe (60/25/15 split), M0 kill-or-proceed gate, sacred-check Truth + Beauty notes.
- **Lattice** (BusinessOS structural): precondition-not-sibling sequencing call, schema-version-per-row mandate, adapter audit enumeration.
