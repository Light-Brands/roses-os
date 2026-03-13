import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage, PDFImage } from 'pdf-lib';
import { readFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

import type { ScheduleSession } from '@/lib/data/types';

import {
  programs,
  scheduleStages,
  roseMeditationScheduleStages,
  contributionTiers,
  roseMeditationTiers,
  messagingPillars,
  brandQuotes,
  freePrograms,
  pathLevels,
} from '@/lib/data';

// =============================================================================
// BRAND COLORS (from design-system/tokens.ts, normalized to 0-1)
// =============================================================================

const COLORS = {
  auraWhite:    rgb(0.969, 0.961, 0.949),
  roseClay:     rgb(0.612, 0.435, 0.431),
  roseClayLight:rgb(0.75,  0.62,  0.62),
  oliveBrass:   rgb(0.620, 0.584, 0.420),
  deepBrown:    rgb(0.102, 0.090, 0.086),
  softCharcoal: rgb(0.247, 0.243, 0.235),
  terracotta:   rgb(0.769, 0.514, 0.424),
  warmGray:     rgb(0.420, 0.373, 0.337),
  lightRose:    rgb(0.961, 0.941, 0.933),
  paleRose:     rgb(0.975, 0.960, 0.955),
  white:        rgb(1, 1, 1),
  cream:        rgb(0.96, 0.95, 0.92),
  tableAlt:     rgb(0.976, 0.969, 0.961),
};

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 54;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

// =============================================================================
// DRAWING PRIMITIVES
// =============================================================================

/**
 * Draw a rectangle with rounded corners using pdf-lib path operations.
 */
function drawRoundedRect(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  options: {
    fill?: { r: number; g: number; b: number; opacity?: number };
    border?: { r: number; g: number; b: number; width?: number; opacity?: number };
  } = {},
) {
  const r = Math.min(radius, width / 2, height / 2);
  const top = y + height;
  const right = x + width;

  // Rounded corners approximated with cross-shaped rectangles + corner ellipses
  if (options.fill) {
    const { r: fr, g: fg, b: fb, opacity: fo } = options.fill;
    const fillColor = rgb(fr, fg, fb);
    const fillOpacity = fo ?? 1;

    // Main body rectangles (cross shape to leave corners)
    page.drawRectangle({
      x: x + r, y, width: width - 2 * r, height,
      color: fillColor, opacity: fillOpacity,
    });
    page.drawRectangle({
      x, y: y + r, width, height: height - 2 * r,
      color: fillColor, opacity: fillOpacity,
    });

    // Corner circles
    const corners = [
      { cx: x + r, cy: y + r },             // bottom-left
      { cx: right - r, cy: y + r },          // bottom-right
      { cx: x + r, cy: top - r },            // top-left
      { cx: right - r, cy: top - r },         // top-right
    ];
    for (const corner of corners) {
      page.drawEllipse({
        x: corner.cx, y: corner.cy,
        xScale: r, yScale: r,
        color: fillColor, opacity: fillOpacity,
      });
    }
  }

  if (options.border) {
    const { r: br, g: bg, b: bb, width: bw, opacity: bo } = options.border;
    const borderColor = rgb(br, bg, bb);
    const borderWidth = bw ?? 0.5;
    const borderOpacity = bo ?? 1;

    // Top edge
    page.drawLine({ start: { x: x + r, y: top }, end: { x: right - r, y: top }, thickness: borderWidth, color: borderColor, opacity: borderOpacity });
    // Bottom edge
    page.drawLine({ start: { x: x + r, y }, end: { x: right - r, y }, thickness: borderWidth, color: borderColor, opacity: borderOpacity });
    // Left edge
    page.drawLine({ start: { x, y: y + r }, end: { x, y: top - r }, thickness: borderWidth, color: borderColor, opacity: borderOpacity });
    // Right edge
    page.drawLine({ start: { x: right, y: y + r }, end: { x: right, y: top - r }, thickness: borderWidth, color: borderColor, opacity: borderOpacity });

    // Corner arcs approximated with thin ellipse outlines
    const corners = [
      { cx: x + r, cy: y + r },
      { cx: right - r, cy: y + r },
      { cx: x + r, cy: top - r },
      { cx: right - r, cy: top - r },
    ];
    for (const corner of corners) {
      page.drawEllipse({
        x: corner.cx, y: corner.cy,
        xScale: r, yScale: r,
        borderColor, borderWidth, opacity: borderOpacity,
      });
    }
  }
}

/**
 * Draw a pill-shaped badge with centered text.
 */
function drawPillBadge(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  fontSize: number,
  options: {
    fillR: number; fillG: number; fillB: number;
    textR: number; textG: number; textB: number;
    paddingX?: number; paddingY?: number;
    opacity?: number;
  },
): { width: number; height: number } {
  const textWidth = font.widthOfTextAtSize(text, fontSize);
  const px = options.paddingX ?? 14;
  const py = options.paddingY ?? 5;
  const badgeW = textWidth + px * 2;
  const badgeH = fontSize + py * 2;
  const radius = badgeH / 2;

  drawRoundedRect(page, x, y - py - 1, badgeW, badgeH, radius, {
    fill: { r: options.fillR, g: options.fillG, b: options.fillB, opacity: options.opacity ?? 1 },
  });

  page.drawText(text, {
    x: x + px,
    y: y + py / 2 - 1,
    size: fontSize,
    font,
    color: rgb(options.textR, options.textG, options.textB),
  });

  return { width: badgeW, height: badgeH };
}

/**
 * Draw the small rose logo icon in the top-right corner of a content page.
 */
function drawRoseIcon(page: PDFPage, logoImage: PDFImage | undefined) {
  if (!logoImage) return;
  const size = 20;
  page.drawImage(logoImage, {
    x: PAGE_WIDTH - MARGIN - size,
    y: PAGE_HEIGHT - MARGIN - 6,
    width: size,
    height: size,
    opacity: 0.5,
  });
}

/**
 * Draw a card (rounded-corner rectangle with fill and optional border).
 */
function drawCard(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  options: {
    fillR?: number; fillG?: number; fillB?: number; fillOpacity?: number;
    borderR?: number; borderG?: number; borderB?: number; borderWidth?: number; borderOpacity?: number;
  } = {},
) {
  drawRoundedRect(page, x, y, width, height, 6, {
    fill: options.fillR !== undefined
      ? { r: options.fillR, g: options.fillG!, b: options.fillB!, opacity: options.fillOpacity ?? 1 }
      : undefined,
    border: options.borderR !== undefined
      ? { r: options.borderR, g: options.borderG!, b: options.borderB!, width: options.borderWidth ?? 0.5, opacity: options.borderOpacity ?? 1 }
      : undefined,
  });
}

// =============================================================================
// TEXT HELPERS
// =============================================================================

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(test, fontSize) <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawWrappedText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  fontSize: number,
  maxWidth: number,
  color = COLORS.softCharcoal,
  lineSpacing = 1.6,
): number {
  const paragraphs = text.split('\n\n');
  let currentY = y;

  for (let p = 0; p < paragraphs.length; p++) {
    const lines = wrapText(paragraphs[p].replace(/\n/g, ' ').trim(), font, fontSize, maxWidth);
    for (const line of lines) {
      if (currentY < MARGIN + 20) return currentY;
      page.drawText(line, { x, y: currentY, size: fontSize, font, color });
      currentY -= fontSize * lineSpacing;
    }
    if (p < paragraphs.length - 1) {
      currentY -= fontSize * 0.6;
    }
  }
  return currentY;
}

function drawWrappedTextCentered(
  page: PDFPage,
  text: string,
  centerX: number,
  y: number,
  font: PDFFont,
  fontSize: number,
  maxWidth: number,
  color = COLORS.softCharcoal,
  lineSpacing = 1.5,
): number {
  const lines = wrapText(text.replace(/\n/g, ' ').trim(), font, fontSize, maxWidth);
  let currentY = y;
  for (const line of lines) {
    const w = font.widthOfTextAtSize(line, fontSize);
    page.drawText(line, { x: centerX - w / 2, y: currentY, size: fontSize, font, color });
    currentY -= fontSize * lineSpacing;
  }
  return currentY;
}

function drawSectionLabel(page: PDFPage, text: string, y: number, font: PDFFont, centered = false): number {
  const upper = text.toUpperCase();
  if (centered) {
    const w = font.widthOfTextAtSize(upper, 8);
    page.drawText(upper, { x: (PAGE_WIDTH - w) / 2, y, size: 8, font, color: COLORS.oliveBrass });
  } else {
    page.drawText(upper, { x: MARGIN, y, size: 8, font, color: COLORS.oliveBrass });
  }
  return y - 22;
}

function drawHeading(
  page: PDFPage,
  text: string,
  y: number,
  font: PDFFont,
  size = 24,
  centered = false,
): number {
  const lines = wrapText(text, font, size, CONTENT_WIDTH);
  let currentY = y;
  for (const line of lines) {
    if (centered) {
      const w = font.widthOfTextAtSize(line, size);
      page.drawText(line, { x: (PAGE_WIDTH - w) / 2, y: currentY, size, font, color: COLORS.deepBrown });
    } else {
      page.drawText(line, { x: MARGIN, y: currentY, size, font, color: COLORS.deepBrown });
    }
    currentY -= size * 1.3;
  }
  return currentY - 4;
}

function drawSubheading(
  page: PDFPage,
  text: string,
  y: number,
  font: PDFFont,
  size = 14,
  centered = false,
): number {
  const lines = wrapText(text, font, size, CONTENT_WIDTH);
  let currentY = y;
  for (const line of lines) {
    if (centered) {
      const w = font.widthOfTextAtSize(line, size);
      page.drawText(line, { x: (PAGE_WIDTH - w) / 2, y: currentY, size, font, color: COLORS.roseClay });
    } else {
      page.drawText(line, { x: MARGIN, y: currentY, size, font, color: COLORS.roseClay });
    }
    currentY -= size * 1.4;
  }
  return currentY - 2;
}

function drawHRule(page: PDFPage, y: number): number {
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 0.5,
    color: COLORS.roseClay,
    opacity: 0.25,
  });
  return y - 16;
}

function drawCenteredHRule(page: PDFPage, y: number, halfWidth = 40): number {
  page.drawLine({
    start: { x: PAGE_WIDTH / 2 - halfWidth, y },
    end: { x: PAGE_WIDTH / 2 + halfWidth, y },
    thickness: 0.5,
    color: COLORS.roseClay,
    opacity: 0.4,
  });
  return y - 12;
}

function drawBullet(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  fontSize: number,
  maxWidth: number,
  bulletColor = COLORS.roseClay,
): number {
  page.drawText('\u2022', { x, y, size: fontSize, font, color: bulletColor });
  return drawWrappedText(page, text, x + 12, y, font, fontSize, maxWidth - 12);
}

function drawPageBg(page: PDFPage) {
  page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: COLORS.auraWhite });
}

function drawPageFooter(page: PDFPage, font: PDFFont, pageNum: number) {
  page.drawText('rosesos.com', { x: MARGIN, y: 28, size: 7, font, color: COLORS.warmGray });
  page.drawText(`${pageNum}`, {
    x: PAGE_WIDTH - MARGIN - font.widthOfTextAtSize(`${pageNum}`, 7),
    y: 28,
    size: 7,
    font,
    color: COLORS.warmGray,
  });
}

// =============================================================================
// IMAGE HELPERS
// =============================================================================

async function loadImageBytes(imagePath: string): Promise<Buffer> {
  // Try local filesystem first (works in dev and when file is traced)
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    return await readFile(fullPath);
  } catch {
    // Fallback: fetch from public URL (Vercel serves public/ as static CDN assets)
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/${encodeURI(imagePath)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
}

async function loadAndResizeImage(
  doc: PDFDocument,
  imagePath: string,
  maxWidth: number,
  maxHeight: number,
): Promise<PDFImage | null> {
  try {
    const raw = await loadImageBytes(imagePath);
    const ext = imagePath.toLowerCase();
    const brandBg = { r: 247, g: 245, b: 242 };

    if (ext.endsWith('.jpg') || ext.endsWith('.jpeg')) {
      const jpg = await sharp(raw)
        .resize(Math.round(maxWidth * 2), Math.round(maxHeight * 2), { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 75 })
        .toBuffer();
      return await doc.embedJpg(jpg);
    }

    const resized = await sharp(raw)
      .flatten({ background: brandBg })
      .resize(Math.round(maxWidth * 2), Math.round(maxHeight * 2), { fit: 'inside', withoutEnlargement: true })
      .png({ quality: 80, compressionLevel: 9 })
      .toBuffer();
    return await doc.embedPng(resized);
  } catch {
    return null;
  }
}

// =============================================================================
// SCHEDULE TABLE — STYLED
// =============================================================================

type TZ = 'mexicoCity' | 'newYork' | 'brasilia' | 'london';
const TZ_LABELS: Record<TZ, string> = {
  mexicoCity: 'MX - Mexico City',
  newYork: 'US - New York',
  brasilia: 'BR - Brasilia',
  london: 'UK - London',
};
const TZ_KEYS: TZ[] = ['mexicoCity', 'newYork', 'brasilia', 'london'];

function drawScheduleTableStyled(
  page: PDFPage,
  title: string,
  dateRange: string,
  sessions: ScheduleSession[],
  y: number,
  fonts: { serif: PDFFont; sans: PDFFont; sansBold: PDFFont },
): number {
  let currentY = y;
  const tableX = MARGIN;
  const tableW = CONTENT_WIDTH;
  const rowH = 13;
  const headerH = 15;
  const colWidths = [130, 95, 95, 95, 89];
  const colX: number[] = [];
  let cx = tableX;
  for (const w of colWidths) { colX.push(cx); cx += w; }

  // Title row
  page.drawText(title, { x: tableX, y: currentY, size: 9, font: fonts.sansBold, color: COLORS.deepBrown });
  const titleW = fonts.sansBold.widthOfTextAtSize(title, 9);
  page.drawText(`  ${dateRange}`, { x: tableX + titleW, y: currentY, size: 8, font: fonts.sans, color: COLORS.warmGray });
  currentY -= 10;

  // Header background
  drawRoundedRect(page, tableX, currentY - headerH + 4, tableW, headerH, 3, {
    fill: { r: 0.612, g: 0.435, b: 0.431, opacity: 0.9 },
  });

  const headers = ['Session', ...TZ_KEYS.map(k => TZ_LABELS[k])];
  headers.forEach((h, i) => {
    page.drawText(h, { x: colX[i] + 6, y: currentY - 7, size: 6.5, font: fonts.sansBold, color: COLORS.white });
  });
  currentY -= headerH + 2;

  // Data rows
  for (let si = 0; si < sessions.length; si++) {
    const session = sessions[si];

    // Alternating row bg
    if (si % 2 === 0) {
      page.drawRectangle({
        x: tableX, y: currentY - rowH + 5, width: tableW, height: rowH,
        color: COLORS.tableAlt, opacity: 0.7,
      });
    }

    const label = `${session.day} (${session.duration})`;
    const displayLabel = label.length > 26 ? label.slice(0, 26) + '...' : label;
    page.drawText(displayLabel, { x: colX[0] + 6, y: currentY - 5, size: 6, font: fonts.sans, color: COLORS.softCharcoal });

    TZ_KEYS.forEach((tz, i) => {
      const timeStr = session.time[tz] || '-';
      const display = timeStr.length > 20 ? timeStr.slice(0, 20) : timeStr;
      page.drawText(display, { x: colX[i + 1] + 6, y: currentY - 5, size: 6, font: fonts.sans, color: COLORS.softCharcoal });
    });

    currentY -= rowH;
  }

  // Bottom border
  page.drawLine({
    start: { x: tableX, y: currentY + 5 },
    end: { x: tableX + tableW, y: currentY + 5 },
    thickness: 0.5, color: COLORS.roseClay, opacity: 0.2,
  });

  return currentY - 8;
}

// =============================================================================
// TIER CARDS — STYLED
// =============================================================================

function drawTierCards(
  page: PDFPage,
  tiers: { name: string; price: string; description: string }[],
  y: number,
  fonts: { serif: PDFFont; sans: PDFFont; sansBold: PDFFont; serifBold: PDFFont },
): number {
  const cardGap = 10;
  const cardW = (CONTENT_WIDTH - cardGap * (tiers.length - 1)) / tiers.length;
  const cardH = 72;

  for (let i = 0; i < tiers.length; i++) {
    const tier = tiers[i];
    const cx = MARGIN + i * (cardW + cardGap);
    const cy = y - cardH;

    drawCard(page, cx, cy, cardW, cardH, {
      fillR: 0.961, fillG: 0.941, fillB: 0.933, fillOpacity: 1,
      borderR: 0.612, borderG: 0.435, borderB: 0.431, borderWidth: 0.5, borderOpacity: 0.3,
    });

    // Tier name
    page.drawText(tier.name, { x: cx + 10, y: cy + cardH - 16, size: 9, font: fonts.sansBold, color: COLORS.deepBrown });
    // Price
    page.drawText(tier.price, { x: cx + 10, y: cy + cardH - 30, size: 14, font: fonts.serifBold, color: COLORS.roseClay });
    // Description
    const descLines = wrapText(tier.description, fonts.sans, 7, cardW - 20);
    descLines.forEach((line, j) => {
      page.drawText(line, { x: cx + 10, y: cy + cardH - 44 - j * 9, size: 7, font: fonts.sans, color: COLORS.warmGray });
    });
  }

  return y - cardH - 12;
}

// =============================================================================
// PDF GENERATION
// =============================================================================

export async function GET() {
  try {
    const doc = await PDFDocument.create();
    doc.setTitle('ROSES OS - Programs Guide');
    doc.setAuthor('ROSES OS');
    doc.setSubject('Programs, Schedule, and Community');

    const serifFont  = await doc.embedFont(StandardFonts.TimesRoman);
    const serifBold  = await doc.embedFont(StandardFonts.TimesRomanBold);
    const serifItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);
    const sansFont   = await doc.embedFont(StandardFonts.Helvetica);
    const sansBold   = await doc.embedFont(StandardFonts.HelveticaBold);
    const fonts = { serif: serifFont, serifBold, serifItalic, sans: sansFont, sansBold };

    // Load logo
    let logoImage: PDFImage | undefined;
    try {
      const logoBytes = await loadImageBytes('rose.png');
      logoImage = await doc.embedPng(logoBytes);
    } catch {
      // Logo optional
    }

    // Load brand images
    const [roseImage, backcoverImage] = await Promise.all([
      loadAndResizeImage(doc, 'rose med images/level-1/01-the-rose.PNG', 300, 200),
      loadAndResizeImage(doc, 'images/backcover-rose-mandala.png', 160, 160),
    ]);

    // =========================================================================
    // PAGE 1 — COVER
    // =========================================================================
    {
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(page);

      // Top decorative line
      drawCenteredHRule(page, PAGE_HEIGHT - 80, 60);

      // Logo centered upper-third
      if (logoImage) {
        const logoSize = 50;
        const scale = Math.min(logoSize / logoImage.width, logoSize / logoImage.height);
        const w = logoImage.width * scale;
        const h = logoImage.height * scale;
        page.drawImage(logoImage, {
          x: (PAGE_WIDTH - w) / 2,
          y: PAGE_HEIGHT * 0.60,
          width: w,
          height: h,
        });
      }

      // Title
      const title = 'ROSES OS';
      const titleSize = 42;
      const titleWidth = serifFont.widthOfTextAtSize(title, titleSize);
      page.drawText(title, {
        x: (PAGE_WIDTH - titleWidth) / 2,
        y: PAGE_HEIGHT * 0.60 - 40,
        size: titleSize,
        font: serifFont,
        color: COLORS.deepBrown,
      });

      // Subtitle — spaced letters
      const tagline = 'T E C H N O L O G I E S   O F   R E M E M B R A N C E';
      const tagSize = 7;
      const tagWidth = sansFont.widthOfTextAtSize(tagline, tagSize);
      page.drawText(tagline, {
        x: (PAGE_WIDTH - tagWidth) / 2,
        y: PAGE_HEIGHT * 0.60 - 66,
        size: tagSize,
        font: sansFont,
        color: COLORS.roseClay,
      });

      // Decorative line
      drawCenteredHRule(page, PAGE_HEIGHT * 0.60 - 84, 40);

      // Italic quote
      const sub = 'Remember Who You Are';
      const subSize = 16;
      const subWidth = serifItalic.widthOfTextAtSize(sub, subSize);
      page.drawText(sub, {
        x: (PAGE_WIDTH - subWidth) / 2,
        y: PAGE_HEIGHT * 0.60 - 110,
        size: subSize,
        font: serifItalic,
        color: COLORS.roseClay,
      });

      // rosesos.com at bottom
      const url = 'rosesos.com';
      const urlW = sansFont.widthOfTextAtSize(url, 9);
      page.drawText(url, {
        x: (PAGE_WIDTH - urlW) / 2,
        y: 60,
        size: 9,
        font: sansFont,
        color: COLORS.warmGray,
      });

      drawCenteredHRule(page, 80, 60);
    }

    // =========================================================================
    // PAGE 2 — WELCOME
    // =========================================================================
    {
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(page);
      drawRoseIcon(page, logoImage);
      drawPageFooter(page, sansFont, 2);

      // Thin accent bar at top
      page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 4, width: PAGE_WIDTH, height: 4, color: COLORS.roseClay, opacity: 0.35 });

      let y = PAGE_HEIGHT - MARGIN - 8;

      y = drawSectionLabel(page, 'Welcome', y, sansBold);
      y = drawHeading(page, 'What If the Intelligence You Seek Is Already Within You?', y, serifFont, 22);
      y -= 4;
      y = drawSubheading(page, 'A Living Consciousness Ecosystem Rooted in Three Decades of Lineage', y, sansFont, 10);
      y -= 10;

      y = drawWrappedText(page,
        'ROSES OS is a living consciousness ecosystem rooted in more than three decades of lineage. It offers a path of remembrance through Rose Meditation and Aura Reading \u2014 two powerful technologies that cleanse, protect, and awaken the energy field, restoring you to your original coherence.',
        MARGIN, y, sansFont, 10, CONTENT_WIDTH, COLORS.softCharcoal, 1.65);
      y -= 6;

      y = drawWrappedText(page,
        'This is not a course to consume. It is an initiatic journey to remember who you are, to perceive the subtle energies that shape your life, and to live from the truth of your own essence.',
        MARGIN, y, sansFont, 10, CONTENT_WIDTH, COLORS.softCharcoal, 1.65);
      y -= 16;

      y = drawHRule(page, y);

      // Stats row
      const stats = [
        { value: '30+', label: 'Years of Lineage' },
        { value: '5,000+', label: 'Initiates Worldwide' },
        { value: '50+', label: 'Countries' },
      ];
      const statWidth = CONTENT_WIDTH / 3;
      for (let i = 0; i < stats.length; i++) {
        const sx = MARGIN + i * statWidth + statWidth / 2;
        const valW = serifBold.widthOfTextAtSize(stats[i].value, 24);
        page.drawText(stats[i].value, { x: sx - valW / 2, y, size: 24, font: serifBold, color: COLORS.roseClay });
        const labW = sansFont.widthOfTextAtSize(stats[i].label, 8);
        page.drawText(stats[i].label, { x: sx - labW / 2, y: y - 16, size: 8, font: sansFont, color: COLORS.warmGray });
      }
      y -= 48;

      y = drawHRule(page, y);

      // Lineage section
      y = drawSectionLabel(page, 'The Lineage', y, sansBold);
      y -= 4;

      const lineageData = [
        { year: '1960s', name: 'Lewis S. Bostwick', desc: 'Channeled the material of Aura Reading in California.' },
        { year: '1980s', name: 'Anastasia Plunk', desc: 'Carried the teachings from the Berkeley Psychic Institute.' },
        { year: '2000s', name: 'Angelina Ataide', desc: 'Founder of CELARIS. Trained thousands in Brazil and Portugal.' },
        { year: '2026', name: 'ROSES OS', desc: 'Crystallizes decades of lineage into a global ecosystem.' },
      ];
      for (const entry of lineageData) {
        page.drawText(entry.year, { x: MARGIN, y, size: 9, font: sansBold, color: COLORS.roseClay });
        page.drawText(entry.name, { x: MARGIN + 46, y, size: 9, font: sansBold, color: COLORS.deepBrown });
        y -= 12;
        y = drawWrappedText(page, entry.desc, MARGIN + 46, y, sansFont, 8, CONTENT_WIDTH - 46, COLORS.warmGray);
        y -= 6;
      }

      y -= 4;

      // Callout box at bottom
      const calloutH = 50;
      drawCard(page, MARGIN, y - calloutH, CONTENT_WIDTH, calloutH, {
        fillR: 0.961, fillG: 0.941, fillB: 0.933, fillOpacity: 0.8,
        borderR: 0.612, borderG: 0.435, borderB: 0.431, borderWidth: 0.5, borderOpacity: 0.3,
      });

      const calloutQuote = brandQuotes.find(q => q.id === '3')?.text || 'You are whole. You are here. You are remembering.';
      const cqW = serifItalic.widthOfTextAtSize(calloutQuote, 12);
      page.drawText(calloutQuote, {
        x: (PAGE_WIDTH - cqW) / 2,
        y: y - calloutH / 2 - 4,
        size: 12,
        font: serifItalic,
        color: COLORS.roseClay,
      });

      // Watermark rose image (low opacity) bottom-right
      if (roseImage) {
        const imgScale = Math.min(140 / roseImage.width, 140 / roseImage.height);
        page.drawImage(roseImage, {
          x: PAGE_WIDTH - MARGIN - roseImage.width * imgScale + 20,
          y: 40,
          width: roseImage.width * imgScale,
          height: roseImage.height * imgScale,
          opacity: 0.08,
        });
      }
    }

    // =========================================================================
    // PAGE 3 — FIVE TRANSFORMATIVE COMPONENTS
    // =========================================================================
    {
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(page);
      drawRoseIcon(page, logoImage);
      page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 4, width: PAGE_WIDTH, height: 4, color: COLORS.roseClay, opacity: 0.35 });
      drawPageFooter(page, sansFont, 3);

      let y = PAGE_HEIGHT - MARGIN - 8;

      y = drawSectionLabel(page, 'What You Will Experience', y, sansBold, true);
      y = drawHeading(page, 'Five Transformative Components', y, serifFont, 22, true);
      y -= 12;

      // Select 5 of the 6 messaging pillars (first 5 make a good set)
      const components = messagingPillars.slice(0, 5);
      const cardGap = 8;
      const cardW = (CONTENT_WIDTH - cardGap * 4) / 5;
      const cardH = 170;

      for (let i = 0; i < components.length; i++) {
        const comp = components[i];
        const cx = MARGIN + i * (cardW + cardGap);
        const cy = y - cardH;

        drawCard(page, cx, cy, cardW, cardH, {
          fillR: 0.961, fillG: 0.941, fillB: 0.933, fillOpacity: 1,
          borderR: 0.612, borderG: 0.435, borderB: 0.431, borderWidth: 0.5, borderOpacity: 0.2,
        });

        // Number circle
        const circleY = cy + cardH - 20;
        page.drawEllipse({
          x: cx + cardW / 2,
          y: circleY,
          xScale: 10,
          yScale: 10,
          color: COLORS.roseClay,
          opacity: 0.15,
        });
        const numStr = `${i + 1}`;
        const numW = sansBold.widthOfTextAtSize(numStr, 9);
        page.drawText(numStr, {
          x: cx + cardW / 2 - numW / 2,
          y: circleY - 3,
          size: 9,
          font: sansBold,
          color: COLORS.roseClay,
        });

        // Title centered
        const titleLines = wrapText(comp.title, serifBold, 9, cardW - 12);
        let ty = cy + cardH - 40;
        for (const line of titleLines) {
          const lw = serifBold.widthOfTextAtSize(line, 9);
          page.drawText(line, { x: cx + (cardW - lw) / 2, y: ty, size: 9, font: serifBold, color: COLORS.deepBrown });
          ty -= 12;
        }
        ty -= 4;

        // Description centered
        const descLines = wrapText(comp.description, sansFont, 6.5, cardW - 14);
        for (const line of descLines) {
          if (ty < cy + 8) break;
          const lw = sansFont.widthOfTextAtSize(line, 6.5);
          page.drawText(line, { x: cx + (cardW - lw) / 2, y: ty, size: 6.5, font: sansFont, color: COLORS.warmGray });
          ty -= 9;
        }
      }

      y -= cardH + 20;

      // The sixth pillar as a full-width banner at bottom
      const sixthPillar = messagingPillars[5];
      if (sixthPillar) {
        const bannerH = 56;
        drawCard(page, MARGIN, y - bannerH, CONTENT_WIDTH, bannerH, {
          fillR: 0.612, fillG: 0.435, fillB: 0.431, fillOpacity: 0.08,
          borderR: 0.612, borderG: 0.435, borderB: 0.431, borderWidth: 0.5, borderOpacity: 0.2,
        });
        const bTitleW = serifBold.widthOfTextAtSize(sixthPillar.title, 12);
        page.drawText(sixthPillar.title, {
          x: (PAGE_WIDTH - bTitleW) / 2,
          y: y - 18,
          size: 12,
          font: serifBold,
          color: COLORS.deepBrown,
        });
        drawWrappedTextCentered(page, sixthPillar.description, PAGE_WIDTH / 2, y - 32, sansFont, 8, CONTENT_WIDTH - 40, COLORS.warmGray);
      }
    }

    // =========================================================================
    // PAGE 4 — WHO IS THIS COURSE FOR
    // =========================================================================
    {
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(page);
      drawRoseIcon(page, logoImage);
      page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 4, width: PAGE_WIDTH, height: 4, color: COLORS.roseClay, opacity: 0.35 });
      drawPageFooter(page, sansFont, 4);

      // Left panel — roseClay background
      const panelW = Math.round(PAGE_WIDTH * 0.33);
      page.drawRectangle({
        x: 0, y: 0, width: panelW, height: PAGE_HEIGHT,
        color: COLORS.roseClay,
      });

      // Left panel text
      const leftX = 24;
      const leftMaxW = panelW - 48;
      let leftY = PAGE_HEIGHT - 100;

      // Label on left panel
      const leftLabel = 'YOUR CALL TO';
      const leftLabelW = sansBold.widthOfTextAtSize(leftLabel, 7);
      page.drawText(leftLabel, { x: leftX + (leftMaxW - leftLabelW) / 2, y: leftY, size: 7, font: sansBold, color: COLORS.white });
      leftY -= 24;

      const leftTitle = 'Awaken Intuition and Transform Your Life';
      const leftTitleLines = wrapText(leftTitle, serifBold, 18, leftMaxW);
      for (const line of leftTitleLines) {
        page.drawText(line, { x: leftX, y: leftY, size: 18, font: serifBold, color: COLORS.white });
        leftY -= 24;
      }
      leftY -= 20;

      drawCenteredHRule(page, leftY, 30);
      leftY -= 20;

      // Italic quote on left
      const leftQuoteLines = wrapText('The way is open. Welcome home.', serifItalic, 11, leftMaxW);
      for (const line of leftQuoteLines) {
        page.drawText(line, { x: leftX, y: leftY, size: 11, font: serifItalic, color: COLORS.cream });
        leftY -= 16;
      }

      // Right side — 2 columns x 3 rows grid
      const rightX = panelW + 20;
      const rightW = PAGE_WIDTH - panelW - 20 - MARGIN;
      let rightY = PAGE_HEIGHT - MARGIN - 8;

      // Section header
      page.drawText('WHO IS THIS COURSE FOR', {
        x: rightX,
        y: rightY,
        size: 8,
        font: sansBold,
        color: COLORS.oliveBrass,
      });
      rightY -= 24;

      const gridItems = [
        { title: 'Open Your Intuition', desc: 'Learn to perceive energy, read auras, and trust your inner knowing with clarity and confidence.' },
        { title: 'Recognize the Spirit', desc: 'Reconnect with the sacred intelligence within. See beyond the surface into the truth of who you are.' },
        { title: 'Release Negative Patterns', desc: 'Dissolve limiting beliefs, emotional imprints, and energetic ties that keep you cycling.' },
        { title: 'Master Aura Reading', desc: 'Develop the subtle senses to perceive energy fields, chakras, and the invisible forces shaping life.' },
        { title: 'Serve Others', desc: 'Deepen your capacity to hold space, guide, and support transformation in those around you.' },
        { title: 'No Previous Experience', desc: 'This path is open to everyone. Come exactly as you are, ready to remember.' },
      ];

      const colCount = 2;
      const rowCount = 3;
      const cellGap = 10;
      const cellW = (rightW - cellGap) / colCount;
      const cellH = 100;

      for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < colCount; col++) {
          const idx = row * colCount + col;
          if (idx >= gridItems.length) break;
          const item = gridItems[idx];
          const cellX = rightX + col * (cellW + cellGap);
          const cellY = rightY - row * (cellH + cellGap) - cellH;

          drawCard(page, cellX, cellY, cellW, cellH, {
            fillR: 0.975, fillG: 0.960, fillB: 0.955, fillOpacity: 1,
            borderR: 0.612, borderG: 0.435, borderB: 0.431, borderWidth: 0.5, borderOpacity: 0.15,
          });

          // Small roseClay dot
          page.drawEllipse({
            x: cellX + 14, y: cellY + cellH - 16,
            xScale: 3, yScale: 3,
            color: COLORS.roseClay, opacity: 0.6,
          });

          // Title
          page.drawText(item.title, { x: cellX + 24, y: cellY + cellH - 20, size: 9, font: sansBold, color: COLORS.deepBrown });

          // Description
          const descLines = wrapText(item.desc, sansFont, 7.5, cellW - 28);
          let dy = cellY + cellH - 36;
          for (const line of descLines) {
            if (dy < cellY + 6) break;
            page.drawText(line, { x: cellX + 14, y: dy, size: 7.5, font: sansFont, color: COLORS.warmGray });
            dy -= 10;
          }
        }
      }
    }

    // =========================================================================
    // PAGE 5 — ROSE MEDITATION SCHEDULE
    // =========================================================================
    {
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(page);
      drawRoseIcon(page, logoImage);
      page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 4, width: PAGE_WIDTH, height: 4, color: COLORS.terracotta, opacity: 0.3 });
      drawPageFooter(page, sansFont, 5);

      let y = PAGE_HEIGHT - MARGIN - 8;

      y = drawSectionLabel(page, '1st Stage', y, sansBold, true);
      y = drawHeading(page, 'Rose Meditation', y, serifFont, 26, true);
      y -= 6;

      // Pill badges
      const badge1X = PAGE_WIDTH / 2 - 90;
      drawPillBadge(page, '1st Stage', badge1X, y, sansBold, 8, {
        fillR: 0.612, fillG: 0.435, fillB: 0.431,
        textR: 1, textG: 1, textB: 1,
      });
      drawPillBadge(page, 'Levels 1, 2, and 3', badge1X + 86, y, sansBold, 8, {
        fillR: 0.961, fillG: 0.941, fillB: 0.933,
        textR: 0.612, textG: 0.435, textB: 0.431,
      });
      y -= 26;

      // Date range
      const roseProg = programs.find(p => p.id === '3');
      if (roseProg) {
        const dateText = `${roseProg.dates}  |  ${roseProg.duration}  |  ${roseProg.format}`;
        const dtW = sansFont.widthOfTextAtSize(dateText, 9);
        page.drawText(dateText, { x: (PAGE_WIDTH - dtW) / 2, y, size: 9, font: sansFont, color: COLORS.warmGray });
        y -= 18;

        y = drawWrappedTextCentered(page, roseProg.description.split('\n\n')[0], PAGE_WIDTH / 2, y, sansFont, 8.5, CONTENT_WIDTH - 40, COLORS.softCharcoal, 1.5);
        y -= 12;

        // What's included
        page.drawText("WHAT'S INCLUDED", { x: MARGIN, y, size: 8, font: sansBold, color: COLORS.oliveBrass });
        y -= 14;
        for (const item of roseProg.includes || []) {
          y = drawBullet(page, item, MARGIN, y, sansFont, 8, CONTENT_WIDTH);
          y -= 2;
        }
        y -= 10;

        y = drawHRule(page, y);

        // Schedule table
        for (const stage of roseMeditationScheduleStages) {
          y = drawScheduleTableStyled(page, stage.title, stage.dateRange, stage.sessions, y, fonts);
        }
        y -= 6;

        y = drawHRule(page, y);

        // Tiers
        page.drawText('INVESTMENT', { x: MARGIN, y, size: 8, font: sansBold, color: COLORS.oliveBrass });
        y -= 18;
        y = drawTierCards(page, roseMeditationTiers, y, fonts);
      }
    }

    // =========================================================================
    // PAGE 6 — AURA READING SCHEDULE (1st & 2nd Stage combined)
    // =========================================================================
    {
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(page);
      drawRoseIcon(page, logoImage);
      page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 4, width: PAGE_WIDTH, height: 4, color: COLORS.oliveBrass, opacity: 0.3 });
      drawPageFooter(page, sansFont, 6);

      let y = PAGE_HEIGHT - MARGIN - 8;

      const auraProg = programs.find(p => p.id === '1');
      const aura2Prog = programs.find(p => p.id === '2');

      // Aura 1
      if (auraProg) {
        y = drawSectionLabel(page, 'Aura Reading Level 1', y, sansBold);
        y = drawHeading(page, `${auraProg.title}: ${auraProg.subtitle}`, y, serifFont, 18);
        y = drawSubheading(page, `${auraProg.duration}  |  ${auraProg.dates}  |  ${auraProg.format}`, y, sansFont, 8);
        y -= 4;

        // Compact description (first paragraph only)
        const descShort = auraProg.description.split('\n\n')[0];
        y = drawWrappedText(page, descShort, MARGIN, y, sansFont, 8, CONTENT_WIDTH, COLORS.softCharcoal, 1.4);
        y -= 8;

        // Key schedule stages (compact)
        for (const stage of scheduleStages.slice(0, 3)) {
          y = drawScheduleTableStyled(page, stage.title, stage.dateRange, stage.sessions.slice(0, 3), y, fonts);
          if (y < 300) break;
        }

        y -= 4;
        y = drawHRule(page, y);

        // Investment
        page.drawText('INVESTMENT', { x: MARGIN, y, size: 8, font: sansBold, color: COLORS.oliveBrass });
        y -= 18;
        y = drawTierCards(page, contributionTiers, y, fonts);
      }

      y -= 4;
      y = drawHRule(page, y);

      // Aura 2 teaser
      if (aura2Prog) {
        y = drawSectionLabel(page, 'Aura Reading Level 2', y, sansBold);
        page.drawText(`${aura2Prog.title}: ${aura2Prog.subtitle}`, { x: MARGIN, y, size: 12, font: serifBold, color: COLORS.deepBrown });
        y -= 16;
        page.drawText(`${aura2Prog.duration}  |  ${aura2Prog.dates}  |  ${aura2Prog.format}`, { x: MARGIN, y, size: 8, font: sansFont, color: COLORS.warmGray });
        y -= 14;
        y = drawWrappedText(page, aura2Prog.description, MARGIN, y, sansFont, 8, CONTENT_WIDTH, COLORS.softCharcoal, 1.4);
      }
    }

    // =========================================================================
    // PAGE 7 — DARK ACCENT PAGE
    // =========================================================================
    {
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

      // Full dark background
      page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: COLORS.deepBrown });

      // Centered logo in circle
      if (logoImage) {
        const circleR = 36;
        page.drawEllipse({
          x: PAGE_WIDTH / 2,
          y: PAGE_HEIGHT * 0.58,
          xScale: circleR,
          yScale: circleR,
          color: COLORS.roseClay,
          opacity: 0.15,
        });
        const logoSize = 42;
        const scale = Math.min(logoSize / logoImage.width, logoSize / logoImage.height);
        const w = logoImage.width * scale;
        const h = logoImage.height * scale;
        page.drawImage(logoImage, {
          x: (PAGE_WIDTH - w) / 2,
          y: PAGE_HEIGHT * 0.58 - h / 2,
          width: w,
          height: h,
          opacity: 0.8,
        });
      }

      // Large quote in cream
      const quoteText = 'To read energy, first you need to know your own.';
      const quoteSize = 22;
      const quoteLines = wrapText(quoteText, serifItalic, quoteSize, CONTENT_WIDTH - 60);
      let qy = PAGE_HEIGHT * 0.42;
      for (const line of quoteLines) {
        const lw = serifItalic.widthOfTextAtSize(line, quoteSize);
        page.drawText(line, {
          x: (PAGE_WIDTH - lw) / 2,
          y: qy,
          size: quoteSize,
          font: serifItalic,
          color: COLORS.cream,
        });
        qy -= quoteSize * 1.5;
      }

      // Smaller text below
      qy -= 12;
      const subText = 'The Rose Meditation is the foundation of all that follows.';
      const stW = sansFont.widthOfTextAtSize(subText, 10);
      page.drawText(subText, {
        x: (PAGE_WIDTH - stW) / 2,
        y: qy,
        size: 10,
        font: sansFont,
        color: COLORS.roseClayLight,
      });

      // Page number in cream
      page.drawText('7', {
        x: PAGE_WIDTH - MARGIN - sansFont.widthOfTextAtSize('7', 7),
        y: 28,
        size: 7,
        font: sansFont,
        color: COLORS.roseClayLight,
      });
      page.drawText('rosesos.com', { x: MARGIN, y: 28, size: 7, font: sansFont, color: COLORS.roseClayLight });
    }

    // =========================================================================
    // PAGE 8 — CONTENT AND JOURNEY (Rose Meditation Levels)
    // =========================================================================
    {
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(page);
      drawRoseIcon(page, logoImage);
      page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 4, width: PAGE_WIDTH, height: 4, color: COLORS.roseClay, opacity: 0.35 });
      drawPageFooter(page, sansFont, 8);

      let y = PAGE_HEIGHT - MARGIN - 8;

      y = drawSectionLabel(page, 'Content and Journey', y, sansBold, true);
      y = drawHeading(page, 'Rose Meditation Levels', y, serifFont, 22, true);
      y -= 14;

      // 3 level cards side by side
      const levelData = pathLevels.filter(l => l.level <= 3);
      const cardGap = 10;
      const cardW = (CONTENT_WIDTH - cardGap * 2) / 3;
      const cardH = 310;

      for (let i = 0; i < levelData.length; i++) {
        const level = levelData[i];
        const cx = MARGIN + i * (cardW + cardGap);
        const cy = y - cardH;

        drawCard(page, cx, cy, cardW, cardH, {
          fillR: 0.975, fillG: 0.960, fillB: 0.955, fillOpacity: 1,
          borderR: 0.612, borderG: 0.435, borderB: 0.431, borderWidth: 0.5, borderOpacity: 0.2,
        });

        // Level badge
        const badgeText = `Level ${level.level}`;
        const badgeW = sansBold.widthOfTextAtSize(badgeText, 7) + 16;
        drawRoundedRect(page, cx + (cardW - badgeW) / 2, cy + cardH - 24, badgeW, 16, 8, {
          fill: { r: 0.612, g: 0.435, b: 0.431, opacity: 1 },
        });
        const btW = sansBold.widthOfTextAtSize(badgeText, 7);
        page.drawText(badgeText, {
          x: cx + (cardW - btW) / 2,
          y: cy + cardH - 20,
          size: 7,
          font: sansBold,
          color: COLORS.white,
        });

        // Subtitle
        let ty = cy + cardH - 42;
        const subtitleLines = wrapText(level.subtitle, serifBold, 10, cardW - 20);
        for (const line of subtitleLines) {
          const lw = serifBold.widthOfTextAtSize(line, 10);
          page.drawText(line, { x: cx + (cardW - lw) / 2, y: ty, size: 10, font: serifBold, color: COLORS.deepBrown });
          ty -= 14;
        }
        ty -= 4;

        // Description
        const descLines = wrapText(level.description, sansFont, 7, cardW - 20);
        for (const line of descLines) {
          if (ty < cy + 60) break;
          page.drawText(line, { x: cx + 10, y: ty, size: 7, font: sansFont, color: COLORS.warmGray });
          ty -= 10;
        }
        ty -= 6;

        // Focus points
        if (level.focus) {
          // Thin separator
          page.drawLine({
            start: { x: cx + 10, y: ty + 2 },
            end: { x: cx + cardW - 10, y: ty + 2 },
            thickness: 0.3, color: COLORS.roseClay, opacity: 0.2,
          });
          ty -= 6;
          for (const point of level.focus) {
            if (ty < cy + 6) break;
            page.drawText('\u2022', { x: cx + 10, y: ty, size: 6.5, font: sansFont, color: COLORS.roseClay });
            const ptLines = wrapText(point, sansFont, 6.5, cardW - 32);
            for (const pl of ptLines) {
              page.drawText(pl, { x: cx + 20, y: ty, size: 6.5, font: sansFont, color: COLORS.softCharcoal });
              ty -= 9;
            }
          }
        }
      }

      y -= cardH + 20;

      // Bottom quote
      const levelQuote = 'Coherence is something you return to.';
      const lqW = serifItalic.widthOfTextAtSize(levelQuote, 11);
      page.drawText(levelQuote, {
        x: (PAGE_WIDTH - lqW) / 2,
        y: y,
        size: 11,
        font: serifItalic,
        color: COLORS.roseClay,
      });
    }

    // =========================================================================
    // PAGE 9 — COMMUNITY & CONTACT
    // =========================================================================
    {
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(page);
      drawRoseIcon(page, logoImage);
      page.drawRectangle({ x: 0, y: PAGE_HEIGHT - 4, width: PAGE_WIDTH, height: 4, color: COLORS.roseClay, opacity: 0.35 });

      let y = PAGE_HEIGHT - MARGIN - 8;

      y = drawSectionLabel(page, 'Community & Ongoing Practice', y, sansBold);
      y = drawHeading(page, 'Join a Living Field of Practice', y, serifFont, 20);
      y -= 4;

      y = drawWrappedText(page,
        'Beyond the courses, ROSES OS offers a vibrant community of practice. Free weekly gatherings, guided meditations, and monthly meetings sustain your journey and deepen your connection with fellow practitioners around the world.',
        MARGIN, y, sansFont, 9, CONTENT_WIDTH);
      y -= 12;

      y = drawHRule(page, y);

      // Free programs as cards
      page.drawText('FREE PROGRAMS', { x: MARGIN, y, size: 8, font: sansBold, color: COLORS.oliveBrass });
      y -= 16;

      for (const prog of freePrograms) {
        const progCardH = 52;
        drawCard(page, MARGIN, y - progCardH, CONTENT_WIDTH, progCardH, {
          fillR: 0.975, fillG: 0.960, fillB: 0.955, fillOpacity: 0.7,
        });

        page.drawText(prog.title, { x: MARGIN + 12, y: y - 14, size: 10, font: serifBold, color: COLORS.deepBrown });

        if (prog.free) {
          const tw = serifBold.widthOfTextAtSize(prog.title, 10);
          drawPillBadge(page, 'FREE', MARGIN + 16 + tw, y - 14, sansBold, 6, {
            fillR: 0.620, fillG: 0.584, fillB: 0.420,
            textR: 1, textG: 1, textB: 1,
            paddingX: 8, paddingY: 3,
          });
        }

        const dLines = wrapText(prog.description, sansFont, 7.5, CONTENT_WIDTH - 24);
        let dy = y - 28;
        for (const line of dLines.slice(0, 2)) {
          page.drawText(line, { x: MARGIN + 12, y: dy, size: 7.5, font: sansFont, color: COLORS.warmGray });
          dy -= 10;
        }

        y -= progCardH + 8;
        if (y < 260) break;
      }

      y -= 4;
      y = drawHRule(page, y);

      // Contact card
      const contactCardH = 140;
      drawCard(page, MARGIN, y - contactCardH, CONTENT_WIDTH, contactCardH, {
        fillR: 0.961, fillG: 0.941, fillB: 0.933, fillOpacity: 1,
        borderR: 0.612, borderG: 0.435, borderB: 0.431, borderWidth: 0.5, borderOpacity: 0.3,
      });

      const cardX = MARGIN + 16;
      const cardMaxW = CONTENT_WIDTH - 32;
      let cardY = y - 16;

      page.drawText('CONTACT', { x: cardX, y: cardY, size: 8, font: sansBold, color: COLORS.oliveBrass });
      cardY -= 18;
      page.drawText('Dara Ayoub', { x: cardX, y: cardY, size: 14, font: serifBold, color: COLORS.deepBrown });
      cardY -= 14;
      page.drawText('Guardian of Community & Programs', { x: cardX, y: cardY, size: 9, font: sansFont, color: COLORS.roseClay });
      cardY -= 16;

      drawWrappedText(page,
        'Reach out to Dara for questions about enrollment, schedule, contribution tiers, or anything about your journey with ROSES OS.',
        cardX, cardY, sansFont, 8, cardMaxW, COLORS.softCharcoal);
      cardY -= 32;

      // Contact details in a row
      const contactItems = [
        { label: 'WhatsApp', value: '+55 11 99633-0135' },
        { label: 'Email', value: 'dani.ayoub88@gmail.com' },
        { label: 'Website', value: 'rosesos.com' },
      ];
      const colW = cardMaxW / 3;
      for (let i = 0; i < contactItems.length; i++) {
        const ci = contactItems[i];
        const cx = cardX + i * colW;
        page.drawText(ci.label, { x: cx, y: cardY, size: 7, font: sansBold, color: COLORS.oliveBrass });
        page.drawText(ci.value, { x: cx, y: cardY - 10, size: 8, font: sansFont, color: COLORS.softCharcoal });
      }

      // Bottom
      y = y - contactCardH - 16;

      // Backcover image
      if (backcoverImage) {
        const imgScale = Math.min(60 / backcoverImage.width, 60 / backcoverImage.height);
        const imgW = backcoverImage.width * imgScale;
        const imgH = backcoverImage.height * imgScale;
        page.drawImage(backcoverImage, {
          x: (PAGE_WIDTH - imgW) / 2,
          y: y - imgH,
          width: imgW,
          height: imgH,
          opacity: 0.4,
        });
      }

      // Closing quote
      const closingQuote = brandQuotes.find(q => q.id === '1')?.text || '';
      const closingW = serifItalic.widthOfTextAtSize(closingQuote, 10);
      page.drawText(closingQuote, {
        x: (PAGE_WIDTH - closingW) / 2,
        y: 70,
        size: 10,
        font: serifItalic,
        color: COLORS.warmGray,
      });

      drawCenteredHRule(page, 58, 60);

      const bottomUrl = 'rosesos.com';
      const bottomUrlW = sansFont.widthOfTextAtSize(bottomUrl, 8);
      page.drawText(bottomUrl, {
        x: (PAGE_WIDTH - bottomUrlW) / 2,
        y: 40,
        size: 8,
        font: sansFont,
        color: COLORS.warmGray,
      });
    }

    // =========================================================================
    // SERIALIZE & RETURN
    // =========================================================================
    const pdfBytes = await doc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="roses-os-guide.pdf"',
        'Content-Length': pdfBytes.length.toString(),
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 },
    );
  }
}
