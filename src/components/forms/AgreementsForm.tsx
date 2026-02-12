'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Agreement } from '@/lib/data/types';

interface AgreementsFormProps {
  agreements: Agreement[];
  onSubmit: (data: { accepted: string[]; signature: string }) => void;
  className?: string;
}

const inputStyles = cn(
  'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background-elevated)]',
  'px-4 py-3 text-[var(--color-foreground)]',
  'placeholder:text-[var(--color-foreground-faint)]',
  'focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-clay)]',
  'transition-all duration-200'
);

export function AgreementsForm({ agreements, onSubmit, className }: AgreementsFormProps) {
  const [accepted, setAccepted] = useState<Set<string>>(new Set());
  const [signature, setSignature] = useState('');

  const allAccepted = agreements.every((a) => accepted.has(a.id));
  const isValid = allAccepted && signature.trim().length > 0;

  function toggleAgreement(id: string) {
    setAccepted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({
      accepted: Array.from(accepted),
      signature: signature.trim(),
    });
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn('space-y-6', className)}
    >
      {/* Agreements list */}
      <fieldset className="space-y-4">
        <legend className="block text-sm font-medium text-[var(--color-foreground-subtle)] mb-1">
          Please review and accept each agreement
        </legend>

        <div className="space-y-3">
          {agreements.map((agreement, index) => {
            const isChecked = accepted.has(agreement.id);

            return (
              <motion.label
                key={agreement.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={cn(
                  'flex cursor-pointer gap-4 rounded-xl border p-4',
                  'transition-all duration-200',
                  isChecked
                    ? 'border-[var(--color-rose-clay)] bg-[var(--color-rose-50)]'
                    : 'border-[var(--color-border)] bg-[var(--color-background-elevated)] hover:border-[var(--color-border-strong)]'
                )}
              >
                {/* Custom checkbox */}
                <div className="pt-0.5">
                  <div
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2',
                      'transition-all duration-200',
                      isChecked
                        ? 'border-[var(--color-rose-clay)] bg-[var(--color-rose-clay)]'
                        : 'border-[var(--color-border-strong)] bg-[var(--color-background-elevated)]'
                    )}
                  >
                    <AnimatePresence>
                      {isChecked && (
                        <motion.svg
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                          className="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleAgreement(agreement.id)}
                    className="sr-only"
                    aria-label={agreement.title}
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <span
                    className={cn(
                      'block text-sm font-semibold',
                      isChecked
                        ? 'text-[var(--color-rose-clay)]'
                        : 'text-[var(--color-foreground)]'
                    )}
                  >
                    {agreement.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-[var(--color-foreground-muted)]">
                    {agreement.description}
                  </span>
                </div>
              </motion.label>
            );
          })}
        </div>
      </fieldset>

      {/* Signature */}
      <div className="space-y-2">
        <label
          htmlFor="agreements-signature"
          className="block text-sm font-medium text-[var(--color-foreground-subtle)]"
        >
          Signature Confirmation
        </label>
        <p className="text-xs text-[var(--color-foreground-faint)]">
          Please type your full name to confirm your agreements
        </p>
        <input
          id="agreements-signature"
          type="text"
          required
          placeholder="Your full name"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          className={cn(inputStyles, 'font-serif italic')}
        />
      </div>

      {/* Validation hint */}
      <AnimatePresence>
        {!allAccepted && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-[var(--color-foreground-faint)]"
          >
            All {agreements.length} agreements must be accepted to continue.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={!isValid}
        whileHover={isValid ? { scale: 1.02 } : undefined}
        whileTap={isValid ? { scale: 0.98 } : undefined}
        className={cn(
          'w-full rounded-xl px-6 py-3 font-medium',
          'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]',
          'transition-all duration-200',
          'hover:bg-[var(--color-accent-hover)]',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        Submit Enrollment
      </motion.button>
    </motion.form>
  );
}

export default AgreementsForm;
