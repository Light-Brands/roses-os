import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage, PDFImage } from 'pdf-lib';
import { readFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

import type { ScheduleSession, CommunityScheduleCycle, InvestmentOption } from '@/lib/data/types';

import {
  programs,
  roseMeditationScheduleStages,
  roseMeditationTiers,
  brandQuotes,
  paidPrograms,
} from '@/lib/data';

import {
  auraForLifeSchedule,
  auraForLifeInvestment,
  teachersTrainingSchedule,
  teachersTrainingInvestment,
} from '@/lib/data/mock-data';

// =============================================================================
// BRAND COLORS (from design-system/tokens.ts, normalized to 0-1)
// =============================================================================

const COLORS = {
  auraWhite:    rgb(0.969, 0.961, 0.949), // #F7F5F2
  roseClay:     rgb(0.612, 0.435, 0.431), // #9C6F6E
  oliveBrass:   rgb(0.620, 0.584, 0.420),
  deepBrown:    rgb(0.231, 0.157, 0.157), // #3B2828
  softCharcoal: rgb(0.247, 0.243, 0.235),
  terracotta:   rgb(0.769, 0.514, 0.424),
  warmGray:     rgb(0.420, 0.373, 0.337),
  lightRose:    rgb(0.961, 0.941, 0.933),
  cream:        rgb(0.976, 0.969, 0.957), // slightly warmer than auraWhite
  white:        rgb(1, 1, 1),
  tableAlt:     rgb(0.955, 0.949, 0.941), // alternating row bg
  cardBg:       rgb(0.980, 0.976, 0.969), // card background
  cardBorder:   rgb(0.900, 0.870, 0.850),
};

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 54;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

// =============================================================================
// ROUNDED RECTANGLE HELPER (path-based for pdf-lib)
// =============================================================================

function drawRoundedRect(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  options: {
    fillColor?: ReturnType<typeof rgb>;
    fillOpacity?: number;
    borderColor?: ReturnType<typeof rgb>;
    borderWidth?: number;
    borderOpacity?: number;
  } = {},
) {
  const r = Math.min(radius, width / 2, height / 2);
  const { fillColor, fillOpacity = 1, borderColor, borderWidth = 0, borderOpacity = 1 } = options;

  // For semi-transparent fills, fall back to a plain rectangle (opacity + rounded
  // approximation via layered shapes produces visible seams at partial opacity).
  if (fillColor && fillOpacity < 1) {
    page.drawRectangle({
      x, y, width, height,
      color: fillColor,
      opacity: fillOpacity,
      borderColor,
      borderWidth,
      borderOpacity,
    });
    return;
  }

  // Rounded-rectangle approximation: central cross (two overlapping rectangles)
  // plus four corner circles to fill the radius areas.
  if (fillColor) {
    // Central horizontal band
    page.drawRectangle({
      x: x + r, y: y,
      width: width - 2 * r, height: height,
      color: fillColor, opacity: fillOpacity,
    });
    // Central vertical band
    page.drawRectangle({
      x: x, y: y + r,
      width: width, height: height - 2 * r,
      color: fillColor, opacity: fillOpacity,
    });
    // Four corner circles
    page.drawCircle({ x: x + r, y: y + r, size: r, color: fillColor, opacity: fillOpacity });
    page.drawCircle({ x: x + width - r, y: y + r, size: r, color: fillColor, opacity: fillOpacity });
    page.drawCircle({ x: x + r, y: y + height - r, size: r, color: fillColor, opacity: fillOpacity });
    page.drawCircle({ x: x + width - r, y: y + height - r, size: r, color: fillColor, opacity: fillOpacity });
  }

  if (borderColor && borderWidth > 0) {
    // Draw border segments
    const bw = borderWidth;
    const bo = borderOpacity;
    // Top edge
    page.drawLine({ start: { x: x + r, y: y + height }, end: { x: x + width - r, y: y + height }, thickness: bw, color: borderColor, opacity: bo });
    // Bottom edge
    page.drawLine({ start: { x: x + r, y: y }, end: { x: x + width - r, y: y }, thickness: bw, color: borderColor, opacity: bo });
    // Left edge
    page.drawLine({ start: { x: x, y: y + r }, end: { x: x, y: y + height - r }, thickness: bw, color: borderColor, opacity: bo });
    // Right edge
    page.drawLine({ start: { x: x + width, y: y + r }, end: { x: x + width, y: y + height - r }, thickness: bw, color: borderColor, opacity: bo });
    // Corner arcs approximated with small circles (stroke only via overlapping)
    // For visual quality, the filled corners already give a rounded appearance
  }
}

// =============================================================================
// PILL BADGE HELPER
// =============================================================================

function drawPillBadge(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  fontSize: number,
  options: {
    bgColor?: ReturnType<typeof rgb>;
    textColor?: ReturnType<typeof rgb>;
    bgOpacity?: number;
    paddingX?: number;
    paddingY?: number;
  } = {},
): { width: number; height: number } {
  const {
    bgColor = COLORS.roseClay,
    textColor = COLORS.white,
    bgOpacity = 1,
    paddingX = 12,
    paddingY = 4,
  } = options;

  const textWidth = font.widthOfTextAtSize(text, fontSize);
  const badgeWidth = textWidth + paddingX * 2;
  const badgeHeight = fontSize + paddingY * 2;
  const radius = badgeHeight / 2;

  drawRoundedRect(page, x, y - paddingY, badgeWidth, badgeHeight, radius, {
    fillColor: bgColor,
    fillOpacity: bgOpacity,
  });

  page.drawText(text, {
    x: x + paddingX,
    y: y + paddingY * 0.3,
    size: fontSize,
    font,
    color: textColor,
  });

  return { width: badgeWidth, height: badgeHeight };
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

function drawCenteredText(
  page: PDFPage,
  text: string,
  y: number,
  font: PDFFont,
  fontSize: number,
  color: ReturnType<typeof rgb>,
): number {
  const w = font.widthOfTextAtSize(text, fontSize);
  page.drawText(text, {
    x: (PAGE_WIDTH - w) / 2,
    y,
    size: fontSize,
    font,
    color,
  });
  return y - fontSize * 1.4;
}

function drawSectionLabel(page: PDFPage, text: string, y: number, font: PDFFont): number {
  page.drawText(text.toUpperCase(), {
    x: MARGIN,
    y,
    size: 8,
    font,
    color: COLORS.oliveBrass,
  });
  return y - 22;
}

function drawHeading(page: PDFPage, text: string, y: number, font: PDFFont, size = 24): number {
  const lines = wrapText(text, font, size, CONTENT_WIDTH);
  let currentY = y;
  for (const line of lines) {
    page.drawText(line, { x: MARGIN, y: currentY, size, font, color: COLORS.deepBrown });
    currentY -= size * 1.3;
  }
  return currentY - 6;
}

function drawSubheading(page: PDFPage, text: string, y: number, font: PDFFont, size = 14): number {
  const lines = wrapText(text, font, size, CONTENT_WIDTH);
  let currentY = y;
  for (const line of lines) {
    page.drawText(line, { x: MARGIN, y: currentY, size, font, color: COLORS.roseClay });
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
  return y - 18;
}

function drawBullet(page: PDFPage, text: string, x: number, y: number, font: PDFFont, fontSize: number, maxWidth: number): number {
  page.drawText('\u2022', { x, y, size: fontSize, font, color: COLORS.roseClay });
  return drawWrappedText(page, text, x + 14, y, font, fontSize, maxWidth - 14);
}

// =============================================================================
// PAGE SCAFFOLDING
// =============================================================================

function drawPageBg(page: PDFPage) {
  page.drawRectangle({
    x: 0, y: 0,
    width: PAGE_WIDTH, height: PAGE_HEIGHT,
    color: COLORS.auraWhite,
  });
}

function drawPageFooter(page: PDFPage, font: PDFFont, pageNum: number) {
  // Thin rose-clay line above footer
  page.drawLine({
    start: { x: MARGIN, y: 46 },
    end: { x: PAGE_WIDTH - MARGIN, y: 46 },
    thickness: 0.3,
    color: COLORS.roseClay,
    opacity: 0.2,
  });
  page.drawText('rosesos.com', {
    x: MARGIN,
    y: 30,
    size: 7,
    font,
    color: COLORS.warmGray,
  });
  page.drawText(`${pageNum}`, {
    x: PAGE_WIDTH - MARGIN - font.widthOfTextAtSize(`${pageNum}`, 7),
    y: 30,
    size: 7,
    font,
    color: COLORS.warmGray,
  });
}

function drawTopRoseLogo(page: PDFPage, logoImage: PDFImage | undefined) {
  if (!logoImage) return;
  const logoSize = 22;
  const scale = Math.min(logoSize / logoImage.width, logoSize / logoImage.height);
  const w = logoImage.width * scale;
  const h = logoImage.height * scale;
  page.drawImage(logoImage, {
    x: PAGE_WIDTH - MARGIN - w,
    y: PAGE_HEIGHT - MARGIN + 4,
    width: w,
    height: h,
    opacity: 0.5,
  });
}

function drawDecorativeTopBar(page: PDFPage, color = COLORS.roseClay, height = 5) {
  page.drawRectangle({
    x: 0, y: PAGE_HEIGHT - height,
    width: PAGE_WIDTH, height,
    color,
    opacity: 0.25,
  });
}

/** Set up a standard content page with background, top bar, logo, footer */
function setupContentPage(
  page: PDFPage,
  sansFont: PDFFont,
  pageNum: number,
  logoImage?: PDFImage,
  barColor = COLORS.roseClay,
): number {
  drawPageBg(page);
  drawDecorativeTopBar(page, barColor);
  drawTopRoseLogo(page, logoImage);
  drawPageFooter(page, sansFont, pageNum);
  return PAGE_HEIGHT - MARGIN - 8;
}

// =============================================================================
// IMAGE HELPERS
// =============================================================================

async function loadImageBytes(imagePath: string): Promise<Buffer> {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    return await readFile(fullPath);
  } catch {
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
// SCHEDULE TABLE — REDESIGNED
// =============================================================================

type TZ = 'mexicoCity' | 'newYork' | 'brasilia' | 'london';
const TZ_LABELS: Record<TZ, string> = {
  mexicoCity: 'Mexico City (MX)',
  newYork: 'New York (US)',
  brasilia: 'Brasilia (BR)',
  london: 'London (UK)',
};
const TZ_KEYS: TZ[] = ['mexicoCity', 'newYork', 'brasilia', 'london'];

function drawScheduleTable(
  page: PDFPage,
  title: string,
  dateRange: string,
  sessions: ScheduleSession[],
  y: number,
  fonts: { serif: PDFFont; sans: PDFFont; sansBold: PDFFont },
): number {
  let currentY = y;

  const tableWidth = CONTENT_WIDTH;
  const rowHeight = 14;
  const headerHeight = 18;
  const colWidths = [148, 98, 98, 88, 72]; // session, NY, Brasilia, London, Madrid
  const colX: number[] = [];
  let cx = MARGIN;
  for (const w of colWidths) {
    colX.push(cx);
    cx += w;
  }

  // Title pill badge + date range pill
  const titleBadge = drawPillBadge(page, title, MARGIN, currentY, fonts.sansBold, 7.5, {
    bgColor: COLORS.roseClay,
    textColor: COLORS.white,
    paddingX: 10,
    paddingY: 3,
  });

  drawPillBadge(page, dateRange, MARGIN + titleBadge.width + 8, currentY, fonts.sans, 7, {
    bgColor: COLORS.cardBg,
    textColor: COLORS.warmGray,
    bgOpacity: 1,
    paddingX: 8,
    paddingY: 3,
  });

  currentY -= titleBadge.height + 8;

  // Table container background (rounded)
  const tableHeight = headerHeight + sessions.length * rowHeight + 4;
  drawRoundedRect(page, MARGIN, currentY - tableHeight + headerHeight, tableWidth, tableHeight, 6, {
    fillColor: COLORS.white,
    borderColor: COLORS.cardBorder,
    borderWidth: 0.5,
  });

  // Header row background
  drawRoundedRect(page, MARGIN, currentY - 2, tableWidth, headerHeight, 6, {
    fillColor: COLORS.roseClay,
  });
  // Cover bottom corners of header (so only top is rounded)
  page.drawRectangle({
    x: MARGIN, y: currentY - 2,
    width: tableWidth, height: 8,
    color: COLORS.roseClay,
  });

  // Header text
  const headers = ['Session', ...TZ_KEYS.map(k => TZ_LABELS[k])];
  const headerTextY = currentY + 3;
  headers.forEach((h, i) => {
    page.drawText(h, {
      x: colX[i] + 6,
      y: headerTextY,
      size: 6.5,
      font: fonts.sansBold,
      color: COLORS.cream,
    });
  });

  currentY -= headerHeight;

  // Data rows
  for (let si = 0; si < sessions.length; si++) {
    const session = sessions[si];

    // Alternating row background
    if (si % 2 === 1) {
      page.drawRectangle({
        x: MARGIN + 1,
        y: currentY - rowHeight + 4,
        width: tableWidth - 2,
        height: rowHeight,
        color: COLORS.tableAlt,
      });
    }

    const label = `${session.day} (${session.duration})`;
    const displayLabel = label.length > 30 ? label.slice(0, 30) + '...' : label;
    page.drawText(displayLabel, {
      x: colX[0] + 6, y: currentY, size: 6.5, font: fonts.sans, color: COLORS.softCharcoal,
    });

    TZ_KEYS.forEach((tz, i) => {
      const timeStr = session.time[tz] || '-';
      page.drawText(timeStr.length > 18 ? timeStr.slice(0, 18) : timeStr, {
        x: colX[i + 1] + 6, y: currentY, size: 6.5, font: fonts.sans, color: COLORS.softCharcoal,
      });
    });

    currentY -= rowHeight;
  }

  return currentY - 10;
}

// =============================================================================
// INVESTMENT CARDS — REDESIGNED (side-by-side rounded cards)
// =============================================================================

function drawTiers(
  page: PDFPage,
  tiers: { name: string; price: string; description: string }[],
  y: number,
  fonts: { sans: PDFFont; sansBold: PDFFont; serif: PDFFont },
): number {
  let currentY = y;

  page.drawText('INVESTMENT', {
    x: MARGIN, y: currentY, size: 8, font: fonts.sansBold, color: COLORS.oliveBrass,
  });
  currentY -= 20;

  const gap = 12;
  const cardWidth = (CONTENT_WIDTH - gap * (tiers.length - 1)) / tiers.length;
  const cardHeight = 80;

  for (let i = 0; i < tiers.length; i++) {
    const tier = tiers[i];
    const cx = MARGIN + i * (cardWidth + gap);

    // Card background
    drawRoundedRect(page, cx, currentY - cardHeight, cardWidth, cardHeight, 8, {
      fillColor: COLORS.cardBg,
      borderColor: COLORS.cardBorder,
      borderWidth: 0.5,
    });

    // Tier name pill
    drawPillBadge(page, tier.name, cx + 10, currentY - 14, fonts.sansBold, 7, {
      bgColor: COLORS.roseClay,
      textColor: COLORS.white,
      paddingX: 8,
      paddingY: 2.5,
    });

    // Price
    page.drawText(tier.price, {
      x: cx + 10, y: currentY - 38, size: 16, font: fonts.serif, color: COLORS.roseClay,
    });

    // Description
    const descLines = wrapText(tier.description, fonts.sans, 7, cardWidth - 20);
    descLines.forEach((line, j) => {
      page.drawText(line, {
        x: cx + 10, y: currentY - 52 - j * 9, size: 7, font: fonts.sans, color: COLORS.warmGray,
      });
    });
  }

  return currentY - cardHeight - 16;
}

function drawInvestmentCards(
  page: PDFPage,
  options: InvestmentOption[],
  y: number,
  fonts: { sans: PDFFont; sansBold: PDFFont; serif: PDFFont },
): number {
  let currentY = y;

  page.drawText('INVESTMENT', {
    x: MARGIN, y: currentY, size: 8, font: fonts.sansBold, color: COLORS.oliveBrass,
  });
  currentY -= 20;

  const gap = 12;
  const cardWidth = (CONTENT_WIDTH - gap * (options.length - 1)) / options.length;
  const cardHeight = 72;

  for (let i = 0; i < options.length; i++) {
    const opt = options[i];
    const cx = MARGIN + i * (cardWidth + gap);

    drawRoundedRect(page, cx, currentY - cardHeight, cardWidth, cardHeight, 8, {
      fillColor: COLORS.cardBg,
      borderColor: COLORS.cardBorder,
      borderWidth: 0.5,
    });

    // Label pill
    drawPillBadge(page, opt.label, cx + 10, currentY - 14, fonts.sansBold, 7, {
      bgColor: COLORS.roseClay,
      textColor: COLORS.white,
      paddingX: 8,
      paddingY: 2.5,
    });

    // Period
    page.drawText(opt.period, {
      x: cx + 10, y: currentY - 32, size: 7, font: fonts.sans, color: COLORS.warmGray,
    });

    // Price
    page.drawText(opt.price, {
      x: cx + 10, y: currentY - 50, size: 18, font: fonts.serif, color: COLORS.roseClay,
    });
  }

  return currentY - cardHeight - 14;
}

// =============================================================================
// COMMUNITY SCHEDULE — REDESIGNED WITH ROUNDED TABLE
// =============================================================================

function drawCommunitySchedule(
  doc: PDFDocument,
  cycles: CommunityScheduleCycle[],
  y: number,
  fonts: { serif: PDFFont; sans: PDFFont; sansBold: PDFFont },
  startPage: PDFPage,
  pageNum: { value: number },
  logoImage?: PDFImage,
): { page: PDFPage; y: number } {
  let currentPage = startPage;
  let currentY = y;

  const colWidths = [100, 110, 100, 100];
  const totalTableWidth = CONTENT_WIDTH;
  const colX: number[] = [];
  let cx = MARGIN;
  // Date column takes remaining space
  const dateColWidth = totalTableWidth - colWidths.reduce((a, b) => a + b, 0);
  colX.push(cx);
  cx += dateColWidth;
  for (const w of colWidths) {
    colX.push(cx);
    cx += w;
  }
  const colHeaders = ['Date', ...TZ_KEYS.map(k => TZ_LABELS[k])];

  for (const cycle of cycles) {
    if (currentY < MARGIN + 80) {
      pageNum.value++;
      currentPage = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      currentY = setupContentPage(currentPage, fonts.sans, pageNum.value, logoImage, COLORS.oliveBrass);
    }

    // Cycle title pill
    drawPillBadge(currentPage, cycle.title, MARGIN, currentY, fonts.sansBold, 8, {
      bgColor: COLORS.deepBrown,
      textColor: COLORS.cream,
      paddingX: 12,
      paddingY: 4,
    });
    currentY -= 24;

    for (const month of cycle.months) {
      const neededHeight = 36 + month.sessions.length * 12;
      if (currentY < MARGIN + neededHeight) {
        pageNum.value++;
        currentPage = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        currentY = setupContentPage(currentPage, fonts.sans, pageNum.value, logoImage, COLORS.oliveBrass);
      }

      // Month label as pill
      drawPillBadge(currentPage, month.month, MARGIN, currentY, fonts.sansBold, 7, {
        bgColor: COLORS.roseClay,
        textColor: COLORS.white,
        paddingX: 10,
        paddingY: 3,
      });
      currentY -= 18;

      // Table container
      const rowH = 12;
      const headerH = 16;
      const tableH = headerH + month.sessions.length * rowH + 2;

      drawRoundedRect(currentPage, MARGIN, currentY - tableH + headerH, totalTableWidth, tableH, 5, {
        fillColor: COLORS.white,
        borderColor: COLORS.cardBorder,
        borderWidth: 0.4,
      });

      // Header row
      drawRoundedRect(currentPage, MARGIN, currentY, totalTableWidth, headerH, 5, {
        fillColor: COLORS.roseClay,
      });
      page_drawRect(currentPage, MARGIN, currentY, totalTableWidth, 6, COLORS.roseClay);

      colHeaders.forEach((h, i) => {
        currentPage.drawText(h, {
          x: colX[i] + 5, y: currentY + 4, size: 6, font: fonts.sansBold, color: COLORS.cream,
        });
      });
      currentY -= headerH;

      for (let si = 0; si < month.sessions.length; si++) {
        const session = month.sessions[si];

        if (si % 2 === 1) {
          page_drawRect(currentPage, MARGIN + 1, currentY - rowH + 3, totalTableWidth - 2, rowH, COLORS.tableAlt);
        }

        currentPage.drawText(session.date, {
          x: colX[0] + 5, y: currentY, size: 6.5, font: fonts.sans, color: COLORS.softCharcoal,
        });
        TZ_KEYS.forEach((tz, i) => {
          const timeStr = session.time[tz] || '-';
          currentPage.drawText(timeStr.length > 18 ? timeStr.slice(0, 18) : timeStr, {
            x: colX[i + 1] + 5, y: currentY, size: 6, font: fonts.sans, color: COLORS.softCharcoal,
          });
        });
        currentY -= rowH;
      }
      currentY -= 10;
    }
    currentY -= 8;
  }

  return { page: currentPage, y: currentY };
}

/** Simple rect helper (no rounding) */
function page_drawRect(page: PDFPage, x: number, y: number, w: number, h: number, color: ReturnType<typeof rgb>, opacity = 1) {
  page.drawRectangle({ x, y, width: w, height: h, color, opacity });
}

// =============================================================================
// DARK ACCENT / SECTION DIVIDER PAGE
// =============================================================================

function drawSectionDividerPage(
  page: PDFPage,
  sectionTitle: string,
  sectionSubtitle: string,
  fonts: { serif: PDFFont; serifItalic: PDFFont; sans: PDFFont },
  logoImage?: PDFImage,
) {
  // Deep brown background
  page.drawRectangle({
    x: 0, y: 0,
    width: PAGE_WIDTH, height: PAGE_HEIGHT,
    color: COLORS.deepBrown,
  });

  // Thin rose-clay line at top
  page.drawLine({
    start: { x: PAGE_WIDTH / 2 - 80, y: PAGE_HEIGHT - 60 },
    end: { x: PAGE_WIDTH / 2 + 80, y: PAGE_HEIGHT - 60 },
    thickness: 0.5,
    color: COLORS.roseClay,
    opacity: 0.5,
  });

  // Rose logo centered
  if (logoImage) {
    const logoSize = 50;
    const scale = Math.min(logoSize / logoImage.width, logoSize / logoImage.height);
    const w = logoImage.width * scale;
    const h = logoImage.height * scale;
    page.drawImage(logoImage, {
      x: (PAGE_WIDTH - w) / 2,
      y: PAGE_HEIGHT / 2 + 60,
      width: w,
      height: h,
      opacity: 0.7,
    });
  }

  // Section title
  const titleW = fonts.serif.widthOfTextAtSize(sectionTitle, 30);
  page.drawText(sectionTitle, {
    x: (PAGE_WIDTH - titleW) / 2,
    y: PAGE_HEIGHT / 2 + 10,
    size: 30,
    font: fonts.serif,
    color: COLORS.cream,
  });

  // Decorative line
  page.drawLine({
    start: { x: PAGE_WIDTH / 2 - 40, y: PAGE_HEIGHT / 2 - 6 },
    end: { x: PAGE_WIDTH / 2 + 40, y: PAGE_HEIGHT / 2 - 6 },
    thickness: 0.5,
    color: COLORS.roseClay,
    opacity: 0.6,
  });

  // Subtitle
  const subW = fonts.serifItalic.widthOfTextAtSize(sectionSubtitle, 13);
  page.drawText(sectionSubtitle, {
    x: (PAGE_WIDTH - subW) / 2,
    y: PAGE_HEIGHT / 2 - 30,
    size: 13,
    font: fonts.serifItalic,
    color: COLORS.roseClay,
  });

  // Bottom line
  page.drawLine({
    start: { x: PAGE_WIDTH / 2 - 80, y: 60 },
    end: { x: PAGE_WIDTH / 2 + 80, y: 60 },
    thickness: 0.5,
    color: COLORS.roseClay,
    opacity: 0.5,
  });
}

// =============================================================================
// PROGRAM OVERVIEW CARD (rounded border, inset content)
// =============================================================================

function drawProgramOverviewCard(
  page: PDFPage,
  title: string,
  subtitle: string,
  details: string[],
  description: string,
  includes: string[],
  y: number,
  fonts: { serif: PDFFont; sans: PDFFont; sansBold: PDFFont },
): number {
  let currentY = y;

  // Heading
  currentY = drawHeading(page, title, currentY, fonts.serif, 24);
  currentY = drawSubheading(page, subtitle, currentY, fonts.sans, 11);
  currentY -= 6;

  // Details as pills row
  let pillX = MARGIN;
  for (const detail of details) {
    const badge = drawPillBadge(page, detail, pillX, currentY, fonts.sans, 7, {
      bgColor: COLORS.cardBg,
      textColor: COLORS.softCharcoal,
      paddingX: 8,
      paddingY: 3,
    });
    pillX += badge.width + 6;
    if (pillX > PAGE_WIDTH - MARGIN - 60) {
      pillX = MARGIN;
      currentY -= badge.height + 4;
    }
  }
  currentY -= 20;

  // Description in a card
  const descLines = wrapText(description, fonts.sans, 9, CONTENT_WIDTH - 32);
  const descHeight = descLines.length * 9 * 1.5 + 20;

  drawRoundedRect(page, MARGIN, currentY - descHeight, CONTENT_WIDTH, descHeight, 8, {
    fillColor: COLORS.cardBg,
    borderColor: COLORS.cardBorder,
    borderWidth: 0.5,
  });

  let descY = currentY - 12;
  for (const line of descLines) {
    page.drawText(line, {
      x: MARGIN + 16, y: descY, size: 9, font: fonts.sans, color: COLORS.softCharcoal,
    });
    descY -= 9 * 1.5;
  }
  currentY -= descHeight + 12;

  // What's included
  if (includes.length > 0) {
    page.drawText("WHAT'S INCLUDED", { x: MARGIN, y: currentY, size: 8, font: fonts.sansBold, color: COLORS.oliveBrass });
    currentY -= 16;
    for (const item of includes) {
      currentY = drawBullet(page, item, MARGIN + 4, currentY, fonts.sans, 8.5, CONTENT_WIDTH - 4);
      currentY -= 4;
    }
  }

  return currentY - 6;
}

// =============================================================================
// PDF GENERATION
// =============================================================================

export async function GET() {
  try {
    const doc = await PDFDocument.create();
    doc.setTitle('International Aura School - Additional Programs Guide');
    doc.setAuthor('International Aura School');
    doc.setSubject('Paid Programs: Rose Meditation, Aura for Life, Teachers Training');

    const serifFont = await doc.embedFont(StandardFonts.TimesRoman);
    const serifBold = await doc.embedFont(StandardFonts.TimesRomanBold);
    const serifItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);
    const sansFont = await doc.embedFont(StandardFonts.Helvetica);
    const sansBold = await doc.embedFont(StandardFonts.HelveticaBold);

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
      loadAndResizeImage(doc, 'rose med images/level-1/01-the-rose.jpeg', 400, 250),
      loadAndResizeImage(doc, 'images/backcover-rose-mandala.png', 160, 160),
    ]);

    let pageNum = 0;

    // =========================================================================
    // PAGE 1 — COVER
    // =========================================================================
    {
      pageNum++;
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(page);

      // Thin decorative bar at top
      page.drawRectangle({
        x: 0, y: PAGE_HEIGHT - 4,
        width: PAGE_WIDTH, height: 4,
        color: COLORS.roseClay,
        opacity: 0.3,
      });

      // Decorative line above logo
      page.drawLine({
        start: { x: PAGE_WIDTH / 2 - 60, y: PAGE_HEIGHT - 100 },
        end: { x: PAGE_WIDTH / 2 + 60, y: PAGE_HEIGHT - 100 },
        thickness: 0.5,
        color: COLORS.roseClay,
        opacity: 0.35,
      });

      // Centered rose logo — large
      if (logoImage) {
        const logoSize = 90;
        const scale = Math.min(logoSize / logoImage.width, logoSize / logoImage.height);
        const w = logoImage.width * scale;
        const h = logoImage.height * scale;
        page.drawImage(logoImage, {
          x: (PAGE_WIDTH - w) / 2,
          y: PAGE_HEIGHT / 2 + 130,
          width: w,
          height: h,
        });
      }

      // Title: International Aura School
      let coverY = PAGE_HEIGHT / 2 + 95;
      const title = 'International Aura School';
      const titleSize = 44;
      const titleWidth = serifFont.widthOfTextAtSize(title, titleSize);
      page.drawText(title, {
        x: (PAGE_WIDTH - titleWidth) / 2,
        y: coverY,
        size: titleSize,
        font: serifFont,
        color: COLORS.deepBrown,
      });
      coverY -= 40;

      // Subtitle in rose-clay
      const sub = 'Additional Programs Guide';
      const subSize = 18;
      const subWidth = sansFont.widthOfTextAtSize(sub, subSize);
      page.drawText(sub, {
        x: (PAGE_WIDTH - subWidth) / 2,
        y: coverY,
        size: subSize,
        font: sansFont,
        color: COLORS.roseClay,
      });
      coverY -= 30;

      // Decorative line
      page.drawLine({
        start: { x: PAGE_WIDTH / 2 - 50, y: coverY },
        end: { x: PAGE_WIDTH / 2 + 50, y: coverY },
        thickness: 0.5,
        color: COLORS.roseClay,
        opacity: 0.5,
      });
      coverY -= 24;

      // Tagline
      const tagline = 'Technologies of Remembrance';
      const tagSize = 13;
      const tagWidth = serifItalic.widthOfTextAtSize(tagline, tagSize);
      page.drawText(tagline, {
        x: (PAGE_WIDTH - tagWidth) / 2,
        y: coverY,
        size: tagSize,
        font: serifItalic,
        color: COLORS.warmGray,
      });
      coverY -= 50;

      // Programs listed as pills
      const programNames = ['Rose Meditation', 'Aura for Life', 'Teachers Training'];
      let pillRowX = 0;
      const pillTotalWidth = programNames.reduce((sum, name) => {
        return sum + sansBold.widthOfTextAtSize(name, 8) + 24 + 8;
      }, -8);
      pillRowX = (PAGE_WIDTH - pillTotalWidth) / 2;

      for (const name of programNames) {
        const badge = drawPillBadge(page, name, pillRowX, coverY, sansBold, 8, {
          bgColor: COLORS.roseClay,
          textColor: COLORS.cream,
          paddingX: 12,
          paddingY: 4,
        });
        pillRowX += badge.width + 8;
      }

      // Rose image at bottom, subtle
      if (roseImage) {
        const imgScale = Math.min(160 / roseImage.width, 120 / roseImage.height);
        const imgW = roseImage.width * imgScale;
        const imgH = roseImage.height * imgScale;
        page.drawImage(roseImage, {
          x: (PAGE_WIDTH - imgW) / 2,
          y: 90,
          width: imgW,
          height: imgH,
          opacity: 0.4,
        });
      }

      // Bottom URL
      const url = 'rosesos.com';
      const urlWidth = sansFont.widthOfTextAtSize(url, 9);
      page.drawText(url, {
        x: (PAGE_WIDTH - urlWidth) / 2,
        y: 50,
        size: 9,
        font: sansFont,
        color: COLORS.warmGray,
      });

      page.drawLine({
        start: { x: PAGE_WIDTH / 2 - 60, y: 70 },
        end: { x: PAGE_WIDTH / 2 + 60, y: 70 },
        thickness: 0.5,
        color: COLORS.roseClay,
        opacity: 0.35,
      });
    }

    // =========================================================================
    // SECTION DIVIDER — ROSE MEDITATION
    // =========================================================================
    {
      pageNum++;
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawSectionDividerPage(page, 'Rose Meditation', 'A standalone practice for inner alignment', fonts, logoImage);
    }

    // =========================================================================
    // ROSE MEDITATION — OVERVIEW + SCHEDULE + INVESTMENT
    // =========================================================================
    {
      pageNum++;
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      let y = setupContentPage(page, sansFont, pageNum, logoImage, COLORS.terracotta);

      const roseProg = programs.find(p => p.id === '3');
      if (roseProg) {
        y = drawSectionLabel(page, 'Rose Meditation — Standalone Program', y, sansBold);

        y = drawProgramOverviewCard(
          page,
          roseProg.title,
          roseProg.subtitle,
          [
            `Duration: ${roseProg.duration}`,
            `Dates: ${roseProg.dates}`,
            `Format: ${roseProg.format}`,
          ],
          roseProg.description,
          roseProg.includes || [],
          y,
          fonts,
        );
        y -= 6;

        y = drawHRule(page, y);

        // Schedule
        page.drawText('SCHEDULE', { x: MARGIN, y, size: 8, font: sansBold, color: COLORS.oliveBrass });
        y -= 20;

        for (const stage of roseMeditationScheduleStages) {
          y = drawScheduleTable(page, stage.title, stage.dateRange, stage.sessions, y, fonts);
          if (y < MARGIN + 100) break; // safety
        }
        y -= 4;

        y = drawHRule(page, y);

        // Tiers
        y = drawTiers(page, roseMeditationTiers, y, fonts);
      }
    }

    // =========================================================================
    // SECTION DIVIDER — AURA FOR LIFE
    // =========================================================================
    {
      pageNum++;
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawSectionDividerPage(page, 'Aura for Life', 'Ongoing practice for the evolving reader', fonts, logoImage);
    }

    // =========================================================================
    // AURA FOR LIFE — OVERVIEW + INVESTMENT
    // =========================================================================
    {
      pageNum++;
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      let y = setupContentPage(page, sansFont, pageNum, logoImage, COLORS.oliveBrass);

      const aflProg = paidPrograms.find(p => p.id === 'aura-for-life');
      if (aflProg) {
        y = drawSectionLabel(page, 'Ongoing Practice', y, sansBold);
        y = drawHeading(page, 'Aura for Life', y, serifFont, 28);
        y -= 6;

        // Description in card
        const descLines = wrapText(aflProg.description, sansFont, 10, CONTENT_WIDTH - 32);
        const descHeight = descLines.length * 10 * 1.6 + 20;
        drawRoundedRect(page, MARGIN, y - descHeight, CONTENT_WIDTH, descHeight, 8, {
          fillColor: COLORS.cardBg,
          borderColor: COLORS.cardBorder,
          borderWidth: 0.5,
        });
        let descY = y - 12;
        for (const line of descLines) {
          page.drawText(line, {
            x: MARGIN + 16, y: descY, size: 10, font: sansFont, color: COLORS.softCharcoal,
          });
          descY -= 10 * 1.6;
        }
        y -= descHeight + 14;

        y = drawHRule(page, y);

        // Who it's for
        y = drawSectionLabel(page, 'Who This Is For', y, sansBold);
        y = drawWrappedText(page,
          'Practitioners who have completed the Aura Reading path and wish to continue developing their reading skills, deepen their perception, and remain connected to the community.',
          MARGIN, y, sansFont, 9.5, CONTENT_WIDTH);
        y -= 14;

        // Format
        y = drawSectionLabel(page, 'Format', y, sansBold);
        const formatPoints = [
          'Weekly practice circles held online via live sessions',
          'Two schedule cycles per year with distinct session calendars',
          'Multi-timezone support for global participation',
          'WhatsApp community group for ongoing connection',
          'Google Calendar integration for easy scheduling',
        ];
        for (const point of formatPoints) {
          y = drawBullet(page, point, MARGIN + 4, y, sansFont, 9, CONTENT_WIDTH - 4);
          y -= 4;
        }
        y -= 8;

        y = drawHRule(page, y);

        // Investment cards
        y = drawInvestmentCards(page, auraForLifeInvestment, y, fonts);
        y -= 6;

        y = drawHRule(page, y);

        // Schedule overview note
        y = drawSectionLabel(page, 'Schedule', y, sansBold);
        y = drawWrappedText(page,
          'The full 2026 schedule is organized into two cycles: Cycle 1 (February to July) and Cycle 2 (August to December). Sessions are held weekly, primarily on Tuesdays. See the following pages for the complete schedule with times in multiple timezones.',
          MARGIN, y, sansFont, 9, CONTENT_WIDTH, COLORS.warmGray);
      }
    }

    // =========================================================================
    // AURA FOR LIFE — SCHEDULE (may span multiple pages)
    // =========================================================================
    {
      pageNum++;
      let schedulePage = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      let y = setupContentPage(schedulePage, sansFont, pageNum, logoImage, COLORS.oliveBrass);

      y = drawSectionLabel(schedulePage, 'Aura for Life — 2026 Schedule', y, sansBold);
      y = drawHeading(schedulePage, 'Complete Class Schedule', y, serifFont, 20);
      y -= 10;

      const pageNumRef = { value: pageNum };
      const result = drawCommunitySchedule(doc, auraForLifeSchedule, y, fonts, schedulePage, pageNumRef, logoImage);
      pageNum = pageNumRef.value;
    }

    // =========================================================================
    // SECTION DIVIDER — TEACHERS TRAINING
    // =========================================================================
    {
      pageNum++;
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawSectionDividerPage(page, 'Teachers Training', 'Sharing the light with others', fonts, logoImage);
    }

    // =========================================================================
    // TEACHERS TRAINING — OVERVIEW
    // =========================================================================
    {
      pageNum++;
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      let y = setupContentPage(page, sansFont, pageNum, logoImage, COLORS.roseClay);

      const ttProg = paidPrograms.find(p => p.id === 'teachers-training');
      if (ttProg) {
        y = drawSectionLabel(page, 'Teaching Path', y, sansBold);
        y = drawHeading(page, 'Rose Meditation Teachers Training', y, serifFont, 22);
        y -= 6;

        // Description in card
        const descLines = wrapText(ttProg.description, sansFont, 9, CONTENT_WIDTH - 32);
        const descHeight = descLines.length * 9 * 1.5 + 20;
        drawRoundedRect(page, MARGIN, y - descHeight, CONTENT_WIDTH, descHeight, 8, {
          fillColor: COLORS.cardBg,
          borderColor: COLORS.cardBorder,
          borderWidth: 0.5,
        });
        let descY = y - 12;
        for (const line of descLines) {
          page.drawText(line, {
            x: MARGIN + 16, y: descY, size: 9, font: sansFont, color: COLORS.softCharcoal,
          });
          descY -= 9 * 1.5;
        }
        y -= descHeight + 14;

        y = drawHRule(page, y);

        // Facilitation
        if (ttProg.facilitation) {
          y = drawSectionLabel(page, 'Facilitation', y, sansBold);
          y = drawWrappedText(page, ttProg.facilitation, MARGIN, y, sansFont, 10, CONTENT_WIDTH, COLORS.deepBrown);
          y -= 14;
        }

        // Detail sections
        if (ttProg.detailSections) {
          for (const section of ttProg.detailSections) {
            if (y < MARGIN + 60) break; // safety for overflow
            y = drawSectionLabel(page, section.heading, y, sansBold);
            y = drawWrappedText(page, section.body, MARGIN, y, sansFont, 9, CONTENT_WIDTH, COLORS.softCharcoal, 1.5);
            if (section.bullets) {
              y -= 4;
              for (const bullet of section.bullets) {
                y = drawBullet(page, bullet, MARGIN + 4, y, sansFont, 9, CONTENT_WIDTH - 4);
                y -= 3;
              }
            }
            y -= 8;
          }
        }

        y = drawHRule(page, y);

        // Investment cards
        y = drawInvestmentCards(page, teachersTrainingInvestment, y, fonts);
        y -= 6;

        y = drawHRule(page, y);

        // Schedule note
        y = drawSectionLabel(page, 'Schedule', y, sansBold);
        y = drawWrappedText(page,
          'The training runs in two five-month cycles per year with the same content: Program 1 (March to July) and Program 2 (August to December). An introduction class is held in February. See the following pages for the complete 2026 schedule.',
          MARGIN, y, sansFont, 9, CONTENT_WIDTH, COLORS.warmGray);
      }
    }

    // =========================================================================
    // TEACHERS TRAINING SCHEDULE (may span multiple pages)
    // =========================================================================
    {
      pageNum++;
      let schedulePage = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      let y = setupContentPage(schedulePage, sansFont, pageNum, logoImage, COLORS.roseClay);

      y = drawSectionLabel(schedulePage, 'Teachers Training — 2026 Schedule', y, sansBold);
      y = drawHeading(schedulePage, 'Complete Class Schedule', y, serifFont, 20);
      y -= 10;

      const pageNumRef = { value: pageNum };
      const result = drawCommunitySchedule(doc, teachersTrainingSchedule, y, fonts, schedulePage, pageNumRef, logoImage);
      pageNum = pageNumRef.value;
    }

    // =========================================================================
    // FINAL PAGE — CONTACT & NEXT STEPS
    // =========================================================================
    {
      pageNum++;
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(page);

      // Subtle decorative top bar
      drawDecorativeTopBar(page, COLORS.roseClay, 4);

      let y = PAGE_HEIGHT - MARGIN - 20;

      // Decorative top line
      page.drawLine({
        start: { x: PAGE_WIDTH / 2 - 60, y: y + 30 },
        end: { x: PAGE_WIDTH / 2 + 60, y: y + 30 },
        thickness: 0.5,
        color: COLORS.roseClay,
        opacity: 0.4,
      });

      // Backcover logo
      if (backcoverImage) {
        const imgScale = Math.min(100 / backcoverImage.width, 100 / backcoverImage.height);
        const imgW = backcoverImage.width * imgScale;
        const imgH = backcoverImage.height * imgScale;
        page.drawImage(backcoverImage, {
          x: (PAGE_WIDTH - imgW) / 2,
          y: y - imgH,
          width: imgW,
          height: imgH,
        });
        y -= imgH + 16;
      }

      // Heading
      y = drawCenteredText(page, 'Continue Your Journey', y, serifFont, 28, COLORS.deepBrown);
      y -= 4;

      // Quote
      const quote = brandQuotes.find(q => q.id === '5')?.text || 'The way is open. Welcome home.';
      const quoteLines = wrapText(quote, serifItalic, 14, CONTENT_WIDTH - 60);
      for (const line of quoteLines) {
        y = drawCenteredText(page, line, y, serifItalic, 14, COLORS.roseClay);
      }
      y -= 14;

      y = drawHRule(page, y);

      // Contact card — rounded
      const cardX = MARGIN + 40;
      const cardInnerWidth = CONTENT_WIDTH - 80;
      const cardHeight = 220;

      drawRoundedRect(page, cardX, y - cardHeight, cardInnerWidth, cardHeight, 12, {
        fillColor: COLORS.lightRose,
        borderColor: COLORS.roseClay,
        borderWidth: 0.5,
      });

      let cardY = y - 18;
      const cardTextX = cardX + 24;
      const cardTextWidth = cardInnerWidth - 48;

      // Contact label pill
      drawPillBadge(page, 'CONTACT', cardTextX, cardY, sansBold, 7, {
        bgColor: COLORS.roseClay,
        textColor: COLORS.cream,
        paddingX: 10,
        paddingY: 3,
      });
      cardY -= 24;

      page.drawText('Dara Ayoub', { x: cardTextX, y: cardY, size: 18, font: serifBold, color: COLORS.deepBrown });
      cardY -= 18;

      page.drawText('Guardian of Community & Programs', { x: cardTextX, y: cardY, size: 10, font: sansFont, color: COLORS.roseClay });
      cardY -= 22;

      cardY = drawWrappedText(page,
        'Reach out to Dara for questions about enrollment, schedule, contribution tiers, or anything about your journey with International Aura School.',
        cardTextX, cardY, sansFont, 9, cardTextWidth, COLORS.softCharcoal);
      cardY -= 16;

      // Contact details
      const contactItems = [
        { label: 'WhatsApp', value: '+55 11 99633-0135' },
        { label: 'Email', value: 'dani.ayoub88@gmail.com' },
        { label: 'Website', value: 'rosesos.com' },
      ];

      for (const item of contactItems) {
        drawPillBadge(page, item.label, cardTextX, cardY, sansBold, 6.5, {
          bgColor: COLORS.oliveBrass,
          textColor: COLORS.cream,
          paddingX: 8,
          paddingY: 2,
        });
        page.drawText(item.value, {
          x: cardTextX + 70, y: cardY + 1, size: 9.5, font: sansFont, color: COLORS.softCharcoal,
        });
        cardY -= 18;
      }

      y -= cardHeight + 20;

      y = drawHRule(page, y);

      // Closing quote
      const closingQuote = brandQuotes.find(q => q.id === '1')?.text || '';
      if (closingQuote) {
        const closingLines = wrapText(closingQuote, serifItalic, 11, CONTENT_WIDTH - 80);
        for (const line of closingLines) {
          y = drawCenteredText(page, line, y, serifItalic, 11, COLORS.warmGray);
        }
      }

      // Bottom decorative line
      page.drawLine({
        start: { x: PAGE_WIDTH / 2 - 60, y: 70 },
        end: { x: PAGE_WIDTH / 2 + 60, y: 70 },
        thickness: 0.5,
        color: COLORS.roseClay,
        opacity: 0.4,
      });

      const bottomUrl = 'rosesos.com';
      const bottomUrlW = sansFont.widthOfTextAtSize(bottomUrl, 8);
      page.drawText(bottomUrl, {
        x: (PAGE_WIDTH - bottomUrlW) / 2,
        y: 50,
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
        'Content-Disposition': 'attachment; filename="roses-os-additional-programs-guide.pdf"',
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
