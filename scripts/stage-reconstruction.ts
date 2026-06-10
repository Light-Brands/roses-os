/**
 * Stage reconstructed manual blocks into the Supabase staging lane.
 *
 * Reads an `editor-blocks.json` export (ManualBlock[] under `.data`, produced by
 * scripts/reconstruct-l1-geometry.ts), resolves the staging manual_id for the
 * given production slug (slug convention `<prod-slug>__staging`, migration 0007),
 * validates every block through the same Zod write-gate the API uses
 * (block-schema.ts), then bulk-upserts under the staging manual_id + language on
 * the (manual_id, language, position) unique key (migration 0006).
 *
 * Staging is isolated: a prod read (getBlocks(prodId)) never sees these rows.
 *
 * General by design (ARCHITECTURE D-13): drive any manual/level/locale via flags,
 * never a per-page patch.
 *
 * Anon staging path (spec 004 T-002, AC2, D-18 operator contract): the headless
 * run holds no service role key, so staging into the `__staging` lane goes through
 * the anon key. The lane's RLS policy is `USING (true)` (proven by stage-translation.ts
 * and the live editor), so an anon insert/upsert into a `__staging` manual_id is
 * allowed. The service role key is still used when present (it bypasses RLS and is
 * the right tool for a bulk prod-adjacent write), but its absence no longer halts
 * the run. `--dry-run` needs no key at all: it reads the export, validates every
 * block through the Zod gate, and prints the block-type distribution.
 *
 *   Usage:
 *     npx tsx scripts/stage-reconstruction.ts \
 *       [--manual rose-meditation-level-1] [--lang en] \
 *       [--input _qie-output/roses-os/reconstruction/l1-en/editor-blocks.json] \
 *       [--run-id recon-l1-geometry] [--dry-run]
 *
 * Reads SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) plus either
 * SUPABASE_SERVICE_ROLE_KEY (preferred when present) or the anon key, from the
 * environment, falling back to .env.local.
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';
import { validateBlockInput } from '../src/lib/manuals/block-schema';
import { stagingSlugFor } from '../src/lib/manuals/staging';

// ----- args -----------------------------------------------------------------
function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  if (i !== -1 && i + 1 < process.argv.length) return process.argv[i + 1];
  return fallback;
}
const MANUAL_SLUG = arg('manual', 'rose-meditation-level-1')!;
const LANG = arg('lang', 'en')!;
const INPUT = arg(
  'input',
  '_qie-output/roses-os/reconstruction/l1-en/editor-blocks.json',
)!;
const RUN_ID = arg('run-id', 'recon-l1-geometry')!;
const DRY_RUN = process.argv.includes('--dry-run');

// ----- env ------------------------------------------------------------------
function loadEnvLocal(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const raw = readFileSync(join(__dirname, '..', '.env.local'), 'utf-8');
    for (const line of raw.split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) out[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  } catch {
    /* no .env.local — rely on process.env */
  }
  return out;
}
const envFile = loadEnvLocal();
const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  envFile.SUPABASE_URL ||
  envFile.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  envFile.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Prefer the service role when present (it bypasses RLS); fall back to anon, whose
// USING(true) policy on the __staging lane allows the write. The headless run has
// only anon, and that is the operator-contract boundary (no service token in-run).
const WRITE_KEY = SERVICE_KEY || ANON_KEY;
const KEY_KIND = SERVICE_KEY ? 'service-role' : 'anon';

if (!SUPABASE_URL) {
  console.error('✗ SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL not set.');
  process.exit(1);
}
// A real write needs a key; --dry-run does not (it only reads + validates + counts).
if (!WRITE_KEY && !DRY_RUN) {
  console.error('✗ No Supabase key: set SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY (or pass --dry-run).');
  process.exit(1);
}

interface ExportRow {
  /** Synthetic export id (page:ordinal); NOT the DB uuid. */
  id?: string;
  block_type: string;
  content: Record<string, unknown>;
  position: number;
  updated_by?: string | null;
  source_page?: number | null;
  run_id?: string | null;
}

async function main() {
  console.log(`🌹 Staging reconstruction → ${MANUAL_SLUG}__staging [${LANG}]`);
  console.log(`   input: ${INPUT}  key: ${DRY_RUN ? 'none (dry run)' : KEY_KIND}${DRY_RUN ? '  (DRY RUN — no writes)' : ''}\n`);

  // 1) read + parse export
  const parsed = JSON.parse(readFileSync(join(__dirname, '..', INPUT), 'utf-8'));
  const rows: ExportRow[] = Array.isArray(parsed) ? parsed : parsed.data;
  if (!Array.isArray(rows) || rows.length === 0) {
    console.error('✗ No blocks found in export (.data array empty).');
    process.exit(1);
  }
  console.log(`   parsed ${rows.length} blocks`);

  // 2) validate EVERY block before any write (D-1 write gate)
  let bad = 0;
  rows.forEach((r, i) => {
    const outcome = validateBlockInput({ block_type: r.block_type, content: r.content });
    if (!outcome.ok) {
      bad++;
      console.error(`   ✗ block ${i} (${r.block_type}, pos ${r.position}): ${outcome.body.error.issues?.[0]?.message ?? outcome.body.error.message}`);
    }
  });
  if (bad > 0) {
    console.error(`\n✗ ${bad} block(s) failed validation — refusing the batch (fail closed).`);
    process.exit(1);
  }
  console.log(`   ✓ all ${rows.length} blocks pass the Zod write gate`);

  // Dry-run reports the block-type distribution and exits with no DB call and no
  // key required (AC2). Everything below needs a Supabase client.
  if (DRY_RUN) {
    const counts: Record<string, number> = {};
    rows.forEach((r) => { counts[r.block_type] = (counts[r.block_type] || 0) + 1; });
    console.log('\n   DRY RUN — would upsert distribution:', JSON.stringify(counts));
    console.log(`   target lane: ${stagingSlugFor(MANUAL_SLUG)} [${LANG}]  (no writes performed)`);
    return;
  }

  const supabase = createClient(SUPABASE_URL!, WRITE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 3) resolve the staging manual_id
  const stagingSlug = stagingSlugFor(MANUAL_SLUG);
  const { data: man, error: mErr } = await supabase
    .from('manuals')
    .select('id, slug')
    .eq('slug', stagingSlug)
    .single();
  if (mErr || !man) {
    console.error(`✗ Staging manual "${stagingSlug}" not found — run migration 0007 first. (${mErr?.message ?? 'no row'})`);
    process.exit(1);
  }
  const stagingId = man.id;
  console.log(`   staging manual_id: ${stagingId}`);

  // 4) build payload
  const payload = rows.map((r) => ({
    manual_id: stagingId,
    language: LANG,
    block_type: r.block_type,
    content: r.content,
    position: r.position,
    updated_by: r.updated_by ?? 'reconstruct',
    source_page: r.source_page ?? null,
    run_id: r.run_id ?? RUN_ID,
  }));

  // 5) upsert on the (manual_id, language, position) key (idempotent re-run).
  // Chunked: a reconstructed manual embeds figure pixels as data URLs, so the
  // payload can be tens of MB. A single upsert of all rows trips the Postgres
  // statement timeout over PostgREST (seen on L2: 55MB / 157 blocks). Upserting in
  // small batches keeps each statement under the timeout; the on-conflict key makes
  // a re-run idempotent regardless of batch boundaries.
  const CHUNK = Math.max(1, parseInt(arg('chunk', '10')!, 10));
  let upserted = 0;
  for (let i = 0; i < payload.length; i += CHUNK) {
    const batch = payload.slice(i, i + CHUNK);
    const { data, error } = await supabase
      .from('manual_blocks')
      .upsert(batch, { onConflict: 'manual_id,language,position' })
      .select('id');
    if (error) {
      console.error(`✗ upsert failed on rows ${i}..${i + batch.length - 1}: ${error.message}`);
      process.exit(1);
    }
    upserted += data?.length ?? 0;
    process.stdout.write(`\r   upserted ${upserted}/${payload.length}`);
  }
  console.log(`\n✅ Upserted ${upserted} blocks into ${stagingSlug} [${LANG}]`);

  // 5b) Remap nested child references. The export references children by its
  // synthetic page:ordinal ids, but Postgres assigned fresh uuids on insert, so
  // a two-column-section / section's left/right/children arrays would point at
  // ids that no longer exist. Rebuild them: position is the stable join key.
  const { data: stagedRows, error: stErr } = await supabase
    .from('manual_blocks')
    .select('id, position')
    .eq('manual_id', stagingId)
    .eq('language', LANG);
  if (stErr || !stagedRows) {
    console.error(`✗ could not read back staged rows for remap: ${stErr?.message}`);
    process.exit(1);
  }
  const posToUuid = new Map<number, string>(stagedRows.map((r) => [r.position, r.id]));
  const synthToUuid = new Map<string, string>();
  rows.forEach((r) => {
    const u = posToUuid.get(r.position);
    if (r.id && u) synthToUuid.set(r.id, u);
  });
  const remapIds = (ids: unknown): string[] =>
    Array.isArray(ids) ? ids.map((id) => synthToUuid.get(id as string)).filter((x): x is string => !!x) : [];

  let patched = 0;
  let droppedRefs = 0;
  for (const r of rows) {
    if (r.block_type !== 'two-column-section' && r.block_type !== 'section') continue;
    const uuid = posToUuid.get(r.position);
    if (!uuid) continue;
    const c: Record<string, unknown> = { ...r.content };
    if (r.block_type === 'two-column-section') {
      const left = remapIds(r.content.left);
      const right = remapIds(r.content.right);
      droppedRefs += ((r.content.left as unknown[])?.length ?? 0) - left.length;
      droppedRefs += ((r.content.right as unknown[])?.length ?? 0) - right.length;
      c.left = left;
      c.right = right;
    } else {
      const children = remapIds(r.content.children);
      droppedRefs += ((r.content.children as unknown[])?.length ?? 0) - children.length;
      c.children = children;
    }
    const { error: upErr } = await supabase.from('manual_blocks').update({ content: c }).eq('id', uuid);
    if (!upErr) patched++;
  }
  console.log(`   remapped child refs in ${patched} container block(s)${droppedRefs ? ` (⚠ ${droppedRefs} unresolved refs dropped)` : ''}`);

  // 6) verify
  const { count } = await supabase
    .from('manual_blocks')
    .select('id', { count: 'exact', head: true })
    .eq('manual_id', stagingId)
    .eq('language', LANG);
  console.log(`   staging lane now holds ${count} ${LANG} blocks`);
}

main().catch((e) => {
  console.error('FATAL:', e instanceof Error ? e.message : e);
  process.exit(1);
});
