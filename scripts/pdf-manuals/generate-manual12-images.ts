/**
 * Generate images for Rose Meditation Levels 1 & 2 Manual
 * Uses Google Gemini to create sacred, branded illustrations
 *
 * Usage: npx tsx scripts/pdf-manuals/generate-manual12-images.ts
 */

import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

function loadEnvFile() {
  const envPaths = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '.env.local'),
  ];
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          if (key && value && !process.env[key]) process.env[key] = value;
        }
      }
      console.log(`Loaded environment from: ${envPath}\n`);
      return;
    }
  }
}

loadEnvFile();

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
- Square aspect ratio (1:1)
`;

interface ManualImage {
  id: string;
  name: string;
  prompt: string;
}

const MANUAL_IMAGES: ManualImage[] = [
  {
    id: 'cover-12',
    name: 'Cover — Levels 1 & 2 Rose',
    prompt: `A pair of luminous roses in full bloom, one slightly higher than the other suggesting progression and levels. Rendered in sacred geometric style with translucent petals in warm rose-clay tones (#9C6F6E, #D4A09A). Subtle golden light (#9E956B) radiates from the center. Sacred geometry patterns (flower of life) faintly visible within. The roses float on pure white, connected by a delicate thread of golden light — symbolizing the journey from Level 1 to Level 2. ${BRAND_STYLE}`,
  },
  {
    id: 'sacred-space',
    name: 'Sacred Space — Center of Head',
    prompt: `An ethereal illustration of a luminous sacred chamber inside a translucent human head silhouette. The chamber glows with warm rose and gold light, like a small temple within. Sacred geometry patterns form the walls. A single point of bright golden light sits at the center — the seat of spiritual awareness. The head silhouette is minimal and abstract, rendered in soft rose-clay lines. Feeling of safety, clarity, and inner authority. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'room-protection',
    name: 'Room Protection — Golden Grid',
    prompt: `A beautiful 3D illustration of a room viewed from above, with golden energy lines connecting all eight corners (four top, four bottom) through a central vertical axis. Four golden roses sit at the cardinal points of the room's perimeter. The entire space glows with warm golden light. A transparent grounding cord descends from the floor's center point. The room feels sacred, protected, clean — like a golden temple. Architectural sacred geometry. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'chakra-cleansing',
    name: 'Chakra Cleansing',
    prompt: `A vertical arrangement of seven glowing chakra points along a central luminous spine, from root (red) to crown (violet). At each chakra level, pairs of small roses face the chakra from front and back, drawing out dark wisps of energy that transform into light. The colors follow traditional chakra order: red, orange, yellow, green/pink, sky blue, indigo, violet. The overall composition is vertical, elegant, and sacred. Warm gold undertones throughout. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'golden-sticky-roses',
    name: 'Golden Sticky Roses',
    prompt: `Four luminous golden roses shown in a vertical sequence, each illustrating a different path through a translucent human body silhouette: the first descends straight down through all chakras, the second splits at the throat into two paths through the arms, the third splits at the root into two paths through the legs, and the fourth is large encompassing the entire aura width. All rendered in warm gold (#9E956B) with rose accents. Sacred, cleansing energy. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'elements-12',
    name: 'Elements Overview L1+L2',
    prompt: `A beautiful mandala-like sacred geometry arrangement containing all meditation elements for Levels 1 and 2: at the center a radiant rose, surrounded by concentric rings with: grounding cord, golden sun, four protective roses, earth-cosmos energy circuit, a sacred space temple, a golden room grid, seven chakra points, and four golden sticky roses. All in warm rose-clay and gold brand palette, connected by delicate geometric lines. A complete visual map. Pure white background. ${BRAND_STYLE}`,
  },
];

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
      model: 'gemini-3-pro-image-preview',
      contents: image.prompt,
      config: {
        responseModalities: ['IMAGE'],
        // @ts-ignore
        imageConfig: { aspectRatio: '1:1', imageSize: '2K' },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData.data as string, 'base64');
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

async function main() {
  console.log('=========================================================');
  console.log('  International Aura School — Manual Image Generation (Levels 1 & 2)');
  console.log('=========================================================\n');

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) { console.error('Error: GOOGLE_GEMINI_API_KEY not found.'); process.exit(1); }

  const ai = new GoogleGenAI({ apiKey });
  const outputDir = path.join(process.cwd(), 'scripts', 'pdf-manuals', 'images');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  let success = 0, failed = 0;
  for (const image of MANUAL_IMAGES) {
    const result = await generateImage(ai, image, outputDir);
    if (result) success++; else failed++;
    await new Promise((r) => setTimeout(r, 3000));
  }

  console.log(`\n  Generated: ${success} | Failed: ${failed} | Output: ${outputDir}\n`);
}

main().catch(console.error);
