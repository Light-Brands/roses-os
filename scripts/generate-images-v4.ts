/**
 * Ad Creative Image Generation Script v4 - TEST VERSION
 * Uses Google Gemini Flash for prompt generation + Gemini Pro Image for backgrounds
 * 
 * WORKFLOW:
 * 1. Generate prompt variations using Gemini API
 * 2. Generate background images (NO TEXT)
 * 3. Add text overlays in Canva
 * 
 * Usage: npx tsx scripts/generate-images-v4.ts
 */

import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

// Load .env file
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
      console.log(`📄 Loaded environment from: ${envPath}\n`);
      return true;
    }
  }
  return false;
}

loadEnvFile();

// ICP and Offer Configuration (from proven SOP)
const ICP_CONFIG = {
  niche: "Website Development agencies at least $50K/month",
  offer: `WE INSTALL AI OS FOR
WEBSITE DEVELOPMENT AGENCIES

ADD $100K IN PROFIT
& SAVE 100 HOURS / WEEK
IN THE NEXT 30 DAYS

OR YOU DON'T PAY`,
  topDesires: [
    "Keep revenue high without hiring more people",
    "Recover margins",
    "Massive time savings",
    "Speed to impact",
    "Zero downside / risk-free"
  ],
  deliverables: "Installing an AI Operating System into their agency"
};

// Generate 10 prompts (using proven SOP structure - WITH TEXT)
const PROMPT_GENERATOR_INSTRUCTION = `I'm working on ads targeting website development agencies in the USA.

GOAL:
Create 10 scroll-stopping, high-converting IMAGE AD prompts WITH TEXT INCLUDED.

TARGET AUDIENCE:
- Website development agencies
- Minimum $50K/month in revenue

OFFER (THIS MUST APPEAR IN EVERY IMAGE):
${ICP_CONFIG.offer}

TOP DESIRES TO CONVEY:
- ${ICP_CONFIG.topDesires.join('\n- ')}

DELIVERABLE:
- ${ICP_CONFIG.deliverables}

PROMPT TYPES (CREATE EXACTLY 10 TOTAL):
- 2 cartoonish visual styles (transformation/before-after themes)
- 2 agency owners working on laptops (stressed vs successful split-screen)
- 2 completely outside-the-box concepts (metaphorical/surreal)
- 2 people holding a banner with the offer:
   • One in Times Square, New York
   • One while paragliding
- 2 text-only creatives with attention-grabbing backgrounds that resonate with agency owners (tech/code themes)

IMAGE RULES:
- Aspect ratio must be 1:1 (1080x1080)
- Text must fit entirely inside the image
- Every prompt MUST include the offer text exactly as written above
- Use dark navy (#0A0E27) as base color with cyan (#00FFFF) and electric blue (#1E88E5) accents
- Backgrounds should be dramatic but not cluttered

TEXT LAYER INSTRUCTIONS (MUST BE INCLUDED IN EVERY PROMPT):
1. All text must be treated as fixed graphic overlays — do not spell-check, autocorrect, reflow, paraphrase, or translate.
2. Import each character exactly as written; capitalization, punctuation, and line breaks must match 1:1.
3. Render all text as flat vector shapes — not editable layers — to prevent spelling mistakes.
4. If text is too large, auto-scale proportionally inside the safe zone — never crop, wrap, or distort.
5. Apply a bold white outline (stroke) around all text to ensure readability against the illustrated background.
6. All text must fit fully inside the 1:1 square ratio (1080×1080) with no cropping.

Return ONLY a JSON array of 10 objects with this structure:
[
  {
    "id": 1,
    "category": "cartoonish",
    "description": "Brief description of the visual concept",
    "prompt": "Detailed image generation prompt with composition, colors, style, AND the offer text rendered exactly as: '${ICP_CONFIG.offer}' - text should be positioned prominently, use bold white outline for readability"
  },
  {
    "id": 2,
    "category": "cartoonish",
    "description": "Brief description of the visual concept",
    "prompt": "Detailed image generation prompt with composition, colors, style, AND the offer text rendered exactly as: '${ICP_CONFIG.offer}' - text should be positioned prominently, use bold white outline for readability"
  },
  {
    "id": 3,
    "category": "laptop",
    "description": "Brief description of the visual concept",
    "prompt": "Detailed image generation prompt with composition, colors, style, AND the offer text rendered exactly as: '${ICP_CONFIG.offer}' - text should be positioned prominently, use bold white outline for readability"
  },
  {
    "id": 4,
    "category": "laptop",
    "description": "Brief description of the visual concept",
    "prompt": "Detailed image generation prompt with composition, colors, style, AND the offer text rendered exactly as: '${ICP_CONFIG.offer}' - text should be positioned prominently, use bold white outline for readability"
  },
  {
    "id": 5,
    "category": "outside-box",
    "description": "Brief description of the visual concept",
    "prompt": "Detailed image generation prompt with composition, colors, style, AND the offer text rendered exactly as: '${ICP_CONFIG.offer}' - text should be positioned prominently, use bold white outline for readability"
  },
  {
    "id": 6,
    "category": "outside-box",
    "description": "Brief description of the visual concept",
    "prompt": "Detailed image generation prompt with composition, colors, style, AND the offer text rendered exactly as: '${ICP_CONFIG.offer}' - text should be positioned prominently, use bold white outline for readability"
  },
  {
    "id": 7,
    "category": "banner-times-square",
    "description": "Brief description of the visual concept",
    "prompt": "Detailed image generation prompt with composition, colors, style, AND the offer text rendered exactly as: '${ICP_CONFIG.offer}' - text should be positioned prominently, use bold white outline for readability"
  },
  {
    "id": 8,
    "category": "banner-paragliding",
    "description": "Brief description of the visual concept",
    "prompt": "Detailed image generation prompt with composition, colors, style, AND the offer text rendered exactly as: '${ICP_CONFIG.offer}' - text should be positioned prominently, use bold white outline for readability"
  },
  {
    "id": 9,
    "category": "text-background",
    "description": "Brief description of the visual concept",
    "prompt": "Detailed image generation prompt with composition, colors, style, AND the offer text rendered exactly as: '${ICP_CONFIG.offer}' - text should be positioned prominently, use bold white outline for readability"
  },
  {
    "id": 10,
    "category": "text-background",
    "description": "Brief description of the visual concept",
    "prompt": "Detailed image generation prompt with composition, colors, style, AND the offer text rendered exactly as: '${ICP_CONFIG.offer}' - text should be positioned prominently, use bold white outline for readability"
  }
]

Do not include any preamble or explanation, just the JSON array.`;

interface GeneratedPrompt {
  id: number;
  category: string;
  description: string;
  prompt: string;
}

// Text overlay configuration for Canva (matching proven SOP format)
const TEXT_OVERLAYS = {
  main: {
    text: `WE INSTALL AI OS FOR
WEBSITE DEVELOPMENT AGENCIES

ADD $100K IN PROFIT
& SAVE 100 HOURS / WEEK
IN THE NEXT 30 DAYS

OR YOU DON'T PAY`,
    style: "Bold sans-serif, white text with bold white outline (stroke) around all text, auto-scale proportionally to fit safe zone"
  },
  instructions: {
    rules: [
      "All text must be treated as fixed graphic overlays — do not spell-check, autocorrect, reflow, paraphrase, or translate",
      "Import each character exactly as written; capitalization, punctuation, and line breaks must match 1:1",
      "Render all text as flat vector shapes — not editable layers — to prevent spelling mistakes",
      "If text is too large, auto-scale proportionally inside the safe zone — never crop, wrap, or distort",
      "Apply a bold white outline (stroke) around all text to ensure readability against the background",
      "All text must fit fully inside the 1:1 square ratio (1080×1080) with no cropping"
    ]
  }
};

// Generate prompts using Gemini text model
async function generatePrompts(ai: GoogleGenAI): Promise<GeneratedPrompt[]> {
  console.log('🤖 Generating creative prompts using Gemini Flash...\n');
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: PROMPT_GENERATOR_INSTRUCTION,
      config: {
        temperature: 0.9,
        topP: 0.95
      }
    });
    
    const text = response.text;
    console.log('📝 Raw response from Gemini:\n');
    console.log(text);
    console.log('\n');
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in response');
    }
    
    const prompts: GeneratedPrompt[] = JSON.parse(jsonMatch[0]);
    console.log(`✅ Generated ${prompts.length} creative prompts\n`);
    
    return prompts;
    
  } catch (error: any) {
    console.error('❌ Error generating prompts:', error.message);
    throw error;
  }
}

// Enhanced prompt with composition rules (incorporating SOP text layer principles - WITH TEXT)
function enhancePrompt(basePrompt: string): string {
  return `${basePrompt}

COMPOSITION REQUIREMENTS:
- 1:1 square aspect ratio (1080x1080)
- Main visual action should be centered, with text prominently displayed
- Use dark navy (#0A0E27) as base color
- Accent colors: cyan (#00FFFF) and electric blue (#1E88E5)
- Professional advertising quality, scroll-stopping visual impact

TEXT RENDERING REQUIREMENTS (CRITICAL - FROM SOP):
1. All text must be treated as fixed graphic overlays — do not spell-check, autocorrect, reflow, paraphrase, or translate
2. Import each character exactly as written; capitalization, punctuation, and line breaks must match 1:1
3. Render all text as flat vector shapes — not editable layers — to prevent spelling mistakes
4. If text is too large, auto-scale proportionally inside the safe zone — never crop, wrap, or distort
5. Apply a bold white outline (stroke) around all text to ensure readability against the background
6. All text must fit fully inside the 1:1 square ratio (1080×1080) with no cropping
7. Text should be prominently positioned and highly legible
8. Use bold sans-serif font style for maximum readability

CRITICAL: The offer text "${ICP_CONFIG.offer}" MUST be rendered exactly as written, with bold white outline for maximum contrast and readability.`;
}

// Generate image using Gemini Image
async function generateImage(
  ai: GoogleGenAI,
  prompt: GeneratedPrompt,
  outputDir: string,
  index: number
): Promise<boolean> {
  const filename = `test-ad-bg-${String(index).padStart(2, '0')}-${prompt.category}.png`;
  const outputPath = path.join(outputDir, filename);
  
  if (fs.existsSync(outputPath)) {
    console.log(`⏭️  Skipping ${filename} (already exists)`);
    return true;
  }
  
  console.log(`🎨 Generating ${filename}...`);
  console.log(`   Category: ${prompt.category}`);
  console.log(`   Concept: ${prompt.description}\n`);
  
  try {
    const enhancedPrompt = enhancePrompt(prompt.prompt);
    
    console.log('📝 Enhanced prompt:\n');
    console.log(enhancedPrompt);
    console.log('\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: enhancedPrompt,
      config: {
        responseModalities: ['IMAGE'],
        // @ts-ignore
        imageConfig: {
          aspectRatio: '1:1',
          imageSize: '2K',
        }
      }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData as string, 'base64');
        fs.writeFileSync(outputPath, buffer);
        console.log(`✅ Saved ${filename}\n`);
        return true;
      }
    }
    
    console.error(`❌ No image returned for ${filename}\n`);
    return false;
    
  } catch (error: any) {
    console.error(`❌ Error generating ${filename}:`, error.message || error, '\n');
    return false;
  }
}

// Save prompts to JSON file
function savePromptsToFile(prompts: GeneratedPrompt[], outputDir: string, filename: string) {
  const jsonPath = path.join(outputDir, filename);
  fs.writeFileSync(jsonPath, JSON.stringify(prompts, null, 2));
  console.log(`💾 Saved prompts to ${filename}\n`);
}

// Generate instructions (text is now baked into images)
function generateCanvaInstructions(outputDir: string) {
  const instructions = `
═══════════════════════════════════════════════════════════════
  IMAGE GENERATION COMPLETE
  (Text is baked into images - no Canva needed!)
═══════════════════════════════════════════════════════════════

✅ All images have been generated WITH TEXT INCLUDED

The offer text "${ICP_CONFIG.offer}" is already rendered in each image with:
- Bold white outline for maximum readability
- Exact character matching (no spell-check or autocorrect)
- Proper positioning and scaling
- Full fit within 1080×1080 square

NEXT STEPS:
1. Review generated images in this folder
2. Check text readability and positioning
3. Export as PNG (1080x1080) - images are ready to use!

═══════════════════════════════════════════════════════════════
  SCALING PROCESS (After Testing)
═══════════════════════════════════════════════════════════════

Once you identify winning images:

1. Take one winning image
2. Use the --variations flag with this script
3. Generate 20 NEW variations in the same style (with text)
4. Repeat for 3-5 winning styles
5. Result: 60-100 proven image ads

Example command:
  npx tsx scripts/generate-images-v4.ts --variations 1,5,8

═══════════════════════════════════════════════════════════════
`;

  const instructionsPath = path.join(outputDir, 'INSTRUCTIONS.txt');
  fs.writeFileSync(instructionsPath, instructions);
  console.log('📝 Generated instructions\n');
}

// Main
async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  🌟 TEST - Ad Creative Generation v4');
  console.log('  🤖 Gemini Flash (prompts) + Gemini Pro Image (backgrounds)');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: GOOGLE_GEMINI_API_KEY not found in environment.');
    process.exit(1);
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  const outputDir = path.join(process.cwd(), 'ad-images', 'test-v4');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log('📍 STEP 1: Generate Creative Prompts (10 prompts)');
  console.log('───────────────────────────────────────────────────────────────\n');
  
  const prompts = await generatePrompts(ai);
  savePromptsToFile(prompts, outputDir, 'test-prompts.json');
  
  console.log('📍 STEP 2: Generate Background Images');
  console.log('───────────────────────────────────────────────────────────────\n');
  
  let success = 0, failed = 0;
  
  for (let i = 0; i < prompts.length; i++) {
    const result = await generateImage(ai, prompts[i], outputDir, i + 1);
    if (result) success++;
    else failed++;
    
    // Rate limiting
    await new Promise(r => setTimeout(r, 3000));
  }
  
  console.log('📍 STEP 3: Generate Canva Instructions');
  console.log('───────────────────────────────────────────────────────────────\n');
  
  generateCanvaInstructions(outputDir);
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  📊 TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  ✅ Generated: ${success}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('\n📍 NEXT STEPS:');
  console.log('  1. Review test images in ad-images/test-v4/');
  console.log('  2. Check that backgrounds have clear text zones');
  console.log('  3. Open CANVA_INSTRUCTIONS.txt');
  console.log('  4. Ready to scale with --variations flag after testing');
  console.log('═══════════════════════════════════════════════════════════════\n');
}

// Generate variations of winning prompts (SOP scaling process)
async function generateVariations(
  ai: GoogleGenAI,
  winningPrompt: GeneratedPrompt,
  numVariations: number = 20
): Promise<GeneratedPrompt[]> {
  console.log(`\n🔄 Generating ${numVariations} variations of winning concept: ${winningPrompt.description}\n`);
  
  const variationInstruction = `This visual style/concept has performed very well:

Category: ${winningPrompt.category}
Description: ${winningPrompt.description}
Original Prompt: ${winningPrompt.prompt}

I want ${numVariations} different prompts for different images (make sure they're not too similar to the original) that still convey the same big idea and visual style.

CRITICAL REQUIREMENTS:
1. NO TEXT in images - reserve clear space at TOP (20%) and BOTTOM (15%)
2. 1:1 square composition (1080x1080)
3. Dark navy (#0A0E27) base with cyan (#00FFFF) and blue (#1E88E5) accents
4. Maintain the same category and general vibe
5. Each variation should be distinct but recognizably related

Return ONLY a JSON array of ${numVariations} objects with this structure:
[
  {
    "id": 1,
    "category": "${winningPrompt.category}",
    "description": "Brief description",
    "prompt": "Detailed prompt (NO TEXT - reserve top 20% and bottom 15% as clear space)"
  }
]`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: variationInstruction,
      config: {
        temperature: 1.0,
        topP: 0.95
      }
    });
    
    const text = response.text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON found in variations response');
    }
    
    const variations: GeneratedPrompt[] = JSON.parse(jsonMatch[0]);
    console.log(`✅ Generated ${variations.length} variations\n`);
    
    return variations;
    
  } catch (error: any) {
    console.error('❌ Error generating variations:', error.message);
    return [];
  }
}

// Handle variations flag (SOP scaling workflow)
if (process.argv.includes('--variations')) {
  const varIndex = process.argv.indexOf('--variations');
  const winnerIds = process.argv[varIndex + 1]?.split(',').map(Number) || [];
  
  if (winnerIds.length === 0) {
    console.error('❌ Please specify winner IDs: --variations 1,5,8');
    process.exit(1);
  }
  
  (async () => {
    loadEnvFile();
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ Error: GOOGLE_GEMINI_API_KEY not found');
      process.exit(1);
    }
    
    const ai = new GoogleGenAI({ apiKey });
    const outputDir = path.join(process.cwd(), 'ad-images', 'test-v4');
    const promptsPath = path.join(outputDir, 'test-prompts.json');
    
    if (!fs.existsSync(promptsPath)) {
      console.error('❌ No prompts file found. Run main generation first.');
      process.exit(1);
    }
    
    const prompts: GeneratedPrompt[] = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));
    
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  🔄 GENERATING VARIATIONS OF WINNERS (SOP Scaling)');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    for (const winnerId of winnerIds) {
      const winningPrompt = prompts[winnerId - 1];
      if (!winningPrompt) {
        console.log(`⚠️  Winner ID ${winnerId} not found, skipping\n`);
        continue;
      }
      
      const variations = await generateVariations(ai, winningPrompt, 20);
      
      // Save variations
      const variationsDir = path.join(outputDir, `variations-winner-${winnerId}`);
      if (!fs.existsSync(variationsDir)) {
        fs.mkdirSync(variationsDir, { recursive: true });
      }
      
      savePromptsToFile(variations, variationsDir, 'variations.json');
      
      // Generate images for variations
      console.log(`\n🎨 Generating images for winner ${winnerId} variations...\n`);
      for (let i = 0; i < variations.length; i++) {
        await generateImage(ai, variations[i], variationsDir, i + 1);
        await new Promise(r => setTimeout(r, 3000));
      }
    }
    
    console.log('\n✅ Variation generation complete!');
    console.log('📍 Next: Add text overlays in Canva using CANVA_INSTRUCTIONS.txt');
  })();
  
} else {
  main().catch(console.error);
}
