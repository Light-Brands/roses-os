'use client';

/**
 * TwoColumnBlock (T-034).
 *
 * Two-column container. Children referenced by block ID per column.
 * Proportions optional; defaults to [1, 1].
 *
 * M4 shipped the wrapper + child render delegation. M5 adds in-column authoring:
 * each column carries its own add affordance, and BlockEditor supplies per-child
 * move/remove controls through renderChildren. Cross-container drag is a later
 * enhancement; explicit create/move/remove is the reliable path.
 */

import type { ReactNode } from 'react';
import type { BlockType, TwoColumnSectionContent } from '@/lib/manuals/types';
import AddBlockMenu from '../AddBlockMenu';

interface Props {
  content: TwoColumnSectionContent;
  onChange: (content: TwoColumnSectionContent) => void;
  readOnly: boolean;
  renderChildren?: (childIds: string[], side: 'left' | 'right') => ReactNode;
  /** Create a new block inside the given column (M5). */
  onAddChild?: (side: 'left' | 'right', type: BlockType) => void;
}

// Nested containers inside a column are out of scope for M5.
const COLUMN_EXCLUDE: BlockType[] = ['section', 'two-column-section'];

export default function TwoColumnBlock({ content, readOnly, renderChildren, onAddChild }: Props) {
  const [leftP, rightP] = content.proportions ?? [1, 1];
  const total = leftP + rightP;
  const leftPct = (leftP / total) * 100;
  const rightPct = (rightP / total) * 100;

  // Read view renders columns cleanly (no editor chrome); editor view keeps the
  // dashed cell outlines so the container is visible while authoring.
  const cellClass = readOnly ? 'min-w-0' : 'min-w-0 border border-dashed border-stone-200 rounded p-2';

  const column = (side: 'left' | 'right', ids: string[]) => {
    const isEmpty = ids.length === 0;
    // T-007 (AC8): an empty sibling cell reads as a faint dashed placeholder, not
    // a filled clay panel. This is the editor-side mitigation for the wrongly
    // wrapped lone-figure band; T-010 fixes the band detection upstream so the
    // empty cell stops being created at all. In the read view an empty cell paints
    // nothing (no clay box) rather than a hollow frame around a figure.
    if (isEmpty && readOnly) {
      return <div className="min-w-0" aria-hidden />;
    }
    return (
      <div className={cellClass}>
        {renderChildren ? renderChildren(ids, side) : (
          <p className="text-xs text-stone-500 italic">{side === 'left' ? 'Left' : 'Right'} column · {ids.length} block{ids.length === 1 ? '' : 's'}</p>
        )}
        {!readOnly && onAddChild ? (
          <div className="mt-2">
            {isEmpty ? (
              <div className="rounded border border-dashed border-stone-200/70 bg-transparent py-3 mb-2 text-center">
                <p className="text-[10px] uppercase tracking-wider text-stone-400">Empty column · add a block</p>
              </div>
            ) : null}
            <AddBlockMenu onAdd={(type) => onAddChild(side, type)} exclude={COLUMN_EXCLUDE} />
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="my-4 grid gap-4 items-start" style={{ gridTemplateColumns: `${leftPct}% ${rightPct}%` }}>
      {column('left', content.left)}
      {column('right', content.right)}
    </div>
  );
}
