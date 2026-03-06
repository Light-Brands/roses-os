'use client';

import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/types';

interface ManualPdfButtonProps {
  paths: Partial<Record<Locale, string>>;
  labels: Partial<Record<Locale, string>>;
  className?: string;
}

export default function ManualPdfButton({
  paths,
  labels,
  className,
}: ManualPdfButtonProps) {
  const { locale } = useLanguage();
  const href = paths[locale] ?? paths.en;
  const label = labels[locale] ?? labels.en ?? 'Student Manual';

  if (!href) return null;

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
    </div>
  );
}
