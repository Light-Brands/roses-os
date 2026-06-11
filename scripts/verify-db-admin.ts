/**
 * T-004 + AC4, AC6 proof (offline, no DB):
 *   - the admin module fails closed when SUPABASE_SERVICE_ROLE_KEY is absent,
 *   - the Zod write gate rejects an invalid block with the named-error envelope
 *     and accepts a valid one,
 *   - bulkUpsertBlocks refuses an invalid batch BEFORE any insert.
 *
 *   set -a; . ./.env.local; set +a; npx tsx scripts/verify-db-admin.ts
 */

import { getAdminClient, bulkUpsertBlocks, SERVICE_ROLE_ENV } from '../src/lib/manuals/db.admin';
import { validateBlockInput } from '../src/lib/manuals/block-schema';
import type { BlockContent } from '../src/lib/manuals/types';

let pass = true;
function check(name: string, cond: boolean): void {
  console.log(`  ${cond ? 'PASS' : 'FAIL'}: ${name}`);
  if (!cond) pass = false;
}

async function main(): Promise<void> {
  // AC4: fail closed when the service-role key is absent.
  delete process.env[SERVICE_ROLE_ENV];
  let threw = false;
  let msg = '';
  try {
    getAdminClient();
  } catch (e) {
    threw = true;
    msg = e instanceof Error ? e.message : String(e);
  }
  check(`AC4 getAdminClient throws when ${SERVICE_ROLE_ENV} absent`, threw && msg.includes(SERVICE_ROLE_ENV));

  // AC6: the write gate rejects an invalid block with the named envelope.
  const bad = validateBlockInput({ block_type: 'contents', content: { schema_version: 2 } });
  check(
    'AC6 invalid contents rejected with INVALID_BLOCK envelope',
    bad.ok === false && bad.body.ok === false && bad.body.error.code === 'INVALID_BLOCK'
  );

  // AC6: a valid block passes.
  const good = validateBlockInput({
    block_type: 'contents',
    content: { schema_version: 2, rows: [{ title: 'Getting Ready', numeral: '1', page: '4' }] },
  });
  check('AC6 valid contents accepted', good.ok === true);

  // AC6: bulkUpsertBlocks refuses an invalid batch BEFORE touching the database.
  let bvThrew = false;
  try {
    await bulkUpsertBlocks('00000000-0000-0000-0000-000000000000', 'en', [
      { block_type: 'contents', content: { schema_version: 2 } as unknown as BlockContent, position: 0 },
    ]);
  } catch (e) {
    bvThrew = e instanceof Error && e.name === 'BlockValidationError';
  }
  check('AC6 bulkUpsertBlocks rejects invalid batch before any insert', bvThrew);

  console.log(`\nT-004 / AC4 + AC6: ${pass ? 'PASS' : 'FAIL'}`);
  process.exit(pass ? 0 : 1);
}

main().catch((err) => {
  console.error('verify-db-admin error:', err instanceof Error ? err.message : err);
  process.exit(2);
});
