/**
 * Convert HTML manual to premium PDF
 * Uses Puppeteer with Chrome to render HTML → PDF
 *
 * Usage: npx tsx scripts/pdf-manuals/html-to-pdf.ts [html-file] [output-pdf]
 */

import puppeteer from 'puppeteer-core';
import * as path from 'path';
import * as fs from 'fs';

async function htmlToPdf(htmlPath: string, outputPath: string) {
  console.log('=========================================================');
  console.log('  ROSES OS — HTML to PDF Conversion');
  console.log('=========================================================\n');

  const absoluteHtml = path.resolve(htmlPath);
  const absoluteOutput = path.resolve(outputPath);

  if (!fs.existsSync(absoluteHtml)) {
    console.error(`HTML file not found: ${absoluteHtml}`);
    process.exit(1);
  }

  console.log(`  Input:  ${absoluteHtml}`);
  console.log(`  Output: ${absoluteOutput}\n`);

  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Load the HTML file
  await page.goto(`file://${absoluteHtml}`, {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });

  // Wait for fonts to load
  await page.evaluateHandle('document.fonts.ready');
  // Extra wait for font rendering
  await new Promise((r) => setTimeout(r, 2000));

  // Generate PDF
  await page.pdf({
    path: absoluteOutput,
    width: '8.5in',
    height: '11in',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    preferCSSPageSize: true,
  });

  await browser.close();

  const stats = fs.statSync(absoluteOutput);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`  PDF generated: ${sizeMB} MB`);
  console.log('\n=========================================================\n');
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const htmlFile = args[0] || 'scripts/pdf-manuals/rose-meditation-level-1.html';
const outputFile = args[1] || 'scripts/pdf-manuals/Rose-Meditation-Level-1.pdf';

htmlToPdf(htmlFile, outputFile).catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
