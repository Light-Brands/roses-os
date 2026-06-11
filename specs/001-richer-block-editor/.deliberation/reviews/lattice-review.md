# Lattice review — editor-richer-blocks

Structural-integrity lens. Where is the load going and can the form carry it.

## 1. What problem is this actually solving?

Structurally: this spec is a **precondition** to faithful-pdf-export, not a sibling. The sister arc shipped M1 locally on 2026-05-27 (chromium adapter + `/api/manuals/[manualId]/pdf` + print route + synthesize-rhythm scaffold). That pipeline assumes a block tree it can faithfully render. The current tree is lossy by construction (`TextContent = { html: string }`, 6 block types, no layout primitives). Until the editor produces a richer, validated tree, the renderer either invents structure at render time (drift) or renders an impoverished facsimile (faithful in name only).

The honest sequencing: faithful-pdf-export's render contract should be **frozen against the new block schema this spec defines**, not the legacy one. Shipping faithful-pdf-export PR on the legacy schema bakes the lossy model into the renderer's expectations, and the editor refactor then has to negotiate a schema change against a second consumer. The relationship deserves a named handoff: editor publishes schema vN, renderer consumes schema vN, schema versioning carries both.

## 2. What is the smallest first version that proves the idea?

The smallest provable version is **schema-only, no UI**. Concretely:

- `BlockType` union extended with the inventoried types (from M1 PDF walk).
- Discriminated `BlockContent` shape per type, with `schemaVersion: 1`.
- Zod or equivalent runtime validator at every read/write boundary (`/api/manuals/[manualId]/blocks` POST/PUT, page-load hydrator).
- Migration script that rewrites the 4 seeded manuals' JSONB rows from v0 to v1 with structural equivalence (lossless round-trip).
- Snapshot test: load → validate → save → reload → byte-equal for all 4 manuals across all locales present.

If this lands and the existing editor still renders the 4 manuals unchanged, the structural foundation is proven. No new block UI required yet.

## 3. What 3 structural risks would kill this if ignored?

1. **Shared-path merge collision with faithful-pdf-export.** Both arcs touch `src/lib/manuals/` and `types.ts`. faithful-pdf-export added `synthesize-rhythm.ts` and `synthesis-rules.ts` that almost certainly read block shapes. A `types.ts` rewrite without coordinated import paths will conflict in PR review and silently break the renderer.
2. **Rich-text decision binds downstream consumers the spec did not enumerate.** `export-html.ts`, `export-md.ts`, the synthesize-rhythm path, `import-manuals-to-blocks.ts`, and any future search index all consume `TextContent.html`. Replacing with a structured node tree (TipTap/Lexical) means every consumer needs an adapter. The spec must list them; missing one creates silent data loss on first export after migration.
3. **Schema version bound to render target.** If the new block schema encodes Chromium-specific layout hints (page-aware breaks, column widths in mm), the editor becomes coupled to the renderer. Schema must describe **intent** (two-column section, ranged callout) and leave **realization** to the renderer. Otherwise a future EPUB/web reader inherits PDF assumptions.

## 4. What does success look like at 90 days?

Second-order surfaces that move because this shipped:

- Translation tooling (`scripts/generate-translated-teachers-aid.ts`) gains structural anchors instead of raw HTML; translation drift across the 6 locales becomes detectable.
- The admin content surface (`(admin)/admin/content`) can read block usage telemetry and surface which block types are abandoned or breaking.
- A future reader/viewer surface (out of scope here) inherits the same schema and stays in sync.
- faithful-pdf-export's synthesize-rhythm rules become declarative on block kind rather than heuristic on HTML.

## 5. Atomic tasks

- **T-001** Inventory walk: catalog visual patterns across the 4 PDFs in `docs/canon/`, write `_qie-output/roses-os/block-inventory-2026-05-28.md`.
- **T-002** Define schema v1 in `types.ts`: `schemaVersion` field, new `BlockType` union, discriminated `BlockContent`.
- **T-003** Zod validators in `src/lib/manuals/block-schema.ts`; unit tests for every block kind.
- **T-004** Block registry contract: each block declares `kind`, `validator`, `defaultContent`, `renderer`, `serializeHtml`, `serializeMd`.
- **T-005** Migration script v0→v1 for seeded manuals; lossless round-trip snapshot tests.
- **T-006** API route gating: reject invalid block writes with structured error.
- **T-007** Adapter audit: enumerate every consumer of `TextContent.html`; build adapters.
- **T-008** Deprecation runway: keep v0 readers behind feature flag for 1 cycle.
- **T-009** Telemetry hooks at block create/save/validate-fail.
- **T-010** ARCHITECTURE.md authoring covering block-registry + schema-versioning contract.

## 6. The thing only Lattice would notice

The hidden coupling is **the JSONB column itself**. Supabase `manual_blocks.content` is schemaless at the DB layer, so the validator IS the schema. Without a `schemaVersion` field on every row and a migration ledger, this spec creates a slow-decay vector: production rows drift across schema versions silently, and there is no audit log of which row is which version. The structural fix is cheap if added at M1 (one column or one JSON field plus a migrations table) and expensive after the editor ships and writes happen at production cadence. Add it before any UI lands.
