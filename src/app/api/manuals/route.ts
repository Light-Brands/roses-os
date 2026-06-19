import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isStagingSlug } from '@/lib/manuals/staging';

/**
 * GET /api/manuals
 * List production manuals ordered by sort_order.
 *
 * Staging-lane rows (slug `<prod>__staging`) are a structurally isolated sibling
 * lane for the reconstruction pipeline and must stay invisible to production reads
 * (staging.ts contract). They were leaking into the /manuals grid, so we filter
 * them out here.
 */
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('manuals')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const production = (data ?? []).filter((m) => !isStagingSlug(m.slug ?? ''));

    return NextResponse.json({ data: production });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
