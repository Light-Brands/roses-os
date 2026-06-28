/**
 * Draft-PDF-from-edits generation (decision D-22, spec 005 T-013 + T-014).
 *
 * Policy A stands: the downloaded "Designed print original" stays the canonical
 * hand-designed PDF (`pdf-map.ts`). This module is the SEPARATE, clearly-labeled
 * "Draft PDF from your edits" path: it runs the current editor blocks through the
 * existing `blocksToHtml` and the existing Puppeteer `html-to-pdf` step, server
 * side, and returns the bytes. It never replaces the master and never converges
 * onto one Download button (that stays gated behind the fidelity bar, T-015).
 *
 * T-014 portability: the Chrome executable is resolved from the environment and a
 * cross-platform path list, never the single Mac Chrome path the original
 * `scripts/pdf-manuals/html-to-pdf.ts` hard-coded. For a serverless deploy
 * (Vercel), set PUPPETEER_EXECUTABLE_PATH to a bundled/serverless Chromium (e.g.
 * `@sparticuz/chromium`) — `resolveChromeExecutable` honors it first.
 */

import { existsSync } from 'fs';
import type { ManualBlock } from './types';
import { blocksToHtml } from './export-html';

/** Candidate Chrome/Chromium executables by platform, tried after the env vars.
 *  Keeps the route off the single Mac path the script was pinned to (T-014). */
const CHROME_CANDIDATES: Record<string, string[]> = {
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ],
  win32: [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  ],
  linux: [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ],
};

/**
 * Resolve a Chrome executable path portably. Order: PUPPETEER_EXECUTABLE_PATH (the
 * serverless/bundled-Chromium hook), then CHROME_PATH (legacy), then the first
 * existing platform candidate. Throws a named error if none is found so the route
 * returns a clear envelope instead of a Puppeteer stack trace.
 */
export function resolveChromeExecutable(): string {
  const fromEnv = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH;
  if (fromEnv) return fromEnv;
  const candidates = CHROME_CANDIDATES[process.platform] ?? [];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  throw new Error(
    'NO_CHROME: no Chrome/Chromium executable found. Set PUPPETEER_EXECUTABLE_PATH ' +
      '(a serverless Chromium such as @sparticuz/chromium on Vercel) or CHROME_PATH.',
  );
}

/**
 * Render the current blocks to a draft PDF (Buffer). Pure of any storage; the
 * caller (the API route) sets the response headers. `origin` resolves
 * public-folder image paths to absolute URLs so figures are not blank.
 */
export async function blocksToPdf(blocks: ManualBlock[], title: string, origin = ''): Promise<Buffer> {
  const html = blocksToHtml(blocks, title, origin);
  const executablePath = resolveChromeExecutable();
  // puppeteer-core is the only Puppeteer package installed; it needs an external
  // executable, which resolveChromeExecutable provides.
  const puppeteer = (await import('puppeteer-core')).default;
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluateHandle('document.fonts.ready');
    const pdf = await page.pdf({
      width: '8.5in',
      height: '11in',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      preferCSSPageSize: true,
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
