// =============================================================================
// MOCK DATA: ROSES OS
// =============================================================================

import type {
  NavItem, Guardian, Program, ContributionTier,
  ScheduleStage, CoherenceDomain, CoherenceAlternativeCategory,
  PathLevel, LineageEntry,
  ArchitectureLayer, Chakra, Technique, TeachingLevel,
  Agreement, Capacity, BrandQuote, Stat, CommunityProgram,
  CommunityScheduleCycle, InvestmentOption,
} from './types';

// =============================================================================
// NAVIGATION
// =============================================================================

export const navItems: NavItem[] = [
  { label: 'The Rose', href: '/the-rose' },
  { label: 'Offerings', href: '/offerings' },
  { label: 'Community', href: '/community' },
  { label: 'Guardians', href: '/guardians' },
];

// =============================================================================
// GUARDIANS
// =============================================================================

export const guardians: Guardian[] = [
  {
    id: '1',
    name: 'Angelina Ataíde',
    role: 'Guardian of Lineage',
    bio: 'A pioneer in Aura Reading education in Brazil and Portugal, Angelina has dedicated over three decades to spiritual development and training aura readers. Her transformative methodology has already trained thousands of students, therapists, and teachers, combining spiritual wisdom with practical techniques as the primary steward of the ROSES OS lineage.',
    image: '/images/angel.JPG',
    imagePosition: 'center 20%',
  },
  {
    id: '3',
    name: 'Dara Ayoub',
    role: 'Guardian of Community & Programs',
    bio: 'With over a decade walking the Aura Reading path and a background in multiple traditions of self-knowledge, Dara integrates body, mind, and spirit with reverence. She supports the creation and delivery of programs and courses, blending intuitive listening with grounded clarity.',
    image: '/images/39E1608C-8D44-4A6D-B2C2-EEEDA9C8F6C4.png',
    imagePosition: '55% 20%',
    imageScale: 1.0,
  },
  {
    id: '2',
    name: 'Diego Dosal',
    role: 'Guardian of Architecture & Structure',
    bio: 'Diego is the bridge between spirit and structure. With over a decade of deep roots in multiple paths of spiritual practice, energy work, and community building, he carries the horizontal axis of ROSES OS by developing platforms, systems, and frameworks that harmonize intuition with strategy and build lasting foundations for this work.',
    image: '/images/61C5142D-1CB2-414A-BAED-1C2E2E30217E.png',
  },
  {
    id: '4',
    name: 'Peggy Mars',
    role: 'Guardian of Methodology',
    bio: 'Peggy creates bridges between cultures, communities, and inner worlds. With over two decades walking the Aura Reading path, she integrates emotional, ancestral, and spiritual layers with clarity and compassion while sustaining authentic connection between teachers and students.',
    image: '/images/peggy.JPG',
    imagePosition: 'center 20%',
  },
];

// =============================================================================
// PROGRAMS
// =============================================================================

export const programs: Program[] = [
  {
    id: '3',
    title: 'Rose Meditation',
    subtitle: 'Level 1, 2, 3',
    duration: '2 days',
    dates: 'March 17–18, 2026',
    format: 'Live online + recorded content',
    priceRange: '$222 – $777',
    description: 'An initiatic path to remember who you are. Through the simple yet powerful technology of the roses, you will learn how to cleanse and protect your Aura, so that you no longer live like a sponge, absorbing energies that don\u2019t belong to you.\n\nEveryday, we are surrounded by energies: from people, memories, situations, environments, even our own thoughts. When we are unaware, these energies stick to us, creating confusion, heaviness, and programs that cloud who we truly are. By cleansing and protecting your energy field, you begin to live in the presence of your own essence. You recover your vitality, raise your vibration, and create space for your soul to manifest with clarity and power.',
    includes: [
      '2 immersive days of live instruction',
      'Rose Meditation',
      'Two 3-hour sessions per day',
      'Integration workbook',
      'Private community access to classes and events',
      'Multi-timezone support',
    ],
  },
  {
    id: '1',
    title: 'Aura 1',
    subtitle: 'General Aura Reading',
    duration: '11 days',
    dates: 'March 17–27, 2026',
    format: 'Live online + recorded content',
    priceRange: '$888 – $2,111',
    description: 'Aura Reading course teaches you to see, feel, and listen to the energy that moves within you and surrounds you, revealing that everything in life begins as energy and that awareness gives you the power to transform it.\n\nIt is as well a conscious conversation between essences. By reading another person\u2019s aura, you support their journey of growth and healing while receiving mirrors and insights that illuminate your own path. Each reading becomes a conscious exchange where both the reader and the person being read are touched and transformed. This transformation becomes possible by awakening your clairvoyance, clairsentience, clairaudience, and other subtle senses. These abilities allow you to connect directly with what is real and receive guidance that leads to freedom, clarity, and growth.',
    includes: [
      'Rose Meditation (2 days)',
      'Aura Reading Level 1 (9 days)',
      'Daily Rose Meditation guidance',
      'Practice sessions (choose the time that suits you best)',
      'Integration workbook',
      'Private community access to classes and events',
      'Multi-timezone support',
    ],
  },
  {
    id: '2',
    title: 'Aura 2',
    subtitle: 'Thematic Aura Reading',
    duration: '9 days',
    dates: 'September 19–27, 2026',
    format: 'Live online',
    priceRange: '$888 – $2,111',
    description: 'Perception sharpens through theme readings and focused practice. Clairvoyance, clairsentience, and clairaudience refine as reading becomes more precise, nuanced, and confident. Weekend intensive classes combined with weekday practice sessions.',
    includes: [
      'Weekend intensive classes (4 days)',
      'Weekday classes and practice sessions (5 days)',
      'Daily Rose Meditation guidance',
      'Practice sessions (choose the time that suits you best)',
      'Multi-timezone support',
    ],
  },
];

// =============================================================================
// SCHEDULE STAGES
// =============================================================================

export const scheduleStages: ScheduleStage[] = [
  {
    id: '1',
    title: 'Rose Meditation',
    dateRange: 'March 17–18',
    sessions: [
      { day: 'First Class', duration: '3 hours', time: { sanJose: '7:00 AM – 10:00 AM', bogota: '8:00 AM – 11:00 AM', newYork: '9:00 AM – 12:00 PM', brasilia: '10:00 AM – 1:00 PM', london: '1:00 PM – 4:00 PM', madrid: '2:00 – 5:00 PM' } },
      { day: 'Second Class', duration: '3 hours', time: { sanJose: '11:30 AM – 2:30 PM', bogota: '12:30 – 3:30 PM', newYork: '1:30 PM – 4:30 PM', brasilia: '2:30 PM – 5:30 PM', london: '5:30 PM – 8:30 PM', madrid: '6:30 – 9:30 PM' } },
    ],
  },
  {
    id: '2',
    title: 'Aura Reading: Week 1 Weekdays',
    dateRange: 'March 19–20 (Thu & Fri)',
    sessions: [
      { day: 'Rose Meditation Guidance', duration: '30 min', time: { sanJose: '7:00 – 7:30 AM', bogota: '8:00 – 8:30 AM', newYork: '9:00 – 9:30 AM', brasilia: '10:00 – 10:30 AM', london: '1:00 – 1:30 PM', madrid: '2:00 – 2:30 PM' } },
      { day: 'First Class', duration: '2 hours', time: { sanJose: '8:00 – 10:00 AM', bogota: '9:00 – 11:00 AM', newYork: '10:00 AM – 12:00 PM', brasilia: '11:00 AM – 1:00 PM', london: '2:00 – 4:00 PM', madrid: '3:00 – 5:00 PM' } },
      { day: 'Second Class', duration: '2 hours', time: { sanJose: '11:00 AM – 1:00 PM', bogota: '12:00 – 2:00 PM', newYork: '1:00 – 3:00 PM', brasilia: '2:00 – 4:00 PM', london: '5:00 – 7:00 PM', madrid: '6:00 – 8:00 PM' } },
    ],
  },
  {
    id: '3',
    title: 'Aura Reading: Weekend',
    dateRange: 'March 21–22 (Sat & Sun)',
    sessions: [
      { day: 'Rose Meditation Guidance', duration: '30 min', time: { sanJose: '7:00 – 7:30 AM', bogota: '8:00 – 8:30 AM', newYork: '9:00 – 9:30 AM', brasilia: '10:00 – 10:30 AM', london: '1:00 – 1:30 PM', madrid: '2:00 – 2:30 PM' } },
      { day: 'First Class', duration: '3 hours', time: { sanJose: '8:00 – 11:00 AM', bogota: '9:00 AM – 12:00 PM', newYork: '10:00 AM – 1:00 PM', brasilia: '11:00 AM – 2:00 PM', london: '2:00 – 5:00 PM', madrid: '3:00 – 6:00 PM' } },
      { day: 'Second Class', duration: '3 hours', time: { sanJose: '12:30 – 3:30 PM', bogota: '1:30 – 4:30 PM', newYork: '2:30 – 5:30 PM', brasilia: '3:30 – 6:30 PM', london: '6:30 – 9:30 PM', madrid: '7:30 – 10:30 PM' } },
    ],
  },
  {
    id: '4',
    title: 'Aura Reading: Week 2',
    dateRange: 'March 23–26 (Mon–Thu)',
    sessions: [
      { day: 'Rose Meditation Guidance', duration: '30 min', time: { sanJose: '7:00 – 7:30 AM', bogota: '8:00 – 8:30 AM', newYork: '9:00 – 9:30 AM', brasilia: '10:00 – 10:30 AM', london: '1:00 – 1:30 PM', madrid: '2:00 – 2:30 PM' } },
      { day: 'Class (mandatory)', duration: '3 hours', time: { sanJose: '8:00 – 11:00 AM', bogota: '9:00 AM – 12:00 PM', newYork: '10:00 AM – 1:00 PM', brasilia: '11:00 AM – 2:00 PM', london: '2:00 – 5:00 PM', madrid: '3:00 – 6:00 PM' } },
      { day: 'Practice 1: Europe', duration: '1.5 hours', time: { sanJose: '-', bogota: '-', newYork: '-', brasilia: '8:00 – 9:30 AM', london: '11:00 AM – 12:30 PM', madrid: '12:00 – 1:30 PM' } },
      { day: 'Practice 2', duration: '1.5 hours', time: { sanJose: '12:00 – 1:30 PM', bogota: '1:00 – 2:30 PM', newYork: '2:00 – 3:30 PM', brasilia: '3:00 – 4:30 PM', london: '6:00 – 7:30 PM', madrid: '7:00 – 8:30 PM' } },
      { day: 'Practice 3', duration: '1.5 hours', time: { sanJose: '2:30 – 4:00 PM', bogota: '3:30 – 5:00 PM', newYork: '4:30 – 6:00 PM', brasilia: '5:30 – 7:00 PM', london: '8:30 – 10:00 PM', madrid: '9:30 – 11:00 PM' } },
    ],
  },
  {
    id: '5',
    title: 'Special Practice Day',
    dateRange: 'March 27 (Fri)',
    sessions: [
      { day: 'Rose Meditation Guidance', duration: '30 min', time: { sanJose: '7:00 – 7:30 AM', bogota: '8:00 – 8:30 AM', newYork: '9:00 – 9:30 AM', brasilia: '10:00 – 10:30 AM', london: '1:00 – 1:30 PM', madrid: '2:00 – 2:30 PM' } },
      { day: 'Q&A and Practice Time', duration: '3 hours', time: { sanJose: '8:00 – 11:00 AM', bogota: '9:00 AM – 12:00 PM', newYork: '10:00 AM – 1:00 PM', brasilia: '11:00 AM – 2:00 PM', london: '2:00 – 5:00 PM', madrid: '3:00 – 6:00 PM' } },
    ],
  },
];

// =============================================================================
// ROSE MEDITATION STANDALONE SCHEDULE (March 17–18, 2026)
// =============================================================================

export const roseMeditationScheduleStages: ScheduleStage[] = [
  {
    id: 'rose-1',
    title: 'Rose Meditation',
    dateRange: 'March 17–18',
    sessions: [
      { day: 'First Class', duration: '3 hours', time: { sanJose: '7:00 AM – 10:00 AM', bogota: '8:00 AM – 11:00 AM', newYork: '9:00 AM – 12:00 PM', brasilia: '10:00 AM – 1:00 PM', london: '1:00 PM – 4:00 PM', madrid: '2:00 – 5:00 PM' } },
      { day: 'Second Class', duration: '3 hours', time: { sanJose: '11:30 AM – 2:30 PM', bogota: '12:30 – 3:30 PM', newYork: '1:30 PM – 4:30 PM', brasilia: '2:30 PM – 5:30 PM', london: '5:30 PM – 8:30 PM', madrid: '6:30 – 9:30 PM' } },
    ],
  },
];

// =============================================================================
// AURA 2 SCHEDULE STAGES (September 19–27, 2026)
// =============================================================================

export const aura2ScheduleStages: ScheduleStage[] = [
  {
    id: 'aura2-1',
    title: 'Aura Reading Level 2: Weekends',
    dateRange: 'September 19, 20, 26 & 27 (Sat & Sun)',
    sessions: [
      { day: 'Rose Meditation Guidance', duration: '30 min', time: { sanJose: '7:00 – 7:30 AM', bogota: '8:00 – 8:30 AM', newYork: '9:00 – 9:30 AM', brasilia: '10:00 – 10:30 AM', london: '2:00 – 2:30 PM', madrid: '3:00 – 3:30 PM' } },
      { day: 'First Class', duration: '2.5 hours', time: { sanJose: '8:00 – 10:30 AM', bogota: '9:00 – 11:30 AM', newYork: '10:00 AM – 12:30 PM', brasilia: '11:00 AM – 1:30 PM', london: '3:00 – 5:30 PM', madrid: '4:00 – 6:30 PM' } },
      { day: 'Second Class', duration: '2.5 hours', time: { sanJose: '12:00 – 2:30 PM', bogota: '1:00 – 3:30 PM', newYork: '2:00 – 4:30 PM', brasilia: '3:00 – 5:30 PM', london: '7:00 – 9:30 PM', madrid: '8:00 – 10:30 PM' } },
    ],
  },
  {
    id: 'aura2-2',
    title: 'Aura Reading Level 2: Weekdays',
    dateRange: 'September 21–25 (Mon–Fri)',
    sessions: [
      { day: 'Rose Meditation Guidance', duration: '30 min', time: { sanJose: '7:00 – 7:30 AM', bogota: '8:00 – 8:30 AM', newYork: '9:00 – 9:30 AM', brasilia: '10:00 – 10:30 AM', london: '2:00 – 2:30 PM', madrid: '3:00 – 3:30 PM' } },
      { day: 'First Practice (choose at least one)', duration: '1.5 hours', time: { sanJose: '8:00 – 9:30 AM', bogota: '9:00 – 10:30 AM', newYork: '10:00 – 11:30 AM', brasilia: '11:00 AM – 12:30 PM', london: '3:00 – 4:30 PM', madrid: '4:00 – 5:30 PM' } },
      { day: 'Second Practice (choose at least one)', duration: '1.5 hours', time: { sanJose: '10:00 – 11:30 AM', bogota: '11:00 AM – 12:30 PM', newYork: '12:00 – 1:30 PM', brasilia: '1:00 – 2:30 PM', london: '5:00 – 6:30 PM', madrid: '6:00 – 7:30 PM' } },
      { day: 'Class', duration: '1.5 hours', time: { sanJose: '12:00 – 1:30 PM', bogota: '1:00 – 2:30 PM', newYork: '2:00 – 3:30 PM', brasilia: '3:00 – 4:30 PM', london: '7:00 – 8:30 PM', madrid: '8:00 – 9:30 PM' } },
    ],
  },
];

// =============================================================================
// CONTRIBUTION TIERS
// =============================================================================

export const contributionTiers: ContributionTier[] = [
  {
    id: '1',
    name: 'Seed',
    range: 'A gentle entry',
    description: 'For those in a quieter financial season. Your presence matters more than the amount.',
    price: '$888',
  },
  {
    id: '2',
    name: 'Bloom',
    range: 'A balanced exchange',
    description: 'A contribution that reflects reciprocity and sustains this work with ease.',
    price: '$1,444',
  },
  {
    id: '3',
    name: 'Canopy',
    range: 'A generous offering',
    description: 'For those moved to give more, supporting accessibility for others who are called.',
    price: '$2,111',
  },
];

// =============================================================================
// ROSE MEDITATION CONTRIBUTION TIERS (standalone)
// =============================================================================

export const roseMeditationTiers: ContributionTier[] = [
  {
    id: 'rose-1',
    name: 'Seed',
    range: 'A gentle entry',
    description: 'For those in a quieter financial season. Your presence matters more than the amount.',
    price: '$222',
  },
  {
    id: 'rose-2',
    name: 'Bloom',
    range: 'A balanced exchange',
    description: 'A contribution that reflects reciprocity and sustains this work with ease.',
    price: '$444',
  },
  {
    id: 'rose-3',
    name: 'Canopy',
    range: 'A generous offering',
    description: 'For those moved to give more, supporting accessibility for others who are called.',
    price: '$777',
  },
];

// =============================================================================
// COHERENCE DOMAINS (from The Codex Section IV)
// =============================================================================

export const coherenceDomains: CoherenceDomain[] = [
  { id: '1', number: 1, title: 'Physical Coherence', description: 'Alignment of the body through posture, breath, movement, and somatic awareness as the foundation of all practice.' },
  { id: '2', number: 2, title: 'Emotional Coherence', description: 'The capacity to feel fully without being governed by reactivity. Emotional intelligence as a doorway to freedom.' },
  { id: '3', number: 3, title: 'Mental Coherence', description: 'Clarity of thought without compulsive thinking. The mind as an instrument rather than a master.' },
  { id: '4', number: 4, title: 'Relational Coherence', description: 'Authentic connection with others rooted in presence, boundaries, and compassion rather than performance.' },
  { id: '5', number: 5, title: 'Creative Coherence', description: 'Access to the creative impulse as a natural expression of aligned being rather than forced production.' },
  { id: '6', number: 6, title: 'Vocational Coherence', description: 'Work as an expression of purpose. The alignment of livelihood with authentic calling.' },
  { id: '7', number: 7, title: 'Financial Coherence', description: 'A healthy relationship with resources through receiving, stewarding, and circulating with ease and integrity.' },
  { id: '8', number: 8, title: 'Sexual Coherence', description: 'The integration of life force energy. Embodied presence in intimacy and creative power.' },
  { id: '9', number: 9, title: 'Spiritual Coherence', description: 'Direct connection with the sacred, not as belief but as lived experience and continuous remembrance.' },
  { id: '10', number: 10, title: 'Environmental Coherence', description: 'Harmony between the individual and their spaces, ecosystems, and the living world.' },
  { id: '11', number: 11, title: 'Ancestral Coherence', description: 'Healing the lineage. Transforming inherited patterns into gifts and reclaiming the wisdom of those who came before.' },
  { id: '12', number: 12, title: 'Temporal Coherence', description: 'Right relationship with time, neither rushing nor stagnating. The art of sacred timing.' },
  { id: '13', number: 13, title: 'Universal Coherence', description: 'The recognition of belonging to something vast. Alignment with the intelligence that moves through all things.' },
];

// =============================================================================
// COHERENCE ALTERNATIVES
// Optional words that can replace "Coherence" in domain titles and copy
// to vary tone and resonance across contexts.
// =============================================================================

export const coherenceAlternatives: CoherenceAlternativeCategory[] = [
  {
    id: 'inner-alignment',
    tone: 'Inner Alignment / Spiritual',
    words: ['Alignment', 'Harmony', 'Integration', 'Wholeness', 'Inner Order', 'Unity', 'Centeredness'],
  },
  {
    id: 'somatic',
    tone: 'Nervous System / Somatic',
    words: ['Regulation', 'Stability', 'Balance', 'Groundedness', 'Equilibrium'],
  },
  {
    id: 'signal',
    tone: 'Signal / Technology Metaphor',
    words: ['Clarity', 'Signal Integrity', 'Resolution', 'Synchronization', 'Clean Signal', 'Calibration'],
  },
  {
    id: 'sovereignty',
    tone: 'Freedom / Sovereignty',
    words: ['Self-possession', 'Sovereignty', 'Agency', 'Presence', 'Inner Freedom'],
  },
  {
    id: 'everyday',
    tone: 'Simple Everyday',
    words: ['Stillness', 'Flow', 'Peace', 'Ease', 'Consistency'],
  },
];

// =============================================================================
// PATH LEVELS (Rose Meditation + Aura 1–5)
// Full dataset kept for reference. Aura 4 & 5 (levels 7–8) are excluded from
// the rose page via the visiblePathLevels export below.
// =============================================================================

export const pathLevels: PathLevel[] = [
  {
    id: '1',
    level: 1,
    title: 'Rose Meditation',
    subtitle: 'The Open Threshold',
    description: 'Introduces grounding, aura awareness, and energetic cleansing. Learn to root yourself, separate your energy from others, and receive the nourishing forces of Earth and Cosmos.',
    focus: ['Grounding & presence', 'Aura cleansing & protection', 'Energy separation', 'Earth & Cosmic circuits'],
  },
  {
    id: '2',
    level: 2,
    title: 'Rose Meditation',
    subtitle: 'The Living Rhythm',
    description: 'Deepens into the subtle body. Discover what your aura carries, transmute past and present energies, cleanse the seven chakras and aura layers, and release energetic ties.',
    focus: ['Chakra & aura layer cleansing', 'Energetic tie release', 'Sacred space creation', 'Environmental protection'],
  },
  {
    id: '3',
    level: 3,
    title: 'Rose Meditation',
    subtitle: 'The Spiritual Activation',
    description: 'Work with spiritual agreements, free yourself from energetic cords, transcend limiting beliefs, cleanse mental programs, and learn Reality Creation through the Mock Up technique.',
    focus: ['Spiritual agreements & cords', 'Belief transcendence', 'Mental program cleansing', 'Reality Creation (Mock Up)'],
  },
  {
    id: '4',
    level: 4,
    title: 'Aura 1',
    subtitle: 'General Aura Reading',
    description: 'The gateway into reading energy. Learn to read your own aura and the aura of others, opening a direct channel to intuition, healing, and self-knowledge.',
    focus: ['Aura reading initiation', 'Healing journeys', 'Chakra & universal teachings', 'Energy of love'],
  },
  {
    id: '5',
    level: 5,
    title: 'Aura 2',
    subtitle: 'Thematic Aura Reading',
    description: 'Aura 2 is the level where your reading gains direction, since you learn how to create new focused paths inside the reading, choosing where to look with clarity and intention. Where the General Aura Reading opens the field so Spirit can show what is most important in the moment, the thematic reading allows you to focus on a specific aspect of someone\'s life and explore it with depth and intention. This course teaches you to anchor the reading in a specific topic (work, relationships, health, abundance, expression, purpose, or any theme alive in the moment) and to follow its energetic thread with confidence. Here, you learn mastery of focus and also gain empowered movement inside the aura, with new technologies that allow you navigating through layers of consciousness to understand how to work with a theme inside the Aura Reading. It is the level where you begin to explore the aura exactly where the question lives, and discover the depth that becomes available when you know how to focus your attention.',
    focus: ['Theme readings', 'Refined clairvoyance', 'Advanced reading techniques', 'Deepened perception'],
  },
  {
    id: '6',
    level: 6,
    title: 'Aura 3',
    subtitle: 'Relationship Aura Reading',
    description: 'Aura reading turns toward the relational field. Explore the energetic dynamics of relationships, navigate complex interpersonal landscapes, and support transformation in yourself and others.',
    focus: ['Relational energy dynamics', 'Relationship healing', 'Interpersonal navigation', 'Expanded intuitive capacity'],
  },
  {
    id: '7',
    level: 7,
    title: 'Aura 4',
    subtitle: 'The Living Transmission',
    description: 'Requires physical presence and direct guardianship. Energetic transmission deepens through shared field, community practice, and the embodied coherence of practiced guardians.',
    focus: ['In-person transmission', 'Guardian-held field', 'Embodied coherence', 'Community practice'],
  },
  {
    id: '8',
    level: 8,
    title: 'Aura 5',
    subtitle: 'Sovereign Mastery',
    description: 'The culmination of the Aura path. Perception, healing, and transmission converge into sovereign expression. Creation becomes conscious, heart-led, and rooted in love.',
    focus: ['Unified mastery', 'Conscious creation', 'Heart-led expression', 'Full sovereignty'],
  },
];

export const visiblePathLevels: PathLevel[] = pathLevels.filter(
  (l) => l.level <= 6,
);

// =============================================================================
// LINEAGE
// =============================================================================

export const lineageEntries: LineageEntry[] = [
  { id: '1', year: '1960s', name: 'Lewis S. Bostwick', description: 'Channeled the material of Aura Reading in California. Founder of the Berkeley Psychic Institute and the Church of the Divine Man.' },
  { id: '2', year: '1980s', name: 'Anastasia Plunk', description: 'Received and carried the Aura Reading and Rose meditation teachings from the Berkeley Psychic Institute, ensuring the continuity and integrity of the lineage.' },
  { id: '3', year: '2000s', name: 'Angelina Ataide', description: 'Founder of CELARIS (Center of Aura Readings, Reiki, Intuition and Dreams).' },
  { id: '4', year: '2026', name: 'ROSES OS', description: 'The platform crystallizes decades of lineage wisdom into an accessible ecosystem for consciousness, remembrance, and coherent living.' },
];

// =============================================================================
// CHAKRAS (for teacher section)
// =============================================================================

export const chakras: Chakra[] = [
  { id: '1', number: 1, name: 'Root', sanskritName: 'Muladhara', color: '#C0392B', location: 'Base of spine', element: 'Earth', balanced: 'Grounded, stable, secure, trusting', unbalanced: 'Anxious, fearful, disconnected from body', blockages: 'Survival trauma, displacement, basic needs unmet' },
  { id: '2', number: 2, name: 'Sacral', sanskritName: 'Svadhisthana', color: '#E67E22', location: 'Lower abdomen', element: 'Water', balanced: 'Creative, fluid, emotionally present', unbalanced: 'Rigid, emotionally numb, or overwhelmed', blockages: 'Shame, guilt, creative suppression' },
  { id: '3', number: 3, name: 'Solar Plexus', sanskritName: 'Manipura', color: '#F1C40F', location: 'Upper abdomen', element: 'Fire', balanced: 'Confident, purposeful, self-directed', unbalanced: 'Controlling, passive, or scattered', blockages: 'Power dynamics, self-worth wounds' },
  { id: '4', number: 4, name: 'Heart', sanskritName: 'Anahata', color: '#27AE60', location: 'Center of chest', element: 'Air', balanced: 'Compassionate, open, connected', unbalanced: 'Closed, codependent, or bitter', blockages: 'Grief, betrayal, inability to receive' },
  { id: '5', number: 5, name: 'Throat', sanskritName: 'Vishuddha', color: '#2980B9', location: 'Throat', element: 'Ether', balanced: 'Expressive, truthful, clear communication', unbalanced: 'Silent, over-talking, or dishonest', blockages: 'Suppressed voice, fear of judgment' },
  { id: '6', number: 6, name: 'Third Eye', sanskritName: 'Ajna', color: '#8E44AD', location: 'Between eyebrows', element: 'Light', balanced: 'Intuitive, perceptive, clear-seeing', unbalanced: 'Disconnected from intuition, delusional', blockages: 'Over-intellectualization, denial of inner knowing' },
  { id: '7', number: 7, name: 'Crown', sanskritName: 'Sahasrara', color: '#9B59B6', location: 'Top of head', element: 'Consciousness', balanced: 'Connected to the sacred, open to grace', unbalanced: 'Spiritually disconnected or bypassing', blockages: 'Attachment to material identity, spiritual ego' },
];

// =============================================================================
// TEACHING TECHNIQUES
// =============================================================================

export const techniques: Technique[] = [
  { id: '1', title: 'Grounding Breath', description: 'A foundational breath practice connecting awareness to the body through slow, rhythmic nasal breathing.', level: 1, category: 'Breath' },
  { id: '2', title: 'Body Scan Awareness', description: 'Systematic attention through the body, cultivating somatic presence and releasing held tension.', level: 1, category: 'Somatic' },
  { id: '3', title: 'Heart Coherence Meditation', description: 'Focused attention on the heart center, cultivating the felt sense of coherence and compassion.', level: 1, category: 'Meditation' },
  { id: '4', title: 'Witnessing Practice', description: 'Developing the capacity to observe thoughts and sensations without identification or reaction.', level: 1, category: 'Awareness' },
  { id: '5', title: 'Rose Meditation', description: 'The core practice of the lineage, a multi-layered meditation integrating breath, body, and subtle awareness.', level: 1, category: 'Core Practice' },
  { id: '6', title: 'Field Sensing', description: 'Developing sensitivity to the energetic field (both personal and shared) as a perceptual capacity.', level: 2, category: 'Energetic' },
  { id: '7', title: 'Chakra Awareness Sequence', description: 'A guided practice moving attention through the seven energy centers, noting qualities and blockages.', level: 2, category: 'Energetic' },
  { id: '8', title: 'Emotional Alchemy', description: 'The practice of meeting difficult emotions with presence, allowing transformation through awareness rather than suppression.', level: 2, category: 'Emotional' },
  { id: '9', title: 'Relational Presence', description: 'Partnered practices for maintaining authentic presence in connection with others.', level: 2, category: 'Relational' },
  { id: '10', title: 'Advanced Breath Protocols', description: 'Extended breath sequences for deeper states of coherence and expanded awareness.', level: 2, category: 'Breath' },
  { id: '11', title: 'Space-Holding Fundamentals', description: 'The art of creating and maintaining a sacred container for individual and group practice.', level: 3, category: 'Teaching' },
  { id: '12', title: 'Transmission Practice', description: 'Developing the capacity to transmit the quality of practice through presence rather than instruction alone.', level: 3, category: 'Teaching' },
  { id: '13', title: 'Group Field Navigation', description: 'Reading and responding to the energetic dynamics of a group in real time.', level: 3, category: 'Teaching' },
  { id: '14', title: 'Adaptive Sequencing', description: 'The skill of adjusting practice sequences in response to what is present in the room.', level: 3, category: 'Teaching' },
  { id: '15', title: 'Integration Facilitation', description: 'Supporting others in grounding transformative experiences into daily life.', level: 3, category: 'Teaching' },
];

// =============================================================================
// TEACHING LEVELS
// =============================================================================

export const teachingLevels: TeachingLevel[] = [
  { level: 1, title: 'Level 1: Foundation', subtitle: 'Core Practices', description: 'The essential practices that form the foundation of all ROSES OS work. Breath, body, heart, and the Rose Meditation.' },
  { level: 2, title: 'Level 2: Deepening', subtitle: 'Energetic & Relational', description: 'Advanced practices for subtle body awareness, emotional alchemy, and relational coherence.' },
  { level: 3, title: 'Level 3: Teaching', subtitle: 'Transmission & Facilitation', description: 'Practices and principles for holding space, transmitting the work, and serving as a guardian of the lineage.' },
];

// =============================================================================
// AGREEMENTS
// =============================================================================

export const agreements: Agreement[] = [
  { id: '1', title: 'Commitment to Practice', description: 'I commit to engaging with the daily practice for the duration of the program with sincerity and consistency.' },
  { id: '2', title: 'Confidentiality', description: 'I agree to hold in confidence what is shared in group settings, honoring the container of our community.' },
  { id: '3', title: 'Respect for the Lineage', description: 'I honor the origins of this work and agree not to teach or represent these practices as my own without authorization.' },
  { id: '4', title: 'Personal Responsibility', description: 'I take responsibility for my own well-being and will communicate with the guardians if I need additional support.' },
  { id: '5', title: 'Community Care', description: 'I commit to showing up with care and respect for all participants, guardians, and the shared field of our practice.' },
];

// =============================================================================
// ELEVEN CAPACITIES
// =============================================================================

export const elevenCapacities: Capacity[] = [
  { id: '1', number: 1, title: 'Stillness', description: 'The capacity to be at rest (internally and externally) as a foundation for all action.' },
  { id: '2', number: 2, title: 'Presence', description: 'The ability to be fully here, now, without the need to be elsewhere.' },
  { id: '3', number: 3, title: 'Breath', description: 'Conscious relationship with the breath as the bridge between body and awareness.' },
  { id: '4', number: 4, title: 'Feeling', description: 'The willingness to feel completely, from pleasure to pain and everything in between.' },
  { id: '5', number: 5, title: 'Listening', description: 'Deep receptivity to self, others, and the intelligence of the larger field.' },
  { id: '6', number: 6, title: 'Discernment', description: 'Clear seeing without judgment. The capacity to distinguish truth from noise.' },
  { id: '7', number: 7, title: 'Courage', description: 'The heart-strength to act on what is true, even when it is uncomfortable.' },
  { id: '8', number: 8, title: 'Surrender', description: 'The art of releasing control without collapsing. Trusting the larger intelligence.' },
  { id: '9', number: 9, title: 'Integration', description: 'The ongoing work of bringing insights into lived experience and daily practice.' },
  { id: '10', number: 10, title: 'Service', description: 'The natural movement from inner coherence to outer contribution.' },
  { id: '11', number: 11, title: 'Remembrance', description: 'The ultimate capacity is remembering what has always been true.' },
];

// =============================================================================
// ARCHITECTURE LAYERS
// =============================================================================

export const architectureLayers: ArchitectureLayer[] = [
  { id: '1', name: 'Hardware', description: 'The physical body, including bones, muscles, organs, and the nervous system. The vessel through which all experience flows.' },
  { id: '2', name: 'Software', description: 'The mind, including beliefs, patterns, conditioning, and the stories we carry. The programs that run our experience.' },
  { id: '3', name: 'Heartware', description: 'The emotional and relational intelligence. The felt sense of connection, compassion, and coherence.' },
  { id: '4', name: 'Soulware', description: 'The deepest layer of essence, purpose, and the remembrance of who we truly are beneath all conditioning.' },
];

// =============================================================================
// BRAND QUOTES
// =============================================================================

export const brandQuotes: BrandQuote[] = [
  { id: '1', text: 'The next revolution is a revolution of consciousness.' },
  { id: '2', text: 'A seamless path to inner freedom.' },
  { id: '3', text: 'You are whole. You are here. You are remembering.' },
  { id: '4', text: 'Coherence is something you return to.' },
  { id: '5', text: 'The way is open. Welcome home.' },
  { id: '6', text: 'What if the intelligence you seek is already within you, waiting to be remembered?' },
];

// =============================================================================
// MESSAGING PILLARS
// =============================================================================

export const messagingPillars = [
  { id: '1', title: 'The Rose', description: 'It dissolves distortion and restores coherence. Inner awareness expands, presence and stability deepen. From this state, intuition sharpens, leadership rises, and connection becomes natural.' },
  { id: '2', title: 'Aura', description: 'When heart aligns with soul, you perceive subtle senses and the energy shaping your choices. Each reading is a mirror, strengthening clarity, relationships, and service.' },
  { id: '3', title: 'Human Journey', description: 'Emotional patterns and imprints dissolve, freed across mental and energetic layers. Love reveals itself as a self-organizing intelligence.' },
  { id: '4', title: 'Intuition', description: 'You learn to listen to truth with clarity and simplicity. Limiting beliefs and unconscious patterns dissolve. Your decisions become aligned, precise, and guided.' },
  { id: '5', title: 'Leadership', description: 'It deepens your capacity to feel, support, and relate. Leadership rooted in coherence, empowerment, and trust. You read your own field and the energy around you with discernment and self-mastery.' },
  { id: '6', title: 'Your Highest Potential', description: 'You access the brilliance of your original design. You live your life from pure integrity. These belong to every human who remembers who they are.' },
];

// =============================================================================
// ONGOING COMMUNITY PROGRAMS & ACTIVITIES
// =============================================================================

export const freePrograms: CommunityProgram[] = [
  {
    id: 'hummingbirds',
    title: 'Hummingbirds',
    description: 'A free weekly gathering open to everyone. A space to connect, practice, and nourish your inner world together with the community. No prior experience needed. Just come as you are.',
    schedule: 'Every Saturday, 10:30 AM – 11:30 AM (Costa Rica time)',
    free: true,
    whatsappLink: 'https://chat.whatsapp.com/C2C0DgvSVtW3fOB231vpRc?mode=gi_t',
  },
  {
    id: 'free-live-guidances',
    title: 'Free Live Guidances',
    description: 'Live Rose Meditation guidances offered to all who have already been initiated in Rose Meditation. A space to deepen your practice with the support of a guided session and the collective field.',
    schedule: 'Weekly — times vary, see full schedule below',
    audience: 'Rose Meditation Practitioner',
    free: true,
    whatsappLink: 'https://chat.whatsapp.com/Lh6bJlDmliMIryvKz63tzi?mode=gi_t',
    scheduleCycles: [
      {
        id: 'guidances-feb-jun',
        title: 'Guidance Schedule',
        months: [
          {
            month: 'February',
            sessions: [
              { date: 'Sat, Feb 28 — Silvia C', time: { sanJose: '7:00 AM', bogota: '8:00 AM', newYork: '8:00 AM', brasilia: '10:00 AM', london: '1:00 PM', madrid: '2:00 PM' } },
            ],
          },
          {
            month: 'March',
            sessions: [
              { date: 'Sat, Mar 7 — Jennifer', time: { sanJose: '9:00 AM', bogota: '10:00 AM', newYork: '10:00 AM', brasilia: '12:00 PM', london: '3:00 PM', madrid: '4:00 PM' } },
              { date: 'Mon, Mar 9 — Iryna', time: { sanJose: '9:00 AM', bogota: '10:00 AM', newYork: '11:00 AM', brasilia: '12:00 PM', london: '3:00 PM', madrid: '4:00 PM' } },
              { date: 'Sun, Mar 29 — Jennifer', time: { sanJose: '9:00 AM', bogota: '10:00 AM', newYork: '11:00 AM', brasilia: '12:00 PM', london: '4:00 PM', madrid: '5:00 PM' } },
            ],
          },
          {
            month: 'April',
            sessions: [
              { date: 'Sun, Apr 5 — Jennifer', time: { sanJose: '9:00 AM', bogota: '10:00 AM', newYork: '11:00 AM', brasilia: '12:00 PM', london: '4:00 PM', madrid: '5:00 PM' } },
              { date: 'Sat, Apr 18 — Silvia C', time: { sanJose: '7:00 AM', bogota: '8:00 AM', newYork: '9:00 AM', brasilia: '10:00 AM', london: '2:00 PM', madrid: '3:00 PM' } },
              { date: 'Sun, Apr 19 — Jennifer', time: { sanJose: '9:00 AM', bogota: '10:00 AM', newYork: '11:00 AM', brasilia: '12:00 PM', london: '4:00 PM', madrid: '5:00 PM' } },
              { date: 'Mon, Apr 27 — Dara', time: { sanJose: '7:00 AM', bogota: '8:00 AM', newYork: '9:00 AM', brasilia: '10:00 AM', london: '2:00 PM', madrid: '3:00 PM' } },
            ],
          },
          {
            month: 'May',
            sessions: [
              { date: 'Tue, May 5 — Nicole', time: { sanJose: 'TBD', bogota: 'TBD', newYork: 'TBD', brasilia: 'TBD', london: 'TBD', madrid: 'TBD' } },
              { date: 'Sat, May 9 — Silvia F', time: { sanJose: 'TBD', bogota: 'TBD', newYork: 'TBD', brasilia: 'TBD', london: 'TBD', madrid: 'TBD' } },
              { date: 'Mon, May 11 — Dara', time: { sanJose: '7:30 AM', bogota: '8:30 AM', newYork: '9:30 AM', brasilia: '10:30 AM', london: '2:30 PM', madrid: '3:30 PM' } },
              { date: 'Sun, May 18 — Iryna', time: { sanJose: 'TBD', bogota: 'TBD', newYork: 'TBD', brasilia: 'TBD', london: 'TBD', madrid: 'TBD' } },
              { date: 'Mon, May 25 — Julia', time: { sanJose: '8:00 AM', bogota: '9:00 AM', newYork: '10:00 AM', brasilia: '11:00 AM', london: '3:00 PM', madrid: '4:00 PM' } },
            ],
          },
          {
            month: 'June',
            sessions: [
              { date: 'Tue, Jun 2 — Silvia C', time: { sanJose: '6:00 AM', bogota: '7:00 AM', newYork: '8:00 AM', brasilia: '9:00 AM', london: '1:00 PM', madrid: '2:00 PM' } },
              { date: 'Wed, Jun 10 — Nicole', time: { sanJose: 'TBD', bogota: 'TBD', newYork: 'TBD', brasilia: 'TBD', london: 'TBD', madrid: 'TBD' } },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'practitioners-meetings',
    title: 'Meetings of Rose Meditation Practitioners',
    description: 'A monthly gathering for Rose Meditation practitioners to ask questions, share experiences, and support one another on the path. A living Q&A space held with care and presence.',
    schedule: 'Once a month',
    audience: 'Rose Meditation practitioners',
    free: true,
    calendarLink: 'https://calendar.google.com/calendar/ical/21e0a10ac6c3ef9a3f510a35faee4b0acc56cce607872364cc973a874a2bd364%40group.calendar.google.com/public/basic.ics',
    googleCalendarUrl: 'https://calendar.google.com/calendar/u/1?cid=MjFlMGExMGFjNmMzZWY5YTNmNTEwYTM1ZmFlZTRiMGFjYzU2Y2NlNjA3ODcyMzY0Y2M5NzNhODc0YTJiZDM2NEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t',
  },
];

// =============================================================================
// COMMUNITY: TEACHERS TRAINING — 2026 SCHEDULE
// =============================================================================

export const teachersTrainingSchedule: CommunityScheduleCycle[] = [
  {
    id: 'tt-intro',
    title: 'Introduction Class',
    months: [
      {
        month: 'February',
        sessions: [
          { date: 'Wed, Feb 25', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
        ],
      },
    ],
  },
  {
    id: 'tt-program-1',
    title: 'Program 1 | March to July',
    months: [
      {
        month: 'March',
        sessions: [
          { date: 'Fri, Mar 6', time: { sanJose: '3:00 PM – 4:30 PM', bogota: '4:00 PM – 5:30 PM', newYork: '4:00 PM – 5:30 PM', brasilia: '6:00 PM – 7:30 PM', london: '9:00 PM – 10:30 PM', madrid: '10:00 PM – 11:30 PM' } },
          { date: 'Thu, Mar 12', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
          { date: 'Thu, Mar 19', time: { sanJose: '11:00 AM – 12:30 PM', bogota: '12:00 PM – 1:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '2:00 PM – 3:30 PM', london: '5:00 PM – 6:30 PM', madrid: '6:00 PM – 7:30 PM' } },
          { date: 'Thu, Mar 26', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
        ],
      },
      {
        month: 'April',
        sessions: [
          { date: 'Thu, Apr 2', time: { sanJose: '11:00 AM – 12:30 PM', bogota: '12:00 PM – 1:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '2:00 PM – 3:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
          { date: 'Thu, Apr 16', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Wed, Apr 22', time: { sanJose: '3:00 PM – 4:30 PM', bogota: '4:00 PM – 5:30 PM', newYork: '5:00 PM – 6:30 PM', brasilia: '6:00 PM – 7:30 PM', london: '10:00 PM – 11:30 PM', madrid: '11:00 PM – 12:30 AM' } },
          { date: 'Thu, Apr 30', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
        ],
      },
      {
        month: 'May',
        sessions: [
          { date: 'Mon, May 4', time: { sanJose: '4:00 PM – 5:30 PM', bogota: '5:00 PM – 6:30 PM', newYork: '6:00 PM – 7:30 PM', brasilia: '7:00 PM – 8:30 PM', london: '11:00 PM – 12:30 AM', madrid: '12:00 AM – 1:30 AM' } },
          { date: 'Thu, May 14', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Thu, May 21', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Thu, May 28', time: { sanJose: '1:00 PM – 2:30 PM', bogota: '2:00 PM – 3:30 PM', newYork: '3:00 PM – 4:30 PM', brasilia: '4:00 PM – 5:30 PM', london: '8:00 PM – 9:30 PM', madrid: '9:00 PM – 10:30 PM' } },
        ],
      },
      {
        month: 'June',
        sessions: [
          { date: 'Thu, Jun 4', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Thu, Jun 11', time: { sanJose: '11:00 AM – 12:30 PM', bogota: '12:00 PM – 1:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '2:00 PM – 3:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
          { date: 'Thu, Jun 18', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Thu, Jun 25', time: { sanJose: '1:00 PM – 2:00 PM', bogota: '2:00 PM – 3:00 PM', newYork: '3:00 PM – 4:00 PM', brasilia: '4:00 PM – 5:00 PM', london: '8:00 PM – 9:00 PM', madrid: '9:00 PM – 10:00 PM' } },
        ],
      },
      {
        month: 'July',
        sessions: [
          { date: 'Thu, Jul 2', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Thu, Jul 9', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Mon, Jul 20', time: { sanJose: '3:00 PM – 4:30 PM', bogota: '4:00 PM – 5:30 PM', newYork: '5:00 PM – 6:30 PM', brasilia: '6:00 PM – 7:30 PM', london: '10:00 PM – 11:30 PM', madrid: '11:00 PM – 12:30 AM' } },
          { date: 'Thu, Jul 30', time: { sanJose: '3:00 PM – 4:30 PM', bogota: '4:00 PM – 5:30 PM', newYork: '5:00 PM – 6:30 PM', brasilia: '6:00 PM – 7:30 PM', london: '10:00 PM – 11:30 PM', madrid: '11:00 PM – 12:30 AM' } },
        ],
      },
    ],
  },
  {
    id: 'tt-program-2',
    title: 'Program 2 | August to December',
    months: [
      {
        month: 'August',
        sessions: [
          { date: 'Thu, Aug 6', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Thu, Aug 13', time: { sanJose: '1:00 PM – 2:30 PM', bogota: '2:00 PM – 3:30 PM', newYork: '3:00 PM – 4:30 PM', brasilia: '4:00 PM – 5:30 PM', london: '8:00 PM – 9:30 PM', madrid: '9:00 PM – 10:30 PM' } },
          { date: 'Thu, Aug 20', time: { sanJose: '11:00 AM – 12:30 PM', bogota: '12:00 PM – 1:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '2:00 PM – 3:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
          { date: 'Thu, Aug 27', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
        ],
      },
      {
        month: 'September',
        sessions: [
          { date: 'Thu, Sep 3', time: { sanJose: '11:00 AM – 12:30 PM', bogota: '12:00 PM – 1:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '2:00 PM – 3:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
          { date: 'Thu, Sep 10', time: { sanJose: '1:00 PM – 2:30 PM', bogota: '2:00 PM – 3:30 PM', newYork: '3:00 PM – 4:30 PM', brasilia: '4:00 PM – 5:30 PM', london: '8:00 PM – 9:30 PM', madrid: '9:00 PM – 10:30 PM' } },
          { date: 'Thu, Sep 17', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Thu, Sep 24', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
        ],
      },
      {
        month: 'October',
        sessions: [
          { date: 'Wed, Oct 7', time: { sanJose: '1:00 PM – 2:30 PM', bogota: '2:00 PM – 3:30 PM', newYork: '3:00 PM – 4:30 PM', brasilia: '4:00 PM – 5:30 PM', london: '8:00 PM – 9:30 PM', madrid: '9:00 PM – 10:30 PM' } },
          { date: 'Thu, Oct 15', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Thu, Oct 22', time: { sanJose: '11:00 AM – 12:30 PM', bogota: '12:00 PM – 1:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '2:00 PM – 3:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
          { date: 'Thu, Oct 29', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
        ],
      },
      {
        month: 'November',
        sessions: [
          { date: 'Thu, Nov 5', time: { sanJose: '11:00 AM – 12:30 PM', bogota: '12:00 PM – 1:30 PM', newYork: '12:00 PM – 1:30 PM', brasilia: '2:00 PM – 3:30 PM', london: '5:00 PM – 6:30 PM', madrid: '6:00 PM – 7:30 PM' } },
          { date: 'Thu, Nov 12', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
          { date: 'Thu, Nov 19', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
          { date: 'Thu, Nov 26', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
        ],
      },
      {
        month: 'December',
        sessions: [
          { date: 'Thu, Dec 3', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
          { date: 'Thu, Dec 10', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
          { date: 'Mon, Dec 14', time: { sanJose: '1:00 PM – 2:00 PM', bogota: '2:00 PM – 3:00 PM', newYork: '2:00 PM – 3:00 PM', brasilia: '4:00 PM – 5:00 PM', london: '7:00 PM – 8:00 PM', madrid: '8:00 PM – 9:00 PM' } },
        ],
      },
    ],
  },
];

export const teachersTrainingInvestment: InvestmentOption[] = [
  { id: 'tt-cycle-1', label: 'First Cycle of Training', period: 'March to July', price: '$600' },
  { id: 'tt-cycle-2', label: 'Second Cycle of Training', period: 'August to December', price: '$600' },
];

// =============================================================================
// COMMUNITY: AURA FOR LIFE — 2026 SCHEDULE
// =============================================================================

export const auraForLifeSchedule: CommunityScheduleCycle[] = [
  {
    id: 'afl-cycle-1',
    title: 'Cycle 1 | February to July',
    months: [
      {
        month: 'February',
        sessions: [
          { date: 'Tue, Feb 24', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
        ],
      },
      {
        month: 'March',
        sessions: [
          { date: 'Tue, Mar 3', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
          { date: 'Tue, Mar 10', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
          { date: 'Tue, Mar 17', time: { sanJose: '11:00 AM – 12:30 PM', bogota: '12:00 PM – 1:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '2:00 PM – 3:30 PM', london: '5:00 PM – 6:30 PM', madrid: '6:00 PM – 7:30 PM' } },
          { date: 'Tue, Mar 24', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
        ],
      },
      {
        month: 'April',
        sessions: [
          { date: 'Tue, Apr 7', time: { sanJose: '11:00 AM – 12:30 PM', bogota: '12:00 PM – 1:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '2:00 PM – 3:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
          { date: 'Tue, Apr 14', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Tue, Apr 21', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Tue, Apr 28', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
        ],
      },
      {
        month: 'May',
        sessions: [
          { date: 'Tue, May 5', time: { sanJose: '1:00 PM – 2:30 PM', bogota: '2:00 PM – 3:30 PM', newYork: '3:00 PM – 4:30 PM', brasilia: '4:00 PM – 5:30 PM', london: '8:00 PM – 9:30 PM', madrid: '9:00 PM – 10:30 PM' } },
          { date: 'Tue, May 12', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Tue, May 19', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Tue, May 26', time: { sanJose: '11:00 AM – 12:30 PM', bogota: '12:00 PM – 1:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '2:00 PM – 3:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
        ],
      },
      {
        month: 'June',
        sessions: [
          { date: 'Tue, Jun 9', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Tue, Jun 16', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Wed, Jun 24', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Tue, Jun 30', time: { sanJose: '11:00 AM – 12:30 PM', bogota: '12:00 PM – 1:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '2:00 PM – 3:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
        ],
      },
      {
        month: 'July',
        sessions: [
          { date: 'Tue, Jul 7', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Tue, Jul 21', time: { sanJose: '3:00 PM – 4:30 PM', bogota: '4:00 PM – 5:30 PM', newYork: '5:00 PM – 6:30 PM', brasilia: '6:00 PM – 7:30 PM', london: '10:00 PM – 11:30 PM', madrid: '11:00 PM – 12:30 AM' } },
          { date: 'Thu, Jul 23', time: { sanJose: '3:00 PM – 4:30 PM', bogota: '4:00 PM – 5:30 PM', newYork: '5:00 PM – 6:30 PM', brasilia: '6:00 PM – 7:30 PM', london: '10:00 PM – 11:30 PM', madrid: '11:00 PM – 12:30 AM' } },
          { date: 'Tue, Jul 28', time: { sanJose: '3:00 PM – 4:30 PM', bogota: '4:00 PM – 5:30 PM', newYork: '5:00 PM – 6:30 PM', brasilia: '6:00 PM – 7:30 PM', london: '10:00 PM – 11:30 PM', madrid: '11:00 PM – 12:30 AM' } },
        ],
      },
    ],
  },
  {
    id: 'afl-cycle-2',
    title: 'Cycle 2 | August to December',
    months: [
      {
        month: 'August',
        sessions: [
          { date: 'Wed, Aug 5', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Tue, Aug 11', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Tue, Aug 18', time: { sanJose: '11:00 AM – 12:30 PM', bogota: '12:00 PM – 1:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '2:00 PM – 3:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
          { date: 'Tue, Aug 25', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
        ],
      },
      {
        month: 'September',
        sessions: [
          { date: 'Tue, Sep 1', time: { sanJose: '11:00 AM – 12:30 PM', bogota: '12:00 PM – 1:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '2:00 PM – 3:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
          { date: 'Tue, Sep 8', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Tue, Sep 15', time: { sanJose: '1:00 PM – 2:30 PM', bogota: '2:00 PM – 3:30 PM', newYork: '3:00 PM – 4:30 PM', brasilia: '4:00 PM – 5:30 PM', london: '8:00 PM – 9:30 PM', madrid: '9:00 PM – 10:30 PM' } },
          { date: 'Tue, Sep 22', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
        ],
      },
      {
        month: 'October',
        sessions: [
          { date: 'Thu, Oct 1', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Tue, Oct 6', time: { sanJose: '11:00 AM – 12:30 PM', bogota: '12:00 PM – 1:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '2:00 PM – 3:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
          { date: 'Tue, Oct 20', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Tue, Oct 27', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
        ],
      },
      {
        month: 'November',
        sessions: [
          { date: 'Tue, Nov 3', time: { sanJose: '11:00 AM – 12:30 PM', bogota: '12:00 PM – 1:30 PM', newYork: '12:00 PM – 1:30 PM', brasilia: '2:00 PM – 3:30 PM', london: '5:00 PM – 6:30 PM', madrid: '6:00 PM – 7:30 PM' } },
          { date: 'Tue, Nov 10', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
          { date: 'Tue, Nov 17', time: { sanJose: '1:00 PM – 2:30 PM', bogota: '2:00 PM – 3:30 PM', newYork: '2:00 PM – 3:30 PM', brasilia: '4:00 PM – 5:30 PM', london: '7:00 PM – 8:30 PM', madrid: '8:00 PM – 9:30 PM' } },
          { date: 'Tue, Nov 24', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
        ],
      },
      {
        month: 'December',
        sessions: [
          { date: 'Tue, Dec 1', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
          { date: 'Tue, Dec 8', time: { sanJose: '12:00 PM – 1:30 PM', bogota: '1:00 PM – 2:30 PM', newYork: '1:00 PM – 2:30 PM', brasilia: '3:00 PM – 4:30 PM', london: '6:00 PM – 7:30 PM', madrid: '7:00 PM – 8:30 PM' } },
          { date: 'Tue, Dec 15', time: { sanJose: '12:00 PM – 1:00 PM', bogota: '1:00 PM – 2:00 PM', newYork: '1:00 PM – 2:00 PM', brasilia: '3:00 PM – 4:00 PM', london: '6:00 PM – 7:00 PM', madrid: '7:00 PM – 8:00 PM' } },
        ],
      },
    ],
  },
];

export const auraForLifeInvestment: InvestmentOption[] = [
  { id: 'afl-cycle-1', label: 'Cycle 1', period: 'March to July', price: '$400' },
  { id: 'afl-cycle-2', label: 'Cycle 2', period: 'August to December', price: '$400' },
  { id: 'afl-full', label: 'Full Cycle', period: 'March to December', price: '$700' },
];

// =============================================================================
// ONGOING COMMUNITY PROGRAMS & ACTIVITIES (with schedule + investment)
// =============================================================================

export const paidPrograms: CommunityProgram[] = [
  {
    id: 'aura-for-life',
    title: 'Aura for Life',
    description: 'A continued practice program for those who have completed the Aura Reading path. A living space to keep your reading skills sharp, deepen your perception, and stay connected to the community of practitioners.',
    free: false,
    whatsappLink: 'https://chat.whatsapp.com/BeowpnN4CtvJdqFysxxy41',
    calendarLink: 'https://calendar.google.com/calendar/ical/d28269c09ef556ca45935fd59f6846c0208ae9e4681e870445fffbe011216491%40group.calendar.google.com/public/basic.ics',
    googleCalendarUrl: 'https://calendar.google.com/calendar/u/1?cid=ZDI4MjY5YzA5ZWY1NTZjYTQ1OTM1ZmQ1OWY2ODQ2YzAyMDhhZTllNDY4MWU4NzA0NDVmZmZiZTAxMTIxNjQ5MUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t',
    scheduleCycles: auraForLifeSchedule,
    investment: auraForLifeInvestment,
  },
  {
    id: 'teachers-training',
    title: 'Rose Meditation Teachers Training',
    description: 'A dedicated training path for those called to share Rose Meditation with others. This program prepares you to hold space, guide meditations, and transmit the practice with clarity, presence, and integrity.',
    free: false,
    calendarLink: 'https://calendar.google.com/calendar/ical/6c5be92eae7703c042356edb50cd679ab042ac4ddb5ca8ca68f9b37f77df9de8%40group.calendar.google.com/public/basic.ics',
    googleCalendarUrl: 'https://calendar.google.com/calendar/u/1?cid=NmM1YmU5MmVhZTc3MDNjMDQyMzU2ZWRiNTBjZDY3OWFiMDQyYWM0ZGRiNWNhOGNhNjhmOWIzN2Y3N2RmOWRlOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t',
    scheduleCycles: teachersTrainingSchedule,
    investment: teachersTrainingInvestment,
  },
];
