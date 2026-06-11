-- Migration 0005: add `contents` to the manual_blocks.block_type CHECK.
--
-- Authority: spec 002-faithful-content-reconstruction T-002 + AC1.
--
-- Migration 0002 widened the CHECK to 17 types but omitted `contents`, the one
-- v2 variant that is present in the registry (block-registry.ts) and the
-- TypeScript BlockType union (types.ts) but was never added to the constraint.
-- That is the same silent-insert hazard D-2 warns about, applied to `contents`:
-- a `contents` insert is rejected by the database today even though the code
-- treats it as a first-class block. This migration brings the CHECK to the full
-- 18-type registry surface (D-9).
--
-- Re-runnable: drops the existing block_type CHECK by discovery, recreates with
-- the stable name and all 18 types.

DO $$
DECLARE
  con_name TEXT;
BEGIN
  SELECT conname INTO con_name
  FROM pg_constraint
  WHERE conrelid = 'public.manual_blocks'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) ILIKE '%block_type%';

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.manual_blocks DROP CONSTRAINT %I', con_name);
  END IF;
END $$;

ALTER TABLE public.manual_blocks
  ADD CONSTRAINT manual_blocks_block_type_check
  CHECK (block_type IN (
    -- v1 (original six)
    'heading',
    'text',
    'image',
    'divider',
    'page-break',
    -- v1 (back-fix from 0002)
    'image-row',
    -- v2 (spec 001 M3 variants)
    'cover',
    'callout',
    'quote',
    'numbered-exercise',
    'captioned-figure',
    'spoken-instruction',
    'table',
    -- v2 (the one 0002 missed; this migration's reason for existing)
    'contents',
    'footnote',
    'glossary',
    'section',
    'two-column-section'
  ));

-- Verification (AC1):
--   SELECT pg_get_constraintdef(oid)
--   FROM pg_constraint
--   WHERE conname = 'manual_blocks_block_type_check';
-- Expected: a CHECK listing all 18 types including 'contents'. A subsequent
-- insert of a `contents` row then succeeds on a fresh database.

-- ROLLBACK (operator request only): re-run migration 0002 to drop back to the
-- 17-type list. There is no value in a partial rollback that re-strands
-- `contents`, since the registry and TS union already reference it.
