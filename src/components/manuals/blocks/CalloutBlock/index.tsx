'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { CalloutContent, CalloutVariant, TiptapDoc } from '@/lib/manuals/types';
import { RichTextEditor, RichTextPreview } from '@/lib/manuals/richtext/engine';
import { emptyDoc } from '@/lib/manuals/richtext/serializer';

const VARIANT_LABEL: Record<CalloutVariant, string> = {
  note: 'Note',
  warning: 'Warning',
  wisdom: 'Wisdom',
  summary: 'Summary',
};

const VARIANT_CLASSES: Record<CalloutVariant, string> = {
  note: 'bg-rose-50 border-rose-200',
  warning: 'bg-amber-50 border-amber-300',
  wisdom: 'bg-violet-50 border-violet-200',
  summary: 'bg-stone-50 border-stone-200',
};

interface CalloutBlockProps {
  content: CalloutContent;
  onChange: (content: CalloutContent) => void;
  readOnly: boolean;
}

export default function CalloutBlock({ content, onChange, readOnly }: CalloutBlockProps) {
  const body = useMemo<TiptapDoc>(() => content.body ?? emptyDoc(), [content.body]);

  return (
    <div className={cn('rounded-lg border-l-4 px-4 py-3', VARIANT_CLASSES[content.variant])}>
      <div className={cn('items-center justify-between gap-2', readOnly && content.hideLabel ? 'hidden' : 'flex')}>
        <span className="text-xs uppercase tracking-wider font-medium text-stone-700">
          {VARIANT_LABEL[content.variant]}
          {content.title ? ` — ${content.title}` : null}
        </span>
        {!readOnly && (
          <select
            value={content.variant}
            onChange={(e) => onChange({ ...content, variant: e.target.value as CalloutVariant })}
            className="text-xs bg-white border border-stone-300 rounded px-1 py-0.5"
            aria-label="Callout variant"
          >
            {(Object.keys(VARIANT_LABEL) as CalloutVariant[]).map((v) => (
              <option key={v} value={v}>{VARIANT_LABEL[v]}</option>
            ))}
          </select>
        )}
      </div>
      <div className="mt-2 text-sm leading-relaxed">
        {readOnly ? <RichTextPreview doc={body} /> : (
          <RichTextEditor
            initialDoc={body.content?.length ? body : emptyDoc()}
            onChange={(doc) => onChange({ ...content, body: doc })}
            placeholder="Callout body…"
            ariaLabel={`${VARIANT_LABEL[content.variant]} callout body`}
          />
        )}
      </div>
    </div>
  );
}
