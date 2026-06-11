'use client';

/**
 * TableOfContentsBlock — canon "Contents" list primitive.
 *
 * Renders the table-of-contents page pattern seen across the Rose Meditation /
 * Aura manuals: an optional eyebrow, then hairline rows of
 *   [numeral · title ········· page]
 * Numerals and page numbers in terracotta serif; titles in ink serif; a thin
 * rose hairline under each row. No grid, no borders, no header row — distinct
 * from the generic `table` block.
 */

import type { ContentsContent, ContentsRow } from '@/lib/manuals/types';
import { typography } from '@/lib/manuals/typography';

interface Props {
  content: ContentsContent;
  onChange: (content: ContentsContent) => void;
  readOnly: boolean;
}

export default function TableOfContentsBlock({ content, onChange, readOnly }: Props) {
  const rows = content.rows ?? [];

  const updateRow = (i: number, patch: Partial<ContentsRow>) =>
    onChange({ ...content, rows: rows.map((r, ri) => (ri === i ? { ...r, ...patch } : r)) });
  const addRow = () => onChange({ ...content, rows: [...rows, { title: '' }] });
  const removeRow = (i: number) => onChange({ ...content, rows: rows.filter((_, ri) => ri !== i) });

  if (readOnly) {
    return (
      <div className="my-6">
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
        <div>
          {rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '2.5rem 1fr auto',
                alignItems: 'baseline',
                columnGap: '1rem',
                padding: '0.6rem 0',
                borderBottom: `1px solid ${typography.palette.rose_hairline}`,
              }}
            >
              <span
                style={{
                  fontFamily: typography.fonts.serif,
                  fontSize: '1.25rem',
                  color: typography.palette.terracotta,
                  lineHeight: 1,
                }}
              >
                {row.numeral ?? ''}
              </span>
              <span
                style={{
                  fontFamily: typography.fonts.serif,
                  fontSize: '1.05rem',
                  color: typography.palette.ink,
                }}
              >
                {row.title}
              </span>
              <span
                style={{
                  fontFamily: typography.fonts.serif,
                  fontSize: '1rem',
                  color: typography.palette.terracotta,
                }}
              >
                {row.page ?? ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Editor mode
  return (
    <div className="my-6 space-y-2">
      <input
        type="text"
        value={content.eyebrow ?? ''}
        onChange={(e) => onChange({ ...content, eyebrow: e.target.value })}
        placeholder="Eyebrow (e.g., CONTENTS)"
        className="text-xs uppercase tracking-[0.18em] text-rose-700 bg-transparent border-b border-stone-300 px-0 py-1 focus:outline-none"
        aria-label="Contents eyebrow"
      />
      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-[3rem_1fr_3rem_auto] items-center gap-2">
          <input
            type="text"
            value={row.numeral ?? ''}
            onChange={(e) => updateRow(i, { numeral: e.target.value })}
            placeholder="#"
            className="bg-transparent border-b border-stone-300 px-0 py-1 text-sm text-rose-700 font-serif focus:outline-none"
            aria-label={`Row ${i + 1} numeral`}
          />
          <input
            type="text"
            value={row.title}
            onChange={(e) => updateRow(i, { title: e.target.value })}
            placeholder="Section title"
            className="bg-transparent border-b border-stone-300 px-0 py-1 text-sm focus:outline-none"
            aria-label={`Row ${i + 1} title`}
          />
          <input
            type="text"
            value={row.page ?? ''}
            onChange={(e) => updateRow(i, { page: e.target.value })}
            placeholder="pg"
            className="bg-transparent border-b border-stone-300 px-0 py-1 text-sm text-rose-700 focus:outline-none"
            aria-label={`Row ${i + 1} page`}
          />
          <button
            type="button"
            onClick={() => removeRow(i)}
            className="text-stone-400 hover:text-rose-600 text-xs px-1"
            aria-label={`Remove row ${i + 1}`}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="border border-stone-300 rounded px-2 py-1 text-xs text-stone-600"
      >
        + Row
      </button>
    </div>
  );
}
