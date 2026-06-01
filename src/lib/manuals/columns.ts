/**
 * Two-column assembly for the manual reconstruction pipeline (spec 003
 * extension). The geometry decision already happened upstream: the XY-cut layout
 * (`layout.ts`) tagged every block that belongs to a side-by-side band with a
 * shared `colGroup` and a `colSide`. This pass simply wraps each tagged band in a
 * real `two-column-section` block (spec 001), referencing its members by id.
 *
 * The product renders a linear flow of blocks (spec 002 D-1), but the registry
 * carries a `two-column-section` container, so a band the geometry says is
 * side-by-side is reproduced as two columns instead of stacked. Pure and
 * deterministic; no model, no coordinate estimate.
 */

import type { Rect } from './extract-geometry';
import type { MappedBlock, BlockAnchor, BlockProvenance } from './map-to-blocks';
import { validateBlockInput } from './block-schema';

export interface ColumnResult {
  blocks: MappedBlock[];
  columnsFormed: number;
}

function unionRect(rects: Rect[]): Rect {
  return [
    Math.min(...rects.map((r) => r[0])),
    Math.min(...rects.map((r) => r[1])),
    Math.max(...rects.map((r) => r[2])),
    Math.max(...rects.map((r) => r[3])),
  ];
}

function spanWidth(blocks: MappedBlock[]): number {
  const rects = blocks.map((b) => b.rect).filter((r): r is Rect => !!r);
  if (!rects.length) return 1;
  const u = unionRect(rects);
  return Math.max(1, Math.round(u[2] - u[0]));
}

/**
 * Wrap each XY-cut two-column band (blocks sharing a `colGroup`) in a
 * `two-column-section`. Members are flagged `nested` so they do not also render
 * at the top level; the container takes the band's topmost position. A band that
 * does not actually have both sides is left as-is.
 */
export function groupTwoColumns(blocks: MappedBlock[]): ColumnResult {
  const groups = new Map<string, MappedBlock[]>();
  for (const b of blocks) {
    if (!b.colGroup || !b.valid) continue;
    const arr = groups.get(b.colGroup) ?? [];
    arr.push(b);
    groups.set(b.colGroup, arr);
  }

  const sections: MappedBlock[] = [];
  let columnsFormed = 0;

  // Deterministic order: by the band's minimum block position.
  const orderedGroups = [...groups.entries()].sort((a, b) => Math.min(...a[1].map((x) => x.position)) - Math.min(...b[1].map((x) => x.position)));

  for (const [cg, members] of orderedGroups) {
    const leftBlocks = members.filter((b) => b.colSide === 'left').sort((a, b) => a.position - b.position);
    const rightBlocks = members.filter((b) => b.colSide === 'right').sort((a, b) => a.position - b.position);
    if (!leftBlocks.length || !rightBlocks.length) continue; // a real column needs both sides

    for (const b of members) b.nested = true;

    const content = {
      schema_version: 2 as const,
      left: leftBlocks.map((b) => b.id),
      right: rightBlocks.map((b) => b.id),
      proportions: [spanWidth(leftBlocks), spanWidth(rightBlocks)] as [number, number],
    };
    const outcome = validateBlockInput({ block_type: 'two-column-section', content });
    const page = members[0].anchor.page;
    const minPos = Math.min(...members.map((b) => b.position));
    const minOrd = Math.min(...members.map((b) => b.anchor.ordinal));
    const anchor: BlockAnchor = { page, ordinal: minOrd };
    const provenance: BlockProvenance = { ...members[0].provenance };
    const rects = members.map((b) => b.rect).filter((r): r is Rect => !!r);

    sections.push({
      id: `${cg}:section`,
      position: minPos - 0.5, // sit just before its members so a position sort lands it first
      block_type: 'two-column-section',
      content,
      valid: outcome.ok,
      error: outcome.ok ? null : outcome.body,
      anchor,
      provenance,
      decidedBy: 'rule',
      rect: rects.length ? unionRect(rects) : null,
    });
    columnsFormed += 1;
  }

  const all = [...blocks, ...sections].sort((a, b) => a.position - b.position);
  return { blocks: all, columnsFormed };
}
