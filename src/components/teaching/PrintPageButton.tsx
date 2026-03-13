'use client';

import { motion } from 'framer-motion';
import { Printer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrintPageButtonProps {
  className?: string;
  label?: string;
}

export default function PrintPageButton({ className, label = 'Print Page' }: PrintPageButtonProps) {
  return (
    <motion.button
      onClick={() => window.print()}
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
      <Printer className="h-4 w-4" />
      <span>{label}</span>
    </motion.button>
  );
}
