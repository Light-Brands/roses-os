'use client';

import type { GlossaryContent } from '@/lib/manuals/types';

interface Props {
  content: GlossaryContent;
  onChange: (content: GlossaryContent) => void;
  readOnly: boolean;
}

export default function GlossaryBlock({ content, onChange, readOnly }: Props) {
  const updateEntry = (i: number, field: 'term' | 'definition', v: string) => {
    const entries = content.entries.map((e, idx) => (idx === i ? { ...e, [field]: v } : e));
    onChange({ ...content, entries });
  };
  const addEntry = () =>
    onChange({ ...content, entries: [...content.entries, { term: '', definition: '' }] });
  const removeEntry = (i: number) =>
    onChange({ ...content, entries: content.entries.filter((_, idx) => idx !== i) });

  return (
    <dl className="my-4 space-y-2">
      {content.entries.length === 0 && !readOnly ? (
        <p className="text-stone-500 italic text-sm">No entries yet. Add one below.</p>
      ) : null}
      {content.entries.map((entry, i) => (
        <div key={i} className="grid grid-cols-[10rem_1fr_auto] gap-2 items-start">
          <dt className="font-semibold text-rose-700">
            {readOnly ? entry.term : (
              <input
                type="text"
                value={entry.term}
                onChange={(e) => updateEntry(i, 'term', e.target.value)}
                placeholder="Term"
                className="w-full bg-transparent border-b border-stone-300 font-semibold text-rose-700 focus:outline-none"
                aria-label={`Glossary term ${i + 1}`}
              />
            )}
          </dt>
          <dd className="text-stone-700">
            {readOnly ? entry.definition : (
              <input
                type="text"
                value={entry.definition}
                onChange={(e) => updateEntry(i, 'definition', e.target.value)}
                placeholder="Definition"
                className="w-full bg-transparent border-b border-stone-300 focus:outline-none"
                aria-label={`Glossary definition ${i + 1}`}
              />
            )}
          </dd>
          {!readOnly && (
            <button
              type="button"
              onClick={() => removeEntry(i)}
              className="text-stone-400 hover:text-rose-700 text-xs"
              aria-label={`Remove glossary entry ${i + 1}`}
            >
              ×
            </button>
          )}
        </div>
      ))}
      {!readOnly && (
        <button type="button" onClick={addEntry} className="mt-2 text-xs text-rose-700 underline">
          + entry
        </button>
      )}
    </dl>
  );
}
