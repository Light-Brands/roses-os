# ARCHITECTURE.md draft: roses-os

Status: draft from Winston, Phase 5.1 of `/create-spec editor-richer-blocks`. First formal architecture doc for this repo. Lands at `clients/light-brands/roses-os/ARCHITECTURE.md`.

## 1. System shape

Roses-os is a Next.js 16 app (App Router, Turbopack) serving a spiritual-education platform: public reading surface, PIN-gated editor, build-time PDF pipeline. Backend is Supabase Postgres with public-readable RLS plus PIN auth at the app layer. Visual surface uses Three.js for RoseCanvas and Tailwind with Cormorant Garamond. PDFs are produced at build time by `scripts/build-manuals.ts` and, in the sister `faithful-pdf-export` worktree, at request time through a Chromium adapter behind `/api/manuals/[manualId]/pdf`.

| Module | Boundary |
| --- | --- |
| `src/app/**` | HTTP routes, server components |
| `src/components/manuals/**` | Editor surface, block components |
| `src/lib/manuals/**` | Schema, exporters, db helpers, PIN auth |
| `supabase/manuals-schema.sql` | Postgres tables, RLS, seed |
| `scripts/build-manuals.ts` | Build-time PDF pipeline |
| `docs/canon/*.pdf` | Source-of-truth PDFs the editor must reproduce |

The boundary that matters is between `src/lib/manuals/types.ts` (the schema the database trusts) and `src/components/manuals/blocks/*` (views over that schema). Today it is leaky because `TextContent = { html: string }` lets the editor write anything `document.execCommand` produces. The new architecture re-cuts this boundary so the schema is closed and the view is one of several renderers.

## 2. Decision log

**D-1. Block model is a discriminated union, not a free shape.**
Chosen: `type Block = TextBlock | HeadingBlock | CalloutBlock | ...`, each variant with a literal `kind` and closed content shape. Rejected: stay with open `BlockContent` union (no validation); fully generic `{ type, content: unknown }` (loses static safety). Union won because it is exhaustively checkable in TS and Zod; the renderer `switch` proves no case is missed. Implication: every new block type is a code change, not a config. That is the price of fidelity.

**D-2. Schema validation lives at the API boundary using Zod.**
Chosen: Zod per variant, validated in PUT and POST routes before writing JSONB. Rejected: Yup (weaker TS inference); hand-rolled guards (no runtime messages); no validation (current state). Zod won on TS inference. Implication: invalid blocks fail at the API with a structured error, not at the renderer with a blank screen.

**D-3. Rich-text engine is TipTap, wrapped behind a serialization contract.**
Chosen: TipTap (ProseMirror) with a custom serializer to and from a canonical JSON node tree owned by us. Rejected: Lexical (smaller ecosystem, harder custom marks); Plate (heavier, less stable on Next 16 RSC); hand-rolled `contentEditable` (current state, breaks across browsers). TipTap won because ProseMirror's schema model matches a discriminated union and we can constrain marks/nodes to what canon PDFs need. Implication: the wire format is OUR JSON, not TipTap's `JSONContent`. If we swap engines, the data outlives the engine. Amelia panelist source.

**D-4. JSONB migration is additive and version-tagged.**
Chosen: add `schema_version` to every block's `content`, default existing rows to `1`, new variants land at `2`. Zod validator is a `z.discriminatedUnion('schema_version', [v1, v2])`. Rejected: forward-only with backfill (breaks rollback); per-table column for type (loses JSONB flexibility). Version tag won because the four seeded manuals load unchanged while new variants ship behind their own validator. Implication: the renderer also branches on `schema_version`. Delete `v1` only after manual backfill.

**D-5. Postgres `CHECK` constraint expands before the TS union.**
Chosen: M1's first migration relaxes the `block_type IN (...)` CHECK to include every new variant name BEFORE any code references those names. Rejected: ship CHECK and code in same PR (no rollback); drop CHECK entirely (loses integrity). Phased expansion won because it is reversible and the database becomes ready before the code needs it. Implication: a database migration always precedes a code release; never the other way.

**D-6. Live preview is client-side, with a "final check" Chromium render on demand.**
Chosen: a `ManualPreview` component consumes the canonical JSON the editor writes and applies the print CSS. The `faithful-pdf-export` Chromium render is reached by explicit button. Rejected: iframe postMessage with the print template (extra ceremony for same DOM); server fragment per save (latency and cost); WebSocket render (overkill). Client preview won because the print CSS is already static and the canonical JSON is small. Implication: the print CSS becomes shared code between preview and Puppeteer. One stylesheet, two consumers.

**D-7. Drag-reorder uses `dnd-kit`, not Framer Motion `Reorder`.**
Chosen: `dnd-kit` replaces the `Reorder.Group` and `useDragControls` setup in `BlockEditor.tsx`. Rejected: keep Framer Motion (no drop-into-container for nested sections); `react-beautiful-dnd` (unmaintained); native HTML5 (no keyboard a11y). `dnd-kit` won because it supports nested drop targets needed by `SectionBlock` and `TwoColumnBlock`, and ships keyboard sensors. Implication: `Reorder.Item` becomes a `SortableContext` child. Animation is on us via `framer-motion` `layout`.

**D-8. Sections and columns are parent blocks with children, not flat markers.**
Chosen: `SectionBlock` and `TwoColumnBlock` carry `children: Block[]`. Rejected: flat list with `section-open` / `section-close` markers (simpler db, harder rendering); sibling sections via `parent_id` column. Parent-with-children won because the renderer is a recursive function over the tree and matches canon nested layout. Implication: the JSONB row for a section contains its children inline. We accept the read-amplification for rendering simplicity.

**D-9. Autosave conflict resolution is last-write-wins with a visible banner.**
Chosen: keep the debounced PUT, add an `updated_at` precondition; on 409 refresh the block and show a banner naming the other editor. Rejected: CRDT (Yjs, weeks of work, real-time collab is non-goal); operational transform (heavier still). LWW won because the editor is PIN-gated to a small group and realistic conflict rate is low. Implication: if we ever need real-time collab the canonical JSON tree is CRDT-amenable later.

**D-10. Block schema registry is per-block co-located.**
Chosen: each block file exports its variant interface, Zod schema, default content, and renderer. A central `block-registry.ts` assembles them. Rejected: centralized schema file (merge conflicts); separate schema and component trees (drift). Co-located won because the cognitive unit is the block. Implication: adding a block is one folder, one registry line.

## 3. Conventions

- Kebab-case for utilities, PascalCase for React components.
- Block files live in `src/components/manuals/blocks/<BlockName>/` with `index.tsx`, `schema.ts`, `default.ts`, `preview.tsx`.
- Errors across the API boundary carry `code` and `message`. The client maps codes to user-visible strings.
- Telemetry events go through a thin `track(event, props)` helper; backend choice deferred.
- No `document.execCommand` in new code. The engine wrapper owns formatting.

## 4. Non-goals

- Real-time collaborative editing.
- Mobile-native editing surface (read on mobile in scope; edit is not).
- A general CMS beyond the four manuals.
- Replacing the build-time PDF pipeline; the request-time adapter coexists.
- Translation workflow tooling. Locale plumbing supported; translation is a future spec.

## 5. Open architectural questions

- **TipTap vs Lexical.** Winston picks TipTap. Amelia's review may dispute on RSC compatibility. Fallback: Lexical with the same canonical JSON contract. Either works; the contract is what matters.
- **Where the canonical print CSS lives.** Sharing one stylesheet between the React preview and Puppeteer couples to the export worktree's structure. Deferred to M5 after `faithful-pdf-export` lands on `main`.
- **Telemetry backend.** PostHog is the org standard per observability stack, but per-block events may overload the free tier. Deferred; emit through `track()` so the backend is swappable.
