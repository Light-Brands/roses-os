'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ManualBlock, ManualLanguage } from '@/lib/manuals/types';
import { downloadMarkdown } from '@/lib/manuals/export-md';
import { blocksToHtml } from '@/lib/manuals/export-html';
import { getFinalPdfForSlug } from '@/lib/manuals/pdf-map';

interface DownloadMenuProps {
  blocks: ManualBlock[];
  title: string;
  filename: string;
  /** Manual id; used to POST the current blocks to the draft-PDF route (T-013). */
  manualId: string;
  /** Manual slug; used to look up the canonical Final Version PDF. */
  slug: string;
  /** Selected language; the designed PDF is served in this language. */
  language: ManualLanguage;
}

export default function DownloadMenu({ blocks, title, filename, manualId, slug, language }: DownloadMenuProps) {
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const finalPdf = getFinalPdfForSlug(slug, language);

  // "Draft PDF from your edits" (D-22, T-013): render the CURRENT blocks server
  // side, separate from and never replacing the canonical designed master.
  const handleDownloadDraftPdf = async () => {
    setGenerating('draft');
    try {
      const res = await fetch(`/api/manuals/${manualId}/draft-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks, title, origin: window.location.origin }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}-draft.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setOpen(false);
    } catch {
      // Failed — the canonical master download is unaffected.
    } finally {
      setGenerating(null);
    }
  };

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
    // Mapped manuals serve the canonical Final Version PDF directly.
    // Unmapped manuals fall back to the placeholder blocksToHtml flow
    // (renders content but not the designed layout — tracked in #506).
    if (finalPdf) {
      const a = document.createElement('a');
      a.href = finalPdf.url;
      a.download = finalPdf.downloadName;
      a.click();
      setOpen(false);
      return;
    }

    setGenerating('pdf');
    try {
      // Render the styled HTML with absolute image URLs and open it. The page
      // self-prints once its images finish loading (script embedded in the HTML),
      // so figures are never blank. Use "Save as PDF" in the print dialog.
      const html = blocksToHtml(blocks, title, window.location.origin);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
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
            className="absolute right-0 top-12 z-50 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg overflow-hidden min-w-[220px]"
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
                  {generating === 'pdf'
                    ? 'Generating...'
                    : finalPdf
                      ? 'Designed print original'
                      : 'Print as PDF'}
                </div>
                <div className="text-xs text-[var(--color-foreground-faint)]">
                  {finalPdf
                    ? 'The hand-designed print master. Your edits do not change it.'
                    : 'US Letter, ready to print'}
                </div>
              </div>
            </button>

            {/* Draft PDF from your edits (D-22, T-013) — only where a designed
                master exists, so the two are clearly distinct (AC11). */}
            {finalPdf && (
              <button
                type="button"
                onClick={handleDownloadDraftPdf}
                disabled={generating === 'draft'}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-background-subtle)] transition-colors text-left"
              >
                <span className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-xs font-bold text-amber-600">
                  PDF
                </span>
                <div>
                  <div className="text-sm font-medium text-[var(--color-foreground)]">
                    {generating === 'draft' ? 'Generating...' : 'Draft PDF from your edits'}
                  </div>
                  <div className="text-xs text-[var(--color-foreground-faint)]">
                    Generated from what you see here. A draft, not the print master.
                  </div>
                </div>
              </button>
            )}

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
