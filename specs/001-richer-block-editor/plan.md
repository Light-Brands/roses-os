# Plan: Richer block editor for Roses OS manuals

## Architecture sketch

The editor today is a flat list of blocks where each block is a row in `manual_blocks` with a `content JSONB` column. `BlockEditor.tsx` renders a `Reorder.Group` (Framer Motion) over the rows, with one component per `block_type`. `TextBlock` is a `contentEditable` div populated by `document.execCommand`, so `content.html` is whatever the browser wrote. There is no validation at the API boundary. There is no schema version per row. The exporter (`export-html.ts`) flattens the tree into a single hand-rolled HTML document.

The reform reshapes this around a closed contract:

```
+----------------------------------------------------+
|  src/lib/manuals/types.ts                          |
|    BlockType = discriminated union (v1)            |
|    schema_version: 1 | 2 baked into each Block     |
+----------------------------------------------------+
                  |
                  v
+----------------------------------------------------+
|  src/lib/manuals/block-schema.ts                   |
|    Zod discriminated union per BlockType           |
|    Parser with fallback to { kind: 'unknown' }     |
+----------------------------------------------------+
                  |
        +---------+---------+
        v                   v
+---------------+   +-------------------+
|  API gates    |   |  Engine wrapper   |
|  POST/PUT     |   |  (TipTap default) |
|  reject       |   |  Marks closed     |
|  invalid      |   |  -> canonical JSON|
+---------------+   +-------------------+
                  |
                  v
+----------------------------------------------------+
|  Block registry per-block co-located               |
|    src/components/manuals/blocks/<Block>/          |
|      index.tsx (renderer)                          |
|      schema.ts (Zod)                               |
|      default.ts (default content)                  |
|      preview.tsx (print-CSS view)                  |
+----------------------------------------------------+
                  |
        +---------+---------+
        v                   v
+---------------+   +-------------------+
| Editor canvas |   |  Live preview     |
| dnd-kit       |   |  (client-side,    |
| keyboard a11y |   |   shared print CSS)|
+---------------+   +-------------------+
                                |
                                v
                  +-------------------+
                  | "Final check"     |
                  | button -> request |
                  | Chromium adapter  |
                  | (sister arc)      |
                  +-------------------+
```

Page-template chrome (corner-frames per Kaze's finding) lives at `src/components/manuals/PageTemplate.tsx`, set per-manual via a manual-level config row. Not a block. Set once.

## Sequencing

Seven milestones. Cohort caps ≤10 children each per genesis-build §J. Total atomic tasks listed below = 56.

| Milestone | Theme | Cohort size | Rough effort |
| --- | --- | --- | --- |
| M0 | Kill-or-proceed gate (Mar`ah's harness + classification + decision) | 4 | 2-3 days |
| M1 | Inventory + schema + migration foundation | 10 | 1 week |
| M2 | Rich-text engine decision + adoption | 8 | 1 week |
| M3 | First-class block primitives derived from canon | 10 | 2 weeks |
| M4 | Layout containers + page-template chrome + typography tokens | 8 | 1 week |
| M5 | Live preview + autosave + transactional reorder | 8 | 1 week |
| M6 | Validation + locales + observability + staging soak | 8 | 1 week (+7 days soak) |

Total wall-clock: 7 to 8 weeks counting the soak.

### M0 — Kill-or-proceed gate (4 tasks)

- **T-001** Build visual-diff harness at `scripts/canon-diff.ts`: render each of the 4 manuals through the in-flight `roses-os--faithful-pdf-export` worktree's Chromium adapter using only today's 6 block types + a single hand-tuned `section` wrapper in the Chromium template. Output: per-page rendered PNG.
- **T-002** Pixel-diff each rendered page against the matching page of the canon PDF in `docs/canon/`. Publish per-page scores to `_qie-output/roses-os/canon-diff-baseline-2026-05-28.md`.
- **T-003** Classify each delta as `exporter-chrome` OR `model-missing` OR `authoring-ux`. One row per delta. Publish as table in the same file.
- **T-004** Kill-or-proceed gate decision. Rule: proceed with full rewrite iff `model-missing` ≥ 25% of delta surface across all 4 manuals. Otherwise re-scope spec to exporter-first + 2 primitives + UX. Decision recorded at `_qie-output/roses-os/m0-gate-decision.md`.

### M1 — Inventory + schema + migration foundation (10 tasks)

- **T-005** Pattern inventory across the 4 PDFs in `docs/canon/`. Each pattern labeled BLOCK, EXPORTER, WRAPPER, or PAGE-TEMPLATE. Published at `docs/canon/patterns.yaml`.
- **T-006** Extend `BlockType` discriminated union in `src/lib/manuals/types.ts` with every BLOCK-labeled variant from T-005 (still under 12 total).
- **T-007** Migration `supabase/migrations/0002_richer_blocks_check.sql` widens the `block_type` CHECK constraint at `manuals-schema.sql:79` to include `image-row` (back-fix) + every new variant. Includes rollback script.
- **T-008** Migration `supabase/migrations/0003_schema_version_backfill.sql` adds `schema_version` field inside every row's `content` JSONB; backfill existing rows to `1`.
- **T-009** Discriminated `BlockContent` per variant with `schema_version: 1 | 2` baked in.
- **T-010** Zod schemas per variant at `src/lib/manuals/block-schema.ts` as `z.discriminatedUnion('schema_version', [v1, v2])`.
- **T-011** Backward-compat parser at `src/lib/manuals/block-parser.ts` that loads every existing `content` shape, falls back to `{ kind: 'unknown', raw: <original> }` for unparseable rows, logs fallback count.
- **T-012** Snapshot the 4 seeded manuals + a clone of production `manual_blocks` rows to `supabase/backups/<date>/` (scripted, re-runnable). Run parser over the snapshot, publish `_qie-output/roses-os/prod-row-validation-<date>.md`.
- **T-013** Block registry contract at `src/lib/manuals/block-registry.ts`: each block declares `kind`, `validator`, `defaultContent`, `renderer`, `serializeHtml`, `serializeMd`. Central registry assembles them.
- **T-014** Adapter audit: enumerate every consumer of `TextContent.html` (`export-html.ts`, `export-md.ts`, sister-arc `synthesize-rhythm.ts` when it lands, `import-manuals-to-blocks.ts`). Build adapters that read from canonical JSON via the registry serializers. Published list at `_qie-output/roses-os/adapter-audit-<date>.md`.

### M2 — Rich-text engine decision + adoption (8 tasks)

- **T-015** TipTap spike on a throwaway branch: `TextBlock` with strict schema (paragraph, strong, em, ul, ol, link, softBreak). Measure bundle delta, paste-from-Word behavior, Next 16 RSC compatibility.
- **T-016** Lexical spike on a throwaway branch: same scope as T-015. Same measurements.
- **T-017** Decision recorded in `ARCHITECTURE.md` D-3 citing T-015 + T-016 evidence (bundle size, paste behavior, RSC fit).
- **T-018** Engine wrapper at `src/lib/manuals/richtext/engine.tsx` with the closed mark/node list. No toolbar (Kaze discipline rule).
- **T-019** Canonical-JSON serializer at `src/lib/manuals/richtext/serializer.ts`: engine state to our JSON node tree.
- **T-020** Canonical-JSON deserializer at `src/lib/manuals/richtext/deserializer.ts`: our JSON node tree to engine state.
- **T-021** Replace `TextBlock.tsx` `contentEditable` with the engine wrapper; dynamic-imported on `/manuals/[slug]/edit` only.
- **T-022** Paste sanitizer at `src/lib/manuals/richtext/paste-sanitizer.ts` with allow-list; integration tests on Word, Notion, Google Docs paste at `src/lib/manuals/richtext/paste-sanitizer.spec.ts`.

### M3 — Block primitives from canon (10 tasks)

The primitive list closes after T-005. The list below is the panel's union projection; the inventory task may swap names or merge variants. Block-type count after M3 stays strictly less than 12 (AC10).

- **T-023** `CalloutBlock` (callout body + variant chip).
- **T-024** `QuoteBlock` (tinted blockquote with left-rule).
- **T-025** `NumberedExerciseBlock` (outsize numeral + body, hanging-indent friendly).
- **T-026** `CaptionedFigureBlock` (image + italic terracotta caption).
- **T-027** `SpokenInstructionBlock` (orange rose-icon marker + bold quoted text the practitioner says aloud — Kaze's signature pattern from Aura).
- **T-028** `TableBlock` (simple table with header row).
- **T-029** `FootnoteBlock` with refs (inline footnote refs + footnote definitions at section end).
- **T-030** `GlossaryBlock` (term + definition pairs).
- **T-031** `CoverBlock` (title + author + illustrator credits + cover image).
- **T-032** Eyebrow + h1 paired `HeadingBlock` variant (extends current heading).

### M4 — Layout containers + page-template chrome (8 tasks)

- **T-033** `SectionBlock` as parent with `children: Block[]`.
- **T-034** `TwoColumnBlock` as parent with `children: Block[]`.
- **T-035** Drag-reorder replaces `Reorder.Group` with `dnd-kit` at `BlockEditor.tsx`. Keyboard sensor registered.
- **T-036** Drop-into-container for nested sections + two-column children.
- **T-037** Page-aware preview boundaries (CSS `break-inside`, `break-after`).
- **T-038** `PageTemplate.tsx` at `src/components/manuals/PageTemplate.tsx` carrying corner-frame chrome per Kaze. Set per-manual via a manual-level config row.
- **T-039** Typography tokens at `src/lib/manuals/typography.ts` (Cormorant Garamond, body sans, eyebrow caps, terracotta + plum + mute-gold palette).
- **T-040** Block palette redesign as "Brand Wall" per Kaze: every block traces to a named PDF pattern, no orphan options.

### M5 — Live preview + autosave + transactional reorder (8 tasks)

- **T-041** `PreviewPane.tsx` reads canonical JSON, applies shared print CSS, renders client-side within 800ms budget (AC11).
- **T-042** Shared print CSS extracted to `src/lib/manuals/print.css` consumed by both `PreviewPane` and (once sister-arc lands) the Chromium adapter.
- **T-043** "Final check" Chromium render button calls the sister-arc `/api/manuals/[manualId]/pdf` endpoint when available.
- **T-044** `reorderBlocks` in `src/lib/manuals/db.ts` wrapped in single Postgres RPC `reorder_blocks_atomic` (transactional).
- **T-045** Concurrent-reorder integration test at `src/lib/manuals/db.spec.ts`.
- **T-046** Autosave precondition on `updated_at`; 409 surfaces banner naming other editor.
- **T-047** Undo/redo stack scoped to the active manual editing session.
- **T-048** Telemetry hooks emit through `src/lib/telemetry/track.ts` (no direct PostHog import per AC17).

### M6 — Validation + locales + observability + soak (8 tasks)

- **T-049** Editor refuses save when canonical JSON fails Zod validation; surfaces error inline next to the offending block.
- **T-050** Locale-aware block surface; per-locale tabs already in place gain per-block locale indicators.
- **T-051** Locale-gap indicator on the editor: per-manual which locales carry zero / partial / full coverage.
- **T-052** Sentry breadcrumbs tagged `manual_id`, `language`, `schema_version` on block-load, block-save, block-validate.
- **T-053** PIN-gated `/manuals/_status` page exposing last migration run, schema-version-per-row count, parser-fallback row list.
- **T-054** Public root status entry for any write-pause window (default plan: zero downtime, additive only; entry stays empty if achievable).
- **T-055** Block deprecation policy at `src/lib/manuals/block-deprecation.md`: a block unused for 90 days enters a deprecation runway (visible in palette only, then removed at next major). Mar`ah's graveyard guardrail.
- **T-056** 7-day staging soak runner at `scripts/staging-soak.ts` runs against a snapshot of production `manual_blocks` in a staging Supabase project. Pass = zero unparseable rows + zero validation failures. Publishes `_qie-output/roses-os/staging-soak-<date>.md`.

## Risks (top 5, each with mitigation)

| # | Risk | Mitigation |
| --- | --- | --- |
| R1 | Schema-CHECK drift causes silent insert failures on the PIN that pays. | T-007 widens CHECK FIRST; T-013 backward-compat parser falls back to `unknown`; AC2 + AC5 verify. |
| R2 | Rich-text rewrite without strict allow-list inherits Word-paste garbage. | T-022 paste sanitizer + AC8 grep + Kaze marks-closed discipline + AC10 block-type ceiling. |
| R3 | Block proliferation graveyard ("22 types, 14 used twice"). | T-055 deprecation runway + AC10 < 12 block ceiling + every block traces to inventoried PDF pattern (T-005). |
| R4 | Sister-arc `faithful-pdf-export` PR lands first and bakes lossy contract into renderer. | This spec is precondition; sequence schema v1 before renderer cuts. M0 visual-diff harness depends on sister-arc adapter being available locally; if PR lands on main first, M0 pivots to main path. |
| R5 | Migration validation that only touches the 4 seeded manuals misses what production editors typed in. | T-012 snapshots prod, runs parser; AC6 verifies; T-056 7-day staging soak against prod snapshot. |

## Dependencies

- **Sister arc `faithful-pdf-export`** (worktree `clients/light-brands/.worktrees/roses-os--faithful-pdf-export`). M0 needs the Chromium adapter from that worktree available locally. M5's "final check" Chromium button needs the sister PR to have landed on `main`. If sister PR lands first, this spec adapts; if not, M5 ships preview-only and the button is added in a follow-on commit.
- **Supabase staging project**. T-056's 7-day soak needs a staging project cloned from prod schema; not yet provisioned at spec-land time.
- **Sentry project `light-brands-ai/roses-os`**. T-052 needs the project configured per the observability stack standard practice.
- **PostHog `track()` backend choice**. T-048 emits through the helper; the backend (PostHog vs other) is deferred but the helper is shipped.

## Cost-shaped considerations

- **Bundle size.** TipTap-core + StarterKit is 80-120kb gzipped (Amelia). Repo ships three.js + framer-motion. Editor bundle could cross 500kb without dynamic-import. T-021 dynamic-imports on `/manuals/[slug]/edit` only.
- **Per-block telemetry cost.** PostHog free tier could throttle if event volume per block-edit is high. T-048's `track()` helper lets us swap backends without code churn.
- **Operator attention.** This spec is 56 tasks across 7 weeks. Sister arc takes its own ~2 weeks to land. Live curators on roses-os should expect a window of dual-pipeline coexistence; status page (T-053) and Sentry tagging (T-052) carry the burden of visibility.

## Strict-local handoff to /develop

Per `[[feedback_develop_local_first]]` and Section G of `genesis-spec.md`: /develop drains this spec in strict-local mode. No AC assumes "after the PR merges". M5's T-043 ("Final check" Chromium button) is the one task that depends on sister-arc main-merge; if /develop runs before the sister PR lands, T-043 ships preview-only with the button stubbed and a follow-on commit wires the call.

## Live URL

The Phase 4.5 mockup serves at: see closing message + `mockups/iterations.md`.
