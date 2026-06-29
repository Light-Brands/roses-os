/**
 * Assemble classified regions into validated v2 blocks (spec 003 T-010r, AC5;
 * decision D-11 E3, unchanged in role). This is the WRITE GATE: every assembled
 * payload runs through `validateBlockInput` (D-1) before it goes downstream. A
 * region the classifier mislabels into a shape whose required fields are absent
 * is rejected with the named-error envelope `{ok:false,error:{code:'INVALID_BLOCK',
 * message}}` and SURFACED, never silently dropped.
 *
 * map-to-blocks also resolves the folds the classifier marked: a cover folds its
 * eyebrow/subtitle/credit regions and its cover image; a contents block folds its
 * rows; a heading absorbs a preceding eyebrow. The block content JSON stays
 * exactly the 18 shapes the registry guard enforces; provenance (D-12) rides the
 * audit columns and the sidecar, never the content.
 *
 * A sanity check (plan risk 1) flags an empty or single-glyph region rather than
 * feeding garbage to the validator: the region is surfaced as INVALID with a
 * clear reason.
 */

import { validateBlockInput, type InvalidBlockErrorBody } from './block-schema';
import type { ClassifiedRegion } from './classify-regions';
import type { Rect } from './extract-geometry';

/** The stable anchor D-7 uses: (page, ordinal). Re-runs re-derive the same
 *  anchor, so a recipe override and the provenance index off one coordinate. */
export interface BlockAnchor {
  page: number;
  ordinal: number;
}

/** Provenance carried on the audit columns + sidecar (D-12), never in content. */
export interface BlockProvenance {
  source_page: number;
  run_id: string;
  signer: string;
}

export interface MappedBlock {
  /** Stable per-block id (`<page>:<ordinal>`), used to reference a block as a
   *  column child in a two-column-section. */
  id: string;
  position: number;
  block_type: string;
  content: Record<string, unknown>;
  valid: boolean;
  /** The named-error envelope when invalid (AC5); null when valid. */
  error: InvalidBlockErrorBody | null;
  anchor: BlockAnchor;
  provenance: BlockProvenance;
  decidedBy: ClassifiedRegion['decidedBy'];
  /** Bounding rect (PDF points); null when the region carried none. Used by the
   *  column detector. */
  rect: Rect | null;
  /** Multi-column band id + this block's column index + the band's column count,
   *  carried from the XY-cut layout so a later pass can wrap the band's members in
   *  column section(s). */
  colGroup?: string;
  colIndex?: number;
  colCount?: number;
  /** True when this block is a child of a two-column-section and should not
   *  render at the top level (it renders inside its column). */
  nested?: boolean;
}

/** One page's classified regions plus the figure pixel files to fill `src`. */
export interface PageInput {
  page: number;
  regions: ClassifiedRegion[];
  /** ordinal -> extracted figure file name (path a or b), for captioned-figure src. */
  figureFiles: Map<number, string>;
}

export interface MapContext {
  runId: string;
  signer: string;
}

/** Strip the internal `__`-prefixed scratch keys the classifier used for folds. */
function cleanContent(content: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(content)) {
    if (k.startsWith('__')) continue;
    out[k] = v;
  }
  return out;
}

/** Recursively collect every string the content carries, so the sanity check
 *  sees a numbered-exercise's numeral + body doc text, not just a `.text` field. */
function collectText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(collectText).join(' ');
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .filter(([k]) => !k.startsWith('__') && k !== 'schema_version' && k !== 'src' && k !== 'level')
      .map(([, v]) => collectText(v))
      .join(' ');
  }
  return '';
}

function regionText(content: Record<string, unknown>): string {
  if (typeof content.html === 'string') return content.html.replace(/<[^>]*>/g, ' ');
  return collectText(content);
}

/** Sanity check (plan risk 1): a region that is empty or a single stray glyph is
 *  not fed to the validator; it is surfaced as invalid with a clear reason. */
function sanityReason(region: ClassifiedRegion): string | null {
  if (region.block_type === 'captioned-figure' || region.block_type === 'cover' || region.block_type === 'contents') return null;
  const text = regionText(region.content).replace(/\s+/g, ' ').trim();
  if (text.length === 0) return 'empty region (no text)';
  if (text.length === 1) return `single-glyph region ("${text}")`;
  return null;
}

function invalidEnvelope(message: string): InvalidBlockErrorBody {
  return { ok: false, error: { code: 'INVALID_BLOCK', message } };
}

/**
 * Map one manual's classified pages into an ordered list of validated blocks.
 * Folds are resolved, figures get their `src`, every payload is validated, and an
 * invalid payload is surfaced with the envelope rather than dropped (AC5).
 */
export function mapToBlocks(pages: PageInput[], ctx: MapContext): MappedBlock[] {
  const blocks: MappedBlock[] = [];
  let position = 0;

  for (const page of pages) {
    // Pre-pass: collect eyebrow-for-heading attachments so the heading can absorb
    // them, and the cover image so the cover block can fold it.
    const eyebrowForHeading = new Map<number, string>();
    let coverImageFile = '';
    for (const r of page.regions) {
      const efh = (r.content as Record<string, unknown>).__eyebrowFor;
      if (typeof efh === 'number' && typeof r.content.eyebrow === 'string') {
        eyebrowForHeading.set(efh, r.content.eyebrow as string);
      }
      // The cover image is folded into the cover block; resolve its file here so
      // the cover region (which is built with a cleanContent COPY of its content)
      // can carry cover_image, rather than mutating the raw region after the copy.
      if (r.block_type === 'captioned-figure' && (r.content as Record<string, unknown>).__coverImage) {
        coverImageFile = page.figureFiles.get(r.ordinal) ?? '';
      }
    }

    for (const region of page.regions) {
      const raw = region.content as Record<string, unknown>;
      // Skip dropped regions (folio footers) and folded regions (their content
      // lives on the anchor block).
      if (raw.__drop) continue;
      if (raw.__folded) continue;
      // Skip a standalone eyebrow region; it was absorbed into its heading.
      if (typeof raw.__eyebrowFor === 'number') continue;

      const block_type = region.block_type;
      const content = cleanContent(raw);

      // Figure: fill src from the extracted pixel file. A cover image folds into
      // the cover block instead of emitting its own captioned-figure.
      if (block_type === 'captioned-figure') {
        const file = page.figureFiles.get(region.ordinal) ?? '';
        if (raw.__coverImage) {
          continue; // folded into the cover block (cover_image set below); do not emit
        }
        content.src = file;
        if (typeof content.alt !== 'string' || content.alt.length === 0) content.alt = 'figure';
        if (typeof content.schema_version !== 'number') content.schema_version = 2;
      }

      // Cover folds its hero image: set cover_image on the cover block's own
      // (copied) content so it survives into the emitted block.
      if (block_type === 'cover' && coverImageFile && typeof content.cover_image !== 'string') {
        content.cover_image = coverImageFile;
      }

      // Heading absorbs a preceding eyebrow.
      if (block_type === 'heading') {
        const eb = eyebrowForHeading.get(region.ordinal);
        if (eb && typeof content.eyebrow !== 'string') content.eyebrow = eb;
      }

      // Cover folds its cover image (set above) and is otherwise ready.
      const anchor: BlockAnchor = { page: page.page, ordinal: region.ordinal };
      const provenance: BlockProvenance = { source_page: page.page, run_id: ctx.runId, signer: ctx.signer };
      const id = `${page.page}:${region.ordinal}`;
      const rect = region.rect ?? null;
      const col = region.colGroup ? { colGroup: region.colGroup, colIndex: region.colIndex, colCount: region.colCount } : {};

      // Sanity check before the validator.
      const bad = sanityReason(region);
      if (bad) {
        blocks.push({ id, position: position++, block_type, content, valid: false, error: invalidEnvelope(`sanity check failed: ${bad}`), anchor, provenance, decidedBy: region.decidedBy, rect, ...col });
        continue;
      }

      // The hard write gate (D-1, AC5).
      const outcome = validateBlockInput({ block_type, content });
      if (outcome.ok) {
        blocks.push({ id, position: position++, block_type, content, valid: true, error: null, anchor, provenance, decidedBy: region.decidedBy, rect, ...col });
      } else {
        blocks.push({ id, position: position++, block_type, content, valid: false, error: outcome.body, anchor, provenance, decidedBy: region.decidedBy, rect, ...col });
      }
    }
  }

  return blocks;
}

/** Summary for the run log: counts of valid vs invalid and the invalid reasons. */
export interface MapSummary {
  total: number;
  valid: number;
  invalid: number;
  invalidReasons: Array<{ position: number; block_type: string; message: string }>;
}

export function summarizeBlocks(blocks: MappedBlock[]): MapSummary {
  const invalidReasons = blocks
    .filter((b) => !b.valid && b.error)
    .map((b) => ({ position: b.position, block_type: b.block_type, message: b.error!.error.message }));
  return { total: blocks.length, valid: blocks.filter((b) => b.valid).length, invalid: invalidReasons.length, invalidReasons };
}
