'use client';

/**
 * TwoColumnBlock (T-034).
 *
 * Two-column container. Children referenced by block ID per column.
 * Proportions optional; defaults to [1, 1].
 *
 * M4 ships the wrapper + delegation shape. The drop-into-container UX (T-036)
 * accepts new blocks into left/right columns via dnd-kit.
 */

import type { ReactNode } from 'react';
import type { TwoColumnSectionContent } from '@/lib/manuals/types';

interface Props {
  content: TwoColumnSectionContent;
  onChange: (content: TwoColumnSectionContent) => void;
  readOnly: boolean;
  renderChildren?: (childIds: string[], side: 'left' | 'right') => ReactNode;
}

export default function TwoColumnBlock({ content, readOnly, renderChildren }: Props) {
  const [leftP, rightP] = content.proportions ?? [1, 1];
  const total = leftP + rightP;
  const leftPct = (leftP / total) * 100;
  const rightPct = (rightP / total) * 100;

  return (
    <div className="my-4 grid gap-4" style={{ gridTemplateColumns: `${leftPct}% ${rightPct}%` }}>
      <div className="border border-dashed border-stone-200 rounded p-2">
        {renderChildren ? renderChildren(content.left, 'left') : (
          <p className="text-xs text-stone-500 italic">Left column · {content.left.length} block{content.left.length === 1 ? '' : 's'}</p>
        )}
      </div>
      <div className="border border-dashed border-stone-200 rounded p-2">
        {renderChildren ? renderChildren(content.right, 'right') : (
          <p className="text-xs text-stone-500 italic">Right column · {content.right.length} block{content.right.length === 1 ? '' : 's'}</p>
        )}
      </div>
      {!readOnly ? (
        <p className="col-span-2 text-[10px] uppercase tracking-wider text-stone-400">Two-column container · drop-into-container UX lands in M4 polish</p>
      ) : null}
    </div>
  );
}
