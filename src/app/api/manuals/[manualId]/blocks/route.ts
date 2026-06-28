import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Json } from '@/lib/supabase/types';

/**
 * GET /api/manuals/[manualId]/blocks?language=en
 * Fetch all blocks for a manual in a specific language
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ manualId: string }> }
) {
  try {
    const { manualId } = await params;
    const language = request.nextUrl.searchParams.get('language') || 'en';

    const supabase = await createServerSupabaseClient();
    // Reads exclude soft-deleted rows (migration 0009, D-23). A deleted block's
    // row survives so undo can restore it, but it must not render.
    const { data, error } = await supabase
      .from('manual_blocks')
      .select('*')
      .eq('manual_id', manualId)
      .eq('language', language)
      .eq('is_deleted', false)
      .order('position', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/manuals/[manualId]/blocks
 * Create a new block
 * Body: { language, block_type, content, position, updated_by? }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ manualId: string }> }
) {
  try {
    const { manualId } = await params;
    const body = await request.json();
    const { language, block_type, content, updated_by } = body;

    if (!language || !block_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // The interim insert position is assigned SERVER-SIDE as (current max for this
    // manual + language) + 1, so a create can never collide with an occupied slot.
    // `manual_blocks` carries a UNIQUE (manual_id, language, position) key
    // (migration 0006). A client cannot safely pick the free slot: after a delete
    // (which does not renumber) positions are non-contiguous and `row count` is
    // an occupied position, raising 23505. The client reorders immediately after
    // every create, which re-contiguifies, so this interim position only has to
    // be collision-free, not final. A one-shot retry covers the rare concurrent
    // create race that two readers of max could otherwise lose.
    async function nextPosition(): Promise<number> {
      const { data: top } = await supabase
        .from('manual_blocks')
        .select('position')
        .eq('manual_id', manualId)
        .eq('language', language)
        .order('position', { ascending: false })
        .limit(1)
        .maybeSingle();
      return (top?.position ?? -1) + 1;
    }

    const insert = (position: number) =>
      supabase
        .from('manual_blocks')
        .insert({
          manual_id: manualId,
          language,
          block_type,
          content: (content ?? {}) as Json,
          position,
          updated_by: updated_by ?? null,
        })
        .select()
        .single();

    let { data, error } = await insert(await nextPosition());
    if (error && error.code === '23505') {
      ({ data, error } = await insert(await nextPosition()));
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/manuals/[manualId]/blocks
 * Update a block's content
 * Body: { id, content, updated_by? }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, content, updated_by, is_deleted } = body;

    if (!id || content === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    // `is_deleted` rides the existing save path so undo can restore a deleted
    // block (is_deleted=false) through the same route it edits content with
    // (D-23). When the field is absent the flag is left untouched.
    const patch: { content: Json; updated_by: string | null; is_deleted?: boolean } = {
      content: content as Json,
      updated_by: updated_by ?? null,
    };
    if (typeof is_deleted === 'boolean') patch.is_deleted = is_deleted;
    const { data, error } = await supabase
      .from('manual_blocks')
      .update(patch)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/manuals/[manualId]/blocks
 * Delete a block
 * Body: { id }
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing block id' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    // Soft-delete (migration 0009, D-23): flip the flag instead of removing the
    // row, so undo can restore the same block by un-flagging it. Reads already
    // filter is_deleted=false, so the block disappears from the editor at once.
    const { error } = await supabase
      .from('manual_blocks')
      .update({ is_deleted: true })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
