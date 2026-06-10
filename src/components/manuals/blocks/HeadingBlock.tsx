'use client';

import { useRef, useEffect, useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.textContent !== content.text) {
      ref.current.textContent = content.text;
    }
  }, [content.text]);

  // The level menu opens on click and stays open (JS state) until a level is
  // chosen, an outside pointer-down, or Escape. It deliberately does NOT depend
  // on hover/focus: once open, moving the cursor away from the heading can't
  // close it before the user reaches the H1/H2/H3 buttons.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, [menuOpen]);

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
      {/* T-032: optional eyebrow strip above an h1 (v2 schema). */}
      {content.level === 1 && (
        <div className="mb-1">
          {readOnly ? (
            content.eyebrow ? (
              <span className="text-xs uppercase tracking-[0.18em] text-rose-700">{content.eyebrow}</span>
            ) : null
          ) : (
            <input
              type="text"
              value={content.eyebrow ?? ''}
              onChange={(e) => onChange({ ...content, eyebrow: e.target.value })}
              placeholder="Eyebrow (optional, h1 only)"
              className="text-xs uppercase tracking-[0.18em] text-rose-700 bg-transparent border-b border-stone-300 px-0 py-0.5 w-1/2 focus:outline-none"
              aria-label="Heading eyebrow"
            />
          )}
        </div>
      )}
      {/* Level control — top-LEFT, clear of the block action toolbar on the
          right. A small trigger (showing the current level) is revealed on
          hover/focus; clicking it opens a menu that PERSISTS via JS state, so
          the user can move the cursor to the H1/H2/H3 buttons without the hover
          dropping and closing it. z-20 keeps it above the action toolbar. */}
      {!readOnly && (
        <div ref={menuRef} className="absolute left-0 top-0 -translate-y-full z-20 pb-2">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} /* keep the heading selection */
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Change heading level"
            aria-expanded={menuOpen}
            className={cn(
              'flex items-center gap-1 h-6 px-2 rounded-md text-xs font-semibold shadow-sm',
              'bg-[var(--color-surface)] border border-[var(--color-border)]',
              'text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]',
              'transition-opacity duration-150',
              menuOpen
                ? 'opacity-100'
                : 'opacity-0 group-hover/heading:opacity-100 group-focus-within/heading:opacity-100'
            )}
          >
            <span>H{content.level}</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {menuOpen && (
            <div className="mt-1 flex gap-0.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-0.5 py-0.5 shadow-md">
              {([1, 2, 3] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); onLevelChange(level); setMenuOpen(false); }}
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
