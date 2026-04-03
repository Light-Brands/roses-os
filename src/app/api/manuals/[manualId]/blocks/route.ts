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
    const { data, error } = await supabase
      .from('manual_blocks')
      .select('*')
      .eq('manual_id', manualId)
      .eq('language', language)
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
    const { language, block_type, content, position, updated_by } = body;

    if (!language || !block_type || position === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
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
    const { id, content, updated_by } = body;

    if (!id || content === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('manual_blocks')
      .update({
        content: content as Json,
        updated_by: updated_by ?? null,
      })
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
    const { error } = await supabase
      .from('manual_blocks')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
