-- Migration 0009: soft-delete for manual_blocks (D-23).
--
-- Authority: spec 005-editor-fidelity-and-undo T-002 + AC3, decision D-23.
--
-- The editor's delete hard-DELETEd the row, so the in-session undo stack (T-001)
-- could not bring a deleted block back: there was nothing to restore. This adds a
-- soft-delete flag. DELETE now flips the flag, every read filters it out, and
-- undo restores a deleted block by un-flagging the same row (its id is preserved,
-- which is what AC3 requires: "undoing restores a block with the same id").
--
-- The flag is nullable-free with a default of false so existing rows read as live
-- without a backfill, and so an INSERT that omits the column is a live block.
--
-- Re-runnable: ADD COLUMN IF NOT EXISTS; CREATE INDEX IF NOT EXISTS. Running it a
-- second time is a no-op.

ALTER TABLE public.manual_blocks
  ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false;

-- Reads always filter on (manual_id, language, is_deleted=false) ordered by
-- position. A partial index over the live rows keeps that read path cheap and
-- stops the soft-deleted tombstones from bloating the position scan.
CREATE INDEX IF NOT EXISTS idx_manual_blocks_live_position
  ON public.manual_blocks (manual_id, language, position)
  WHERE is_deleted = false;
