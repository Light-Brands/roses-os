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

    const updates = block_ids.map((id: string, index: number) =>
      supabase
        .from('manual_blocks')
        .update({ position: index, updated_by: updated_by ?? null })
        .eq('id', id)
    );

    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);

    if (failed?.error) {
      return NextResponse.json({ error: failed.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
