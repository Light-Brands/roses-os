/**
 * Staging lane resolution (T-005 + AC5, decision D-5).
 *
 * Staging is a structurally isolated lane: a sibling `manuals` row carrying its
 * own id, identified by the slug convention `<prod-slug>__staging`. Reconstructed
 * blocks are written under the staging manual_id, so a read that targets the prod
 * id never sees them. This module owns the slug convention and the prod->staging
 * id resolution; the actual writes go through `db.admin` (D-6), never the browser
 * client.
 *
 * The convention is pure-string so it can be reasoned about without a database
 * round-trip; the id resolver is the only async surface.
 */

import type { ManualLanguage } from './types';

/** The slug suffix that marks a manuals row as a staging clone. */
export const STAGING_SLUG_SUFFIX = '__staging';

/** The staging slug for a production slug. Idempotent: a staging slug maps to itself. */
export function stagingSlugFor(prodSlug: string): string {
  return isStagingSlug(prodSlug) ? prodSlug : `${prodSlug}${STAGING_SLUG_SUFFIX}`;
}

/** True if a slug names a staging clone. */
export function isStagingSlug(slug: string): boolean {
  return slug.endsWith(STAGING_SLUG_SUFFIX);
}

/** The production slug behind a staging slug. Idempotent on a prod slug. */
export function prodSlugFor(slug: string): string {
  return isStagingSlug(slug) ? slug.slice(0, -STAGING_SLUG_SUFFIX.length) : slug;
}

/**
 * Minimal manuals-table reader the resolver needs. The caller supplies it so this
 * module does not pick a client (the admin client for pipeline scripts, the anon
 * client for read-only tooling). The shape matches both Supabase query builders.
 */
export interface ManualsLookup {
  manualSlugById(manualId: string): Promise<string | null>;
  manualIdBySlug(slug: string): Promise<string | null>;
}

/**
 * Resolve the staging manual_id for a production manual_id. Returns null when the
 * production manual is unknown or its staging clone has not been created yet (run
 * migration 0007). Never returns the prod id: a missing clone is a hard null, not
 * a silent fall-through to prod, so a caller can never write a "staging" block
 * onto the production lane by accident.
 */
export async function resolveStagingManualId(
  lookup: ManualsLookup,
  prodManualId: string
): Promise<string | null> {
  const prodSlug = await lookup.manualSlugById(prodManualId);
  if (prodSlug === null) return null;
  if (isStagingSlug(prodSlug)) return prodManualId; // already a staging id
  const stagingSlug = stagingSlugFor(prodSlug);
  return lookup.manualIdBySlug(stagingSlug);
}

/**
 * Guard for the locale half of the lane. The hard no-canon-locale guard (T-013,
 * AC19) lives in the pipeline entry; this is the narrow companion that a staging
 * write can call to refuse a language with no translated canon. English is the
 * only locale with canon today.
 */
export const CANON_LOCALES: ReadonlyArray<ManualLanguage> = ['en'];

export function localeHasCanon(language: ManualLanguage): boolean {
  return CANON_LOCALES.includes(language);
}
