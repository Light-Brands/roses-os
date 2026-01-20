import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

/**
 * Supabase Browser Client
 * Use this for client-side operations (React components)
 *
 * Environment variables required:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Singleton instance for simple use cases
let browserClient: ReturnType<typeof createClient> | null = null;

export function getClient() {
  if (typeof window === 'undefined') {
    throw new Error('getClient() should only be called in browser environment');
  }

  if (!browserClient) {
    browserClient = createClient();
  }

  return browserClient;
}
