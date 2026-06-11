# Alexander review — editor-richer-blocks

Lens: paid product, migration without loss of access. The manuals behind `ManualPinGate.tsx` are revenue. The block model that backs them is a JSONB column with a `CHECK (block_type IN ('heading', 'text', 'image', 'divider', 'page-break'))` constraint hard-coded in `supabase/manuals-schema.sql:79`. Every move here is a move against a live, paying surface.

## 1. What problem is this actually solving

A paying teacher opens a manual in the in-app editor and sees a flattened approximation of the canonical PDF she paid the lineage to produce. The gap between `docs/canon/*.pdf` and what `BlockEditor.tsx` can express is the gap between "this product is the manual" and "this product is a note-taking app over the manual". Closing that gap is a defense of the perceived value that justifies the PIN. The lossy model is not a UX paper cut, it is a price-anchor leak.

## 2. Smallest first version that proves the idea

A read-only canon-fidelity probe that does NOT touch the editor or the schema. One page renders one canonical pattern from one PDF (cover + a callout + a numbered exercise) using the proposed richer schema, served from a parallel route, gated behind the existing PIN. The four seeded manuals keep loading through the old code path. Zero migration. If the probe survives a week of teacher eyes without a single ticket, only then does schema migration start.

## 3. Three risks that kill it if ignored

R1. The `block_type` CHECK constraint at `manuals-schema.sql:79` rejects any new type on insert. A naive deploy that ships new block types to the client before relaxing the constraint produces silent write failures and lost autosaves on the editor PIN, exactly the surface that pays.

R2. `db.ts:reorderBlocks` fires N parallel UPDATE statements with no transaction. A new richer schema that depends on a sibling-aware position model (sections, columns, footnote refs) will corrupt mid-reorder under any concurrent edit. Two PINs editing the same locale at the same time is a documented use case.

R3. Retro-validation that is stricter than the data already in `manual_blocks.content`. The current `TextContent = { html: string }` accepts any HTML. A schema-controlled rich-text node tree that rejects the loaded HTML on read closes the manual for the paying teacher who put it there.

## 4. Success at 90 days

A paying teacher opens any of the four seeded manuals, sees a rendering closer to the canonical PDF, and cannot point to a moment where access broke. Internally: zero rollback events on `manual_blocks`, zero PIN-gated 500s in Sentry tied to block-load, zero support tickets containing the strings "lost", "gone", "blank", "wrong PIN". The `block_type` CHECK has been replaced with a forward-compatible whitelist plus an `unknown` fallback that the renderer degrades gracefully, not 500s.

## 5. Atomic tasks (≤ 1 day each)

- T-001 Snapshot `manuals` + `manual_blocks` to a dated SQL dump in `supabase/backups/`, scripted and re-runnable.
- T-002 Add `schema_version INTEGER NOT NULL DEFAULT 1` to `manual_blocks`. Backfill 1. No constraint change.
- T-003 Write forward-only migration that replaces the `CHECK` on `block_type` with a permissive whitelist plus a server-side validator. Pair with a rollback script that restores the old CHECK.
- T-004 Build a read-side parser that accepts every currently-loaded `content` shape and produces the new normalized node tree. Test fixture: a row-by-row dump of production `manual_blocks`.
- T-005 Wrap `reorderBlocks` in a single transaction (Postgres function or RPC). Add an integration test that runs two concurrent reorders against a seeded manual.
- T-006 Add Sentry breadcrumbs around block-load, block-save, block-validate. Tag by `manual_id`, `language`, `schema_version`.
- T-007 Add a `/manuals/_status` page reachable only by editor PIN that shows last migration run, schema version of every row, and any rows where the parser fell back to `unknown`.
- T-008 Status-page entry on the public root for any window where writes must pause. Default plan: zero downtime, additive only.
- T-009 Soak the new schema in a staging Supabase project for 7 days against a clone of production rows before the prod migration.

## 6. The one thing only I would have noticed

The spec talks about "compatibility hacia atrás" as if the four seeded manuals were the test surface. They are not. The test surface is whatever a paying editor PIN typed into `TextContent.html` since launch, including the rows where someone pasted Word HTML, image-with-style tags, or nested lists the new schema does not yet model. The migration plan must read prod, not just the seed. Treating the seeded rows as the worst case is the seam where this spec quietly assumes dev parity with prod and would be malpractice against the PIN that pays.
