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
        { concept: 'Prepare Physical Space', slideNumber: 16, reimaginedImage: 'level-2/16-physical-space.png' },
        { concept: 'Protection of the Space', slideNumber: 17, reimaginedImage: 'level-2/17-create-the-room.jpg', originalImage: 'level-2/17-protectthespace-original.jpg' },
        { concept: 'Cleansing of the Space', slideNumber: 18, reimaginedImage: 'level-2/18-cleanse-the-space.jpg', originalImage: 'level-2/18-cleansing-space-original.PNG' },
        { concept: 'Owning Your Space', slideNumber: 19, reimaginedImage: 'level-2/19-owning-space.jpg', originalImage: 'level-2/19-protect-the-space-original.PNG' },
      ],
    },
    {
      title: 'Chakra System',
      images: [
        { concept: 'Chakras Intro', slideNumber: 20, reimaginedImage: 'level-2/20-chakras-intro.jpeg' },
        { concept: 'The Seven Chakras', slideNumber: 21, reimaginedImage: 'level-2/21-chakras.jpg', originalImage: 'level-2/21-chakras-original.PNG' },
        { concept: 'Root Chakra', slideNumber: 22, reimaginedImage: 'level-2/22-root-chakra.png' },
        { concept: 'Sacral Chakra', slideNumber: 23, reimaginedImage: 'level-2/23-sacral-chakra.png' },
        { concept: 'Solar Plexus Chakra', slideNumber: 24, reimaginedImage: 'level-2/24-solar-plexus-chakra.png' },
        { concept: 'Heart Chakra', slideNumber: 25, reimaginedImage: 'level-2/25-heart-chakra.png' },
        { concept: 'Throat Chakra', slideNumber: 26, reimaginedImage: 'level-2/26-throat-chakra.png' },
        { concept: 'Third Eye Chakra', slideNumber: 27, reimaginedImage: 'level-2/27-third-eye-chakra.jpeg' },
        { concept: 'Crown Chakra', slideNumber: 28, reimaginedImage: 'level-2/28-crown-chakra.png' },
      ],
    },
    {
      title: 'Cleansing & Recovery',
      images: [
        { concept: 'Cleansing Each Aura Layer', slideNumber: 29, reimaginedImage: 'level-2/29-cleansing-each-layer.PNG', originalImage: 'level-2/29-cleansing-layers-original.jpg' },
        { concept: 'Cleansing Each Chakra', slideNumber: 30, reimaginedImage: 'level-2/30-cleansing-each-chakra.PNG', originalImage: 'level-2/30-cleansingeachchakra-original.jpg' },
        { concept: 'Energy Recovery (Level 2)', slideNumber: 31, reimaginedImage: 'level-2/31-energy-recovery.jpeg', originalImage: 'level-2/31-energyrecoveryeachchakra-original.jpg' },
      ],
    },
    {
      title: 'Golden Sticky Roses',
      images: [
        { concept: 'Golden Sticky Roses — Phase 1', slideNumber: 32, reimaginedImage: 'level-2/32-golden-sticky-1.jpg', originalImage: 'level-2/32-golden-sticky-1-original.jpg' },
        { concept: 'Golden Sticky Roses — Phase 2', slideNumber: 33, reimaginedImage: 'level-2/33-golden-sticky-2.jpg', originalImage: 'level-2/33-golden-sticky-2-original.PNG' },
        { concept: 'Golden Sticky Roses — Phase 3', slideNumber: 34, reimaginedImage: 'level-2/34-golden-sticky-3.jpg', originalImage: 'level-2/34-golden-sticky-3-original.PNG' },
        { concept: 'Golden Sticky Roses — Phase 4', slideNumber: 35, reimaginedImage: 'level-2/35-golden-sticky-4.jpg', originalImage: 'level-2/35-golden-sticky-4-original.PNG' },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Level 2 Manual — Foundational Reference Images (from Level 1)
// ---------------------------------------------------------------------------

export const level2FoundationalImages: ManualImageMapping = {
  level: 2,
  label: 'Level 2 Manual — Foundational Reference',
  sections: [
    {
      title: 'Level 1 Foundational Context',
      images: [
        { concept: 'The Rose', slideNumber: 1, reimaginedImage: 'level-1/1-the-rose.PNG' },
        { concept: 'Grounding Cord', slideNumber: 3, reimaginedImage: 'level-1/3-grounding-cord.jpeg' },
        { concept: 'Aura Exercise', slideNumber: 5, reimaginedImage: 'level-1/5-aura-exercise.PNG', originalImage: 'level-1/5-auraexercise-original.PNG' },
        { concept: 'Energy Recovery (Level 1)', slideNumber: 14, reimaginedImage: 'level-1/14-energy-recovery-background.png', originalImage: 'level-1/14-recovery-rose-original.PNG' },
        { concept: 'Sacred Space', slideNumber: 15, reimaginedImage: 'level-1/15-sacred-space.png' },
        { concept: '6th and 7th Chakras', slideNumber: 16, reimaginedImage: 'level-1/16-sacred-space.PNG', originalImage: 'level-1/16-sacredspace-original.jpg' },
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
        { concept: 'The Analyzer', slideNumber: 36, reimaginedImage: 'level-3/36-analyzer.PNG', originalImage: 'level-3/36-analyzer-original-reimagined.jpg' },
      ],
    },
    {
      title: 'Stick of Agreements',
      images: [
        { concept: 'Stick of Agreements', slideNumber: 38, reimaginedImage: 'level-3/38-stick-of-agreements.png' },
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
  { file: 'level-1/8-circuitofenergycosmos.PNG', referencedIn: 'Slide 9 note', purpose: 'Previous version of cosmos circuit' },
  { file: 'level-1/10-cosmosearth.PNG', referencedIn: 'Slide 10 note', purpose: 'Alternate cosmos + earth view' },
  { file: 'level-2/21a-example-of-chakra-slides.PNG', referencedIn: 'Slide 21 note', purpose: 'Style reference for chakra pages' },
  { file: 'level-2/29a-chakracleansing-original.jpg', referencedIn: 'Slide 30 note', purpose: 'Detail reference for chakra cleansing' },
  { file: 'level-2/34-golden-sticky-3-original-alt.PNG', referencedIn: 'Slide 34 note', purpose: 'Alternate original for golden sticky phase 3' },
];

// ---------------------------------------------------------------------------
// All manual image mappings
// ---------------------------------------------------------------------------

export const allManualImageMappings: ManualImageMapping[] = [
  level2ManualImages,
  level2FoundationalImages,
  level3ManualImages,
];
