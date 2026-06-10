/**
 * Generate images for Rose Meditation Level 1 Manual
 * Uses Google Gemini to create sacred, branded illustrations
 *
 * Usage: npx tsx scripts/pdf-manuals/generate-manual-images.ts
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
    id: 'cover',
    name: 'Cover — Sacred Rose',
    prompt: `A single luminous rose in full bloom, rendered in sacred geometric style. The petals are translucent with warm rose-clay tones (#9C6F6E) and soft gold (#9E956B) at the center. The rose appears to glow from within with a gentle, divine light. Subtle sacred geometry patterns (flower of life) are faintly visible within the petals. The rose floats on a perfectly pure white background. Photorealistic 3D render with ethereal quality. The rose should feel alive, breathing, sacred — like a portal to remembrance. ${BRAND_STYLE}`,
  },
  {
    id: 'grounding-cord',
    name: 'Grounding Cord',
    prompt: `An elegant, minimal illustration of a luminous cord or beam of warm golden-rose light extending vertically downward from a softly glowing sphere. The cord is taut, crystalline, slightly translucent, with warm rose (#D4A09A) and copper-gold tones. Small particles of light drift along it. At the top, a subtle suggestion of a seated meditation silhouette (abstract, no face). At the bottom, the cord disappears into layers of earth-toned warmth. Sacred, grounded, stable energy. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'golden-sun',
    name: 'Golden Sun',
    prompt: `A radiant golden sun orb floating above, emanating warm divine light downward. The sun is rendered in rich gold (#9E956B) and warm amber tones, with subtle concentric rings of light expanding outward. Below it, a faint silhouette of a human aura being filled with cascading golden light particles. The light feels warm, nurturing, divine — not harsh. Sacred geometry patterns subtly woven into the sun's corona. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'four-roses',
    name: 'Four Roses of Protection',
    prompt: `Four beautiful roses arranged in a compass formation (north, south, east, west) around a central softly glowing sphere representing the aura. Each rose is a different high-vibration color — soft pink, warm lavender, gentle peach, and luminous cream — all in the brand's muted warm palette. Delicate threads of light connect each rose to the central sphere. The roses face outward protectively. Sacred, nurturing, powerful boundary energy. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'earth-cosmos-circuit',
    name: 'Circuit of Earth & Cosmos Energies',
    prompt: `An elegant illustration of two intertwining energy flows: a copper-golden energy rising from below (Earth energy) and a luminous golden-white energy descending from above (Cosmos energy). They meet and spiral around a central vertical axis, suggesting the human spine. The Earth energy is warm, grounded, copper-rose tones. The Cosmos energy is luminous, golden, with touches of celestial light. Where they meet at the center, a small burst of integrated light. The flows continue in a perpetual circuit. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'cleansing-recovery',
    name: 'Cleansing & Recovery Rose',
    prompt: `Two roses side by side in complementary states: the left rose is actively absorbing — its petals slightly open with a gentle vortex of energy being drawn inward (dark smoky wisps being transmuted into light). The right rose is radiating — its petals fully open with golden light particles streaming outward, returning purified energy. Both roses are in warm rose-clay (#9C6F6E) and blush (#E8C4BF) tones. Energy transformation and return. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'pink-rose',
    name: 'Pink Rose Blessing',
    prompt: `A single luminous pink rose, unrooted, gently ascending upward toward a soft point of celestial light. The rose is a beautiful soft pink with translucent petals, glowing from within. Inside the rose, a tiny warm light representing a soul or person. Delicate streams of golden light trail behind it as it rises. The feeling is of blessing, release, love, and surrender to the divine. Ethereal and deeply moving. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'elements-summary',
    name: 'Elements Overview',
    prompt: `A beautiful mandala-like arrangement of all the meditation elements in a circular sacred geometry pattern: at the center a rose, surrounded by concentric rings containing: a grounding cord element, a golden sun, four small protective roses, earth and cosmos energy spirals, a cleansing rose, a recovery rose, and a pink blessing rose. All elements are rendered in the warm rose-clay and gold brand palette, connected by delicate geometric lines. A complete visual map of the meditation practice. Pure white background. ${BRAND_STYLE}`,
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
  const filename = `manual-l1-${image.id}.png`;
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
  console.log('  International Aura and Dream School — Manual Image Generation (Level 1)');
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
      const existingPath = path.join(outputDir, `manual-l1-${id}.png`);
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
