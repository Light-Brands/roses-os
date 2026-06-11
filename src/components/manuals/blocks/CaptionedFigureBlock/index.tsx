'use client';

import type { CaptionedFigureContent } from '@/lib/manuals/types';

interface Props {
  content: CaptionedFigureContent;
  onChange: (content: CaptionedFigureContent) => void;
  readOnly: boolean;
  /** When nested inside a column cell, the figure fills its cell (100%) rather
   *  than its page-relative width_pct — the cell already carries the proportion
   *  (matches the reconstruction preview, ARCHITECTURE D-13). */
  fill?: boolean;
}

export default function CaptionedFigureBlock({ content, onChange, readOnly, fill }: Props) {
  // The reconstruction carries the figure's real page-relative width as
  // `width_pct` (figure width / page width). Honor it at top level so a small
  // ornament renders small instead of full-bleed; fill the cell when nested.
  const rawPct = (content as { width_pct?: number }).width_pct;
  const widthPct = fill
    ? 100
    : typeof rawPct === 'number'
      ? Math.min(100, Math.max(3, rawPct))
      : 100;
  return (
    <figure className="my-4">
      {content.src ? (
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.src}
            alt={content.alt}
            className="rounded-lg"
            style={{ width: `${widthPct}%`, maxWidth: '100%' }}
          />
        </div>
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
        </div>
      )}
    </figure>
  );
}
