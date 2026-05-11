-- =============================================================================
-- MIGRATION: Convert consecutive image clusters → image-row blocks
-- =============================================================================
-- Replaces each cluster of 2–3 stacked image blocks (identified by the
-- discovery query) with ONE image-row block at the first cluster position.
-- The remaining (N-1) positions become gaps — that's fine, positions don't
-- need to be contiguous, only ordered.
--
-- Idempotent: each cluster operation checks for an existing image-row at
-- the target position with sentinel updated_by = 'ImageRowConvert-v1' and
-- skips if found.
--
-- Run AFTER: migrate-add-image-row-block-type.sql
-- Safe to re-run.
-- =============================================================================

DO $$
DECLARE
  v_cluster RECORD;
  v_exists BOOLEAN;
BEGIN
  -- Each row below = one cluster to convert.
  -- Format: (manual_slug, first_position, image_block_ids[], images_jsonb, caption)
  FOR v_cluster IN
    SELECT * FROM (VALUES

      -- RM1 — Circuits of Energy of Cosmos & Earth (3 images)
      ('rose-meditation-level-1', 50,
       ARRAY['0fdd3216-50b4-4838-b579-b047a40cf5c2'::uuid,
             '0e64dfa3-cd36-4fa5-b4cf-5571e94c93bd'::uuid,
             '689bebba-559d-4735-b96e-038addb0be71'::uuid],
       '[
         {"src": "/rose med images/level-1/08-earth-energy.PNG", "alt": "Earth Energy"},
         {"src": "/rose med images/level-1/09-cosmos-circuit.jpeg", "alt": "Cosmos Circuit"},
         {"src": "/rose med images/level-1/10-cosmosearth.PNG", "alt": "Earth & Cosmos Circuit"}
        ]'::jsonb,
       ''),

      -- RM1 — Recovery Rose (2 images)
      ('rose-meditation-level-1', 61,
       ARRAY['6c6bd08a-f25c-4c54-97f6-96cf8c5ecd5b'::uuid,
             '8744ee8b-8691-456d-a4ea-f390613d7de1'::uuid],
       '[
         {"src": "/rose med images/level-1/13-cleansing-rose.png", "alt": "Cleansing Rose"},
         {"src": "/rose med images/level-1/14-energy-recovery.png", "alt": "Recovery Rose"}
        ]'::jsonb,
       ''),

      -- RM2 — Owning Your Space (2 images)
      ('rose-meditation-level-2', 21,
       ARRAY['7a40ef88-4e61-4ff1-b57f-8e841a528531'::uuid,
             '9043e3fa-9d55-4852-a4d1-2bd0e76ba3f9'::uuid],
       '[
         {"src": "/rose med images/level-2/21-cleanse-the-space.jpeg", "alt": "Cleansing the Space"},
         {"src": "/rose med images/level-2/22-owning-space.jpeg", "alt": "Owning Your Space"}
        ]'::jsonb,
       ''),

      -- RM2 — Individual Chakras (Root + Sacral)
      ('rose-meditation-level-2', 35,
       ARRAY['1d8712a5-a0a8-4969-bc30-6920a26c5b13'::uuid,
             '19f25d15-c130-480e-9cf8-7726fceb97e7'::uuid],
       '[
         {"src": "/rose med images/level-2/25-pdf-root-chakra.jpeg", "alt": "Root Chakra"},
         {"src": "/rose med images/level-2/26-pdf-sacral-chakra.jpeg", "alt": "Sacral Chakra"}
        ]'::jsonb,
       ''),

      -- RM2 — Individual Chakras (Solar Plexus + Heart)
      ('rose-meditation-level-2', 44,
       ARRAY['dde7fd44-4d1d-4c19-a764-a70f601fea2d'::uuid,
             '651e2d6f-ed73-480b-82a2-475f6ce90581'::uuid],
       '[
         {"src": "/rose med images/level-2/27-pdf-solar-plexus-chakra.jpeg", "alt": "Solar Plexus Chakra"},
         {"src": "/rose med images/level-2/28-pdf-heart-chakra.jpeg", "alt": "Heart Chakra"}
        ]'::jsonb,
       ''),

      -- RM2 — Individual Chakras (Throat + Third Eye)
      ('rose-meditation-level-2', 55,
       ARRAY['e7188aab-32b0-47df-96fe-8b4a2985e965'::uuid,
             '62012c28-8fa2-4791-9356-cfed0e967879'::uuid],
       '[
         {"src": "/rose med images/level-2/29-pdf-throat-chakra.jpeg", "alt": "Throat Chakra"},
         {"src": "/rose med images/level-2/30-pdf-third-eye-chakra.jpeg", "alt": "Third Eye Chakra"}
        ]'::jsonb,
       ''),

      -- RM2 — Golden Sticky Roses (Crown→Root + Arms)
      ('rose-meditation-level-2', 89,
       ARRAY['bafec430-ffc2-4d1a-a439-474a67af2999'::uuid,
             '090ee927-a71e-4a19-a15f-ada2970d5c74'::uuid],
       '[
         {"src": "/rose med images/level-2/35-golden-sticky-1.png", "alt": "Golden Sticky Rose — First Rose: Crown to Root"},
         {"src": "/rose med images/level-2/36-golden-sticky-2.jpg", "alt": "Golden Sticky Rose — Second Rose: Arms"}
        ]'::jsonb,
       ''),

      -- RM2 — Golden Sticky Roses continued (Legs + Full Aura)
      ('rose-meditation-level-2', 99,
       ARRAY['819233ee-5735-4071-bcdc-29f501caddbd'::uuid,
             '76d7e2e7-90a8-49df-86e9-334633c41a87'::uuid],
       '[
         {"src": "/rose med images/level-2/37-golden-sticky-3.jpg", "alt": "Golden Sticky Rose — Third Rose: Legs"},
         {"src": "/rose med images/level-2/38-golden-sticky-4.jpeg", "alt": "Golden Sticky Rose — Fourth Rose: Full Aura"}
        ]'::jsonb,
       ''),

      -- RM3 — The Analyzer (Analyzer + Sacred Space Analyzer)
      ('rose-meditation-level-3', 11,
       ARRAY['41e172e2-4965-4738-8ba5-ad7653db0994'::uuid,
             '7b0491d2-6501-4f67-bfb9-462d966fba99'::uuid],
       '[
         {"src": "/rose med images/level-3/39-analyzer.jpeg", "alt": "The Analyzer"},
         {"src": "/rose med images/level-3/40-sacred-space-analyzer.jpeg", "alt": "Sacred Space Analyzer"}
        ]'::jsonb,
       '')

    ) AS t(manual_slug, first_position, image_block_ids, images, caption)
  LOOP
    -- Idempotency: already an image-row at this slot?
    SELECT EXISTS(
      SELECT 1
      FROM public.manual_blocks b
      JOIN public.manuals m ON m.id = b.manual_id
      WHERE m.slug = v_cluster.manual_slug
        AND b.language = 'en'
        AND b.position = v_cluster.first_position
        AND b.block_type = 'image-row'
        AND b.updated_by = 'ImageRowConvert-v1'
    ) INTO v_exists;

    IF v_exists THEN
      RAISE NOTICE 'Skipping % @ pos % — already converted', v_cluster.manual_slug, v_cluster.first_position;
      CONTINUE;
    END IF;

    -- Delete the original image blocks
    DELETE FROM public.manual_blocks
    WHERE id = ANY(v_cluster.image_block_ids);

    -- Insert the new image-row block at the first position
    INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
    SELECT
      m.id,
      'en',
      'image-row',
      jsonb_build_object('images', v_cluster.images, 'caption', v_cluster.caption),
      v_cluster.first_position,
      'ImageRowConvert-v1'
    FROM public.manuals m
    WHERE m.slug = v_cluster.manual_slug;

    RAISE NOTICE 'Converted % @ pos % (% images → 1 image-row)',
      v_cluster.manual_slug, v_cluster.first_position, array_length(v_cluster.image_block_ids, 1);
  END LOOP;
END $$;
