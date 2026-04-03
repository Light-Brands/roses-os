-- =============================================================================
-- SEED MANUAL CONTENT — Fix cover images + add starter blocks
-- Run this AFTER manuals-schema.sql
-- =============================================================================

-- Fix cover image paths (images are in /rose med images/ not /images/teaching/)
UPDATE public.manuals SET cover_image = '/rose med images/level-1/01-the-rose.jpeg' WHERE slug = 'rose-meditation-level-1';
UPDATE public.manuals SET cover_image = '/rose med images/level-2/01-physical-space.jpeg' WHERE slug = 'rose-meditation-level-2';
UPDATE public.manuals SET cover_image = '/rose med images/level-3/01-analyzer.jpeg' WHERE slug = 'rose-meditation-level-3';
UPDATE public.manuals SET cover_image = '/rose med images/level-1/05-aura-exercise.PNG' WHERE slug = 'aura-level-1';

-- =============================================================================
-- LEVEL 1 STARTER BLOCKS (English)
-- =============================================================================

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "Rose Meditation — Level 1", "level": 1}'::jsonb, 0, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>The essential practices that form the foundation of all International Aura School work. Breath, body, heart, and the Rose Meditation.</p>"}'::jsonb, 1, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'divider', '{}'::jsonb, 2, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "Getting Ready to Start", "level": 2}'::jsonb, 3, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/level-1/02-meditation-posture.PNG", "alt": "Meditation Posture", "caption": "Proper meditation posture"}'::jsonb, 4, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<ol><li>Sit down and keep your spine aligned in an upright posture. Place both feet on the floor, with your hands on your knees and palms facing upwards.</li><li>Concentrate, close your eyes, bring your presence into the present moment and breathe deeply and slowly.</li><li>Use the power of your imagination <em>(image in action)</em> to visualize the techniques.</li></ol>"}'::jsonb, 5, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>Rose Meditation is a tool for cleansing the aura and the seven main chakras, providing protection and energy balance. Through this technique it is possible to release blocked energies, energies that are not ours, become aware of our life force and deprogram patterns that prevent direct contact with our essence.</p>"}'::jsonb, 6, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 7, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "1. Grounding Cord", "level": 2}'::jsonb, 8, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/level-1/03-grounding-cord.png", "alt": "Grounding Cord", "caption": "Grounding cord extending from the first chakra to the center of the Earth"}'::jsonb, 9, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>The grounding cord is an energetic connection that extends from the base of the spine (first chakra) downward into the center of the Earth. It anchors your energy body to the planet, providing stability, safety, and a channel for releasing unwanted energy.</p><p>Imagine a beam of light, a tree trunk, or a waterfall flowing from the base of your spine all the way down to the center of the Earth. This is your grounding cord. Allow any tension, stress, or foreign energy to flow down through it and be absorbed by the Earth.</p>"}'::jsonb, 10, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 11, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "2. Golden Sun", "level": 2}'::jsonb, 12, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/level-1/04-golden-sun.jpeg", "alt": "Golden Sun", "caption": "The Golden Sun above the head, calling back your energy"}'::jsonb, 13, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>The Golden Sun is a tool for replenishing and restoring your own energy. Visualize a radiant golden sun above your head. It calls back your own life-force energy from wherever you may have left it — in people, places, situations, or time. It fills you with your own highest vibration.</p>"}'::jsonb, 14, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 15, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "3. Aura Limits", "level": 2}'::jsonb, 16, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/level-1/05-aura-exercise.PNG", "alt": "Aura Exercise", "caption": "Feeling the edges of your aura"}'::jsonb, 17, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>The aura is the energetic field that surrounds your physical body. This exercise helps you become aware of its presence, its edges, and its quality. Bring your attention to the space around your body — about an arm''s length in every direction. Notice the boundary of your energy field. You can expand or contract it as needed.</p>"}'::jsonb, 18, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-1';

-- =============================================================================
-- LEVEL 2 STARTER BLOCKS (English)
-- =============================================================================

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "Rose Meditation — Level 2", "level": 1}'::jsonb, 0, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-2';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>Advanced practices for subtle body awareness, emotional alchemy, and relational coherence. Level 2 deepens your connection with the chakra system and introduces techniques for energetic cleansing and recovery.</p>"}'::jsonb, 1, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-2';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'divider', '{}'::jsonb, 2, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-2';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "The Chakra System", "level": 2}'::jsonb, 3, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-2';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>The seven main chakras are energy centers aligned along the spine. Each chakra governs specific aspects of our physical, emotional, and spiritual well-being. In Level 2, we learn to read, cleanse, and balance each chakra individually.</p>"}'::jsonb, 4, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-2';

-- =============================================================================
-- LEVEL 3 STARTER BLOCKS (English)
-- =============================================================================

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "Rose Meditation — Level 3", "level": 1}'::jsonb, 0, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-3';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>Practices and principles for holding space, transmitting the work, and serving as a guardian of the lineage. Level 3 prepares you for the path of facilitation and teaching.</p>"}'::jsonb, 1, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-3';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'divider', '{}'::jsonb, 2, 'System'
FROM public.manuals m WHERE m.slug = 'rose-meditation-level-3';

-- =============================================================================
-- AURA LEVEL 1 STARTER BLOCKS (English)
-- =============================================================================

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "Aura Level 1", "level": 1}'::jsonb, 0, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>Introduction to aura reading and energetic perception. This course opens your awareness to the subtle energy field that surrounds every living being.</p>"}'::jsonb, 1, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'divider', '{}'::jsonb, 2, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';
