'use client';

import { cn } from '@/lib/utils';

interface BlockWrapperProps {
  children: React.ReactNode;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  readOnly: boolean;
}

export default function BlockWrapper({
  children,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  readOnly,
}: BlockWrapperProps) {
  if (readOnly) {
    return <div className="py-2">{children}</div>;
  }

  return (
    <div className="group relative py-2">
      {/* Block controls — left side */}
      <div className="absolute -left-12 top-2 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Move up */}
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          className={cn(
            'w-6 h-6 rounded flex items-center justify-center',
            'text-[var(--color-foreground-faint)] hover:text-[var(--color-foreground)]',
            'hover:bg-[var(--color-background-subtle)]',
            'disabled:opacity-30 disabled:cursor-not-allowed',
            'transition-all duration-150'
          )}
          aria-label="Move block up"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>

        {/* Move down */}
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          className={cn(
            'w-6 h-6 rounded flex items-center justify-center',
            'text-[var(--color-foreground-faint)] hover:text-[var(--color-foreground)]',
            'hover:bg-[var(--color-background-subtle)]',
            'disabled:opacity-30 disabled:cursor-not-allowed',
            'transition-all duration-150'
          )}
          aria-label="Move block down"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={onDelete}
          className={cn(
            'w-6 h-6 rounded flex items-center justify-center',
            'text-[var(--color-foreground-faint)] hover:text-[var(--color-error)]',
            'hover:bg-[var(--color-error)]/10',
            'transition-all duration-150'
          )}
          aria-label="Delete block"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {children}
    </div>
  );
}
