'use client';

import { motion } from 'framer-motion';
import { FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PdfExportButtonProps {
  className?: string;
}

export function PdfExportButton({ className }: PdfExportButtonProps) {
  function handleExport() {
    window.print();
  }

  return (
    <motion.button
      type="button"
      onClick={handleExport}
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
      <span>Export PDF</span>
    </motion.button>
  );
}

export default PdfExportButton;
