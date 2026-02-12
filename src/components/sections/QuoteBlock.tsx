'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface QuoteBlockProps {
  quote: string;
  attribution?: string;
  variant?: 'default' | 'fullbleed';
  className?: string;
}

export default function QuoteBlock({
  quote,
  attribution,
  variant = 'default',
  className,
}: QuoteBlockProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const isFullbleed = variant === 'fullbleed';

  return (
    <section
      ref={ref}
      className={cn(
        'relative overflow-hidden',
        isFullbleed
          ? 'bg-[var(--color-rose-clay)] text-white texture-linen'
          : 'bg-[var(--color-background)]',
        className
      )}
    >
      <div className="container-premium section-padding">
        <div className="max-w-3xl mx-auto text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Decorative opening quote mark */}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 0.15, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'absolute -top-8 left-1/2 -translate-x-1/2 font-serif text-[6rem] leading-none select-none pointer-events-none',
                isFullbleed
                  ? 'text-white'
                  : 'text-[var(--color-foreground)]'
              )}
              aria-hidden="true"
            >
              &ldquo;
            </motion.span>

            <p
              className={cn(
                'font-serif italic text-2xl md:text-3xl lg:text-4xl leading-relaxed tracking-tight',
                isFullbleed
                  ? 'text-white'
                  : 'text-[var(--color-foreground)]'
              )}
            >
              &ldquo;{quote}&rdquo;
            </p>
          </motion.blockquote>

          {attribution && (
            <motion.footer
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'mt-6 md:mt-8 text-sm tracking-[0.15em] uppercase font-medium',
                isFullbleed
                  ? 'text-white/70'
                  : 'text-[var(--color-foreground-faint)]'
              )}
            >
              &mdash; {attribution}
            </motion.footer>
          )}
        </div>
      </div>
    </section>
  );
}
