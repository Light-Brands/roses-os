/**
 * Deterministic page layout analysis (spec 003 extension) — the general rule
 * learned from the page-6 two-column win: the page's structure is already in the
 * geometry, so DERIVE it instead of assuming a single column and patching.
 *
 * This is a recursive XY-cut (the classic document-layout algorithm), pure and
 * deterministic, over the page's content boxes (text regions + figures). It
 * alternates horizontal cuts (a full-width whitespace band separates stacked
 * sections, read top-to-bottom) and vertical cuts (a whitespace gutter separates
 * columns, read left-to-right). Reading order AND column structure both fall out
 * of the same cut: a figure beside its text becomes a two-column node; a figure
 * above its text becomes two stacked nodes; text flowing full width stays one
 * column. No model, no estimate — the cuts are whitespace in the real rects.
 *
 * The smart-cut guard keeps a numeral from splitting off its title: a vertical
 * cut only fires when BOTH sides are real columns (≥2 boxes, or one box that
 * spans ≥2 line-heights), never on a single inline gap.
 */

import type { Rect } from './extract-geometry';

export interface LayoutBox {
  /** Stable key for this box (region ordinal or figure ordinal). */
  key: number;
  rect: Rect;
  kind: 'text' | 'figure';
}

/** A layout node: a vertical stack of rows, a horizontal split of columns, or a
 *  leaf run of boxes read top-to-bottom. */
export type LayoutNode =
  | { type: 'rows'; children: LayoutNode[] }
  | { type: 'columns'; children: LayoutNode[] }
  | { type: 'leaf'; boxes: LayoutBox[] };

/** Minimum full-width whitespace band (points) that triggers a horizontal cut. */
export const MIN_H_GAP = 6;
/** Minimum whitespace gutter (points) that can trigger a vertical (column) cut. */
export const MIN_V_GUTTER = 12;

const top = (b: LayoutBox) => b.rect[1];
const bottom = (b: LayoutBox) => b.rect[3];
const left = (b: LayoutBox) => b.rect[0];
const right = (b: LayoutBox) => b.rect[2];
const height = (b: LayoutBox) => b.rect[3] - b.rect[1];

/** The widest horizontal whitespace band that no box crosses, as a y threshold to
 *  split on (boxes with top >= threshold go below). Returns null when none clears
 *  MIN_H_GAP. Greedy: picks the largest gap so the strongest structure cuts first. */
function findHCut(boxes: LayoutBox[]): number | null {
  const sorted = [...boxes].sort((a, b) => top(a) - top(b) || left(a) - left(b));
  let maxBottom = bottom(sorted[0]);
  let bestGap = 0;
  let bestThreshold: number | null = null;
  for (let i = 1; i < sorted.length; i++) {
    const gap = top(sorted[i]) - maxBottom;
    if (gap > MIN_H_GAP && gap > bestGap) {
      bestGap = gap;
      bestThreshold = top(sorted[i]);
    }
    if (bottom(sorted[i]) > maxBottom) maxBottom = bottom(sorted[i]);
  }
  return bestThreshold;
}

/** A side of a vertical cut is a real column only when it carries ≥2 boxes OR a
 *  single box tall enough to be a column (a figure, a stacked paragraph), never a
 *  lone inline fragment (a numeral). `lineH` is the page's median line height. */
function isRealColumn(side: LayoutBox[], lineH: number): boolean {
  if (side.length >= 2) return true;
  return height(side[0]) >= 1.8 * lineH;
}

/** The widest vertical whitespace gutter that cleanly separates two real columns,
 *  as an x threshold (boxes with left >= threshold go right). Null when none. */
function findVCut(boxes: LayoutBox[], lineH: number): number | null {
  // Candidate gutters live between the right edge of one box and the left edge of
  // the next, scanning left to right on a running max-right (interval merge).
  const sorted = [...boxes].sort((a, b) => left(a) - left(b) || top(a) - top(b));
  let maxRight = right(sorted[0]);
  let bestGap = 0;
  let bestThreshold: number | null = null;
  for (let i = 1; i < sorted.length; i++) {
    const gap = left(sorted[i]) - maxRight;
    if (gap > MIN_V_GUTTER && gap > bestGap) {
      const threshold = left(sorted[i]);
      const leftSide = boxes.filter((b) => right(b) <= threshold);
      const rightSide = boxes.filter((b) => left(b) >= threshold);
      // A valid cut partitions every box and both sides are real columns.
      if (leftSide.length + rightSide.length === boxes.length && isRealColumn(leftSide, lineH) && isRealColumn(rightSide, lineH)) {
        bestGap = gap;
        bestThreshold = threshold;
      }
    }
    if (right(sorted[i]) > maxRight) maxRight = right(sorted[i]);
  }
  return bestThreshold;
}

/** Recursive XY-cut. Horizontal cuts first (stacked sections), then vertical cuts
 *  (columns); a node with neither is a leaf read top-to-bottom then left. */
export function xyCut(boxes: LayoutBox[], lineH: number): LayoutNode {
  if (boxes.length <= 1) return { type: 'leaf', boxes: [...boxes] };

  const hThreshold = findHCut(boxes);
  if (hThreshold !== null) {
    const above = boxes.filter((b) => top(b) < hThreshold);
    const below = boxes.filter((b) => top(b) >= hThreshold);
    if (above.length && below.length) {
      return { type: 'rows', children: [xyCut(above, lineH), xyCut(below, lineH)] };
    }
  }

  const vThreshold = findVCut(boxes, lineH);
  if (vThreshold !== null) {
    const leftSide = boxes.filter((b) => right(b) <= vThreshold);
    const rightSide = boxes.filter((b) => left(b) >= vThreshold);
    if (leftSide.length && rightSide.length) {
      return { type: 'columns', children: [xyCut(leftSide, lineH), xyCut(rightSide, lineH)] };
    }
  }

  // No clean cut: an overlapping cluster. Read top-to-bottom, then left.
  return { type: 'leaf', boxes: [...boxes].sort((a, b) => top(a) - top(b) || left(a) - left(b)) };
}

/** A flattened placement slot: either a single-column run of box keys in reading
 *  order, or a two-column split carrying the left and right runs. */
export type LayoutSlot =
  | { kind: 'flow'; keys: number[] }
  | { kind: 'two-col'; left: number[]; right: number[] };

/** Flatten a layout node into ordered slots. A `columns` node with exactly two
 *  children becomes a two-col slot; deeper nesting flattens each side to its
 *  reading-order keys. Rows and leaves flow into the current run. */
export function flattenLayout(node: LayoutNode): LayoutSlot[] {
  const slots: LayoutSlot[] = [];
  let run: number[] = [];
  const flushRun = () => {
    if (run.length) {
      slots.push({ kind: 'flow', keys: run });
      run = [];
    }
  };
  const visit = (n: LayoutNode) => {
    if (n.type === 'leaf') {
      run.push(...n.boxes.map((b) => b.key));
    } else if (n.type === 'rows') {
      n.children.forEach(visit);
    } else {
      // columns: emit the run so far, then a two-col slot.
      flushRun();
      const sideKeys = (child: LayoutNode): number[] => leafKeys(child);
      if (n.children.length === 2) {
        slots.push({ kind: 'two-col', left: sideKeys(n.children[0]), right: sideKeys(n.children[1]) });
      } else {
        // >2 columns: pair sequentially, leftover flows.
        for (const c of n.children) run.push(...leafKeys(c));
        flushRun();
      }
    }
  };
  visit(node);
  flushRun();
  return slots;
}

/** All box keys under a node in reading order (rows top-to-bottom, columns
 *  left-to-right, leaf as ordered). */
export function leafKeys(node: LayoutNode): number[] {
  if (node.type === 'leaf') return node.boxes.map((b) => b.key);
  if (node.type === 'rows') return node.children.flatMap(leafKeys);
  return node.children.flatMap(leafKeys);
}

/** Convenience: run XY-cut over a page's boxes and return ordered slots. */
export function analyzePageLayout(boxes: LayoutBox[], lineH: number): LayoutSlot[] {
  if (boxes.length === 0) return [];
  return flattenLayout(xyCut(boxes, lineH));
}

/**
 * Assign every box to its XY-cut LEAF: a contiguous single-column run with no
 * figure or column break inside it. The flattened slots collapse rows into one
 * flow for reading order, which is right for ordering but too coarse to bound a
 * numbered exercise (the exercise must not jump across a figure that sits in its
 * own leaf). The leaf id is the per-box bound for grouping.
 */
export function assignLeaves(node: LayoutNode): Map<number, number> {
  const out = new Map<number, number>();
  let leafId = 0;
  const walk = (n: LayoutNode): void => {
    if (n.type === 'leaf') {
      const id = leafId++;
      for (const b of n.boxes) out.set(b.key, id);
    } else {
      n.children.forEach(walk);
    }
  };
  walk(node);
  return out;
}
