'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LineageEntry } from '@/lib/data/types';

// =============================================================================
// LINEAGE TIMELINE
// Horizontal on desktop, vertical on mobile. Gold connecting line.
// =============================================================================

interface LineageTimelineProps {
  entries: LineageEntry[];
  className?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function LineageTimeline({ entries, className }: LineageTimelineProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className={cn('section-padding', className)}>
      <div className="container-premium">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className={cn(
            'relative',
            // Horizontal on desktop (xl+), vertical on mobile/tablet
            'flex flex-col xl:flex-row',
            'gap-8 xl:gap-0'
          )}
        >
          {/* Gold connecting line */}
          {/* Vertical line on mobile/tablet */}
          <div
            className={cn(
              'absolute',
              // Mobile/tablet: vertical line on the left
              'left-4 top-0 bottom-0 w-px xl:left-0 xl:top-auto xl:bottom-auto',
              // Desktop: horizontal line centered vertically
              'xl:w-full xl:h-px xl:top-6',
              'bg-[#9E956B]'
            )}
          />

          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              variants={itemVariants}
              className={cn(
                'relative',
                // Mobile/tablet: left-padded for vertical line
                'pl-12 xl:pl-0',
                // Desktop: equal-width flex items
                'xl:flex-1 xl:px-4',
                // Desktop: top padding for horizontal line
                'xl:pt-14',
                // First item needs no left padding on desktop
                index === 0 && 'xl:pl-0',
                // Last item needs no right padding on desktop
                index === entries.length - 1 && 'xl:pr-0'
              )}
            >
              {/* Node dot — decorative, sits on the gold connecting line */}
              <div
                className={cn(
                  'absolute z-0',
                  // Mobile/tablet: on the vertical line
                  'left-2.5 top-1 xl:left-auto xl:top-auto',
                  // Desktop: centered on the horizontal line at top-6 (24px)
                  'xl:left-4 xl:top-[18px]',
                  'w-3 h-3 rounded-full',
                  'bg-[#9E956B]',
                  'border-2 border-[var(--color-background)]',
                  'shadow-[0_0_0_2px_#9E956B]'
                )}
              />

              {/* Year */}
              <p className={cn(
                "relative z-10",
                "text-xs font-medium uppercase tracking-[0.15em] text-[#9E956B] mb-1.5",
                // Desktop: position above the gold line
                "xl:absolute xl:top-0 xl:left-4",
              )}>
                {entry.year}
              </p>

              {/* Name */}
              <h3 className="relative z-10 font-serif font-semibold text-lg text-[var(--color-foreground)] leading-snug mb-1.5">
                {entry.name}
              </h3>

              {/* Description */}
              <p className="relative z-10 text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                {entry.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
