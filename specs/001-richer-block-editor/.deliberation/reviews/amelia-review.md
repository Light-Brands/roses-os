# Amelia review — editor-richer-blocks

## 1. What problem is this actually solving?

The editor lets an author add heading, free-HTML paragraph, image+caption, 2-4 image row, divider, page break. Bold/italic via `document.execCommand` in `TextBlock.tsx:29` writes browser-dialect HTML into `content.html` with no schema on allowed marks. Chrome writes `<b>`, Safari `<strong>`, Word paste `<span style="font-family:...">`. Supabase preserves it verbatim. Canon PDFs need callouts, numbered exercises, quotes, two-column sections, footnotes, captioned figures. None exist. Author fakes them as inline HTML or skips. That is the lossy cost: structure the renderer cannot recover because it was never captured.

## 2. Smallest first version

One new block: `callout`. One engine swap: TipTap with three marks (`bold`, `italic`, `link`) plus `bulletList`. Callout exercises the full migration path (new `block_type` + `BlockContent` shape + SQL CHECK value + renderer + AddBlockMenu entry). TipTap with three marks proves contentful-JSON replaces `html: string` without bundle blowup. Validation: load Rose Meditation Level 1, add a callout, add a paragraph with bold + italic + link, save, reload, render through faithful-pdf-export. PDF shows both + JSONB byte-stable roundtrip = chain proven.

## 3. Three frontend risks that kill this

1. **Bundle weight.** TipTap-core + StarterKit is 80-120kb gzipped before extensions. Repo ships three.js + framer-motion. Editor bundle could cross 500kb. Dynamic-import on `/manuals/[slug]/edit` only.
2. **framer-motion Reorder + Next 16 Turbopack SSR.** `BlockEditor.tsx:6` imports `Reorder` + `useDragControls` at module top. Next 16's RSC boundaries already bit this repo (CLAUDE.md flags a `Variants` ignore). Nested Reorder for columns multiplies hydration-mismatch surface.
3. **JSONB migration of in-flight edits.** Level 1 is multi-locale and actively edited. A naive "drop `html`, add `doc`" loses unpublished work. Need parallel-write window where `text` blocks carry both fields until backfill confirms parity.

## 4. Success at 90 days

Author opens `/manuals/aura-level-1/edit`, expresses full Aura Level 1 with zero raw-HTML escape hatches, exports via faithful-pdf-export, PDF matches `docs/canon/Aura 1 - Jan2026.pdf` page-for-page within 5% pixel-diff on cover, body spreads, exercise pages. Demo: side-by-side viewer, callout edit reflects in live preview under 800ms.

## 5. Atomic tasks

**M1 inventory + schema (10):** T-001 inventory → `docs/canon/block-inventory.md`. T-002 extend `BlockType` in `types.ts`. T-003 add Callout/Quote/TwoColumn/ImageCaption/Exercise/Table/Footnote shapes. T-004 widen SQL CHECK in `manuals-schema.sql:79`. T-005 migration `supabase/migrations/0002_richer_blocks.sql`. T-006 backward-compat loader in `db.ts`. T-007 split default-content factory out of `BlockEditor.tsx:25-37`. T-008 narrowed `renderBlock` switch. T-009 update `AddBlockMenu` options. T-010 contract test `types.spec.ts`.

**M2 TipTap (8):** T-011 add `@tiptap/core+react+starter-kit+link`. T-012 closed `richtext/schema.ts`. T-013 `TextBlock.tsx` rewrite, dynamic-imported. T-014 dual-write `{html, doc}`. T-015 HTML→JSON converter. T-016 JSON→HTML serializer for `export-html.ts`. T-017 paste sanitizer. T-018 shortcut parity.

**M3 first block + preview (8):** T-019 `CalloutBlock.tsx`. T-020 callout renderer. T-021 callout in print route. T-022 `PreviewPane.tsx`. T-023 postMessage bridge. T-024 perf budget. T-025 Aura roundtrip e2e. T-026 `telemetry.ts`.

**M4-M7:** remaining blocks (quote, two-column, image+caption, exercise, table, footnote, glossary, index, cover), accessible drag, undo/redo, autosave conflict, validation, locale parity, telemetry.

## 6. The one thing only the implementer notices

`supabase/manuals-schema.sql:79` declares `CHECK (block_type IN ('heading', 'text', 'image', 'divider', 'page-break'))`. Five values. The TypeScript union in `types.ts:18` lists six (includes `image-row`). The DB is lying to the type system. INSERT with `block_type = 'image-row'` against a fresh schema fails constraint 23514, and the editor swallows it silently in `BlockEditor.tsx:212` (`catch { /* Failed */ }`). Either prod was hand-patched off-schema, or `image-row` has never been saved in prod. The spec needs a verification task that queries `pg_constraint` on the live DB to learn the real allowed set, and the CHECK-widening migration must ship before new client values. Otherwise the first author who clicks "Add callout" gets a silent no-op, invisible because every fetch handler in `BlockEditor.tsx` is `catch {}`.
