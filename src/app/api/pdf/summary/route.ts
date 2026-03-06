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
  aura2ScheduleStages,
  contributionTiers,
  roseMeditationTiers,
  messagingPillars,
  brandQuotes,
  freePrograms,
  lineageEntries,
} from '@/lib/data';

import {
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

    // Resize with sharp to keep PDF size reasonable
    const resized = await sharp(raw)
      .resize(Math.round(maxWidth * 2), Math.round(maxHeight * 2), { fit: 'inside', withoutEnlargement: true })
      .png({ quality: 80, compressionLevel: 9 })
      .toBuffer();

    if (ext.endsWith('.jpg') || ext.endsWith('.jpeg')) {
      const jpg = await sharp(raw)
        .resize(Math.round(maxWidth * 2), Math.round(maxHeight * 2), { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 75 })
        .toBuffer();
      return await doc.embedJpg(jpg);
    }
    return await doc.embedPng(resized);
  } catch {
    return null;
  }
}

function drawImageCentered(
  page: PDFPage,
  image: PDFImage,
  y: number,
  maxWidth: number,
  maxHeight: number,
): number {
  const scale = Math.min(maxWidth / image.width, maxHeight / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  page.drawImage(image, {
    x: (PAGE_WIDTH - w) / 2,
    y: y - h,
    width: w,
    height: h,
  });
  return y - h - 12;
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

  // Title + date range
  page.drawText(`${title}  |  ${dateRange}`, {
    x: MARGIN,
    y: currentY,
    size: 9,
    font: fonts.sansBold,
    color: COLORS.deepBrown,
  });
  currentY -= 14;

  // Column headers
  const colX = [MARGIN, MARGIN + 145, MARGIN + 255, MARGIN + 345, MARGIN + 425];
  const headers = ['Session', ...TZ_KEYS.map(k => TZ_LABELS[k])];
  headers.forEach((h, i) => {
    page.drawText(h, { x: colX[i], y: currentY, size: 6.5, font: fonts.sansBold, color: COLORS.oliveBrass });
  });
  currentY -= 10;

  // Rows
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
// PDF GENERATION
// =============================================================================

export async function GET() {
  try {
    const doc = await PDFDocument.create();
    doc.setTitle('ROSES OS - Complete Guide');
    doc.setAuthor('ROSES OS');
    doc.setSubject('Programs, Schedule, and Community');

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

    // Load brand images (resized for reasonable PDF size)
    const [homeImage, roseImage, theRoseImage, communityImage] = await Promise.all([
      loadAndResizeImage(doc, 'page-images/page-home.png', 500, 300),
      loadAndResizeImage(doc, 'rose med images/1-the-rose.PNG', 400, 250),
      loadAndResizeImage(doc, 'page-images/page-the-rose.png', 500, 280),
      loadAndResizeImage(doc, 'page-images/page-community.png', 500, 280),
    ]);

    // =========================================================================
    // PAGE 1 — COVER
    // =========================================================================
    {
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
          y: PAGE_HEIGHT / 2 + 60,
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
        y: PAGE_HEIGHT / 2 + 20,
        size: titleSize,
        font: serifFont,
        color: COLORS.deepBrown,
      });

      // Tagline
      const tagline = 'Technologies of Remembrance';
      const tagSize = 12;
      const tagWidth = sansFont.widthOfTextAtSize(tagline, tagSize);
      page.drawText(tagline, {
        x: (PAGE_WIDTH - tagWidth) / 2,
        y: PAGE_HEIGHT / 2 - 10,
        size: tagSize,
        font: sansFont,
        color: COLORS.oliveBrass,
      });

      // Decorative line
      page.drawLine({
        start: { x: PAGE_WIDTH / 2 - 40, y: PAGE_HEIGHT / 2 - 30 },
        end: { x: PAGE_WIDTH / 2 + 40, y: PAGE_HEIGHT / 2 - 30 },
        thickness: 0.5,
        color: COLORS.roseClay,
        opacity: 0.5,
      });

      // Subtitle
      const sub = 'Remember Who You Are';
      const subSize = 16;
      const subWidth = serifItalic.widthOfTextAtSize(sub, subSize);
      page.drawText(sub, {
        x: (PAGE_WIDTH - subWidth) / 2,
        y: PAGE_HEIGHT / 2 - 60,
        size: subSize,
        font: serifItalic,
        color: COLORS.roseClay,
      });

      // Home image at bottom of cover
      if (homeImage) {
        const imgScale = Math.min(CONTENT_WIDTH / homeImage.width, 200 / homeImage.height);
        const imgW = homeImage.width * imgScale;
        const imgH = homeImage.height * imgScale;
        page.drawImage(homeImage, {
          x: (PAGE_WIDTH - imgW) / 2,
          y: 100,
          width: imgW,
          height: imgH,
          opacity: 0.7,
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

      // Bottom decorative line
      page.drawLine({
        start: { x: PAGE_WIDTH / 2 - 60, y: 80 },
        end: { x: PAGE_WIDTH / 2 + 60, y: 80 },
        thickness: 0.5,
        color: COLORS.roseClay,
        opacity: 0.4,
      });
    }

    // =========================================================================
    // PAGE 2 — ABOUT & VISION
    // =========================================================================
    {
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(page);
      // Decorative rose bar at top
      drawDecorativeBar(page, PAGE_HEIGHT, 6, COLORS.roseClay, 0.25);
      drawPageFooter(page, sansFont, 2);
      let y = PAGE_HEIGHT - MARGIN;

      y = drawSectionLabel(page, 'About Roses OS', y, sansBold);
      y = drawHeading(page, brandQuotes.find(q => q.id === '6')?.text || '', y, serifFont, 20);
      y -= 8;

      y = drawWrappedText(page,
        'ROSES OS is a living consciousness ecosystem rooted in more than three decades of lineage. It offers a path of remembrance through Rose Meditation and Aura Reading \u2014 two powerful technologies that cleanse, protect, and awaken the energy field, restoring you to your original coherence.',
        MARGIN, y, sansFont, 10, CONTENT_WIDTH);
      y -= 8;

      y = drawWrappedText(page,
        'This is not a course to consume. It is an initiatic journey to remember who you are, to perceive the subtle energies that shape your life, and to live from the truth of your own essence.',
        MARGIN, y, sansFont, 10, CONTENT_WIDTH);
      y -= 16;

      y = drawHRule(page, y);

      // Stats
      const stats = [
        { value: '30+', label: 'Years of Lineage' },
        { value: '5,000+', label: 'Initiates' },
        { value: '50+', label: 'Countries' },
      ];
      const statWidth = CONTENT_WIDTH / 3;
      stats.forEach((stat, i) => {
        const sx = MARGIN + i * statWidth + statWidth / 2;
        const valW = serifBold.widthOfTextAtSize(stat.value, 22);
        page.drawText(stat.value, { x: sx - valW / 2, y, size: 22, font: serifBold, color: COLORS.roseClay });
        const labW = sansFont.widthOfTextAtSize(stat.label, 8);
        page.drawText(stat.label, { x: sx - labW / 2, y: y - 16, size: 8, font: sansFont, color: COLORS.warmGray });
      });
      y -= 44;

      y = drawHRule(page, y);

      // Lineage
      y = drawSectionLabel(page, 'Lineage', y, sansBold);
      for (const entry of lineageEntries) {
        page.drawText(`${entry.year}`, { x: MARGIN, y, size: 9, font: sansBold, color: COLORS.roseClay });
        page.drawText(entry.name, { x: MARGIN + 50, y, size: 9, font: sansBold, color: COLORS.deepBrown });
        y -= 12;
        y = drawWrappedText(page, entry.description, MARGIN + 50, y, sansFont, 8, CONTENT_WIDTH - 50, COLORS.warmGray);
        y -= 8;
      }

      y -= 8;
      y = drawHRule(page, y);

      // Who it's for
      y = drawSectionLabel(page, 'Who This Is For', y, sansBold);
      const traits = ['Seekers ready to remember', 'Healers deepening their practice', 'Teachers called to transmit', 'Leaders rooted in coherence', 'Creators living from essence'];
      for (const trait of traits) {
        y = drawBullet(page, trait, MARGIN, y, sansFont, 9, CONTENT_WIDTH);
        y -= 2;
      }
    }

    // =========================================================================
    // PAGE 3 — ROSE MEDITATION
    // =========================================================================
    {
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(page);
      drawDecorativeBar(page, PAGE_HEIGHT, 6, COLORS.terracotta, 0.2);
      drawPageFooter(page, sansFont, 3);
      let y = PAGE_HEIGHT - MARGIN;

      const roseProg = programs.find(p => p.id === '3');
      if (roseProg) {
        y = drawSectionLabel(page, 'The Rose Meditation', y, sansBold);
        y = drawHeading(page, roseProg.title, y, serifFont, 22);
        y = drawSubheading(page, `${roseProg.subtitle}  |  ${roseProg.duration}  |  ${roseProg.dates}`, y, sansFont, 10);
        y -= 4;
        y = drawSubheading(page, `Format: ${roseProg.format}`, y, sansFont, 9);
        y -= 4;

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
    // PAGE 4 — AURA 1
    // =========================================================================
    {
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(page);
      drawDecorativeBar(page, PAGE_HEIGHT, 6, COLORS.oliveBrass, 0.2);
      drawPageFooter(page, sansFont, 4);
      let y = PAGE_HEIGHT - MARGIN;

      const auraProg = programs.find(p => p.id === '1');
      if (auraProg) {
        y = drawSectionLabel(page, 'Aura Reading Level 1', y, sansBold);
        y = drawHeading(page, `${auraProg.title}: ${auraProg.subtitle}`, y, serifFont, 20);
        y = drawSubheading(page, `${auraProg.duration}  |  ${auraProg.dates}  |  ${auraProg.format}`, y, sansFont, 9);
        y -= 4;

        y = drawWrappedText(page, auraProg.description, MARGIN, y, sansFont, 8.5, CONTENT_WIDTH, COLORS.softCharcoal, 1.45);
        y -= 10;

        // What's included
        page.drawText("WHAT'S INCLUDED", { x: MARGIN, y, size: 8, font: sansBold, color: COLORS.oliveBrass });
        y -= 14;
        for (const item of auraProg.includes || []) {
          y = drawBullet(page, item, MARGIN, y, sansFont, 8, CONTENT_WIDTH);
          y -= 2;
        }
        y -= 8;

        y = drawHRule(page, y);

        // Schedule (compact — show key stages)
        page.drawText('SCHEDULE OVERVIEW', { x: MARGIN, y, size: 8, font: sansBold, color: COLORS.oliveBrass });
        y -= 14;
        for (const stage of scheduleStages) {
          y = drawScheduleTable(page, stage.title, stage.dateRange, stage.sessions.slice(0, 3), y, fonts);
          if (y < MARGIN + 40) break;
        }
        y -= 4;

        y = drawHRule(page, y);

        // Tiers
        y = drawTiers(page, contributionTiers, y, fonts);
      }
    }

    // =========================================================================
    // PAGE 5 — AURA 2
    // =========================================================================
    {
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(page);
      drawDecorativeBar(page, PAGE_HEIGHT, 6, COLORS.oliveBrass, 0.2);
      drawPageFooter(page, sansFont, 5);
      let y = PAGE_HEIGHT - MARGIN;

      const aura2Prog = programs.find(p => p.id === '2');
      if (aura2Prog) {
        y = drawSectionLabel(page, 'Aura Reading Level 2', y, sansBold);
        y = drawHeading(page, `${aura2Prog.title}: ${aura2Prog.subtitle}`, y, serifFont, 20);
        y = drawSubheading(page, `${aura2Prog.duration}  |  ${aura2Prog.dates}  |  ${aura2Prog.format}`, y, sansFont, 9);
        y -= 4;

        y = drawWrappedText(page, aura2Prog.description, MARGIN, y, sansFont, 9, CONTENT_WIDTH, COLORS.softCharcoal, 1.5);
        y -= 10;

        // What's included
        page.drawText("WHAT'S INCLUDED", { x: MARGIN, y, size: 8, font: sansBold, color: COLORS.oliveBrass });
        y -= 14;
        for (const item of aura2Prog.includes || []) {
          y = drawBullet(page, item, MARGIN, y, sansFont, 8.5, CONTENT_WIDTH);
          y -= 3;
        }
        y -= 8;

        y = drawHRule(page, y);

        // Schedule
        page.drawText('SCHEDULE', { x: MARGIN, y, size: 8, font: sansBold, color: COLORS.oliveBrass });
        y -= 14;
        for (const stage of aura2ScheduleStages) {
          y = drawScheduleTable(page, stage.title, stage.dateRange, stage.sessions, y, fonts);
        }
        y -= 4;

        y = drawHRule(page, y);

        // Tiers
        y = drawTiers(page, contributionTiers, y, fonts);
      }
    }

    // =========================================================================
    // PAGE 6 — SIX PILLARS
    // =========================================================================
    {
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(page);
      drawDecorativeBar(page, PAGE_HEIGHT, 6, COLORS.roseClay, 0.25);
      drawPageFooter(page, sansFont, 6);
      let y = PAGE_HEIGHT - MARGIN;

      // Rose image at top
      if (theRoseImage) {
        y = drawImageCentered(page, theRoseImage, y, CONTENT_WIDTH, 160);
        y -= 4;
      }

      y = drawSectionLabel(page, 'What This Journey Awakens', y, sansBold);
      y = drawHeading(page, 'The Six Pillars', y, serifFont, 24);
      y -= 8;

      for (const pillar of messagingPillars) {
        // Title
        page.drawText(pillar.title, {
          x: MARGIN, y, size: 12, font: serifBold, color: COLORS.roseClay,
        });
        y -= 16;

        y = drawWrappedText(page, pillar.description, MARGIN, y, sansFont, 9, CONTENT_WIDTH, COLORS.softCharcoal, 1.5);
        y -= 14;

        if (y < MARGIN + 40) break;
      }
    }

    // =========================================================================
    // PAGE 7 — COMMUNITY
    // =========================================================================
    {
      const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawPageBg(page);
      drawDecorativeBar(page, PAGE_HEIGHT, 6, COLORS.terracotta, 0.2);
      drawPageFooter(page, sansFont, 7);
      let y = PAGE_HEIGHT - MARGIN;

      // Community image at top
      if (communityImage) {
        y = drawImageCentered(page, communityImage, y, CONTENT_WIDTH, 140);
        y -= 4;
      }

      y = drawSectionLabel(page, 'Community', y, sansBold);
      y = drawHeading(page, 'Join a Living Field of Practice', y, serifFont, 22);
      y -= 4;

      y = drawWrappedText(page,
        'Beyond the courses, ROSES OS offers a vibrant community of practice. Free weekly gatherings, guided meditations, and monthly meetings sustain your journey and deepen your connection with fellow practitioners around the world.',
        MARGIN, y, sansFont, 9.5, CONTENT_WIDTH);
      y -= 14;

      y = drawHRule(page, y);

      // Free programs
      page.drawText('FREE PROGRAMS', { x: MARGIN, y, size: 8, font: sansBold, color: COLORS.oliveBrass });
      y -= 16;

      for (const prog of freePrograms) {
        page.drawText(prog.title, { x: MARGIN, y, size: 11, font: serifBold, color: COLORS.deepBrown });
        if (prog.free) {
          const titleW = serifBold.widthOfTextAtSize(prog.title, 11);
          page.drawText('  FREE', { x: MARGIN + titleW + 4, y: y + 1, size: 7, font: sansBold, color: COLORS.oliveBrass });
        }
        y -= 14;

        y = drawWrappedText(page, prog.description, MARGIN, y, sansFont, 8.5, CONTENT_WIDTH, COLORS.softCharcoal, 1.4);
        y -= 4;

        if (prog.schedule) {
          page.drawText(`Schedule: ${prog.schedule}`, { x: MARGIN, y, size: 8, font: sansFont, color: COLORS.warmGray });
          y -= 10;
        }
        if (prog.audience) {
          page.drawText(`For: ${prog.audience}`, { x: MARGIN, y, size: 8, font: sansFont, color: COLORS.warmGray });
          y -= 10;
        }
        y -= 10;
      }

      y = drawHRule(page, y);

      // Teachers Training
      page.drawText('TEACHERS TRAINING', { x: MARGIN, y, size: 8, font: sansBold, color: COLORS.oliveBrass });
      y -= 16;

      y = drawWrappedText(page,
        'For those called to teach and transmit this work. A structured training program held across two cycles per year, deepening your capacity to hold space and guide others.',
        MARGIN, y, sansFont, 9, CONTENT_WIDTH);
      y -= 10;

      for (const inv of teachersTrainingInvestment) {
        page.drawText(`${inv.label} (${inv.period}): ${inv.price}`, {
          x: MARGIN, y, size: 9, font: sansFont, color: COLORS.softCharcoal,
        });
        y -= 12;
      }
    }

    // =========================================================================
    // PAGE 8 — CONTACT & NEXT STEPS
    // =========================================================================
    {
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

      // Heading
      const heading = 'Begin Your Journey';
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
      const quoteWidth = serifItalic.widthOfTextAtSize(quote, quoteSize);
      page.drawText(quote, {
        x: (PAGE_WIDTH - quoteWidth) / 2,
        y,
        size: quoteSize,
        font: serifItalic,
        color: COLORS.roseClay,
      });
      y -= 40;

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
