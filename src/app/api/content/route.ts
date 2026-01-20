import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, getServerUser } from '@/lib/supabase/server';
import type { InsertTables, UpdateTables } from '@/lib/supabase/types';

// Standard API response helper
function apiResponse<T>(
  data: T | null,
  error: string | null = null,
  status = 200
) {
  return NextResponse.json({ data, error }, { status });
}

/**
 * GET /api/content
 * List all published content or all content for authenticated users
 *
 * Query params:
 * - status: 'draft' | 'published' | 'archived' (default: 'published')
 * - limit: number (default: 10, max: 100)
 * - offset: number (default: 0)
 * - slug: string (for single item lookup)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const user = await getServerUser();
    const { searchParams } = new URL(request.url);

    // Parse query params
    const statusParam = searchParams.get('status') || 'published';
    const status = statusParam as 'draft' | 'published' | 'archived' | 'all';
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const slug = searchParams.get('slug');

    // Build query
    let query = supabase
      .from('content')
      .select('*, author:profiles(id, full_name, avatar_url)');

    // Single item by slug
    if (slug) {
      const { data, error } = await query.eq('slug', slug).single();

      if (error) {
        return apiResponse(null, 'Content not found', 404);
      }

      // Only published content for non-authenticated users
      if (!user && data.status !== 'published') {
        return apiResponse(null, 'Content not found', 404);
      }

      return apiResponse(data);
    }

    // List items
    // Non-authenticated users can only see published content
    if (!user) {
      query = query.eq('status', 'published');
    } else if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
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
    console.error('GET /api/content error:', error);
    return apiResponse(null, 'Internal server error', 500);
  }
}

/**
 * POST /api/content
 * Create new content (requires authentication)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const user = await getServerUser();

    if (!user) {
      return apiResponse(null, 'Unauthorized', 401);
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.slug) {
      return apiResponse(null, 'Title and slug are required', 400);
    }

    // Check for duplicate slug
    const { data: existing } = await supabase
      .from('content')
      .select('id')
      .eq('slug', body.slug)
      .single();

    if (existing) {
      return apiResponse(null, 'Slug already exists', 409);
    }

    // Create content
    const contentData: InsertTables<'content'> = {
      title: body.title,
      slug: body.slug,
      description: body.description || null,
      body: body.body || null,
      featured_image: body.featured_image || null,
      status: body.status || 'draft',
      author_id: user.id,
      metadata: body.metadata || null,
      published_at: body.status === 'published' ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from('content')
      .insert(contentData)
      .select()
      .single();

    if (error) {
      return apiResponse(null, error.message, 500);
    }

    return apiResponse(data, null, 201);
  } catch (error) {
    console.error('POST /api/content error:', error);
    return apiResponse(null, 'Internal server error', 500);
  }
}

/**
 * PATCH /api/content
 * Update content (requires authentication and ownership/admin)
 * Body must include 'id' field
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const user = await getServerUser();

    if (!user) {
      return apiResponse(null, 'Unauthorized', 401);
    }

    const body = await request.json();

    if (!body.id) {
      return apiResponse(null, 'Content ID is required', 400);
    }

    // Check ownership or admin status
    const { data: existing, error: fetchError } = await supabase
      .from('content')
      .select('author_id')
      .eq('id', body.id)
      .single();

    if (fetchError || !existing) {
      return apiResponse(null, 'Content not found', 404);
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (existing.author_id !== user.id && profile?.role !== 'admin') {
      return apiResponse(null, 'Forbidden', 403);
    }

    // Prepare update data
    const updateData: UpdateTables<'content'> = {
      updated_at: new Date().toISOString(),
    };

    // Only update provided fields
    const allowedFields = ['title', 'slug', 'description', 'body', 'featured_image', 'status', 'metadata'];
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        (updateData as Record<string, unknown>)[field] = body[field];
      }
    }

    // Set published_at if status changed to published
    if (body.status === 'published') {
      updateData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('content')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single();

    if (error) {
      return apiResponse(null, error.message, 500);
    }

    return apiResponse(data);
  } catch (error) {
    console.error('PATCH /api/content error:', error);
    return apiResponse(null, 'Internal server error', 500);
  }
}

/**
 * DELETE /api/content
 * Delete content (requires authentication and ownership/admin)
 * Query param: id
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
      return apiResponse(null, 'Content ID is required', 400);
    }

    // Check ownership or admin status
    const { data: existing, error: fetchError } = await supabase
      .from('content')
      .select('author_id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return apiResponse(null, 'Content not found', 404);
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (existing.author_id !== user.id && profile?.role !== 'admin') {
      return apiResponse(null, 'Forbidden', 403);
    }

    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id);

    if (error) {
      return apiResponse(null, error.message, 500);
    }

    return apiResponse({ success: true });
  } catch (error) {
    console.error('DELETE /api/content error:', error);
    return apiResponse(null, 'Internal server error', 500);
  }
}
