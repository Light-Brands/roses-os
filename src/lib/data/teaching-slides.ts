import type { TeachingSlide, ChakraSlideData } from './types';

// =============================================================================
// OPENING CONTENT — Displayed on the teaching hub page
// =============================================================================

export const openingAgreements = {
  title: 'Agreements & Virtues',
  text: 'Before beginning, all participants honor these agreements:',
  items: [
    'Punctuality',
    'Confidentiality',
    'Co-responsibility',
    'Trust',
    'Patience, Empathy and Compassion',
  ],
};

export const openingSacredCompanion = {
  title: 'Sacred Companion',
  paragraphs: [
    'This manual is a sacred companion for those who have been initiated into the path of Rose Meditation.',
    'These teachings are part of a living energetic lineage. They invite inner stillness, gentle discipline, and deep self-responsibility. ROSES OS is not a system to be imposed or taught casually — it is an energetic operating system revealed through direct practice and transmission.',
  ],
  guidelines: {
    title: 'To honor the integrity of this work:',
    items: [
      'Please do not share this material with others who have not received the transmission.',
      'This manual is for personal use only and cannot be used to teach or guide others.',
      'You are welcome to support children under your care with these tools.',
    ],
  },
  closing: 'Let each page be a reminder of the sacred space within you.',
};

export const openingHistory = {
  title: 'History & Lineage',
  text: 'Aura Reading emerged in the 1960s, in California, channeled by a North American called Lewis S. Bostwick. Founder of the Berkeley Psychic Institute and the Church of the Divine Man, he channeled and systematized the techniques and tools sent by the angels, to assist in the process of evolution of humanity.',
  lineage: 'Berkeley Psychic Institute → Anastasia Plunk → Angelina Ataide → ROSES OS',
};

// =============================================================================
// LEVEL 1 — Foundational Practices
// =============================================================================

export const level1Slides: TeachingSlide[] = [
  {
    id: 'l1-the-rose',
    slideNumber: 5,
    concept: 'The Rose',
    teachingText:
      'The Rose is the foundational symbol and tool of this practice — a living energetic instrument used throughout all levels of the work.',
    reimaginedImage: '5-the-rose.PNG',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-posture',
    slideNumber: 6,
    concept: 'Meditation Posture',
    teachingText:
      'Proper meditation posture is seated upright in a chair. Feet are flat on the floor, hands resting gently on the thighs or knees, spine upright, eyes closed. The body is relaxed yet alert — grounded and receptive.',
    reimaginedImage: 'Posturefinal.PNG',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-grounding-cord',
    slideNumber: 7,
    concept: 'Grounding Cord',
    teachingText:
      'The grounding cord is an energetic connection that extends from the base of the spine (first chakra) downward into the center of the Earth. It anchors your energy body to the planet, providing stability, safety, and a channel for releasing unwanted energy.',
    reimaginedImage: 'GroundingCordFinal.JPG',
    imageNote:
      'The original grounding cord (see slide 10 original: 10-grounding-cord-expansion-original .PNG) is more accurate than the reimagined version. New designs should reflect the original\'s depiction. The grounding cord should be more opaque/transparent, thick and strong, and less gold.',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-golden-sun',
    slideNumber: 8,
    concept: 'Golden Sun',
    teachingText:
      'The Golden Sun is a tool for replenishing and restoring your own energy. Visualize a radiant golden sun above your head. It calls back your own life-force energy from wherever you may have left it — in people, places, situations, or time. It fills you with your own highest vibration.',
    reimaginedImage: 'Golden sun.jpg',
    imageNote:
      'The grounding cord in this image should be thick, transparent, and strong — and should start lower in the body, under the crotch, as it comes from the base of the spine (1st chakra). Currently it appears too high and too golden.',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-aura-exercise',
    slideNumber: 9,
    concept: 'An Exercise to Feel Your Aura',
    teachingText:
      'The aura is the energetic field that surrounds your physical body. This exercise helps you become aware of its presence, its edges, and its quality. The aura consists of multiple layers radiating outward from the body.',
    originalImage: '9-auraexercise-original .PNG',
    reimaginedImage: '9-aura-exercise .PNG',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-grounding-expansion',
    slideNumber: 10,
    concept: 'Expansion of Grounding Cord',
    teachingText:
      'Once you are aware of your aura, the grounding cord practice deepens. You ground not only the physical body but also the aura itself — allowing the entire energy field to anchor into the Earth.',
    originalImage: '10-grounding-cord-expansion-original .PNG',
    reimaginedImage: 'Expansioncord.jpg',
    imageNote:
      'The grounding cord should be more opaque/transparent, thick and strong, and less gold — same direction as slide 7.',
    level: 1,
    section: 'foundations',
  },
{
    id: 'l1-golden-sun-fills',
    slideNumber: 11,
    concept: 'Golden Sun Fills You',
    teachingText:
      'The Golden Sun above the crown pours golden light downward, filling the entire aura and body with your own highest vibration. This completes the full energetic architecture: posture, aura, grounding cord, and golden sun — all active together.',
    originalImage: '11-expansion fill with golden sun - original .PNG',
    reimaginedImage: 'Fillingsun.jpg',
    imageNote: 'The expanded grounding cord should also be represented in this image — it is part of the full energetic architecture. Same visual direction: thick, transparent, strong, less gold. NOTE: The current image repeats the same human figure used in slide 11 — please use a different human man for this slide to distinguish the two visuals.',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-earth-circuit',
    slideNumber: 12,
    concept: 'Circuit of the Energy of the Earth',
    teachingText:
      'The Earth circuit is an energetic pathway that draws the energy of the Earth upward through the feet, rising through the legs and into the body. This circuit connects you to the grounding, nourishing, stabilizing force of the planet.',
    reimaginedImage: '12a-earthenergy-new.PNG',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-cosmos-circuit',
    slideNumber: 13,
    concept: 'Circuit of the Energy of the Cosmos',
    teachingText:
      'The Cosmic circuit is an energetic pathway that draws cosmic energy downward through the crown of the head (7th chakra) and into the body. This circuit connects you to the higher frequencies of universal consciousness, inspiration, and spiritual guidance.',
    originalImage: '13-cosmos-original.PNG',
    reimaginedImage: 'IMG_6954.jpeg',
    imageNote:
      'Updated: New image with more refined arrows showing the cosmic energy circuit pathway. Previous version: 12Circuitofenergycismos .PNG',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-combined-circuit',
    slideNumber: 14,
    concept: 'Circuit of Energy of Cosmos and Earth',
    teachingText:
      'When both circuits are activated simultaneously, the energies of the Earth and Cosmos flow together through the body. Earth energy rises from below; Cosmic energy descends from above. They meet and blend within the body, creating a unified field of balanced, integrated energy.',
    reimaginedImage: '13a-cosmos:earthcycle.PNG',
    imageNote: 'Also see: 13cosmosearth.PNG. No original exists — this combined view is reimagined only.',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-rose-tool',
    slideNumber: 15,
    concept: 'The Rose (as Energetic Tool)',
    teachingText:
      'The Rose is used as a living energetic instrument throughout the practice. It has roots (connection to source), a stem (channel of energy), and a bloom (the active, radiant tool). The Rose can be placed, moved, opened, closed, and released according to the needs of the meditation.',
    originalImage: '14-Therosegold.PNG',
    reimaginedImage: '14-Therosegold.PNG',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-four-roses',
    slideNumber: 16,
    concept: 'Roses of Protection, Observation and Separation',
    teachingText:
      'Roses are placed at the edges of the aura to serve as energetic sentinels. They perform three functions:\n\n1. Protection — They define and guard the boundary of your aura\n2. Observation — They help you notice what energies are approaching or interacting with your field\n3. Separation — They create healthy energetic distinction between your energy and the energy of others',
    originalImage: '15-four roses original .PNG',
    reimaginedImage: '15-Four roses.PNG',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-cleansing-rose',
    slideNumber: 17,
    concept: 'Cleansing Rose',
    teachingText:
      'The Cleansing Rose is placed outside of the aura. It is used to absorb and transmute foreign or stagnant energy from within your field. Energy that does not belong to you — from other people, environments, or experiences — is drawn out of the aura and into the Cleansing Rose, where it is neutralized.',
    originalImage: '16-cleansing rose .PNG',
    imageNote: 'Reimagined version needs to be created.',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-energy-recovery',
    slideNumber: 18,
    concept: 'Energy Recovery of Each Chakra',
    teachingText:
      'After cleansing, the Rose is used to recover your own energy that has been left in or taken by others. The Rose is sent out as an instrument to gather and return your own life-force energy to each chakra, restoring fullness and sovereignty to each energy center.',
    originalImage: '17-recovery-rose-original .PNG',
    reimaginedImage: '17-recoveryrose.PNG',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-discharge',
    slideNumber: 19,
    concept: 'Discharge Excess Energy',
    teachingText:
      'After deep meditation or energy work, excess energy may accumulate in the body. To discharge it, lean forward from the seated position with hands reaching toward the ground. Allow the excess energy to flow out through the hands and into the earth, returning the body to a calm, balanced state.',
    originalImage: '18-discharge energy original .PNG',
    reimaginedImage: '18-discharge-excess .PNG',
    level: 1,
    section: 'foundations',
  },
];

// =============================================================================
// LEVEL 2 — Sacred Space & Chakra Activation
// =============================================================================

export const level2Slides: TeachingSlide[] = [
  {
    id: 'l2-sacred-space',
    slideNumber: 20,
    concept: "Let's Create Your Sacred Space",
    teachingText:
      'Level 2 begins with creating your own sacred space — an internal energetic environment that serves as your meditation home. This is the space from which all deeper work is conducted.',
    reimaginedImage: 'DCFB7B9E-79D0-4B99-9058-0EB2BC97BAED.png',
    imageNote: 'Illustration needed: A person seated in meditation posture, with a glowing point of awareness at the center of the head — the sacred space. Should convey inner stillness, spiritual authority, and the feeling of being safely centered within. Reference: PDF source "CENTER OF THE HEAD - SACRED SPACE" section.',
    level: 2,
    section: 'sacred-space',
  },
  {
    id: 'l2-6th-7th-chakras',
    slideNumber: 21,
    concept: 'The 6th and 7th Chakras (Sacred Space)',
    teachingText:
      'Understanding the locations and roles of the upper chakras is essential for Level 2 work:\n\n• 6th Chakra (Third Eye) — Located at the center of the forehead, between and slightly above the eyebrows\n• 7th Chakra (Crown) — Located at the top of the head',
    originalImage: '19-sacredspace-original.jpg',
    reimaginedImage: '19-sacred space.PNG',
    imageNote: 'Part of the sacred space slide sequence.',
    level: 2,
    section: 'sacred-space',
  },
  {
    id: 'l2-physical-space',
    slideNumber: 22,
    concept: "Let's Prepare Your Physical Space",
    teachingText:
      'Before meditation, prepare your physical environment to support the energetic work. The external space should mirror the internal intention: clean, clear, quiet, and intentionally held.',
    reimaginedImage: 'C0F3BC73-8CAA-4033-AC62-E0B55E88006F.png',
    imageNote: 'Illustration needed: A clean, serene meditation room — tidy and intentionally arranged. Could show a chair in a quiet room with soft light, conveying readiness and sacred intention. This bridges the inner sacred space with the physical environment. Reference: PDF source "PHASE B - PREPARING THE SPACE" introduction.',
    level: 2,
    section: 'sacred-space',
  },
  {
    id: 'l2-protection-space',
    slideNumber: 23,
    concept: 'Protection of the Space',
    teachingText:
      'The physical meditation space is protected by creating an energetic grid using roses. Golden roses are placed at the four corners (and above/below) of the space, connected by lines of golden energy forming a sacred geometric structure — a container for the work.',
    originalImage: '20-protectthespace- original .jpg',
    reimaginedImage: 'Create the room.jpg',
    imageNote:
      'Designer notes: The lines of the room/grid are all in gold. The room also has its own grounding cord that expands within the space — not depicted in the current image. The grounding cord should be clear and transparent so people understand the cord also expands within the room. This is a visual challenge given the complexity of the grid; the designer has creative freedom to find a solution.',
    level: 2,
    section: 'sacred-space',
  },
  {
    id: 'l2-cleansing-space',
    slideNumber: 24,
    concept: 'Cleansing of the Space',
    teachingText:
      'Once the space is protected, it is cleansed. A large Cleansing Rose is placed above the grid, and golden energy pours downward through the entire structure, clearing all foreign, stagnant, or disruptive energies from the space.',
    originalImage: '21-cleansing space - original .PNG',
    reimaginedImage: 'Cleanse the space.jpg',
    imageNote:
      'The room should show its own grounding cord expanding within the space. The grounding cord should be clear and transparent so people understand the cord also expands within the room — same visual direction as slide 20.',
    level: 2,
    section: 'sacred-space',
  },
  {
    id: 'l2-owning-space',
    slideNumber: 25,
    concept: 'Owning Your Space',
    teachingText:
      'After protection and cleansing, you claim ownership of the space. This is an act of energetic sovereignty — declaring the space as yours, filling it with your own energy and intention. The space becomes an extension of your aura and your practice.',
    originalImage: '22-protect the space- original .PNG',
    reimaginedImage: 'IMG_1806.jpg',
    imageNote:
      'The room should show its own grounding cord expanding within the space. The grounding cord should be clear and transparent so people understand the cord also expands within the room — same visual direction as slide 20. Also: four golden lines go from the perineum to the four bottom corners of the room, and four golden lines from the crown to the top four corners of the room — this should be clear as this is what the slide demonstrates.',
    level: 2,
    section: 'sacred-space',
  },
  {
    id: 'l2-chakras-intro',
    slideNumber: 26,
    concept: "Let's Talk About Chakras",
    teachingText:
      'The chakra system is the energetic anatomy of the human body. There are seven primary chakras, each governing specific aspects of physical, emotional, mental, and spiritual life.',
    reimaginedImage: 'IMG_6958.jpeg',
    imageNote: 'Illustration needed: An overview of the seven-chakra system along the human body — showing all seven chakras aligned from root to crown with their corresponding colors (red, orange, yellow, green, blue, indigo, violet). Reference: PDF source "PHASE C - CHAKRA CLEANSING" diagram showing chakra positions and colors.',
    level: 2,
    section: 'chakras',
  },
  {
    id: 'l2-seven-chakras',
    slideNumber: 27,
    concept: 'The Seven Chakras',
    teachingText:
      'The seven primary chakras, from crown to root:\n\n7. Crown — Top of head\n6. Third Eye — Center of forehead\n5. Throat — Throat\n4. Heart — Center of chest\n3. Solar Plexus — Upper abdomen\n2. Sacral — Lower abdomen\n1. Root — Base of spine',
    originalImage: '23-chakras-original .PNG',
    reimaginedImage: '23-chakras.jpg',
    imageNote: 'Also see style reference: 23a-example of chakra slides .PNG',
    level: 2,
    section: 'chakras',
  },
];

// =============================================================================
// LEVEL 2 — Individual Chakra Slides
// =============================================================================

export const chakraSlides: ChakraSlideData[] = [
  {
    id: 'l2-chakra-root',
    slideNumber: 28,
    concept: 'Root Chakra',
    sanskritName: 'Muladhara',
    chakraColor: '#DC2626',
    element: 'Earth',
    coreStatement: 'I AM',
    focus: 'Stability — Safety — Embodiment',
    bodyLocation: 'Base of spine, Legs, Feet',
    energy: 'Masculine — Survival / Foundation',
    balanced: [
      'Grounded presence',
      'Physical vitality',
      'Trust in life',
      'Feeling safe in the body',
    ],
    unbalanced: [
      'Fear and insecurity',
      'Survival anxiety',
      'Disconnection from body',
      'Scarcity mindset',
    ],
    blockages: 'Fear — Insecurity — Survival Trauma',
    teachingText:
      'Muladhara — Grounding & Safety',
    reimaginedImage: '72222F3D-239D-4543-B6E8-EB2ED084AFFC.png',
    level: 2,
    section: 'chakras',
  },
  {
    id: 'l2-chakra-sacral',
    slideNumber: 29,
    concept: 'Sacral Chakra',
    sanskritName: 'Svadhisthana',
    chakraColor: '#EA580C',
    element: 'Water',
    coreStatement: 'I FEEL',
    focus: 'Emotions — Creativity — Pleasure',
    bodyLocation: 'Lower abdomen, Sexual Organs',
    energy: 'Feminine — Flow & Flexibility',
    balanced: [
      'Emotional well-being',
      'Sensuality and intimacy',
      'Passion and pleasure',
      'Adaptability',
    ],
    unbalanced: [
      'Depression and numbness',
      'Sexual dysfunction',
      'Emotional instability',
      'Fear of change',
    ],
    blockages: 'Shame — Emotional Repression — Guilt',
    teachingText:
      'Svadhisthana — Emotion & Creativity',
    reimaginedImage: '662027CB-614B-4D5B-9442-5D5233E747EB.png',
    level: 2,
    section: 'chakras',
  },
  {
    id: 'l2-chakra-solar-plexus',
    slideNumber: 30,
    concept: 'Solar Plexus Chakra',
    sanskritName: 'Manipura',
    chakraColor: '#CA8A04',
    element: 'Fire',
    coreStatement: 'I CAN',
    focus: 'Personal Power — Self-Esteem — Drive',
    bodyLocation: 'Upper abdomen, Diaphragm',
    energy: 'Masculine — Power & Transformation',
    balanced: [
      'Confidence and motivation',
      'Responsible and disciplined',
      'Healthy sense of self',
      'Autonomy',
    ],
    unbalanced: [
      'Low self-esteem',
      'Aggression or controlling',
      'Stubborn and domineering',
      'Lack of direction or purpose',
    ],
    blockages: 'Self-Doubt — Insecurity — Fear of Rejection',
    teachingText:
      'Manipura — Willpower & Confidence',
    reimaginedImage: '521B590F-A737-48FE-A036-F2750DD6E15A.png',
    level: 2,
    section: 'chakras',
  },
  {
    id: 'l2-chakra-heart',
    slideNumber: 31,
    concept: 'Heart Chakra',
    sanskritName: 'Anahata',
    chakraColor: '#16A34A',
    element: 'Air',
    coreStatement: 'I LOVE',
    focus: 'Love — Compassion — Connection',
    bodyLocation: 'Center of chest, Heart, Lungs',
    energy: 'Bridge between physical & spiritual',
    balanced: [
      'Compassion and empathy',
      'Emotional openness',
      'Forgiveness',
      'Healthy intimacy and self-love',
    ],
    unbalanced: [
      'Emotional withdrawal or over-giving',
      'Fear of intimacy',
      'Cold or detachment',
      'Difficulty forgiving',
    ],
    blockages: 'Grief — Betrayal — Heartbreak',
    teachingText:
      'Anahata — Love & Integration',
    reimaginedImage: '354EA54A-011A-49F7-83E9-941B75666018.png',
    extraContent:
      'Human Love & Spiritual Love:\n\nHuman Love — Statement: I LOVE — Empathy, compassion, forgiveness, healthy relationships, romantic and familial love.\n\nSpiritual Love — Statement: I AM LOVE — Unconditional compassion, interconnectedness, divine and universal love, oneness.',
    level: 2,
    section: 'chakras',
  },
  {
    id: 'l2-chakra-throat',
    slideNumber: 32,
    concept: 'Throat Chakra',
    sanskritName: 'Vishuddha',
    chakraColor: '#0EA5E9',
    element: 'Ether / Sound',
    coreStatement: 'I SPEAK AND I LISTEN',
    focus: 'Communication — Truth — Authenticity',
    bodyLocation: 'Throat, Neck, Jaw, Mouth',
    energy: 'Learning to align will with divine truth',
    balanced: [
      'Clear, honest communication',
      'Authentic self-expression',
      'Good listener',
      'Strong voice and balanced speech',
    ],
    unbalanced: [
      'Fear of speaking up',
      'Being unheard or misunderstood',
      'People-pleasing',
      'Suppressed feelings or lies',
    ],
    blockages: 'Suppressed Truth — Fear of Expression — Miscommunication',
    teachingText:
      'Vishuddha — Communication & Expression',
    reimaginedImage: '50C556AC-82A8-4935-990B-2166B42A6ED3.png',
    level: 2,
    section: 'chakras',
  },
  {
    id: 'l2-chakra-third-eye',
    slideNumber: 33,
    concept: 'Third Eye Chakra',
    sanskritName: 'Ajna',
    chakraColor: '#4F46E5',
    element: 'Light',
    coreStatement: 'I SEE',
    focus: 'Imagination — Perception — Visualization',
    bodyLocation: 'Forehead, Brow, Eye center',
    energy: 'Feminine aspects of awareness',
    balanced: [
      'Clear seeing and intuition',
      'Good memory and imagination',
      'Inner location',
      'Wisdom and vision',
    ],
    unbalanced: [
      'Overthinking',
      'Mental fog',
      'Disconnection with inner guidance',
      'Escaping reality or spiritual bypassing',
    ],
    blockages: 'Suppressed Truth — Fear of Expression — Miscommunication',
    teachingText:
      'Ajna — Intuition & Insight',
    reimaginedImage: 'IMG_1753.jpeg',
    level: 2,
    section: 'chakras',
  },
  {
    id: 'l2-chakra-crown',
    slideNumber: 34,
    concept: 'Crown Chakra',
    sanskritName: 'Sahasrara',
    chakraColor: '#7C3AED',
    element: 'Thought & Universal Connection',
    coreStatement: 'I KNOW',
    focus: 'Spiritual Connection — Inner Wisdom — Higher States of Awareness',
    bodyLocation: 'Top of head',
    energy: 'Transcending ego, merging with source',
    balanced: [
      'Spiritual faith and connection',
      'Inner peace, trust, and wisdom',
      'Openness and awareness',
      'Sense of life purpose',
    ],
    unbalanced: [
      'Spiritual emptiness',
      'Existential doubt',
      'Feeling isolated or alone',
      'Lack of purpose',
    ],
    blockages: 'Disconnection — Cynicism — Loss of Meaning',
    teachingText:
      'Sahasrara — Spirituality & Consciousness',
    reimaginedImage: '1AE3EE6D-C317-4C0B-81F5-52ED78BE2CAB.png',
    level: 2,
    section: 'chakras',
  },
];

// =============================================================================
// LEVEL 2 — Cleansing, Recovery & Golden Sticky Roses
// =============================================================================

export const level2CleansingSlides: TeachingSlide[] = [
  {
    id: 'l2-cleansing-aura-layers',
    slideNumber: 35,
    concept: 'Cleansing of Each Aura Layer',
    teachingText:
      'The aura is composed of seven layers, each corresponding to a chakra. In Level 2, each layer is individually cleansed from the outermost to the innermost:\n\n7. 7th Aura layer\n6. 6th Aura layer\n5. 5th Aura layer\n4. 4th Aura layer\n3. 3rd Aura layer\n2. 2nd Aura layer\n1. 1st Aura layer',
    originalImage: '25-cleansing layers- original .jpg',
    reimaginedImage: '25-cleansineachlayer.PNG',
    level: 2,
    section: 'cleansing',
  },
  {
    id: 'l2-cleansing-each-chakra',
    slideNumber: 36,
    concept: 'Cleansing of Each Chakra',
    teachingText:
      'Each individual chakra is cleansed using roses. The roses address two dimensions:\n\n• Dynamics of the Past — Energetic patterns, imprints, and blockages carried from past experiences\n• Dynamics of the Present — Current energetic influences, relationships, and situations affecting the chakra',
    originalImage: '24-cleansingeachchakra-original .jpg',
    reimaginedImage: '24-cleansing each chakra.PNG',
    imageNote: 'Also see: 25a-chakracleansing-original.jpg',
    level: 2,
    section: 'cleansing',
  },
  {
    id: 'l2-energy-recovery',
    slideNumber: 37,
    concept: 'Energy Recovery of Each Chakra (Level 2)',
    teachingText:
      'After cleansing, the energy recovery process is repeated at a deeper level. The Rose is sent out to gather and return your own energy to each individual chakra, restoring sovereignty, vitality, and wholeness to each energy center.',
    originalImage: '25b-energyrecoveryeachchakra-original.jpg',
    reimaginedImage: '17-recoveryrose.PNG',
    imageNote: 'Placeholder: using Level 1 recovery rose. Dedicated Level 2 version needs to be created.',
    level: 2,
    section: 'cleansing',
  },
  {
    id: 'l2-golden-sticky-1',
    slideNumber: 38,
    concept: 'Golden Sticky Roses — Phase 1 (Chakra Placement)',
    teachingText:
      'Golden sticky roses are placed on each of the seven chakras, drawing out foreign energy lodged in the energy centers.',
    originalImage: '26-golden sticky 1- original .jpg',
    reimaginedImage: 'Goldensticky1.jpg',
    imageNote: 'Add subtle arrows to indicate the direction of energy being drawn out by the golden sticky roses.',
    level: 2,
    section: 'golden-sticky',
  },
  {
    id: 'l2-golden-sticky-2',
    slideNumber: 39,
    concept: 'Golden Sticky Roses — Phase 2 (Body Placement)',
    teachingText:
      'Golden sticky roses are placed at the joints and extremities of the body — shoulders, elbows, wrists, hands, hips, knees, ankles, feet — drawing out foreign energy stored in the physical body.',
    originalImage: '27-golden sticky 2 - original .PNG',
    reimaginedImage: 'Goldensticky2arms.jpg',
    imageNote: 'Add subtle arrows to indicate the direction of energy being drawn out by the golden sticky roses.',
    level: 2,
    section: 'golden-sticky',
  },
  {
    id: 'l2-golden-sticky-3',
    slideNumber: 40,
    concept: 'Golden Sticky Roses — Phase 3 (Full Body Coverage)',
    teachingText:
      'Golden sticky roses are placed throughout the entire body — covering the torso, limbs, and all remaining areas — for a thorough, complete energetic cleansing.',
    originalImage: '28-golden sticky 3 - original .PNG',
    reimaginedImage: 'Goldensticky3legs.jpg',
    imageNote: 'Also see: 28-golden sticky 3- original .PNG. Add subtle arrows to indicate the direction of energy being drawn out by the golden sticky roses.',
    level: 2,
    section: 'golden-sticky',
  },
  {
    id: 'l2-golden-sticky-4',
    slideNumber: 41,
    concept: 'Golden Sticky Roses — Phase 4 (Integration)',
    teachingText:
      'After the golden sticky roses have done their work, a large Golden Rose appears above the head. All foreign energy gathered by the sticky roses is released, and the entire body is bathed in golden light — restoring, sealing, and integrating the energy body.',
    originalImage: '29-golden sticky 4- original .PNG',
    reimaginedImage: 'Goldenstickybig.jpg',
    imageNote: 'Add subtle arrows to indicate the direction of energy release and golden light cascading through the body.',
    level: 2,
    section: 'golden-sticky',
  },
];

// =============================================================================
// LEVEL 3 — Advanced Perception
// =============================================================================

export const level3Slides: TeachingSlide[] = [
  {
    id: 'l3-analyzer',
    slideNumber: 42,
    concept: 'The Analyzer',
    teachingText:
      'The Analyzer is an advanced tool introduced in Level 3. It is an energetic point located at the back of the head, at the base of the skull (the occipital ridge / brainstem area). The Analyzer is used for deeper perception, reading, and discernment of energy — a tool for precise energetic analysis.',
    originalImage: '30-analyzer- original reimagined.jpg',
    reimaginedImage: '30-analyzer .PNG',
    level: 3,
    section: 'advanced',
  },
];
