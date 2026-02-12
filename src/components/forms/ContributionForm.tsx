'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sprout, Flower2, TreePine, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ContributionTier } from '@/lib/data/types';

interface ContributionFormProps {
  tiers: ContributionTier[];
  onSubmit: (tierId: string) => void;
  className?: string;
}

const tierIcons: Record<string, LucideIcon> = {
  Seed: Sprout,
  Bloom: Flower2,
  Canopy: TreePine,
};

export function ContributionForm({ tiers, onSubmit, className }: ContributionFormProps) {
  const [selectedTier, setSelectedTier] = useState<string>('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTier) return;
    onSubmit(selectedTier);
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn('space-y-6', className)}
    >
      <fieldset className="space-y-4">
        <legend className="block text-sm font-medium text-[var(--color-foreground-subtle)] mb-1">
          Select your contribution tier
        </legend>

        <div className="grid gap-4 sm:grid-cols-3">
          {tiers.map((tier, index) => {
            const isSelected = selectedTier === tier.id;
            const Icon: LucideIcon = tierIcons[tier.name] || Flower2;

            return (
              <motion.label
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -2 }}
                className={cn(
                  'relative flex cursor-pointer flex-col items-center rounded-2xl border p-6 text-center',
                  'transition-all duration-300',
                  isSelected
                    ? cn(
                        'border-[var(--color-rose-clay)] bg-[var(--color-rose-50)]',
                        'shadow-[var(--shadow-rose)]',
                        'ring-1 ring-[var(--color-rose-clay)]'
                      )
                    : cn(
                        'border-[var(--color-border)] bg-[var(--color-background-elevated)]',
                        'hover:border-[var(--color-border-strong)]',
                        'hover:shadow-[var(--shadow-md)]'
                      )
                )}
              >
                {/* Hidden radio input */}
                <input
                  type="radio"
                  name="contribution-tier"
                  value={tier.id}
                  checked={isSelected}
                  onChange={() => setSelectedTier(tier.id)}
                  className="sr-only"
                  aria-label={`${tier.name} tier: ${tier.range}`}
                />

                {/* Icon */}
                <div
                  className={cn(
                    'mb-4 flex h-12 w-12 items-center justify-center rounded-xl',
                    'transition-colors duration-200',
                    isSelected
                      ? 'bg-[var(--color-rose-clay)] text-white'
                      : 'bg-[var(--color-background-subtle)] text-[var(--color-foreground-muted)]'
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* Tier name */}
                <h3
                  className={cn(
                    'text-lg font-semibold font-serif',
                    isSelected
                      ? 'text-[var(--color-rose-clay)]'
                      : 'text-[var(--color-foreground)]'
                  )}
                >
                  {tier.name}
                </h3>

                {/* Income range */}
                <p className="mt-1 text-xs font-medium text-[var(--color-foreground-faint)]">
                  {tier.range}
                </p>

                {/* Description */}
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-foreground-muted)]">
                  {tier.description}
                </p>

                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className={cn(
                      'absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center',
                      'rounded-full bg-[var(--color-rose-clay)] text-white'
                    )}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.label>
            );
          })}
        </div>
      </fieldset>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={!selectedTier}
        whileHover={selectedTier ? { scale: 1.02 } : undefined}
        whileTap={selectedTier ? { scale: 0.98 } : undefined}
        className={cn(
          'w-full rounded-xl px-6 py-3 font-medium',
          'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]',
          'transition-all duration-200',
          'hover:bg-[var(--color-accent-hover)]',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        Continue
      </motion.button>
    </motion.form>
  );
}

export default ContributionForm;
