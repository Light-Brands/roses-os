-- =============================================================================
-- READ-ONLY DISCOVERY: find clusters of 2+ consecutive image blocks
-- =============================================================================
-- Run this in Supabase SQL Editor and paste the full result back to Claude.
-- It does NOT modify anything. It just lists every place where 2 or more
-- image blocks sit next to each other in the same manual + language, so we
-- can pick which to convert to a single image-row block.
-- =============================================================================

WITH ordered AS (
  SELECT
    b.id,
    b.manual_id,
    m.slug AS manual_slug,
    b.language,
    b.block_type,
    b.content,
    b.position,
    ROW_NUMBER() OVER (PARTITION BY b.manual_id, b.language ORDER BY b.position) AS rn
  FROM public.manual_blocks b
  JOIN public.manuals m ON m.id = b.manual_id
  WHERE b.language = 'en'
),
images_with_gap AS (
  SELECT
    o.*,
    -- "gap" increments every time we leave a streak of consecutive images.
    -- Two image blocks sit in the same group iff their (rn - gap_marker) is equal.
    SUM(CASE WHEN o.block_type = 'image' THEN 0 ELSE 1 END)
      OVER (PARTITION BY o.manual_id, o.language ORDER BY o.position) AS gap
  FROM ordered o
),
clusters AS (
  SELECT
    manual_slug,
    language,
    gap AS cluster_key,
    MIN(position) AS first_position,
    MAX(position) AS last_position,
    COUNT(*) AS image_count,
    jsonb_agg(jsonb_build_object(
      'id', id,
      'position', position,
      'src', content->>'src',
      'alt', content->>'alt',
      'caption', content->>'caption'
    ) ORDER BY position) AS images
  FROM images_with_gap
  WHERE block_type = 'image'
  GROUP BY manual_slug, language, gap
  HAVING COUNT(*) >= 2
)
SELECT
  c.manual_slug,
  c.language,
  c.image_count,
  c.first_position,
  c.last_position,
  -- Find the nearest heading at or before the cluster, to give context
  (SELECT content->>'text'
   FROM public.manual_blocks h
   JOIN public.manuals m2 ON m2.id = h.manual_id
   WHERE m2.slug = c.manual_slug
     AND h.language = c.language
     AND h.block_type = 'heading'
     AND h.position <= c.first_position
   ORDER BY h.position DESC
   LIMIT 1) AS preceding_heading,
  c.images
FROM clusters c
ORDER BY c.manual_slug, c.first_position;
