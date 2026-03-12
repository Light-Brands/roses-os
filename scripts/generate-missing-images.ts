/**
 * Generate Missing Images for ROSES OS
 * Uses Google Gemini to create:
 *   1. 42-cutting-cords.png (Level 3 manual — missing from disk)
 *   2. 17-sacred-space-abstract.png (Level 1 website — abstract replacement)
 *   3. 19-physical-space-abstract.png (Level 2 website — abstract replacement)
 *
 * Usage: npx tsx scripts/generate-missing-images.ts
 *        npx tsx scripts/generate-missing-images.ts --only cutting-cords
 *        npx tsx scripts/generate-missing-images.ts --only sacred-space
 *        npx tsx scripts/generate-missing-images.ts --only physical-space
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
          const idx = trimmed.indexOf('=');
          if (idx > 0) {
            const key = trimmed.slice(0, idx);
            const value = trimmed.slice(idx + 1).replace(/^["']|["']$/g, '');
            if (key && value && !process.env[key]) {
              process.env[key] = value;
            }
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
// BRAND STYLE
// ---------------------------------------------------------------------------

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
`;

// ---------------------------------------------------------------------------
// IMAGE DEFINITIONS
// ---------------------------------------------------------------------------

interface ImageDef {
  id: string;
  name: string;
  prompt: string;
  outputPath: string;
  aspectRatio: string;
}

const IMAGES: ImageDef[] = [
  {
    id: 'cutting-cords',
    name: 'Cutting Energetic Cords (Level 3 Manual)',
    prompt: `A serene meditation figure silhouette with multiple thin luminous cords extending from the chakra points outward into space. A hand of golden light moves along the spine from the neck downward, cleanly severing each cord. Where the cords are cut, tiny sparks of liberation appear. The severed cords dissolve into light particles. The figure radiates peaceful sovereignty. Freeing, powerful, compassionate. Pure white background. Square aspect ratio (1:1). ${BRAND_STYLE}`,
    outputPath: 'public/rose med images/level-3/42-cutting-cords.png',
    aspectRatio: '1:1',
  },
  {
    id: 'sacred-space',
    name: 'Sacred Space — Abstract (Level 1 Website)',
    prompt: `An abstract, ethereal representation of an inner sacred space — NOT a real room or physical place. A luminous point of awareness at the center of a translucent head silhouette, radiating concentric rings of warm golden and rose-clay light outward. Sacred geometry patterns (flower of life, golden spiral) emerge from the center point. The feeling is of inner stillness, spiritual authority, and being safely centered within. Completely abstract — no furniture, no walls, no physical objects. Landscape aspect ratio (16:10). ${BRAND_STYLE}`,
    outputPath: 'public/rose med images/level-1/17-sacred-space-abstract.png',
    aspectRatio: '3:2',
  },
  {
    id: 'physical-space',
    name: 'Preparing Physical Space — Abstract (Level 2 Website)',
    prompt: `An abstract, ethereal representation of preparing a sacred meditation space — NOT a real room or photograph. Geometric shapes suggesting a protective boundary or dome, with golden light flowing through them. A glowing rose at the center emanates cleansing energy outward in concentric waves. Subtle sacred geometry elements (circles, spirals, golden ratio) creating a feeling of intentional space preparation. Completely abstract — no furniture, no walls, no real objects. The feeling is of readiness, sacred intention, and protective boundaries being set. Landscape aspect ratio (16:10). ${BRAND_STYLE}`,
    outputPath: 'public/rose med images/level-2/19-physical-space-abstract.png',
    aspectRatio: '3:2',
  },
];

// ---------------------------------------------------------------------------
// IMAGE GENERATION
// ---------------------------------------------------------------------------

async function generateImage(
  ai: GoogleGenAI,
  image: ImageDef,
): Promise<boolean> {
  const outputPath = path.join(process.cwd(), image.outputPath);

  if (fs.existsSync(outputPath)) {
    console.log(`  Skipping ${image.name} (already exists at ${image.outputPath})`);
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
          aspectRatio: image.aspectRatio,
          imageSize: '2K',
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData as string, 'base64');

        // Ensure output directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(outputPath, buffer);
        const sizeMB = (buffer.length / (1024 * 1024)).toFixed(2);
        console.log(`  Saved: ${image.outputPath} (${sizeMB} MB)\n`);
        return true;
      }
    }

    console.error(`  No image returned for ${image.name}\n`);
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
  console.log('  ROSES OS — Generate Missing Images');
  console.log('=========================================================\n');

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Error: GOOGLE_GEMINI_API_KEY not found in environment.');
    console.error('Set it in .env or .env.local');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  // Parse --only flag
  const args = process.argv.slice(2);
  const onlyIdx = args.indexOf('--only');
  const onlyId = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

  const imagesToGenerate = onlyId
    ? IMAGES.filter((img) => img.id === onlyId)
    : IMAGES;

  if (imagesToGenerate.length === 0) {
    console.error(`  No image found with id "${onlyId}".`);
    console.error(`  Available: ${IMAGES.map((m) => m.id).join(', ')}`);
    process.exit(1);
  }

  console.log(`  Generating ${imagesToGenerate.length} image(s)...\n`);

  let success = 0;
  let failed = 0;

  for (const image of imagesToGenerate) {
    const result = await generateImage(ai, image);
    if (result) success++;
    else failed++;

    // Rate limit between API calls
    if (imagesToGenerate.indexOf(image) < imagesToGenerate.length - 1) {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  console.log('\n=========================================================');
  console.log('  SUMMARY');
  console.log('=========================================================');
  console.log(`  Generated: ${success}`);
  console.log(`  Failed:    ${failed}`);
  console.log('=========================================================');

  if (success > 0) {
    console.log('\n  NEXT STEPS:');
    if (imagesToGenerate.some((img) => img.id === 'cutting-cords')) {
      console.log('  - Rebuild Level 3 manual: npx tsx scripts/build-manuals.ts --level 3');
    }
    if (imagesToGenerate.some((img) => img.id === 'sacred-space' || img.id === 'physical-space')) {
      console.log('  - Update teaching-slides.ts to point website slides to new abstract images');
    }
  }
  console.log('');
}

main().catch(console.error);
