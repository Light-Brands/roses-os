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
 * Wrap each XY-cut column band (blocks sharing a `colGroup`) in column section(s).
 * Two columns become one `two-column-section`; three or more become NESTED
 * two-column-sections (left = first column, right = a section holding the rest),
 * so an N-up block renders side-by-side while staying inside the frozen 18-type
 * schema (D-1). Members are flagged `nested` so they do not also render at the top
 * level; the outer container takes the band's topmost position. A band that does
 * not actually have ≥2 non-empty columns is left as-is.
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
    const colCount = members[0].colCount ?? 2;
    const cols: MappedBlock[][] = Array.from({ length: colCount }, () => []);
    for (const m of members) {
      const idx = m.colIndex ?? 0;
      if (idx >= 0 && idx < colCount) cols[idx].push(m);
    }
    for (const c of cols) c.sort((a, b) => a.position - b.position);
    const nonEmpty = cols.filter((c) => c.length > 0);
    if (nonEmpty.length < 2) continue; // a real band needs ≥2 non-empty columns

    for (const m of members) m.nested = true;

    const page = members[0].anchor.page;
    const minPos = Math.min(...members.map((b) => b.position));
    const minOrd = Math.min(...members.map((b) => b.anchor.ordinal));
    const provenance: BlockProvenance = { ...members[0].provenance };
    const anchor: BlockAnchor = { page, ordinal: minOrd };

    // Build nested two-column-sections from the non-empty columns. For exactly two
    // columns this is a single section; for three+, the right side is itself a
    // section over the remaining columns (recursively). The outermost section
    // (depth 0) renders at the top level; inner sections are flagged nested and
    // referenced by id. Proportions track real column widths, so three equal
    // columns render ~1/3 each.
    const build = (cs: MappedBlock[][], depth: number): { id: string; rect: Rect | null } => {
      const allRects = cs.flat().map((b) => b.rect).filter((r): r is Rect => !!r);
      const rect = allRects.length ? unionRect(allRects) : null;
      const leftCol = cs[0];
      const rest = cs.slice(1);
      let right: string[];
      let rightWidth: number;
      if (rest.length === 1) {
        right = rest[0].map((b) => b.id);
        rightWidth = spanWidth(rest[0]);
      } else {
        const inner = build(rest, depth + 1);
        right = [inner.id];
        rightWidth = inner.rect ? Math.max(1, Math.round(inner.rect[2] - inner.rect[0])) : 1;
      }
      const content = {
        schema_version: 2 as const,
        left: leftCol.map((b) => b.id),
        right,
        proportions: [spanWidth(leftCol), rightWidth] as [number, number],
      };
      const outcome = validateBlockInput({ block_type: 'two-column-section', content });
      const id = depth === 0 ? `${cg}:section` : `${cg}:section${depth}`;
      sections.push({
        id,
        position: minPos - 0.5 + depth * 1e-3, // outer (depth 0) sorts first; inners are nested anyway
        block_type: 'two-column-section',
        content,
        valid: outcome.ok,
        error: outcome.ok ? null : outcome.body,
        anchor,
        provenance,
        decidedBy: 'rule',
        rect,
        nested: depth > 0 ? true : undefined, // inner sections are nested; the outer renders at top level
      });
      return { id, rect };
    };
    build(nonEmpty, 0);
    columnsFormed += 1;
  }

  const all = [...blocks, ...sections].sort((a, b) => a.position - b.position);
  return { blocks: all, columnsFormed };
}
