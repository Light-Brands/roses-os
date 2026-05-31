'use client';

import { useMemo } from 'react';
import type { FootnoteContent, TiptapDoc } from '@/lib/manuals/types';
import { RichTextEditor, RichTextPreview } from '@/lib/manuals/richtext/engine';
import { emptyDoc } from '@/lib/manuals/richtext/serializer';

interface Props {
  content: FootnoteContent;
  onChange: (content: FootnoteContent) => void;
  readOnly: boolean;
}

export default function FootnoteBlock({ content, onChange, readOnly }: Props) {
  const body = useMemo<TiptapDoc>(() => content.body ?? emptyDoc(), [content.body]);
  const keys = Object.keys(content.notes ?? {});

  return (
    <div className="my-3 text-sm">
      <div className="text-stone-800">
        {readOnly ? <RichTextPreview doc={body} /> : (
          <RichTextEditor
            initialDoc={body.content?.length ? body : emptyDoc()}
            onChange={(doc) => onChange({ ...content, body: doc })}
            placeholder="Body with inline refs like [1] [2]…"
            ariaLabel="Footnote body"
          />
        )}
      </div>
      <div className="mt-3 border-t border-stone-200 pt-2 text-xs space-y-1">
        {keys.length === 0 && !readOnly ? (
          <p className="text-stone-500 italic">No footnote definitions yet. Add one below.</p>
        ) : null}
        {keys.map((k) => (
          <p key={k} className="flex gap-2">
            <span className="font-mono text-rose-700">[{k}]</span>
            {readOnly ? <span className="text-stone-700">{content.notes[k]}</span> : (
              <input
                type="text"
                value={content.notes[k]}
                onChange={(e) => onChange({ ...content, notes: { ...content.notes, [k]: e.target.value } })}
                className="flex-1 bg-transparent border-b border-stone-200 focus:outline-none"
                aria-label={`Footnote ${k} definition`}
              />
            )}
          </p>
        ))}
        {!readOnly && (
          <button
            type="button"
            onClick={() => {
              const next = String(keys.length + 1);
              onChange({ ...content, notes: { ...content.notes, [next]: '' } });
            }}
            className="text-xs text-rose-700 underline"
          >
            + footnote
          </button>
        )}
      </div>
    </div>
  );
}
