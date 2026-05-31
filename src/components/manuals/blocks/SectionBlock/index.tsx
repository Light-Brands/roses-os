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
import type { SectionContent } from '@/lib/manuals/types';

interface Props {
  content: SectionContent;
  onChange: (content: SectionContent) => void;
  readOnly: boolean;
  renderChildren?: (childIds: string[]) => ReactNode;
}

export default function SectionBlock({ content, onChange, readOnly, renderChildren }: Props) {
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
        <p className="text-xs text-stone-500 italic">{content.children.length} child block{content.children.length === 1 ? '' : 's'} (page-aware preview lands in M5).</p>
      )}
    </section>
  );
}
