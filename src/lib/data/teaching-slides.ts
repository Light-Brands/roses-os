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

export const openingImportantToKnow = {
  title: "It's Important to Know",
  paragraphs: [
    'You will receive the manual in PDF.',
    'These teachings are part of a living energetic lineage revealed through direct practice and transmission.',
  ],
  guidelines: {
    title: 'Please keep in mind:',
    items: [
      'You should not attempt to teach the Rose Meditation (only to your children under 14 years old).',
      'If you would like to become a Rose Meditation Facilitator, it is necessary to follow a training path through Aura Reading.',
      'The Rose Meditation cannot be applied to other people.',
    ],
  },
  closing: '',
};

export const openingHistory = {
  title: 'History & Lineage',
  text: 'Aura Reading emerged in the 1960s, in California, channeled by a North American called Lewis S. Bostwick. Founder of the Berkeley Psychic Institute and the Church of the Divine Man, he channeled and systematized the techniques and tools sent by the angels, to assist in the process of evolution of humanity.',
  lineage: 'Berkeley Psychic Institute → Anastasia Plunk → Angelina Ataide → Escola da Aura → International Aura School',
};

// =============================================================================
// LEVEL 1 — Foundational Practices
// =============================================================================

export const level1Slides: TeachingSlide[] = [
  {
    id: 'l1-the-rose',
    slideNumber: 1,
    concept: 'The Rose',
    teachingText:
      'The Rose is the foundational symbol and tool of this practice — a living energetic instrument used throughout all levels of the work.',
    reimaginedImage: 'level-1/01-the-rose.PNG',
    final: true,
    imageNote:
      'Rose illustration guideline: Roses should be shown with stems or without stems — never with thorns, and typically without prominent leaves.',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-posture',
    slideNumber: 2,
    concept: 'Meditation Posture',
    teachingText:
      'Proper meditation posture is seated upright in a chair. Feet are flat on the floor, hands resting gently on the thighs or knees, spine upright, eyes closed. The body is relaxed yet alert — grounded and receptive.',
    reimaginedImage: 'level-1/02-meditation-posture.PNG',
    final: true,
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-grounding-cord',
    slideNumber: 3,
    concept: 'Grounding Cord',
    teachingText:
      'The grounding cord is an energetic connection that extends from the base of the spine (first chakra) downward into the center of the Earth. It anchors your energy body to the planet, providing stability, safety, and a channel for releasing unwanted energy.',
    reimaginedImage: 'level-1/03-grounding-cord.jpeg',
    final: true,
    imageNote:
      'The original grounding cord (see slide 6 original: 6-grounding-cord-expansion-original.PNG) is more accurate than the reimagined version. New designs should reflect the original\'s depiction. The grounding cord should be more opaque/transparent, thick and strong, and less gold.',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-golden-sun',
    slideNumber: 4,
    concept: 'Golden Sun',
    teachingText:
      'The Golden Sun is a tool for replenishing and restoring your own energy. Visualize a radiant golden sun above your head. It calls back your own life-force energy from wherever you may have left it — in people, places, situations, or time. It fills you with your own highest vibration.',
    reimaginedImage: 'level-1/04-golden-sun.jpeg',
    final: true,
    imageNote:
      'The grounding cord in this image should be thick, transparent, and strong — and should start lower in the body, under the crotch, as it comes from the base of the spine (1st chakra). Currently it appears too high and too golden.',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-aura-exercise',
    slideNumber: 5,
    concept: 'An Exercise to Feel Your Aura',
    teachingText:
      'The aura is the energetic field that surrounds your physical body. This exercise helps you become aware of its presence, its edges, and its quality. The aura consists of multiple layers radiating outward from the body.',
    originalImage: 'level-1/05-auraexercise-original.PNG',
    reimaginedImage: 'level-1/05-aura-exercise.PNG',
    final: true,
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-grounding-expansion',
    slideNumber: 6,
    concept: 'Expansion of Grounding Cord',
    teachingText:
      'Once you are aware of your aura, the grounding cord practice deepens. You ground not only the physical body but also the aura itself — allowing the entire energy field to anchor into the Earth.',
    originalImage: 'level-1/06-grounding-cord-expansion-original.PNG',
    reimaginedImage: 'level-1/06-expansion-grounding-cord.jpeg',
    final: true,
    imageNote:
      'The grounding cord should be more opaque/transparent, thick and strong, and less gold — same direction as slide 7.',
    level: 1,
    section: 'foundations',
  },
{
    id: 'l1-golden-sun-fills',
    slideNumber: 7,
    concept: 'Golden Sun Fills You',
    teachingText:
      'The Golden Sun above the crown pours golden light downward, filling the entire aura and body with your own highest vibration. This completes the full energetic architecture: posture, aura, grounding cord, and golden sun — all active together.',
    originalImage: 'level-1/07-expansion-fill-with-golden-sun-original.PNG',
    reimaginedImage: 'level-1/07-golden-sun-fills.png',
    final: true,
    imageNote: 'The expanded grounding cord should also be represented in this image — it is part of the full energetic architecture. Same visual direction: thick, transparent, strong, less gold. NOTE: The current image repeats the same human figure used in slide 7 — please use a different human man for this slide to distinguish the two visuals.',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-earth-circuit',
    slideNumber: 8,
    concept: 'Circuit of the Energy of the Earth',
    teachingText:
      'The Earth circuit is an energetic pathway that draws the energy of the Earth upward through the feet, rising through the legs and into the body. This circuit connects you to the grounding, nourishing, stabilizing force of the planet.',
    reimaginedImage: 'level-1/08-earth-energy.PNG',
    final: true,
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-cosmos-circuit',
    slideNumber: 9,
    concept: 'Circuit of the Energy of the Cosmos',
    teachingText:
      'The Cosmic circuit is an energetic pathway that draws cosmic energy downward through the crown of the head (7th chakra) and into the body. This circuit connects you to the higher frequencies of universal consciousness, inspiration, and spiritual guidance.',
    originalImage: 'level-1/09-cosmos-original.PNG',
    reimaginedImage: 'level-1/09-cosmos-circuit.jpeg',
    final: true,
    imageNote:
      'Updated: New image with more refined arrows showing the cosmic energy circuit pathway. Previous version: 8-circuitofenergycosmos.PNG',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-combined-circuit',
    slideNumber: 10,
    concept: 'Circuit of Energy of Cosmos and Earth',
    teachingText:
      'When both circuits are activated simultaneously, the energies of the Earth and Cosmos flow together through the body. Earth energy rises from below; Cosmic energy descends from above. They meet and blend within the body, creating a unified field of balanced, integrated energy.',
    reimaginedImage: 'level-1/10-cosmosearth.PNG',
    final: true,
    imageNote: 'Also see: 10-cosmosearth.PNG. No original exists — this combined view is reimagined only.',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-rose-tool',
    slideNumber: 11,
    concept: 'The Rose (as Energetic Tool)',
    teachingText:
      'The Rose is used as a living energetic instrument throughout the practice. It has roots (connection to source), a stem (channel of energy), and a bloom (the active, radiant tool). The Rose can be placed, moved, opened, closed, and released according to the needs of the meditation.',
    originalImage: 'level-1/11-therosegold.PNG',
    reimaginedImage: 'level-1/11-therosegold.PNG',
    final: true,
    imageNote:
      'Rose illustration guideline: Roses are typically depicted with a bloom and stem (or no stem). Leaves should be minimal or absent. Thorns must never be shown — the rose in this practice is a pure energetic instrument without thorns.',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-four-roses',
    slideNumber: 12,
    concept: 'Roses of Protection, Observation and Separation',
    teachingText:
      'Roses are placed at the edges of the aura to serve as energetic sentinels. They perform three functions:\n\n1. Protection — They define and guard the boundary of your aura\n2. Observation — They help you notice what energies are approaching or interacting with your field\n3. Separation — They create healthy energetic distinction between your energy and the energy of others',
    originalImage: 'level-1/12-four-roses-original.PNG',
    reimaginedImage: 'level-1/12-four-roses.jpeg',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-cleansing-rose',
    slideNumber: 13,
    concept: 'Cleansing Rose',
    teachingText:
      'The Cleansing Rose is placed outside of the aura. It is used to absorb and transmute foreign or stagnant energy from within your field. Energy that does not belong to you — from other people, environments, or experiences — is drawn out of the aura and into the Cleansing Rose, where it is neutralized.',
    originalImage: 'level-1/13-cleansing-rose.png',
    reimaginedImage: 'level-1/13-cleansing-rose.png',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-energy-recovery',
    slideNumber: 14,
    concept: 'Energy Recovery of Each Chakra',
    teachingText:
      'After cleansing, the Rose is used to recover your own energy that has been left in or taken by others. The Rose is sent out as an instrument to gather and return your own life-force energy to each chakra, restoring fullness and sovereignty to each energy center.',
    originalImage: 'level-1/14-recovery-rose-original.PNG',
    reimaginedImage: 'level-1/14-energy-recovery.jpeg',
    final: true,
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-pink-rose-closure',
    slideNumber: 15,
    concept: 'Pink Rose Closure',
    teachingText:
      'The Pink Rose Closure is offered at the end of the meditation as a gift of well-being — for yourself or another person. Create an unrooted pink Rose and place yourself or the person inside it, visualizing "Happy, Healthy, Whole, Body, Mind & Soul." Repeat this intention silently while making the Rose rise towards the center of the Universe, wishing all the best for whoever is held within it.',
    reimaginedImage: 'level-1/15-pink-rose-closure.png',
    level: 1,
    section: 'foundations',
  },
  {
    id: 'l1-discharge',
    slideNumber: 16,
    concept: 'Discharge Excess Energy',
    teachingText:
      'After deep meditation or energy work, excess energy may accumulate in the body. To discharge it, lean forward from the seated position with hands reaching toward the ground. Allow the excess energy to flow out through the hands and into the earth, returning the body to a calm, balanced state.',
    originalImage: 'level-1/16-discharge-energy-original.PNG',
    reimaginedImage: 'level-1/16-discharge-excess.PNG',
    level: 1,
    section: 'foundations',
  },
  // -------------------------------------------------------------------------
  // Sacred Space (moved from Level 2 to Level 1)
  // -------------------------------------------------------------------------
  {
    id: 'l1-sacred-space',
    slideNumber: 17,
    concept: "Let's Create Your Sacred Space",
    teachingText:
      'Level 2 begins with creating your own sacred space — an internal energetic environment that serves as your meditation home. This is the space from which all deeper work is conducted.',
    reimaginedImage: 'level-1/17-sacred-space-abstract.png',
    imageNote: 'Abstract sacred space — inner stillness, spiritual authority, sacred geometry radiating from center of head.',
    level: 1,
    section: 'sacred-space',
  },
  {
    id: 'l1-6th-7th-chakras',
    slideNumber: 18,
    concept: 'The 6th and 7th Chakras (Sacred Space)',
    teachingText:
      'Understanding the locations and roles of the upper chakras is essential for Level 2 work:\n\n• 6th Chakra (Third Eye) — Located at the center of the forehead, between and slightly above the eyebrows\n• 7th Chakra (Crown) — Located at the top of the head',
    originalImage: 'level-1/18-sacredspace-original.jpg',
    reimaginedImage: 'level-1/18-sacred-space.PNG',
    imageNote: 'Part of the sacred space slide sequence.',
    level: 1,
    section: 'sacred-space',
  },
];

// =============================================================================
// LEVEL 2 — Space Preparation & Chakra Activation
// =============================================================================

export const level2Slides: TeachingSlide[] = [
  {
    id: 'l2-physical-space',
    slideNumber: 19,
    concept: "Let's Prepare Your Physical Space",
    teachingText:
      'Before meditation, prepare your physical environment to support the energetic work. The external space should mirror the internal intention: clean, clear, quiet, and intentionally held.',
    reimaginedImage: 'level-2/19-physical-space-abstract.png',
    imageNote: 'Abstract space preparation — protective boundary, golden light, cleansing energy waves.',
    level: 2,
    section: 'sacred-space',
  },
  {
    id: 'l2-protection-space',
    slideNumber: 20,
    concept: 'Protection of the Space',
    teachingText:
      'The physical meditation space is protected by creating an energetic grid using roses. Golden roses are placed at the four corners (and above/below) of the space, connected by lines of golden energy forming a sacred geometric structure — a container for the work.',
    originalImage: 'level-2/20-protectthespace-original.jpg',
    reimaginedImage: 'level-2/20-create-the-room.png',
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
      'With protection established, the cleansing follows. A Golden Rose is set above the grid and passed downward through its entire structure, removing any foreign, stagnant, or disruptive energies inside the room. This Rose comes down to be transmuted in the center of the earth through the Grounding Cord of the room.',
    originalImage: 'level-2/21-cleansing-space-original.PNG',
    reimaginedImage: 'level-2/21-cleanse-the-space.png',
    imageNote:
      'The room should show its own grounding cord expanding within the space. The grounding cord should be clear and transparent so people understand the cord also expands within the room — same visual direction as slide 23.',
    level: 2,
    section: 'sacred-space',
  },
  {
    id: 'l2-owning-space',
    slideNumber: 22,
    concept: 'Owning Your Space',
    teachingText:
      'After protection and cleansing, you claim ownership of the space. This is an act of energetic sovereignty — declaring the space as yours, filling it with your own energy and intention. The space becomes an extension of your aura and your practice.',
    originalImage: 'level-2/22-protect-the-space-original.PNG',
    reimaginedImage: 'level-2/22-owning-space.jpeg',
    imageNote:
      'The room should show its own grounding cord expanding within the space. The grounding cord should be clear and transparent so people understand the cord also expands within the room — same visual direction as slide 23. Also: four golden lines go from the perineum to the four bottom corners of the room, and four golden lines from the crown to the top four corners of the room — this should be clear as this is what the slide demonstrates.',
    level: 2,
    section: 'sacred-space',
  },
  {
    id: 'l2-chakras-intro',
    slideNumber: 23,
    concept: "Let's Talk About Chakras",
    teachingText:
      'The chakra system is the energetic anatomy of the human body. There are seven primary chakras, each governing specific aspects of physical, emotional, mental, and spiritual life.',
    reimaginedImage: 'level-2/23-chakras-intro.jpeg',
    imageNote: 'Illustration needed: An overview of the seven-chakra system along the human body — showing all seven chakras aligned from root to crown with their corresponding colors (red, orange, yellow, green, blue, indigo, violet). Reference: PDF source "PHASE C - CHAKRA CLEANSING" diagram showing chakra positions and colors.',
    level: 2,
    section: 'chakras',
  },
  {
    id: 'l2-seven-chakras',
    slideNumber: 24,
    concept: 'The Seven Chakras',
    teachingText:
      'The seven primary chakras, from crown to root:\n\n7. Crown — Top of head\n6. Third Eye — Center of forehead\n5. Throat — Throat\n4. Heart — Center of chest\n3. Solar Plexus — Upper abdomen\n2. Sacral — Lower abdomen\n1. Root — Base of spine',
    originalImage: 'level-2/24-chakras-original.PNG',
    reimaginedImage: 'level-2/24-chakras.png',
    imageNote: 'Also see style reference: 21a-example-of-chakra-slides.PNG',
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
    slideNumber: 25,
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
    reimaginedImage: 'level-2/25-root-chakra.png',
    level: 2,
    section: 'chakras',
  },
  {
    id: 'l2-chakra-sacral',
    slideNumber: 26,
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
    reimaginedImage: 'level-2/26-sacral-chakra.png',
    level: 2,
    section: 'chakras',
  },
  {
    id: 'l2-chakra-solar-plexus',
    slideNumber: 27,
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
    reimaginedImage: 'level-2/27-solar-plexus-chakra.png',
    level: 2,
    section: 'chakras',
  },
  {
    id: 'l2-chakra-heart',
    slideNumber: 28,
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
    reimaginedImage: 'level-2/28-heart-chakra.png',
    extraContent:
      'Human Love & Spiritual Love:\n\nHuman Love — Statement: I LOVE — Empathy, compassion, forgiveness, healthy relationships, romantic and familial love.\n\nSpiritual Love — Statement: I AM LOVE — Unconditional compassion, interconnectedness, divine and universal love, oneness.',
    level: 2,
    section: 'chakras',
  },
  {
    id: 'l2-chakra-throat',
    slideNumber: 29,
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
    reimaginedImage: 'level-2/29-throat-chakra.png',
    level: 2,
    section: 'chakras',
  },
  {
    id: 'l2-chakra-third-eye',
    slideNumber: 30,
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
    blockages: 'Illusion — Fear of Seeing — Mental Rigidity',
    teachingText:
      'Ajna — Intuition & Insight',
    reimaginedImage: 'level-2/30-third-eye-chakra.png',
    level: 2,
    section: 'chakras',
  },
  {
    id: 'l2-chakra-crown',
    slideNumber: 31,
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
    reimaginedImage: 'level-2/31-crown-chakra.png',
    level: 2,
    section: 'chakras',
  },
];

// =============================================================================
// LEVEL 2 — Cleansing, Recovery & Golden Sticky Roses
// =============================================================================

export const level2CleansingSlides: TeachingSlide[] = [
  {
    id: 'l2-cleansing-each-chakra',
    slideNumber: 32,
    concept: 'Cleansing of Each Chakra',
    teachingText:
      'Each individual chakra is cleansed using roses. The roses address two dimensions:\n\n• Dynamics of the Past — Energetic patterns, imprints, and blockages carried from past experiences\n• Dynamics of the Present — Current energetic influences, relationships, and situations affecting the chakra',
    originalImage: 'level-2/33-cleansingeachchakra-original.jpg',
    reimaginedImage: 'level-2/33-cleansing-each-chakra.PNG',
    imageNote: 'Also see: 29a-chakracleansing-original.jpg',
    level: 2,
    section: 'cleansing',
  },
  {
    id: 'l2-cleansing-aura-layers',
    slideNumber: 33,
    concept: 'Cleansing of Each Aura Layer',
    teachingText:
      'The aura is composed of seven layers, each corresponding to a chakra. In Level 2, each layer is individually cleansed from the 1st to the 7th layer:\n\n1. 1st Aura layer\n2. 2nd Aura layer\n3. 3rd Aura layer\n4. 4th Aura layer\n5. 5th Aura layer\n6. 6th Aura layer\n7. 7th Aura layer',
    originalImage: 'level-2/32-cleansing-layers-original.jpg',
    reimaginedImage: 'level-2/32-cleansing-each-layer.PNG',
    level: 2,
    section: 'cleansing',
  },
  {
    id: 'l2-energy-recovery',
    slideNumber: 34,
    concept: 'Energy Recovery Rose in Depth',
    teachingText:
      'Once the cleansing of the chakra and its corresponding aura layer is complete, the energy recovery process can unfold at their vibration, if you feel called to do so. A recovery Rose may be created attuned to that specific frequency, drawing your energy back and restoring it at that very level. You can do it from the 1st to the 7th chakra.',
    originalImage: 'level-2/34-energyrecoveryeachchakra-original.jpg',
    reimaginedImage: 'level-2/34-energy-recovery-rose.png',
    imageNote: 'Updated with new background image.',
    level: 2,
    section: 'cleansing',
  },
  {
    id: 'l2-golden-sticky-1',
    slideNumber: 35,
    concept: 'Golden Sticky Roses — First Rose (Crown to Root)',
    teachingText:
      'Four Golden Sticky Roses are used for deep energetic cleansing of the Aura, drawing out any foreign energies that still remain after the previous clearing. The first enters through the crown chakra, cleansing each chakra in succession down to the root.',
    originalImage: 'level-2/35-golden-sticky-1-original.jpg',
    reimaginedImage: 'level-2/35-golden-sticky-1.jpg',
    imageNote: 'Add subtle arrows to indicate the direction of energy being drawn out by the golden sticky roses.',
    level: 2,
    section: 'golden-sticky',
  },
  {
    id: 'l2-golden-sticky-2',
    slideNumber: 36,
    concept: 'Golden Sticky Roses — Second Rose (Arms)',
    teachingText:
      'The second descends to the throat chakra, where it splits into two Roses that travel the channels of the arms, exiting through the hand chakras.',
    originalImage: 'level-2/36-golden-sticky-2-original.PNG',
    reimaginedImage: 'level-2/36-golden-sticky-2.jpg',
    imageNote: 'Add subtle arrows to indicate the direction of energy being drawn out by the golden sticky roses.',
    level: 2,
    section: 'golden-sticky',
  },
  {
    id: 'l2-golden-sticky-3',
    slideNumber: 37,
    concept: 'Golden Sticky Roses — Third Rose (Legs)',
    teachingText:
      'The third descends to the root chakra, where it becomes two Roses that follow the channels of the legs, exiting through the foot chakras.',
    originalImage: 'level-2/37-golden-sticky-3-original.PNG',
    reimaginedImage: 'level-2/37-golden-sticky-3.jpg',
    imageNote: 'Also see: 34-golden-sticky-3-original-alt.PNG. Add subtle arrows to indicate the direction of energy being drawn out by the golden sticky roses.',
    level: 2,
    section: 'golden-sticky',
  },
  {
    id: 'l2-golden-sticky-4',
    slideNumber: 38,
    concept: 'Golden Sticky Roses — Fourth Rose (Full Aura)',
    teachingText:
      'The fourth spans the full width of the Aura, descending through the entire energetic field. Upon completion, all four either explode outside the Aura or exit through the grounding cord, transmuting the collected energies away with them.',
    originalImage: 'level-2/38-golden-sticky-4-original.PNG',
    reimaginedImage: 'level-2/38-golden-sticky-4.jpg',
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
    slideNumber: 39,
    concept: 'The Analyzer',
    teachingText:
      'The Analyzer is an advanced tool introduced in Level 3. It is an energetic point located at the back of the head, at the base of the skull (the occipital ridge / brainstem area). The Analyzer is used for deeper perception, reading, and discernment of energy — a tool for precise energetic analysis.',
    reimaginedImage: 'level-3/39-analyzer.PNG',
    level: 3,
    section: 'advanced',
  },
  {
    id: 'l3-stick-of-agreements',
    slideNumber: 41,
    concept: 'Stick of Agreements',
    teachingText:
      'A relationship can only manifest in the material world if it is sustained by a spiritual agreement. Such agreements are formed with the consent of both parties on a spiritual level and may be dissolved by either party through conscious will.\n\nEach time a spiritual agreement is created, a "stick of agreements" is formed between the individuals involved. Through this Rose Meditation technique, it is always possible to dissolve these sticks of agreements. This process should be approached with great awareness, as it carries very tangible consequences in our lives.\n\nTo break these agreements:\n\n\u2022 Create a high-vibration situation, for example, right after the Roses Meditation\n\u2022 Visualize the stick of agreements that contains all the agreements you want to break\n\u2022 Break this stick into three pieces\n\u2022 Create a grounded Rose\n\u2022 Place the three pieces of the stick in this Rose\n\u2022 Explode the Rose outside the Aura',
    reimaginedImage: 'level-3/41-stick-of-agreements.png',
    level: 3,
    section: 'advanced',
  },
  {
    id: 'l3-cutting-cords',
    slideNumber: 42,
    concept: 'Cutting Cords',
    teachingText:
      'We engage in energetic interactions with others constantly — when we see them, hear them, touch them, and even when we think about them. When energetic cords are formed, our auras connect through these ties, allowing energy to flow between us. This is why we can often sense what is happening to people close to us, even at a distance.\n\nWhen relationships come to an end, we may be deeply affected by the energies that continue to reach us through these bonds. For this reason, it is important to know how to consciously cut them:\n\n\u2022 Close your eyes\n\u2022 Visualize your aura with bonds coming out of your chakras\n\u2022 Place your dominant hand on the 7th cervical vertebra, located at the junction of the neck and back at the level of the 5th chakra\n\u2022 Intend that your hand has the power to cut all cords\n\u2022 Make the cutting motion under your 1st chakra, placing your hand on the chair where you are sitting\n\nWe can also cut the ties when the relationship has not ended, but we feel we need more neutrality. These ties reform very quickly when we reconnect with the person.',
    reimaginedImage: 'level-3/IMG_1853.jpeg',
    imageScale: 0.75,
    level: 3,
    section: 'advanced',
  },
  {
    id: 'l3-sexual-recovery-rose',
    slideNumber: 43,
    concept: 'Post Intimacy / Sexual Recovery Rose',
    teachingText:
      'After sexual intercourse, if you want to recover any energy you may have left with the other person and return any energy they may have left with you, follow these steps:\n\n\u2022 Perform the preparation techniques (grounding cord, Golden Sun, Earth and Cosmos energy, sacred space)\n\u2022 Create an orange Rose and place the person\u2019s energy in it with their physical body, emotions, and feelings that may arise at that moment — you can visualize the person entering the rose, the situation you just experienced; explode (you can repeat this step as many times as necessary)\n\u2022 Create an orange-colored unrooted Rose that cleanses any energy from the person that may have remained in any layer of your aura; explode\n\u2022 Create a grounded orange Rose and intend for this rose to recover energy that remained with this person; explode\n\u2022 If you want to remain energetically separate from this person, make the movement of cutting the energetic cords\n\u2022 Create an unrooted pink Rose, place the person in it, visualize them happy with complete health in their body, mind, and soul. Repeat mentally: "Happy, healthy, whole, body, mind and soul." Make the Rose rise toward the center of the universe, wishing the best for them\n\u2022 Renew your grounding cord\n\u2022 Fill yourself with the light of the Golden Sun\n\u2022 Place your hands on the ground to discharge excess energy\n\nYou can also use this technique for relationships that happened a long time ago or when you end a relationship.',
    reimaginedImage: 'level-3/43-sexual-recovery-rose.png',
    level: 3,
    section: 'advanced',
  },
  {
    id: 'l3-mock-up',
    slideNumber: 44,
    concept: 'Mock Up',
    teachingText:
      'The Mock Up is a technique for manifesting situations or outcomes on the physical plane. It should be used only for oneself; it cannot be performed on behalf of another person. For it to be effective, it must be practiced for seven consecutive days and focused on one goal at a time. The higher your vibrational state while creating the mock-up, the more effective the process will be.\n\n\u2022 Create a grounded Rose and inside that Rose imagine what you want, creating the image with as much detail as you can\n\u2022 Create a second grounded Rose placed to the right of the first Rose. Intend for this Rose to cleanse all energy that does not belong to the first Rose, any type of blockage that interferes with the realization of what you desire\n\u2022 Create a third pink grounded Rose (the color of Divine Love). In this Rose, bring into your inner self the image of something you love very much, something that gives you great satisfaction and pleasure so that you can raise your vibration to the maximum\n\u2022 Inspired by the previous Rose, imagine the energy of Divine Love, in pink, coming out of your heart and enveloping the first Rose, placing it in a beautiful pink circle, like a bubble\n\u2022 Cut the roots of the first Rose and let it rise to the center of the Universe. Always ask for it to be done if it is for the greater good\n\u2022 Explode the third Rose (the pink one)\n\u2022 Explode the second Rose (the cleansing rose)\n\nRemember to repeat this technique for 7 consecutive days. If you miss a day before completing the 7-day cycle, go back to the beginning.',
    reimaginedImage: 'level-3/44-mock-up.png',
    level: 3,
    section: 'advanced',
  },
];
