/**
 * Reconstruction provenance sidecar (spec 003 T-012p, AC8; decision D-12).
 *
 * Provenance (source canon page, extraction run id, signer) is required on every
 * reconstructed block, but the 18 content schemas are a closed discriminated
 * union and adding a provenance field to each would dilute the read-path
 * contract. Provenance is instead carried in:
 *   - a per-run sidecar `reconstruct/<manual>.<lang>.provenance.json`, keyed by
 *     the same stable (page, ordinal) anchor the recipe (D-7) uses, and
 *   - the staging row audit columns `updated_by` (signer), `source_page`, and
 *     `run_id` (added to migration 0006 by this spec).
 *
 * The block content JSON stays exactly the 18 shapes the registry guard and
 * `validateBlockInput` enforce; this module never touches content.
 */

import type { MappedBlock } from './map-to-blocks';
import type { StagingBlockInput } from './db.admin';
import type { BlockType, BlockContent } from './types';

/** One sidecar entry: how a single reconstructed block was made. */
export interface ProvenanceEntry {
  /** Stable anchor `<page>:<ordinal>`. */
  anchor: string;
  page: number;
  ordinal: number;
  position: number;
  block_type: string;
  run_id: string;
  signer: string;
  /** Whether the block passed the D-1 write gate; an invalid block is recorded
   *  with the reason so the operator can see what was rejected, not just dropped. */
  valid: boolean;
  invalid_reason?: string;
  /** How the block_type was decided (rule / model / cache / undecided). */
  decided_by: MappedBlock['decidedBy'];
}

export interface ProvenanceSidecar {
  manual: string;
  language: string;
  run_id: string;
  /** Number of blocks recorded. */
  count: number;
  entries: ProvenanceEntry[];
}

/** The sidecar file name for a manual + language, under the reconstruct dir. */
export function sidecarFileName(manualSlug: string, language: string): string {
  return `${manualSlug}.${language}.provenance.json`;
}

/** Build the sidecar object from the mapped blocks. Keyed by the stable anchor;
 *  records invalid blocks too (with the reason) so nothing is silently lost. */
export function buildProvenanceSidecar(
  blocks: MappedBlock[],
  manualSlug: string,
  language: string,
  runId: string,
): ProvenanceSidecar {
  const entries: ProvenanceEntry[] = blocks.map((b) => ({
    anchor: `${b.anchor.page}:${b.anchor.ordinal}`,
    page: b.anchor.page,
    ordinal: b.anchor.ordinal,
    position: b.position,
    block_type: b.block_type,
    run_id: b.provenance.run_id,
    signer: b.provenance.signer,
    valid: b.valid,
    ...(b.valid ? {} : { invalid_reason: b.error?.error.message ?? 'unknown' }),
    decided_by: b.decidedBy,
  }));
  return { manual: manualSlug, language, run_id: runId, count: entries.length, entries };
}

/**
 * Convert the VALID mapped blocks into staging-writer inputs, carrying the
 * provenance audit columns (source_page, run_id, signer). Invalid blocks are
 * excluded from the write set (they failed the D-1 gate) but remain in the
 * sidecar with their reason. The content is passed through unchanged.
 */
export function toStagingInputs(blocks: MappedBlock[]): StagingBlockInput[] {
  return blocks
    .filter((b) => b.valid)
    .map((b) => ({
      block_type: b.block_type as BlockType,
      content: b.content as unknown as BlockContent,
      position: b.position,
      updated_by: b.provenance.signer,
      source_page: b.provenance.source_page,
      run_id: b.provenance.run_id,
    }));
}
