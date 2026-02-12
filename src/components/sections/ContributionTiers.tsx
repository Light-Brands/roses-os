'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ContributionTier } from '@/lib/data/types';

interface ContributionTiersProps {
  tiers: ContributionTier[];
  selected?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export default function ContributionTiers({
  tiers,
  selected,
  onSelect,
  className,
}: ContributionTiersProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn('w-full', className)}
      role="radiogroup"
      aria-label="Contribution tier"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier, index) => {
          const isSelected = selected === tier.id;

          return (
            <motion.button
              key={tier.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect?.(tier.id)}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={cn(
                'relative text-left rounded-2xl p-6 md:p-7',
                'border-2 transition-all duration-300',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-rose-clay)]',
                'cursor-pointer',
                isSelected
                  ? 'border-rose-500 bg-[var(--color-background-elevated)] shadow-[var(--shadow-lg)]'
                  : 'border-[var(--color-border)] bg-[var(--color-background-subtle)] hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-sm)]'
              )}
            >
              {/* Selection indicator */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={cn(
                    'flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors duration-200',
                    isSelected
                      ? 'border-rose-500'
                      : 'border-[var(--color-border-strong)]'
                  )}
                >
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="w-2.5 h-2.5 rounded-full bg-rose-500"
                    />
                  )}
                </span>
                <span className="font-serif text-lg text-[var(--color-foreground)] tracking-tight">
                  {tier.name}
                </span>
              </div>

              {/* Range */}
              <p className="text-base font-medium text-[var(--color-foreground-subtle)] mb-2">
                {tier.range}
              </p>

              {/* Description */}
              <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                {tier.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
