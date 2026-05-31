'use client';

import type { CaptionedFigureContent } from '@/lib/manuals/types';

interface Props {
  content: CaptionedFigureContent;
  onChange: (content: CaptionedFigureContent) => void;
  readOnly: boolean;
}

export default function CaptionedFigureBlock({ content, onChange, readOnly }: Props) {
  return (
    <figure className="my-4">
      {content.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={content.src}
          alt={content.alt}
          className="w-full rounded-lg"
        />
      ) : (
        <div className="aspect-[4/3] w-full bg-stone-100 rounded-lg flex items-center justify-center text-stone-400 text-sm">
          Image placeholder
        </div>
      )}
      {!readOnly && (
        <div className="mt-2 space-y-1">
          <input
            type="text"
            value={content.src}
            onChange={(e) => onChange({ ...content, src: e.target.value })}
            placeholder="Image URL"
            className="w-full text-xs bg-transparent border-b border-stone-300 px-0 py-1 focus:outline-none"
            aria-label="Image source URL"
          />
          <input
            type="text"
            value={content.alt}
            onChange={(e) => onChange({ ...content, alt: e.target.value })}
            placeholder="Alt text (for accessibility)"
            className="w-full text-xs bg-transparent border-b border-stone-300 px-0 py-1 focus:outline-none"
            aria-label="Image alt text"
          />
          <input
            type="text"
            value={content.caption ?? ''}
            onChange={(e) => onChange({ ...content, caption: e.target.value })}
            placeholder="Caption (optional)"
            className="w-full text-xs italic bg-transparent border-b border-stone-300 px-0 py-1 focus:outline-none"
            aria-label="Image caption"
          />
          <input
            type="text"
            value={content.credit ?? ''}
            onChange={(e) => onChange({ ...content, credit: e.target.value })}
            placeholder="Credit (optional)"
            className="w-full text-xs italic bg-transparent border-b border-stone-300 px-0 py-1 focus:outline-none"
            aria-label="Image credit"
          />
        </div>
      )}
      {readOnly && (content.caption || content.credit) ? (
        <figcaption className="mt-2 text-xs italic text-rose-700 text-center">
          {content.caption}
          {content.credit ? <span className="block text-stone-500 not-italic">{content.credit}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
