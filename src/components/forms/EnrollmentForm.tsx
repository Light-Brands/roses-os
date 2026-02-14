'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EnrollmentFormData {
  name: string;
  email: string;
  program: string;
}

interface EnrollmentFormProps {
  onSubmit: (data: EnrollmentFormData) => void;
  className?: string;
}

const inputStyles = cn(
  'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background-elevated)]',
  'px-4 py-3 text-[var(--color-foreground)]',
  'placeholder:text-[var(--color-foreground-faint)]',
  'focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-clay)]',
  'transition-all duration-200'
);

const program = {
  id: 'the-rose-aura-1',
  title: 'The Rose + Aura 1',
  subtitle: 'Complete Immersion -- 11 days',
};

export function EnrollmentForm({ onSubmit, className }: EnrollmentFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const isValid = name.trim() !== '' && email.trim() !== '';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({ name: name.trim(), email: email.trim(), program: program.id });
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn('space-y-6', className)}
    >
      {/* Name */}
      <div className="space-y-2">
        <label
          htmlFor="enrollment-name"
          className="block text-sm font-medium text-[var(--color-foreground-subtle)]"
        >
          Full Name
        </label>
        <input
          id="enrollment-name"
          type="text"
          required
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputStyles}
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="enrollment-email"
          className="block text-sm font-medium text-[var(--color-foreground-subtle)]"
        >
          Email Address
        </label>
        <input
          id="enrollment-email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputStyles}
        />
      </div>

      {/* Program */}
      <div className="space-y-2">
        <span className="block text-sm font-medium text-[var(--color-foreground-subtle)]">
          Program
        </span>
        <div
          className={cn(
            'rounded-xl border p-4',
            'border-[var(--color-rose-clay)] bg-[var(--color-rose-50)] shadow-[var(--shadow-rose)]'
          )}
        >
          <span className="block font-medium text-[var(--color-foreground)]">
            {program.title}
          </span>
          <span className="text-sm text-[var(--color-foreground-muted)]">
            {program.subtitle}
          </span>
        </div>
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={!isValid}
        whileHover={isValid ? { scale: 1.02 } : undefined}
        whileTap={isValid ? { scale: 0.98 } : undefined}
        className={cn(
          'w-full rounded-xl px-6 py-3 font-medium',
          'bg-[var(--color-rose-clay)] text-[var(--color-foreground-on-rose)]',
          'transition-all duration-200',
          'hover:bg-[var(--color-rose-600)]',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        Continue
      </motion.button>
    </motion.form>
  );
}

export default EnrollmentForm;
