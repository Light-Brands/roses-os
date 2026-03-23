/**
 * Canonical Image Registry — Single Source of Truth
 *
 * Every image used across teaching slides, manual PDFs, and the website
 * is registered here. When an image is marked as `shared`, updating the
 * file at `canonicalPath` propagates to all consumers after rebuilding
 * the manual PDFs (`npm run build:manuals`).
 *
 * Flow:
 *   1. Teaching slides on the website reference `canonicalPath` directly
 *      (Next.js serves from `public/`).
 *   2. The build-manuals script copies shared images into the manual build
 *      directory, then Puppeteer renders HTML → PDF.
 *   3. Teachers Aid PDF auto-updates because it's browser print-to-PDF
 *      of the live page (no rebuild needed).
 */

export type ImageScope = 'shared' | 'manual-only' | 'teaching-only';

export interface ImageEntry {
  /** Semantic identifier (e.g. "grounding-cord") */
  id: string;
  /** Human-readable label */
  label: string;
  /** Path relative to `public/` — the canonical file location */
  canonicalPath: string;
  /** Where this image is used */
  scope: ImageScope;
  /** Which manual levels use this image (empty for teaching-only) */
  manualLevels: number[];
  /** Filename used in manual HTML (for shared images, this is the teaching filename) */
  manualFilename: string | null;
}

// ---------------------------------------------------------------------------
// SHARED IMAGES — used in both teaching slides AND manual PDFs
// Updating the file at `canonicalPath` updates both systems.
// ---------------------------------------------------------------------------

const sharedImages: ImageEntry[] = [
  {
    id: 'grounding-cord',
    label: 'Grounding Cord',
    canonicalPath: '/images/teaching/teaching-grounding-cord.png',
    scope: 'shared',
    manualLevels: [1, 2],
    manualFilename: 'teaching-grounding-cord.png',
  },
  {
    id: 'golden-sun',
    label: 'Golden Sun',
    canonicalPath: '/images/teaching/teaching-golden-sun.jpeg',
    scope: 'shared',
    manualLevels: [1, 2],
    manualFilename: 'teaching-golden-sun.jpeg',
  },
  {
    id: 'cosmos-circuit',
    label: 'Circuit of Earth & Cosmos Energies',
    canonicalPath: '/images/teaching/teaching-cosmos-circuit.png',
    scope: 'shared',
    manualLevels: [1, 2],
    manualFilename: 'teaching-cosmos-circuit.png',
  },
  {
    id: 'energy-recovery-rose',
    label: 'Cleansing & Recovery Rose',
    canonicalPath: '/images/teaching/teaching-energy-recovery-rose.png',
    scope: 'shared',
    manualLevels: [1, 2],
    manualFilename: 'teaching-energy-recovery-rose.png',
  },
  {
    id: 'discharge-energy',
    label: 'Discharge Excess Energy',
    canonicalPath: '/images/teaching/teaching-discharge-energy.png',
    scope: 'shared',
    manualLevels: [1],
    manualFilename: 'teaching-discharge-energy.png',
  },
  {
    id: 'aura-layers',
    label: 'Aura Layers',
    canonicalPath: '/images/teaching/teaching-aura-layers.png',
    scope: 'shared',
    manualLevels: [2],
    manualFilename: 'teaching-aura-layers.png',
  },
  {
    id: 'the-rose',
    label: 'The Rose',
    canonicalPath: '/images/teaching/teaching-the-rose.png',
    scope: 'shared',
    manualLevels: [1, 2],
    manualFilename: 'teaching-the-rose.png',
  },
  {
    id: 'posture',
    label: 'Meditation Posture',
    canonicalPath: '/images/teaching/teaching-posture.png',
    scope: 'shared',
    manualLevels: [],
    manualFilename: 'teaching-posture.png',
  },
  {
    id: 'grounding-cord-front',
    label: 'Grounding Cord (Front View)',
    canonicalPath: '/images/teaching/teaching-grounding-cord-front.png',
    scope: 'shared',
    manualLevels: [],
    manualFilename: 'teaching-grounding-cord-front.png',
  },
  {
    id: 'grounding-sun-combined',
    label: 'Grounding & Golden Sun Combined',
    canonicalPath: '/images/teaching/teaching-grounding-sun-combined.png',
    scope: 'shared',
    manualLevels: [],
    manualFilename: 'teaching-grounding-sun-combined.png',
  },
  {
    id: 'third-eye-chakra',
    label: 'Third Eye Chakra',
    canonicalPath: '/images/teaching/teaching-third-eye-chakra.png',
    scope: 'shared',
    manualLevels: [],
    manualFilename: 'teaching-third-eye-chakra.png',
  },
];

// ---------------------------------------------------------------------------
// MANUAL-ONLY IMAGES — covers, summaries, decorative elements
// These live in `scripts/pdf-manuals/images/` and are NOT shared.
// ---------------------------------------------------------------------------

const manualOnlyImages: ImageEntry[] = [
  // Level 1
  { id: 'l1-cover', label: 'Level 1 Cover', canonicalPath: '/scripts/pdf-manuals/images/manual-l1-cover.png', scope: 'manual-only', manualLevels: [1], manualFilename: 'manual-l1-cover.png' },

  // Level 1&2
  { id: 'l12-cover', label: 'Levels 1&2 Cover', canonicalPath: '/scripts/pdf-manuals/images/manual-l12-cover-l12.png', scope: 'manual-only', manualLevels: [1, 2], manualFilename: 'manual-l12-cover-l12.png' },
  { id: 'l12-four-roses', label: 'Four Roses (L1&2)', canonicalPath: '/scripts/pdf-manuals/images/manual-l12-four-roses.jpeg', scope: 'manual-only', manualLevels: [1, 2], manualFilename: 'manual-l12-four-roses.jpeg' },
  { id: 'l12-pink-rose', label: 'Pink Rose (L1&2)', canonicalPath: '/scripts/pdf-manuals/images/manual-l12-pink-rose.png', scope: 'manual-only', manualLevels: [1, 2], manualFilename: 'manual-l12-pink-rose.png' },
  { id: 'l12-sacred-space', label: 'Sacred Space', canonicalPath: '/scripts/pdf-manuals/images/manual-l12-sacred-space.png', scope: 'manual-only', manualLevels: [2], manualFilename: 'manual-l12-sacred-space.png' },
  { id: 'l12-room-preparation', label: 'Room Preparation', canonicalPath: '/scripts/pdf-manuals/images/manual-l12-room-preparation.png', scope: 'manual-only', manualLevels: [2], manualFilename: 'manual-l12-room-preparation.png' },
  { id: 'l12-owning-space', label: 'Owning Your Space', canonicalPath: '/scripts/pdf-manuals/images/manual-l12-owning-space.png', scope: 'manual-only', manualLevels: [2], manualFilename: 'manual-l12-owning-space.png' },
  { id: 'l12-chakra-cleansing', label: 'Chakra Cleansing', canonicalPath: '/scripts/pdf-manuals/images/manual-l12-chakra-cleansing.png', scope: 'manual-only', manualLevels: [2], manualFilename: 'manual-l12-chakra-cleansing.png' },
  { id: 'l12-chakra-chart', label: 'Seven Chakras Chart', canonicalPath: '/scripts/pdf-manuals/images/manual-l12-chakra-chart.png', scope: 'manual-only', manualLevels: [2], manualFilename: 'manual-l12-chakra-chart.png' },
  { id: 'l12-golden-sticky', label: 'Golden Sticky Roses', canonicalPath: '/scripts/pdf-manuals/images/manual-l12-golden-sticky-roses.png', scope: 'manual-only', manualLevels: [2], manualFilename: 'manual-l12-golden-sticky-roses.png' },
  { id: 'l12-elements-summary', label: 'Elements Summary L1&2', canonicalPath: '/scripts/pdf-manuals/images/manual-l12-elements-summary-l12.png', scope: 'manual-only', manualLevels: [1, 2], manualFilename: 'manual-l12-elements-summary-l12.png' },

  // Level 3
  { id: 'l3-cover', label: 'Level 3 Cover', canonicalPath: '/scripts/pdf-manuals/images/manual-l3-cover-l3.png', scope: 'manual-only', manualLevels: [3], manualFilename: 'manual-l3-cover-l3.png' },
  { id: 'l3-agreements-stick', label: 'Breaking Agreements', canonicalPath: '/scripts/pdf-manuals/images/manual-l3-agreements-stick.png', scope: 'manual-only', manualLevels: [3], manualFilename: 'manual-l3-agreements-stick.png' },
  { id: 'l3-cutting-cords', label: 'Cutting Cords', canonicalPath: '/scripts/pdf-manuals/images/manual-l3-cutting-cords.png', scope: 'manual-only', manualLevels: [3], manualFilename: 'manual-l3-cutting-cords.png' },
  { id: 'l3-energy-cleansing', label: 'Post-Intimacy Cleansing', canonicalPath: '/scripts/pdf-manuals/images/manual-l3-energy-cleansing.png', scope: 'manual-only', manualLevels: [3], manualFilename: 'manual-l3-energy-cleansing.png' },
  { id: 'l3-analyzer', label: 'The Analyzer', canonicalPath: '/scripts/pdf-manuals/images/manual-l3-analyzer.png', scope: 'manual-only', manualLevels: [3], manualFilename: 'manual-l3-analyzer.png' },
  { id: 'l3-analyzer-sacred-space', label: 'The Analyzer & Sacred Space', canonicalPath: '/public/rose med images/level-3/IMG_1955.jpeg', scope: 'shared', manualLevels: [3], manualFilename: 'IMG_1955.jpeg' },
  { id: 'l3-transmedium', label: 'Transmedium Channels', canonicalPath: '/scripts/pdf-manuals/images/manual-l3-transmedium-channels.png', scope: 'manual-only', manualLevels: [3], manualFilename: 'manual-l3-transmedium-channels.png' },
  { id: 'l3-creating-reality', label: 'Creating Reality', canonicalPath: '/scripts/pdf-manuals/images/manual-l3-creating-reality.png', scope: 'manual-only', manualLevels: [3], manualFilename: 'manual-l3-creating-reality.png' },
  { id: 'l3-mockup', label: 'Mock-up Manifestation', canonicalPath: '/scripts/pdf-manuals/images/manual-l3-mockup.png', scope: 'manual-only', manualLevels: [3], manualFilename: 'manual-l3-mockup.png' },
  { id: 'l3-elements-summary', label: 'Elements Summary L3', canonicalPath: '/scripts/pdf-manuals/images/manual-l3-elements-summary-l3.png', scope: 'manual-only', manualLevels: [3], manualFilename: 'manual-l3-elements-summary-l3.png' },
];

// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------

export const imageRegistry: ImageEntry[] = [...sharedImages, ...manualOnlyImages];

export function getSharedImages(): ImageEntry[] {
  return imageRegistry.filter((img) => img.scope === 'shared');
}

export function getManualImages(level: number): ImageEntry[] {
  return imageRegistry.filter((img) => img.manualLevels.includes(level));
}

export function getTeachingImages(): ImageEntry[] {
  return imageRegistry.filter((img) => img.scope === 'shared' || img.scope === 'teaching-only');
}

export function getImageById(id: string): ImageEntry | undefined {
  return imageRegistry.find((img) => img.id === id);
}
