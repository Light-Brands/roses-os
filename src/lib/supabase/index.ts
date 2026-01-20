// Client-side exports
export { createClient, getClient } from './client';

// Server-side exports
export {
  createServerSupabaseClient,
  getServerUser,
  requireAuth,
} from './server';

// Auth exports
export { AuthProvider, useAuth, useRequireAuth } from './auth';

// Types
export type {
  Database,
  Tables,
  InsertTables,
  UpdateTables,
  Profile,
  Content,
  Media,
  Setting,
  AnalyticsEvent,
} from './types';
