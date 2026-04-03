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

/** Reorder blocks by updating their positions */
export async function reorderBlocks(
  blockIds: string[],
  updatedBy?: string
): Promise<void> {
  const supabase = createClient();

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
  // Settings values are stored as JSON strings (e.g. '"1234"')
  const val = data.value;
  return typeof val === 'string' ? val : JSON.stringify(val);
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
