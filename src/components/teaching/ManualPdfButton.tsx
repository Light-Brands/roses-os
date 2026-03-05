'use client';

import { motion } from 'framer-motion';
import { BookOpen, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/types';

const MANUAL_PATHS: Record<Locale, string | null> = {
  en: '/manuals/rose-meditation-level-1-final.pdf',
  el: '/manuals/roses-level-1-manual-el.pdf',
  es: '/manuals/roses-level-1-manual-es.pdf',
  pt: '/manuals/roses-level-1-manual-pt.pdf',
};

const MANUAL_LABELS: Record<Locale, string> = {
  en: 'Level 1 Manual (PDF)',
  el: 'Εγχειρίδιο Επίπεδο 1 (PDF)',
  es: 'Manual Nivel 1 (PDF)',
  pt: 'Manual Nível 1 (PDF)',
};

interface ManualPdfButtonProps {
  className?: string;
}

export default function ManualPdfButton({ className }: ManualPdfButtonProps) {
  const { locale } = useLanguage();
  const href = MANUAL_PATHS[locale] ?? MANUAL_PATHS.en!;
  const label = MANUAL_LABELS[locale] ?? MANUAL_LABELS.en;

  return (
    <div className={cn('inline-flex items-center gap-2 print:hidden', className)}>
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium',
          'bg-[var(--color-background-subtle)] text-[var(--color-foreground)]',
          'border border-[var(--color-border)]',
          'hover:bg-[var(--color-background-muted)]',
          'transition-all duration-200',
        )}
      >
        <BookOpen className="h-4 w-4" />
        <span>{label}</span>
      </motion.a>
      <motion.a
        href={href}
        download
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center rounded-xl p-3',
          'bg-[var(--color-background-subtle)] text-[var(--color-foreground)]',
          'border border-[var(--color-border)]',
          'hover:bg-[var(--color-background-muted)]',
          'transition-all duration-200',
        )}
        title="Download PDF"
      >
        <Download className="h-4 w-4" />
      </motion.a>
    </div>
  );
}
