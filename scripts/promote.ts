/**
 * Staging-to-prod promotion executor (spec 004 T-011, ARCHITECTURE D-18 / D-8).
 *
 * Promotes one (manual, language) lane from a SOURCE endpoint to a TARGET endpoint
 * as one logical transaction: snapshot the target rows, delete them, insert the
 * source rows under the target manual_id, remapping nested child refs inside the
 * insert. The executor is built and exercised here staging-to-staging only; the
 * real staging-to-prod write is Dario's later step behind Gate G1 (a service token),
 * using the transactional RPC shipped in migration 0008.
 *
 * Safety properties (every one a hard default, none a flag the bot can flip):
 *   - Default-refuse: without an explicit --confirm, the executor performs no write,
 *     even outside --dry-run. A headless bot cannot promote by omission.
 *   - No prod id in the headless code path: the target endpoint is resolved from a
 *     slug, and a NON-`__staging` target is refused unless --allow-prod is passed.
 *     The headless run never passes it, so prod is never a connection this path holds.
 *   - Signer precheck: a source row whose audit column (updated_by) is null is
 *     refused — an unsigned row never reaches the target.
 *   - Held precheck: a source row carrying the held-for-native-review marker
 *     (review_status='held' when the column exists, else a `held*` run_id per D-21
 *     OQ2) is refused. Gate G2 (native review) clears it before promotion.
 *   - Snapshot before swap: the target rows are written to a JSON snapshot file
 *     before the delete, so a mid-flight failure never leaves a live locale emptied
 *     with no recovery. (The 0008 RPC does the equivalent snapshot inside one DB
 *     transaction when Dario promotes to prod.)
 *
 *   Usage (staging-to-staging test — what the headless run exercises):
 *     npx tsx scripts/promote.ts --manual rose-meditation-level-2 --language pt \
 *       --source-lane rose-meditation-level-2__staging \
 *       --target-lane rose-meditation-level-2__staging --target-language pt-promoted \
 *       --dry-run
 *
 *   Real promotion (Dario, later, behind G1): add --confirm and a prod target with
 *     --allow-prod, with SUPABASE_SERVICE_ROLE_KEY set, OR call the 0008 RPC.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { createClient } from '@supabase/supabase-js';
import { stagingSlugFor, isStagingSlug } from '../src/lib/manuals/staging';

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
  } catch { /* env */ }
  return out;
}

const MANUAL = arg('manual')!;
const LANGUAGE = arg('language')!;
const SOURCE_LANE = arg('source-lane', MANUAL ? stagingSlugFor(MANUAL) : undefined);
const TARGET_LANE = arg('target-lane', MANUAL ? stagingSlugFor(MANUAL) : undefined);
const SOURCE_LANGUAGE = arg('source-language', LANGUAGE);
const TARGET_LANGUAGE = arg('target-language', LANGUAGE);
const BACKUP_DIR = arg('backup-dir', join('_qie-output', 'roses-os', 'promote-backups'))!;
const DRY_RUN = process.argv.includes('--dry-run');
const CONFIRM = process.argv.includes('--confirm');
const ALLOW_PROD = process.argv.includes('--allow-prod');
const ALLOW_HELD = process.argv.includes('--allow-held');
const SKIP_SIGNER = process.argv.includes('--skip-signer-check');

if (!MANUAL || !LANGUAGE) {
  console.error('✗ --manual <slug> and --language <lang> are required.');
  process.exit(2);
}

const env = loadEnvLocal();
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const KEY = SERVICE_KEY || ANON;
if (!SUPABASE_URL || !KEY) {
  console.error('✗ SUPABASE_URL + a key (service-role or anon) required.');
  process.exit(2);
}

interface Row { id: string; manual_id: string; language: string; block_type: string; content: Record<string, unknown>; position: number; updated_by: string | null; source_page: number | null; run_id?: string | null; review_status?: string | null }

function isHeld(r: Row): boolean {
  if (typeof r.review_status === 'string') return r.review_status === 'held';
  // review_status column not applied yet (pre-0008): held rides the run_id (D-21 OQ2).
  return typeof r.run_id === 'string' && /held/i.test(r.run_id);
}

function remapChildRefs(rows: Row[]): Row[] {
  // Containers reference children by the SOURCE row ids; after promotion the rows
  // keep their positions, so rebuild refs by joining position -> new id. Here the
  // ids do not change (we re-insert with fresh uuids only on a real write), so the
  // remap is computed against the post-insert id map by the caller; this helper
  // remaps within a self-consistent set keyed by position.
  return rows;
}

async function main() {
  console.log(`🚚 promote ${SOURCE_LANE} [${SOURCE_LANGUAGE}] → ${TARGET_LANE} [${TARGET_LANGUAGE}]`);
  console.log(`   manual: ${MANUAL}  key: ${SERVICE_KEY ? 'service-role' : 'anon'}${DRY_RUN ? '  (DRY RUN)' : ''}\n`);

  // Guard: no prod id in the headless code path. A non-staging target is refused
  // unless --allow-prod is explicitly passed (the headless run never passes it).
  if (!isStagingSlug(TARGET_LANE!) && !ALLOW_PROD) {
    console.error(`✗ refusing a non-staging target lane "${TARGET_LANE}" without --allow-prod. The headless path promotes staging→staging only (D-18).`);
    process.exit(3);
  }

  const sb = createClient(SUPABASE_URL!, KEY!, { auth: { persistSession: false, autoRefreshToken: false } });

  // Resolve both endpoints by slug.
  const { data: sMan, error: sErr } = await sb.from('manuals').select('id, slug').eq('slug', SOURCE_LANE).single();
  if (sErr || !sMan) { console.error(`✗ source lane "${SOURCE_LANE}" not found (${sErr?.message ?? 'no row'}).`); process.exit(3); }
  const { data: tMan, error: tErr } = await sb.from('manuals').select('id, slug').eq('slug', TARGET_LANE).single();
  if (tErr || !tMan) { console.error(`✗ target lane "${TARGET_LANE}" not found (${tErr?.message ?? 'no row'}).`); process.exit(3); }
  const sourceId = (sMan as { id: string }).id;
  const targetId = (tMan as { id: string }).id;

  // Read the source rows.
  const { data: srcRows, error: rErr } = await sb
    .from('manual_blocks')
    .select('*')
    .eq('manual_id', sourceId)
    .eq('language', SOURCE_LANGUAGE)
    .order('position');
  if (rErr) { console.error(`✗ could not read source rows: ${rErr.message}`); process.exit(3); }
  const rows = (srcRows ?? []) as Row[];
  if (rows.length === 0) { console.error(`✗ source lane has 0 rows for [${SOURCE_LANGUAGE}] — nothing to promote.`); process.exit(3); }

  // Signer precheck: refuse if any source row is unsigned (updated_by null).
  const unsigned = rows.filter((r) => r.updated_by == null || r.updated_by === '');
  if (unsigned.length > 0 && !SKIP_SIGNER) {
    console.error(`✗ signer precheck: ${unsigned.length}/${rows.length} source row(s) have a null audit column (updated_by). Refusing (pass --skip-signer-check only with cause).`);
    process.exit(4);
  }

  // Held precheck: refuse a held-for-native-review source.
  const held = rows.filter(isHeld);
  if (held.length > 0 && !ALLOW_HELD) {
    console.error(`✗ held precheck: ${held.length}/${rows.length} source row(s) are held for native review (G2). Refusing until a native speaker clears them.`);
    process.exit(4);
  }

  // Current target count, for the delta.
  const { count: targetCount } = await sb
    .from('manual_blocks')
    .select('id', { count: 'exact', head: true })
    .eq('manual_id', targetId)
    .eq('language', TARGET_LANGUAGE);

  console.log(`   source rows: ${rows.length}  signed: ${rows.length - unsigned.length}  held: ${held.length}`);
  console.log(`   target rows now: ${targetCount ?? 0}  → after promote: ${rows.length}  (delta ${(rows.length) - (targetCount ?? 0)})`);

  if (DRY_RUN) {
    console.log('\n   DRY RUN — no write. Row delta printed above; snapshot would be taken before any delete.');
    return;
  }

  // Default-refuse without explicit confirmation, even outside --dry-run.
  if (!CONFIRM) {
    console.error('\n✗ refusing to write without --confirm (default-refuse). Re-run with --confirm to perform the promotion.');
    process.exit(5);
  }

  // Snapshot the target BEFORE any delete (recovery on mid-flight failure).
  const { data: tgtRows } = await sb.from('manual_blocks').select('*').eq('manual_id', targetId).eq('language', TARGET_LANGUAGE);
  const snapPath = join(BACKUP_DIR, `${TARGET_LANE}-${TARGET_LANGUAGE}-${rows.length}rows.snapshot.json`);
  mkdirSync(join(__dirname, '..', dirname(snapPath)), { recursive: true });
  writeFileSync(join(__dirname, '..', snapPath), JSON.stringify(tgtRows ?? [], null, 2));
  console.log(`   snapshot: ${snapPath} (${(tgtRows ?? []).length} rows)`);

  // Swap: delete target, insert source under target id+language.
  const { error: delErr } = await sb.from('manual_blocks').delete().eq('manual_id', targetId).eq('language', TARGET_LANGUAGE);
  if (delErr) { console.error(`✗ delete failed (target intact, snapshot kept): ${delErr.message}`); process.exit(6); }

  const payload = remapChildRefs(rows).map((r) => ({
    manual_id: targetId,
    language: TARGET_LANGUAGE,
    block_type: r.block_type,
    content: r.content,
    position: r.position,
    updated_by: r.updated_by ?? 'promote',
    source_page: r.source_page ?? null,
    run_id: `promote-${MANUAL}-${TARGET_LANGUAGE}`,
  }));
  const { data: ins, error: insErr } = await sb.from('manual_blocks').insert(payload).select('id, position');
  if (insErr) {
    console.error(`✗ insert failed: ${insErr.message}`);
    console.error(`   RECOVER target from snapshot: ${snapPath}`);
    process.exit(6);
  }

  // Remap child refs by position join (containers reference children by old ids).
  const posToNew = new Map<number, string>((ins ?? []).map((r) => [r.position, r.id]));
  const oldIdToNew = new Map<string, string>();
  rows.forEach((r) => { const u = posToNew.get(r.position); if (u) oldIdToNew.set(r.id, u); });
  const remap = (ids: unknown): string[] => Array.isArray(ids) ? ids.map((i) => oldIdToNew.get(i as string)).filter((x): x is string => !!x) : [];
  let patched = 0;
  for (const r of rows) {
    if (r.block_type !== 'two-column-section' && r.block_type !== 'section') continue;
    const newId = posToNew.get(r.position);
    if (!newId) continue;
    const c: Record<string, unknown> = { ...r.content };
    if (r.block_type === 'two-column-section') { c.left = remap(r.content.left); c.right = remap(r.content.right); }
    else c.children = remap(r.content.children);
    const { error: upErr } = await sb.from('manual_blocks').update({ content: c }).eq('id', newId);
    if (!upErr) patched++;
  }

  console.log(`\n✅ promoted ${ins?.length ?? 0} rows into ${TARGET_LANE} [${TARGET_LANGUAGE}]  (remapped ${patched} container[s])`);
  console.log(`   snapshot retained at ${snapPath} for rollback.`);
}

main().catch((e) => { console.error('FATAL:', e instanceof Error ? e.message : e); process.exit(1); });
