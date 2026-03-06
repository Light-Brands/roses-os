'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaidProgramsDownloadButtonProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export default function PaidProgramsDownloadButton({ className, variant = 'dark' }: PaidProgramsDownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch('/api/pdf/paid-programs');
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'roses-os-additional-programs-guide.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download error:', err);
    } finally {
      setLoading(false);
    }
  }

  const isDark = variant === 'dark';

  return (
    <motion.button
      onClick={handleDownload}
      disabled={loading}
      whileHover={!loading ? { scale: 1.02 } : undefined}
      whileTap={!loading ? { scale: 0.98 } : undefined}
      className={cn(
        'inline-flex items-center gap-2 px-6 py-2.5 rounded-full',
        'text-sm font-medium',
        'transition-all duration-300',
        'print:hidden',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isDark
          ? 'border border-white/20 text-white/70 hover:bg-white/5 hover:text-white hover:border-white/30'
          : 'border border-[var(--color-rose-clay)]/30 text-[var(--color-foreground)]/70 hover:bg-[var(--color-rose-clay)]/5 hover:text-[var(--color-foreground)]',
        className,
      )}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      <span>{loading ? 'Generating PDF...' : 'Download Additional Programs Guide'}</span>
    </motion.button>
  );
}
