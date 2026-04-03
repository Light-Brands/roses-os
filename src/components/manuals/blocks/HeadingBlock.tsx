'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { HeadingContent } from '@/lib/manuals/types';

interface HeadingBlockProps {
  content: HeadingContent;
  onChange: (content: HeadingContent) => void;
  onLevelChange: (level: 1 | 2 | 3) => void;
  readOnly: boolean;
}

export default function HeadingBlock({ content, onChange, onLevelChange, readOnly }: HeadingBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.textContent !== content.text) {
      ref.current.textContent = content.text;
    }
  }, [content.text]);

  const handleInput = () => {
    if (ref.current) {
      onChange({ ...content, text: ref.current.textContent || '' });
    }
  };

  const Tag = content.level === 1 ? 'h1' : content.level === 2 ? 'h2' : 'h3';
  const sizeClasses = {
    1: 'text-3xl md:text-4xl font-semibold',
    2: 'text-2xl md:text-3xl font-semibold',
    3: 'text-xl md:text-2xl font-medium',
  };

  return (
    <div className="group relative">
      {/* Level selector — only for editors */}
      {!readOnly && (
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <select
            value={content.level}
            onChange={(e) => onLevelChange(Number(e.target.value) as 1 | 2 | 3)}
            className="text-xs bg-[var(--color-background-subtle)] border border-[var(--color-border)] rounded px-1 py-0.5 text-[var(--color-foreground-muted)]"
          >
            <option value={1}>H1</option>
            <option value={2}>H2</option>
            <option value={3}>H3</option>
          </select>
        </div>
      )}

      <div
        ref={ref}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder="Heading..."
        className={cn(
          'font-serif tracking-tight text-[var(--color-foreground)] outline-none',
          sizeClasses[content.level],
          'empty:before:content-[attr(data-placeholder)] empty:before:text-[var(--color-foreground-faint)]',
          !readOnly && 'hover:bg-[var(--color-background-subtle)]/50 focus:bg-[var(--color-background-subtle)]/50 rounded-lg px-2 -mx-2 py-1 transition-colors'
        )}
        role={readOnly ? undefined : 'textbox'}
        aria-label={`${Tag} heading`}
      />
    </div>
  );
}
