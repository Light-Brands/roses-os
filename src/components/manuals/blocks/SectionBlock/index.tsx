'use client';

/**
 * SectionBlock (T-033).
 *
 * Logical section grouping that enables page-aware preview boundaries.
 * Children are referenced by block ID; the renderer resolves them through
 * the BlockEditor's id→block lookup.
 *
 * M4 ships the wrapper shape + child render delegation. The drop-into-container
 * UX (T-036) and page-aware preview boundaries (T-037) build on top of this.
 */

import type { ReactNode } from 'react';
import type { BlockType, SectionContent } from '@/lib/manuals/types';
import AddBlockMenu from '../AddBlockMenu';

interface Props {
  content: SectionContent;
  onChange: (content: SectionContent) => void;
  readOnly: boolean;
  renderChildren?: (childIds: string[]) => ReactNode;
  /** Create a new block inside this section (M5). */
  onAddChild?: (type: BlockType) => void;
}

// Nested containers inside a section are out of scope for M5.
const SECTION_EXCLUDE: BlockType[] = ['section', 'two-column-section'];

export default function SectionBlock({ content, onChange, readOnly, renderChildren, onAddChild }: Props) {
  return (
    <section
      className="my-4 border-l-2 border-rose-200 pl-3"
      style={{
        breakInside: 'avoid-page',
        breakBefore: 'auto',
      }}
    >
      {readOnly ? (
        content.title ? <h3 className="text-base font-semibold mb-2 text-rose-700">{content.title}</h3> : null
      ) : (
        <input
          type="text"
          value={content.title ?? ''}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          placeholder="Section title (optional)"
          className="block mb-2 text-base font-semibold text-rose-700 bg-transparent border-b border-stone-300 w-full focus:outline-none"
          aria-label="Section title"
        />
      )}
      {renderChildren ? renderChildren(content.children) : (
        <p className="text-xs text-stone-500 italic">{content.children.length} child block{content.children.length === 1 ? '' : 's'}.</p>
      )}
      {!readOnly && onAddChild ? (
        <div className="mt-2">
          {content.children.length === 0 ? (
            <p className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">Empty · add a block</p>
          ) : null}
          <AddBlockMenu onAdd={(type) => onAddChild(type)} exclude={SECTION_EXCLUDE} />
        </div>
      ) : null}
    </section>
  );
}
