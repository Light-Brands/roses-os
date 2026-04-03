'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { BlockType } from '@/lib/manuals/types';

interface AddBlockMenuProps {
  onAdd: (type: BlockType) => void;
}

const BLOCK_OPTIONS: { type: BlockType; label: string; icon: string; description: string }[] = [
  { type: 'heading', label: 'Heading', icon: 'H', description: 'Section title' },
  { type: 'text', label: 'Text', icon: 'T', description: 'Paragraph with formatting' },
  { type: 'image', label: 'Image', icon: '🖼', description: 'Upload an image' },
  { type: 'divider', label: 'Divider', icon: '—', description: 'Horizontal line' },
  { type: 'page-break', label: 'Page Break', icon: '⏎', description: 'Start new page when printed' },
];

export default function AddBlockMenu({ onAdd }: AddBlockMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={menuRef} className="relative flex justify-center">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center',
          'border border-[var(--color-border)] bg-[var(--color-surface)]',
          'text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]',
          'hover:border-[var(--color-rose-clay)]/40 hover:bg-[var(--color-background-subtle)]',
          'transition-all duration-200',
          'opacity-0 group-hover:opacity-100 focus:opacity-100',
          open && 'opacity-100 border-[var(--color-rose-clay)]/40'
        )}
        aria-label="Add block"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-9 z-20 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg overflow-hidden min-w-[200px]"
          >
            {BLOCK_OPTIONS.map((option) => (
              <button
                key={option.type}
                type="button"
                onClick={() => { onAdd(option.type); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--color-background-subtle)] transition-colors text-left"
              >
                <span className="w-7 h-7 rounded-lg bg-[var(--color-background-muted)] flex items-center justify-center text-sm font-medium text-[var(--color-foreground-muted)]">
                  {option.icon}
                </span>
                <div>
                  <div className="text-sm font-medium text-[var(--color-foreground)]">
                    {option.label}
                  </div>
                  <div className="text-xs text-[var(--color-foreground-faint)]">
                    {option.description}
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
