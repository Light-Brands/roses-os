'use client';

import { useMemo } from 'react';
import type { SpokenInstructionContent, TiptapDoc } from '@/lib/manuals/types';
import { RichTextEditor, RichTextPreview } from '@/lib/manuals/richtext/engine';
import { emptyDoc } from '@/lib/manuals/richtext/serializer';

interface Props {
  content: SpokenInstructionContent;
  onChange: (content: SpokenInstructionContent) => void;
  readOnly: boolean;
}

const ROSE_ICON = (
  <svg viewBox="0 0 24 24" className="w-5 h-5 text-rose-600 inline-block mr-2 align-middle" aria-hidden="true">
    <path
      d="M12 3c4.5 0 7 3 7 6.5S15 17 12 17s-7-4-7-7.5S7.5 3 12 3z M12 17v4 M9 21h6"
      fill="currentColor"
      opacity="0.85"
    />
  </svg>
);

export default function SpokenInstructionBlock({ content, onChange, readOnly }: Props) {
  const prose = useMemo<TiptapDoc>(() => content.prose ?? emptyDoc(), [content.prose]);

  return (
    <div className="my-4 border-l-4 border-rose-400 bg-rose-50/50 pl-4 py-3">
      <p className="text-base font-semibold text-rose-900">
        {ROSE_ICON}
        {readOnly ? (
          <>“{content.spoken}”</>
        ) : (
          <input
            type="text"
            value={content.spoken}
            onChange={(e) => onChange({ ...content, spoken: e.target.value })}
            placeholder="Speak this aloud…"
            className="bg-transparent border-0 border-b border-rose-300 px-0 py-0 text-base font-semibold text-rose-900 w-[90%] focus:outline-none"
            aria-label="Spoken instruction"
          />
        )}
      </p>
      <div className="mt-2 text-sm text-stone-700">
        {readOnly ? <RichTextPreview doc={prose} /> : (
          <RichTextEditor
            initialDoc={prose.content?.length ? prose : emptyDoc()}
            onChange={(doc) => onChange({ ...content, prose: doc })}
            placeholder="Follow-on prose (optional)…"
            ariaLabel="Spoken instruction prose"
          />
        )}
      </div>
    </div>
  );
}
