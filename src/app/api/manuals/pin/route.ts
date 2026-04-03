import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * POST /api/manuals/pin
 * Verify a PIN and return the role
 * Body: { pin: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin } = body;

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json({ success: false, error: 'PIN is required' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // Fetch both PINs from settings
    const { data: settings, error } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['manual_editor_pin', 'manual_teacher_pin']);

    if (error) {
      return NextResponse.json({ success: false, error: 'Failed to verify PIN' }, { status: 500 });
    }

    const editorSetting = settings?.find((s) => s.key === 'manual_editor_pin');
    const teacherSetting = settings?.find((s) => s.key === 'manual_teacher_pin');

    // Extract PIN from JSONB value — may be stored as "1234" (JSON string) or just 1234
    const extractPin = (val: unknown): string | null => {
      if (val === null || val === undefined) return null;
      // If it's already a string (JSONB text), return it directly
      if (typeof val === 'string') return val;
      // If it's a number, convert to string
      if (typeof val === 'number') return String(val);
      return String(val);
    };

    const editorPin = editorSetting ? extractPin(editorSetting.value) : null;
    const teacherPin = teacherSetting ? extractPin(teacherSetting.value) : null;

    if (pin === editorPin) {
      return NextResponse.json({ success: true, role: 'editor' });
    }

    if (pin === teacherPin) {
      return NextResponse.json({ success: true, role: 'teacher' });
    }

    return NextResponse.json({ success: false, error: 'Incorrect PIN' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

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
