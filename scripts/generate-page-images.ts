/**
 * Page Accent Image Generation Script
 * Generates subtle, decorative abstract images for each ROSES OS page
 * These are complimentary details, small flourishes that make the site shine
 * Uses Google Gemini for prompt generation + image generation
 *
 * Pages: Home, The Rose, The Codex, Programs, Guardians, Community, Contact
 *
 * Usage: npx tsx scripts/generate-page-images.ts
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
// PAGE DEFINITIONS
// ---------------------------------------------------------------------------

interface PageConfig {
  slug: string;
  title: string;
  theme: string;
  keywords: string[];
}

const PAGES: PageConfig[] = [
  {
    slug: 'home',
    title: 'A Seamless Path to Inner Freedom',
    theme:
      'Consciousness and remembrance ecosystem. A living architecture for coherent living. The journey home to yourself. A 3D rose already exists on this page so the image should complement it, not duplicate it.',
    keywords: [
      'inner freedom',
      'coherence',
      'remembrance',
      'path',
      'awakening',
      'breath',
    ],
  },
  {
    slug: 'the-rose',
    title: 'The Intelligence of Silence',
    theme:
      'The Rose is a technology of remembrance, a living practice rooted in breath, somatic awareness, and inner coherence. It reconnects you with the intelligence already present within your body. It unfolds across three levels.',
    keywords: [
      'silence',
      'breath',
      'somatic',
      'petals unfolding',
      'inner intelligence',
      'stillness',
    ],
  },
  {
    slug: 'the-codex',
    title: 'A Living Document of Coherent Being',
    theme:
      'The philosophical container of ROSES OS encompassing a map of the territory, 13 domains of coherence, four architectural layers, and eleven capacities. A living document of lineage and sacred geometry.',
    keywords: [
      'sacred geometry',
      'codex',
      'map',
      'architecture',
      'domains',
      'lineage',
      'layers',
    ],
  },
  {
    slug: 'programs',
    title: 'Current Offerings',
    theme:
      'Guided pathways into the Rose field. Programs, schedules, contribution tiers. Structured learning and practice. Enrollment and devotion.',
    keywords: [
      'pathway',
      'offerings',
      'structure',
      'devotion',
      'guided',
      'unfolding steps',
    ],
  },
  {
    slug: 'guardians',
    title: 'The Keepers of the Rose Field',
    theme:
      'Devoted practitioners and stewards of the Rose technology. Holding space, guiding practice, nurturing community with presence and care. Four guardian figures.',
    keywords: [
      'guardians',
      'keepers',
      'stewards',
      'holding space',
      'presence',
      'protection',
    ],
  },
  {
    slug: 'community',
    title: 'The Living Field',
    theme:
      'A network of practitioners devoted to coherent living. Not a membership club but a living field. Coherence is contagious. Four layers of the living system.',
    keywords: [
      'field',
      'network',
      'connection',
      'practitioners',
      'ripple',
      'togetherness',
    ],
  },
  {
    slug: 'contact',
    title: 'Reach Out',
    theme:
      'Connection and communication. Warm invitation to get in touch. A doorway, a bridge between the seeker and the community.',
    keywords: [
      'connection',
      'bridge',
      'doorway',
      'invitation',
      'warmth',
      'reaching',
    ],
  },
];

// ---------------------------------------------------------------------------
// BRAND PALETTE (for prompts)
// ---------------------------------------------------------------------------

const BRAND_PALETTE = `
COLOR PALETTE (ROSES OS brand — use these as accent tones on a white background):
- Rose Clay: #9C6F6E (primary brand rose — muted, earthy)
- Rose 400: #D4A09A (lighter warm rose)
- Rose 300: #E8C4BF (pale blush)
- Rose 200: #F5E1DD (very soft petal)
- Gold: #9E956B (antique olive brass accent — use sparingly)
- Dark accent: #3B2828 (deep rose-brown, for subtle contrast)
- Background: pure white or very faint warm cream (#FAFAFA or #FFFFFF)
`;

// ---------------------------------------------------------------------------
// PROMPT GENERATION
// ---------------------------------------------------------------------------

interface GeneratedPrompt {
  id: number;
  page: string;
  description: string;
  prompt: string;
}

const PROMPT_GENERATOR_INSTRUCTION = `You are an art director for ROSES OS — a consciousness and remembrance ecosystem. The brand is sacred, warm, elevated, and deeply meaningful. Every visual must MEAN something.

I need 7 image prompts — one per page. Each image must FULLY REPRESENT the meaning and essence of that page. These images will sit on the page as complimentary visuals that reinforce the message of the writing.

HARD RULES:
1. PERFECTLY PURE white background (#FFFFFF) — the image must blend seamlessly with a white webpage. NO shadows on the background, NO gradients, NO grey tones, NO vignetting, NO ambient occlusion. The background must be flat uniform white from edge to edge.
2. NO text, NO words, NO letters, NO numbers
3. NO human faces or photographic portraits
4. Beautiful, polished, editorial-quality illustration or 3D render
5. The subject should be clear and recognizable — not too abstract to understand
6. Use the brand rose palette for color tones
7. NO drop shadows, NO cast shadows, NO floor shadows — the subject floats on pure white with no shadow of any kind

${BRAND_PALETTE}

STYLE:
- Elegant 3D renders, botanical illustration, or refined digital art on white
- Think Apple product page aesthetics meets sacred/spiritual symbolism
- Objects should feel real, tactile, and dimensional — but with NO shadows whatsoever
- Clean, beautiful, with enough detail to be visually rich but never cluttered
- PURE WHITE background (#FFFFFF) everywhere — no gradients, no shadows, no grey areas, no vignetting, no ambient occlusion, no floor/surface shadows. The background must be completely, uniformly white from edge to edge.

Here are the 7 pages with the ACTUAL COPY from the site. Use this writing to deeply inform what each image should depict:

1. PAGE: "home" — "A Seamless Path to Inner Freedom"
   COPY: "A Consciousness & Remembrance Ecosystem. Technologies of remembrance for those ready to live in coherence. What if the intelligence you seek is already within you, waiting to be remembered? ROSES OS is a living architecture of technologies, practices, and community for coherent living. Not a course. Not a cure. A way home."
   VISUAL IDEA: A beautiful, luminous rose in full bloom — the central symbol of the brand. Sacred, alive, glowing with warmth.

2. PAGE: "the-rose" — "The Intelligence of Silence"
   COPY: "The Rose is a technology of remembrance — a living practice that reconnects you with the intelligence already present within your body, your breath, and your being. It is not something to learn. It is something to remember. The next revolution is not technological — it is a revolution of inner coherence. A return to the body."
   VISUAL IDEA: Something representing breath, body, and inner stillness — perhaps an abstract human silhouette made of petals, or a rose unfolding from within a body-like form.

3. PAGE: "the-codex" — "A Living Document of Coherent Being"
   COPY: "The Codex is the philosophical container of ROSES OS — a map of the territory. Coherence is the state in which all dimensions of being — body, heart, mind, and soul — move as one integrated field. 13 Domains of Coherence. Four Layers of the Architecture. Eleven Capacities."
   VISUAL IDEA: Sacred geometry, a mandala-like structure, interconnected layers or a flower of life pattern — representing structure, domains, architecture.

4. PAGE: "programs" — "Current Offerings"
   COPY: "Guided pathways into the Rose field — each program is a living invitation to deepen your practice. Income-based contribution model. We believe this work should be accessible to everyone who is called."
   VISUAL IDEA: A pathway or stepping stones, an unfolding spiral path, or rose petals arranged as a journey/progression.

5. PAGE: "guardians" — "The Keepers of the Rose Field"
   COPY: "The Guardians are devoted practitioners and stewards of the Rose technology. Each one brings a unique gift to the field — holding space, guiding practice, and nurturing the community with presence and care."
   VISUAL IDEA: Protective, nurturing imagery — hands cupping a rose, a shield made of petals, or guardian-like figures formed from botanical elements.

6. PAGE: "community" — "The Living Field"
   COPY: "A network of practitioners devoted to coherent living. Not a membership club — a living field. Coherence is contagious — when one person remembers, it ripples through the field and touches everyone around them. The journey home is supported, not solitary."
   VISUAL IDEA: Multiple roses or organic forms connected by threads of light, a field of flowers, interconnected circles rippling outward.

7. PAGE: "contact" — "Reach Out"
   COPY: "We welcome your questions and inquiries. Whether you are exploring, seeking clarity, or simply feel called to connect — we are here."
   VISUAL IDEA: An open hand, a bridge, a door ajar with warm light, or two forms reaching toward each other — representing connection and welcome.

Return ONLY a JSON array of 7 objects:
[
  {
    "id": 1,
    "page": "home",
    "description": "Brief 1-line description of the visual concept",
    "prompt": "Detailed image generation prompt — be VERY specific about the subject, composition, lighting, colors, materials, style. The image must clearly represent the page's meaning."
  },
  ...
]

Do not include any preamble or explanation, just the JSON array.`;

async function generatePrompts(
  ai: GoogleGenAI
): Promise<GeneratedPrompt[]> {
  console.log('Generating image prompts using Gemini Flash...\n');

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: PROMPT_GENERATOR_INSTRUCTION,
    config: {
      temperature: 0.9,
      topP: 0.95,
    },
  });

  const text = response.text;
  console.log('Raw response from Gemini:\n');
  console.log(text);
  console.log('\n');

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('No JSON array found in response');
  }

  const prompts: GeneratedPrompt[] = JSON.parse(jsonMatch[0]);
  console.log(`Generated ${prompts.length} image prompts\n`);
  return prompts;
}

// ---------------------------------------------------------------------------
// IMAGE GENERATION
// ---------------------------------------------------------------------------

function enhancePrompt(basePrompt: string, pageSlug?: string): string {
  const whiteBgExtra =
    pageSlug === 'the-rose'
      ? `\n- FOR THIS IMAGE ONLY: The background MUST be 100% pure white #FFFFFF — no cream, no grey, no warm tint, no gradient, no shadow. Every background pixel must be exactly #FFFFFF. If the model tends to add any non-white tone, override it: use only pure white for the background.\n`
      : '';
  return `${basePrompt}
${whiteBgExtra}
COMPOSITION REQUIREMENTS:
- Square aspect ratio (1:1)
- CRITICAL: The background MUST be perfectly pure white (#FFFFFF) with ZERO variation. No shadows, no gradients, no grey tones, no vignetting, no ambient occlusion, no drop shadows, no floor shadows, no reflected light on the background. The background must be completely uniform flat white from edge to edge, corner to corner.
- The subject should be centered or elegantly composed, clearly visible and recognizable
- Flat, even lighting — no directional shadows cast onto the background
- Color palette: muted rose tones (#9C6F6E rose-clay, #D4A09A warm rose, #E8C4BF blush, #F5E1DD petal pink), touches of gold (#9E956B)
- Style: photorealistic 3D render or high-end botanical illustration — polished, editorial, Apple-level quality
- The image should look like it belongs on a pure white webpage where the edges of the image are completely invisible
- NO text, NO letters, NO words, NO numbers in the image
- NO busy backgrounds, NO gradients, NO shadows of any kind on the background — PERFECTLY FLAT PURE WHITE (#FFFFFF) ONLY
- Think: product photography on an infinity white backdrop where background is clipped to pure white in post-production`;
}

async function generateImage(
  ai: GoogleGenAI,
  prompt: GeneratedPrompt,
  outputDir: string
): Promise<boolean> {
  const filename = `page-${prompt.page}.png`;
  const outputPath = path.join(outputDir, filename);

  if (fs.existsSync(outputPath)) {
    console.log(`Skipping ${filename} (already exists)`);
    return true;
  }

  console.log(`Generating ${filename}...`);
  console.log(`  Page: ${prompt.page}`);
  console.log(`  Concept: ${prompt.description}\n`);

  try {
    const enhancedPrompt = enhancePrompt(prompt.prompt, prompt.page);

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: enhancedPrompt,
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
        console.log(`Saved ${filename}\n`);
        return true;
      }
    }

    console.error(`No image returned for ${filename}\n`);
    return false;
  } catch (error: any) {
    console.error(
      `Error generating ${filename}:`,
      error.message || error,
      '\n'
    );
    return false;
  }
}

// ---------------------------------------------------------------------------
// SAVE HELPERS
// ---------------------------------------------------------------------------

function savePromptsToFile(
  prompts: GeneratedPrompt[],
  outputDir: string,
  filename: string
) {
  const jsonPath = path.join(outputDir, filename);
  fs.writeFileSync(jsonPath, JSON.stringify(prompts, null, 2));
  console.log(`Saved prompts to ${filename}\n`);
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

async function main() {
  console.log('=========================================================');
  console.log('  ROSES OS — Page Image Generation');
  console.log('  Gemini Flash (prompts) + Gemini Pro Image (images)');
  console.log('=========================================================\n');

  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Error: GOOGLE_GEMINI_API_KEY not found in environment.');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  const outputDir = path.join(process.cwd(), 'public', 'page-images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // STEP 1: Generate prompts
  console.log('STEP 1: Generate Image Prompts (7 pages)');
  console.log('---------------------------------------------------------\n');

  const prompts = await generatePrompts(ai);
  savePromptsToFile(prompts, outputDir, 'prompts.json');

  // STEP 2: Generate images
  console.log('STEP 2: Generate Images');
  console.log('---------------------------------------------------------\n');

  let success = 0;
  let failed = 0;

  for (const prompt of prompts) {
    const result = await generateImage(ai, prompt, outputDir);
    if (result) success++;
    else failed++;

    // Rate limiting
    await new Promise((r) => setTimeout(r, 3000));
  }

  // Summary
  console.log('\n=========================================================');
  console.log('  SUMMARY');
  console.log('=========================================================');
  console.log(`  Generated: ${success}`);
  console.log(`  Failed:    ${failed}`);
  console.log(`  Output:    ${outputDir}`);
  console.log('=========================================================');
  console.log('\nGenerated files:');
  PAGES.forEach((p) => console.log(`  public/page-images/page-${p.slug}.png`));
  console.log('\n');
}

// ---------------------------------------------------------------------------
// REGENERATE SPECIFIC PAGES
// ---------------------------------------------------------------------------

if (process.argv.includes('--pages')) {
  const pagesIndex = process.argv.indexOf('--pages');
  const pageSlugs =
    process.argv[pagesIndex + 1]?.split(',').map((s) => s.trim()) || [];

  if (pageSlugs.length === 0) {
    console.error('Please specify page slugs: --pages home,the-rose,contact');
    process.exit(1);
  }

  (async () => {
    loadEnvFile();
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Error: GOOGLE_GEMINI_API_KEY not found');
      process.exit(1);
    }

    const ai = new GoogleGenAI({ apiKey });
    const outputDir = path.join(process.cwd(), 'public', 'page-images');
    const promptsPath = path.join(outputDir, 'prompts.json');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Check if we have existing prompts
    let prompts: GeneratedPrompt[];
    if (fs.existsSync(promptsPath)) {
      prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));
      console.log('Loaded existing prompts\n');
    } else {
      console.log('No existing prompts found, generating new ones...\n');
      prompts = await generatePrompts(ai);
      savePromptsToFile(prompts, outputDir, 'prompts.json');
    }

    console.log(`Regenerating images for: ${pageSlugs.join(', ')}\n`);

    for (const slug of pageSlugs) {
      const prompt = prompts.find((p) => p.page === slug);
      if (!prompt) {
        console.log(`Page "${slug}" not found in prompts, skipping\n`);
        continue;
      }

      // Delete existing file so it gets regenerated
      const existingPath = path.join(outputDir, `page-${slug}.png`);
      if (fs.existsSync(existingPath)) {
        fs.unlinkSync(existingPath);
      }

      await generateImage(ai, prompt, outputDir);
      await new Promise((r) => setTimeout(r, 3000));
    }

    console.log('\nDone!');
  })();
} else {
  main().catch(console.error);
}
