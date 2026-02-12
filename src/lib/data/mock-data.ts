// =============================================================================
// MOCK DATA: ROSES OS
// =============================================================================

import type {
  NavItem, Guardian, Program, ContributionTier,
  ScheduleStage, CoherenceDomain, PathLevel, LineageEntry,
  ArchitectureLayer, Chakra, Technique, TeachingLevel,
  Agreement, Capacity, BrandQuote, Stat,
} from './types';

// =============================================================================
// NAVIGATION
// =============================================================================

export const navItems: NavItem[] = [
  { label: 'The Rose', href: '/the-rose' },
  { label: 'Programs', href: '/programs' },
  { label: 'Guardians', href: '/guardians' },
  { label: 'The Codex', href: '/the-codex' },
  { label: 'Community', href: '/community' },
];

// =============================================================================
// GUARDIANS
// =============================================================================

export const guardians: Guardian[] = [
  {
    id: '1',
    name: 'Angelina Ataide',
    role: 'Founder & Lead Guardian',
    bio: 'Angelina brings over three decades of experience in somatic healing, consciousness research, and transformative education. She is the creator of the ROSES OS methodology and the primary steward of its lineage.',
    image: '/images/angel.JPG',
  },
  {
    id: '2',
    name: 'Diego Dosal',
    role: 'Guardian of Community',
    bio: 'Diego bridges ancient wisdom traditions with modern embodiment practices. His work focuses on masculine integration, breathwork, and the somatic dimensions of the Rose technology.',
    image: '/guardians/diego.jpg',
  },
  {
    id: '3',
    name: 'Dara Ayoub',
    role: 'Guardian of Practice',
    bio: 'Dara brings over a decade of experience in facilitation and relational intelligence, serving as the connective tissue of the ROSES OS community. She holds the space for enrollment and participant care.',
    image: '/guardians/dara.jpg',
  },
  {
    id: '4',
    name: 'Peggy Mar',
    role: 'Guardian of Integration',
    bio: 'Peggy brings over two decades of experience and practice in the integration of transformative experiences into daily life. Her expertise in psychology and mindfulness supports participants in grounding their practice.',
    image: '/images/peggy.JPG',
  },
];

// =============================================================================
// PROGRAMS
// =============================================================================

export const programs: Program[] = [
  {
    id: '1',
    title: 'The Rose',
    subtitle: 'Rose Meditation Level 1, 2 & 3',
    duration: '2 days',
    dates: 'March 17–18, 2026',
    format: 'Live online + recorded content',
    description: 'Two immersive days introducing the Rose technology. Six hours per day offered in two three-hour sessions. A systematic practice for remembrance, coherence, and inner freedom.',
    includes: [
      '2 immersive days of live instruction',
      'Rose Meditation Levels 1, 2 & 3',
      'Two 3-hour sessions per day',
      'Integration workbook',
      'Private community access to classes and events',
      'Multi-timezone support',
    ],
  },
  {
    id: '2',
    title: 'The Rose + Aura 1',
    subtitle: 'Complete Immersion',
    duration: '11 days',
    dates: 'March 17–27, 2026',
    format: 'Live online + recorded content',
    description: 'The complete journey combining Rose Meditation Levels 1, 2 & 3 with Aura Reading Level 1. Eleven sessions across structured and flexible blocks, deepening perception and energetic coherence.',
    includes: [
      'Rose Meditation Levels 1, 2 & 3 (2 days)',
      'Aura Reading Level 1 (9 days)',
      'Daily Rose Meditation guidance',
      'Flexible practice sessions',
      'Integration workbook',
      'Private community access to classes and events',
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
    title: 'Stage 1: Rose Meditation Level 1, 2 & 3',
    dateRange: 'March 17–18',
    sessions: [
      { day: 'First Class', duration: '3 hours', time: { sanJose: '7:00 AM – 10:00 AM', bogota: '8:00 AM – 11:00 AM', newYork: '9:00 AM – 12:00 PM', brasilia: '10:00 AM – 1:00 PM', london: '1:00 PM – 4:00 PM', madrid: '2:00 – 5:00 PM' } },
      { day: 'Second Class', duration: '3 hours', time: { sanJose: '11:30 AM – 2:30 PM', bogota: '12:30 – 3:30 PM', newYork: '1:30 PM – 4:30 PM', brasilia: '2:30 PM – 5:30 PM', london: '5:30 PM – 8:30 PM', madrid: '6:30 – 9:30 PM' } },
    ],
  },
  {
    id: '2',
    title: 'Stage 2: Aura Reading: Week 1 Weekdays',
    dateRange: 'March 19–20 (Thu & Fri)',
    sessions: [
      { day: 'Rose Meditation Guidance', duration: '30 min', time: { sanJose: '7:00 – 7:30 AM', bogota: '8:00 – 8:30 AM', newYork: '9:00 – 9:30 AM', brasilia: '10:00 – 10:30 AM', london: '1:00 – 1:30 PM', madrid: '2:00 – 2:30 PM' } },
      { day: 'First Class', duration: '2 hours', time: { sanJose: '8:00 – 10:00 AM', bogota: '9:00 – 11:00 AM', newYork: '10:00 AM – 12:00 PM', brasilia: '11:00 AM – 1:00 PM', london: '2:00 – 4:00 PM', madrid: '3:00 – 5:00 PM' } },
      { day: 'Second Class', duration: '2 hours', time: { sanJose: '11:00 AM – 1:00 PM', bogota: '12:00 – 2:00 PM', newYork: '1:00 – 3:00 PM', brasilia: '2:00 – 4:00 PM', london: '5:00 – 7:00 PM', madrid: '6:00 – 8:00 PM' } },
    ],
  },
  {
    id: '3',
    title: 'Stage 2: Aura Reading: Weekend',
    dateRange: 'March 21–22 (Sat & Sun)',
    sessions: [
      { day: 'Rose Meditation Guidance', duration: '30 min', time: { sanJose: '7:00 – 7:30 AM', bogota: '8:00 – 8:30 AM', newYork: '9:00 – 9:30 AM', brasilia: '10:00 – 10:30 AM', london: '1:00 – 1:30 PM', madrid: '2:00 – 2:30 PM' } },
      { day: 'First Class', duration: '3 hours', time: { sanJose: '8:00 – 11:00 AM', bogota: '9:00 AM – 12:00 PM', newYork: '10:00 AM – 1:00 PM', brasilia: '11:00 AM – 2:00 PM', london: '2:00 – 5:00 PM', madrid: '3:00 – 6:00 PM' } },
      { day: 'Second Class', duration: '3 hours', time: { sanJose: '12:30 – 2:30 PM', bogota: '1:30 – 4:30 PM', newYork: '2:30 – 5:30 PM', brasilia: '3:30 – 6:30 PM', london: '6:30 – 9:30 PM', madrid: '7:30 – 10:30 PM' } },
    ],
  },
  {
    id: '4',
    title: 'Stage 2: Aura Reading: Week 2',
    dateRange: 'March 23–27 (Mon–Fri)',
    sessions: [
      { day: 'Rose Meditation Guidance', duration: '30 min', time: { sanJose: '7:00 – 7:30 AM', bogota: '8:00 – 8:30 AM', newYork: '8:00 – 8:30 AM', brasilia: '10:00 – 10:30 AM', london: '1:00 – 1:30 PM', madrid: '2:00 – 2:30 PM' } },
      { day: 'Class (mandatory)', duration: '3 hours', time: { sanJose: '8:00 – 11:00 AM', bogota: '9:00 AM – 12:00 PM', newYork: '10:00 AM – 1:00 PM', brasilia: '11:00 AM – 2:00 PM', london: '2:00 – 5:00 PM', madrid: '3:00 – 6:00 PM' } },
      { day: 'Practice 1: Europe', duration: '1.5 hours', time: { sanJose: '—', bogota: '—', newYork: '—', brasilia: '7:00 – 8:30 AM', london: '10:00 – 11:30 AM', madrid: '11:00 AM – 12:30 PM' } },
      { day: 'Practice 2', duration: '1.5 hours', time: { sanJose: '12:00 – 1:30 PM', bogota: '1:00 – 2:30 PM', newYork: '2:00 – 3:30 PM', brasilia: '3:00 – 4:30 PM', london: '6:00 – 7:30 PM', madrid: '7:00 – 8:30 PM' } },
      { day: 'Practice 3', duration: '1.5 hours', time: { sanJose: '2:30 – 4:00 PM', bogota: '3:30 – 5:00 PM', newYork: '4:30 – 6:00 PM', brasilia: '5:30 – 7:00 PM', london: '8:30 – 10:00 PM', madrid: '9:30 – 11:00 PM' } },
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
    range: 'Under $30,000 USD annual income',
    description: 'Lower contribution: honors your reality and current season.',
    priceFoundational: '$222',
    priceFull: '$888',
  },
  {
    id: '2',
    name: 'Bloom',
    range: '$30,000–$70,000 USD annual income',
    description: 'Mid-range: reflects reciprocity and balance.',
    priceFoundational: '$444',
    priceFull: '$1,444',
  },
  {
    id: '3',
    name: 'Canopy',
    range: 'Above $70,000 USD annual income',
    description: 'Higher tier: supports accessibility for others and the expansion of this work.',
    priceFoundational: '$777',
    priceFull: '$2,111',
  },
];

// =============================================================================
// COHERENCE DOMAINS (from The Codex Section IV)
// =============================================================================

export const coherenceDomains: CoherenceDomain[] = [
  { id: '1', number: 1, title: 'Physical Coherence', description: 'Alignment of the body: posture, breath, movement, and somatic awareness as the foundation of all practice.' },
  { id: '2', number: 2, title: 'Emotional Coherence', description: 'The capacity to feel fully without being governed by reactivity. Emotional intelligence as a doorway to freedom.' },
  { id: '3', number: 3, title: 'Mental Coherence', description: 'Clarity of thought without compulsive thinking. The mind as an instrument rather than a master.' },
  { id: '4', number: 4, title: 'Relational Coherence', description: 'Authentic connection with others rooted in presence, boundaries, and compassion rather than performance.' },
  { id: '5', number: 5, title: 'Creative Coherence', description: 'Access to the creative impulse as a natural expression of aligned being rather than forced production.' },
  { id: '6', number: 6, title: 'Vocational Coherence', description: 'Work as an expression of purpose. The alignment of livelihood with authentic calling.' },
  { id: '7', number: 7, title: 'Financial Coherence', description: 'A healthy relationship with resources: receiving, stewarding, and circulating with ease and integrity.' },
  { id: '8', number: 8, title: 'Sexual Coherence', description: 'The integration of life force energy. Embodied presence in intimacy and creative power.' },
  { id: '9', number: 9, title: 'Spiritual Coherence', description: 'Direct connection with the sacred: not as belief but as lived experience and continuous remembrance.' },
  { id: '10', number: 10, title: 'Environmental Coherence', description: 'Harmony between the individual and their spaces, ecosystems, and the living world.' },
  { id: '11', number: 11, title: 'Ancestral Coherence', description: 'Healing the lineage. Transforming inherited patterns into gifts and reclaiming the wisdom of those who came before.' },
  { id: '12', number: 12, title: 'Temporal Coherence', description: 'Right relationship with time: neither rushing nor stagnating. The art of sacred timing.' },
  { id: '13', number: 13, title: 'Universal Coherence', description: 'The recognition of belonging to something vast. Alignment with the intelligence that moves through all things.' },
];

// =============================================================================
// PATH LEVELS (Rose One / Two / Three)
// =============================================================================

export const pathLevels: PathLevel[] = [
  {
    id: '1',
    level: 1,
    title: 'Rose One',
    subtitle: 'The Remembering',
    description: 'The foundational journey. Rose One initiates the process of remembrance: reconnecting with the body, breath, and the intelligence of silence. Participants establish a daily practice and begin to experience coherence as a felt sense.',
    focus: ['Core meditation practice', 'Breath awareness', 'Somatic presence', 'Daily coherence rhythm'],
  },
  {
    id: '2',
    level: 2,
    title: 'Rose Two',
    subtitle: 'The Deepening',
    description: 'Building on the foundation, Rose Two invites a deeper relationship with the subtle body and energetic awareness. Participants explore the 13 domains of coherence and begin to integrate the practice into all dimensions of life.',
    focus: ['Energetic awareness', '13 domains exploration', 'Advanced breathwork', 'Relational coherence'],
  },
  {
    id: '3',
    level: 3,
    title: 'Rose Three',
    subtitle: 'The Flowering',
    description: 'The culmination of the foundational path. Rose Three develops teaching capacity and the ability to hold space for others. Participants become stewards of the work, capable of transmitting the Rose technology to their communities.',
    focus: ['Teaching methodology', 'Space-holding capacity', 'Community stewardship', 'Living transmission'],
  },
];

// =============================================================================
// LINEAGE
// =============================================================================

export const lineageEntries: LineageEntry[] = [
  { id: '1', year: '1960s', name: 'Lewis S. Bostwick', description: 'Channeled and systematized the techniques and tools of Aura Reading in California. Founder of the Berkeley Psychic Institute and the Church of the Divine Man.' },
  { id: '2', year: '1960s', name: 'Berkeley Psychic Institute & Church of the Divine Man', description: 'Center for psychic training and transmission of Aura Reading practices. Bridge between the original channeled teachings and the next generation of stewards.' },
  { id: '3', year: '1980s', name: 'Anastasia Plunk', description: 'Received and carried the Aura Reading and Rose meditation teachings from the Berkeley Psychic Institute, ensuring the continuity and integrity of the lineage.' },
  { id: '4', year: '2010s', name: 'Angelina Ataide', description: 'Founder of CELARIS. For over thirty years, she has upheld the Rose as a living transmission, initiating more than six thousand individuals into the Rose tradition.' },
  { id: '5', year: '2020s', name: 'ROSES OS', description: 'The platform crystallizes decades of lineage wisdom into an accessible ecosystem for consciousness, remembrance, and coherent living.' },
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
  { id: '5', title: 'Rose Meditation', description: 'The core practice of the lineage: a multi-layered meditation integrating breath, body, and subtle awareness.', level: 1, category: 'Core Practice' },
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
  { id: '2', title: 'Confidentiality', description: 'I agree to hold in confidence what is shared in group settings, honoring the sacred container of our community.' },
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
  { id: '4', number: 4, title: 'Feeling', description: 'The willingness to feel completely: pleasure, pain, and everything in between.' },
  { id: '5', number: 5, title: 'Listening', description: 'Deep receptivity: to self, others, and the intelligence of the larger field.' },
  { id: '6', number: 6, title: 'Discernment', description: 'Clear seeing without judgment. The capacity to distinguish truth from noise.' },
  { id: '7', number: 7, title: 'Courage', description: 'The heart-strength to act on what is true, even when it is uncomfortable.' },
  { id: '8', number: 8, title: 'Surrender', description: 'The art of releasing control without collapsing. Trusting the larger intelligence.' },
  { id: '9', number: 9, title: 'Integration', description: 'The ongoing work of bringing insights into lived experience and daily practice.' },
  { id: '10', number: 10, title: 'Service', description: 'The natural movement from inner coherence to outer contribution.' },
  { id: '11', number: 11, title: 'Remembrance', description: 'The ultimate capacity: not learning something new but remembering what has always been true.' },
];

// =============================================================================
// ARCHITECTURE LAYERS
// =============================================================================

export const architectureLayers: ArchitectureLayer[] = [
  { id: '1', name: 'Hardware', description: 'The physical body: bones, muscles, organs, nervous system. The vessel through which all experience flows.' },
  { id: '2', name: 'Software', description: 'The mind: beliefs, patterns, conditioning, and the stories we carry. The programs that run our experience.' },
  { id: '3', name: 'Heartware', description: 'The emotional and relational intelligence. The felt sense of connection, compassion, and coherence.' },
  { id: '4', name: 'Soulware', description: 'The deepest layer: essence, purpose, and the remembrance of who we truly are beneath all conditioning.' },
];

// =============================================================================
// BRAND QUOTES
// =============================================================================

export const brandQuotes: BrandQuote[] = [
  { id: '1', text: 'The next revolution is not technological. It is a revolution of remembrance.' },
  { id: '2', text: 'A seamless path to inner freedom.' },
  { id: '3', text: 'You are not broken. You are not lost. You are remembering.' },
  { id: '4', text: 'Coherence is not something you achieve. It is something you return to.' },
  { id: '5', text: 'The way is open. Welcome home.' },
  { id: '6', text: 'What if the intelligence you seek is already within you, waiting to be remembered?' },
];

// =============================================================================
// MESSAGING PILLARS
// =============================================================================

export const messagingPillars = [
  { id: '1', title: 'The Rose', description: 'A sacred technology of remembrance: a systematic practice for reconnecting with the intelligence that lives within.' },
  { id: '2', title: 'The Aura', description: 'The energetic body and its role in coherence: subtle awareness as a practical capacity for daily living.' },
  { id: '3', title: 'The Human Journey', description: 'The recognition that every life is a journey of remembrance, and that this journey is supported, not solitary.' },
];
