'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ManualBlock } from '@/lib/manuals/types';
import { downloadMarkdown } from '@/lib/manuals/export-md';
import { blocksToHtml } from '@/lib/manuals/export-html';

interface DownloadMenuProps {
  blocks: ManualBlock[];
  title: string;
  filename: string;
}

export default function DownloadMenu({ blocks, title, filename }: DownloadMenuProps) {
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadMarkdown = () => {
    downloadMarkdown(blocks, title, filename, window.location.origin);
    setOpen(false);
  };

  const handleDownloadHtml = () => {
    const html = blocksToHtml(blocks, title, window.location.origin);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const handleDownloadPdf = async () => {
    setGenerating('pdf');
    try {
      // For now, download the styled HTML — PDF generation via Puppeteer
      // would require a server-side API route
      const html = blocksToHtml(blocks, title, window.location.origin);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      // Open in new window for printing
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          printWindow.print();
        });
      }
    } catch {
      // Failed
    } finally {
      setGenerating(null);
      setOpen(false);
    }
  };

  if (blocks.length === 0) return null;

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2 rounded-xl',
          'text-sm font-medium',
          'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]',
          'hover:bg-[var(--color-accent-hover)]',
          'transition-colors duration-200'
        )}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 z-20 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg overflow-hidden min-w-[220px]"
          >
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={generating === 'pdf'}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-background-subtle)] transition-colors text-left"
            >
              <span className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-xs font-bold text-red-600">
                PDF
              </span>
              <div>
                <div className="text-sm font-medium text-[var(--color-foreground)]">
                  {generating === 'pdf' ? 'Generating...' : 'Print as PDF'}
                </div>
                <div className="text-xs text-[var(--color-foreground-faint)]">US Letter, ready to print</div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleDownloadHtml}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-background-subtle)] transition-colors text-left"
            >
              <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-xs font-bold text-blue-600">
                HTML
              </span>
              <div>
                <div className="text-sm font-medium text-[var(--color-foreground)]">Download HTML</div>
                <div className="text-xs text-[var(--color-foreground-faint)]">Styled document for editing</div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-background-subtle)] transition-colors text-left"
            >
              <span className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-950/30 flex items-center justify-center text-xs font-bold text-gray-600">
                MD
              </span>
              <div>
                <div className="text-sm font-medium text-[var(--color-foreground)]">Download Markdown</div>
                <div className="text-xs text-[var(--color-foreground-faint)]">Plain text backup</div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
