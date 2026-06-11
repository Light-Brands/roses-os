-- Migration 0008: review_status column + transactional staging-to-prod promotion RPC.
--
-- Authority: spec 004-site-ready-all-manuals T-011 + T-012, decisions D-18 / D-8 / D-21.
--
-- This file ships in the headless run but is NOT applied by it: applying it is DDL,
-- and DDL needs the service token the operator contract holds back to Gate G1. Dario
-- applies it when he promotes, with the token. Until then the held-for-native-review
-- state rides a `held*` run_id convention (D-21 OQ2); once this lands, the clean
-- `review_status` column is the source of truth and promote.ts / the RPC read it.
--
-- Re-runnable: ADD COLUMN IF NOT EXISTS, a guarded CHECK, CREATE OR REPLACE FUNCTION.

-- 1) review_status: NULL = unmarked (treated ready), 'ready' = promotable,
--    'held' = held for native review (G2), refused by promotion until cleared.
ALTER TABLE public.manual_blocks
  ADD COLUMN IF NOT EXISTS review_status TEXT;

-- Guarded CHECK so a re-run does not error on an existing constraint.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'manual_blocks_review_status_check'
      AND conrelid = 'public.manual_blocks'::regclass
  ) THEN
    ALTER TABLE public.manual_blocks
      ADD CONSTRAINT manual_blocks_review_status_check
      CHECK (review_status IS NULL OR review_status IN ('ready', 'held'));
  END IF;
END $$;

-- 2) Backup table for promotion snapshots (the in-transaction rollback substrate).
CREATE TABLE IF NOT EXISTS public.manual_blocks_promote_backup (
  backup_id    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  orig_id      UUID NOT NULL,
  manual_id    UUID NOT NULL,
  language     TEXT NOT NULL,
  block_type   TEXT NOT NULL,
  content      JSONB NOT NULL,
  position     INTEGER NOT NULL,
  updated_by   TEXT,
  backed_up_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  promote_run  TEXT
);

-- 3) The promotion RPC. One transaction (a plpgsql function body runs atomically in
--    the caller's transaction): refuse held + unsigned, snapshot the target, delete
--    the target, insert the source under the target id, remap container child refs
--    (two-column-section.left/right and section.children) by a position join. A raise
--    anywhere rolls the whole thing back, so a mid-flight failure never leaves a live
--    locale emptied — exactly the delete-then-insert hazard Custodian named (D-18).
CREATE OR REPLACE FUNCTION public.promote_manual_language(
  p_source_id   UUID,
  p_source_lang TEXT,
  p_target_id   UUID,
  p_target_lang TEXT,
  p_signer      TEXT DEFAULT 'promote'
) RETURNS TABLE (promoted INTEGER, backed_up INTEGER) AS $$
DECLARE
  v_promote_run TEXT := 'promote-' || p_target_id::text || '-' || p_target_lang || '-' || to_char(now(), 'YYYYMMDDHH24MISS');
  v_backed INTEGER := 0;
  v_promoted INTEGER := 0;
BEGIN
  -- Refuse a held source row (Gate G2 must clear it first).
  IF EXISTS (
    SELECT 1 FROM public.manual_blocks
    WHERE manual_id = p_source_id AND language = p_source_lang AND review_status = 'held'
  ) THEN
    RAISE EXCEPTION 'promote refused: source % [%] carries held-for-native-review rows (G2)', p_source_id, p_source_lang;
  END IF;

  -- Refuse an unsigned source row (null audit column).
  IF EXISTS (
    SELECT 1 FROM public.manual_blocks
    WHERE manual_id = p_source_id AND language = p_source_lang AND (updated_by IS NULL OR updated_by = '')
  ) THEN
    RAISE EXCEPTION 'promote refused: source % [%] has unsigned rows (null updated_by)', p_source_id, p_source_lang;
  END IF;

  -- A source must exist.
  IF NOT EXISTS (
    SELECT 1 FROM public.manual_blocks WHERE manual_id = p_source_id AND language = p_source_lang
  ) THEN
    RAISE EXCEPTION 'promote refused: source % [%] has no rows', p_source_id, p_source_lang;
  END IF;

  -- Snapshot the target before any delete.
  INSERT INTO public.manual_blocks_promote_backup (orig_id, manual_id, language, block_type, content, position, updated_by, promote_run)
  SELECT id, manual_id, language, block_type, content, position, updated_by, v_promote_run
  FROM public.manual_blocks
  WHERE manual_id = p_target_id AND language = p_target_lang;
  GET DIAGNOSTICS v_backed = ROW_COUNT;

  -- Delete the target rows.
  DELETE FROM public.manual_blocks WHERE manual_id = p_target_id AND language = p_target_lang;

  -- Insert the source rows under the target id + lang with fresh uuids, position kept.
  INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by, review_status)
  SELECT p_target_id, p_target_lang, block_type, content, position, COALESCE(updated_by, p_signer), review_status
  FROM public.manual_blocks
  WHERE manual_id = p_source_id AND language = p_source_lang;
  GET DIAGNOSTICS v_promoted = ROW_COUNT;

  -- Build the old-id -> new-id map (position is the stable join key per manual+lang).
  CREATE TEMP TABLE _promote_map ON COMMIT DROP AS
  SELECT s.id AS old_id, t.id AS new_id
  FROM public.manual_blocks s
  JOIN public.manual_blocks t
    ON t.manual_id = p_target_id AND t.language = p_target_lang
   AND s.manual_id = p_source_id AND s.language = p_source_lang
   AND s.position = t.position;

  -- Remap two-column-section left/right arrays (order preserved via WITH ORDINALITY).
  UPDATE public.manual_blocks t SET content =
      jsonb_set(
        jsonb_set(t.content, '{left}',  public._remap_ref_array(t.content->'left')),
        '{right}', public._remap_ref_array(t.content->'right')
      )
  WHERE t.manual_id = p_target_id AND t.language = p_target_lang
    AND t.block_type = 'two-column-section';

  -- Remap section children arrays.
  UPDATE public.manual_blocks t SET content =
      jsonb_set(t.content, '{children}', public._remap_ref_array(t.content->'children'))
  WHERE t.manual_id = p_target_id AND t.language = p_target_lang
    AND t.block_type = 'section';

  RETURN QUERY SELECT v_promoted, v_backed;
END;
$$ LANGUAGE plpgsql;

-- Helper: rewrite a JSON array of old block ids to the new ids via _promote_map,
-- preserving order. A ref with no mapping is dropped (the staging-time remap does the
-- same). Returns '[]' for a null/absent input. The temp map is created by the RPC
-- before this is called within the same transaction.
CREATE OR REPLACE FUNCTION public._remap_ref_array(p_ids JSONB)
RETURNS JSONB AS $$
  SELECT COALESCE(
    (
      SELECT jsonb_agg(m.new_id ORDER BY e.ord)
      FROM jsonb_array_elements_text(COALESCE(p_ids, '[]'::jsonb)) WITH ORDINALITY AS e(old, ord)
      JOIN _promote_map m ON m.old_id::text = e.old
    ),
    '[]'::jsonb
  );
$$ LANGUAGE sql;

-- Verification (T-012 / AC11): this file parses and the function is callable as
--   SELECT * FROM public.promote_manual_language(<src>, 'pt', <tgt>, 'pt');
-- The headless run exercises the SAME logic over the anon path in scripts/promote.ts,
-- staging-to-staging only; this RPC is the transactional form Dario runs at prod time.
--
-- ROLLBACK (operator only):
--   DROP FUNCTION IF EXISTS public.promote_manual_language(uuid, text, uuid, text, text);
--   DROP FUNCTION IF EXISTS public._remap_ref_array(jsonb);
--   DROP TABLE IF EXISTS public.manual_blocks_promote_backup;
--   ALTER TABLE public.manual_blocks DROP CONSTRAINT IF EXISTS manual_blocks_review_status_check;
--   ALTER TABLE public.manual_blocks DROP COLUMN IF EXISTS review_status;
