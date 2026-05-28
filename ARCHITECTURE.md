---
last_spec: 001-richer-block-editor
last_updated: 2026-05-28
mode: create
---

# Roses OS — Architecture

First formal architecture doc for `Light-Brands/roses-os`. Landed by /create-spec run `editor-richer-blocks-20260528-175200` as part of spec `001-richer-block-editor`. Future specs that touch architectural choices append decisions or supersede existing ones in place; the file is append-only by ordinal and the decision log is the audit trail.

## Source

- `./specs/001-richer-block-editor/spec.md`
- `./specs/001-richer-block-editor/plan.md`
- `./specs/001-richer-block-editor/.deliberation/`

## 1. System shape

Roses-os is a Next.js 16 app (App Router, Turbopack) serving a spiritual-education platform: public reading surface, PIN-gated manual editor, build-time PDF pipeline. Backend is Supabase Postgres with public-readable RLS plus PIN auth at the app layer. Visual surface uses Three.js for RoseCanvas and Tailwind with Cormorant Garamond. PDFs are produced at build time by `scripts/build-manuals.ts` and, in the sister `faithful-pdf-export` worktree, at request time through a Chromium adapter behind `/api/manuals/[manualId]/pdf`.

| Module | Boundary |
| --- | --- |
| `src/app/**` | HTTP routes, server components |
| `src/components/manuals/**` | Editor surface, block components, page template |
| `src/lib/manuals/**` | Schema, exporters, db helpers, PIN auth, richtext engine |
| `src/lib/telemetry/**` | `track()` helper, backend-swappable |
| `supabase/manuals-schema.sql` + `supabase/migrations/**` | Postgres tables, RLS, seed, migrations |
| `scripts/build-manuals.ts` + `scripts/canon-diff.ts` + `scripts/staging-soak.ts` | Build-time and offline pipelines |
| `docs/canon/*.pdf` | Source-of-truth PDFs the editor must reproduce |

The boundary that mattered most before this spec was between `src/lib/manuals/types.ts` (schema the database trusts) and `src/components/manuals/blocks/*` (views over that schema). It was leaky because `TextContent = { html: string }` let the editor write anything `document.execCommand` produced. This architecture re-cuts the boundary so the schema is closed, the engine is a wrapper, and the canonical JSON is owned by the schema, not by any third-party library.

## 2. Decision log

### D-1. Block model is a discriminated union, not a free shape

**Chosen:** `type Block = TextBlock | HeadingBlock | CalloutBlock | ...`, each variant with a literal `kind` and a closed content shape. Each row carries `schema_version` inside `content`.

**Alternatives:** stay with open `BlockContent` union (no validation, current state); fully generic `{ type, content: unknown }` (loses static safety); subtype tables per block type (loses JSONB flexibility, harder migration).

**Why won:** exhaustively checkable in TS and Zod; renderer `switch` proves no case is missed; future readers (reader app, search index, translation tooling) can derive everything from one schema.

**Why others lost:** open union accepts garbage today and has done so; generic shape pushes errors to runtime with no compiler help; subtype tables fight Supabase's JSONB strengths and complicate migrations.

**Implications:** every new block type is a code change, not a config. That is the price of fidelity.

**Panelist source:** Winston, Amelia, Lattice.

### D-2. Schema validation at the API boundary uses Zod

**Chosen:** Zod per variant, validated at every `POST`/`PUT` route in `/api/manuals/[manualId]/blocks` before writing JSONB. Errors return `{ code: 'INVALID_BLOCK', message }`.

**Alternatives:** Yup (weaker TS inference); hand-rolled guards (no runtime messages); no validation (current state).

**Why won:** Zod's TS inference produces the discriminated union for free; the validator is one source of truth for the API gate and the editor pre-save check.

**Why others lost:** Yup forces double-declaration; hand-rolled guards drift; no validation is the bug class this spec exists to close.

**Implications:** invalid blocks fail at the API with a structured error, not at the renderer with a blank screen.

**Panelist source:** Winston, Lattice.

### D-3. Rich-text engine is TipTap by default, wrapped behind our serialization contract

**Chosen:** TipTap (ProseMirror) with a custom serializer to and from a canonical JSON node tree owned by us. Marks closed at `bold`, `italic`, `link`, `bulletList`, `orderedList`, `softBreak`. No toolbar. Default decision; final commitment after T-015 (TipTap spike) and T-016 (Lexical spike) evidence lands.

**Alternatives:** Lexical (smaller ecosystem, harder custom marks, RSC compatibility uncertain on Next 16); Plate (heavier, less stable on Next 16 RSC); hand-rolled `contentEditable` (current state, breaks across browsers).

**Why won:** ProseMirror's schema model matches our discriminated union; we can constrain marks/nodes to what canon PDFs need.

**Why others lost:** Lexical's strength is collaborative editing (out of scope per D-9); Plate's stack assumptions clash with Next 16 Turbopack; `document.execCommand` is deprecated and produces inconsistent HTML across browsers.

**Implications:** the wire format is OUR JSON, not TipTap's `JSONContent`. If we swap engines, the data outlives the engine.

**Panelist source:** Winston, Amelia, Mar`ah.

### D-4. JSONB migration is additive and version-tagged

**Chosen:** add `schema_version` to every block's `content`, default existing rows to `1`, new variants land at `2`. Zod validator is `z.discriminatedUnion('schema_version', [v1, v2])`. Backward-compat parser falls back to `{ kind: 'unknown', raw: <original> }` rather than throwing.

**Alternatives:** forward-only with backfill (breaks rollback); per-table column for type (loses JSONB flexibility); single-version validator that rejects legacy rows (closes the manual for paying teachers).

**Why won:** the four seeded manuals load unchanged while new variants ship behind their own validator. The `unknown` fallback turns an unexpected legacy shape into a graceful degrade.

**Why others lost:** forward-only is irreversible at scale; per-table type loses the flexibility JSONB exists to provide; reject-legacy is malpractice against the PIN that pays.

**Implications:** the renderer also branches on `schema_version`. Delete `v1` only after a manual backfill milestone, never automatically.

**Panelist source:** Winston, Alexander, Lattice.

### D-5. Postgres `CHECK` constraint expands before the TS union

**Chosen:** M1's first migration relaxes `block_type IN (...)` to include every new variant name BEFORE any code references those names. Including back-fix for `image-row` which is in TS but missing from the live CHECK (drift documented in Amelia's review).

**Alternatives:** ship CHECK and code in same PR (no rollback); drop CHECK entirely (loses integrity); replace CHECK with permissive whitelist (Alexander's reading) plus server-side validator.

**Why won:** phased expansion is reversible; the database becomes ready before the code needs it; the existing CHECK retains its integrity role.

**Why others lost:** same-PR is fragile under partial-rollout; dropping CHECK loses a defense-in-depth layer; permissive whitelist loses the constraint's value.

**Implications:** a database migration always precedes a code release; never the other way. Every spec that adds a block type has this same ordering.

**Panelist source:** Winston, Amelia, Alexander.

### D-6. Live preview is client-side, with a final-check Chromium render on demand

**Chosen:** `PreviewPane.tsx` consumes the canonical JSON the editor writes and applies the shared print CSS. The `faithful-pdf-export` Chromium render is reached by explicit button.

**Alternatives:** iframe postMessage with the print template (extra ceremony for same DOM); server fragment per save (latency and cost); WebSocket render (overkill).

**Why won:** the print CSS is static; the canonical JSON is small; sub-800ms preview is reachable on slow-3G.

**Why others lost:** every server round-trip in the typing loop kills the live preview feel.

**Implications:** the print CSS becomes shared code between preview and Puppeteer. One stylesheet, two consumers. Dedup deferred until sister arc lands on `main` (see Open questions).

**Panelist source:** Winston, Amelia.

### D-7. Drag-reorder uses `dnd-kit`, not Framer Motion `Reorder`

**Chosen:** `dnd-kit` replaces the `Reorder.Group` and `useDragControls` setup in `BlockEditor.tsx`. `KeyboardSensor` registered. Animation is layered via `framer-motion` `layout` prop.

**Alternatives:** keep Framer Motion `Reorder` (no drop-into-container for nested sections, no keyboard sensor); `react-beautiful-dnd` (unmaintained); native HTML5 drag (no keyboard parity).

**Why won:** `dnd-kit` supports nested drop targets needed by `SectionBlock` and `TwoColumnBlock`; ships keyboard sensors; active maintenance.

**Why others lost:** Framer Motion is animation-first, not drag-first; `react-beautiful-dnd` is archived; native HTML5 forces us to rebuild a11y.

**Implications:** `Reorder.Item` becomes a `SortableContext` child. Existing motion animations stay via `framer-motion layout`.

**Panelist source:** Winston, Amelia, Mar`ah (a11y catch).

### D-8. Sections and columns are parent blocks with children, not flat markers

**Chosen:** `SectionBlock` and `TwoColumnBlock` carry `children: Block[]`. Renderer is a recursive function over the tree.

**Alternatives:** flat list with `section-open` / `section-close` markers (simpler DB, harder rendering); sibling sections via `parent_id` column on `manual_blocks` (extra DB query per section).

**Why won:** matches canon nested layout; renderer recursion mirrors the canon structure; one JSONB row per section keeps the editor's DB ops simple.

**Why others lost:** flat markers are an old-CMS pattern that the engine has to repeatedly stitch; parent-id forces N+1 reads.

**Implications:** the JSONB row for a section contains its children inline. Read-amplification for rendering simplicity is the accepted trade.

**Panelist source:** Winston.

### D-9. Autosave conflict resolution is last-write-wins with a visible banner

**Chosen:** keep the debounced `PUT`, add an `updated_at` precondition; on 409 refresh the block and show a banner naming the other editor by PIN role. Single-transaction reorder via Postgres RPC `reorder_blocks_atomic`.

**Alternatives:** CRDT (Yjs, weeks of work, real-time collab non-goal); operational transform (heavier still); silent overwrite (current state, lost edits).

**Why won:** the editor is PIN-gated to a small group; conflict rate is low; the banner makes the trade visible.

**Why others lost:** CRDT is over-engineered for the operating volume; OT compounds complexity; silent overwrite loses teacher work.

**Implications:** if we ever need real-time collab, the canonical JSON tree is CRDT-amenable (see Non-goals).

**Panelist source:** Winston, Alexander.

### D-10. Block schema registry is per-block co-located

**Chosen:** each block lives in `src/components/manuals/blocks/<BlockName>/` with `index.tsx`, `schema.ts`, `default.ts`, `preview.tsx`. A central `src/lib/manuals/block-registry.ts` assembles them.

**Alternatives:** centralized schema file (merge conflicts); separate schema and component trees (drift); inline per-component schema declarations (no central registry).

**Why won:** the cognitive unit is the block; adding a block is one folder and one registry line.

**Why others lost:** central files become merge hotspots; separated trees drift silently.

**Implications:** the block-registry contract from T-013 is the canonical interface every block honors. Adapters in `export-html.ts`, `export-md.ts`, sister-arc `synthesize-rhythm.ts`, and `import-manuals-to-blocks.ts` consume the registry, not the per-block files.

**Panelist source:** Winston, Lattice.

### D-11. Page-template chrome lives outside the block model

**Chosen:** corner-frame brackets (visible on every Rose Level 1 page) and any other repeated page-template chrome render at `src/components/manuals/PageTemplate.tsx`. Set per-manual via a manual-level config row. Not a block.

**Alternatives:** model corner-frames as a `frame` block placed first on every page (CRUD-style, what the codebase would naturally suggest); render-time decoration in the Chromium template only (loses preview fidelity); skip them (loses the platform's signature).

**Why won:** corner-frames are page-template chrome, not authored content. Modeling them as blocks creates a maintenance burden (every page needs the block, authors forget, layout breaks). The page-template layer is the natural seam.

**Why others lost:** block-modeling treats template chrome as content; template-only loses live-preview fidelity; skipping erodes the canonical signature.

**Implications:** the `manuals` table grows a config column (or a sibling `manuals_template` table) carrying per-manual template options. Reader and editor share the same template.

**Panelist source:** Kaze (load-bearing find).

## 3. Conventions

- Kebab-case for utilities, PascalCase for React components.
- Block files live in `src/components/manuals/blocks/<BlockName>/` with `index.tsx`, `schema.ts`, `default.ts`, `preview.tsx`.
- API errors carry `{ code, message }`. The client maps codes to user-visible strings.
- Telemetry events go through `src/lib/telemetry/track.ts`. No direct PostHog import in `src/components/manuals/`.
- No `document.execCommand` in new code. The engine wrapper owns formatting.
- Every database migration ships with a matching rollback script in `supabase/migrations/`.
- Block primitives trace to a named PDF pattern in `docs/canon/patterns.yaml`. Orphan blocks are rejected at panel review.
- Block-type count stays under 12 (Mar`ah deprecation guardrail). Deprecation runway: a block unused 90 days enters palette-only visibility, removed at next major.

## 4. Non-goals

- Real-time collaborative editing. Canonical JSON tree is CRDT-amenable; the engine and validators do not assume a single writer at the protocol level but the runtime ships single-writer-with-LWW.
- Mobile-native editing surface. Mobile reading stays a first-class concern; mobile editing is desktop-first with read-only mobile preview.
- General CMS beyond the 4 manuals. The schema is fitted to the canon, not to arbitrary content.
- Replacing the build-time PDF pipeline (`scripts/build-manuals.ts`). The request-time Chromium adapter coexists.
- Translation workflow tooling. Locale plumbing is supported; translation drift detection and translator UI are future specs.
- Rich-text engine swap on the same canonical JSON. If a swap is ever needed, it ships as its own spec; D-3's serialization contract is what makes it possible without data loss.

## 5. Open architectural questions

- **Where the canonical print CSS lives** (D-6 continuation). Sharing one stylesheet between the React preview and Puppeteer couples to the sister-arc worktree's structure. Deferred to M5 after `faithful-pdf-export` lands on `main`. Fallback: duplicate temporarily, dedupe later.
- **Telemetry backend** (D-2 continuation). PostHog is the org standard per observability stack standard practice, but per-block events may overload the free tier. Deferred; emit through `track()` so the backend is swappable.
- **TipTap vs Lexical empirically** (D-3 continuation). The default is TipTap; T-015 + T-016 spikes deliver the empirical decision and the result lands in D-3 with citations. Fallback path: Lexical with the same canonical JSON contract (the contract makes either acceptable).
- **The "lossy" framing itself** (Mar`ah's challenge). M0 visual-diff harness + kill-or-proceed gate (AC1 + AC2) resolves whether the rich-text rewrite is warranted at all. If model-missing classification is below 25%, the spec re-scopes to exporter-first + 2 primitives + UX; the rich-text rewrite moves to a follow-on spec with empirical evidence. This architecture document assumes the proceed path; on a re-scope, D-3 and parts of D-6 stand down.
- **Manual-template config storage** (D-11 continuation). Per-manual page-template options need a home. Options: column on `manuals` (cheapest) vs sibling `manuals_template` table (cleanest). Default: column on `manuals` with JSONB; revisit if it grows beyond corner-frames.
