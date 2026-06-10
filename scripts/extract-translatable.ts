/**
 * Extract the translatable strings from a manual's source-language blocks.
 *
 * Reads every block of `<manual>` in `<src-lang>` from Supabase (anon key is
 * enough — this is a read), runs each through `collectStrings` (the single
 * translatable-field source of truth), and writes a self-contained `source.json`
 * the stager can later reconstruct from:
 *
 *   {
 *     manual, manualId, srcLang,
 *     blocks:  [{ id, position, block_type, content, source_page }],   // verbatim
 *     strings: [{ idx, position, path, kind, text }]                    // flat, ordered
 *   }
 *
 * The `strings` array is what gets translated. The translator (a human, this
 * agent inline, or an MT call) produces a sibling `translations.<lang>.json` of
 * `{ idx, text }` aligned by `idx`. The stager joins them back by path.
 *
 * General by design (ARCHITECTURE D-13): every manual / level / language drives
 * off flags; no per-page logic lives here.
 *
 *   Usage:
 *     npx tsx scripts/extract-translatable.ts \
 *       --manual rose-meditation-level-2 [--lang en] \
 *       [--out _qie-output/roses-os/translation/<manual>-<lang>/source.json]
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { collectStrings } from '../src/lib/manuals/translate-fields';

function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  if (i !== -1 && i + 1 < process.argv.length) return process.argv[i + 1];
  return fallback;
}

function loadEnvLocal(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const raw = readFileSync(join(__dirname, '..', '.env.local'), 'utf-8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) out[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  } catch {
    /* rely on process.env */
  }
  return out;
}

const MANUAL_SLUG = arg('manual', 'rose-meditation-level-2')!;
const SRC_LANG = arg('lang', 'en')!;
const OUT = arg('out', join('_qie-output', 'roses-os', 'translation', `${MANUAL_SLUG}-${SRC_LANG}`, 'source.json'))!;

const env = loadEnvLocal();
const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const ANON =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !ANON) {
  console.error('✗ NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY required.');
  process.exit(1);
}

interface DbBlock {
  id: string;
  position: number;
  block_type: string;
  content: Record<string, unknown>;
  source_page: number | null;
}

async function rest(path: string): Promise<unknown> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: ANON!, Authorization: `Bearer ${ANON!}` },
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  console.log(`🌹 Extract translatable → ${MANUAL_SLUG} [${SRC_LANG}]\n`);

  const manuals = (await rest(`manuals?select=id,slug&slug=eq.${MANUAL_SLUG}`)) as { id: string; slug: string }[];
  if (!manuals.length) {
    console.error(`✗ manual "${MANUAL_SLUG}" not found.`);
    process.exit(1);
  }
  const manualId = manuals[0].id;
  console.log(`   manual_id: ${manualId}`);

  // Paginated read: a reconstructed manual embeds figure data URLs, so the full
  // content set is tens of MB and a single select trips the statement timeout
  // (seen on L2: 157 blocks / 55MB). Page by position in small windows.
  const PAGE = 20;
  const blocks: DbBlock[] = [];
  for (let off = 0; ; off += PAGE) {
    const page = (await rest(
      `manual_blocks?select=id,position,block_type,content,source_page&manual_id=eq.${manualId}&language=eq.${SRC_LANG}&order=position.asc&limit=${PAGE}&offset=${off}`
    )) as DbBlock[];
    blocks.push(...page);
    if (page.length < PAGE) break;
  }
  console.log(`   pulled ${blocks.length} blocks`);

  const strings: { idx: number; position: number; path: (string | number)[]; kind: string; text: string }[] = [];
  let idx = 0;
  for (const b of blocks) {
    for (const s of collectStrings(b.block_type, b.content)) {
      strings.push({ idx: idx++, position: b.position, path: s.path, kind: s.kind, text: s.text });
    }
  }

  const dist: Record<string, number> = {};
  for (const b of blocks) dist[b.block_type] = (dist[b.block_type] || 0) + 1;
  console.log(`   block types: ${JSON.stringify(dist)}`);
  console.log(`   extracted ${strings.length} translatable strings`);

  const out = {
    manual: MANUAL_SLUG,
    manualId,
    srcLang: SRC_LANG,
    blocks: blocks.map((b) => ({
      id: b.id,
      position: b.position,
      block_type: b.block_type,
      content: b.content,
      source_page: b.source_page,
    })),
    strings,
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(out, null, 2), 'utf-8');
  console.log(`\n✅ wrote ${OUT}`);
  console.log(`   next: produce ${dirname(OUT)}/translations.<lang>.json as [{ idx, text }] aligned by idx`);
}

main().catch((e) => {
  console.error('FATAL:', e instanceof Error ? e.message : e);
  process.exit(1);
});
