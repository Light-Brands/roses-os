'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { BlockType } from '@/lib/manuals/types';

interface AddBlockMenuProps {
  onAdd: (type: BlockType) => void;
}

const BLOCK_OPTIONS: { type: BlockType; label: string; icon: React.ReactNode; description: string; shortcut?: string }[] = [
  {
    type: 'heading',
    label: 'Heading',
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 12h8M4 18V6M12 18V6M20 18v-4a4 4 0 00-4-4h-1" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    description: 'Section title',
    shortcut: 'H',
  },
  {
    type: 'text',
    label: 'Text',
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    description: 'Paragraph with bold, italic, lists',
    shortcut: 'T',
  },
  {
    type: 'image',
    label: 'Image',
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>,
    description: 'Upload a photo or illustration',
    shortcut: 'I',
  },
  {
    type: 'image-row',
    label: 'Image Row',
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="6" width="5" height="12" rx="1" /><rect x="9.5" y="6" width="5" height="12" rx="1" /><rect x="16" y="6" width="5" height="12" rx="1" /></svg>,
    description: '2–4 images side by side',
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 12h18" strokeLinecap="round" /></svg>,
    description: 'Horizontal line between sections',
  },
  {
    type: 'page-break',
    label: 'Page Break',
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 12h4m4 0h2m4 0h4M7 4v16M17 4v16" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 3" /></svg>,
    description: 'New page when printed',
  },
];

export default function AddBlockMenu({ onAdd }: AddBlockMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative flex items-center group/add h-5">
      {/* Hover line */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-transparent group-hover/add:bg-[var(--color-border)] transition-colors duration-200" />

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'relative z-10 mx-auto',
          'w-6 h-6 rounded-full flex items-center justify-center',
          'bg-[var(--color-surface)] border border-[var(--color-border)]',
          'text-[var(--color-foreground-faint)] hover:text-[var(--color-rose-clay)] hover:border-[var(--color-rose-clay)]/50',
          'transition-all duration-200',
          'opacity-0 group-hover/add:opacity-100 focus:opacity-100',
          open && 'opacity-100 text-[var(--color-rose-clay)] border-[var(--color-rose-clay)]/50 rotate-45'
        )}
        aria-label="Add block"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 -translate-x-1/2 top-8 z-30 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl overflow-hidden min-w-[240px]"
          >
            <div className="px-3 py-2 border-b border-[var(--color-border)]">
              <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-foreground-faint)]">Add a block</p>
            </div>
            {BLOCK_OPTIONS.map((option) => (
              <button
                key={option.type}
                type="button"
                onClick={() => { onAdd(option.type); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--color-rose-50)] dark:hover:bg-[var(--color-rose-950)]/30 transition-colors text-left group/item"
              >
                <span className="w-8 h-8 rounded-lg bg-[var(--color-background-subtle)] group-hover/item:bg-[var(--color-rose-clay)]/10 flex items-center justify-center text-[var(--color-foreground-muted)] group-hover/item:text-[var(--color-rose-clay)] transition-colors">
                  {option.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--color-foreground)]">
                    {option.label}
                  </div>
                  <div className="text-[11px] text-[var(--color-foreground-faint)] leading-tight">
                    {option.description}
                  </div>
                </div>
                {option.shortcut && (
                  <kbd className="text-[10px] text-[var(--color-foreground-faint)] bg-[var(--color-background-subtle)] px-1.5 py-0.5 rounded font-mono">
                    {option.shortcut}
                  </kbd>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
