'use client';

import { motion } from 'framer-motion';
import { Printer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaidProgramsDownloadButtonProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export default function PaidProgramsDownloadButton({ className, variant = 'dark' }: PaidProgramsDownloadButtonProps) {
  const isDark = variant === 'dark';

  return (
    <motion.button
      onClick={() => window.print()}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center gap-2 px-6 py-2.5 rounded-full',
        'text-sm font-medium',
        'transition-all duration-300',
        'print:hidden',
        isDark
          ? 'border border-white/20 text-white/70 hover:bg-white/5 hover:text-white hover:border-white/30'
          : 'border border-[var(--color-rose-clay)]/30 text-[var(--color-foreground)]/70 hover:bg-[var(--color-rose-clay)]/5 hover:text-[var(--color-foreground)]',
        className,
      )}
    >
      <Printer className="w-4 h-4" />
      <span>Print Additional Programs Guide</span>
    </motion.button>
  );
}
