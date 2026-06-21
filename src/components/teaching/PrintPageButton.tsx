'use client';

import { motion } from 'framer-motion';
import { Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';

interface PrintPageButtonProps {
  className?: string;
  label?: string;
}

export default function PrintPageButton({ className, label }: PrintPageButtonProps) {
  const { t } = useLanguage();
  const text = label ?? t?.ui?.printPage ?? 'Print Page';
  // Slide cards lazy-load their images, so any slide not yet scrolled into view
  // has an unloaded <img loading="lazy">. The print stylesheet reveals every card
  // (overriding framer-motion's inline opacity), but unloaded images still print
  // blank. So before printing we flip every lazy image to eager and wait for the
  // newly-triggered loads to settle — that's what makes ALL slides print, not just
  // the ones already on screen.
  const handlePrint = async () => {
    const lazyImages = Array.from(
      document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]')
    );

    lazyImages.forEach((img) => {
      img.loading = 'eager';
    });

    const pending = lazyImages.filter((img) => !img.complete);
    if (pending.length > 0) {
      await Promise.race([
        Promise.all(
          pending.map(
            (img) =>
              new Promise<void>((resolve) => {
                img.addEventListener('load', () => resolve(), { once: true });
                img.addEventListener('error', () => resolve(), { once: true });
              })
          )
        ),
        // Safety valve: never block the print dialog for more than 5s if an
        // image stalls (slow network, missing file).
        new Promise<void>((resolve) => window.setTimeout(resolve, 5000)),
      ]);
    }

    window.print();
  };

  return (
    <motion.button
      onClick={handlePrint}
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
      <span>{text}</span>
    </motion.button>
  );
}
