'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { PathLevel } from '@/lib/data/types';

// =============================================================================
// PATH LEVELS
// Multi-step visualization with connected steps design.
// Compact: titles + subtitles only. Full: everything including focus areas.
// =============================================================================

interface PathLevelsProps {
  levels: PathLevel[];
  variant?: 'compact' | 'full';
  className?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const stepVariants = {
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

export default function PathLevels({ levels, variant = 'full', className }: PathLevelsProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const isCompact = variant === 'compact';

  return (
    <section ref={ref} className={cn('section-padding', className)}>
      <div className="container-premium">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="relative"
        >
          {/* Connected steps */}
          <div
            className={cn(
              'grid gap-0',
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            )}
          >
            {levels.map((level, index) => (
              <motion.div
                key={level.id}
                variants={stepVariants}
                className={cn(
                  'relative group',
                  // Mobile: bottom borders
                  'border-b border-[var(--color-border)] md:border-b-0',
                  index === levels.length - 1 && 'border-b-0',
                  // Tablet+ (2-col): left border on every item, remove for first in row
                  'md:border-l md:border-[var(--color-border)]',
                  index % 2 === 0 && 'md:border-l-0',
                  // Desktop (4-col): re-add left border for items that aren't first in 4-col row
                  index % 2 === 0 && index % 4 !== 0 && 'lg:border-l lg:border-[var(--color-border)]',
                  // Tablet+ top border for rows after first (2-col)
                  index >= 2 && 'md:border-t md:border-t-[var(--color-border)]',
                  // Desktop: remove top border for first 4-col row items
                  index >= 2 && index < 4 && 'lg:border-t-0',
                  // Padding
                  isCompact ? 'py-6 md:py-4 md:px-5' : 'py-8 md:py-6 md:px-6',
                )}
              >
                {/* Step indicator */}
                <div className="flex items-center gap-3 mb-3">
                  {/* Step number circle */}
                  <div
                    className={cn(
                      'flex items-center justify-center',
                      'w-8 h-8 rounded-full',
                      'bg-[#C4A86B]/10 text-[#C4A86B]',
                      'font-serif font-semibold text-sm',
                      'border border-[#C4A86B]/20',
                      'transition-colors duration-300',
                      'group-hover:bg-[#C4A86B]/20'
                    )}
                  >
                    {level.level}
                  </div>

                  {/* Connecting dash (desktop only, not on last in row) */}
                  {index < levels.length - 1 && index % 4 !== 3 && (
                    <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-3 h-px bg-[var(--color-border)]" />
                  )}
                </div>

                {/* Title */}
                <h3 className="font-serif font-semibold text-lg text-[var(--color-foreground)] leading-snug mb-1">
                  {level.title}
                </h3>

                {/* Subtitle */}
                <p className={cn(
                  'text-sm text-[var(--color-foreground-faint)] italic',
                  !isCompact && 'mb-3'
                )}>
                  {level.subtitle}
                </p>

                {/* Full variant: description + focus areas */}
                {!isCompact && (
                  <>
                    <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed mb-4">
                      {level.description}
                    </p>

                    {/* Focus areas */}
                    {level.focus.length > 0 && (
                      <ul className="space-y-1.5">
                        {level.focus.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-[var(--color-foreground-muted)]"
                          >
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C4A86B]/50 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
