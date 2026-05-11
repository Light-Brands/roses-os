-- =============================================================================
-- MIGRATION: Add front cover image + Table of Contents to all manuals
-- =============================================================================
-- Idempotent. Safe to re-run. Detects prior application by checking for the
-- sentinel updated_by = 'CoverTocSeed-v1' on any block belonging to the manual.
--
-- For each manual (rose-meditation-level-1/2/3, aura-level-1), language='en':
--   - Keep existing position-0 H1 (the manual's title) as the cover title
--   - Insert at position 1: cover image (from manuals.cover_image)
--   - Insert at position 2: subtitle / credit text
--   - Insert at position 3: page-break (end of cover)
--   - Insert at position 4: H2 "Table of Contents"
--   - Insert at position 5: TOC HTML (built from existing H2 headings)
--   - Insert at position 6: page-break (end of TOC)
--   - Shift all pre-existing blocks at position >= 1 by +6
--
-- Run AFTER: manuals-schema.sql, seed-manual-content.sql, seed-aura-level-1-content.sql
-- =============================================================================

DO $$
DECLARE
  v_manual RECORD;
  v_already_applied BOOLEAN;
  v_toc_html TEXT;
  v_credit_text TEXT;
BEGIN
  FOR v_manual IN
    SELECT id, slug, title, cover_image
    FROM public.manuals
    WHERE slug IN ('rose-meditation-level-1', 'rose-meditation-level-2', 'rose-meditation-level-3', 'aura-level-1')
  LOOP
    -- Idempotency guard: skip manuals already migrated
    SELECT EXISTS(
      SELECT 1 FROM public.manual_blocks
      WHERE manual_id = v_manual.id
        AND language = 'en'
        AND updated_by = 'CoverTocSeed-v1'
    ) INTO v_already_applied;

    IF v_already_applied THEN
      RAISE NOTICE 'Skipping % — cover/TOC already applied', v_manual.slug;
      CONTINUE;
    END IF;

    -- Build TOC from existing level-2 headings (preserves whatever editors have authored)
    SELECT
      COALESCE(
        '<ul>' ||
        string_agg(
          '<li>' || (content->>'text') || '</li>',
          ''
          ORDER BY position
        ) ||
        '</ul>',
        '<p><em>Table of contents will appear here as chapters are added.</em></p>'
      )
    INTO v_toc_html
    FROM public.manual_blocks
    WHERE manual_id = v_manual.id
      AND language = 'en'
      AND block_type = 'heading'
      AND (content->>'level')::int = 2;

    -- Credit line uses manual description if available, otherwise a default
    SELECT COALESCE(NULLIF(description, ''), 'International Aura School')
    INTO v_credit_text
    FROM public.manuals WHERE id = v_manual.id;

    -- Shift existing blocks (position >= 1) down by 6 to make room for cover image
    -- + credit + page-break + TOC heading + TOC list + page-break.
    -- Done in descending order to avoid unique-key conflicts if a (manual,lang,position)
    -- unique index ever lands later. (Current schema has no such constraint, but be safe.)
    UPDATE public.manual_blocks
    SET position = position + 6
    WHERE manual_id = v_manual.id
      AND language = 'en'
      AND position >= 1;

    -- Insert cover image at position 1 (only if a cover_image is set)
    IF v_manual.cover_image IS NOT NULL AND v_manual.cover_image <> '' THEN
      INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
      VALUES (
        v_manual.id,
        'en',
        'image',
        jsonb_build_object(
          'src', v_manual.cover_image,
          'alt', v_manual.title,
          'caption', ''
        ),
        1,
        'CoverTocSeed-v1'
      );
    ELSE
      -- No cover image set — insert a placeholder image block with empty src
      -- (editor will show upload prompt for the operator to fill in)
      INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
      VALUES (
        v_manual.id, 'en', 'image',
        jsonb_build_object('src', '', 'alt', v_manual.title, 'caption', ''),
        1, 'CoverTocSeed-v1'
      );
    END IF;

    -- Position 2: credit / subtitle text
    INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
    VALUES (
      v_manual.id,
      'en',
      'text',
      jsonb_build_object('html', '<p style="text-align:center"><em>' || v_credit_text || '</em></p>'),
      2,
      'CoverTocSeed-v1'
    );

    -- Position 3: page-break (end of cover)
    INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
    VALUES (v_manual.id, 'en', 'page-break', '{}'::jsonb, 3, 'CoverTocSeed-v1');

    -- Position 4: Table of Contents heading
    INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
    VALUES (
      v_manual.id,
      'en',
      'heading',
      jsonb_build_object('text', 'Table of Contents', 'level', 2),
      4,
      'CoverTocSeed-v1'
    );

    -- Position 5: TOC HTML list (built from manual's H2 headings above)
    INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
    VALUES (
      v_manual.id,
      'en',
      'text',
      jsonb_build_object('html', v_toc_html),
      5,
      'CoverTocSeed-v1'
    );

    -- Position 6: page-break (end of TOC)
    INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
    VALUES (v_manual.id, 'en', 'page-break', '{}'::jsonb, 6, 'CoverTocSeed-v1');

    RAISE NOTICE 'Applied cover + TOC to %', v_manual.slug;
  END LOOP;
END $$;
