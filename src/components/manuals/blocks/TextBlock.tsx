'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import type { TextContent } from '@/lib/manuals/types';

interface TextBlockProps {
  content: TextContent;
  onChange: (content: TextContent) => void;
  readOnly: boolean;
}

export default function TextBlock({ content, onChange, readOnly }: TextBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

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

  const execFormat = useCallback((cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    handleInput();
  }, [handleInput]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      execFormat('bold');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      execFormat('italic');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
      e.preventDefault();
      execFormat('underline');
    }
  }, [execFormat]);

  const ToolbarButton = ({ onClick, active, children, label }: { onClick: () => void; active?: boolean; children: React.ReactNode; label: string }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={cn(
        'w-7 h-7 rounded-md flex items-center justify-center text-xs transition-all duration-100',
        active
          ? 'bg-[var(--color-rose-clay)] text-white'
          : 'text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background-subtle)]'
      )}
      title={label}
      aria-label={label}
    >
      {children}
    </button>
  );

  return (
    <div className="group/text relative">
      {/* Formatting toolbar */}
      {!readOnly && isFocused && (
        <div className="absolute -top-10 left-0 z-20 flex items-center gap-0.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-1 py-1 shadow-lg animate-in fade-in slide-in-from-bottom-1 duration-150">
          <ToolbarButton onClick={() => execFormat('bold')} label="Bold (Cmd+B)">
            <span className="font-bold">B</span>
          </ToolbarButton>
          <ToolbarButton onClick={() => execFormat('italic')} label="Italic (Cmd+I)">
            <span className="italic">I</span>
          </ToolbarButton>
          <ToolbarButton onClick={() => execFormat('underline')} label="Underline (Cmd+U)">
            <span className="underline">U</span>
          </ToolbarButton>

          <div className="w-px h-5 bg-[var(--color-border)] mx-0.5" />

          <ToolbarButton onClick={() => execFormat('insertUnorderedList')} label="Bullet list">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9 6h11M9 12h11M9 18h11M5 6h.01M5 12h.01M5 18h.01" strokeLinecap="round" />
            </svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => execFormat('insertOrderedList')} label="Numbered list">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M10 6h11M10 12h11M10 18h11" strokeLinecap="round" />
              <path d="M3 6h1M3 12h1M3 18h1" strokeLinecap="round" strokeWidth={2.5} />
            </svg>
          </ToolbarButton>
        </div>
      )}

      <div
        ref={ref}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        onKeyDown={readOnly ? undefined : handleKeyDown}
        data-placeholder="Start typing..."
        className={cn(
          'text-[var(--color-foreground)] leading-relaxed outline-none min-h-[1.5em]',
          '[&_strong]:font-semibold [&_em]:italic [&_u]:underline',
          '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-1',
          '[&_li]:py-0.5',
          'empty:before:content-[attr(data-placeholder)] empty:before:text-[var(--color-foreground-faint)]',
          !readOnly && 'rounded-lg px-3 -mx-3 py-2 transition-colors border border-transparent hover:border-[var(--color-border)]/50 focus:border-[var(--color-rose-clay)]/30 focus:bg-[var(--color-rose-50)]/30 dark:focus:bg-[var(--color-rose-950)]/20'
        )}
        role={readOnly ? undefined : 'textbox'}
        aria-label="Text block"
        aria-multiline="true"
      />
    </div>
  );
}
