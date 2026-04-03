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

  const sizeClasses = {
    1: 'text-3xl md:text-4xl font-semibold',
    2: 'text-2xl md:text-3xl font-semibold',
    3: 'text-xl md:text-2xl font-medium',
  };

  return (
    <div className="group/heading relative">
      {/* Level toggle buttons — top-right, visible on hover */}
      {!readOnly && (
        <div className="absolute -top-1 right-0 opacity-0 group-focus-within/heading:opacity-100 group-hover/heading:opacity-100 transition-opacity z-10 flex gap-0.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-0.5 py-0.5 shadow-sm">
          {([1, 2, 3] as const).map((level) => (
            <button
              key={level}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); onLevelChange(level); }}
              className={cn(
                'text-xs font-semibold w-7 h-6 rounded-md flex items-center justify-center transition-all duration-100',
                content.level === level
                  ? 'bg-[var(--color-rose-clay)] text-white'
                  : 'text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-subtle)] hover:text-[var(--color-foreground)]'
              )}
            >
              H{level}
            </button>
          ))}
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
          !readOnly && 'rounded-lg px-3 -mx-3 py-1.5 transition-colors border border-transparent hover:border-[var(--color-border)]/50 focus:border-[var(--color-rose-clay)]/30 focus:bg-[var(--color-rose-50)]/30 dark:focus:bg-[var(--color-rose-950)]/20'
        )}
        role={readOnly ? undefined : 'textbox'}
        aria-label="Heading"
      />
    </div>
  );
}
