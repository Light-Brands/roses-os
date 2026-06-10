/**
 * Stage a translated manual into the Supabase staging lane.
 *
 * Reads a `source.json` (from extract-translatable.ts) plus a sibling
 * `translations.<to>.json` of `[{ idx, text }]`, rebuilds each block's content
 * by writing the translated strings back at their original paths (structure,
 * ids, refs, images, enums all preserved), validates every block through the
 * same Zod write-gate the API uses, then writes the result into the
 * `<prod-slug>__staging` lane under the TARGET language.
 *
 * Staging is isolated (D-5): a prod read never sees these rows, so a translation
 * can be reviewed in the editor before any promotion to prod overwrites the
 * English-duplicated locale rows.
 *
 * Writes go through the anon key. Per-row RLS still applies — this is the same
 * permission surface the interactive editor uses, not a bulk service-role path.
 * The lane is cleared for (manual,language) then re-inserted, so re-runs are
 * idempotent without depending on upsert semantics.
 *
 * General by design (ARCHITECTURE D-13): drive any manual / level / target
 * language via flags; no per-page logic.
 *
 *   Usage:
 *     npx tsx scripts/stage-translation.ts \
 *       --manual rose-meditation-level-2 --to es \
 *       [--source _qie-output/roses-os/translation/<manual>-en/source.json] \
 *       [--translations <same-dir>/translations.es.json] \
 *       [--run-id translate-l2-es] [--dry-run]
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { createClient } from '@supabase/supabase-js';
import { validateBlockInput } from '../src/lib/manuals/block-schema';
import { stagingSlugFor } from '../src/lib/manuals/staging';
import { applyStrings } from '../src/lib/manuals/translate-fields';

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
const TO_LANG = arg('to')!;
const DEFAULT_DIR = join('_qie-output', 'roses-os', 'translation', `${MANUAL_SLUG}-en`);
const SOURCE = arg('source', join(DEFAULT_DIR, 'source.json'))!;
const TRANSLATIONS = arg('translations', join(DEFAULT_DIR, `translations.${TO_LANG}.json`))!;
const RUN_ID = arg('run-id', `translate-${MANUAL_SLUG}-${TO_LANG}`)!;
const DRY_RUN = process.argv.includes('--dry-run');

if (!TO_LANG) {
  console.error('✗ --to <lang> is required (target language: es|pt|el|ru|uk).');
  process.exit(1);
}

const env = loadEnvLocal();
const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const ANON =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !ANON) {
  console.error('✗ NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY required.');
  process.exit(1);
}

interface SourceBlock {
  id: string;
  position: number;
  block_type: string;
  content: Record<string, unknown>;
  source_page: number | null;
}
interface SourceFile {
  manual: string;
  manualId: string;
  srcLang: string;
  blocks: SourceBlock[];
  strings: { idx: number; position: number; path: (string | number)[]; kind: string; text: string }[];
}

function remapIds(ids: unknown, map: Map<string, string>): string[] {
  return Array.isArray(ids) ? ids.map((id) => map.get(id as string)).filter((x): x is string => !!x) : [];
}

async function main() {
  console.log(`🌹 Stage translation → ${MANUAL_SLUG}__staging [${TO_LANG}]`);
  console.log(`   source:       ${SOURCE}`);
  console.log(`   translations: ${TRANSLATIONS}${DRY_RUN ? '  (DRY RUN — no writes)' : ''}\n`);

  const src: SourceFile = JSON.parse(readFileSync(join(__dirname, '..', SOURCE), 'utf-8'));
  const trans: { idx: number; text: string }[] = JSON.parse(readFileSync(join(__dirname, '..', TRANSLATIONS), 'utf-8'));
  const byIdx = new Map<number, string>(trans.map((t) => [t.idx, t.text]));

  // 0) COVERAGE ASSERT (T-008, AC6). The stager used to keep the SOURCE text on a
  // missing idx, which silently stages English under a foreign locale — exactly the
  // failure D-21 warns about. Refuse the batch when ANY source idx is absent from
  // the translation file or maps to an empty string. A short or mis-indexed MT
  // output cannot pass this gate; the only way to stage is full coverage.
  const missingIdx = src.strings
    .filter((s) => { const t = byIdx.get(s.idx); return t == null || t === ''; })
    .map((s) => s.idx);
  if (missingIdx.length > 0) {
    const sample = missingIdx.slice(0, 12).join(', ');
    console.error(`✗ MT coverage incomplete: ${missingIdx.length}/${src.strings.length} source string(s) have no translation in ${TRANSLATIONS}.`);
    console.error(`   missing idx: ${sample}${missingIdx.length > 12 ? ', …' : ''}`);
    console.error('   Refusing to stage — English would be staged under a foreign locale. Re-run translate-mt.ts to fill the gaps.');
    process.exit(1);
  }
  console.log(`   ✓ MT coverage complete: all ${src.strings.length} source strings have a translation`);

  // 1) apply translated strings back into each block's content, by position+path
  const perPos = new Map<number, { path: (string | number)[]; text: string }[]>();
  for (const s of src.strings) {
    const t = byIdx.get(s.idx)!; // coverage assert above guarantees presence + non-empty
    const list = perPos.get(s.position) ?? [];
    list.push({ path: s.path, text: t });
    perPos.set(s.position, list);
  }

  const built = src.blocks.map((b) => ({
    ...b,
    content: applyStrings(b.content, perPos.get(b.position) ?? []) as Record<string, unknown>,
  }));

  // 2) validate EVERY block before any write (fail closed)
  let bad = 0;
  built.forEach((b) => {
    const outcome = validateBlockInput({ block_type: b.block_type, content: b.content });
    if (!outcome.ok) {
      bad++;
      console.error(`   ✗ pos ${b.position} (${b.block_type}): ${outcome.body.error.issues?.[0]?.message ?? outcome.body.error.message}`);
    }
  });
  if (bad > 0) {
    console.error(`\n✗ ${bad} block(s) failed validation — refusing the batch.`);
    process.exit(1);
  }
  console.log(`   ✓ all ${built.length} blocks pass the Zod write gate`);

  const supabase = createClient(SUPABASE_URL!, ANON!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 3) resolve the staging lane
  const stagingSlug = stagingSlugFor(MANUAL_SLUG);
  const { data: man, error: mErr } = await supabase.from('manuals').select('id').eq('slug', stagingSlug).single();
  if (mErr || !man) {
    console.error(`✗ staging manual "${stagingSlug}" not found — run migration 0007. (${mErr?.message ?? 'no row'})`);
    process.exit(1);
  }
  const stagingId = (man as { id: string }).id;
  console.log(`   staging manual_id: ${stagingId}`);

  if (DRY_RUN) {
    const dist: Record<string, number> = {};
    built.forEach((b) => (dist[b.block_type] = (dist[b.block_type] || 0) + 1));
    console.log('\n   DRY RUN — would replace staging lane with:', JSON.stringify(dist));
    return;
  }

  // 4) clear the (lane, language) slot, then insert fresh (idempotent re-run)
  const { error: delErr } = await supabase
    .from('manual_blocks')
    .delete()
    .eq('manual_id', stagingId)
    .eq('language', TO_LANG);
  if (delErr) {
    console.error(`✗ clear failed: ${delErr.message}`);
    process.exit(1);
  }

  const payload = built.map((b) => ({
    manual_id: stagingId,
    language: TO_LANG,
    block_type: b.block_type,
    content: b.content,
    position: b.position,
    updated_by: 'translate',
    source_page: b.source_page ?? null,
    run_id: RUN_ID,
  }));
  // Chunked insert: a reconstructed manual embeds figure data URLs, so a single
  // insert of all blocks trips the Postgres statement timeout (seen on L3 es/pt).
  // Small batches keep each statement under the timeout; the lane was cleared above
  // so this stays a clean replace.
  const CHUNK = 10;
  const insertedRows: { id: string; position: number }[] = [];
  for (let i = 0; i < payload.length; i += CHUNK) {
    const { data: part, error: pErr } = await supabase.from('manual_blocks').insert(payload.slice(i, i + CHUNK)).select('id, position');
    if (pErr) { console.error(`✗ insert failed on rows ${i}..${i + CHUNK - 1}: ${pErr.message}`); process.exit(1); }
    if (part) insertedRows.push(...part);
  }
  const inserted = insertedRows;
  const insErr = null as { message: string } | null;
  if (insErr) {
    console.error(`✗ insert failed: ${insErr.message}`);
    process.exit(1);
  }
  console.log(`\n✅ inserted ${inserted?.length ?? 0} blocks into ${stagingSlug} [${TO_LANG}]`);

  // 5) remap nested child references. Containers reference children by the SOURCE
  // language's block ids; the freshly inserted staging rows carry new uuids.
  // Join staging-by-position → source-by-position to build sourceId → stagingUuid.
  const posToStagingUuid = new Map<number, string>((inserted ?? []).map((r) => [r.position, r.id]));
  const sourceIdToStagingUuid = new Map<string, string>();
  for (const b of built) {
    const u = posToStagingUuid.get(b.position);
    if (u) sourceIdToStagingUuid.set(b.id, u);
  }
  let patched = 0;
  let dropped = 0;
  for (const b of built) {
    if (b.block_type !== 'two-column-section' && b.block_type !== 'section') continue;
    const uuid = posToStagingUuid.get(b.position);
    if (!uuid) continue;
    const c: Record<string, unknown> = { ...b.content };
    if (b.block_type === 'two-column-section') {
      const left = remapIds(b.content.left, sourceIdToStagingUuid);
      const right = remapIds(b.content.right, sourceIdToStagingUuid);
      dropped += ((b.content.left as unknown[])?.length ?? 0) - left.length;
      dropped += ((b.content.right as unknown[])?.length ?? 0) - right.length;
      c.left = left;
      c.right = right;
    } else {
      const children = remapIds(b.content.children, sourceIdToStagingUuid);
      dropped += ((b.content.children as unknown[])?.length ?? 0) - children.length;
      c.children = children;
    }
    const { error: upErr } = await supabase.from('manual_blocks').update({ content: c }).eq('id', uuid);
    if (!upErr) patched++;
  }
  if (patched > 0) console.log(`   remapped child refs in ${patched} container block(s)${dropped ? ` (⚠ ${dropped} dropped)` : ''}`);

  // 6) verify
  const { count } = await supabase
    .from('manual_blocks')
    .select('id', { count: 'exact', head: true })
    .eq('manual_id', stagingId)
    .eq('language', TO_LANG);
  console.log(`   staging lane now holds ${count} ${TO_LANG} blocks`);
  console.log(`\n   review: /manuals/${stagingId}  (PIN-gated; inject sessionStorage roses-manual-auth, language=${TO_LANG})`);
}

main().catch((e) => {
  console.error('FATAL:', e instanceof Error ? e.message : e);
  process.exit(1);
});
