'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BlockWrapperProps {
  children: React.ReactNode;
  blockType: string;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  isFirst: boolean;
  isLast: boolean;
  readOnly: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  heading: 'Heading',
  text: 'Text',
  image: 'Image',
  divider: 'Divider',
  'page-break': 'Page Break',
};

export default function BlockWrapper({
  children,
  blockType,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  isFirst,
  isLast,
  readOnly,
}: BlockWrapperProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (readOnly) {
    return <div className="py-2">{children}</div>;
  }

  const handleDelete = () => {
    if (blockType === 'divider' || blockType === 'page-break') {
      onDelete();
      return;
    }
    if (confirmDelete) {
      onDelete();
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="group/block relative py-1.5">
      {/* Hover highlight bar */}
      <div className="absolute -left-3 top-0 bottom-0 w-0.5 rounded-full bg-transparent group-hover/block:bg-[var(--color-rose-clay)]/30 transition-colors duration-200" />

      {/* Toolbar — appears on hover, positioned to the right */}
      <div className={cn(
        'absolute -right-2 top-1 translate-x-full',
        'flex items-center gap-0.5 px-1.5 py-1',
        'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-sm',
        'opacity-0 group-hover/block:opacity-100 transition-all duration-150',
        'z-10'
      )}>
        {/* Type label */}
        <span className="text-[10px] text-[var(--color-foreground-faint)] font-medium px-1.5 mr-0.5 select-none">
          {TYPE_LABELS[blockType] || blockType}
        </span>

        <div className="w-px h-4 bg-[var(--color-border)]" />

        {/* Move up */}
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          className={cn(
            'w-7 h-7 rounded-md flex items-center justify-center',
            'text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background-subtle)]',
            'disabled:opacity-25 disabled:cursor-not-allowed',
            'transition-all duration-100'
          )}
          title="Move up"
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
            'w-7 h-7 rounded-md flex items-center justify-center',
            'text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background-subtle)]',
            'disabled:opacity-25 disabled:cursor-not-allowed',
            'transition-all duration-100'
          )}
          title="Move down"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="w-px h-4 bg-[var(--color-border)]" />

        {/* Duplicate */}
        <button
          type="button"
          onClick={onDuplicate}
          className={cn(
            'w-7 h-7 rounded-md flex items-center justify-center',
            'text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background-subtle)]',
            'transition-all duration-100'
          )}
          title="Duplicate"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={handleDelete}
          className={cn(
            'w-7 h-7 rounded-md flex items-center justify-center transition-all duration-100',
            confirmDelete
              ? 'bg-[var(--color-error)] text-white'
              : 'text-[var(--color-foreground-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10'
          )}
          title={confirmDelete ? 'Click again to confirm' : 'Delete'}
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
