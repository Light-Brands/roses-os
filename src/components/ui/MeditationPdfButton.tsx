'use client';

import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MeditationPdfButtonProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export default function MeditationPdfButton({ className, variant = 'dark' }: MeditationPdfButtonProps) {
  const isDark = variant === 'dark';

  return (
    <motion.a
      href="/resources/aura1-rose-meditation-mar-2026.pdf"
      download="Aura-1-and-Rose-Meditation-Mar-2026.pdf"
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
      <Download className="w-4 h-4" />
      <span>Download Aura 1 &amp; Rose Meditation Guide</span>
    </motion.a>
  );
}
