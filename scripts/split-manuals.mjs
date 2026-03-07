/**
 * Generate Level 1, 2, and 3 manuals from source material PDFs.
 *
 * - Level 1: copies Rose-Meditation-Level-1_compressed.pdf as-is
 * - Level 2: extracts Level 2 pages (11-19) from the combined Levels 1 & 2 manual
 * - Level 3: removes Transmedium Channels page (page 11) and replaces the TOC
 *            page (page 2) with a clean version that omits the Transmedium entry
 */

import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Colors extracted from the source PDF TOC page
const GOLD = rgb(0x9e / 255, 0x95 / 255, 0x6b / 255);       // #9E956B — "CONTENTS" heading
const DARK_BROWN = rgb(0x52 / 255, 0x37 / 255, 0x37 / 255);  // #523737 — "Rose Meditation" title
const ROSE = rgb(0x9c / 255, 0x6f / 255, 0x6e / 255);         // #9C6F6E — subtitle
const BODY = rgb(0x3f / 255, 0x3e / 255, 0x3c / 255);         // #3F3E3C — entry text
const PAGE_NUM = rgb(0xd4 / 255, 0xa0 / 255, 0x9a / 255);     // #D4A09A — page numbers
const FOOTER = rgb(0x6e / 255, 0x4a / 255, 0x49 / 255);       // #6E4A49 — footer quote

// Page dimensions (US Letter)
const PAGE_W = 612;
const PAGE_H = 792;

// TOC entries: [label, pageNumber]
// Page numbers adjusted: pages after the removed Transmedium page shift down by 1
const TOC_ENTRIES = [
  ['The 5 Bodies & 5 Levels of Existence', '3'],
  ['Spiritual Level \u2014 Breaking Agreements', '5'],
  ['Energetic Level \u2014 Cutting Cords', '6'],
  ['Post-Intimacy Energy Cleansing', '7'],
  ['Classes & Consultations', '8'],
  ['The Analyzer', '10'],
  ['Creating Reality & Impeccability', '11'],
  ['Mock-up \u2014 Manifestation Technique', '12'],
  ['Elements of Level 3', '13'],
];

/**
 * Draw the replacement TOC page on the given pdf-lib page object.
 * Coordinates are based on the original source PDF layout (converted from
 * top-origin to pdf-lib bottom-origin: pdfY = PAGE_H - sourceY).
 */
async function drawTocPage(page, doc) {
  const timesRoman = await doc.embedFont(StandardFonts.TimesRoman);
  const timesItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);

  // "C O N T E N T S" heading — spaced caps
  page.drawText('C O N T E N T S', {
    x: 46.8,
    y: PAGE_H - 69,
    size: 6.5,
    font: helvetica,
    color: GOLD,
  });

  // "Rose Meditation" title
  page.drawText('Rose Meditation', {
    x: 46.8,
    y: PAGE_H - 99.8,
    size: 26,
    font: timesRoman,
    color: DARK_BROWN,
  });

  // "Level 3 — Advanced Practice" subtitle
  page.drawText('Level 3 \u2014 Advanced Practice', {
    x: 46.8,
    y: PAGE_H - 126,
    size: 13,
    font: timesItalic,
    color: ROSE,
  });

  // TOC entries
  const startY = 175.5;
  const entrySpacing = 25.5;

  for (let i = 0; i < TOC_ENTRIES.length; i++) {
    const [label, pageNum] = TOC_ENTRIES[i];
    const y = PAGE_H - (startY + i * entrySpacing);

    // Entry label
    page.drawText(label, {
      x: 66.3,
      y,
      size: 10,
      font: timesRoman,
      color: BODY,
    });

    // Page number (right-aligned)
    const numWidth = helvetica.widthOfTextAtSize(pageNum, 7);
    page.drawText(pageNum, {
      x: 565 - numWidth,
      y: y + 0.7, // slight offset matching source
      size: 7,
      font: helvetica,
      color: PAGE_NUM,
    });
  }

  // Footer quote (italic)
  const footerLines = [
    'Roses represent the spirit. They absorb all the energies, emotions and situations that don\'t belong to you or that no longer serve your present',
    'moment. We can create and explode them as many times as necessary. When we explode roses, they purify and transmute the energy and',
    'send it back to its source.',
  ];

  const footerYs = [705.8, 722.2, 738.0];
  for (let i = 0; i < footerLines.length; i++) {
    page.drawText(footerLines[i], {
      x: 60.3,
      y: PAGE_H - footerYs[i],
      size: 10,
      font: timesItalic,
      color: FOOTER,
    });
  }

  // Bottom center: "Rose Meditation  ·  Level 3"
  const bottomText = 'Rose Meditation  \u00B7  Level 3';
  const bottomWidth = helvetica.widthOfTextAtSize(bottomText, 7);
  page.drawText(bottomText, {
    x: (PAGE_W - bottomWidth) / 2,
    y: PAGE_H - 761.2,
    size: 7,
    font: helvetica,
    color: PAGE_NUM,
  });
}

/**
 * Build a replacement "Quick Reference" page for the Level 2 manual.
 * The original page 8 lists all 11 techniques from Levels 1 & 2.
 * This replacement shows only Level 2 techniques.
 */
async function buildLevel2QuickReferencePage(doc, insertIndex) {
  const page = doc.insertPage(insertIndex, [612, 792]); // US Letter
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const italic = await doc.embedFont(StandardFonts.HelveticaOblique);
  const black = rgb(0, 0, 0);
  const grey = rgb(0.4, 0.4, 0.4);

  let y = 680;

  // "QUICK REFERENCE" header
  page.drawText('QUICK REFERENCE', {
    x: 306 - bold.widthOfTextAtSize('QUICK REFERENCE', 22) / 2,
    y,
    size: 22,
    font: bold,
    color: black,
  });
  y -= 50;

  // Subtitle
  const subtitle = 'Elements of Rose Meditation — Level 2';
  page.drawText(subtitle, {
    x: 306 - bold.widthOfTextAtSize(subtitle, 16) / 2,
    y,
    size: 16,
    font: bold,
    color: black,
  });
  y -= 60;

  // Technique list
  const techniques = [
    'Space protection',
    'Cleansing the Chakras and Aura Layers',
    'Golden Sticky Roses',
  ];
  for (const t of techniques) {
    page.drawText(t, {
      x: 120,
      y,
      size: 14,
      font: regular,
      color: black,
    });
    y -= 32;
  }

  // Finish line
  y -= 20;
  const finishLabel = 'Finish: ';
  const finishDetail = 'cord + Golden Sun + discharge excess energy';
  page.drawText(finishLabel, {
    x: 120,
    y,
    size: 14,
    font: bold,
    color: black,
  });
  page.drawText(finishDetail, {
    x: 120 + bold.widthOfTextAtSize(finishLabel, 14),
    y,
    size: 14,
    font: regular,
    color: black,
  });

  // Motivational text
  y -= 60;
  const motto = 'YES! NOW YOU ARE READY FOR A BEAUTIFUL DAY!';
  page.drawText(motto, {
    x: 306 - italic.widthOfTextAtSize(motto, 14) / 2,
    y,
    size: 14,
    font: italic,
    color: grey,
  });

  return page;
}

async function main() {
  // 1. Level 1 — copy the compressed Level 1 source PDF directly
  const level1Src = `${SOURCE_DIR}/Rose-Meditation-Level-1_compressed.pdf`;
  const level1Dst = `${RESOURCES_DIR}/ROSES-OS-Level-1-Manual-EN.pdf`;
  copyFileSync(level1Src, level1Dst);
  console.log(`Level 1: Copied ${level1Src} → ${level1Dst}`);

  // 2. Level 2 — extract pages 11-19 (0-indexed: 10-18) from combined manual
  const combinedBytes = readFileSync(`${SOURCE_DIR}/ROSES-Manual-Levels-1-and-2_compressed.pdf`);
  const combinedDoc = await PDFDocument.load(combinedBytes);
  const level2Doc = await PDFDocument.create();

  // Pages 11-19 in 1-indexed = indices 10-18 in 0-indexed
  const level2PageIndices = Array.from({ length: 9 }, (_, i) => 10 + i);
  const level2Pages = await level2Doc.copyPages(combinedDoc, level2PageIndices);
  for (const page of level2Pages) {
    level2Doc.addPage(page);
  }

  // Replace page 8 (0-indexed: 7) — the "Quick Reference" page.
  // The original lists all 11 techniques from Levels 1 & 2;
  // the replacement shows only Level 2 techniques.
  level2Doc.removePage(7);
  await buildLevel2QuickReferencePage(level2Doc, 7);

  const level2Bytes = await level2Doc.save();
  const level2Path = `${RESOURCES_DIR}/ROSES-OS-Level-2-Manual-EN.pdf`;
  writeFileSync(level2Path, level2Bytes);
  console.log(`Level 2: Extracted pages 11-19 from combined manual → ${level2Path} (${level2Doc.getPageCount()} pages)`);

  // 3. Level 3 — remove Transmedium Channels page and replace TOC page
  const level3Bytes = readFileSync(`${SOURCE_DIR}/ROSES-Manual-Level-3_compressed.pdf`);
  const level3Doc = await PDFDocument.load(level3Bytes);

  // Remove Transmedium Channels content page first (page 11, 0-indexed: 10)
  level3Doc.removePage(10);
  // Remove old TOC page (page 2, 0-indexed: 1)
  level3Doc.removePage(1);
  // Insert new blank TOC page at index 1
  const tocPage = level3Doc.insertPage(1, [PAGE_W, PAGE_H]);
  // Draw the clean TOC content
  await drawTocPage(tocPage, level3Doc);

  // White-out "Cleansing the Transmedium Channels" on the Elements page
  // After removals + TOC insert: Elements page is at index 12 (page 13)
  const elementsPage = level3Doc.getPage(12);
  // Original text at fitz y=699, x=76, size 9 — cover it with a white rectangle
  // pdf-lib y = PAGE_H - fitz_y; rect from baseline-3 to baseline+size+1
  elementsPage.drawRectangle({
    x: 74,
    y: PAGE_H - 699 - 3,
    width: 175,
    height: 14,
    color: rgb(1, 1, 1),
    borderWidth: 0,
  });

  const level3SavedBytes = await level3Doc.save();
  const level3Path = `${RESOURCES_DIR}/ROSES-OS-Level-3-Manual-EN.pdf`;
  writeFileSync(level3Path, level3SavedBytes);
  console.log(`Level 3: Removed Transmedium Channels page & replaced TOC → ${level3Path} (${level3Doc.getPageCount()} pages)`);

  console.log('\nDone! Manual files updated:');
  console.log(`  Level 1: ${level1Dst} (13 pages)`);
  console.log(`  Level 2: ${level2Path} (9 pages)`);
  console.log(`  Level 3: ${level3Path} (14 pages)`);
}

const RESOURCES_DIR = 'public/resources/manuals';
const SOURCE_DIR = 'docs/source-materials';

main().catch(console.error);
