import type { MeditationTechnique } from './types';

// =============================================================================
// LEVEL 1 — Modular Meditation Techniques
// Sourced from: Rose Meditation Level 1 - Final Version (2025 Review)
//
// Each technique is a discrete, reorderable unit. Change the `order` field
// to rearrange the meditation sequence without touching any other code.
// =============================================================================

export const level1Techniques: MeditationTechnique[] = [
  // -------------------------------------------------------------------------
  // Preparation
  // -------------------------------------------------------------------------
  {
    id: 'l1t-getting-ready',
    order: 0,
    title: 'Getting Ready to Start',
    level: 1,
    category: 'preparation',
    description:
      'Prepare the body and mind for meditation through posture, presence, and breath.',
    instruction:
      'Sit down and keep your spine aligned in an upright posture. Place both feet on the floor, with your hands on your knees and palms facing upwards. Concentrate, close your eyes, bring your presence into the present moment and breathe deeply and slowly. Use the power of your imagination (image in action) to visualize the techniques.',
    steps: [
      { order: 1, instruction: 'Sit down and keep your spine aligned in an upright posture. Place both feet on the floor, with your hands on your knees and palms facing upwards.' },
      { order: 2, instruction: 'Concentrate, close your eyes, bring your presence into the present moment and breathe deeply and slowly.' },
      { order: 3, instruction: 'Use the power of your imagination (image in action) to visualize the techniques.' },
    ],
    linkedSlideIds: ['l1-posture'],
  },

  // -------------------------------------------------------------------------
  // Foundation techniques
  // -------------------------------------------------------------------------
  {
    id: 'l1t-grounding-cord',
    order: 1,
    title: 'Grounding Cord',
    level: 1,
    category: 'foundation',
    description:
      'An energetic cord from the first chakra to the center of the Earth that anchors, stabilizes, and clears energy.',
    instruction:
      'Create a taut grounding cord that runs from your first chakra to the center of the Earth. The cord eliminates distractions, thoughts and blockages that prevent you from being in the present moment. It brings security, stability and helps to clear energies that are not of your essence. With time and practice, the cord naturally becomes transparent.',
    linkedSlideIds: ['l1-grounding-cord'],
  },
  {
    id: 'l1t-golden-sun',
    order: 2,
    title: 'Golden Sun',
    level: 1,
    category: 'foundation',
    description:
      'A radiant sun above the head that fills the aura and body with Divine energy, raising vibration.',
    instruction:
      'Create a Golden Sun above your head and fill the entire space of your Aura and physical body with the golden light that comes from the Sun. This sun represents the Supreme Being, it raises your vibration and fills the empty energetic spaces with Divine energy after any subtle release of energy. Fill yourself with the light of the Golden Sun whenever you renew the Grounding Cord, to finish your meditation and/or at any time of the day when you want to raise your vibration.',
    linkedSlideIds: ['l1-golden-sun', 'l1-golden-sun-fills'],
  },
  {
    id: 'l1t-limits-of-aura',
    order: 3,
    title: 'Limits of the Aura',
    level: 1,
    category: 'foundation',
    description:
      'Define the boundary of the aura at 50 cm (20 inches) around the entire body.',
    instruction:
      'The aura is an energy field that surrounds our physical body. It can expand and contract. For Rose Meditation, establish your Aura 20 inches (50 cm) around your entire body.',
    linkedSlideIds: ['l1-aura-exercise'],
  },
  {
    id: 'l1t-expansion-grounding-cord',
    order: 4,
    title: 'Expansion of the Grounding Cord',
    level: 1,
    category: 'foundation',
    description:
      'Widen the grounding cord to match the width of the aura, grounding the entire energy field.',
    instruction:
      'Expand the cord sideways to the width of the Aura, grounding the entire Aura.',
    linkedSlideIds: ['l1-grounding-expansion'],
  },
  {
    id: 'l1t-renewal-grounding-cord',
    order: 5,
    title: 'Renewal of the Grounding Cord',
    level: 1,
    category: 'foundation',
    description:
      'Cut and replace the grounding cord using a personal cutting tool to refresh the energetic anchor.',
    instruction:
      'Using your imagination, and your cutting tool, cut the grounding cord whenever you need to. This tool will always be the same and will become more powerful every time you use it.',
    steps: [
      { order: 1, instruction: 'Cut the old cord.' },
      { order: 2, instruction: 'Create a new cord.' },
      { order: 3, instruction: 'Expand the cord sideways to the width of the Aura every time you create a new one.' },
    ],
    linkedSlideIds: ['l1-grounding-cord'],
  },

  // -------------------------------------------------------------------------
  // Protection
  // -------------------------------------------------------------------------
  {
    id: 'l1t-four-roses',
    order: 6,
    title: 'Four Roses of Protection, Separation and Observation',
    level: 1,
    category: 'protection',
    description:
      'Four roses placed at the edges of the aura (front, behind, left, right) serving as energetic sentinels.',
    instruction:
      'Create four Roses of the color of your choice or the color that comes to you (as long as they are high-vibration, each one can have a color) grounded on the outside of your Aura (in front, behind, to the left and to the right). Each of the four Roses fulfills the same three functions: protection, separation and observation. At any time of the day, or whenever we meditate, we blow up the four Roses and create new ones. They help us maintain neutrality.',
    subTechniques: [
      {
        id: 'l1t-four-roses-protection',
        title: 'Protection',
        description:
          'On a daily basis, we interact with energies that are not ours, such as the energies of other people or the spaces in which we live. By protecting ourselves from these energies, we increase our understanding of the dynamics we experience.',
      },
      {
        id: 'l1t-four-roses-separation',
        title: 'Separation',
        description:
          'It helps our Aura to remain separate from other people\'s Aura, bringing a clearer perception of our individuality.',
      },
      {
        id: 'l1t-four-roses-observation',
        title: 'Observation',
        description:
          'When we observe the other person from a neutral state, as a spectator, we develop compassion, not judgment.',
      },
    ],
    linkedSlideIds: ['l1-four-roses'],
  },

  // -------------------------------------------------------------------------
  // Energy circuits
  // -------------------------------------------------------------------------
  {
    id: 'l1t-energy-circuit',
    order: 7,
    title: 'Circuits of Energy of Cosmos & Earth',
    level: 1,
    category: 'energy-circuit',
    description:
      'Activate the dual flow of Earth and Cosmic energy through the body for transmutation, vitality, and spiritual information.',
    instruction:
      'Both the energy of the Earth and of the Cosmos continue to circulate in a constant flow as they enter, pass through their paths and leave. This activation raises our vibration, promotes energetic unblocking, brings up issues to resolve and provides spiritual information.',
    subTechniques: [
      {
        id: 'l1t-energy-earth',
        title: 'Energy of the Earth',
        description:
          'We call on the energy of the Earth to bring the force of transmutation and vitality to the energetic cleansing work we do in the Rose Meditation. It works like an engine that increases the power of everything we do during meditation.',
        steps: [
          {
            order: 1,
            instruction:
              'See a copper-golden energy that comes from the center of the Earth and enters through the bottom of the feet, goes up through the legs, passes through the coccyx and descends through the grounding cord. As it passes through the coccyx, 10% of this energy rises to mix with the energy of the cosmos.',
          },
        ],
      },
      {
        id: 'l1t-energy-cosmos',
        title: 'Energy of the Cosmos',
        description:
          'The energy of the Cosmos is pure consciousness and it helps us to understand what happens during the Rose Meditation and in our lives. With this active circuit, we can receive information to understand who we are, why we experience the challenges we do, what energies we carry in our Aura, how we absorb them and what adjustments we can make to create a different reality in the future.',
        steps: [
          {
            order: 1,
            instruction:
              'See a luminous golden energy that comes from the center of the Universe, enters through the crown chakra, goes down the spine, passes through the coccyx and goes up the front of the body to the throat chakra, where it splits into three parts.',
          },
          {
            order: 2,
            instruction:
              'One part exits through the crown chakra and the other two parts pass through the upper arms and out through the hands, like a fountain. When it passes through the coccyx, 10% of this energy descends to mix with the Earth\'s energy.',
          },
        ],
      },
    ],
    linkedSlideIds: ['l1-earth-circuit', 'l1-cosmos-circuit', 'l1-combined-circuit'],
  },

  // -------------------------------------------------------------------------
  // Cleansing
  // -------------------------------------------------------------------------
  {
    id: 'l1t-cleansing-recovery-roses',
    order: 8,
    title: 'Roses to Cleanse and Recover Energy',
    level: 1,
    category: 'cleansing',
    description:
      'Use roses to absorb unwanted energy and to recover your own scattered energy.',
    instruction:
      'You can create and explode as many roses as you feel like.',
    subTechniques: [
      {
        id: 'l1t-cleansing-rose',
        title: 'Cleansing Rose',
        description:
          'Create a Rose in a high-vibration color, grounded in front of you, outside your Aura and place any uncomfortable or undesirable situation on it (thoughts, people, events, conversations, fears, worries). Intend for the Rose to suck in energy, like a vacuum cleaner or a magnet. Explode the Rose out of your Aura to cleanse the energy and raise the vibration of the situation. If you need to, create new Roses, cleanse and explode them several times as required. If you wish, do the same in positive situations where you want to raise the vibration even more.',
      },
      {
        id: 'l1t-recovery-rose',
        title: 'Recovery Rose',
        description:
          'Create another Rose, grounded outside your Aura, and call your energy back to this Rose. The Rose attracts your energy that is scattered whatever it is like a vacuum cleaner or magnet. Explode the Rose out of your Aura, and receive your high vibrational and purified energy back to you.',
      },
    ],
    linkedSlideIds: ['l1-cleansing-rose', 'l1-energy-recovery'],
  },

  // -------------------------------------------------------------------------
  // Gift
  // -------------------------------------------------------------------------
  {
    id: 'l1t-pink-rose',
    order: 9,
    title: 'Pink Rose',
    level: 1,
    category: 'gift',
    description:
      'Offer a pink rose as a gift of well-being — for yourself or another person.',
    instruction:
      'We can offer this rose as a gift, after cleansing another person\'s energy from our Aura, or mainly for ourselves.',
    steps: [
      { order: 1, instruction: 'Create an unrooted pink Rose.' },
      { order: 2, instruction: 'Place the person or yourself in this Rose visualizing "Happy, Healthy, Whole, Body, Mind & Soul".' },
      { order: 3, instruction: 'Repeat in your head: "Happy, Healthy, Whole, Body, Mind & Soul".' },
      { order: 4, instruction: 'While repeating, make the Rose rise towards the center of the Universe, wishing you or the person in it all the best.' },
    ],
    linkedSlideIds: ['l1-pink-rose-closure'],
  },

  // -------------------------------------------------------------------------
  // Closing
  // -------------------------------------------------------------------------
  {
    id: 'l1t-end-meditation',
    order: 10,
    title: 'To End the Meditation',
    level: 1,
    category: 'closing',
    description:
      'Close the meditation by renewing the cord, filling with golden sun, and discharging excess energy.',
    instruction:
      'Complete the meditation by renewing your grounding cord, filling yourself with the Golden Sun, optionally renewing any techniques, and discharging excess energy.',
    steps: [
      { order: 1, instruction: 'Cut the grounding cord and create a new one.' },
      { order: 2, instruction: 'Fill yourself with the golden sun.' },
      { order: 3, instruction: 'If you feel, renew any technique you feel like (the 4 roses of separation and observation; the circuit of the cosmos and earth).' },
      { order: 4, instruction: 'Place your hands on the floor to release excess energy.' },
    ],
    linkedSlideIds: ['l1-discharge'],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Return Level 1 techniques sorted by their `order` field */
export function getLevel1TechniquesSorted(): MeditationTechnique[] {
  return [...level1Techniques].sort((a, b) => a.order - b.order);
}

/** Find a technique by its id */
export function getTechniqueById(id: string): MeditationTechnique | undefined {
  return level1Techniques.find((t) => t.id === id);
}

/** Filter techniques by category */
export function getTechniquesByCategory(
  category: MeditationTechnique['category'],
): MeditationTechnique[] {
  return level1Techniques
    .filter((t) => t.category === category)
    .sort((a, b) => a.order - b.order);
}
