-- Migration 0007: realize the staging lane as cloned manual_id sibling rows.
--
-- Authority: spec 002-faithful-content-reconstruction T-005 + AC5, decision D-5.
--
-- Staging is a sibling `manuals` row carrying its own id, one per production
-- manual, identified by the slug convention `<prod-slug>__staging`. Reconstructed
-- blocks are written under the staging manual_id. A read that targets the prod id
-- (getBlocks(prodId, 'en')) cannot see staging rows because they live under a
-- different manual_id. Promotion (D-8) later moves rows from the staging id to the
-- prod id in one transaction.
--
-- This migration creates one staging clone for every existing non-staging manual.
-- The clone carries a high sort_order so it never competes with a real manual in
-- any ordered list, and the reader-facing list filters `__staging` slugs out in
-- the application layer (db.ts getManuals).
--
-- Re-runnable: ON CONFLICT (slug) DO NOTHING; running it again after a new manual
-- is added creates only the missing staging clones.

INSERT INTO public.manuals (slug, title, description, cover_image, sort_order)
SELECT
  m.slug || '__staging'                AS slug,
  m.title || ' (staging)'              AS title,
  'Staging lane for ' || m.slug || '. Reconstruction writes land here and are '
    || 'invisible to production reads until an explicit, soaked, signed promotion.'
                                       AS description,
  m.cover_image                        AS cover_image,
  m.sort_order + 1000                  AS sort_order
FROM public.manuals m
WHERE m.slug NOT LIKE '%\_\_staging'
ON CONFLICT (slug) DO NOTHING;

-- Verification (AC5):
--   A write under the staging manual_id does not appear in
--   getBlocks(prodManualId, 'en'); the prod manual's row set is byte-identical
--   before and after a staging write. Proven by the scratch-DB harness in
--   scripts/verify-staging-isolation.ts.

-- ROLLBACK (operator request only): staging clones hold draft data; deleting a
-- staging manual cascades its blocks (ON DELETE CASCADE on manual_blocks).
--   DELETE FROM public.manuals WHERE slug LIKE '%\_\_staging';
