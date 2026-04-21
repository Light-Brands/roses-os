-- =============================================================================
-- SEED AURA LEVEL 1 CONTENT — Full manual import from "Aura 1 - Jan2026.pdf"
-- Run this AFTER manuals-schema.sql and seed-manual-content.sql
-- Idempotent: deletes existing aura-level-1 blocks, then inserts fresh.
-- =============================================================================

-- Remove existing placeholder blocks for aura-level-1 (all languages)
DELETE FROM public.manual_blocks
WHERE manual_id = (SELECT id FROM public.manuals WHERE slug = 'aura-level-1');

-- =============================================================================
-- ENGLISH CONTENT BLOCKS
-- =============================================================================

-- --- Cover & Credits (pages 1-2) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "AURA 1: Healing and Self-Knowledge", "level": 1}'::jsonb, 0, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p><strong>Aura Reading — Level 1</strong></p><p>Text based on the teachings of Angelina Ataíde, written by Ana Leite and Rael Luz.</p><p>Revised by Ana Leite and Angelina Ataíde in the second semester of 2023.</p><p><em>Illustrations: Saraswati Noemi, Cecilia Lynch, Drica Voivodic and Ana Leite</em></p>"}'::jsonb, 1, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p><em>No part of this manual may be reproduced and/or shown to individuals who have not participated in an Aura Reading Level 1 course.</em></p><p><em>Teaching the Rose Meditation and Aura Reading requires specific training, along with extensive experience in Aura Reading and energy work. Therefore, for your own protection, do not share this information.</em></p>"}'::jsonb, 2, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'divider', '{}'::jsonb, 3, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- Introduction (page 2) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>Aura Reading is a very profound practice of self-knowledge that brings to light information about your Aura, your field, your history, to be recognized, assimilated, and released.</p>"}'::jsonb, 4, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 5, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- Preparing for the Reading (pages 2-4) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "Preparing for the Reading", "level": 1}'::jsonb, 6, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "The Cleansing That Was Missing", "level": 2}'::jsonb, 7, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>The technique below allows for deep energetic cleansing and is essential for the Aura Reading to take place correctly, neutrally, and without interference.</p>"}'::jsonb, 8, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "Transmedium Channels", "level": 3}'::jsonb, 9, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>The transmedium channels are located at the back of the neck. It is through them that our Spirit incarnates in our body and through them that discarnate energies of all kinds can exert an influence on us. Cleansing and closing the transmedium channels regularly increases energetic authority and allows us to free ourselves from unwanted habits that are being sustained by tendencies and influences outside of ourselves.</p><p>Cleansing the transmedium channels is similar to cleansing the analyzer and is also done in all chakra colors. Here is the description for the red color:</p>"}'::jsonb, 10, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/aura-1/01-transmedium-channels.png", "alt": "Transmedium Channels", "caption": "Transmedium channels at the back of the neck with cleansing roses"}'::jsonb, 11, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<ul><li>See the transmedium channels in red;</li><li>Ground the transmedium channels to the center of the Earth with a red cord for each one;</li><li>Create two red Roses grounded behind you outside your Aura at the height of the transmedium channels;</li><li>The Roses now cleanse the transmedium channels in this vibration;</li><li>Explode the Roses always outside the Aura.</li></ul><p><strong>This same procedure should be done with the vibration of all the chakras (orange, yellow, green, pink, sky blue, indigo blue, and violet).</strong></p><ul><li>Now see the golden transmedium channels raising their vibration;</li><li>Create two golden sticky Roses the size of the transmedium channels (or one Rose that splits in two when it reaches the height of the channels);</li><li>They enter the channels and cleanse them in a spiral pattern, inside and out, clearing away any remaining hidden energy that may have been left there;</li><li>The Roses descend through the grounding cords of the channels;</li><li>Now close the transmedium channels completely, 100% closed.</li></ul>"}'::jsonb, 12, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 13, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- Step 1: Rose Meditation (page 3) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "Step 1 — Rose Meditation", "level": 2}'::jsonb, 14, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>Perform the complete Rose Meditation with the cleansing of the transmedium channels and the analyzer. It should be done on the same day, prior to the Reading. If you plan to do the Aura Reading very early in the morning, you can also do the Rose Meditation before going to sleep the night before.</p>"}'::jsonb, 15, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- Step 2: Preparation of the Space (page 3) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "Step 2 — Preparation of the Space for Aura Reading", "level": 2}'::jsonb, 16, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<ul><li>The room where you do an Aura Reading should be clean and organized, whether it''s an in person or remote Reading;</li><li>Try to make the room as comfortable as possible, without too much sun, heat, wind, or cold;</li><li>Perform the energetic preparation of the room using the techniques of the Rose Meditation.</li></ul>"}'::jsonb, 17, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- Step 3: When the Person Enters the Room (pages 3-4) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "Step 3 — When the Person Enters the Room", "level": 2}'::jsonb, 18, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<ul><li>Look at the person as a Spirit, without paying attention to physical aspects or their personality;</li><li>Ensure the person is comfortable, sitting in front of you — if it''s a remote Reading, tell the person that it''s important for them to be in a private environment for about an hour, sitting with their feet firmly on the ground (in a chair, for example);</li><li>Explain that during the Aura Reading, you will have your eyes closed, but the person should keep their eyes open and should not cross their legs or arms;</li><li>The appropriate distance between you and the person is approximately one meter; this allows your Aura to be outside the person''s Aura;</li><li>Mention that you''ll be in silence for a short while (this is when you prepare and communicate to the Spirit of the person);</li></ul>"}'::jsonb, 19, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 20, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- Step 4: Energetic Preparation (page 4) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "Step 4 — Energetic Preparation Before Opening the Reading", "level": 2}'::jsonb, 21, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<ul><li>Create your grounding cord;</li><li>Create the Golden Sun and fill yourself with golden light;</li><li>Bring the limits of your Aura towards you;</li><li>Expand the grounding cord;</li><li>Explode and create new Roses for protection, separation and observation;</li><li>Activate the energy circuit of the earth and the cosmos;</li><li>Create a grounded Rose of a color of high vibration and call your dispersed energy; explode this Rose;</li><li>Place yourself in your sacred space and ask the Spirit to be in charge throughout the Aura Reading;</li><li>Consider whether it''s a good idea or not to make the Golden Sticky Roses just before the Aura Reading;</li><li>Check if the transmedium channels and the analyzer are 100% closed. If necessary, clean them with Golden Sticky Roses, visualize them in gold, and close them again;</li><li>If it''s an online remote Reading, you can ground your computer (or phone), see it in gold, and protect it with Roses as well.</li></ul>"}'::jsonb, 22, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 23, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- To Begin the Aura Reading (pages 4-7) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "To Begin the Aura Reading", "level": 1}'::jsonb, 24, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- 1. Closing the Lower Chakras (pages 4-5)

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "1. Closing the Lower Chakras", "level": 2}'::jsonb, 25, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>To neutralize our lower self and direct our life energy to the upper chakras while reading Auras, we ground and close the first 3 chakras.</p><p>This is not a complete closure like the analyzer and transmedium channels. The extent to which we close each chakra varies between men and women. Trans or non-binary individuals may experience what works best for them.</p><ul><li>Ground the 1st chakra;</li><li>Expand this grounding cord from the chakra to the limits of the Aura;</li><li>Create a Rose to cleanse this chakra, observing the images that come out and explode this Rose;</li><li>Close the 1st chakra by 70%, whether you are a man or a woman (this means that this chakra remains 30% open);</li><li>Repeat the previous steps for the 2nd chakra, but in this case, women close by 80%, and men close by 60%;</li><li>Repeat the previous steps for the 3rd chakra, but in this case, women close by 30%, and men close by 50%.</li></ul><p>Men and women close the chakras in different percentages because feminine energy is more abundant in women, and masculine energy is more abundant in men. By doing that, besides equalizing energies, we also prevent projections that often originate in the lower chakras.</p>"}'::jsonb, 26, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/aura-1/02-chakra-closure-percentages.png", "alt": "Chakra Closure Percentages", "caption": "1st chakra: 70% closed (all). 2nd chakra: 80% women, 60% men. 3rd chakra: 30% women, 50% men."}'::jsonb, 27, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 28, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- 2. Reading Screen (page 6)

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "2. Reading Screen", "level": 2}'::jsonb, 29, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>The reading screen is the location where the images to be read will be presented. It should be grounded so that the energies of the images can be cleansed and transmuted in the center of the Earth.</p><ul><li>Create a screen, like a movie screen, grounded to the center of the Earth;</li><li>Expand the grounding cord laterally to the width of the screen;</li><li>Create a high-vibration Rose grounded in one corner of your screen;</li><li>This will be your Rose of mirror images; program this Rose to absorb everything that serves you as well throughout the entire Reading;</li><li>At the end of the Reading, you will read what the Rose absorbed.</li></ul>"}'::jsonb, 30, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/aura-1/03-reading-screen.png", "alt": "Reading Screen", "caption": "The reading screen grounded to the Earth with a mirror Rose in the corner"}'::jsonb, 31, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- 3. Reading Triangle (page 6)

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "3. Reading Triangle", "level": 2}'::jsonb, 32, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>The Reading Triangle is formed by neon electric blue lines that connect the 6th and 7th chakras with the reading screen and another one that connects them to each other. We use the triangle to do the Aura Reading from these chakras: the vision chakra and the Divine connection chakra.</p><ul><li>Create a neon electric blue line that goes from the crown chakra to the center of the reading screen;</li><li>Create another neon electric blue line that goes from the third eye chakra to the center of the screen;</li><li>Create another neon electric blue line that connects the crown chakra to the third eye chakra;</li><li>Put the intention for a continuous flow of information within the field formed by this triangle, and for all Aura Reading to occur from this space.</li></ul>"}'::jsonb, 33, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- 4. Electric Helmet (page 7)

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "4. Electric Helmet", "level": 2}'::jsonb, 34, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/aura-1/04-reading-triangle-helmet.png", "alt": "Reading Triangle and Electric Helmet", "caption": "The reading triangle connecting the 6th and 7th chakras to the screen, with electric helmet"}'::jsonb, 35, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>The electric helmet brings the vibration of Aura Reading (electric blue or neon blue) to the entire region of clairvoyance, clairaudience and clairsentience and protects these subtle perception centers from possible interference.</p><p>Wrap your head with the energy of the color electric blue (neon blue), creating a layer of protection like a helmet or a turban. This is your electric helmet and it should always have the same shape.</p>"}'::jsonb, 36, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- 5. Aura Reading Prayer (page 7)

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "5. Aura Reading Prayer", "level": 2}'::jsonb, 37, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>The Aura Reading prayer opens the Reading, protects and raises the vibration. It is also a way of handing over the Aura Reading to what is higher, leaving the reader with the task of reading with neutrally.</p>"}'::jsonb, 38, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p><strong><em>\"As we read we allow the energies of the cosmos and the earth to flow through our bodies opening the doors through which we become more aware of our spirituality and increase the communication with the God of our hearts.</em></strong></p><p><strong><em>May it be with the blessing of the Supreme Being that whatever happens during this reading will benefit each of us in our spiritual growth, openness of conscience and understanding.</em></strong></p><p><strong><em>So it is! So it is now!\"</em></strong></p>"}'::jsonb, 39, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 40, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- The Person's Name (page 8) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "6. The Person''s Name", "level": 2}'::jsonb, 41, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p><strong><em>Ask the person to say their full name out loud 3 times</em></strong> (the name on their ID card).</p><p>While they say their name:</p><ul><li>See the person in gold;</li><li>See the chair where the person is sitting in gold;</li><li>Ground the person with a golden grounding cord;</li><li>Use your hands to help.</li></ul><p>The name brings the presence, the spirit of the person. If the person has a spiritual name or a social name (in the case of trans people), they can choose which name to use or use both. If it''s a recorded Aura Reading, ask for the name in advance and say the person''s name out loud three times yourself.</p><p>Having said the name, welcome them out loud. In fact, we are welcoming the Spirit. It is often the first time the person is recognized as Spirit and <strong><em>that is the great purpose of Aura Reading in the world: to bring people to the awareness that they are a Spirit incarnated in a physical body bathed directly by the Great Sun, by the Supreme Being, by the Great Spirit.</em></strong></p>"}'::jsonb, 42, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/aura-1/05-person-sitting-in-gold.png", "alt": "Person Sitting in Gold", "caption": "The person sitting in gold with golden grounding cord"}'::jsonb, 43, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 44, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- The Aura Reading (pages 9-10) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "The Aura Reading", "level": 1}'::jsonb, 45, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- 1. Opening (page 9)

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "1. Opening", "level": 2}'::jsonb, 46, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>On the Reading Screen, see/create a Golden Sun and say out loud:</p><p><strong><em>\"The first image I see is a Great Golden Sun that represents the Supreme Being, God, the Divine, the Source, or whatever you want to call it\"</em></strong></p><p>You can say all these names or just one or some of them. We say \"whatever you want to call it\" to include other ways the person has of connecting with the Divine, because people often carry beliefs that can limit their openness and in this way we achieve greater neutrality. For the same reason, you shouldn''t put names here that you personally use to connect with the Divine other than these names.</p>"}'::jsonb, 47, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- 2. Rose of the Spirit (page 9)

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "2. Rose of the Spirit", "level": 2}'::jsonb, 48, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>Now look at a Rose and say out loud:</p><p><strong><em>\"And under this Golden Sun, I see a Rose that represents you, the Spirit, in the present moment.\"</em></strong></p>"}'::jsonb, 49, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/aura-1/06-golden-sun-rose-on-screen.png", "alt": "Golden Sun and Rose on Reading Screen", "caption": "The Golden Sun above and the Rose of the Spirit below on the reading screen"}'::jsonb, 50, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- Reading the Rose of the Spirit (page 10)

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "Reading the Rose of the Spirit", "level": 3}'::jsonb, 51, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>COLOR | IMAGE | MESSAGE</p><ul><li>Look at the Rose and see what color it is.</li></ul><p><strong><em>\"The Color I see is...\"</em></strong></p><ul><li>Explain that this is the vibration of the present moment.</li><li>Immerse yourself in this color, intending to see an image inside. Say:</li></ul><p><strong><em>\"The Image I see is...\"</em></strong></p><ul><li>Describe the image to the person.</li><li>Inside this image there is a message. Well connected to the image, say:</li></ul><p><strong><em>\"The Message I see is...\"</em></strong></p><ul><li>Convey the message to the person by translating the contents of the image in a way that they can understand.</li></ul><p>This principle of COLOR, IMAGE, MESSAGE is present in most Aura Reading techniques. To understand the principle of color, image and message, we can visualize Aura Reading as a corridor full of doors. Each door is one of the techniques we use. The color works like a key that brings in and opens the energy. The image is the language of Spirit and transmits the information that is contained in the different rooms of the person''s Aura on levels that go beyond our ability to understand rationally. The message is a way of closing the door of that room and moving on to the next technique, bringing that awareness to the person on a level closer to the reality they live in. The most important part is the IMAGE and this is what a person usually remembers even years after receiving the Aura Reading.</p><p>Images can be symbolic or real. Symbolic images, which are the images we see the most, reveal how this energy is acting in the person''s life, what is the energetic dynamic. Each element of the image has a meaning that is conveyed in the message. When they are real, we are reading memories, scenes that really happened in the person''s life. In this case, it is an energy that has its origin in the past, but is influencing the person in the present moment. Therefore, even when the images show elements from the past, the message is always for the present moment.</p>"}'::jsonb, 52, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 53, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- Between One Technique and Another (page 11) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "Between One Technique and Another", "level": 2}'::jsonb, 54, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>At the end of the message, when you finish any of the Aura Reading techniques:</p><ul><li>Visualize the Reading Screen (even if in the course of the Reading we have lost sight of the boundaries of the screen);</li><li>Create high-vibration unrooted Roses in the palms of your hands;</li><li>Wipe the screen from top to bottom as if the Roses were erasers on a blackboard;</li><li>When finished, send the Roses to the center of the Earth through the grounding cord of the canvas;</li><li>This procedure should be repeated at the end of each technique.</li></ul>"}'::jsonb, 55, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 56, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- 3. Information from the Divine (pages 11-13) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "3. Information from the Divine: Direct or Indirect", "level": 2}'::jsonb, 57, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>This technique shows how the person is receiving Information from the Supreme Being. These are Informations that are relevant to spiritual development. It is with these Informations that we make important decisions in our lives, for example. This technique is presented in the form of a clock. The Supreme Being is represented by the Sun at the top of the clock and the Spirit is represented by the Rose which will appear at number 3, 6 or in between.</p><p><strong>The time indicated by the Rose will always be seen between 3 and 6 o''clock.</strong></p><p>Tell the person:</p><p><strong><em>\"Now I''m going to see how you are receiving the information from the Supreme Being, the Divine Information, whether directly or indirectly...\"</em></strong></p><ul><li>On your Reading Screen, create/view an analog clock with the Sun at the 12 o''clock position;</li><li>Read the position of the clock hands; this clock has a Rose on the tip of the hand that indicates the time; this is where the person''s Spirit is;</li></ul>"}'::jsonb, 58, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/aura-1/07-clock-diagram.png", "alt": "Clock Diagram", "caption": "Analog clock showing the Sun at 12 o''clock position and the Rose between 3 and 6 o''clock"}'::jsonb, 59, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p><strong>At 6 o''clock</strong> — the information from the Supreme Being is direct. The person has insights about their path that come from themselves. They may come in meditation, in dreams, in synchronicities or they may simply know.</p><p><strong><em>\"...I see here that you receive Information from the Divine in a direct way.\"</em></strong></p><p><strong>At 3 o''clock</strong> — there is no direct information coming from the Supreme Being. That person needs intermediaries to receive Divine Information. This can happen through other people who give them advice, teachers, books, movies, therapists, priests, mediums, etc.</p><p><strong><em>\"...I see here that you receive Information from the Divine in an indirect way.\"</em></strong></p><p><strong>At 5 o''clock</strong> — the information is more direct than indirect. The person is receiving Divine Information within themselves, but they need to compare it with the information coming from outside.</p><p><strong><em>\"...I see here that you receive information from the Divine more directly than indirectly.\"</em></strong></p><p><strong>At 4 o''clock</strong> — the Information is more indirect than direct. The person needs external references in order to know the directions they should take in life, but at the same time they are receiving some information internally.</p><p><strong><em>\"...I see here that you receive Information from the Divine more indirectly than directly.\"</em></strong></p><p>After telling the person how they receive Divine Information, you can give some brief examples and explanations about it.</p><p>Initially, you will just tell the person how they are receiving the Information from the Supreme Being without going into more detail. But once you have more experience (at least 30 complete Aura Readings), you can ask the person if they would like to know more about how they are receiving Divine Information. To do this, you will open up a color, image and message to get a better understanding of how this dynamic occurs in the person''s life.</p>"}'::jsonb, 60, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 61, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- 4. Opening of the Rose (pages 13-14) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "4. Opening of the Rose", "level": 2}'::jsonb, 62, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>The degree of openness represents how receptive the person is to Divine Information, how willing the person is to receive what comes from the Divine into their life.</p><p>Tell the person:</p><p><strong><em>\"Now I''m going to see your degree of openness to receiving this Information from the Supreme Being...\"</em></strong></p><ul><li>Create a Rose on your Reading Screen. This Rose will have a percentage written next to it, which corresponds to the person''s degree of openness.</li><li>See what the percentage is and say, for example in the case of 50%:</li></ul><p><strong><em>\"I see that you are 50% open to receiving Information from the Divine.\"</em></strong></p><p>This technique is complementary to the Clock Position technique. For example, a person whose clock is in position number 3 (indirect), but has a high degree of openness (for example 95%), receives Divine Information indirectly, but is putting everything they receive into practice. All combinations are possible.</p><p>Also in this case, after a certain amount of experience doing Aura Readings (at least 30 complete Aura Readings), we can open up a color, image and message to help the person understand what puts them in that specific degree of openness.</p>"}'::jsonb, 63, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/aura-1/08-rose-opening-percentage.png", "alt": "Rose Opening Percentage", "caption": "A Rose with 50% opening percentage representing receptiveness to Divine Information"}'::jsonb, 64, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 65, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- 5. Soul Phase (pages 14-15) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "5. Soul Phase", "level": 2}'::jsonb, 66, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>The Soul Phase refers to the type of experience a person needs to do to evolve spiritually in the present moment. It is common that the phase the person is living corresponds to their biological age, but this is not always the case. Life situations can push a person to jump to a more advanced phase and in these cases it may be necessary for the person to go back to the previous stage to experience what they missed out on.</p><p>Tell the person:</p><p><strong><em>\"Now I''m going to look at the Soul Phase you''re in at the present moment...\"</em></strong></p><p>In this technique we read the stem of the rose. The length of the rose''s stalk (stem) indicates the phase that the soul is living on Earth at the present moment. Create a rose, look at the rose''s stem and ask for a percentage. This percentage will indicate which phase the soul is now.</p><ul><li>Study the different Phases of the Soul in order to be able to explain to the person what each Phase means.</li></ul>"}'::jsonb, 67, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/aura-1/09-soul-phases.png", "alt": "Soul Phases", "caption": "Rose with stem showing: Baby Phase (0-25%), Youth Phase (25-50%), Adulthood Phase (50-75%), Mature Phase (75-100%), Elder Phase (root, over 100%)"}'::jsonb, 68, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p><strong>The purpose of the reading</strong> is to aid the consultant in understanding their current life circumstances. Each phase will offer clarity, explanation and insights needed by the soul. It will help to situate themselves within their own life, because their Personality might believe to be in a different phase than the one they actually are.</p><h3>Baby Phase (0% - 25%)</h3><p>People in this phase will rarely come in for an Aura Reading. They are people who live a basic life, connected to survival, in an elementary state. They live with a more limited awareness and much of what they do is driven by necessity.</p><h3>Youth Phase (25% - 50%)</h3><p>Here, people seek a wide variety of experiences. They travel to different places, try different flavors, colors and rhythms. They are people who are in the phase of getting to know themselves, exploring the world, discovering, experiencing life and freedom of choice.</p><h3>Adulthood Phase (50% - 75%)</h3><p>Here, the person begins to feel the need, the desire to structure themselves, to have a family, stability, financial abundance. It''s a time of personal fulfillment and an ego-strengthening phase, in which the person seeks recognition and wants to experience security and status.</p><h3>Mature Phase (75% - 100%)</h3><p>The person has already lived through many experiences and wants to integrate everything they''ve experienced, seeking greater depth in their relationship with themselves, with the world and with the divine. It''s a phase of internal searching, inner research and self-responsibility.</p><h3>Elder Phase (Root - Over 100%)</h3><p>It is less common for someone in this phase to seek an Aura Reading. Usually would be people who need to better understand some specific aspect. They are people who don''t need much on this plane, have a lot of consciousness and don''t seek fulfillment outside. They dedicate more of their lives to service and self-knowledge. Their priority is to live their life purpose!</p>"}'::jsonb, 69, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 70, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- 6. Spiritual Agreements (pages 16-17) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "6. Spiritual Agreements of Biological Maternity or Paternity or Mother Figure/Father Figure", "level": 2}'::jsonb, 71, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>The Rose of Maternity and Paternity Agreements or Mother Figure/Father Figure presents the agreements created of free will on the spiritual plane between two spirits and which determine whether they are a biological mother/father or a mother/father figure.</p><p><strong><em>Spiritual agreements are created on the Spiritual Plane by the free will of both parts on a spiritual level and can be created or undone by the choice of one of the parts or both of them, at any time.</em></strong></p><p>It is important to read the information that emerges for the agreement in question. Mother-figure/Father-figure agreements are important and arise to legitimize an unrecognized relationship or even to work out a mother/father figure agreement with someone else whom this agreement generates conflicts.</p><p>Tell the person:</p><p><strong><em>\"I''m now going to read out the Maternity or Paternity Agreements or Mother Figure/Father Figure agreements present at this moment. These agreements are created on the spiritual plane of their own free will and can be created or undone at any time\"</em></strong></p><ul><li>Look at the stem of the rose. The agreements will be represented by leaves.</li><li>The positioning of the leaves, their characteristics, their vibrancy/vitality and whatever else the reader can capture, are information that speaks of the agreement in question. We don''t refer to the leaves when conveying the information, we say: agreements.</li><li>You can ask the person being read whether or not they have biological children.</li><li>In some situations it is possible to see the faces of the people representing the agreement. And the dynamics of the agreement itself.</li><li>Agreements can also be read by asking for a rose to present COLOR-IMAGE-MESSAGE about the agreement in question, when there are doubts or a need to go deeper.</li><li>We won''t open the technique without the full sentence highlighted above!</li></ul>"}'::jsonb, 72, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/aura-1/10-rose-with-leaves.png", "alt": "Rose with Leaves (Agreements)", "caption": "Rose with leaves on the stem representing spiritual agreements"}'::jsonb, 73, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 74, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- 7. Memories of Past Lives (pages 18-20) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "7. Memories of Past Lives (From the Human Collective Unconscious)", "level": 2}'::jsonb, 75, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>Now we''re going to access the human collective unconscious to read the memory of a past life. It''s as if we were entering a library where the memories of all the lives that have already been lived are (it is possible to call this great library Akashic records). There, some lives are available to be read by you to that person according to the level of consciousness of both of you at the present moment.</p><p>The person''s Spirit will choose one, two or three lives for you to read to them. These are the lives that vibrate the frequency most similar to the person''s frequency and are not necessarily lives that this person lived, but because they vibrate at the same frequency, they certainly contain precious information for the present moment.</p><p>Tell the person:</p><p><strong><em>\"Now I''m going to read a past life from the human collective unconscious that is not necessarily yours, but that brings understanding, healing and learning to your present life.\"</em></strong></p><ul><li>Create/see a Rose and on its stem see up to three rings;</li><li>Each ring represents a past life. Each ring has a vibration/color corresponding to that life to be read;</li><li>See the colors of the rings and ask the Spirit to choose which ring to read and feel which ring should be read, for example by observing that one ring glows brighter; tell the person:</li></ul><p><strong><em>\"The color of that past life is...\"</em></strong></p><ul><li>And tell the colour of the past life to the person;</li><li>Dip into the color or open the ring, and inside that color is a past life.</li><li>See the date and place of the past life and tell the person;</li></ul><p><strong><em>\"The place where this past life took place was...\"</em></strong></p><p><strong><em>\"The year in which this past life took place was...\"</em></strong></p><ul><li>Read the life, locating the character who manifests the energy of the person being read, who represents the person in that past life;</li><li>It is possible to move the past life back in time and discover information relevant to the person''s learning, by going forward or backwards in time in that life. You can use your hands to do it;</li><li>At the end of the Past Life Reading, create a Rose and ask for the message that life brings to the consultant''s present moment and transmit the message.</li></ul><p><strong><em>\"The message from this past life to your present life is...\"</em></strong></p><p>We can read up to 3 past lives with each Reading. In this case, they will be shorter stories. There are Readings in which we only work on past lives, in which we can read more than 3 rings, but only after completing the full Aura Reading training.</p>"}'::jsonb, 76, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/aura-1/11-rose-with-rings.png", "alt": "Rose with Rings (Past Lives)", "caption": "Rose with rings on the stem representing past lives from the collective unconscious"}'::jsonb, 77, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>Past lives bring learning of many kinds. They can come to:</p><ul><li>Show qualities;</li><li>Present lives of courage and bravery, such as the life of a warrior in which the person manifested great strength;</li><li>Give a warning about how a dynamic the person is experiencing could evolve into something more serious;</li><li>Present lessons;</li><li>Show repetitions of patterns;</li><li>Manifest as a gift to the person;</li><li>Help to understand why the person was born into that family, at that time, in those conditions, with those qualities and needs, etc.</li><li>Activate and integrate forgotten (sometimes traumatic) memories from this life by reading dynamics with the same vibration;</li><li>Presenting what needs to be cleared and released.</li></ul><p>In the initial training (in your first readings) you don''t read rings in the colors: red, grey, brown. Reading black rings requires more experience and guidance.</p><p>Even a difficult life brings learning and something to integrate. In Aura Reading, all information comes to the surface to generate learning, discovery, transformation, healing and everything else that is aligned with Spirit. Therefore, you don''t see anything as negative, but as learning to generate benefit for the person being read, because the vibration is very high.</p><p>Finally, clear the energy of the past life on the screen, as taught at the beginning.</p>"}'::jsonb, 78, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 79, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- 8. Reading the Layers of the Aura (pages 20-21) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "8. Reading the Layers of the Aura (Related to the Chakras)", "level": 2}'::jsonb, 80, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>The last part of the general Aura Reading is the Reading of the 7 chakras or the 7 layers of the Aura. We start with the first chakra and work our way up to the seventh. For each chakra, we read a color, image and message. This means that we read an energy that predominates in the functioning of that chakra at the person''s present moment. These colors are not necessarily the colors we normally associate with the chakras and we can see any color in any chakra.</p><p>With the power of our intention, we say:</p><p><strong><em>\"Now, I''m going to read your first chakra, the first layer of your Aura. The color I see is...\"</em></strong></p><ul><li>Say the color and then read the image and the message.</li></ul><p><strong><em>\"The Image I see is...\"</em></strong></p><p><strong><em>\"The Message I see for the first chakra is...\"</em></strong></p>"}'::jsonb, 81, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/aura-1/12-chakra-body-diagram.png", "alt": "Chakra Body Diagram", "caption": "The 7 chakras on the body, read from 1st to 7th: red, orange, yellow, green/pink, sky blue, indigo, violet"}'::jsonb, 82, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p><strong>We start with the first chakra and work our way up to the seventh, in this order: 1st, 2nd, 3rd, 4th, 5th, 6th and 7th.</strong></p><ul><li>You can create a Rose to see what color that chakra is, just as you can create Roses at any time during the Reading to give you more clarity in times of confusion.</li><li>Continue reading chakra by chakra until you reach the seventh chakra, which closes the Aura Reading.</li><li>Always remember to clean your Reading Screen between reading one layer of the Aura and the next.</li></ul>"}'::jsonb, 83, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 84, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- 9. Mirror Rose (pages 22-23) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "9. Mirror Rose", "level": 2}'::jsonb, 85, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>One of the greatest qualities of Aura Reading is the mirrors, i.e. information that serves both the person being read and the reader. Healing becomes complete in this way.</p><p>When the reader doesn''t recognize the mirrors, doesn''t use them as learning, he or she loses the possibility of bringing to consciousness something that is unconscious, and this information densifies, generating the possibility of making projections.</p>"}'::jsonb, 86, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/aura-1/13-mirror-rose-on-screen.png", "alt": "Mirror Rose on Screen", "caption": "Reading screen with a Mirror Rose grounded in one corner"}'::jsonb, 87, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "How Do I Use the Mirror Rose?", "level": 3}'::jsonb, 88, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<ul><li>After creating your Reading Screen, create a Rose grounded in one of the four corners;</li><li>Put the intention of receiving any mirror images that may appear during the Reading on it;</li><li>When you identify an image that works for you on some level (even if not completely), drag that image onto your Mirror Rose using your hands and continue the Reading — the Mirror Rose stays there.</li><li>Repeat this procedure whenever you see images that suit you, that seem to concern you or that in some way move you, for example in the body, voice, emotions.</li><li>Immediately after or as soon as you finish the Reading, read your Mirror Rose as in a self-reading with color, image and message.</li></ul><p>It is very useful and important to write down in a notebook what is a mirror for you. This allows you to advance in the work of self-knowledge, which works like an anti-projection vaccine. The more the reader knows about their own blockages and distortions, the more neutral they will be when reading the images and the more deeply they will be able to convey the messages.</p>"}'::jsonb, 89, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 90, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- 10. Self-Reading (pages 23-24) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "10. Self-Reading", "level": 2}'::jsonb, 91, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>Self-reading is the essence of aura reading. It''s when we dedicate ourselves to listening deeply to our own spirit, our \"God of the Heart\". It is a sublime and profound moment. It''s a true encounter with essence!</p><ul><li>Self-reading can be done completely, reading all the steps of the aura reading for yourself, from the Rose of Spirit to the seven chakras.</li><li>In self-reading, you don''t read the Mirror Rose because the whole reading is already assigned to you.</li><li>To do the self-reading, initially, proceed in the same way as with a reading for another person, preparing yourself by completing the steps of preparation and opening.</li><li>It''s not necessary to close the first three chakras for self-reading, because a lot of relevant information comes from them for your conscious awareness and liberation.</li><li>After preparing, open the reading with a prayer and say your full name three times. The first few times, do this out loud like you''re reading to someone else. Record your self-reading so that you can then listen carefully and write it in your reading notebook. Read all the steps. Past life brings profound revelations as always, and in self-reading this can be even more moving.</li><li>At the end of the Self-Reading, you don''t have to do the steps of releasing the other person, such as putting yourself inside a Rose and exploding your own energy, putting the stick of agreements and the book of life in a Rose.</li><li>But rather, at the end, follow the closing steps for yourself, explode your instruments and see yourself inside the unrooted pink Rose, on your way to the center of the universe.</li></ul><p><strong><em>– Happy, healthy and whole, body mind and soul.</em></strong></p><p>The way of practicing self-reading, described above, is the formal and complete way. Over time, you will realize that you can do self-reading in a more spontaneous and faster way, in addition to the complete way. In your first experiences, you may have doubts about the images: \"but I already know that about myself\", \"I was told that\", \"this image is a photo from my childhood and it doesn''t count\". It doesn''t matter!</p><p>Self-reading shows you whatever it is or whatever you think you know in a way you''ve never accessed. It opens up and broadens your understanding of a lot of pseudo-understood things, as well as bringing out deep contexts and creating an intimate and precise access to yourself. It''s your commitment to yourself! It''s your present! It''s your moment!</p>"}'::jsonb, 92, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "Daily Short Self-Reading", "level": 3}'::jsonb, 93, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>At the end of your daily Rose Meditation, create your instruments, say the prayer and speak your full name three times, read what the rose of the spirit brings to you this day! If you wish, read another technique that is relevant to something that is going to happen this day! This can also be done when a decision is about to be made, or to understand a reaction or behavior throughout the day, life or week.</p>"}'::jsonb, 94, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 95, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- Aura Reading Diagram (page 25) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "Aura Reading Diagram", "level": 2}'::jsonb, 96, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/aura-1/14-aura-reading-diagram.png", "alt": "Aura Reading Diagram", "caption": "Complete flow diagram of the Aura Reading process: Preparation → Prayer → Name → Golden Sun → Rose of Spirit → Information from Divine → % Opening → Soul Phase → Agreements → Past Lives → Chakra Layers → Close"}'::jsonb, 97, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 98, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- Possible Interferences (page 26) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "Possible Interferences", "level": 2}'::jsonb, 99, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>Normally, we are committed to telling the person everything we see in an Aura Reading. However, there are some energies that we shouldn''t read in order to protect ourselves as readers, because they are images that can more easily contain interference. This means that other energies, such as entities, can take on this form and interfere with the reading. Therefore, we don''t read: <strong>snakes, lizards, spiders and dragons.</strong></p><p><strong>What do I do if any of these elements appear?</strong></p><p>Create a Rose, place the element inside the Rose and explode it outside the Aura. Follow the Aura Reading as normal. If you need to, you can use the Rose Meditation techniques to regain your neutrality, as you can always do during the Reading.</p><p>If this dynamic is repeated in the same image, which is rare, you can create a Rose, put the whole image inside the Rose and explode. Clear the screen and if necessary you can even put it in a Rose, blow it up and create a new one.</p>"}'::jsonb, 100, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- More Information About the Message (page 26) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "More Information About the Message", "level": 2}'::jsonb, 101, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>The message is an expression of the image, just as the image is an expression of the color. When reading the message, we must be careful not to bring in elements that were not contained in the image, because the image is the language of the Spirit and by deviating from it, we can project our own contents.</p><p>When we come across difficult images, we have to be even more careful not to distort the images when conveying the message. This is when we must be careful not to lose our neutrality by trying to save the person, saying that everything is fine or giving advice to get them out of this situation. We simply read the message from the top of our consciousness through the neon blue triangle in our upper chakras. We always focus on learning from the situation without giving advice.</p><p>We should also remember that Aura Reading is always about the present moment. Therefore, when a dynamic appears that happened to the person in the past, it means that this past is influencing the present.</p><p>It is the reader''s job to convey to the person how this is happening at the time of the message, supported by the image. This also means that we don''t read the future in Aura Readings, because the energies we are reading in the present can unfold in different ways, including through the influence of the Reading itself.</p>"}'::jsonb, 102, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'page-break', '{}'::jsonb, 103, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- --- Closing the Reading (pages 27-30) ---

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "Closing the Reading — Separation Techniques", "level": 1}'::jsonb, 104, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>After the Reading, it is important to carry out the energy separation techniques, the purpose of which is to maintain the cleanliness of the Aura, protection and neutrality of the reader in relation to the energy of the person being read.</p><ul><li>When you have finished the Reading, say that the Reading is over and it is time to close;</li><li>Tell the person that during the Reading there was a lot of release, movement and cleansing of energy;</li><li>Say the following sentence exactly as it is written:</li></ul><p><strong><em>\"Now close your eyes, and I will fill you with your own energy, from your divine essence, with the highest vibration of this present moment\"</em></strong></p><ul><li>As you do this, imagine a Golden Sun above the person with their name engraved in golden letters. With your hands, fill the person with the golden light of that sun, from top to bottom.</li><li>Ask the person to release excess energy by placing their hands on the floor. During this moment, cut the cords as described below.</li></ul>"}'::jsonb, 105, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- Cutting the Cords

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "Cutting the Cords", "level": 3}'::jsonb, 106, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>While the person is releasing the energies with their hands on the floor:</p><ul><li>Visualize your Aura with cords coming out of your chakras;</li><li>Bring your dominant hand up to the 7th cervical vertebra, which is at the junction of the neck and back at the level of the 5th chakra;</li><li>Intend that your hand has the power to cut all the cords;</li><li>Make the movement of cutting the cords with determination, passing over your head and through all the chakras on the front of your body until you reach under your first chakra;</li><li>Repeat this movement 3 times.</li></ul>"}'::jsonb, 107, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/aura-1/15-filling-with-energy.png", "alt": "Filling with Energy and Cutting Cords", "caption": "Golden Sun with name above the person, and the cord-cutting movement repeated 3 times"}'::jsonb, 108, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- Saying Goodbye

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "Saying Goodbye to the Person", "level": 3}'::jsonb, 109, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>At the end of the Aura Reading, tell the person that they should drink plenty of water that day, as the energetic cleansing that has taken place can continue on a physical level. Say goodbye and carry out your cleansing ritual.</p><ul><li>Cut your grounding cord and create a new one;</li><li>Fill yourself with the light of the Golden Sun;</li><li>Create a Rose to recover your dispersed energy.</li></ul><p>Then follow the instructions below, according to the illustrative reference:</p>"}'::jsonb, 110, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- 1) Returning Energy to the Person

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "1) Returning Energy to the Person", "level": 3}'::jsonb, 111, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<ul><li>Create a grounded Rose in a high-vibration color;</li><li>Place the person dealt with inside the Rose;</li><li>Explode the Rose out of the Aura.</li></ul><p>In this way you return energies to the person that may have remained in their Aura during the Reading.</p>"}'::jsonb, 112, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/aura-1/16-person-in-rose.png", "alt": "Returning Energy to the Person", "caption": "Person placed inside a grounded Rose to return their energy"}'::jsonb, 113, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- 2) Book of Life

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "2) Book of Life", "level": 3}'::jsonb, 114, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<ul><li>Create a high-vibration grounded Rose;</li><li>Place the book of life of the person who was read in the Rose;</li><li>The book has the name of the person who was read on the cover;</li><li>The book has a golden cord with which you make a beautiful bow;</li><li>Close the book with the bow;</li><li>Explode the Rose out of the Aura.</li></ul><p>This is the book that stores the information about the person''s life that we need to read their Aura. When we finish the Reading, we no longer have access to this information, so we close the book and explode the Rose.</p>"}'::jsonb, 115, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/aura-1/17-book-of-life.png", "alt": "Book of Life", "caption": "Book of life placed inside a grounded Rose with golden bow"}'::jsonb, 116, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- 3) Stick of Agreements

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "3) Stick of Agreements", "level": 3}'::jsonb, 117, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>In order for the Aura Reading to take place, an agreement is made on a spiritual level. When the reading is over, this agreement has been fulfilled and it is important to break the stick that represents this agreement. This does not prevent further agreements from being made, for example, when the person returns for another Aura Reading in the future.</p><ul><li>Visualize the stick of agreements that contains all the healing agreements made between the reader and the consultant;</li><li>Break this stick into three pieces;</li><li>Create a high-vibration grounded Rose;</li><li>Place the three pieces of stick in this Rose;</li><li>Explode the Rose out of the Aura.</li></ul>"}'::jsonb, 118, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/aura-1/18-stick-of-agreements.png", "alt": "Stick of Agreements", "caption": "Stick of agreements broken into three pieces inside a Rose"}'::jsonb, 119, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- 4) Pink Rose

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "4) Pink Rose", "level": 3}'::jsonb, 120, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<ul><li>Create an unrooted pink Rose;</li><li>Place the person in this Rose, visualizing them happy, healthy, complete in body, mind and spirit;</li><li>Repeat mentally: <strong><em>\"Happy, healthy and whole, body mind and soul\";</em></strong></li><li>While repeating, raise the Rose towards the center of the Universe, wishing it all the best.</li></ul>"}'::jsonb, 121, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/aura-1/19-pink-rose.png", "alt": "Pink Rose", "caption": "Person inside an unrooted pink Rose rising to the center of the Universe"}'::jsonb, 122, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- 5) Reading the Mirror Images

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "5) Reading the Mirror Images", "level": 3}'::jsonb, 123, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>Read your Mirror Rose as in a self-reading with color, image and message. If you see several mirrors during the reading, read several colors, images and messages.</p>"}'::jsonb, 124, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- 6) Screen, Triangle, Helmet

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "6) Screen, Triangle, Helmet", "level": 3}'::jsonb, 125, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<ul><li>Create a high-vibration grounded Rose;</li><li>Place the reading screen, triangle and helmet inside;</li><li>Explode the Rose.</li></ul>"}'::jsonb, 126, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- 7) Cleansing

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "7) Cleansing", "level": 3}'::jsonb, 127, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<p>Cleanse with the four golden sticky Roses.</p><p><strong>Important:</strong> Cleansing is a determining and protective part of the integrity of the reader''s energy and should be done immediately after each Reading. If you do a lot of Readings in one day or if a Reading was very challenging, you may need to do the complete Rose Meditation with all the steps.</p>"}'::jsonb, 128, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'image', '{"src": "/rose med images/aura-1/20-cleansing-sequence.png", "alt": "Cleansing Sequence", "caption": "Four-panel cleansing sequence with golden sticky Roses spiraling through the chakras"}'::jsonb, 129, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- 8) Closure of the Reading

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'heading', '{"text": "8) Closure of the Reading", "level": 3}'::jsonb, 130, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT m.id, 'en', 'text', '{"html": "<ul><li>Explode the 4 Roses in the corners of the room;</li><li>Cut the grounding cord and create a new one, expanding it to the limits of the Aura;</li><li>Fill yourself with the light of the Golden Sun;</li><li>Place your hands on the floor to eliminate excess energy.</li></ul><p><strong>Enjoy the state of high vibration, have a good day and be happy!</strong></p>"}'::jsonb, 131, 'System'
FROM public.manuals m WHERE m.slug = 'aura-level-1';

-- =============================================================================
-- COPY ENGLISH BLOCKS TO ALL OTHER LANGUAGES
-- =============================================================================

INSERT INTO public.manual_blocks (manual_id, language, block_type, content, position, updated_by)
SELECT b.manual_id, lang.code, b.block_type, b.content, b.position, 'System'
FROM public.manual_blocks b
CROSS JOIN (VALUES ('pt'), ('es'), ('el'), ('ru'), ('uk')) AS lang(code)
WHERE b.manual_id = (SELECT id FROM public.manuals WHERE slug = 'aura-level-1')
  AND b.language = 'en';
