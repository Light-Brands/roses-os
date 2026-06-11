-- Migration 0006: unique block position per (manual_id, language), plus the two
-- nullable reconstruction-provenance audit columns (D-12).
--
-- Authority: spec 002-faithful-content-reconstruction T-006 + AC2, decision D-10;
-- spec 003-deterministic-extraction-geometry T-012p + AC8, decision D-12 (the two
-- provenance columns ride this M0 migration so M0's task count does not grow).
--
-- Today `idx_manual_blocks_position` is a NON-unique index on
-- (manual_id, language, position). Nothing stops two reconstruction runs from
-- stranding two blocks at the same position; the editor then renders whichever
-- row Postgres returns first. This migration adds a UNIQUE constraint on
-- (manual_id, language, position) so a duplicate-position insert is rejected by
-- the database, and so the D-7 idempotent staging upsert has a well-defined key
-- to upsert on.
--
-- Re-runnable: guarded create; no-op if the constraint already exists.
--
-- Note on existing data: if the live table already holds duplicate
-- (manual_id, language, position) tuples, the ADD CONSTRAINT will fail. That is
-- the correct, loud behavior; resolve the duplicates first. The diagnostic
-- query is included below so the operator can find them before applying.

-- Diagnostic the operator runs first on a populated database:
--   SELECT manual_id, language, position, count(*)
--   FROM public.manual_blocks
--   GROUP BY manual_id, language, position
--   HAVING count(*) > 1;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.manual_blocks'::regclass
      AND conname = 'manual_blocks_manual_lang_position_key'
  ) THEN
    ALTER TABLE public.manual_blocks
      ADD CONSTRAINT manual_blocks_manual_lang_position_key
      UNIQUE (manual_id, language, position);
  END IF;
END $$;

-- Verification (AC2):
--   A second insert at an occupied (manual_id, language, position) raises
--   SQLSTATE 23505 (unique_violation) rather than being silently accepted.

-- Provenance audit columns (D-12, spec 003 T-012p + AC8).
--
-- Provenance (source canon page, extraction run id) is a property of HOW a row
-- was made; it belongs in audit columns, not inside the 18 content schemas
-- (which stay a closed discriminated union, unchanged). The signer already rides
-- the existing `updated_by` column. Both columns are nullable: legacy v1 rows and
-- interactively-edited rows carry no provenance, and only reconstructed blocks
-- set them. Re-runnable via ADD COLUMN IF NOT EXISTS.

ALTER TABLE public.manual_blocks
  ADD COLUMN IF NOT EXISTS source_page integer,
  ADD COLUMN IF NOT EXISTS run_id text;

COMMENT ON COLUMN public.manual_blocks.source_page IS
  'Reconstruction provenance (D-12): the 1-based canon PDF page this block was extracted from. NULL for non-reconstructed rows.';
COMMENT ON COLUMN public.manual_blocks.run_id IS
  'Reconstruction provenance (D-12): the extraction run id that produced this block. NULL for non-reconstructed rows.';

-- ROLLBACK (operator request only):
--   ALTER TABLE public.manual_blocks
--     DROP CONSTRAINT manual_blocks_manual_lang_position_key;
--   ALTER TABLE public.manual_blocks
--     DROP COLUMN IF EXISTS source_page,
--     DROP COLUMN IF EXISTS run_id;
