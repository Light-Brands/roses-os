/**
 * Generate images for ROSES Manual Level 3
 * Uses Google Gemini 3.1 to create sacred, branded illustrations
 *
 * Usage: npx tsx scripts/pdf-manuals/generate-manual-l3-images.ts
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
    id: 'cover-l3',
    name: 'Cover — Sacred Rose Level 3',
    prompt: `A luminous rose in full bloom surrounded by three concentric rings of sacred geometry — representing three levels of mastery. The rings progress from warm rose-clay (#9C6F6E) innermost, to blush (#E8C4BF) middle, to rich gold (#9E956B) outer. The rose petals are deeply layered, translucent, glowing with inner wisdom-light. Tiny sacred symbols float within the petals — representing deeper knowledge. The rose feels ancient yet modern, powerful yet gentle. Photorealistic 3D render with mystical depth. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'five-bodies',
    name: 'Five Bodies & Five Levels of Existence',
    prompt: `Five concentric translucent layers surrounding a central luminous human silhouette, each layer representing a body/level of existence. From innermost to outermost: physical (dense, warm rose), emotional (fluid, soft coral), mental (structured, warm gold), energetic (luminous, light rose-clay), spiritual (vast, pure golden light). Each layer is distinct yet connected. Sacred geometry connects all five layers. The feeling is of multidimensional wholeness. Elegant, layered, profound. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'agreements-stick',
    name: 'Breaking Spiritual Agreements',
    prompt: `A luminous vertical stick or rod of crystalline rose-gold light, cracking into three pieces at its center. The stick represents a spiritual agreement — it glows with ancient energy. As it breaks, tiny particles of light are released and a rose below absorbs the fragments. The feeling is of conscious liberation, spiritual sovereignty. Sacred, powerful, deliberate. The act of breaking is gentle yet definitive. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'cutting-cords',
    name: 'Cutting Energetic Cords',
    prompt: `A serene meditation figure silhouette with multiple thin luminous cords extending from the chakra points outward into space. A hand of golden light moves along the spine from the neck downward, cleanly severing each cord. Where the cords are cut, tiny sparks of liberation appear. The severed cords dissolve into light particles. The figure radiates peaceful sovereignty. Freeing, powerful, compassionate. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'energy-cleansing',
    name: 'Post-Intimacy Energy Cleansing',
    prompt: `Two abstract luminous aura silhouettes gently separating from each other, with orange-golden roses positioned between them — absorbing and transmuting the shared energy. Thin energy cords between the two figures are being gently dissolved. A pink rose rises above them both as a blessing. The feeling is of respectful energetic hygiene, honoring, and release. Abstract, tasteful, sacred. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'classes-consultations',
    name: 'Classes & Consultations',
    prompt: `A central meditation figure surrounded by a golden protective dome, with smaller luminous figures seated around them in a semicircle. Golden lines of energy connect the central figure to each person, representing the energetic bonds formed during teaching or consultation. Roses of separation are positioned between each connection. The feeling is of service, energetic integrity, and professional spiritual practice. Clean, modern, sacred. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'analyzer',
    name: 'The Analyzer',
    prompt: `An elegant cross-section view of a translucent human head showing the Analyzer as a geometric crystalline structure inside the center of the skull — like a sacred prism or multifaceted gem. The structure glows with multiple chakra colors (red through violet) as it's being cleansed. A small golden sticky rose spirals through it, purifying each facet. Below it, the sacred space glows warmly. Above it at the back, two small channels are visible. Precise, anatomical-sacred. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'transmedium-channels',
    name: 'Transmedium Channels',
    prompt: `A side-profile view of a translucent head and upper neck, showing two luminous channel openings at the back of the neck, glowing in multiple chakra colors as they're being cleansed. Two golden sticky roses are entering the channels, spiraling and purifying them. The channels emit soft light as they're being sealed closed. The feeling is of energetic sovereignty and protection from external influences. Sacred, anatomical, warm. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'creating-reality',
    name: 'Creating Reality & Impeccability',
    prompt: `A vertical alignment of five luminous elements representing the levels of impeccable creation, from top to bottom: a crown/star of intention, an eye of vision/thought, a throat-shape of word, a heart of feeling, and hands of action. All five are connected by a single golden thread of alignment running through their centers. When all five align, the golden thread blazes with unified power. The feeling is of integrated will and conscious creation. Sacred, geometric, powerful. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'mockup',
    name: 'Mock-up Manifestation Technique',
    prompt: `Three roses arranged in a triangular composition: a central large rose containing a glowing vision/image within it (representing the desire), a second rose to the right absorbing dark wisps (clearing obstacles), and a third pink rose radiating love energy that wraps around the first rose in a warm pink glow. The central rose is beginning to lift off, its roots cut, ascending toward a point of golden celestial light above. Manifestation, love, surrender. Pure white background. ${BRAND_STYLE}`,
  },
  {
    id: 'elements-summary-l3',
    name: 'Complete Elements Overview — Level 3',
    prompt: `A comprehensive mandala of all Level 3 meditation elements: at the center, a luminous rose. Surrounding it in concentric rings: the five bodies, agreement sticks, energetic cords, the analyzer prism, transmedium channels, a mock-up rose ascending, and protective golden boundaries. All rendered in the warm rose-clay and gold palette, connected by delicate sacred geometry. A complete visual map of the advanced practice. Intricate, beautiful, sacred. Pure white background. ${BRAND_STYLE}`,
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
  const filename = `manual-l3-${image.id}.png`;
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
  console.log('  International Aura School — Manual Image Generation (Level 3)');
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

main().catch(console.error);
