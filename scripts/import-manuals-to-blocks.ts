/**
 * Import existing HTML manuals into Supabase manual_blocks
 *
 * Parses the handcrafted HTML manuals in scripts/pdf-manuals/ and converts
 * them into block-based content in the manual_blocks table.
 *
 * Usage: npx tsx scripts/import-manuals-to-blocks.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load env from .env.local manually
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// =============================================================================
// TYPES
// =============================================================================

interface Block {
  block_type: 'heading' | 'text' | 'image' | 'divider' | 'page-break';
  content: Record<string, unknown>;
}

// =============================================================================
// HTML PARSER — extract blocks from manual HTML
// =============================================================================

function parseManualHtml(html: string, level: number): Block[] {
  const blocks: Block[] = [];

  // Remove style/head section — get just the body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!bodyMatch) return blocks;
  const body = bodyMatch[1];

  // Split into pages
  const pages = body.split(/<div class="page[^"]*">/i).slice(1); // skip before first page

  for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
    const page = pages[pageIdx];

    // Skip cover page (page 0) and closing page (last) — extract title from cover
    if (pageIdx === 0) {
      // Extract title from cover
      const h1Match = page.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const subMatch = page.match(/<p class="sub">([\s\S]*?)<\/p>/i);
      if (h1Match) {
        const title = stripTags(h1Match[1]).trim();
        const subtitle = subMatch ? stripTags(subMatch[1]).trim() : '';
        blocks.push({
          block_type: 'heading',
          content: { text: title, level: 1 },
        });
        if (subtitle) {
          blocks.push({
            block_type: 'text',
            content: { html: `<p><em>${subtitle}</em></p>` },
          });
        }
      }
      blocks.push({ block_type: 'divider', content: {} });
      continue;
    }

    // Skip last page (closing/credits)
    if (pageIdx === pages.length - 1) continue;

    // Skip TOC page (page 1, has <table>)
    if (page.includes('<table') && pageIdx === 1) {
      continue;
    }

    // Add page break between content pages
    if (blocks.length > 0 && blocks[blocks.length - 1].block_type !== 'divider') {
      blocks.push({ block_type: 'page-break', content: {} });
    }

    // Extract the inner content
    const innerMatch = page.match(/<div class="inner"[^>]*>([\s\S]*?)<\/div>\s*<div class="pn">/i);
    if (!innerMatch) {
      // Try without pn
      const innerMatch2 = page.match(/<div class="inner"[^>]*>([\s\S]*)/i);
      if (innerMatch2) {
        extractBlocksFromInner(innerMatch2[1], blocks, level);
      }
      continue;
    }

    extractBlocksFromInner(innerMatch[1], blocks, level);
  }

  return blocks;
}

function extractBlocksFromInner(inner: string, blocks: Block[], level: number): void {
  // Remove spacers, corner ticks, page numbers
  let content = inner
    .replace(/<div class="s\d+">\s*<\/div>/g, '')
    .replace(/<div class="ck[^"]*">\s*<\/div>/g, '')
    .replace(/<div class="pn">[\s\S]*?<\/div>/g, '')
    .replace(/<div class="grow">\s*<\/div>/g, '')
    .trim();

  // Extract elements in order using a position-based approach
  // We'll scan through and extract headings, images, text, callouts, lists

  // Labels (section labels like "Preparation", "Completion")
  const labelRegex = /<div class="label"[^>]*>([\s\S]*?)<\/div>/gi;
  content = content.replace(labelRegex, (_, text) => {
    const cleaned = stripTags(text).trim();
    if (cleaned && cleaned !== 'International Aura School' && cleaned !== 'Quick Reference') {
      blocks.push({ block_type: 'heading', content: { text: cleaned, level: 3 } });
    }
    return '';
  });

  // H1 headings
  content = content.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, text) => {
    blocks.push({ block_type: 'heading', content: { text: stripTags(text).trim(), level: 1 } });
    return '';
  });

  // H2 headings
  content = content.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, text) => {
    blocks.push({ block_type: 'heading', content: { text: stripTags(text).trim(), level: 2 } });
    return '';
  });

  // H3 headings (with optional step number)
  content = content.replace(/<div class="step">\s*<div class="sn">(\d+)<\/div>\s*<h3[^>]*>([\s\S]*?)<\/h3>\s*<\/div>/gi, (_, num, text) => {
    blocks.push({ block_type: 'heading', content: { text: `${num}. ${stripTags(text).trim()}`, level: 2 } });
    return '';
  });

  // Remaining H3 headings
  content = content.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, text) => {
    blocks.push({ block_type: 'heading', content: { text: stripTags(text).trim(), level: 2 } });
    return '';
  });

  // H4 headings
  content = content.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, text) => {
    blocks.push({ block_type: 'heading', content: { text: stripTags(text).trim(), level: 3 } });
    return '';
  });

  // Images
  const imgRegex = /<img\s+[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi;
  content = content.replace(imgRegex, (_, src, alt) => {
    // Remap image paths: images/level-X/... → /rose med images/level-X/...
    let mappedSrc = src;
    if (src.startsWith('images/')) {
      mappedSrc = '/' + src.replace('images/', 'rose med images/');
    }
    blocks.push({
      block_type: 'image',
      content: { src: mappedSrc, alt: alt || '', caption: '' },
    });
    return '';
  });

  // Ordered lists
  content = content.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, listContent) => {
    const items = extractListItems(listContent);
    if (items.length > 0) {
      const html = '<ol>' + items.map(i => `<li>${i}</li>`).join('') + '</ol>';
      blocks.push({ block_type: 'text', content: { html } });
    }
    return '';
  });

  // Unordered lists
  content = content.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, listContent) => {
    const items = extractListItems(listContent);
    if (items.length > 0) {
      const html = '<ul>' + items.map(i => `<li>${i}</li>`).join('') + '</ul>';
      blocks.push({ block_type: 'text', content: { html } });
    }
    return '';
  });

  // Callouts
  content = content.replace(/<div class="call[^"]*"[^>]*>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<\/div>/gi, (_, text) => {
    const cleaned = text.trim();
    if (cleaned) {
      blocks.push({ block_type: 'text', content: { html: `<p><em>${cleaned}</em></p>` } });
    }
    return '';
  });

  // Summary boxes
  content = content.replace(/<div class="sum">([\s\S]*?)<\/div>/gi, (_, sumContent) => {
    // Extract lists from summary
    const listMatch = sumContent.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
    if (listMatch) {
      const items = extractListItems(listMatch[1]);
      if (items.length > 0) {
        const html = '<ul>' + items.map(i => `<li>${i}</li>`).join('') + '</ul>';
        blocks.push({ block_type: 'text', content: { html } });
      }
    }
    return '';
  });

  // Remaining paragraphs
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pMatch;
  while ((pMatch = pRegex.exec(content)) !== null) {
    const text = pMatch[1].trim();
    if (text && text.length > 5) {
      // Preserve em/strong tags but strip other HTML
      const cleaned = text
        .replace(/<(?!\/?(?:em|strong|b|i|br)\b)[^>]+>/gi, '')
        .trim();
      if (cleaned) {
        blocks.push({ block_type: 'text', content: { html: `<p>${cleaned}</p>` } });
      }
    }
  }

  // Divider lines
  if (content.includes('class="line"')) {
    // Already handled as part of page structure
  }
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&mdash;/g, '—').replace(/&nbsp;/g, ' ');
}

function extractListItems(listHtml: string): string[] {
  const items: string[] = [];
  const liRegex = /<li>([\s\S]*?)<\/li>/gi;
  let match;
  while ((match = liRegex.exec(listHtml)) !== null) {
    const text = match[1]
      .replace(/<(?!\/?(?:em|strong|b|i)\b)[^>]+>/gi, '')
      .trim();
    if (text) items.push(text);
  }
  return items;
}

// =============================================================================
// DEDUPLICATE — remove consecutive duplicate blocks
// =============================================================================

function deduplicateBlocks(blocks: Block[]): Block[] {
  return blocks.filter((block, i) => {
    if (i === 0) return true;
    const prev = blocks[i - 1];
    // Remove duplicate consecutive headings with same text
    if (block.block_type === 'heading' && prev.block_type === 'heading') {
      if ((block.content as { text: string }).text === (prev.content as { text: string }).text) {
        return false;
      }
    }
    // Remove empty text blocks
    if (block.block_type === 'text') {
      const html = (block.content as { html: string }).html;
      if (!html || html === '<p></p>' || stripTags(html).trim().length < 3) {
        return false;
      }
    }
    return true;
  });
}

// =============================================================================
// MAIN — import all manuals
// =============================================================================

const MANUAL_FILES: { slug: string; file: string; level: number }[] = [
  { slug: 'rose-meditation-level-1', file: 'roses-manual-1.html', level: 1 },
  { slug: 'rose-meditation-level-2', file: 'roses-manual-2.html', level: 2 },
  { slug: 'rose-meditation-level-3', file: 'roses-manual-3.html', level: 3 },
];

async function main() {
  console.log('🌹 Importing manuals into Supabase blocks...\n');

  // Fix cover image paths first
  console.log('Fixing cover image paths...');
  await supabase.from('manuals').update({ cover_image: '/rose med images/level-1/01-the-rose.jpeg' }).eq('slug', 'rose-meditation-level-1');
  await supabase.from('manuals').update({ cover_image: '/rose med images/level-1/04-golden-sun.jpeg' }).eq('slug', 'rose-meditation-level-2');
  await supabase.from('manuals').update({ cover_image: '/rose med images/level-1/05-aura-exercise.PNG' }).eq('slug', 'aura-level-1');

  // Fetch manual IDs
  const { data: manuals, error: mErr } = await supabase.from('manuals').select('id, slug');
  if (mErr || !manuals) {
    console.error('Failed to fetch manuals:', mErr?.message);
    process.exit(1);
  }

  for (const manual of MANUAL_FILES) {
    const dbManual = manuals.find(m => m.slug === manual.slug);
    if (!dbManual) {
      console.log(`⚠ Manual "${manual.slug}" not found in DB, skipping`);
      continue;
    }

    console.log(`\nProcessing: ${manual.slug}`);

    // Read HTML file
    const htmlPath = join(__dirname, 'pdf-manuals', manual.file);
    let html: string;
    try {
      html = readFileSync(htmlPath, 'utf-8');
    } catch {
      console.log(`  ⚠ File not found: ${manual.file}, skipping`);
      continue;
    }

    // Parse HTML into blocks
    let blocks = parseManualHtml(html, manual.level);
    blocks = deduplicateBlocks(blocks);

    console.log(`  Parsed ${blocks.length} blocks`);

    // Delete existing blocks for this manual+language (English)
    const { error: delErr } = await supabase
      .from('manual_blocks')
      .delete()
      .eq('manual_id', dbManual.id)
      .eq('language', 'en');

    if (delErr) {
      console.error(`  ✗ Failed to clear existing blocks: ${delErr.message}`);
      continue;
    }

    // Insert blocks
    const rows = blocks.map((block, i) => ({
      manual_id: dbManual.id,
      language: 'en',
      block_type: block.block_type,
      content: block.content,
      position: i,
      updated_by: 'Import',
    }));

    const { error: insErr } = await supabase.from('manual_blocks').insert(rows);
    if (insErr) {
      console.error(`  ✗ Failed to insert blocks: ${insErr.message}`);
      continue;
    }

    console.log(`  ✓ Imported ${blocks.length} blocks for ${manual.slug} (en)`);

    // Log block breakdown
    const counts: Record<string, number> = {};
    blocks.forEach(b => { counts[b.block_type] = (counts[b.block_type] || 0) + 1; });
    console.log(`    ${Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join(', ')}`);
  }

  // =========================================================================
  // COPY ENGLISH BLOCKS TO ALL OTHER LANGUAGES
  // This gives translators a starting point — they edit in place
  // =========================================================================

  const OTHER_LANGUAGES = ['pt', 'es', 'el', 'ru', 'uk'];

  console.log('\n--- Copying English content to all languages ---\n');

  for (const dbManual of manuals) {
    // Fetch English blocks for this manual
    const { data: enBlocks, error: fetchErr } = await supabase
      .from('manual_blocks')
      .select('*')
      .eq('manual_id', dbManual.id)
      .eq('language', 'en')
      .order('position', { ascending: true });

    if (fetchErr || !enBlocks || enBlocks.length === 0) {
      console.log(`  ${dbManual.slug}: no English blocks to copy, skipping`);
      continue;
    }

    for (const lang of OTHER_LANGUAGES) {
      // Check if this language already has blocks
      const { count } = await supabase
        .from('manual_blocks')
        .select('id', { count: 'exact', head: true })
        .eq('manual_id', dbManual.id)
        .eq('language', lang);

      if (count && count > 0) {
        console.log(`  ${dbManual.slug} [${lang}]: already has ${count} blocks, skipping`);
        continue;
      }

      // Copy English blocks to this language
      const langRows = enBlocks.map((block, i) => ({
        manual_id: dbManual.id,
        language: lang,
        block_type: block.block_type,
        content: block.content,
        position: i,
        updated_by: 'Import (from English)',
      }));

      const { error: langInsErr } = await supabase.from('manual_blocks').insert(langRows);
      if (langInsErr) {
        console.error(`  ✗ ${dbManual.slug} [${lang}]: ${langInsErr.message}`);
        continue;
      }

      console.log(`  ✓ ${dbManual.slug} [${lang}]: copied ${enBlocks.length} blocks`);
    }
  }

  console.log('\n✅ Import complete!');
  console.log('All manuals now have content in: en, pt, es, el, ru, uk');
  console.log('Editors can switch languages and translate in place.');
}

main().catch(console.error);
