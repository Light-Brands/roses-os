/**
 * Externalize embedded figure data URLs out of staged block content (spec 004
 * follow-up — editor renderability).
 *
 * Reconstruction inlines figure pixels as base64 data URLs in block content. That
 * makes each staged lane tens of MB (L2: 55MB), so the editor stalls loading it and
 * the same bytes are re-stored in every language lane. This script moves figures to
 * the app's `public/` dir (Next serves it, deploys with the app), downscaled to a
 * web size, and rewrites every lane's block `src`/`cover_image` to the light path.
 * Figures are deduped by content hash, so the bytes shared across all six language
 * lanes are written once.
 *
 * Anon-safe: it only writes files to public/ and UPDATEs block content (no DDL, no
 * storage bucket, no service key). Idempotent: a block already pointing at a public
 * path is skipped.
 *
 *   npx tsx scripts/externalize-figures.ts --manual rose-meditation-level-2 [--lang en|all] [--max-width 1400] [--dry-run]
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';
import { createRequire } from 'module';
import { createClient } from '@supabase/supabase-js';
import { stagingSlugFor } from '../src/lib/manuals/staging';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

function arg(name: string, fb?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && i + 1 < process.argv.length ? process.argv[i + 1] : fb;
}
function loadEnv(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    for (const line of readFileSync(join(__dirname, '..', '.env.local'), 'utf-8').split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) out[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  } catch { /* env */ }
  return out;
}

const MANUAL = arg('manual')!;
const LANG = arg('lang', 'all')!;
const MAX_W = parseInt(arg('max-width', '1400')!, 10);
const DRY = process.argv.includes('--dry-run');
if (!MANUAL) { console.error('✗ --manual <slug> required.'); process.exit(2); }

const env = loadEnv();
const URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!URL || !KEY) { console.error('✗ SUPABASE_URL + a key required.'); process.exit(2); }

const PUBLIC_DIR = join('public', 'reconstruction', MANUAL);
const PUBLIC_URL_BASE = `/reconstruction/${MANUAL}`;
const FIELDS = ['src', 'cover_image'];

function isDataUrl(v: unknown): v is string { return typeof v === 'string' && v.startsWith('data:image/'); }

/** Downscale a data URL to a web-size PNG written under public/, returning the path.
 *  Deduped by hash of the original data URL. */
const written = new Map<string, string>();
async function externalize(dataUrl: string): Promise<string> {
  const hash = createHash('sha256').update(dataUrl).digest('hex').slice(0, 16);
  if (written.has(hash)) return written.get(hash)!;
  const rel = `${PUBLIC_URL_BASE}/${hash}.png`;
  const file = join(PUBLIC_DIR, `${hash}.png`);
  if (!existsSync(file) && !DRY) {
    const b64 = dataUrl.split(',')[1] ?? '';
    const buf = Buffer.from(b64, 'base64');
    const out = await sharp(buf).resize({ width: MAX_W, withoutEnlargement: true }).png({ compressionLevel: 9 }).toBuffer();
    writeFileSync(file, out);
  }
  written.set(hash, rel);
  return rel;
}

async function main() {
  console.log(`🖼  externalize-figures --manual ${MANUAL} --lang ${LANG} --max-width ${MAX_W}${DRY ? '  (DRY RUN)' : ''}`);
  if (!DRY) mkdirSync(PUBLIC_DIR, { recursive: true });
  const sb = createClient(URL!, KEY!, { auth: { persistSession: false, autoRefreshToken: false } });

  const stagingSlug = stagingSlugFor(MANUAL);
  const { data: man, error: mErr } = await sb.from('manuals').select('id').eq('slug', stagingSlug).single();
  if (mErr || !man) { console.error(`✗ staging lane ${stagingSlug} not found.`); process.exit(3); }
  const manualId = (man as { id: string }).id;

  // Which languages to process.
  let langs: string[];
  if (LANG === 'all') {
    const set = new Set<string>();
    for (let off = 0; ; off += 1000) {
      const { data } = await sb.from('manual_blocks').select('language').eq('manual_id', manualId).range(off, off + 999);
      if (!data || !data.length) break;
      data.forEach((r: { language: string }) => set.add(r.language));
      if (data.length < 1000) break;
    }
    langs = [...set].sort();
  } else langs = [LANG];
  console.log(`   lanes: ${langs.join(', ')}`);

  let totalUpdated = 0;
  for (const lang of langs) {
    // Read only id/position/content; page small to dodge the statement timeout.
    let updated = 0, scanned = 0;
    for (let off = 0; ; off += 15) {
      const { data, error } = await sb
        .from('manual_blocks')
        .select('id,position,content')
        .eq('manual_id', manualId).eq('language', lang)
        .order('position').range(off, off + 14);
      if (error) { console.error(`✗ read ${lang}@${off}: ${error.message}`); process.exit(3); }
      if (!data || !data.length) break;
      for (const row of data as { id: string; position: number; content: Record<string, unknown> }[]) {
        scanned++;
        let dirty = false;
        const c = { ...row.content };
        for (const f of FIELDS) {
          if (isDataUrl(c[f])) { c[f] = await externalize(c[f] as string); dirty = true; }
        }
        if (dirty && !DRY) {
          const { error: uErr } = await sb.from('manual_blocks').update({ content: c }).eq('id', row.id);
          if (uErr) { console.error(`✗ update ${row.id}: ${uErr.message}`); process.exit(3); }
        }
        if (dirty) updated++;
      }
      if (data.length < 15) break;
    }
    console.log(`   ${lang}: ${updated} block(s) externalized (scanned ${scanned})`);
    totalUpdated += updated;
  }
  console.log(`\n✓ ${written.size} unique figure(s) written to ${PUBLIC_DIR}; ${totalUpdated} block update(s) across ${langs.length} lane(s).`);
}

main().catch((e) => { console.error('FATAL:', e instanceof Error ? e.message : e); process.exit(1); });
