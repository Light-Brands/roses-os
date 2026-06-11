/**
 * Server-side service-role write path for bulk staging inserts (T-004 + AC4,
 * AC6; decision D-6).
 *
 * `db.ts` writes only through the browser anon client, which is governed by RLS
 * scoped to interactive editing and cannot be trusted for hundreds of pipeline
 * inserts. This module is the single audited entry point for bulk reconstruction
 * writes. It:
 *
 *   - runs ONLY on the server (throws in the browser, so the service-role key can
 *     never be bundled to the client),
 *   - fails closed when SUPABASE_SERVICE_ROLE_KEY is absent (no silent fallback to
 *     the anon path),
 *   - runs every block through `validateBlockInput` BEFORE any insert, so one bad
 *     block fails the batch closed with the named-error envelope rather than a
 *     partial write (D-1 is the real write gate; the block_type CHECK cannot stand
 *     in for the Zod union).
 *
 * It is imported only by pipeline scripts and route handlers, never by a
 * `'use client'` component.
 */

import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database, Json } from '@/lib/supabase/types';
import type { BlockType, BlockContent, ManualLanguage } from './types';
import { validateBlockInput, type InvalidBlockErrorBody } from './block-schema';

/** The env var whose absence fails this module closed. */
export const SERVICE_ROLE_ENV = 'SUPABASE_SERVICE_ROLE_KEY';

function assertServerOnly(): void {
  if (typeof window !== 'undefined') {
    throw new Error(
      'db.admin is a server-only module. It holds the service-role key and must ' +
        'never run in the browser. Import it from a pipeline script or a route ' +
        'handler, not from a client component.'
    );
  }
}

let cached: SupabaseClient<Database> | null = null;

/**
 * Construct (or reuse) the service-role client. Throws when its URL or the
 * service-role key is missing. This is the fail-closed surface AC4 exercises.
 */
export function getAdminClient(): SupabaseClient<Database> {
  assertServerOnly();
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env[SERVICE_ROLE_ENV];
  if (!url) {
    throw new Error(
      'db.admin: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) is not set; refusing ' +
        'to construct an admin client.'
    );
  }
  if (!serviceKey) {
    throw new Error(
      `db.admin: ${SERVICE_ROLE_ENV} is not set; refusing to construct a ` +
        'service-role client (fail closed).'
    );
  }
  if (!cached) {
    cached = createSupabaseClient<Database>(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

/** A single block to write to the staging lane. */
export interface StagingBlockInput {
  block_type: BlockType;
  content: BlockContent;
  position: number;
  /** Signer of this reconstructed block (D-12 audit column). */
  updated_by?: string | null;
  /** Provenance (D-12, spec 003 T-012p): the 1-based canon page this block was
   *  extracted from. Null for non-reconstructed rows. */
  source_page?: number | null;
  /** Provenance (D-12): the extraction run id that produced this block. */
  run_id?: string | null;
}

export interface BulkUpsertResult {
  upserted: number;
  manualId: string;
  language: ManualLanguage;
}

/** Thrown when a block fails the Zod write gate; carries the named-error envelope. */
export class BlockValidationError extends Error {
  readonly body: InvalidBlockErrorBody;
  readonly index: number;
  constructor(index: number, body: InvalidBlockErrorBody) {
    super(`Block at index ${index} failed validation: ${body.error.message}`);
    this.name = 'BlockValidationError';
    this.body = body;
    this.index = index;
  }
}

/**
 * Validate then upsert a batch of staging blocks under one manual_id + language.
 * Upserts on the (manual_id, language, position) unique key (D-10, migration
 * 0006), so a re-run replaces a row at the same position rather than stranding a
 * duplicate. Validation runs over the WHOLE batch before any write, so a single
 * invalid block rejects the batch closed.
 */
export async function bulkUpsertBlocks(
  manualId: string,
  language: ManualLanguage,
  rows: ReadonlyArray<StagingBlockInput>
): Promise<BulkUpsertResult> {
  assertServerOnly();

  // Write gate first (AC6): one bad block fails the batch with the envelope.
  rows.forEach((r, i) => {
    const outcome = validateBlockInput({ block_type: r.block_type, content: r.content });
    if (!outcome.ok) throw new BlockValidationError(i, outcome.body);
  });

  const client = getAdminClient();
  const payload = rows.map((r) => ({
    manual_id: manualId,
    language,
    block_type: r.block_type,
    content: r.content as unknown as Json,
    position: r.position,
    updated_by: r.updated_by ?? null,
    source_page: r.source_page ?? null,
    run_id: r.run_id ?? null,
  }));

  const { data, error } = await client
    .from('manual_blocks')
    .upsert(payload, { onConflict: 'manual_id,language,position' })
    .select('id');

  if (error) {
    throw new Error(`db.admin bulkUpsertBlocks failed: ${error.message}`);
  }
  return { upserted: data?.length ?? 0, manualId, language };
}
