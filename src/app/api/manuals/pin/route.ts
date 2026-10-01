import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * PUT /api/manuals/pin
 * Update a PIN (admin only — for now, no auth check; will add admin gate later)
 * Body: { type: 'editor' | 'teacher', pin: string }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, pin } = body;

    if (!type || !pin || !['editor', 'teacher'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type or PIN' }, { status: 400 });
    }

    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json({ error: 'PIN must be exactly 4 digits' }, { status: 400 });
    }

    const key = type === 'editor' ? 'manual_editor_pin' : 'manual_teacher_pin';

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from('settings')
      .update({ value: JSON.stringify(pin) })
      .eq('key', key);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
