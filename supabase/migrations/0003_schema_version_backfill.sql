-- Migration 0003: backfill content.schema_version on every manual_blocks row.
--
-- Authority: spec 001-richer-block-editor T-008 + AC4.
--
-- Every row's `content` JSONB gains a `schema_version` key. Existing rows
-- default to 1 (v1 schema). New v2 variants will set 2 at insert time via the
-- application layer (block-schema.ts + block-parser.ts).
--
-- Re-runnable: idempotent JSONB merge sets the key only when absent.

UPDATE public.manual_blocks
SET content = content || jsonb_build_object('schema_version', 1)
WHERE NOT (content ? 'schema_version');

-- Verification: every row carries a schema_version.
-- Operator can confirm with:
--   SELECT DISTINCT content->>'schema_version' FROM public.manual_blocks;
-- Expected: '1' (and '2' once v2 variants ship).

-- ROLLBACK (lossy; only if you must):
-- UPDATE public.manual_blocks SET content = content - 'schema_version';
