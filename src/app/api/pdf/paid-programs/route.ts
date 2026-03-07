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
  auraWhite: rgb(0.969, 0.961, 0.949),
  roseClay: rgb(0.612, 0.435, 0.431),
  oliveBrass: rgb(0.620, 0.584, 0.420),
  deepBrown: rgb(0.102, 0.090, 0.086),
  softCharcoal: rgb(0.247, 0.243, 0.235),
  terracotta: rgb(0.769, 0.514, 0.424),
  warmGray: rgb(0.420, 0.373, 0.337),
  lightRose: rgb(0.961, 0.941, 0.933),
  white: rgb(1, 1, 1),
};

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 54;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

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

function drawSectionLabel(page: PDFPage, text: string, y: number, font: PDFFont): number {
  page.drawText(text.toUpperCase(), {
    x: MARGIN,
    y,
    size: 8,
    font,
    color: COLORS.oliveBrass,
  });
  return y - 24;
}

function drawHeading(page: PDFPage, text: string, y: number, font: PDFFont, size = 24): number {
  const lines = wrapText(text, font, size, CONTENT_WIDTH);
  let currentY = y;
  for (const line of lines) {
    page.drawText(line, { x: MARGIN, y: currentY, size, font, color: COLORS.deepBrown });
    currentY -= size * 1.3;
  }
  return currentY - 4;
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
    opacity: 0.3,
  });
  return y - 16;
}

function drawBullet(page: PDFPage, text: string, x: number, y: number, font: PDFFont, fontSize: number, maxWidth: number): number {
  page.drawText('\u2022', { x, y, size: fontSize, font, color: COLORS.roseClay });
  return drawWrappedText(page, text, x + 12, y, font, fontSize, maxWidth - 12);
}

function drawPageBg(page: PDFPage) {
  page.drawRectangle({
    x: 0, y: 0,
    width: PAGE_WIDTH, height: PAGE_HEIGHT,
    color: COLORS.auraWhite,
  });
}

function drawPageFooter(page: PDFPage, font: PDFFont, pageNum: number) {
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

// =============================================================================
// IMAGE HELPERS
// =============================================================================

async function loadAndResizeImage(
  doc: PDFDocument,
  imagePath: string,
  maxWidth: number,
  maxHeight: number,
): Promise<PDFImage | null> {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    const raw = await readFile(fullPath);
    const ext = imagePath.toLowerCase();

    if (ext.endsWith('.jpg') || ext.endsWith('.jpeg')) {
      const jpg = await sharp(raw)
        .resize(Math.round(maxWidth * 2), Math.round(maxHeight * 2), { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 75 })
        .toBuffer();
      return await doc.embedJpg(jpg);
    }

    const resized = await sharp(raw)
      .resize(Math.round(maxWidth * 2), Math.round(maxHeight * 2), { fit: 'inside', withoutEnlargement: true })
      .png({ quality: 80, compressionLevel: 9 })
      .toBuffer();
    return await doc.embedPng(resized);
  } catch {
    return null;
  }
}

function drawDecorativeBar(page: PDFPage, y: number, height: number, color = COLORS.roseClay, opacity = 0.08) {
  page.drawRectangle({
    x: 0, y: y - height,
    width: PAGE_WIDTH, height,
    color,
    opacity,
  });
}

// =============================================================================
// SCHEDULE HELPERS
// =============================================================================

type TZ = 'newYork' | 'brasilia' | 'london' | 'madrid';
const TZ_LABELS: Record<TZ, string> = {
  newYork: 'New York',
  brasilia: 'Brasilia',
  london: 'London',
  madrid: 'Madrid',
};
const TZ_KEYS: TZ[] = ['newYork', 'brasilia', 'london', 'madrid'];

function drawScheduleTable(
  page: PDFPage,
  title: string,
  dateRange: string,
  sessions: ScheduleSession[],
  y: number,
  fonts: { serif: PDFFont; sans: PDFFont; sansBold: PDFFont },
): number {
  let currentY = y;

  page.drawText(`${title}  |  ${dateRange}`, {
    x: MARGIN,
    y: currentY,
    size: 9,
    font: fonts.sansBold,
    color: COLORS.deepBrown,
  });
  currentY -= 14;

  const colX = [MARGIN, MARGIN + 145, MARGIN + 255, MARGIN + 345, MARGIN + 425];
  const headers = ['Session', ...TZ_KEYS.map(k => TZ_LABELS[k])];
  headers.forEach((h, i) => {
    page.drawText(h, { x: colX[i], y: currentY, size: 6.5, font: fonts.sansBold, color: COLORS.oliveBrass });
  });
  currentY -= 10;

  for (const session of sessions) {
    const label = `${session.day} (${session.duration})`;
    page.drawText(label.length > 28 ? label.slice(0, 28) + '...' : label, {
      x: colX[0], y: currentY, size: 6.5, font: fonts.sans, color: COLORS.softCharcoal,
    });
    TZ_KEYS.forEach((tz, i) => {
      const timeStr = session.time[tz] || '-';
      page.drawText(timeStr.length > 18 ? timeStr.slice(0, 18) : timeStr, {
        x: colX[i + 1], y: currentY, size: 6.5, font: fonts.sans, color: COLORS.softCharcoal,
      });
    });
    currentY -= 10;
  }

  return currentY - 6;
}

function drawTiers(
  page: PDFPage,
  tiers: { name: string; price: string; description: string }[],
  y: number,
  fonts: { sans: PDFFont; sansBold: PDFFont },
): number {
  let currentY = y;

  page.drawText('INVESTMENT', {
    x: MARGIN, y: currentY, size: 8, font: fonts.sansBold, color: COLORS.oliveBrass,
  });
  currentY -= 16;

  const tierWidth = CONTENT_WIDTH / tiers.length;
  tiers.forEach((tier, i) => {
    const tx = MARGIN + i * tierWidth;
    page.drawText(tier.name, { x: tx, y: currentY, size: 9, font: fonts.sansBold, color: COLORS.deepBrown });
    page.drawText(tier.price, { x: tx, y: currentY - 12, size: 11, font: fonts.sansBold, color: COLORS.roseClay });
    const descLines = wrapText(tier.description, fonts.sans, 7, tierWidth - 12);
    descLines.forEach((line, j) => {
      page.drawText(line, { x: tx, y: currentY - 26 - j * 9, size: 7, font: fonts.sans, color: COLORS.warmGray });
    });
  });

  return currentY - 56;
}

// =============================================================================
// COMMUNITY SCHEDULE HELPERS (for CommunityScheduleCycle format)
// =============================================================================

function drawCommunitySchedule(
  doc: PDFDocument,
  cycles: CommunityScheduleCycle[],
  y: number,
  fonts: { serif: PDFFont; sans: PDFFont; sansBold: PDFFont },
  startPage: PDFPage,
  pageNum: { value: number },
): { page: PDFPage; y: number } {
  let currentPage = startPage;
  let currentY = y;

  const colX = [MARGIN, MARGIN + 100, MARGIN + 210, MARGIN + 300, MARGIN + 400];
  const colHeaders = ['Date', ...TZ_KEYS.map(k => TZ_LABELS[k])];

  for (const cycle of cycles) {
    // Check if we need a new page for the cycle title
    if (currentY < MARGIN + 80) {
      pageNum.value++;
      currentPage = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(currentPage);
      drawDecorativeBar(currentPage, PAGE_HEIGHT, 6, COLORS.oliveBrass, 0.2);
      drawPageFooter(currentPage, fonts.sans, pageNum.value);
      currentY = PAGE_HEIGHT - MARGIN;
    }

    // Cycle title
    currentPage.drawText(cycle.title, {
      x: MARGIN,
      y: currentY,
      size: 10,
      font: fonts.sansBold,
      color: COLORS.deepBrown,
    });
    currentY -= 16;

    for (const month of cycle.months) {
      // Estimate space needed: header + column headers + rows
      const neededHeight = 30 + month.sessions.length * 10;
      if (currentY < MARGIN + neededHeight) {
        pageNum.value++;
        currentPage = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        drawPageBg(currentPage);
        drawDecorativeBar(currentPage, PAGE_HEIGHT, 6, COLORS.oliveBrass, 0.2);
        drawPageFooter(currentPage, fonts.sans, pageNum.value);
        currentY = PAGE_HEIGHT - MARGIN;
      }

      // Month header
      currentPage.drawText(month.month, {
        x: MARGIN,
        y: currentY,
        size: 8,
        font: fonts.sansBold,
        color: COLORS.roseClay,
      });
      currentY -= 12;

      // Column headers
      colHeaders.forEach((h, i) => {
        currentPage.drawText(h, { x: colX[i], y: currentY, size: 6, font: fonts.sansBold, color: COLORS.oliveBrass });
      });
      currentY -= 9;

      // Sessions
      for (const session of month.sessions) {
        currentPage.drawText(session.date, {
          x: colX[0], y: currentY, size: 6.5, font: fonts.sans, color: COLORS.softCharcoal,
        });
        TZ_KEYS.forEach((tz, i) => {
          const timeStr = session.time[tz] || '-';
          currentPage.drawText(timeStr.length > 20 ? timeStr.slice(0, 20) : timeStr, {
            x: colX[i + 1], y: currentY, size: 6, font: fonts.sans, color: COLORS.softCharcoal,
          });
        });
        currentY -= 9;
      }
      currentY -= 6;
    }
    currentY -= 8;
  }

  return { page: currentPage, y: currentY };
}

function drawInvestmentOptions(
  page: PDFPage,
  options: InvestmentOption[],
  y: number,
  fonts: { sans: PDFFont; sansBold: PDFFont },
): number {
  let currentY = y;

  page.drawText('INVESTMENT', {
    x: MARGIN, y: currentY, size: 8, font: fonts.sansBold, color: COLORS.oliveBrass,
  });
  currentY -= 16;

  const optWidth = CONTENT_WIDTH / options.length;
  options.forEach((opt, i) => {
    const ox = MARGIN + i * optWidth;
    page.drawText(opt.label, { x: ox, y: currentY, size: 9, font: fonts.sansBold, color: COLORS.deepBrown });
    page.drawText(opt.period, { x: ox, y: currentY - 12, size: 7, font: fonts.sans, color: COLORS.warmGray });
    page.drawText(opt.price, { x: ox, y: currentY - 26, size: 13, font: fonts.sansBold, color: COLORS.roseClay });
  });

  return currentY - 48;
}

// =============================================================================
// PDF GENERATION
// =============================================================================

export async function GET() {
  try {
    const doc = await PDFDocument.create();
    doc.setTitle('ROSES OS - Additional Programs Guide');
    doc.setAuthor('ROSES OS');
    doc.setSubject('Paid Programs: Rose Meditation, Aura for Life, Teachers Training');

    const serifFont = await doc.embedFont(StandardFonts.TimesRoman);
    const serifBold = await doc.embedFont(StandardFonts.TimesRomanBold);
    const serifItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);
    const sansFont = await doc.embedFont(StandardFonts.Helvetica);
    const sansBold = await doc.embedFont(StandardFonts.HelveticaBold);

    const fonts = { serif: serifFont, serifBold, serifItalic, sans: sansFont, sansBold };

    // Load logo
    let logoImage;
    try {
      const logoPath = path.join(process.cwd(), 'public', 'rose.png');
      const logoBytes = await readFile(logoPath);
      logoImage = await doc.embedPng(logoBytes);
    } catch {
      // Logo optional
    }

    // Load brand images
    const [roseImage, communityImage, backcoverImage] = await Promise.all([
      loadAndResizeImage(doc, 'rose med images/level-1/1-the-rose.PNG', 400, 250),
      loadAndResizeImage(doc, 'page-images/page-community.png', 500, 280),
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

      // Decorative top line
      page.drawLine({
        start: { x: PAGE_WIDTH / 2 - 60, y: PAGE_HEIGHT - 80 },
        end: { x: PAGE_WIDTH / 2 + 60, y: PAGE_HEIGHT - 80 },
        thickness: 0.5,
        color: COLORS.roseClay,
        opacity: 0.4,
      });

      // Logo
      if (logoImage) {
        const logoDim = logoImage.scale(0.2);
        const logoW = Math.min(logoDim.width, 120);
        const logoH = logoW * (logoDim.height / logoDim.width);
        page.drawImage(logoImage, {
          x: (PAGE_WIDTH - logoW) / 2,
          y: PAGE_HEIGHT / 2 + 100,
          width: logoW,
          height: logoH,
        });
      }

      // Title
      const title = 'ROSES OS';
      const titleSize = 42;
      const titleWidth = serifFont.widthOfTextAtSize(title, titleSize);
      page.drawText(title, {
        x: (PAGE_WIDTH - titleWidth) / 2,
        y: PAGE_HEIGHT / 2 + 60,
        size: titleSize,
        font: serifFont,
        color: COLORS.deepBrown,
      });

      // Subtitle
      const sub = 'Additional Programs Guide';
      const subSize = 16;
      const subWidth = sansFont.widthOfTextAtSize(sub, subSize);
      page.drawText(sub, {
        x: (PAGE_WIDTH - subWidth) / 2,
        y: PAGE_HEIGHT / 2 + 30,
        size: subSize,
        font: sansFont,
        color: COLORS.oliveBrass,
      });

      // Decorative line
      page.drawLine({
        start: { x: PAGE_WIDTH / 2 - 40, y: PAGE_HEIGHT / 2 + 10 },
        end: { x: PAGE_WIDTH / 2 + 40, y: PAGE_HEIGHT / 2 + 10 },
        thickness: 0.5,
        color: COLORS.roseClay,
        opacity: 0.5,
      });

      // Tagline
      const tagline = 'Rose Meditation, Aura for Life & Teachers Training';
      const tagSize = 11;
      const tagWidth = serifItalic.widthOfTextAtSize(tagline, tagSize);
      page.drawText(tagline, {
        x: (PAGE_WIDTH - tagWidth) / 2,
        y: PAGE_HEIGHT / 2 - 16,
        size: tagSize,
        font: serifItalic,
        color: COLORS.roseClay,
      });

      // Description
      const desc = 'A thorough guide to the paid programs beyond the core Aura Reading courses. Explore continued practice, deepening, and teaching opportunities within the ROSES OS ecosystem.';
      const descLines = wrapText(desc, sansFont, 10, CONTENT_WIDTH - 60);
      let descY = PAGE_HEIGHT / 2 - 60;
      for (const line of descLines) {
        const lw = sansFont.widthOfTextAtSize(line, 10);
        page.drawText(line, {
          x: (PAGE_WIDTH - lw) / 2,
          y: descY,
          size: 10,
          font: sansFont,
          color: COLORS.warmGray,
        });
        descY -= 16;
      }

      // Rose image at bottom
      if (roseImage) {
        const imgScale = Math.min(180 / roseImage.width, 140 / roseImage.height);
        const imgW = roseImage.width * imgScale;
        const imgH = roseImage.height * imgScale;
        page.drawImage(roseImage, {
          x: (PAGE_WIDTH - imgW) / 2,
          y: 90,
          width: imgW,
          height: imgH,
          opacity: 0.6,
        });
      }

      // Bottom
      const url = 'rosesos.com';
      const urlWidth = sansFont.widthOfTextAtSize(url, 9);
      page.drawText(url, {
        x: (PAGE_WIDTH - urlWidth) / 2,
        y: 60,
        size: 9,
        font: sansFont,
        color: COLORS.warmGray,
      });

      page.drawLine({
        start: { x: PAGE_WIDTH / 2 - 60, y: 80 },
        end: { x: PAGE_WIDTH / 2 + 60, y: 80 },
        thickness: 0.5,
        color: COLORS.roseClay,
        opacity: 0.4,
      });
    }

    // =========================================================================
    // PAGE 2 — ROSE MEDITATION (STANDALONE)
    // =========================================================================
    {
      pageNum++;
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(page);
      drawDecorativeBar(page, PAGE_HEIGHT, 6, COLORS.terracotta, 0.2);
      drawPageFooter(page, sansFont, pageNum);
      let y = PAGE_HEIGHT - MARGIN;

      const roseProg = programs.find(p => p.id === '3');
      if (roseProg) {
        y = drawSectionLabel(page, 'Rose Meditation — Standalone Program', y, sansBold);
        y = drawHeading(page, roseProg.title, y, serifFont, 22);
        y = drawSubheading(page, roseProg.subtitle, y, sansFont, 11);
        y -= 4;

        // Key details
        const details = [
          `Duration: ${roseProg.duration}`,
          `Dates: ${roseProg.dates}`,
          `Format: ${roseProg.format}`,
        ];
        for (const detail of details) {
          page.drawText(detail, { x: MARGIN, y, size: 9, font: sansFont, color: COLORS.warmGray });
          y -= 13;
        }
        y -= 6;

        y = drawWrappedText(page, roseProg.description, MARGIN, y, sansFont, 9, CONTENT_WIDTH, COLORS.softCharcoal, 1.5);
        y -= 12;

        // What's included
        page.drawText("WHAT'S INCLUDED", { x: MARGIN, y, size: 8, font: sansBold, color: COLORS.oliveBrass });
        y -= 14;
        for (const item of roseProg.includes || []) {
          y = drawBullet(page, item, MARGIN, y, sansFont, 8.5, CONTENT_WIDTH);
          y -= 3;
        }
        y -= 8;

        y = drawHRule(page, y);

        // Schedule
        page.drawText('SCHEDULE', { x: MARGIN, y, size: 8, font: sansBold, color: COLORS.oliveBrass });
        y -= 16;
        for (const stage of roseMeditationScheduleStages) {
          y = drawScheduleTable(page, stage.title, stage.dateRange, stage.sessions, y, fonts);
        }
        y -= 4;

        y = drawHRule(page, y);

        // Tiers
        y = drawTiers(page, roseMeditationTiers, y, fonts);
      }
    }

    // =========================================================================
    // PAGE 3 — AURA FOR LIFE (OVERVIEW + INVESTMENT)
    // =========================================================================
    {
      pageNum++;
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(page);
      drawDecorativeBar(page, PAGE_HEIGHT, 6, COLORS.oliveBrass, 0.2);
      drawPageFooter(page, sansFont, pageNum);
      let y = PAGE_HEIGHT - MARGIN;

      const aflProg = paidPrograms.find(p => p.id === 'aura-for-life');
      if (aflProg) {
        y = drawSectionLabel(page, 'Continued Practice', y, sansBold);
        y = drawHeading(page, 'Aura for Life', y, serifFont, 26);
        y -= 4;

        y = drawWrappedText(page, aflProg.description, MARGIN, y, sansFont, 10, CONTENT_WIDTH, COLORS.softCharcoal, 1.6);
        y -= 16;

        y = drawHRule(page, y);

        // Who it's for
        y = drawSectionLabel(page, 'Who This Is For', y, sansBold);
        y = drawWrappedText(page,
          'Practitioners who have completed the Aura Reading path and wish to continue developing their reading skills, deepen their perception, and remain connected to the community.',
          MARGIN, y, sansFont, 9.5, CONTENT_WIDTH);
        y -= 12;

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
          y = drawBullet(page, point, MARGIN, y, sansFont, 9, CONTENT_WIDTH);
          y -= 3;
        }
        y -= 8;

        y = drawHRule(page, y);

        // Investment
        y = drawInvestmentOptions(page, auraForLifeInvestment, y, fonts);
        y -= 8;

        y = drawHRule(page, y);

        // Schedule overview note
        y = drawSectionLabel(page, 'Schedule', y, sansBold);
        y = drawWrappedText(page,
          'The full 2026 schedule is organized into two cycles: Cycle 1 (February to July) and Cycle 2 (August to December). Sessions are held weekly, primarily on Tuesdays. See the following pages for the complete schedule with times in multiple timezones.',
          MARGIN, y, sansFont, 9, CONTENT_WIDTH, COLORS.warmGray);
      }
    }

    // =========================================================================
    // PAGES 4+ — AURA FOR LIFE SCHEDULE (may span multiple pages)
    // =========================================================================
    {
      pageNum++;
      let schedulePage = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(schedulePage);
      drawDecorativeBar(schedulePage, PAGE_HEIGHT, 6, COLORS.oliveBrass, 0.2);
      drawPageFooter(schedulePage, sansFont, pageNum);
      let y = PAGE_HEIGHT - MARGIN;

      y = drawSectionLabel(schedulePage, 'Aura for Life — 2026 Schedule', y, sansBold);
      y = drawHeading(schedulePage, 'Complete Class Schedule', y, serifFont, 20);
      y -= 8;

      const pageNumRef = { value: pageNum };
      const result = drawCommunitySchedule(doc, auraForLifeSchedule, y, fonts, schedulePage, pageNumRef);
      pageNum = pageNumRef.value;
      // result.page and result.y track current position after schedule rendering
    }

    // =========================================================================
    // TEACHERS TRAINING — OVERVIEW
    // =========================================================================
    {
      pageNum++;
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(page);
      drawDecorativeBar(page, PAGE_HEIGHT, 6, COLORS.roseClay, 0.25);
      drawPageFooter(page, sansFont, pageNum);
      let y = PAGE_HEIGHT - MARGIN;

      const ttProg = paidPrograms.find(p => p.id === 'teachers-training');
      if (ttProg) {
        y = drawSectionLabel(page, 'Teaching Path', y, sansBold);
        y = drawHeading(page, 'Rose Meditation Teachers Training', y, serifFont, 20);
        y -= 4;

        y = drawWrappedText(page, ttProg.description, MARGIN, y, sansFont, 9, CONTENT_WIDTH, COLORS.softCharcoal, 1.5);
        y -= 12;

        y = drawHRule(page, y);

        // Facilitation
        if (ttProg.facilitation) {
          y = drawSectionLabel(page, 'Facilitation', y, sansBold);
          y = drawWrappedText(page, ttProg.facilitation, MARGIN, y, sansFont, 10, CONTENT_WIDTH, COLORS.deepBrown);
          y -= 12;
        }

        // Detail sections (requirements, class structure, etc.)
        if (ttProg.detailSections) {
          for (const section of ttProg.detailSections) {
            y = drawSectionLabel(page, section.heading, y, sansBold);
            y = drawWrappedText(page, section.body, MARGIN, y, sansFont, 9, CONTENT_WIDTH, COLORS.softCharcoal, 1.5);
            if (section.bullets) {
              y -= 4;
              for (const bullet of section.bullets) {
                y = drawBullet(page, bullet, MARGIN, y, sansFont, 9, CONTENT_WIDTH);
                y -= 3;
              }
            }
            y -= 8;
          }
        }

        y = drawHRule(page, y);

        // Investment
        y = drawInvestmentOptions(page, teachersTrainingInvestment, y, fonts);
        y -= 8;

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
      drawPageBg(schedulePage);
      drawDecorativeBar(schedulePage, PAGE_HEIGHT, 6, COLORS.roseClay, 0.25);
      drawPageFooter(schedulePage, sansFont, pageNum);
      let y = PAGE_HEIGHT - MARGIN;

      y = drawSectionLabel(schedulePage, 'Teachers Training — 2026 Schedule', y, sansBold);
      y = drawHeading(schedulePage, 'Complete Class Schedule', y, serifFont, 20);
      y -= 8;

      const pageNumRef = { value: pageNum };
      const result = drawCommunitySchedule(doc, teachersTrainingSchedule, y, fonts, schedulePage, pageNumRef);
      pageNum = pageNumRef.value;
    }

    // =========================================================================
    // FINAL PAGE — CONTACT & NEXT STEPS
    // =========================================================================
    {
      pageNum++;
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(page);
      drawDecorativeBar(page, PAGE_HEIGHT, 6, COLORS.roseClay, 0.3);

      // Soft rose background accent behind contact section
      page.drawRectangle({
        x: MARGIN + 40, y: 220,
        width: CONTENT_WIDTH - 80, height: 300,
        color: COLORS.lightRose,
        borderColor: COLORS.roseClay,
        borderWidth: 0.5,
        opacity: 0.5,
      });

      let y = PAGE_HEIGHT - MARGIN - 40;

      // Decorative top line
      page.drawLine({
        start: { x: PAGE_WIDTH / 2 - 60, y: y + 50 },
        end: { x: PAGE_WIDTH / 2 + 60, y: y + 50 },
        thickness: 0.5,
        color: COLORS.roseClay,
        opacity: 0.4,
      });

      // Backcover logo
      if (backcoverImage) {
        const imgScale = Math.min(120 / backcoverImage.width, 120 / backcoverImage.height);
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
      const heading = 'Continue Your Journey';
      const headSize = 28;
      const headWidth = serifFont.widthOfTextAtSize(heading, headSize);
      page.drawText(heading, {
        x: (PAGE_WIDTH - headWidth) / 2,
        y,
        size: headSize,
        font: serifFont,
        color: COLORS.deepBrown,
      });
      y -= 28;

      // Quote
      const quote = brandQuotes.find(q => q.id === '5')?.text || 'The way is open. Welcome home.';
      const quoteSize = 14;
      const quoteLines = wrapText(quote, serifItalic, quoteSize, CONTENT_WIDTH - 60);
      for (const line of quoteLines) {
        const lw = serifItalic.widthOfTextAtSize(line, quoteSize);
        page.drawText(line, {
          x: (PAGE_WIDTH - lw) / 2,
          y,
          size: quoteSize,
          font: serifItalic,
          color: COLORS.roseClay,
        });
        y -= quoteSize * 1.5;
      }
      y -= 16;

      y = drawHRule(page, y);

      // Contact card
      const cardX = MARGIN + 60;
      const contactMaxW = CONTENT_WIDTH - 120;

      page.drawText('CONTACT', { x: cardX, y, size: 8, font: sansBold, color: COLORS.oliveBrass });
      y -= 20;

      page.drawText('Dara Ayoub', { x: cardX, y, size: 16, font: serifBold, color: COLORS.deepBrown });
      y -= 16;

      page.drawText('Guardian of Community & Programs', { x: cardX, y, size: 10, font: sansFont, color: COLORS.roseClay });
      y -= 20;

      y = drawWrappedText(page,
        'Reach out to Dara for questions about enrollment, schedule, contribution tiers, or anything about your journey with ROSES OS.',
        cardX, y, sansFont, 9, contactMaxW, COLORS.softCharcoal);
      y -= 16;

      // WhatsApp
      page.drawText('WhatsApp', { x: cardX, y, size: 8, font: sansBold, color: COLORS.oliveBrass });
      y -= 12;
      page.drawText('+55 11 99633-0135', { x: cardX, y, size: 10, font: sansFont, color: COLORS.softCharcoal });
      y -= 18;

      // Email
      page.drawText('Email', { x: cardX, y, size: 8, font: sansBold, color: COLORS.oliveBrass });
      y -= 12;
      page.drawText('dani.ayoub88@gmail.com', { x: cardX, y, size: 10, font: sansFont, color: COLORS.softCharcoal });
      y -= 18;

      // Website
      page.drawText('Website', { x: cardX, y, size: 8, font: sansBold, color: COLORS.oliveBrass });
      y -= 12;
      page.drawText('rosesos.com', { x: cardX, y, size: 10, font: sansFont, color: COLORS.softCharcoal });
      y -= 30;

      y = drawHRule(page, y);

      // Closing quote
      const closingQuote = brandQuotes.find(q => q.id === '1')?.text || '';
      const closingSize = 12;
      const closingLines = wrapText(closingQuote, serifItalic, closingSize, CONTENT_WIDTH - 80);
      for (const line of closingLines) {
        const lw = serifItalic.widthOfTextAtSize(line, closingSize);
        page.drawText(line, {
          x: (PAGE_WIDTH - lw) / 2,
          y,
          size: closingSize,
          font: serifItalic,
          color: COLORS.warmGray,
        });
        y -= closingSize * 1.5;
      }

      // Bottom decorative line
      page.drawLine({
        start: { x: PAGE_WIDTH / 2 - 60, y: 80 },
        end: { x: PAGE_WIDTH / 2 + 60, y: 80 },
        thickness: 0.5,
        color: COLORS.roseClay,
        opacity: 0.4,
      });

      const bottomUrl = 'rosesos.com';
      const bottomUrlW = sansFont.widthOfTextAtSize(bottomUrl, 8);
      page.drawText(bottomUrl, {
        x: (PAGE_WIDTH - bottomUrlW) / 2,
        y: 60,
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
