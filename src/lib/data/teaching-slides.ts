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
    originalImage: '6-posture-original.PNG',
    reimaginedImage: '6-posture.PNG',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-grounding-cord',
    slideNumber: 7,
    concept: 'Grounding Cord',
    teachingText:
      'The grounding cord is an energetic connection that extends from the base of the spine (first chakra) downward into the center of the Earth. It anchors your energy body to the planet, providing stability, safety, and a channel for releasing unwanted energy.',
    reimaginedImage: '7-Groundingcord.PNG',
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
    reimaginedImage: '8-golden-sun.PNG',
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
    reimaginedImage: '10-Grounding cord expand .PNG',
    imageNote:
      'The grounding cord should be more opaque/transparent, thick and strong, and less gold — same direction as slide 7.',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-full-setup',
    slideNumber: 11,
    concept: 'Full Meditation Setup',
    teachingText:
      'The complete foundational setup combines posture, aura, and expanded grounding cord: the person is seated in proper posture, enclosed within their aura, with the grounding cord descending into the earth.',
    reimaginedImage: '11-expansion-grounding-cord.PNG',
    imageNote: 'See slide 10 original for accuracy reference. The grounding cord is missing from this image — it should be clearly visible, expanded, thick, transparent, and strong (same direction as slides 7 and 10).',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-golden-sun-fills',
    slideNumber: '11a',
    concept: 'Golden Sun Fills You',
    teachingText:
      'The Golden Sun above the crown pours golden light downward, filling the entire aura and body with your own highest vibration. This completes the full energetic architecture: posture, aura, grounding cord, and golden sun — all active together.',
    originalImage: '11-expansion fill with golden sun - original .PNG',
    reimaginedImage: '11aExpand auragoldensunexpanded.PNG',
    imageNote: 'The expanded grounding cord should also be represented in this image — it is part of the full energetic architecture. Same visual direction: thick, transparent, strong, less gold.',
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
    reimaginedImage: '12Circuitofenergycismos .PNG',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-combined-circuit',
    slideNumber: '13a',
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
    slideNumber: 14,
    concept: 'The Rose (as Energetic Tool)',
    teachingText:
      'The Rose is used as a living energetic instrument throughout the practice. It has roots (connection to source), a stem (channel of energy), and a bloom (the active, radiant tool). The Rose can be placed, moved, opened, closed, and released according to the needs of the meditation.',
    originalImage: '14-the rose original .PNG',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-four-roses',
    slideNumber: 15,
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
    slideNumber: 16,
    concept: 'Cleansing Rose',
    teachingText:
      'The Cleansing Rose is placed outside of the aura. It is used to absorb and transmute foreign or stagnant energy from within your field. Energy that does not belong to you — from other people, environments, or experiences — is drawn out of the aura and into the Cleansing Rose, where it is neutralized.',
    originalImage: '16-cleansingrose-original.PNG',
    imageNote: 'Reimagined version needs to be created.',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-energy-recovery',
    slideNumber: 17,
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
    slideNumber: 18,
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
    slideNumber: 19,
    concept: "Let's Create Your Sacred Space",
    teachingText:
      'Level 2 begins with creating your own sacred space — an internal energetic environment that serves as your meditation home. This is the space from which all deeper work is conducted.',
    imageNote: 'Text-only slide, or subtle illustration. This is an introductory placeholder — no detailed image needed.',
    level: 2,
    section: 'sacred-space',
  },
  {
    id: 'l2-6th-7th-chakras',
    slideNumber: '19b',
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
    slideNumber: '19c',
    concept: "Let's Prepare Your Physical Space",
    teachingText:
      'Before meditation, prepare your physical environment to support the energetic work. The external space should mirror the internal intention: clean, clear, quiet, and intentionally held.',
    imageNote: 'Text-only slide, or subtle illustration.',
    level: 2,
    section: 'sacred-space',
  },
  {
    id: 'l2-protection-space',
    slideNumber: 20,
    concept: 'Protection of the Space',
    teachingText:
      'The physical meditation space is protected by creating an energetic grid using roses. Golden roses are placed at the four corners (and above/below) of the space, connected by lines of golden energy forming a sacred geometric structure — a container for the work.',
    originalImage: '20-protectthespace- original .jpg',
    reimaginedImage: '20-protectionphysicalspace.PNG',
    imageNote:
      'Designer notes: The lines of the room/grid are all in gold. The room also has its own grounding cord that expands within the space — not depicted in the current image. The grounding cord should be clear and transparent so people understand the cord also expands within the room. This is a visual challenge given the complexity of the grid; the designer has creative freedom to find a solution.',
    level: 2,
    section: 'sacred-space',
  },
  {
    id: 'l2-cleansing-space',
    slideNumber: 21,
    concept: 'Cleansing of the Space',
    teachingText:
      'Once the space is protected, it is cleansed. A large Cleansing Rose is placed above the grid, and golden energy pours downward through the entire structure, clearing all foreign, stagnant, or disruptive energies from the space.',
    originalImage: '21-cleansing space - original .PNG',
    reimaginedImage: '21-cleansingphysicalspace.PNG',
    imageNote:
      'The room should show its own grounding cord expanding within the space. The grounding cord should be clear and transparent so people understand the cord also expands within the room — same visual direction as slide 20.',
    level: 2,
    section: 'sacred-space',
  },
  {
    id: 'l2-owning-space',
    slideNumber: 22,
    concept: 'Owning Your Space',
    teachingText:
      'After protection and cleansing, you claim ownership of the space. This is an act of energetic sovereignty — declaring the space as yours, filling it with your own energy and intention. The space becomes an extension of your aura and your practice.',
    originalImage: '22-protect the space- original .PNG',
    reimaginedImage: '22-owningurspace.PNG',
    imageNote:
      'The room should show its own grounding cord expanding within the space. The grounding cord should be clear and transparent so people understand the cord also expands within the room — same visual direction as slide 20.',
    level: 2,
    section: 'sacred-space',
  },
  {
    id: 'l2-chakras-intro',
    slideNumber: '22b',
    concept: "Let's Talk About Chakras",
    teachingText:
      'The chakra system is the energetic anatomy of the human body. There are seven primary chakras, each governing specific aspects of physical, emotional, mental, and spiritual life.',
    imageNote: 'Text-only slide or simple illustration.',
    level: 2,
    section: 'chakras',
  },
  {
    id: 'l2-seven-chakras',
    slideNumber: 23,
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
    slideNumber: '23-root',
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
    imageNote: 'Body illustration emphasizing Root Chakra location, dominant red color. Needs to be created — use 23a-example of chakra slides .PNG as style reference, or any design the designer thinks would be good for this section.',
    level: 2,
    section: 'chakras',
  },
  {
    id: 'l2-chakra-sacral',
    slideNumber: '23-sacral',
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
    reimaginedImage: '23a-example of chakra slides .PNG',
    imageNote: 'Placeholder — using 23a example chakra slide. Final: Body illustration emphasizing Sacral Chakra location, dominant orange color, or any design the designer thinks would be good for this section.',
    level: 2,
    section: 'chakras',
  },
  {
    id: 'l2-chakra-solar-plexus',
    slideNumber: '23-solar',
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
    imageNote: 'Body illustration emphasizing Solar Plexus location, dominant yellow color. Needs to be created — use 23a-example of chakra slides .PNG as style reference, or any design the designer thinks would be good for this section.',
    level: 2,
    section: 'chakras',
  },
  {
    id: 'l2-chakra-heart',
    slideNumber: '23-heart',
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
    extraContent:
      'Human Love & Spiritual Love:\n\nHuman Love — Statement: I LOVE — Empathy, compassion, forgiveness, healthy relationships, romantic and familial love.\n\nSpiritual Love — Statement: I AM LOVE — Unconditional compassion, interconnectedness, divine and universal love, oneness.',
    imageNote: 'Body illustration emphasizing Heart Chakra location, dominant green/pink color. Needs to be created — use 23a-example of chakra slides .PNG as style reference, or any design the designer thinks would be good for this section.',
    level: 2,
    section: 'chakras',
  },
  {
    id: 'l2-chakra-throat',
    slideNumber: '23-throat',
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
    imageNote: 'Body illustration emphasizing Throat Chakra location, dominant light blue color. Needs to be created — use 23a-example of chakra slides .PNG as style reference, or any design the designer thinks would be good for this section.',
    level: 2,
    section: 'chakras',
  },
  {
    id: 'l2-chakra-third-eye',
    slideNumber: '23-third-eye',
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
    imageNote: 'Body illustration emphasizing Third Eye location, dominant indigo color. Needs to be created — use 23a-example of chakra slides .PNG as style reference, or any design the designer thinks would be good for this section.',
    level: 2,
    section: 'chakras',
  },
  {
    id: 'l2-chakra-crown',
    slideNumber: '23-crown',
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
    imageNote: 'Body illustration emphasizing Crown Chakra location, dominant violet/white color. Needs to be created — use 23a-example of chakra slides .PNG as style reference, or any design the designer thinks would be good for this section.',
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
    slideNumber: 25,
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
    slideNumber: 24,
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
    slideNumber: '25b',
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
    slideNumber: 26,
    concept: 'Golden Sticky Roses — Phase 1 (Chakra Placement)',
    teachingText:
      'Golden sticky roses are placed on each of the seven chakras, drawing out foreign energy lodged in the energy centers.',
    originalImage: '26-golden sticky 1- original .jpg',
    reimaginedImage: '26-golden sticky 1.PNG',
    level: 2,
    section: 'golden-sticky',
  },
  {
    id: 'l2-golden-sticky-2',
    slideNumber: 27,
    concept: 'Golden Sticky Roses — Phase 2 (Body Placement)',
    teachingText:
      'Golden sticky roses are placed at the joints and extremities of the body — shoulders, elbows, wrists, hands, hips, knees, ankles, feet — drawing out foreign energy stored in the physical body.',
    originalImage: '27-golden sticky 2 - original .PNG',
    reimaginedImage: '27-golden sticky2 .PNG',
    level: 2,
    section: 'golden-sticky',
  },
  {
    id: 'l2-golden-sticky-3',
    slideNumber: 28,
    concept: 'Golden Sticky Roses — Phase 3 (Full Body Coverage)',
    teachingText:
      'Golden sticky roses are placed throughout the entire body — covering the torso, limbs, and all remaining areas — for a thorough, complete energetic cleansing.',
    originalImage: '28-golden sticky 3 - original .PNG',
    reimaginedImage: '28-golden sticky 3 .PNG',
    imageNote: 'Also see: 28-golden sticky 3- original .PNG',
    level: 2,
    section: 'golden-sticky',
  },
  {
    id: 'l2-golden-sticky-4',
    slideNumber: 29,
    concept: 'Golden Sticky Roses — Phase 4 (Integration)',
    teachingText:
      'After the golden sticky roses have done their work, a large Golden Rose appears above the head. All foreign energy gathered by the sticky roses is released, and the entire body is bathed in golden light — restoring, sealing, and integrating the energy body.',
    originalImage: '29-golden sticky 4- original .PNG',
    reimaginedImage: '29-golden sticky 4.PNG',
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
    slideNumber: 30,
    concept: 'The Analyzer',
    teachingText:
      'The Analyzer is an advanced tool introduced in Level 3. It is an energetic point located at the back of the head, at the base of the skull (the occipital ridge / brainstem area). The Analyzer is used for deeper perception, reading, and discernment of energy — a tool for precise energetic analysis.',
    originalImage: '30-analyzer- original reimagined.jpg',
    reimaginedImage: '30-analyzer .PNG',
    level: 3,
    section: 'advanced',
  },
];
