import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, getServerUser } from '@/lib/supabase/server';
import sharp from 'sharp';

// Standard API response helper
function apiResponse<T>(
  data: T | null,
  error: string | null = null,
  status = 200
) {
  return NextResponse.json({ data, error }, { status });
}

// Allowed file types
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Image optimization settings
const IMAGE_OPTIMIZATION = {
  maxWidth: 2048,
  maxHeight: 2048,
  quality: 85,
};

/**
 * GET /api/media
 * List media files for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const user = await getServerUser();

    if (!user) {
      return apiResponse(null, 'Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type'); // 'image', 'pdf', etc.

    let query = supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by file type if specified
    if (type === 'image') {
      query = query.like('file_type', 'image/%');
    } else if (type) {
      query = query.eq('file_type', type);
    }

    const { data, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      return apiResponse(null, error.message, 500);
    }

    return apiResponse({
      items: data,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    });
  } catch (error) {
    console.error('GET /api/media error:', error);
    return apiResponse(null, 'Internal server error', 500);
  }
}

/**
 * POST /api/media
 * Upload a new media file (requires authentication)
 *
 * Accepts FormData with 'file' field
 * Optional 'alt_text' field
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const user = await getServerUser();

    if (!user) {
      return apiResponse(null, 'Unauthorized', 401);
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const altText = formData.get('alt_text') as string | null;

    if (!file) {
      return apiResponse(null, 'No file provided', 400);
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return apiResponse(null, 'File type not allowed', 400);
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return apiResponse(null, 'File too large (max 10MB)', 400);
    }

    // Get file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Process and optimize images
    let processedBuffer = buffer;
    let width: number | null = null;
    let height: number | null = null;

    if (file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
      try {
        const image = sharp(buffer);
        const metadata = await image.metadata();

        width = metadata.width || null;
        height = metadata.height || null;

        // Resize if too large
        if (
          (width && width > IMAGE_OPTIMIZATION.maxWidth) ||
          (height && height > IMAGE_OPTIMIZATION.maxHeight)
        ) {
          processedBuffer = await image
            .resize(IMAGE_OPTIMIZATION.maxWidth, IMAGE_OPTIMIZATION.maxHeight, {
              fit: 'inside',
              withoutEnlargement: true,
            })
            .webp({ quality: IMAGE_OPTIMIZATION.quality })
            .toBuffer();

          // Update dimensions
          const resizedMetadata = await sharp(processedBuffer).metadata();
          width = resizedMetadata.width || width;
          height = resizedMetadata.height || height;
        } else {
          // Just optimize without resizing
          processedBuffer = await image
            .webp({ quality: IMAGE_OPTIMIZATION.quality })
            .toBuffer();
        }
      } catch (imageError) {
        console.error('Image processing error:', imageError);
        // Continue with original buffer if processing fails
        processedBuffer = buffer;
      }
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const extension = file.type.startsWith('image/')
      ? 'webp'
      : file.name.split('.').pop() || 'bin';
    const fileName = `${timestamp}-${randomId}.${extension}`;
    const filePath = `uploads/${user.id}/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, processedBuffer, {
        contentType: file.type.startsWith('image/') ? 'image/webp' : file.type,
        cacheControl: '31536000', // 1 year
      });

    if (uploadError) {
      return apiResponse(null, uploadError.message, 500);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    // Save to database
    const { data, error: dbError } = await supabase
      .from('media')
      .insert({
        name: file.name,
        file_path: filePath,
        file_type: file.type.startsWith('image/') ? 'image/webp' : file.type,
        file_size: processedBuffer.length,
        width,
        height,
        alt_text: altText,
        uploaded_by: user.id,
      })
      .select()
      .single();

    if (dbError) {
      // Clean up uploaded file on DB error
      await supabase.storage.from('media').remove([filePath]);
      return apiResponse(null, dbError.message, 500);
    }

    return apiResponse({
      ...data,
      url: publicUrl,
    }, null, 201);
  } catch (error) {
    console.error('POST /api/media error:', error);
    return apiResponse(null, 'Internal server error', 500);
  }
}

/**
 * DELETE /api/media
 * Delete a media file (requires authentication and ownership)
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const user = await getServerUser();

    if (!user) {
      return apiResponse(null, 'Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return apiResponse(null, 'Media ID is required', 400);
    }

    // Get media record
    const { data: media, error: fetchError } = await supabase
      .from('media')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !media) {
      return apiResponse(null, 'Media not found', 404);
    }

    // Check ownership
    if (media.uploaded_by !== user.id) {
      // Check if admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        return apiResponse(null, 'Forbidden', 403);
      }
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('media')
      .remove([media.file_path]);

    if (storageError) {
      console.error('Storage delete error:', storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('media')
      .delete()
      .eq('id', id);

    if (dbError) {
      return apiResponse(null, dbError.message, 500);
    }

    return apiResponse({ success: true });
  } catch (error) {
    console.error('DELETE /api/media error:', error);
    return apiResponse(null, 'Internal server error', 500);
  }
}
