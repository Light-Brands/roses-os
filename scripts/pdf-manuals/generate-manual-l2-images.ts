/**
 * Generate images for ROSES Manual 1 & 2 (Level 2 specific images)
 * Uses Google Gemini 3.1 to create sacred, branded illustrations
 *
 * Level 1 images are reused from the Level 1 manual.
 * This script generates Level 2-specific images only.
 *
 * Usage: npx tsx scripts/pdf-manuals/generate-manual-l2-images.ts
 */

import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// ENV
// ---------------------------------------------------------------------------

function loadEnvFile() {
  const envPaths = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '.env.local'),
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          if (key && value && !process.env[key]) {
            process.env[key] = value;
          }
        }
      }
      console.log(`Loaded environment from: ${envPath}\n`);
      return true;
    }
  }
  return false;
}

loadEnvFile();

// ---------------------------------------------------------------------------
// IMAGE DEFINITIONS
// ---------------------------------------------------------------------------

interface ManualImage {
  id: string;
  name: string;
  prompt: string;
}

const BRAND_STYLE = `
STYLE REQUIREMENTS:
- Sacred, warm, elevated spiritual art — editorial quality
- Color palette: muted rose tones (#9C6F6E rose-clay, #D4A09A warm rose, #E8C4BF blush, #F5E1DD petal pink), touches of gold (#9E956B), deep rose-brown (#3B2828)
- PURE WHITE background (#FFFFFF) — the image must blend seamlessly on a white page
- NO text, NO words, NO letters, NO numbers
- NO drop shadows, NO cast shadows, NO floor shadows
- Style: refined digital art or high-end botanical/sacred illustration
- Think: Apple product page aesthetics meets sacred geometry and rose symbolism
- Soft, luminous, warm lighting — never harsh or cold
- Objects should feel ethereal yet grounded, sacred yet modern
- Square aspect ratio (1:1)
`;

const MANUAL_IMAGES: ManualImage[] = [
  {
    id: 'cover-l12',
    name: 'Cover — Sacred Rose Levels 1 & 2',
    prompt: `A luminous rose in full bloom with two concentric rings of sacred geometry surrounding it — representing two levels of mastery. The inner ring is warm rose-clay (#9C6F6E), the outer ring is rich gold (#9E956B). The petals are translucent with soft golden light emanating from the center. Subtle sacred geometry patterns (flower of life, metatron's cube) are faintly visible. The rose appears to pulse with divine energy. Pure white background. Photorealistic 3D render with ethereal quality. ${BRAND_STYLE}`,
  },
  {
    id: 'grounding-cord',
    name: 'Grounding Cord',
    prompt: `A vertical beam of warm crystalline light descending from a softly glowing meditation silhouette downward into deep earth layers. The cord is luminous, taut, slightly translucent — woven from warm rose (#D4A09A) and copper-gold filaments. Tiny sparks of light travel along it. The top shows an abstract seated figure in meditation posture, the bottom shows concentric rings of warm earth tones. The feeling is of stability, grounding, and release. Elegant, sacred, modern botanical-spiritual art. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'golden-sun',
    name: 'Golden Sun',
    prompt: `A magnificent golden sun orb radiating warm divine light, positioned above a translucent human silhouette whose entire aura is being filled with cascading golden particles. The sun is rendered in rich gold (#9E956B) and warm amber, with layered concentric halos of light. Sacred geometry patterns in the corona — subtle flower of life. Below, the figure's aura glows warmly as it fills with light. Nurturing, powerful, divine presence. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'four-roses',
    name: 'Four Roses of Protection',
    prompt: `Four luminous roses arranged in a perfect cardinal cross formation around a central glowing orb (the aura). Each rose faces outward protectively — one soft coral, one warm lavender, one gentle peach, one luminous cream. Fine threads of golden light connect them to the central sphere. The roses are detailed, alive, with translucent petals catching light. Between them, a faint protective boundary of light. Powerful yet gentle. Sacred guardians. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'earth-cosmos-circuit',
    name: 'Circuit of Earth & Cosmos Energies',
    prompt: `Two luminous energy streams spiraling around a vertical axis (the spine): a warm copper-golden stream rising from below (Earth energy) and a brilliant white-gold stream descending from above (Cosmos energy). They interweave like a caduceus. Where they cross at the center, a radiant point of merged light. The Earth energy is warm, grounded, copper-rose. The Cosmos energy is crystalline, golden, celestial. A perpetual flow of transformation. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'cleansing-recovery',
    name: 'Cleansing & Recovery Rose',
    prompt: `Two roses in a diptych composition: on the left, a rose with slightly open petals drawing in dark smoky energy — transmuting it into light within its center. On the right, a rose in full bloom radiating golden light particles outward — returning purified energy. Both in warm rose-clay (#9C6F6E) and blush (#E8C4BF). A visual story of release and return, cleansing and restoration. Sacred, transformative, warm. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'pink-rose',
    name: 'Pink Rose Blessing',
    prompt: `A single exquisite pink rose, unrooted, gently ascending toward a point of celestial golden light above. The petals are translucent soft pink, glowing from within. A tiny warm light at the center represents a blessed soul. Delicate streams of golden sparkles trail behind as it rises. The feeling is of unconditional love, blessing, release, and surrender to the divine. Deeply moving, ethereal, sacred. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'sacred-space',
    name: 'Center of the Head — Sacred Space',
    prompt: `An ethereal, luminous illustration of the center of the head as a sacred chamber. A translucent human head silhouette in profile, with a glowing golden-rose sanctuary visible at the center — like a tiny temple or chapel of light within the mind. The space radiates warmth and safety. Concentric circles of soft golden light emanate outward from this center point. The feeling is of deep inner sanctity, awareness, and spiritual authority. Minimal, sacred, modern. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'room-preparation',
    name: 'Preparing the Room — Golden Grid',
    prompt: `An elegant top-down perspective of a room outlined in thin golden lines, with four golden roses at the four corners. Golden lines extend from the corners to meet at the center of the ceiling and floor, forming a sacred geometric structure — like a diamond or octahedron of golden light containing the space. A transparent grounding cord descends from the center point downward. The entire room glows with warm golden energy. Architectural yet mystical. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'owning-space',
    name: 'Owning Your Space',
    prompt: `A serene meditation figure silhouette seated in the center of a room, with golden lines of light extending from the crown chakra to the four upper corners and from the root chakra to the four lower corners of the room — creating an energetic web of authority and ownership. The figure is composed and powerful, radiating soft golden light. The feeling is of energetic sovereignty and spiritual presence. Geometric, sacred, minimal. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'chakra-cleansing',
    name: 'Chakra Cleansing with Roses',
    prompt: `A vertical column of seven glowing chakra points along a subtle human spine silhouette, each chakra represented by a small luminous sphere in its traditional color (red, orange, yellow, green/pink, blue, indigo, violet from bottom to top). At one of the chakras, two roses are positioned — one in front absorbing dark wisps of energy, one behind releasing light. The illustration shows the cleansing process happening at the chakra level. Sacred, precise, warm. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'chakra-chart',
    name: 'Seven Chakras Reference',
    prompt: `A beautiful, minimal illustration of the seven main chakras arranged vertically along a subtle spine/body silhouette. Each chakra is a luminous orb in its traditional color — root (red), sacral (orange), solar plexus (yellow), heart (pink and green), throat (sky blue), third eye (indigo), crown (violet). Thin golden connecting lines between them. Each orb has a subtle glow. Clean, modern, sacred reference chart feel. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'golden-sticky-roses',
    name: 'Golden Sticky Roses — Four Paths',
    prompt: `Four golden roses in a vertical sequence, each showing a different path through a subtle transparent human body silhouette: (1) a rose traveling straight down the center from crown to root, (2) a rose splitting at the throat and flowing down both arms, (3) a rose splitting at the root and flowing down both legs, (4) a large rose spanning the full width of the aura descending through the entire body. Each path shown with delicate golden trails. Sacred, anatomical, warm. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'elements-summary-l12',
    name: 'Complete Elements Overview — Levels 1 & 2',
    prompt: `A comprehensive mandala-like sacred geometry composition containing ALL meditation elements from both levels: center rose, grounding cord, golden sun, four protective roses, earth and cosmos energy spirals, cleansing and recovery roses, pink blessing rose, a sacred head space symbol, a golden room grid, seven chakra points, and golden sticky roses. All arranged in harmonious concentric rings of sacred geometry. Warm rose-clay and gold palette. A complete visual map of the entire practice. Pure white background. ${BRAND_STYLE}`,
  },
];

// ---------------------------------------------------------------------------
// IMAGE GENERATION
// ---------------------------------------------------------------------------

async function generateImage(
  ai: GoogleGenAI,
  image: ManualImage,
  outputDir: string
): Promise<boolean> {
  const filename = `manual-l12-${image.id}.png`;
  const outputPath = path.join(outputDir, filename);

  if (fs.existsSync(outputPath)) {
    console.log(`  Skipping ${filename} (already exists)`);
    return true;
  }

  console.log(`  Generating: ${image.name}...`);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: image.prompt,
      config: {
        responseModalities: ['IMAGE'],
        // @ts-ignore
        imageConfig: {
          aspectRatio: '1:1',
          imageSize: '2K',
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData as string, 'base64');
        fs.writeFileSync(outputPath, buffer);
        console.log(`  Saved: ${filename}\n`);
        return true;
      }
    }

    console.error(`  No image returned for ${filename}\n`);
    return false;
  } catch (error: any) {
    console.error(`  Error: ${error.message || error}\n`);
    return false;
  }
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

async function main() {
  console.log('=========================================================');
  console.log('  International Aura School — Manual Image Generation (Levels 1 & 2)');
  console.log('=========================================================\n');

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Error: GOOGLE_GEMINI_API_KEY not found in environment.');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  const outputDir = path.join(process.cwd(), 'scripts', 'pdf-manuals', 'images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let success = 0;
  let failed = 0;

  for (const image of MANUAL_IMAGES) {
    const result = await generateImage(ai, image, outputDir);
    if (result) success++;
    else failed++;

    // Rate limiting
    await new Promise((r) => setTimeout(r, 3000));
  }

  console.log('\n=========================================================');
  console.log('  SUMMARY');
  console.log('=========================================================');
  console.log(`  Generated: ${success}`);
  console.log(`  Failed:    ${failed}`);
  console.log(`  Output:    ${outputDir}`);
  console.log('=========================================================\n');
}

// Allow regenerating specific images
if (process.argv.includes('--images')) {
  const idx = process.argv.indexOf('--images');
  const ids = process.argv[idx + 1]?.split(',').map((s) => s.trim()) || [];

  (async () => {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Error: GOOGLE_GEMINI_API_KEY not found');
      process.exit(1);
    }

    const ai = new GoogleGenAI({ apiKey });
    const outputDir = path.join(process.cwd(), 'scripts', 'pdf-manuals', 'images');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const id of ids) {
      const image = MANUAL_IMAGES.find((i) => i.id === id);
      if (!image) {
        console.log(`Image "${id}" not found, skipping\n`);
        continue;
      }

      // Delete existing so it regenerates
      const existingPath = path.join(outputDir, `manual-l12-${id}.png`);
      if (fs.existsSync(existingPath)) {
        fs.unlinkSync(existingPath);
      }

      await generateImage(ai, image, outputDir);
      await new Promise((r) => setTimeout(r, 3000));
    }
  })();
} else {
  main().catch(console.error);
}
