#!/usr/bin/env node
/**
 * Generate favicon.ico, Apple touch icon, and PWA icons from public/rose.png
 * Run: node scripts/generate-favicons.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import toIco from 'to-ico';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const logoPng = join(publicDir, 'rose.png');

const SIZES = {
  ico: [16, 32, 48],
  png: [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
  ],
};

async function main() {
  const pngBuffer = readFileSync(logoPng);

  // Generate PNG buffers for ICO (16, 32, 48)
  const icoPngs = await Promise.all(
    SIZES.ico.map((size) =>
      sharp(pngBuffer)
        .resize(size, size)
        .png()
        .toBuffer()
    )
  );

  // Write favicon.ico
  const icoBuffer = await toIco(icoPngs);
  writeFileSync(join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Created public/favicon.ico');

  // Generate and write all PNG icons
  for (const { name, size } of SIZES.png) {
    const buf = await sharp(pngBuffer).resize(size, size).png().toBuffer();
    writeFileSync(join(publicDir, name), buf);
    console.log(`Created public/${name}`);
  }

  console.log('Done. Update layout.tsx icons metadata to reference these files.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
