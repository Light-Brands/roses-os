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
            // Horizontal on desktop
            'flex flex-col lg:flex-row',
            'gap-8 lg:gap-0'
          )}
        >
          {/* Gold connecting line */}
          {/* Vertical line on mobile */}
          <div
            className={cn(
              'absolute',
              // Mobile: vertical line on the left
              'left-4 top-0 bottom-0 w-px lg:left-0 lg:top-auto lg:bottom-auto',
              // Desktop: horizontal line centered vertically
              'lg:w-full lg:h-px lg:top-6',
              'bg-[#C4A86B]'
            )}
          />

          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              variants={itemVariants}
              className={cn(
                'relative',
                // Mobile: left-padded for vertical line
                'pl-10 lg:pl-0',
                // Desktop: equal-width flex items
                'lg:flex-1 lg:px-4',
                // Desktop: top padding for horizontal line
                'lg:pt-14',
                // First item needs no left padding on desktop
                index === 0 && 'lg:pl-0',
                // Last item needs no right padding on desktop
                index === entries.length - 1 && 'lg:pr-0'
              )}
            >
              {/* Node dot */}
              <div
                className={cn(
                  'absolute',
                  // Mobile: on the vertical line
                  'left-2.5 top-1 lg:left-auto lg:top-auto',
                  // Desktop: on the horizontal line
                  'lg:left-4 lg:-top-[5px]',
                  'w-3 h-3 rounded-full',
                  'bg-[#C4A86B]',
                  'border-2 border-[var(--color-background)]',
                  'shadow-[0_0_0_2px_#C4A86B]'
                )}
              />

              {/* Year */}
              <p className={cn(
                "text-xs font-medium uppercase tracking-[0.15em] text-[#C4A86B] mb-1.5",
                // Desktop: position above the gold line
                "lg:absolute lg:top-0 lg:left-4",
              )}>
                {entry.year}
              </p>

              {/* Name */}
              <h3 className="font-serif font-semibold text-lg text-[var(--color-foreground)] leading-snug mb-1.5">
                {entry.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                {entry.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
