/**
 * Manual Image Mapping
 *
 * Codifies the image-to-manual mapping from Section 3.5 of
 * docs/project-plan-for-designer-manuals.md.
 *
 * All image filenames reference files in public/rose med images/.
 */

export interface ManualImageEntry {
  concept: string;
  slideNumber: number;
  reimaginedImage: string;
  originalImage?: string;
}

export interface ManualImageMapping {
  level: number;
  label: string;
  sections: {
    title: string;
    images: ManualImageEntry[];
  }[];
}

// ---------------------------------------------------------------------------
// Level 2 Manual — Core Images
// ---------------------------------------------------------------------------

export const level2ManualImages: ManualImageMapping = {
  level: 2,
  label: 'Level 2 Manual',
  sections: [
    {
      title: 'Sacred Space & Energy Management',
      images: [
        { concept: 'Prepare Physical Space', slideNumber: 19, reimaginedImage: 'level-2/19-physical-space-abstract.png' },
        { concept: 'Protection of the Space', slideNumber: 20, reimaginedImage: 'level-2/20-create-the-room.jpg' },
        { concept: 'Cleansing of the Space', slideNumber: 21, reimaginedImage: 'level-2/21-cleanse-the-space.jpg' },
        { concept: 'Owning Your Space', slideNumber: 22, reimaginedImage: 'level-2/22-owning-space.jpg', originalImage: 'level-2/22-protect-the-space-original.PNG' },
      ],
    },
    {
      title: 'Chakra System',
      images: [
        { concept: 'Chakras Intro', slideNumber: 23, reimaginedImage: 'level-2/23-chakras-intro.jpeg' },
        { concept: 'The Seven Chakras', slideNumber: 24, reimaginedImage: 'level-2/24-chakras.png' },
        { concept: 'Root Chakra', slideNumber: 25, reimaginedImage: 'level-2/25-root-chakra.png' },
        { concept: 'Sacral Chakra', slideNumber: 26, reimaginedImage: 'level-2/26-sacral-chakra.png' },
        { concept: 'Solar Plexus Chakra', slideNumber: 27, reimaginedImage: 'level-2/27-solar-plexus-chakra.png' },
        { concept: 'Heart Chakra', slideNumber: 28, reimaginedImage: 'level-2/28-heart-chakra.png' },
        { concept: 'Throat Chakra', slideNumber: 29, reimaginedImage: 'level-2/29-throat-chakra.png' },
        { concept: 'Third Eye Chakra', slideNumber: 30, reimaginedImage: 'level-2/30-third-eye-chakra.jpeg' },
        { concept: 'Crown Chakra', slideNumber: 31, reimaginedImage: 'level-2/31-crown-chakra.png' },
      ],
    },
    {
      title: 'Cleansing & Recovery',
      images: [
        { concept: 'Cleansing Each Aura Layer', slideNumber: 32, reimaginedImage: 'level-2/32-cleansing-each-layer.PNG' },
        { concept: 'Cleansing Each Chakra', slideNumber: 33, reimaginedImage: 'level-2/33-cleansing-each-chakra.PNG' },
        { concept: 'Energy Recovery (Level 2)', slideNumber: 34, reimaginedImage: 'level-2/34-energy-recovery.png' },
      ],
    },
    {
      title: 'Golden Sticky Roses',
      images: [
        { concept: 'Golden Sticky Roses — Phase 1', slideNumber: 35, reimaginedImage: 'level-2/35-golden-sticky-1.jpg' },
        { concept: 'Golden Sticky Roses — Phase 2', slideNumber: 36, reimaginedImage: 'level-2/36-golden-sticky-2.jpg' },
        { concept: 'Golden Sticky Roses — Phase 3', slideNumber: 37, reimaginedImage: 'level-2/37-golden-sticky-3.jpg' },
        { concept: 'Golden Sticky Roses — Phase 4', slideNumber: 38, reimaginedImage: 'level-2/38-golden-sticky-4.jpg' },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 2 Manual — Foundational Reference Images (from Level 1)
// ---------------------------------------------------------------------------

export const level1ManualImages: ManualImageMapping = {
  level: 1,
  label: 'Level 1 Manual',
  sections: [
    {
      title: 'Foundational Techniques',
      images: [
        { concept: 'The Rose', slideNumber: 1, reimaginedImage: 'level-1/01-the-rose.PNG' },
        { concept: 'Meditation Posture', slideNumber: 2, reimaginedImage: 'level-1/02-meditation-posture.PNG' },
        { concept: 'Grounding Cord', slideNumber: 3, reimaginedImage: 'level-1/03-grounding-cord.jpeg' },
        { concept: 'Golden Sun', slideNumber: 4, reimaginedImage: 'level-1/04-golden-sun.png' },
        { concept: 'Limits of Aura', slideNumber: 5, reimaginedImage: 'level-1/05-aura-exercise.PNG' },
        { concept: 'Expansion of Grounding Cord', slideNumber: 6, reimaginedImage: 'level-1/06-expansion-grounding-cord.jpeg' },
        { concept: 'Golden Sun Fills', slideNumber: 7, reimaginedImage: 'level-1/07-golden-sun-fills.png' },
        { concept: 'Earth Energy', slideNumber: 8, reimaginedImage: 'level-1/08-earth-energy.PNG' },
        { concept: 'Cosmos Circuit', slideNumber: 9, reimaginedImage: 'level-1/09-cosmos-circuit.jpeg' },
        { concept: 'Cosmos + Earth', slideNumber: 10, reimaginedImage: 'level-1/10-cosmosearth.PNG' },
        { concept: 'The Rose (Gold)', slideNumber: 11, reimaginedImage: 'level-1/11-therosegold.PNG' },
        { concept: 'Four Roses', slideNumber: 12, reimaginedImage: 'level-1/12-four-roses.PNG' },
        { concept: 'Cleansing Rose', slideNumber: 13, reimaginedImage: 'level-1/13-cleansing-rose.png' },
        { concept: 'Recovery Rose', slideNumber: 14, reimaginedImage: 'level-1/14-energy-recovery.png' },
        { concept: 'Pink Rose', slideNumber: 15, reimaginedImage: 'level-1/15-pink-rose-closure.png' },
        { concept: 'Discharge Excess', slideNumber: 16, reimaginedImage: 'level-1/16-discharge-excess.PNG' },
        { concept: 'Sacred Space', slideNumber: 17, reimaginedImage: 'level-1/17-sacred-space-abstract.png' },
        { concept: 'Sacred Space (6th & 7th Chakras)', slideNumber: 18, reimaginedImage: 'level-1/18-sacred-space.PNG' },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 3 Manual — Images
// ---------------------------------------------------------------------------

export const level3ManualImages: ManualImageMapping = {
  level: 3,
  label: 'Level 3 Manual 2026',
  sections: [
    {
      title: 'The Analyzer',
      images: [
        { concept: 'The Analyzer', slideNumber: 39, reimaginedImage: 'level-3/39-analyzer.PNG' },
        { concept: 'Analyzer + Sacred Space', slideNumber: 40, reimaginedImage: 'level-3/40-analyzer-and-sacred-space.png' },
      ],
    },
    {
      title: 'Stick of Agreements',
      images: [
        { concept: 'Stick of Agreements', slideNumber: 41, reimaginedImage: 'level-3/41-stick-of-agreements.png' },
      ],
    },
    {
      title: 'Advanced Techniques',
      images: [
        { concept: 'Cutting Cords', slideNumber: 42, reimaginedImage: 'level-3/IMG_1853.jpeg' },
        { concept: 'Post Intimacy / Sexual Recovery Rose', slideNumber: 43, reimaginedImage: 'level-3/43-sexual-recovery-rose.png' },
        { concept: 'Mock Up', slideNumber: 44, reimaginedImage: 'level-3/44-mock-up.png' },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Supplementary Reference Images
// ---------------------------------------------------------------------------

export const supplementaryImages: {
  file: string;
  referencedIn: string;
  purpose: string;
}[] = [
  { file: 'level-1/Cosmos.jpg', referencedIn: 'Level 1 reference', purpose: 'Alternate cosmos view' },
  { file: 'level-1/Fullcosmosearth.jpg', referencedIn: 'Level 1 reference', purpose: 'Full cosmos + earth view' },
];

// ---------------------------------------------------------------------------
// All manual image mappings
// ---------------------------------------------------------------------------

export const allManualImageMappings: ManualImageMapping[] = [
  level1ManualImages,
  level2ManualImages,
  level3ManualImages,
];
