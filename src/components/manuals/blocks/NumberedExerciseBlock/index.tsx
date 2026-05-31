'use client';

import { useMemo } from 'react';
import type { NumberedExerciseContent, TiptapDoc } from '@/lib/manuals/types';
import { RichTextEditor, RichTextPreview } from '@/lib/manuals/richtext/engine';
import { emptyDoc } from '@/lib/manuals/richtext/serializer';

interface Props {
  content: NumberedExerciseContent;
  onChange: (content: NumberedExerciseContent) => void;
  readOnly: boolean;
}

export default function NumberedExerciseBlock({ content, onChange, readOnly }: Props) {
  const body = useMemo<TiptapDoc>(() => content.body ?? emptyDoc(), [content.body]);

  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-4 my-3 items-start">
      <div className="text-5xl font-serif text-rose-700 leading-none" aria-hidden="true">
        {readOnly ? content.numeral : (
          <input
            type="text"
            value={content.numeral}
            onChange={(e) => onChange({ ...content, numeral: e.target.value })}
            className="w-12 bg-transparent border-0 border-b border-stone-300 text-5xl font-serif text-rose-700 leading-none focus:outline-none"
            aria-label="Exercise numeral"
          />
        )}
      </div>
      <div className="space-y-1">
        {!readOnly && (
          <input
            type="text"
            value={content.title ?? ''}
            onChange={(e) => onChange({ ...content, title: e.target.value })}
            placeholder="Exercise title (optional)"
            className="w-full bg-transparent border-0 border-b border-stone-300 px-0 py-1 text-sm font-semibold focus:outline-none"
            aria-label="Exercise title"
          />
        )}
        {readOnly && content.title ? (
          <h4 className="text-sm font-semibold text-stone-800">{content.title}</h4>
        ) : null}
        <div className="text-sm leading-relaxed">
          {readOnly ? <RichTextPreview doc={body} /> : (
            <RichTextEditor
              initialDoc={body.content?.length ? body : emptyDoc()}
              onChange={(doc) => onChange({ ...content, body: doc })}
              placeholder="Exercise body…"
              ariaLabel="Exercise body"
            />
          )}
        </div>
      </div>
    </div>
  );
}
