/**
 * Build All Manual PDFs
 *
 * This script ensures teaching images (the canonical source) are synced
 * into the manual build directory, then generates all manual PDFs via
 * Puppeteer. The result: update a teaching image once, run this script,
 * and every manual PDF picks up the change.
 *
 * Usage:
 *   npx tsx scripts/build-manuals.ts            # build all manuals
 *   npx tsx scripts/build-manuals.ts --level 1   # build only Level 1
 *   npx tsx scripts/build-manuals.ts --level 12  # build only Levels 1&2
 *   npx tsx scripts/build-manuals.ts --level 3   # build only Level 3
 *   npx tsx scripts/build-manuals.ts --skip-sync  # skip image sync step
 */

import puppeteer from 'puppeteer-core';
import * as path from 'path';
import * as fs from 'fs';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const ROOT = path.resolve(__dirname, '..');
const MANUAL_DIR = path.join(ROOT, 'scripts', 'pdf-manuals');
const MANUAL_IMAGES_DIR = path.join(MANUAL_DIR, 'images');
const TEACHING_IMAGES_DIR = path.join(ROOT, 'public', 'images', 'teaching');
const ROSE_MED_IMAGES_DIR = path.join(ROOT, 'public', 'rose med images');
const OUTPUT_DIR = path.join(ROOT, 'public', 'resources', 'manuals');

// Images that should NOT be synced from public/rose med images/ to the PDF
// build directory. These have PDF-specific versions (e.g. close-crop chakra
// images without text labels) that differ from the slide versions.
const SYNC_EXCLUDE: Record<string, string[]> = {
  'level-2': [
    '25-root-chakra.jpeg',
    '26-sacral-chakra.jpeg',
    '27-solar-plexus-chakra.jpeg',
    '28-heart-chakra.jpeg',
    '29-throat-chakra.png',
    '30-third-eye-chakra.jpeg',
    '31-crown-chakra.png',
  ],
};

interface ManualConfig {
  id: string;
  label: string;
  htmlFile: string;
  outputFile: string;
}

const MANUALS: ManualConfig[] = [
  {
    id: '1',
    label: 'Rose Meditation — Level 1',
    htmlFile: 'roses-manual-1.html',
    outputFile: 'ROSES-OS-Level-1-Manual-EN.pdf',
  },
  {
    id: '2',
    label: 'Rose Meditation — Level 2',
    htmlFile: 'roses-manual-2.html',
    outputFile: 'ROSES-OS-Level-2-Manual-EN.pdf',
  },
  {
    id: '3',
    label: 'Rose Meditation — Level 3',
    htmlFile: 'roses-manual-3.html',
    outputFile: 'ROSES-OS-Level-3-Manual-EN.pdf',
  },
  {
    id: 'ta',
    label: 'Rose Meditation — Teachers Aid',
    htmlFile: 'roses-teachers-aid.html',
    outputFile: 'ROSES-OS-Teachers-Aid-EN.pdf',
  },
  {
    id: 'ta-es',
    label: 'Rose Meditation — Teachers Aid (ES)',
    htmlFile: 'roses-teachers-aid-es.html',
    outputFile: 'ROSES-OS-Teachers-Aid-ES.pdf',
  },
  {
    id: 'ta-pt',
    label: 'Rose Meditation — Teachers Aid (PT)',
    htmlFile: 'roses-teachers-aid-pt.html',
    outputFile: 'ROSES-OS-Teachers-Aid-PT.pdf',
  },
  {
    id: 'ta-el',
    label: 'Rose Meditation — Teachers Aid (EL)',
    htmlFile: 'roses-teachers-aid-el.html',
    outputFile: 'ROSES-OS-Teachers-Aid-EL.pdf',
  },
];

// ---------------------------------------------------------------------------
// Step 1: Sync teaching images into the manual build directory
// ---------------------------------------------------------------------------

function syncImages(): { copied: number; skipped: number } {
  let copied = 0;
  let skipped = 0;

  if (!fs.existsSync(MANUAL_IMAGES_DIR)) {
    fs.mkdirSync(MANUAL_IMAGES_DIR, { recursive: true });
  }

  // Sync teaching images (teaching-* prefix)
  if (fs.existsSync(TEACHING_IMAGES_DIR)) {
    const teachingFiles = fs.readdirSync(TEACHING_IMAGES_DIR).filter(
      (f) => f.startsWith('teaching-') && /\.(png|jpg|jpeg|webp|svg)$/i.test(f),
    );
    for (const file of teachingFiles) {
      const result = syncFile(path.join(TEACHING_IMAGES_DIR, file), path.join(MANUAL_IMAGES_DIR, file));
      if (result === 'copied') copied++;
      else skipped++;
    }
  }

  // Sync reimagined images from public/rose med images/{level-1,level-2,level-3}/
  // These are the canonical images referenced in the HTML manual templates.
  if (fs.existsSync(ROSE_MED_IMAGES_DIR)) {
    for (const levelDir of ['level-1', 'level-2', 'level-3']) {
      const srcDir = path.join(ROSE_MED_IMAGES_DIR, levelDir);
      const destDir = path.join(MANUAL_IMAGES_DIR, levelDir);
      if (!fs.existsSync(srcDir)) continue;

      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      const excluded = SYNC_EXCLUDE[levelDir] ?? [];
      const files = fs.readdirSync(srcDir).filter(
        (f) => /\.(png|jpg|jpeg|webp|svg)$/i.test(f) && !excluded.includes(f),
      );
      for (const file of files) {
        const result = syncFile(path.join(srcDir, file), path.join(destDir, file));
        if (result === 'copied') copied++;
        else skipped++;
      }
    }
  }

  return { copied, skipped };
}

function syncFile(src: string, dest: string): 'copied' | 'skipped' {
  const srcStat = fs.statSync(src);
  if (fs.existsSync(dest)) {
    const destStat = fs.statSync(dest);
    if (srcStat.size === destStat.size && srcStat.mtimeMs <= destStat.mtimeMs) {
      return 'skipped';
    }
  }
  fs.copyFileSync(src, dest);
  return 'copied';
}

// ---------------------------------------------------------------------------
// Helper: find Chrome / Chromium executable
// ---------------------------------------------------------------------------

function findChrome(): string {
  const candidates = [
    // macOS
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    // Linux common locations
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];

  // Also check Playwright headless shell
  const playwrightGlob = '/root/.cache/ms-playwright/chromium_headless_shell-*/chrome-linux/headless_shell';
  try {
    const { execSync } = require('child_process');
    const result = execSync(`ls ${playwrightGlob} 2>/dev/null`, { encoding: 'utf-8' }).trim();
    if (result) candidates.push(result.split('\n')[0]);
  } catch {}

  // Allow override via env
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }

  throw new Error(
    'Chrome/Chromium not found. Install Chrome or set CHROME_PATH env variable.',
  );
}

// ---------------------------------------------------------------------------
// Step 2: Build a single manual PDF
// ---------------------------------------------------------------------------

async function buildManualPdf(config: ManualConfig): Promise<string> {
  const htmlPath = path.join(MANUAL_DIR, config.htmlFile);
  const outputPath = path.join(OUTPUT_DIR, config.outputFile);

  if (!fs.existsSync(htmlPath)) {
    throw new Error(`HTML file not found: ${htmlPath}`);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const chromePath = findChrome();
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    await page.goto(`file://${htmlPath}`, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });

    await page.evaluateHandle('document.fonts.ready');
    await new Promise((r) => setTimeout(r, 2000));

    await page.pdf({
      path: outputPath,
      width: '8.5in',
      height: '11in',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      preferCSSPageSize: true,
    });
  } finally {
    await browser.close();
  }

  const stats = fs.statSync(outputPath);
  return (stats.size / (1024 * 1024)).toFixed(2);
}

// ---------------------------------------------------------------------------
// Step 3: Validate that all images referenced in HTML files exist
// ---------------------------------------------------------------------------

function validateImages(config: ManualConfig): string[] {
  const htmlPath = path.join(MANUAL_DIR, config.htmlFile);
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const missing: string[] = [];

  const imgRegex = /<img[^>]+src="([^"]+)"/g;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const imgSrc = match[1];
    if (imgSrc.startsWith('http://') || imgSrc.startsWith('https://')) continue;
    const imgPath = path.resolve(MANUAL_DIR, imgSrc);
    if (!fs.existsSync(imgPath)) {
      missing.push(imgSrc);
    }
  }

  return missing;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const levelArg = args.includes('--level') ? args[args.indexOf('--level') + 1] : null;
  const skipSync = args.includes('--skip-sync');

  console.log('=========================================================');
  console.log('  ROSES OS — Manual PDF Builder');
  console.log('=========================================================\n');

  // Determine which manuals to build
  const manualsToBuild = levelArg
    ? MANUALS.filter((m) => m.id === levelArg)
    : MANUALS;

  if (manualsToBuild.length === 0) {
    console.error(`  No manual found for level "${levelArg}".`);
    console.error(`  Available: ${MANUALS.map((m) => m.id).join(', ')}`);
    process.exit(1);
  }

  // Step 1: Sync teaching images
  if (!skipSync) {
    console.log('  [1/3] Syncing teaching images...');
    const { copied, skipped } = syncImages();
    console.log(`         ${copied} copied, ${skipped} already up-to-date\n`);
  } else {
    console.log('  [1/3] Skipping image sync (--skip-sync)\n');
  }

  // Step 2: Validate images
  console.log('  [2/3] Validating image references...');
  let hasWarnings = false;
  for (const manual of manualsToBuild) {
    const missing = validateImages(manual);
    if (missing.length > 0) {
      hasWarnings = true;
      console.warn(`\n    ${manual.label}:`);
      for (const m of missing) {
        console.warn(`      WARNING: missing image — ${m}`);
      }
    }
  }
  if (hasWarnings) {
    console.warn('\n         Some images are missing (will appear blank in PDF).');
    console.warn('         Run image generation scripts to create them.\n');
  } else {
    console.log('         All images found.\n');
  }

  // Step 3: Build PDFs
  console.log('  [3/3] Building PDFs...\n');
  for (const manual of manualsToBuild) {
    process.stdout.write(`    ${manual.label} ... `);
    try {
      const sizeMB = await buildManualPdf(manual);
      console.log(`${sizeMB} MB → ${manual.outputFile}`);
    } catch (err) {
      console.error(`FAILED`);
      console.error(`    ${err}`);
      process.exit(1);
    }
  }

  console.log('\n=========================================================');
  console.log(`  Done. ${manualsToBuild.length} manual(s) built.`);
  console.log(`  Output: ${OUTPUT_DIR}`);
  console.log('=========================================================\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
