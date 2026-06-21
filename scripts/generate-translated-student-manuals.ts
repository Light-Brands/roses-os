/**
 * Generate Translated Student Manual HTML files
 *
 * Reads each EN student-manual template (roses-manual-{1,2,3}.html) and a
 * translations map (student-manual-translations.json), then produces
 * roses-manual-{level}-{locale}.html for ES and PT.
 *
 * Translation is applied as plain string replacement on the raw HTML, longest
 * key first, so structure / classes / image paths / page numbers stay byte-for-
 * byte identical and only the human-readable text changes. Proper nouns (the
 * school name, people's names) are deliberately NOT in the map, so they stay in
 * the original. These are AI translations meant as a starting point for the
 * teachers to refine in the editor.
 *
 * Usage:
 *   npx tsx scripts/generate-translated-student-manuals.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const MANUAL_DIR = path.join(ROOT, 'scripts', 'pdf-manuals');
const TRANSLATIONS_PATH = path.join(MANUAL_DIR, 'student-manual-translations.json');

const LEVELS = ['1', '2', '3'] as const;
const LOCALES = ['es', 'pt', 'ru', 'uk'] as const;

type Locale = (typeof LOCALES)[number];
type Translations = Record<string, Record<Locale, Record<string, string>>>;

function applyTranslations(html: string, map: Record<string, string>): string {
  // Replace the longest source strings first so a short phrase never clobbers a
  // longer one that contains it (e.g. "Grounding Cord" inside "Expansion of the
  // Grounding Cord"). Once a span is translated its text no longer contains the
  // English source, so later (shorter) replacements can't touch it.
  const keys = Object.keys(map).sort((a, b) => b.length - a.length);
  let out = html;
  for (const key of keys) {
    if (!map[key]) continue; // skip empty translations
    out = out.split(key).join(map[key]);
  }
  return out;
}

function main() {
  const translations: Translations = JSON.parse(fs.readFileSync(TRANSLATIONS_PATH, 'utf8'));

  console.log('=========================================================');
  console.log('  International Aura and Dream School — Student Manual i18n');
  console.log('=========================================================\n');

  for (const level of LEVELS) {
    const templatePath = path.join(MANUAL_DIR, `roses-manual-${level}.html`);
    if (!fs.existsSync(templatePath)) {
      console.log(`  [L${level}] template missing, skipping: ${templatePath}`);
      continue;
    }
    const template = fs.readFileSync(templatePath, 'utf8');
    const perLevel = translations[level];
    if (!perLevel) {
      console.log(`  [L${level}] no translations entry, skipping`);
      continue;
    }

    for (const locale of LOCALES) {
      const map = perLevel[locale];
      if (!map) {
        console.log(`  [L${level}/${locale}] no map, skipping`);
        continue;
      }
      let translated = applyTranslations(template, map);
      translated = translated.replace('<html lang="en">', `<html lang="${locale}">`);
      const outPath = path.join(MANUAL_DIR, `roses-manual-${level}-${locale}.html`);
      fs.writeFileSync(outPath, translated, 'utf8');
      const untranslated = Object.keys(map).filter((k) => map[k] && translated.includes(k)).length;
      console.log(
        `  [L${level}/${locale}] wrote ${path.basename(outPath)} (${translated.length} chars` +
          (untranslated ? `, ${untranslated} keys still present — check for nested overlaps` : '') +
          ')'
      );
    }
  }

  console.log('\n=========================================================');
  console.log('  Done. Translated student-manual HTML generated.');
  console.log('=========================================================\n');
}

main();
