'use client';

import { motion } from 'framer-motion';
import { FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import { teachersAidPdfConfig } from '@/lib/data/manual-pdf-paths';

interface PdfExportButtonProps {
  className?: string;
}

export function PdfExportButton({ className }: PdfExportButtonProps) {
  const { locale, t } = useLanguage();
  const href = teachersAidPdfConfig.paths[locale] ?? teachersAidPdfConfig.paths.en;
  const label =
    teachersAidPdfConfig.labels[locale] ??
    t?.ui.exportTeachersAidPdf ??
    'Download Teachers Aid PDF';

  if (!href) return null;

  return (
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
        'print:hidden',
        className
      )}
    >
      <FileDown className="h-4 w-4" />
      <span>{label}</span>
    </motion.a>
  );
}

export default PdfExportButton;
