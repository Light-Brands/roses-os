# Winston review: editor-richer-blocks

## 1. What problem is this actually solving?

Roses-os has four canonical PDFs at `docs/canon/` whose visual fidelity the current editor cannot produce. The 6-type block model in `src/lib/manuals/types.ts` and `TextBlock.tsx`'s `contentEditable` are lossy: text is `{ html: string }` written through `document.execCommand`, so the database stores whatever the browser emitted. `export-html.ts` concatenates that HTML into a Puppeteer document with no validation. The problem is structural: the editor cannot represent what the PDFs show, so faithful render is impossible regardless of renderer quality.

## 2. What is the smallest first version that proves the idea?

Inventory and schema. Walk the four PDFs, list every visual pattern that appears more than twice, map each to a block type or variant. Write the revised TS schema as a discriminated union and the additive JSONB migration. No editor surface yet. If the inventory cannot close on a finite list, the rest is premature.

## 3. What 3 risks would kill this if ignored?

- **Engine lock-in.** Picking TipTap or Lexical without a serialization contract means the engine owns the data shape. Mitigation: the schema is OURS, the engine is a view over it.
- **Preview latency.** If preview is "save then re-render Chromium", the author waits seconds per keystroke and stops using it. Mitigation: client-side preview sharing the print CSS; Chromium reserved for a final-check button.
- **Migration of seeded manuals.** Any schema change that breaks `manual_blocks.content` shape on existing rows ships a dead app. The four manuals must load on the new schema without a backfill.

## 4. What does success look like at 90 days?

A teacher drops a `callout` inside a `two-column` section with a numbered exercise, sees the print layout in the same surface, exports a PDF matching canon to the eye, and the JSONB revalidates clean. Telemetry shows new blocks in use, no `text` block holds raw HTML the schema cannot describe, and the four canon manuals still load.

## 5. What atomic tasks?

**M1 Inventory and schema (6):**
T-001 Walk 4 canon PDFs, produce pattern inventory. T-002 Define new BlockType as discriminated union. T-003 Zod schemas per variant. T-004 Additive JSONB migration accepting legacy shapes. T-005 Expand `block_type` CHECK constraint. T-006 Backfill validation pass over 4 seeded manuals.

**M2 Rich-text engine (6):**
T-007 TipTap vs Lexical decision spike. T-008 Engine wrapper with closed mark/node list. T-009 Serializer to canonical JSON. T-010 Deserializer from canonical JSON. T-011 Replace `TextBlock.tsx` `contentEditable`. T-012 Round-trip test over 4 manuals.

**M3 New block types (8):**
T-013 CalloutBlock. T-014 QuoteBlock. T-015 NumberedExerciseBlock. T-016 TableBlock. T-017 FootnoteBlock with refs. T-018 ImageCaptionBlock. T-019 CoverBlock. T-020 GlossaryBlock.

**M4 Layout containers (5):**
T-021 SectionBlock with children. T-022 TwoColumnBlock with children. T-023 Page-aware preview boundaries. T-024 Drag-reorder into containers. T-025 Keyboard reorder a11y.

**M5 Preview and autosave (6):**
T-026 Client-side preview with print CSS. T-027 Final-check Chromium render button. T-028 Autosave conflict detection. T-029 Last-write-wins with banner. T-030 Undo/redo stack. T-031 Telemetry hooks.

**M6 Validation and locales (4):**
T-032 Editor refuses invalid state pre-save. T-033 Locale-aware block surface. T-034 Locale gap indicator. T-035 Cutover docs + ARCHITECTURE.md sign-off.

## 6. What only my faculty would have noticed?

The `block_type` column has a Postgres `CHECK` constraint listing the six values literally (`supabase/manuals-schema.sql:79`). The schema migration is the load-bearing first PR, not the TS change. If T-005 ships after the TS union expands, every new-type insert fails with `violates check constraint` and the editor silently loses blocks. Cut order: CHECK first, TS union second, code third. Reverse it and launch breaks with no rollback because legacy rows stay legal.
