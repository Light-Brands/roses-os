'use client';

import { useMemo } from 'react';
import type { QuoteContent, TiptapDoc } from '@/lib/manuals/types';
import { RichTextEditor, RichTextPreview } from '@/lib/manuals/richtext/engine';
import { emptyDoc } from '@/lib/manuals/richtext/serializer';

interface QuoteBlockProps {
  content: QuoteContent;
  onChange: (content: QuoteContent) => void;
  readOnly: boolean;
}

export default function QuoteBlock({ content, onChange, readOnly }: QuoteBlockProps) {
  const body = useMemo<TiptapDoc>(() => content.body ?? emptyDoc(), [content.body]);

  return (
    <figure className="border-l-4 border-rose-300 bg-rose-50/40 pl-4 py-2 my-2 italic">
      <blockquote className="text-base leading-relaxed text-stone-800">
        {readOnly ? <RichTextPreview doc={body} /> : (
          <RichTextEditor
            initialDoc={body.content?.length ? body : emptyDoc()}
            onChange={(doc) => onChange({ ...content, body: doc })}
            placeholder="Quote…"
            ariaLabel="Quote body"
          />
        )}
      </blockquote>
      {readOnly && content.attribution ? (
        <figcaption className="mt-2 text-xs not-italic text-stone-600">— {content.attribution}</figcaption>
      ) : (
        !readOnly && (
          <input
            type="text"
            value={content.attribution ?? ''}
            onChange={(e) => onChange({ ...content, attribution: e.target.value })}
            placeholder="Attribution (optional)"
            className="mt-2 text-xs bg-transparent border-0 border-b border-stone-300 px-0 italic w-full focus:outline-none"
            aria-label="Quote attribution"
          />
        )
      )}
    </figure>
  );
}
