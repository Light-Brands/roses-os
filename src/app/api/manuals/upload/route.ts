import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * POST /api/manuals/upload
 * Upload an image (file picker, drag-drop, or clipboard paste) for use in
 * manual blocks. Accepts multipart form data with a 'file' field.
 *
 * Storage: the public Supabase Storage bucket `manual-uploads`. The previous
 * implementation wrote to `public/uploads/` on the local filesystem, which works
 * in dev but SILENTLY FAILS on Vercel — the serverless filesystem is read-only,
 * so a replaced image never persisted in production (the editor's upload returned
 * 500 and `content.src` never changed). Supabase Storage works in both dev and
 * prod and returns a stable public URL. Upload rides the same anon key the rest
 * of the manuals API uses (the bucket carries an anon-insert policy); reads are
 * public via the bucket's public URL.
 */

const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

const BUCKET = 'manual-uploads';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const ext = MIME_EXT[file.type];
    if (!ext) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB' }, { status: 400 });
    }

    const filename = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.storage.from(BUCKET).upload(filename, buffer, {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    });

    if (error) {
      return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
    }

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(filename);
    return NextResponse.json(
      { data: { url: pub.publicUrl, path: `${BUCKET}/${filename}`, filename } },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
