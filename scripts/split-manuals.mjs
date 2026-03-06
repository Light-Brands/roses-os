/**
 * Split the combined "Levels 1 and 2" manual into separate Level 1 and Level 2 manuals.
 *
 * - Level 1: uses rose-meditation-level-1-final.pdf (compressed version)
 * - Level 2: uses the existing combined manual with cover text updated to "Level 2"
 */

import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const RESOURCES_DIR = 'public/resources/manuals';
const MANUALS_DIR = 'public/manuals';

async function main() {
  // 1. Copy rose-meditation-level-1-final.pdf as Level 1 manual
  const level1Src = `${MANUALS_DIR}/rose-meditation-level-1-final.pdf`;
  const level1Dst = `${RESOURCES_DIR}/ROSES-OS-Level-1-Manual-EN.pdf`;
  copyFileSync(level1Src, level1Dst);
  console.log(`Level 1: Copied ${level1Src} → ${level1Dst}`);

  // 2. Load the combined Levels 1 & 2 manual and update cover to say "Level 2"
  const combinedPath = `${RESOURCES_DIR}/ROSES-Manual-Levels-1-and-2.pdf`;
  const combinedBytes = readFileSync(combinedPath);
  const pdfDoc = await PDFDocument.load(combinedBytes);

  const pages = pdfDoc.getPages();
  const coverPage = pages[0];
  const { width, height } = coverPage.getSize();

  // Draw a background rectangle over the title area to cover old text
  // The cover typically has the title in the upper-center area
  coverPage.drawRectangle({
    x: 0,
    y: height * 0.35,
    width: width,
    height: height * 0.35,
    color: rgb(0.969, 0.961, 0.949), // #F7F5F2 - matches ROSES OS background
  });

  // Add "Level 2" title text
  const font = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const titleText = 'Level 2';
  const titleSize = 42;
  const titleWidth = boldFont.widthOfTextAtSize(titleText, titleSize);

  coverPage.drawText(titleText, {
    x: (width - titleWidth) / 2,
    y: height * 0.52,
    size: titleSize,
    font: boldFont,
    color: rgb(0.612, 0.435, 0.431), // #9C6F6E - ROSES OS accent
  });

  // Add subtitle
  const subtitleText = 'Rose Meditation';
  const subtitleSize = 18;
  const subtitleFont = font;
  const subtitleWidth = subtitleFont.widthOfTextAtSize(subtitleText, subtitleSize);

  coverPage.drawText(subtitleText, {
    x: (width - subtitleWidth) / 2,
    y: height * 0.47,
    size: subtitleSize,
    font: subtitleFont,
    color: rgb(0.71, 0.66, 0.616), // #B5A89D
  });

  // Add "ROSES OS" branding
  const brandText = 'ROSES OS';
  const brandSize = 12;
  const brandWidth = boldFont.widthOfTextAtSize(brandText, brandSize);

  coverPage.drawText(brandText, {
    x: (width - brandWidth) / 2,
    y: height * 0.42,
    size: brandSize,
    font: boldFont,
    color: rgb(0.71, 0.66, 0.616), // #B5A89D
  });

  const level2Bytes = await pdfDoc.save();
  const level2Path = `${RESOURCES_DIR}/ROSES-OS-Level-2-Manual-EN.pdf`;
  writeFileSync(level2Path, level2Bytes);
  console.log(`Level 2: Updated cover and saved → ${level2Path}`);

  console.log('\nDone! Manual files updated:');
  console.log(`  Level 1: ${level1Dst} (rose meditation compressed)`);
  console.log(`  Level 2: ${level2Path} (updated cover)`);
}

main().catch(console.error);
