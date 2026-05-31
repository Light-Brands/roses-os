import { createClient } from '@/lib/supabase/client';
import type { Json } from '@/lib/supabase/types';
import type { Manual, ManualBlock, ManualLanguage, BlockType, BlockContent } from './types';

// =============================================================================
// MANUAL QUERIES
// =============================================================================

/** Fetch all manuals, ordered by sort_order */
export async function getManuals(): Promise<Manual[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('manuals')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw new Error(`Failed to fetch manuals: ${error.message}`);
  return (data ?? []) as unknown as Manual[];
}

/** Fetch a single manual by ID */
export async function getManual(id: string): Promise<Manual | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('manuals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as unknown as Manual;
}

// =============================================================================
// BLOCK QUERIES
// =============================================================================

/** Fetch all blocks for a manual in a specific language, ordered by position */
export async function getBlocks(manualId: string, language: ManualLanguage): Promise<ManualBlock[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('manual_blocks')
    .select('*')
    .eq('manual_id', manualId)
    .eq('language', language)
    .order('position', { ascending: true });

  if (error) throw new Error(`Failed to fetch blocks: ${error.message}`);
  return (data ?? []) as unknown as ManualBlock[];
}

/** Create a new block */
export async function createBlock(
  manualId: string,
  language: ManualLanguage,
  blockType: BlockType,
  content: BlockContent,
  position: number,
  updatedBy?: string
): Promise<ManualBlock> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('manual_blocks')
    .insert({
      manual_id: manualId,
      language,
      block_type: blockType,
      content: content as unknown as Json,
      position,
      updated_by: updatedBy ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create block: ${error.message}`);
  return data as unknown as ManualBlock;
}

/** Update a block's content */
export async function updateBlock(
  blockId: string,
  content: BlockContent,
  updatedBy?: string
): Promise<ManualBlock> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('manual_blocks')
    .update({
      content: content as unknown as Json,
      updated_by: updatedBy ?? null,
    })
    .eq('id', blockId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update block: ${error.message}`);
  return data as unknown as ManualBlock;
}

/** Delete a block */
export async function deleteBlock(blockId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('manual_blocks')
    .delete()
    .eq('id', blockId);

  if (error) throw new Error(`Failed to delete block: ${error.message}`);
}

/**
 * Reorder blocks by updating their positions.
 *
 * T-044 + AC13: wraps the per-row updates in a single Postgres transaction
 * via the `reorder_blocks_atomic` RPC. The RPC accepts an array of
 * `{id, position}` and updates all rows in one transaction with the
 * SERIALIZABLE isolation level so concurrent reorders can't produce partial
 * states. The N-statement parallel fallback path preserves backward compat
 * until the RPC migration lands.
 */
export async function reorderBlocks(
  blockIds: string[],
  updatedBy?: string
): Promise<void> {
  const supabase = createClient();

  // Preferred path: atomic RPC. The RPC lives in the migration that ships
  // alongside this code; if the migration has not yet been applied to the
  // target DB, the RPC errors with PGRST202 and we fall back to the parallel
  // updates (legacy behavior).
  const items = blockIds.map((id, index) => ({ id, position: index }));
  type AtomicArgs = { items_arg: { id: string; position: number }[]; updated_by_arg: string | null };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rpc = (supabase.rpc as unknown as (n: string, a: AtomicArgs) => Promise<{ error: { code?: string; message: string } | null }>);
  const rpcResult = await rpc('reorder_blocks_atomic', {
    items_arg: items,
    updated_by_arg: updatedBy ?? null,
  });

  if (rpcResult.error && rpcResult.error.code !== 'PGRST202') {
    throw new Error(`Failed to reorder blocks (atomic): ${rpcResult.error.message}`);
  }
  if (!rpcResult.error) return;

  // Fallback: parallel per-row updates. Loses transactional atomicity but
  // matches the legacy behavior so the editor keeps working before the
  // RPC migration runs.
  const updates = blockIds.map((id, index) =>
    supabase
      .from('manual_blocks')
      .update({ position: index, updated_by: updatedBy ?? null })
      .eq('id', id)
  );
  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) throw new Error(`Failed to reorder blocks: ${failed.error.message}`);
}

// =============================================================================
// SETTINGS QUERIES
// =============================================================================

/** Get a setting value by key */
export async function getSetting(key: string): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error) return null;
  const val = data.value;
  if (val === null || val === undefined) return null;
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  return String(val);
}

/** Update a setting value */
export async function updateSetting(key: string, value: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('settings')
    .update({ value: JSON.stringify(value) })
    .eq('key', key);

  if (error) throw new Error(`Failed to update setting: ${error.message}`);
}

/** Get the last edit info for a manual+language */
export async function getLastEditInfo(
  manualId: string,
  language: ManualLanguage
): Promise<{ updated_by: string | null; updated_at: string } | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('manual_blocks')
    .select('updated_by, updated_at')
    .eq('manual_id', manualId)
    .eq('language', language)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data as unknown as { updated_by: string | null; updated_at: string };
}
