/**
 * T-003 + AC3 proof: the backward-compat parser keeps every legacy row readable.
 *
 * Reads the live Level 1 (English) legacy rows from Supabase READ-ONLY (RLS
 * permits public SELECT; this script never writes), routes them through
 * `parseManualBlocks`, and asserts zero `unknown` fallbacks. Then it validates a
 * `contents` v2 fixture returns ok. Read-only by construction: it uses the anon
 * key and issues only GET requests.
 *
 * Usage (env from .env.local):
 *   set -a; . ./.env.local; set +a; npx tsx scripts/verify-block-parser.ts
 */

import { parseManualBlocks, parseManualBlock } from '../src/lib/manuals/block-parser';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const L1_SLUG = 'rose-meditation-level-1';

type RawRow = { block_type: unknown; content: unknown };

async function rest(path: string): Promise<unknown> {
  if (!URL || !KEY) throw new Error('NEXT_PUBLIC_SUPABASE_URL / ANON_KEY not set');
  const res = await fetch(`${URL}/rest/v1/${path}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!res.ok) throw new Error(`REST ${path} -> ${res.status}`);
  return res.json();
}

async function fetchLevel1Rows(): Promise<RawRow[]> {
  const manuals = (await rest(`manuals?select=id&slug=eq.${L1_SLUG}`)) as Array<{ id: string }>;
  if (!manuals.length) throw new Error(`manual ${L1_SLUG} not found`);
  const id = manuals[0].id;
  return (await rest(
    `manual_blocks?select=block_type,content&manual_id=eq.${id}&language=eq.en&order=position.asc`
  )) as RawRow[];
}

const CONTENTS_FIXTURE: RawRow = {
  block_type: 'contents',
  content: {
    schema_version: 2,
    eyebrow: 'CONTENTS',
    rows: [
      { numeral: '1', title: 'Getting Ready to Start', page: '4' },
      { numeral: '2', title: 'The Rose Meditation', page: '7' },
    ],
  },
};

async function main(): Promise<void> {
  const rows = await fetchLevel1Rows();
  const { stats } = parseManualBlocks(rows);
  const contents = parseManualBlock(CONTENTS_FIXTURE);

  console.log('Level 1 legacy rows parsed:');
  console.log(`  total    = ${stats.total}`);
  console.log(`  passed   = ${stats.passed}`);
  console.log(`  fallback = ${stats.fallback}`);
  if (stats.fallback > 0) {
    console.log('  fallback reasons:');
    for (const [reason, n] of Object.entries(stats.reasons)) {
      console.log(`    [${n}] ${reason}`);
    }
  }
  console.log(`contents v2 fixture parses ok: ${contents.ok}`);

  const zeroFallback = stats.fallback === 0;
  const contentsOk = contents.ok === true;
  const enoughRows = stats.total >= 80; // L1 is ~86 legacy rows
  const pass = zeroFallback && contentsOk && enoughRows;
  console.log(
    `\nAC3: ${pass ? 'PASS' : 'FAIL'} ` +
      `(zero-fallback=${zeroFallback}, contents-ok=${contentsOk}, rows>=80=${enoughRows})`
  );
  process.exit(pass ? 0 : 1);
}

main().catch((err) => {
  console.error('verify-block-parser error:', err instanceof Error ? err.message : err);
  process.exit(2);
});
