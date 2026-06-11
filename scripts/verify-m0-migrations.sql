-- M0 migration acceptance harness (AC1, AC2, AC5).
--
-- Run against a SCRATCH database that has had manuals-schema.sql plus migrations
-- 0002..0007 applied, in order. Each block RAISEs EXCEPTION on failure, so psql
-- exits non-zero if any acceptance criterion is unmet. NEVER run against prod.
--
--   psql "$SCRATCH_URL" -v ON_ERROR_STOP=1 -f scripts/verify-m0-migrations.sql

\set ON_ERROR_STOP on

-- ---------------------------------------------------------------------------
-- AC1: the block_type CHECK lists all 18 registry types including `contents`,
-- and an insert of a `contents` row succeeds.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  def TEXT;
  l1  UUID;
  missing TEXT;
  expected TEXT[] := ARRAY[
    'heading','text','image','divider','page-break','image-row','cover','callout',
    'quote','numbered-exercise','captioned-figure','spoken-instruction','table',
    'contents','footnote','glossary','section','two-column-section'
  ];
BEGIN
  SELECT pg_get_constraintdef(oid) INTO def
  FROM pg_constraint WHERE conname = 'manual_blocks_block_type_check';
  IF def IS NULL THEN
    RAISE EXCEPTION 'AC1 FAIL: manual_blocks_block_type_check constraint not found';
  END IF;
  FOREACH missing IN ARRAY expected LOOP
    IF position('''' || missing || '''' IN def) = 0 THEN
      RAISE EXCEPTION 'AC1 FAIL: block_type CHECK is missing type %', missing;
    END IF;
  END LOOP;

  SELECT id INTO l1 FROM public.manuals WHERE slug = 'rose-meditation-level-1';
  INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
  VALUES (l1, 'en', 'contents',
    '{"schema_version":2,"eyebrow":"CONTENTS","rows":[{"numeral":"1","title":"Getting Ready","page":"4"}]}'::jsonb,
    900, 'verify-harness');
  RAISE NOTICE 'AC1 PASS: CHECK lists all 18 types; contents insert succeeded';
END $$;

-- ---------------------------------------------------------------------------
-- AC2: a second insert at an occupied (manual_id, language, position) is rejected
-- by the database (unique_violation), not silently accepted.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  l1 UUID;
  rejected BOOLEAN := false;
BEGIN
  SELECT id INTO l1 FROM public.manuals WHERE slug = 'rose-meditation-level-1';
  INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position)
  VALUES (l1, 'en', 'divider', '{}'::jsonb, 901);
  BEGIN
    INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position)
    VALUES (l1, 'en', 'divider', '{}'::jsonb, 901);
  EXCEPTION WHEN unique_violation THEN
    rejected := true;
  END;
  IF NOT rejected THEN
    RAISE EXCEPTION 'AC2 FAIL: duplicate (manual_id, language, position) was accepted';
  END IF;
  RAISE NOTICE 'AC2 PASS: duplicate position rejected with unique_violation';
END $$;

-- ---------------------------------------------------------------------------
-- AC5: a write to the staging lane is invisible to a prod read; the prod manual's
-- row set is byte-identical before and after the staging write.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  prod_id    UUID;
  staging_id UUID;
  before_sig TEXT;
  after_sig  TEXT;
BEGIN
  SELECT id INTO prod_id FROM public.manuals WHERE slug = 'rose-meditation-level-1';
  SELECT id INTO staging_id FROM public.manuals WHERE slug = 'rose-meditation-level-1__staging';
  IF staging_id IS NULL THEN
    RAISE EXCEPTION 'AC5 FAIL: staging clone rose-meditation-level-1__staging not created (migration 0007)';
  END IF;
  IF staging_id = prod_id THEN
    RAISE EXCEPTION 'AC5 FAIL: staging id equals prod id (not isolated)';
  END IF;

  -- Signature of the prod manual's row set (the read surface getBlocks targets).
  SELECT md5(coalesce(string_agg(id::text || block_type || content::text || position::text, '|'
                                 ORDER BY position), ''))
    INTO before_sig
  FROM public.manual_blocks WHERE manual_id = prod_id AND language = 'en';

  -- Write a reconstruction block to the STAGING lane.
  INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
  VALUES (staging_id, 'en', 'contents',
    '{"schema_version":2,"rows":[{"title":"Staging-only entry"}]}'::jsonb, 0, 'verify-harness');

  SELECT md5(coalesce(string_agg(id::text || block_type || content::text || position::text, '|'
                                 ORDER BY position), ''))
    INTO after_sig
  FROM public.manual_blocks WHERE manual_id = prod_id AND language = 'en';

  IF before_sig IS DISTINCT FROM after_sig THEN
    RAISE EXCEPTION 'AC5 FAIL: prod row set changed after a staging write (% -> %)', before_sig, after_sig;
  END IF;

  -- And the staging write IS present under the staging id (the lane works).
  IF (SELECT count(*) FROM public.manual_blocks WHERE manual_id = staging_id AND language = 'en') = 0 THEN
    RAISE EXCEPTION 'AC5 FAIL: staging write did not land under the staging id';
  END IF;

  RAISE NOTICE 'AC5 PASS: staging write invisible to prod read; prod row set unchanged';
END $$;

SELECT 'M0 migration acceptance: AC1, AC2, AC5 all PASS' AS result;
