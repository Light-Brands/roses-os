'use client';

import { useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { TextContent } from '@/lib/manuals/types';

interface TextBlockProps {
  content: TextContent;
  onChange: (content: TextContent) => void;
  readOnly: boolean;
}

export default function TextBlock({ content, onChange, readOnly }: TextBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== content.html) {
      ref.current.innerHTML = content.html;
    }
  }, [content.html]);

  const handleInput = useCallback(() => {
    if (ref.current) {
      onChange({ html: ref.current.innerHTML });
    }
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Bold: Ctrl/Cmd+B
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      document.execCommand('bold');
      handleInput();
    }
    // Italic: Ctrl/Cmd+I
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      document.execCommand('italic');
      handleInput();
    }
  }, [handleInput]);

  return (
    <div className="group relative">
      {/* Formatting toolbar — visible on focus for editors */}
      {!readOnly && (
        <div className="absolute -top-8 left-0 opacity-0 group-focus-within:opacity-100 transition-opacity z-10 flex gap-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-1.5 py-1 shadow-sm">
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); document.execCommand('bold'); handleInput(); }}
            className="text-xs font-bold px-2 py-0.5 rounded hover:bg-[var(--color-background-subtle)] text-[var(--color-foreground)]"
            aria-label="Bold"
          >
            B
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); document.execCommand('italic'); handleInput(); }}
            className="text-xs italic px-2 py-0.5 rounded hover:bg-[var(--color-background-subtle)] text-[var(--color-foreground)]"
            aria-label="Italic"
          >
            I
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); document.execCommand('insertUnorderedList'); handleInput(); }}
            className="text-xs px-2 py-0.5 rounded hover:bg-[var(--color-background-subtle)] text-[var(--color-foreground)]"
            aria-label="Bullet list"
          >
            &bull; List
          </button>
        </div>
      )}

      <div
        ref={ref}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={readOnly ? undefined : handleKeyDown}
        data-placeholder="Type something..."
        className={cn(
          'text-[var(--color-foreground)] leading-relaxed outline-none prose prose-sm max-w-none',
          'prose-strong:font-semibold prose-em:italic',
          'prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6',
          'empty:before:content-[attr(data-placeholder)] empty:before:text-[var(--color-foreground-faint)]',
          !readOnly && 'hover:bg-[var(--color-background-subtle)]/50 focus:bg-[var(--color-background-subtle)]/50 rounded-lg px-2 -mx-2 py-1.5 transition-colors'
        )}
        role={readOnly ? undefined : 'textbox'}
        aria-label="Text block"
        aria-multiline="true"
      />
    </div>
  );
}
