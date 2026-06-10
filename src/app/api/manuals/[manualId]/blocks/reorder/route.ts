import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * PUT /api/manuals/[manualId]/blocks/reorder
 * Reorder blocks by updating their positions
 * Body: { block_ids: string[], updated_by?: string }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { block_ids, updated_by } = body;

    if (!Array.isArray(block_ids) || block_ids.length === 0) {
      return NextResponse.json({ error: 'block_ids must be a non-empty array' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // `manual_blocks` carries a UNIQUE (manual_id, language, position) key
    // (migration 0006). Renumbering directly to 0..N-1 — whether in parallel or
    // sequentially — transiently collides with rows that still hold a target
    // position, raising 23505. Renumber in two passes through a DISJOINT offset
    // window instead: every target in pass 1 is >= OFFSET (above any live
    // position) and every target in pass 2 is < OFFSET (every source is now
    // >= OFFSET), so no per-row uniqueness check can ever collide. Each pass is
    // one transaction via the atomic RPC.
    const OFFSET = 1_000_000;
    const parked = block_ids.map((id: string, index: number) => ({ id, position: OFFSET + index }));
    const final = block_ids.map((id: string, index: number) => ({ id, position: index }));

    const { error: parkErr } = await supabase.rpc('reorder_blocks_atomic', {
      items_arg: parked,
      updated_by_arg: updated_by ?? null,
    });
    if (parkErr) {
      return NextResponse.json({ error: parkErr.message }, { status: 500 });
    }

    const { error: finalErr } = await supabase.rpc('reorder_blocks_atomic', {
      items_arg: final,
      updated_by_arg: updated_by ?? null,
    });
    if (finalErr) {
      return NextResponse.json({ error: finalErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
