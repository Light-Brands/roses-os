/**
 * Backward-compat parser for manual_blocks rows (T-011 + AC6).
 *
 * Loads every row of `manual_blocks` from the DB and routes it through the
 * Zod schemas. Rows that fail strict validation fall back to an `unknown`
 * shape the renderer degrades gracefully on, rather than throwing.
 *
 * This is the read path: writes go through `validateBlockInput()` in
 * `block-schema.ts` which refuses invalid payloads with the named-error
 * envelope.
 */

import { blockSchema, type BlockSchema } from './block-schema';

export interface UnknownBlock {
  kind: 'unknown';
  raw: unknown;
  reason: string;
}

export interface ParseResult {
  ok: true;
  value: BlockSchema;
}

export interface ParseFallback {
  ok: false;
  unknown: UnknownBlock;
}

export type ParseOutcome = ParseResult | ParseFallback;

/**
 * Parse a single raw row from the DB. The row shape is the JSONB content
 * column plus the block_type column at the row level. Caller passes
 * `{block_type, content}` and we validate the discriminated union.
 */
export function parseManualBlock(raw: {
  block_type: unknown;
  content: unknown;
}): ParseOutcome {
  const result = blockSchema.safeParse(raw);
  if (result.success) {
    return { ok: true, value: result.data };
  }
  return {
    ok: false,
    unknown: {
      kind: 'unknown',
      raw,
      reason: result.error.issues
        .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
        .join('; '),
    },
  };
}

export interface ParseBatchStats {
  total: number;
  passed: number;
  fallback: number;
  reasons: Record<string, number>;
}

/**
 * Parse an array of rows. Returns the parsed value (or unknown fallback) per
 * row plus a stats summary the operator surfaces in the
 * `prod-row-validation-<date>.md` doc per T-012 + AC6.
 */
export function parseManualBlocks(rows: ReadonlyArray<{ block_type: unknown; content: unknown }>):
  { results: ParseOutcome[]; stats: ParseBatchStats } {
  const results: ParseOutcome[] = [];
  const reasons: Record<string, number> = {};
  let passed = 0;
  let fallback = 0;
  for (const row of rows) {
    const outcome = parseManualBlock(row);
    results.push(outcome);
    if (outcome.ok) {
      passed += 1;
    } else {
      fallback += 1;
      const key = outcome.unknown.reason || '(unspecified)';
      reasons[key] = (reasons[key] ?? 0) + 1;
    }
  }
  return {
    results,
    stats: {
      total: rows.length,
      passed,
      fallback,
      reasons,
    },
  };
}

/**
 * Is the row a v2 block? Reads `content.schema_version`. v1 rows have no field
 * (parsed as 1). v2 rows must set 2 explicitly.
 */
export function blockSchemaVersion(row: { content: unknown }): 1 | 2 {
  if (typeof row.content === 'object' && row.content !== null) {
    const v = (row.content as Record<string, unknown>).schema_version;
    if (v === 2) return 2;
  }
  return 1;
}
