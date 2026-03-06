/**
 * Generate Level 1, 2, and 3 manuals from source material PDFs.
 *
 * - Level 1: copies Rose-Meditation-Level-1_compressed.pdf as-is
 * - Level 2: extracts Level 2 pages (11-19) from the combined Levels 1 & 2 manual
 * - Level 3: removes Transmedium Channels page (page 11) from the Level 3 manual
 */

import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { PDFDocument } from 'pdf-lib';

const RESOURCES_DIR = 'public/resources/manuals';
const SOURCE_DIR = 'docs/source-materials';

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

  const level2Bytes = await level2Doc.save();
  const level2Path = `${RESOURCES_DIR}/ROSES-OS-Level-2-Manual-EN.pdf`;
  writeFileSync(level2Path, level2Bytes);
  console.log(`Level 2: Extracted pages 11-19 from combined manual → ${level2Path} (${level2Doc.getPageCount()} pages)`);

  // 3. Level 3 — remove Transmedium Channels page (page 11, 0-indexed: 10)
  const level3Bytes = readFileSync(`${SOURCE_DIR}/ROSES-Manual-Level-3_compressed.pdf`);
  const level3Doc = await PDFDocument.load(level3Bytes);
  const transmediumPageIndex = 10; // page 11 (0-indexed)
  level3Doc.removePage(transmediumPageIndex);

  const level3SavedBytes = await level3Doc.save();
  const level3Path = `${RESOURCES_DIR}/ROSES-OS-Level-3-Manual-EN.pdf`;
  writeFileSync(level3Path, level3SavedBytes);
  console.log(`Level 3: Removed Transmedium Channels page → ${level3Path} (${level3Doc.getPageCount()} pages)`);

  console.log('\nDone! Manual files updated:');
  console.log(`  Level 1: ${level1Dst} (13 pages)`);
  console.log(`  Level 2: ${level2Path} (9 pages)`);
  console.log(`  Level 3: ${level3Path} (14 pages)`);
}

main().catch(console.error);
