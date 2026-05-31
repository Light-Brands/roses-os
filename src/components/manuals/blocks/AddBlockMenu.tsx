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
  // v2 (spec 001-richer-block-editor) — block primitives from canon.
  {
    type: 'cover',
    label: 'Cover',
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M8 8h8M8 12h6M8 16h4" /></svg>,
    description: 'Title page with author + cover image',
  },
  {
    type: 'callout',
    label: 'Callout',
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h2" strokeLinecap="round" /></svg>,
    description: 'Tinted box (note / warning / wisdom / summary)',
  },
  {
    type: 'quote',
    label: 'Quote',
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M6 9v9c0 1-1 2-2 2M14 9v9c0 1-1 2-2 2M3 6c0-1.5 1-3 3-3h5l-2 6H5M11 6c0-1.5 1-3 3-3h5l-2 6h-4" /></svg>,
    description: 'Tinted blockquote with attribution',
  },
  {
    type: 'numbered-exercise',
    label: 'Numbered Exercise',
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><text x="3" y="17" fontSize="14" fill="currentColor">1</text><path d="M10 12h11M10 17h8" strokeLinecap="round" /></svg>,
    description: 'Outsize numeral + body, hanging indent',
  },
  {
    type: 'captioned-figure',
    label: 'Captioned Figure',
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="4" width="18" height="12" rx="1" /><circle cx="8" cy="9" r="1.5" /><path d="M21 13l-5-5L5 16M5 20h14" /></svg>,
    description: 'Image with italic caption',
  },
  {
    type: 'spoken-instruction',
    label: 'Spoken Instruction',
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M12 3a6.5 6.5 0 016.5 6.5c0 4.5-3.5 8.5-6.5 8.5s-6.5-4-6.5-8.5A6.5 6.5 0 0112 3zM12 18v3M10 21h4" /></svg>,
    description: 'Rose-icon marker + bold quoted line',
  },
  {
    type: 'table',
    label: 'Table',
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="3" width="18" height="18" rx="1" /><path d="M3 9h18M3 15h18M9 3v18M15 3v18" /></svg>,
    description: 'Simple table with header row',
  },
  {
    type: 'contents',
    label: 'Table of Contents',
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M4 6h2M9 6h11M4 12h2M9 12h11M4 18h2M9 18h11" strokeLinecap="round" /></svg>,
    description: 'Canon contents list: numeral · title · page',
  },
  {
    type: 'footnote',
    label: 'Footnote',
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M4 6h12M4 10h12M4 14h8M18 6v3l2-1 2 1V6" /></svg>,
    description: 'Inline refs + definitions at section end',
  },
  {
    type: 'glossary',
    label: 'Glossary',
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M4 6h6v4H4zM12 6h8M12 10h8M4 14h6v4H4zM12 14h8M12 18h8" /></svg>,
    description: 'Term + definition pairs',
  },
  // Layout containers (M4) — render at the bottom under a separator.
  {
    type: 'section',
    label: 'Section',
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" strokeLinecap="round" /></svg>,
    description: 'Group blocks into a logical section',
  },
  {
    type: 'two-column-section',
    label: 'Two Columns',
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="3" width="8" height="18" rx="1" /><rect x="13" y="3" width="8" height="18" rx="1" /></svg>,
    description: 'Side-by-side container',
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
              <p className="text-[10px] font-medium uppercase tracking-wider text-rose-700">Brand Wall</p>
              <p className="text-[10px] text-[var(--color-foreground-faint)]">Every block traces a canon pattern.</p>
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
