'use client';

import type { CoverContent } from '@/lib/manuals/types';
import { typography } from '@/lib/manuals/typography';

interface Props {
  content: CoverContent;
  onChange: (content: CoverContent) => void;
  readOnly: boolean;
}

/**
 * CoverBlock — canon masthead / title page.
 *
 * Read view matches the manual canon: centered eyebrow (small-caps terracotta),
 * serif title, italic terracotta subtitle, a short centered rule, an optional
 * centered cover image, then author / illustrator credits. No card chrome — the
 * page-template owns the frame; the cover owns the typography.
 */
export default function CoverBlock({ content, onChange, readOnly }: Props) {
  if (readOnly) {
    const left = content.align === 'left';
    return (
      <div style={{ padding: '1.5rem 0 1rem', textAlign: left ? 'left' : 'center' }}>
        {content.eyebrow ? (
          <p
            style={{
              fontFamily: typography.fonts.eyebrow,
              fontSize: typography.sizes.eyebrow,
              letterSpacing: typography.tracking.eyebrow,
              color: typography.palette.terracotta,
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            {content.eyebrow}
          </p>
        ) : null}
        <h1
          style={{
            fontFamily: typography.fonts.serif,
            fontSize: typography.sizes.cover_title,
            fontWeight: typography.weights.regular,
            color: typography.palette.ink,
            lineHeight: typography.lineHeights.heading,
            margin: 0,
          }}
        >
          {content.title}
        </h1>
        {content.subtitle ? (
          <p
            style={{
              fontFamily: typography.fonts.serif,
              fontStyle: 'italic',
              fontSize: typography.sizes.h3,
              color: typography.palette.terracotta,
              marginTop: '0.5rem',
            }}
          >
            {content.subtitle}
          </p>
        ) : null}
        <div
          style={{
            width: '64px',
            height: '1px',
            background: typography.palette.terracotta,
            margin: left ? '1.25rem 0' : '1.25rem auto',
            opacity: 0.7,
          }}
        />
        {content.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={content.cover_image}
            alt=""
            style={{ maxWidth: '180px', margin: '0 auto', display: 'block' }}
          />
        ) : null}
        <div style={{ marginTop: '1rem', fontFamily: typography.fonts.sans, fontSize: '0.85rem', color: typography.palette.terracotta }}>
          {content.author ? <p style={{ margin: 0 }}>By {content.author}</p> : null}
          {content.illustrator ? <p style={{ margin: 0, fontStyle: 'italic' }}>Illustrated by {content.illustrator}</p> : null}
        </div>
        {content.credits ? (
          <div style={{ marginTop: '0.75rem', fontFamily: typography.fonts.sans, fontSize: '0.72rem', lineHeight: 1.8, color: typography.palette.terracotta, opacity: 0.85 }}>
            {content.credits.split('\n').map((line, i) => (
              <p key={i} style={{ margin: 0 }}>{line}</p>
            ))}
          </div>
        ) : null}
        {content.edition ? (
          <div style={{ marginTop: '0.75rem', fontFamily: typography.fonts.sans, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: typography.palette.terracotta, opacity: 0.8 }}>
            {content.edition}
          </div>
        ) : null}
        {content.notice ? (
          <p style={{ maxWidth: '30rem', margin: '1.5rem auto 0', fontFamily: typography.fonts.sans, fontSize: '0.65rem', fontStyle: 'italic', lineHeight: 1.6, color: typography.palette.terracotta, opacity: 0.75 }}>
            {content.notice}
          </p>
        ) : null}
      </div>
    );
  }

  // Editor mode — same vertical rhythm, with inline inputs.
  return (
    <div className="text-center py-6">
      <input
        type="text"
        value={content.eyebrow ?? ''}
        onChange={(e) => onChange({ ...content, eyebrow: e.target.value })}
        placeholder="Eyebrow (optional)"
        className="block mx-auto mb-3 text-xs uppercase tracking-[0.2em] text-rose-700 bg-transparent border-b border-stone-300 px-0 py-1 text-center focus:outline-none"
        aria-label="Cover eyebrow"
      />
      <input
        type="text"
        value={content.title}
        onChange={(e) => onChange({ ...content, title: e.target.value })}
        placeholder="Manual title"
        className="w-full text-3xl md:text-4xl font-serif text-stone-900 text-center bg-transparent border-b border-stone-300 focus:outline-none"
        aria-label="Cover title"
      />
      <input
        type="text"
        value={content.subtitle ?? ''}
        onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
        placeholder="Subtitle (optional)"
        className="block mx-auto mt-2 w-2/3 text-base italic font-serif text-rose-700 text-center bg-transparent border-b border-stone-300 px-0 py-1 focus:outline-none"
        aria-label="Cover subtitle"
      />
      {content.cover_image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={content.cover_image}
          alt=""
          className="block mx-auto mt-4 mb-1"
          style={{ maxWidth: '180px' }}
        />
      ) : null}
      <input
        type="text"
        value={content.cover_image ?? ''}
        onChange={(e) => onChange({ ...content, cover_image: e.target.value })}
        placeholder="Cover image URL (optional)"
        className="block mx-auto my-2 w-3/4 text-xs text-stone-400 bg-transparent border-b border-stone-300 px-0 py-1 text-center focus:outline-none"
        aria-label="Cover image URL"
      />
      <input
        type="text"
        value={content.author ?? ''}
        onChange={(e) => onChange({ ...content, author: e.target.value })}
        placeholder="Author (optional)"
        className="block mx-auto w-2/3 text-sm bg-transparent border-b border-stone-300 px-0 py-1 text-center focus:outline-none"
        aria-label="Cover author"
      />
      <input
        type="text"
        value={content.illustrator ?? ''}
        onChange={(e) => onChange({ ...content, illustrator: e.target.value })}
        placeholder="Illustrator (optional)"
        className="block mx-auto w-2/3 text-sm bg-transparent border-b border-stone-300 px-0 py-1 italic text-center focus:outline-none"
        aria-label="Cover illustrator"
      />
      <textarea
        value={content.credits ?? ''}
        onChange={(e) => onChange({ ...content, credits: e.target.value })}
        placeholder="Credits (one line each: illustrations, editor, design)"
        rows={2}
        className="block mx-auto mt-3 w-3/4 text-xs text-stone-500 bg-transparent border-b border-stone-300 px-0 py-1 text-center focus:outline-none resize-none"
        aria-label="Cover credits"
      />
      <input
        type="text"
        value={content.edition ?? ''}
        onChange={(e) => onChange({ ...content, edition: e.target.value })}
        placeholder="Edition (optional)"
        className="block mx-auto mt-2 w-2/3 text-xs uppercase tracking-[0.2em] text-stone-500 bg-transparent border-b border-stone-300 px-0 py-1 text-center focus:outline-none"
        aria-label="Cover edition"
      />
      <textarea
        value={content.notice ?? ''}
        onChange={(e) => onChange({ ...content, notice: e.target.value })}
        placeholder="Protection notice (optional)"
        rows={3}
        className="block mx-auto mt-3 w-3/4 text-xs italic text-stone-400 bg-transparent border-b border-stone-300 px-0 py-1 text-center focus:outline-none resize-none"
        aria-label="Cover protection notice"
      />
    </div>
  );
}
