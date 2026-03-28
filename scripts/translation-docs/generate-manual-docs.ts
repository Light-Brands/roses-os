/**
 * generate-manual-docs.ts
 *
 * Parses HTML manual templates and generates .docx files
 * that can be uploaded to Google Drive for collaborative translation.
 *
 * Usage:
 *   npx tsx scripts/translation-docs/generate-manual-docs.ts              # all levels
 *   npx tsx scripts/translation-docs/generate-manual-docs.ts --level 1    # Level 1 only
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  ShadingType,
  convertInchesToTwip,
  PageBreak,
  TabStopPosition,
  TabStopType,
} from 'docx';

// ─── Constants ──────────────────────────────────────────────────────────
const SCRIPTS_DIR = path.resolve(__dirname, '..');
const PDF_MANUALS_DIR = path.join(SCRIPTS_DIR, 'pdf-manuals');
const IMAGES_DIR = path.join(PDF_MANUALS_DIR, 'images');
const OUTPUT_DIR = path.join(__dirname, 'output');

const ROSE_CLAY = '9C6F6E';
const GOLD = '9E956B';
const CHARCOAL = '3F3E3C';
const SOFT_CHARCOAL = '5A5856';
const ROSE_400 = 'D4A09A';
const ROSE_100 = 'FAF0EE';

interface ManualConfig {
  level: number;
  htmlFile: string;
  subtitle: string;
  outputFile: string;
}

const MANUALS: ManualConfig[] = [
  { level: 1, htmlFile: 'roses-manual-1.html', subtitle: 'Level 1 — Initiation Course', outputFile: 'Rose-Level-1-Manual-EN.docx' },
  { level: 2, htmlFile: 'roses-manual-2.html', subtitle: 'Level 2 — Deeper Practice', outputFile: 'Rose-Level-2-Manual-EN.docx' },
  { level: 3, htmlFile: 'roses-manual-3.html', subtitle: 'Level 3 — Advanced Practice', outputFile: 'Rose-Level-3-Manual-EN.docx' },
];

// ─── HTML Parsing Helpers ───────────────────────────────────────────────

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&nbsp;/g, ' ')
    .replace(/&middot;/g, '·')
    .replace(/\u2019/g, '\u2019') // right single quote (already correct)
    .replace(/\u2014/g, '—')
    .replace(/\u2022/g, '•');
}

function stripHtml(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function extractText(html: string, pattern: RegExp): string[] {
  const results: string[] = [];
  let match;
  while ((match = pattern.exec(html)) !== null) {
    results.push(stripHtml(match[1]));
  }
  return results;
}

// ─── Content Extraction ────────────────────────────────────────────────

interface ContentBlock {
  type: 'heading' | 'subheading' | 'label' | 'body' | 'callout' | 'bullet' | 'image' | 'pageBreak' | 'summary-heading' | 'h4';
  text?: string;
  items?: string[];
  imagePath?: string;
  stepNumber?: string;
}

function extractPagesFromHtml(htmlContent: string): string[] {
  // Split by page divs
  const pages: string[] = [];
  const parts = htmlContent.split(/<div class="page[^"]*">/);
  // Skip first part (before first page) and last closing tags
  for (let i = 1; i < parts.length; i++) {
    pages.push(parts[i]);
  }
  return pages;
}

function extractContentFromPage(pageHtml: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];

  // Remove corner ticks, page numbers, spacer divs
  let html = pageHtml
    .replace(/<div class="ck[^"]*"><\/div>/g, '')
    .replace(/<div class="pn">.*?<\/div>/gs, '')
    .replace(/<div class="s\d+">\s*<\/div>/g, '')
    .replace(/<div class="line[^"]*"[^>]*>\s*<\/div>/g, '')
    .replace(/<div class="grow">\s*<\/div>/g, '');

  // Extract content in order using a sequential scan
  // We'll use a simpler approach: extract all meaningful elements

  // Labels (small category labels)
  const labelRegex = /<div class="label"[^>]*>(.*?)<\/div>/gs;
  // Phase badges
  const phaseRegex = /<div class="phase-badge"[^>]*>(.*?)<\/div>/gs;

  // Process the HTML sequentially to maintain order
  const elements: { index: number; block: ContentBlock }[] = [];

  // Find all labels
  let m;
  const labelRe = /<div class="label"[^>]*>(.*?)<\/div>/gs;
  while ((m = labelRe.exec(html)) !== null) {
    elements.push({ index: m.index, block: { type: 'label', text: stripHtml(m[1]) } });
  }

  // Find phase badges
  const phaseRe = /<div class="phase-badge"[^>]*>(.*?)<\/div>/gs;
  while ((m = phaseRe.exec(html)) !== null) {
    elements.push({ index: m.index, block: { type: 'label', text: stripHtml(m[1]) } });
  }

  // Find h1 headings
  const h1Re = /<h1[^>]*>(.*?)<\/h1>/gs;
  while ((m = h1Re.exec(html)) !== null) {
    elements.push({ index: m.index, block: { type: 'heading', text: stripHtml(m[1]) } });
  }

  // Find h2 headings
  const h2Re = /<h2[^>]*>(.*?)<\/h2>/gs;
  while ((m = h2Re.exec(html)) !== null) {
    const text = stripHtml(m[1]);
    if (text.includes('Elements of')) {
      elements.push({ index: m.index, block: { type: 'summary-heading', text } });
    } else {
      elements.push({ index: m.index, block: { type: 'heading', text } });
    }
  }

  // Find h3 headings with optional step numbers
  const stepH3Re = /<div class="step"[^>]*>\s*<div class="sn">(\d+)<\/div>\s*(?:<div>)?\s*<h3[^>]*>(.*?)<\/h3>/gs;
  while ((m = stepH3Re.exec(html)) !== null) {
    elements.push({ index: m.index, block: { type: 'subheading', text: stripHtml(m[2]), stepNumber: m[1] } });
  }

  // Find standalone h3 headings (no step number)
  const h3Re = /<h3[^>]*>(.*?)<\/h3>/gs;
  while ((m = h3Re.exec(html)) !== null) {
    // Check if this h3 was already captured as part of a step
    const alreadyCaptured = elements.some(e =>
      e.block.type === 'subheading' && Math.abs(e.index - m!.index) < 200
    );
    if (!alreadyCaptured) {
      elements.push({ index: m.index, block: { type: 'subheading', text: stripHtml(m[1]) } });
    }
  }

  // Find h4 headings
  const h4Re = /<h4[^>]*>(.*?)<\/h4>/gs;
  while ((m = h4Re.exec(html)) !== null) {
    elements.push({ index: m.index, block: { type: 'h4', text: stripHtml(m[1]) } });
  }

  // Find images
  const imgRe = /<img\s+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/g;
  while ((m = imgRe.exec(html)) !== null) {
    const src = m[1];
    // Skip tiny icons (TOC rose icon)
    if (html.substring(Math.max(0, m.index - 100), m.index).includes('36px')) continue;
    elements.push({ index: m.index, block: { type: 'image', imagePath: src, text: m[2] } });
  }

  // Find body paragraphs
  const bodyRe = /<p class="body(?:-sm)?"[^>]*>(.*?)<\/p>/gs;
  while ((m = bodyRe.exec(html)) !== null) {
    const text = stripHtml(m[1]);
    if (text.length > 0) {
      elements.push({ index: m.index, block: { type: 'body', text } });
    }
  }

  // Find subtitle paragraphs
  const subRe = /<p class="sub"[^>]*>(.*?)<\/p>/gs;
  while ((m = subRe.exec(html)) !== null) {
    elements.push({ index: m.index, block: { type: 'label', text: stripHtml(m[1]) } });
  }

  // Find callout boxes
  const callRe = /<div class="(?:call-gold\s+)?call"[^>]*>\s*<p[^>]*>(.*?)<\/p>\s*<\/div>/gs;
  while ((m = callRe.exec(html)) !== null) {
    elements.push({ index: m.index, block: { type: 'callout', text: stripHtml(m[1]) } });
  }

  // Find bullet lists
  const ulRe = /<ul[^>]*>(.*?)<\/ul>/gs;
  while ((m = ulRe.exec(html)) !== null) {
    const items: string[] = [];
    const liRe = /<li[^>]*>(.*?)<\/li>/gs;
    let li;
    while ((li = liRe.exec(m[1])) !== null) {
      items.push(stripHtml(li[1]));
    }
    if (items.length > 0) {
      elements.push({ index: m.index, block: { type: 'bullet', items } });
    }
  }

  // Find table rows for TOC
  const trRe = /<tr[^>]*>\s*<td[^>]*>(.*?)<\/td>\s*<td[^>]*>(.*?)<\/td>\s*<td[^>]*>(.*?)<\/td>\s*<\/tr>/gs;
  while ((m = trRe.exec(html)) !== null) {
    const num = stripHtml(m[1]);
    const title = stripHtml(m[2]);
    const page = stripHtml(m[3]);
    if (title) {
      const tocLine = num ? `${num}. ${title}  ·  ${page}` : `${title}  ·  ${page}`;
      elements.push({ index: m.index, block: { type: 'body', text: tocLine } });
    }
  }

  // Find inline styled text blocks (credits, etc.)
  const creditRe = /<strong[^>]*>(.*?)<\/strong>/gs;
  while ((m = creditRe.exec(html)) !== null) {
    // Only capture if it's a standalone credit line (not inside other captured elements)
    const text = stripHtml(m[1]);
    if (text.includes('Teachings by') || text.includes('Angelina')) {
      elements.push({ index: m.index, block: { type: 'body', text } });
    }
  }

  // Sort by index to maintain document order
  elements.sort((a, b) => a.index - b.index);

  return elements.map(e => e.block);
}

// ─── DOCX Generation ───────────────────────────────────────────────────

function resolveImagePath(src: string): string | null {
  // src is relative to pdf-manuals dir, e.g., "images/level-1/03-grounding-cord.png"
  const fullPath = path.join(PDF_MANUALS_DIR, src);
  if (fs.existsSync(fullPath)) return fullPath;

  // Try alternate extensions
  const dir = path.dirname(fullPath);
  const base = path.basename(fullPath, path.extname(fullPath));
  for (const ext of ['.png', '.PNG', '.jpeg', '.jpg', '.JPEG', '.JPG']) {
    const alt = path.join(dir, base + ext);
    if (fs.existsSync(alt)) return alt;
  }
  return null;
}

function getImageDimensions(imagePath: string): { width: number; height: number } {
  // Read basic dimensions from file header for sizing purposes
  // For .docx we'll use a standard width and calculate height proportionally
  // Default to a reasonable size that works in the document
  return { width: 400, height: 400 };
}

function createImageRun(imagePath: string, maxWidthInches: number = 4): ImageRun | null {
  const resolved = resolveImagePath(imagePath);
  if (!resolved) {
    console.warn(`  ⚠ Image not found: ${imagePath}`);
    return null;
  }

  try {
    const data = fs.readFileSync(resolved);
    // Use a reasonable aspect ratio estimate — width-constrained
    const widthPx = Math.round(maxWidthInches * 96);
    const heightPx = Math.round(widthPx * 0.75); // 4:3 default aspect

    return new ImageRun({
      data,
      transformation: { width: widthPx, height: heightPx },
      type: resolved.toLowerCase().endsWith('.png') ? 'png' : 'jpg',
    });
  } catch (err) {
    console.warn(`  ⚠ Failed to read image: ${resolved}`);
    return null;
  }
}

function buildDocxSections(blocks: ContentBlock[], config: ManualConfig): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case 'heading':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: block.text || '',
                font: 'Georgia',
                size: 36, // 18pt
                color: ROSE_CLAY,
                bold: true,
              }),
            ],
            spacing: { before: 400, after: 200 },
            alignment: AlignmentType.LEFT,
          })
        );
        break;

      case 'summary-heading':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: block.text || '',
                font: 'Georgia',
                size: 28, // 14pt
                color: ROSE_CLAY,
                bold: true,
              }),
            ],
            spacing: { before: 300, after: 200 },
          })
        );
        break;

      case 'subheading': {
        const prefix = block.stepNumber ? `${block.stepNumber}. ` : '';
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: prefix + (block.text || ''),
                font: 'Georgia',
                size: 28, // 14pt
                color: CHARCOAL,
                bold: true,
              }),
            ],
            spacing: { before: 300, after: 120 },
          })
        );
        break;
      }

      case 'h4':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: block.text || '',
                font: 'Georgia',
                size: 24, // 12pt
                color: GOLD,
                bold: true,
              }),
            ],
            spacing: { before: 200, after: 80 },
          })
        );
        break;

      case 'label':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: (block.text || '').toUpperCase(),
                font: 'Calibri',
                size: 18, // 9pt
                color: ROSE_400,
                characterSpacing: 80,
              }),
            ],
            spacing: { before: 200, after: 60 },
          })
        );
        break;

      case 'body':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: block.text || '',
                font: 'Calibri',
                size: 22, // 11pt
                color: CHARCOAL,
              }),
            ],
            spacing: { before: 80, after: 80 },
            alignment: AlignmentType.LEFT,
          })
        );
        break;

      case 'callout':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: block.text || '',
                font: 'Calibri',
                size: 21, // 10.5pt
                color: ROSE_CLAY,
                italics: true,
              }),
            ],
            spacing: { before: 120, after: 120 },
            indent: { left: convertInchesToTwip(0.3), right: convertInchesToTwip(0.3) },
            shading: { type: ShadingType.SOLID, color: ROSE_100, fill: ROSE_100 },
            border: {
              left: { style: BorderStyle.SINGLE, size: 6, color: ROSE_400 },
            },
          })
        );
        break;

      case 'bullet':
        if (block.items) {
          for (const item of block.items) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${item}`,
                    font: 'Calibri',
                    size: 22,
                    color: CHARCOAL,
                  }),
                ],
                spacing: { before: 40, after: 40 },
                indent: { left: convertInchesToTwip(0.3) },
              })
            );
          }
        }
        break;

      case 'image': {
        const imgRun = createImageRun(block.imagePath || '', 3.5);
        if (imgRun) {
          paragraphs.push(
            new Paragraph({
              children: [imgRun],
              alignment: AlignmentType.CENTER,
              spacing: { before: 200, after: 200 },
            })
          );
        }
        break;
      }

      case 'pageBreak':
        paragraphs.push(
          new Paragraph({
            children: [new PageBreak()],
          })
        );
        break;
    }
  }

  return paragraphs;
}

// ─── Main ──────────────────────────────────────────────────────────────

async function generateManualDoc(config: ManualConfig) {
  const htmlPath = path.join(PDF_MANUALS_DIR, config.htmlFile);
  if (!fs.existsSync(htmlPath)) {
    console.error(`✗ HTML file not found: ${htmlPath}`);
    return;
  }

  console.log(`\n📖 Generating ${config.outputFile}...`);
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  const pages = extractPagesFromHtml(htmlContent);
  console.log(`  Found ${pages.length} pages`);

  const allBlocks: ContentBlock[] = [];

  for (let i = 0; i < pages.length; i++) {
    if (i > 0) {
      allBlocks.push({ type: 'pageBreak' });
    }
    const pageBlocks = extractContentFromPage(pages[i]);
    allBlocks.push(...pageBlocks);
  }

  console.log(`  Extracted ${allBlocks.length} content blocks`);

  const paragraphs = buildDocxSections(allBlocks, config);

  const doc = new Document({
    creator: 'International Aura School',
    title: `Rose Meditation — ${config.subtitle}`,
    description: `Editable version of the Rose Meditation ${config.subtitle} manual for translation review.`,
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22,
            color: CHARCOAL,
          },
          paragraph: {
            spacing: { line: 340 }, // ~1.4 line spacing
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.8),
              bottom: convertInchesToTwip(0.8),
              left: convertInchesToTwip(0.9),
              right: convertInchesToTwip(0.9),
            },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(OUTPUT_DIR, config.outputFile);
  fs.writeFileSync(outputPath, buffer);

  const sizeMB = (buffer.length / 1024 / 1024).toFixed(2);
  console.log(`  ✓ ${config.outputFile} (${sizeMB} MB)`);
}

async function main() {
  // Parse CLI args
  const args = process.argv.slice(2);
  let targetLevel: number | null = null;

  const levelIdx = args.indexOf('--level');
  if (levelIdx !== -1 && args[levelIdx + 1]) {
    targetLevel = parseInt(args[levelIdx + 1], 10);
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const manuals = targetLevel
    ? MANUALS.filter(m => m.level === targetLevel)
    : MANUALS;

  if (manuals.length === 0) {
    console.error(`No manuals found for level ${targetLevel}`);
    process.exit(1);
  }

  console.log(`Generating ${manuals.length} manual(s)...`);

  for (const manual of manuals) {
    await generateManualDoc(manual);
  }

  console.log('\n✓ Done! Output in scripts/translation-docs/output/');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
