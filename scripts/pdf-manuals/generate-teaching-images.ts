/**
 * Generate images for the /teaching page
 * Recreates the blue line-art illustration style from the MDR Visual Support slides
 * Uses Google Gemini 3.1 to generate images matching the original hand-drawn style
 *
 * Usage: npx tsx scripts/pdf-manuals/generate-teaching-images.ts
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

interface TeachingImage {
  id: string;
  name: string;
  prompt: string;
}

const STYLE = `
CRITICAL STYLE REQUIREMENTS — follow these exactly:
- Blue/indigo line-art illustration style, like a refined hand-drawn pen-and-ink drawing done entirely in blue/indigo ink (hex approximately #4A5A9B or similar muted blue-indigo)
- The drawing style should look like a skilled illustrator drew it with blue ink — clean outlines, gentle cross-hatching for shading, slightly hand-drawn quality
- The figure is always a woman with shoulder-length wavy/curly hair, wearing a simple sleeveless top and trousers/pants, with simple shoes
- She sits on a simple wooden chair (visible legs and back) in an upright meditation posture, hands resting on her lap or knees
- The overall aesthetic is gentle, spiritual, instructional — like a meditation teaching manual illustration
- PURE WHITE background (#FFFFFF) — absolutely no background color, texture, or gradient
- NO text, NO words, NO letters, NO numbers, NO labels anywhere in the image
- NO color except blue/indigo line art (unless specifically stated for aura layers)
- Clean, uncluttered composition with generous white space
- The illustration should feel serene, calm, and sacred
- Square aspect ratio (1:1)
`;

const TEACHING_IMAGES: TeachingImage[] = [
  {
    id: 'golden-sun',
    name: 'Golden Sun (Slide 8)',
    prompt: `A blue line-art illustration of a woman sitting upright on a simple chair in meditation posture. She has shoulder-length wavy hair, wears a sleeveless top and pants. A grounding cord (shown as a dashed vertical line) extends straight down from the base of the chair into the ground below. Above and to the upper right of her head, there is a sun symbol — drawn as a circle with jagged/spiky rays emanating outward (like a child's drawing of the sun, but refined). The sun is also drawn in the same blue/indigo line art. The composition has the woman on the right side and the sun in the upper right area. Simple, clean, instructional illustration style. ${STYLE}`,
  },
  {
    id: 'grounding-cord',
    name: 'Grounding Cord (Slide 10)',
    prompt: `A blue line-art illustration of a woman sitting upright on a simple chair in meditation posture, centered in the composition. She has shoulder-length wavy hair, wears a sleeveless top and pants. She is enclosed inside a large egg-shaped or oval aura outline — a single smooth curved line that surrounds her entire body from above her head to below her feet. The aura egg tapers to a point at the bottom. At the very bottom of the egg/aura, there is a spiral pattern (like a flat spiral seen from above) representing where the grounding cord connects to the earth. The spiral has 3-4 concentric rings. Clean blue line art on pure white background. ${STYLE}`,
  },
  {
    id: 'grounding-sun-combined',
    name: 'Grounding Cord + Golden Sun Combined (Slide 11)',
    prompt: `A blue line-art illustration of a woman sitting upright on a simple chair in meditation posture, centered in the composition. She has shoulder-length wavy hair, wears a sleeveless top and pants. She is enclosed inside a large egg-shaped/oval aura outline — a smooth curved line surrounding her entire body. At the bottom of the aura egg, there is a spiral pattern (grounding cord connecting to earth — 3-4 concentric spiral rings). Above the aura egg, centered over her head, there is a sun symbol — a circle with jagged spiky rays emanating outward. The sun floats above the top of the aura egg. The overall composition is vertical — sun at top, aura egg with woman in middle, spiral at bottom. Clean blue line art on pure white background. ${STYLE}`,
  },
  {
    id: 'energy-recovery-rose',
    name: 'Energy Recovery Rose (Slide 17)',
    prompt: `A blue line-art illustration of a woman sitting on a chair in meditation posture, shown in profile/three-quarter view facing right. She has shoulder-length wavy hair. She is enclosed inside an egg-shaped aura outline. At the bottom of the aura, there is a grounding cord spiral. To the right side of the figure, OUTSIDE the aura egg, there is a large hand-drawn rose flower (drawn in the same blue line art style — spiral petals, like a classic rose seen from above). Small arrows or dotted lines point INTO the rose from multiple directions, showing energy being collected/drawn into the rose. The rose is connected to the bottom of the aura by thin lines. The feeling is of energy recovery — the rose collecting scattered energy and returning it. Clean, instructional. ${STYLE}`,
  },
  {
    id: 'discharge-energy',
    name: 'Discharge Excess Energy (Slide 18)',
    prompt: `A blue line-art illustration of a woman who has bent forward from her chair — she is leaning far forward with her upper body hanging down between her knees, her head pointing toward the ground, her hair hanging down, and her arms hanging loosely down toward the floor. She is sitting on a chair but her torso is folded completely forward in a rag-doll position. The chair back is visible behind her. From her hanging hands and head area, dashed lines extend downward into the ground, representing energy being discharged/released downward through the grounding cord. The posture shows physical release and surrender. Clean blue line art illustration on pure white background. ${STYLE}`,
  },
  {
    id: 'aura-layers',
    name: 'Cleansing of Each Aura Layer (Slide 37)',
    prompt: `An illustration showing a woman sitting on a chair in meditation posture, drawn in blue/indigo line art. She is surrounded by 7 horizontal bands/layers of color representing the 7 aura layers. The layers are stacked from bottom to top like horizontal stripes that extend across the width of the image, each layer a different color: 1st layer (closest to body) is pink/salmon, 2nd layer is peach/orange, 3rd layer is soft yellow, 4th layer is soft green, 5th layer is light sky blue, 6th layer is blue-grey/periwinkle, 7th layer (outermost/top) is soft lavender/violet. The woman and her aura egg outline are drawn in blue line art OVER the colored bands. A golden sun symbol (in blue line art) appears above in the upper left. A small rose spiral appears at the bottom near the grounding cord. The aura egg outline is shown with a dashed line. The colored bands are semi-transparent/pastel so the figure is still visible through them. Pure white background outside the colored bands. NO text, NO labels, NO numbers.`,
  },
  {
    id: 'posture',
    name: 'Posture (Slide 6)',
    prompt: `A blue line-art illustration of a woman sitting upright on a simple wooden chair in proper meditation posture. She has shoulder-length wavy/curly hair. She wears a simple sleeveless top and trousers with simple shoes. Her back is straight but relaxed, her hands rest gently on her lap/thighs with palms facing up. Her feet are flat on the floor. Her eyes are gently closed. She is shown in three-quarter view, slightly angled. There is NO aura, NO grounding cord, NO sun — just the woman sitting on the chair in good posture. The illustration is centered in the composition with generous white space around. Simple, clean, instructional. ${STYLE}`,
  },
  {
    id: 'grounding-cord-front',
    name: 'Grounding Cord Front View (Slide 7)',
    prompt: `A blue line-art illustration of a woman sitting upright on a simple chair in meditation posture, shown from the FRONT view (facing the viewer). She has shoulder-length wavy hair, wears a sleeveless top and pants. Her hands rest on her knees. From the base of the chair, between the chair legs, a dashed vertical line extends straight downward — this is the grounding cord going into the earth. The dashed line gets slightly smaller as it goes down, suggesting depth. There is some cross-hatching on the ground/floor area beneath the chair. NO aura egg around her. Just the woman on the chair with the grounding cord going down. Clean, instructional blue line art. ${STYLE}`,
  },
  {
    id: 'cosmos-circuit',
    name: 'Circuit of the Energy of the Cosmos (Slide 13)',
    prompt: `A blue line-art illustration of a woman sitting on a chair in meditation posture, shown in three-quarter view. Above her head, there is a large concentric spiral/vortex pattern (like ripples in water seen from above) — representing cosmic energy. A dashed arrow points DOWN from the center of the spiral into the top of her head (crown). Inside her body, multiple arrows show the flow of energy: arrows going DOWN through the center of the body (the central channel/spine), arrows splitting and flowing OUT through the shoulders and DOWN through the arms to the hands. Additional arrows flow UP along the sides of the torso. Some energy exits as small dotted spray patterns from the hands and around the body. The overall pattern shows a circuit — energy entering from above, flowing down through the center, circulating through the body, and flowing out through the extremities. Dense with directional arrows. Blue line art. ${STYLE}`,
  },
  {
    id: 'the-rose',
    name: 'The Rose (Slide 14)',
    prompt: `A blue line-art illustration of a single rose — a classic rose flower in bloom, viewed from a slight angle, sitting atop a long straight stem. The rose petals are drawn with flowing curved lines showing the spiral nature of the bloom, with several layers of petals visible. The stem is long and straight, running vertically down the center of the composition. At the very bottom of the stem, there is a visible root system — several curved root tendrils spreading outward and downward like a small tree's roots. NO leaves on the stem. The rose is centered in the composition. The drawing style is bold and clear, like a hand-drawn botanical illustration in blue ink. Simple, iconic, sacred. ${STYLE}`,
  },
  {
    id: 'third-eye-chakra',
    name: 'Third Eye Chakra — Ajna (Slide 33)',
    prompt: `A blue line-art illustration showing two elements: On the LEFT side, a rose flower drawn in blue line art (classic rose bloom, slightly open). On the RIGHT side, a full standing human figure (front-facing, anatomical/skeletal style outline) with 7 chakra points marked along the center of the body from base to crown. The 6th chakra point (third eye, between the eyebrows) is highlighted/emphasized — drawn larger or with radiating lines to show it is the focus. Small arrow marks or lines point to the third eye area. The figure has a simple, slightly anatomical quality — like a spiritual anatomy diagram. The overall composition has the rose on the left and the chakra figure on the right. Blue line art on pure white background. NO text, NO words, NO labels. ${STYLE}`,
  },
];

// ---------------------------------------------------------------------------
// IMAGE GENERATION
// ---------------------------------------------------------------------------

async function generateImage(
  ai: GoogleGenAI,
  image: TeachingImage,
  outputDir: string
): Promise<boolean> {
  const filename = `teaching-${image.id}.png`;
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
  console.log('  International Aura and Dream School — Teaching Page Image Generation');
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

  for (const image of TEACHING_IMAGES) {
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
      const image = TEACHING_IMAGES.find((i) => i.id === id);
      if (!image) {
        console.log(`Image "${id}" not found, skipping\n`);
        continue;
      }

      // Delete existing so it regenerates
      const existingPath = path.join(outputDir, `teaching-${id}.png`);
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
