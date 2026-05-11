-- =============================================================================
-- MIGRATION: Add 'image-row' to the manual_blocks block_type CHECK constraint
-- =============================================================================
-- Idempotent. Drops the existing CHECK constraint and recreates it with the
-- expanded value set. Postgres does not support ALTER CONSTRAINT for CHECK,
-- so DROP + ADD is the standard pattern.
--
-- Run AFTER: manuals-schema.sql
-- Safe to run multiple times.
--
-- An image-row block stores N (2–4) images in JSONB:
--   {
--     "images": [{ "src": "...", "alt": "..." }, ...],
--     "caption": "optional"
--   }
-- =============================================================================

ALTER TABLE public.manual_blocks
  DROP CONSTRAINT IF EXISTS manual_blocks_block_type_check;

ALTER TABLE public.manual_blocks
  ADD CONSTRAINT manual_blocks_block_type_check
  CHECK (block_type IN ('heading', 'text', 'image', 'divider', 'page-break', 'image-row'));
