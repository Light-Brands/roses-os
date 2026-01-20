import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

/**
 * Supabase Server Client
 * Use this for server-side operations (Server Components, API Routes, Server Actions)
 *
 * This client properly handles cookies for authentication
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Cookie setting failed (likely in Server Component)
            // This is expected behavior in some cases
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Cookie removal failed (likely in Server Component)
          }
        },
      },
    }
  );
}

/**
 * Get authenticated user from server context
 * Returns null if not authenticated
 */
export async function getServerUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Require authentication - throws redirect if not authenticated
 * Use in pages that require auth
 */
export async function requireAuth() {
  const user = await getServerUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}
