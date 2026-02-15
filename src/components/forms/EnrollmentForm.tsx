'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { programs } from '@/lib/data';

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

export function EnrollmentForm({ onSubmit, className }: EnrollmentFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(programs[0].id);

  const isValid = name.trim() !== '' && email.trim() !== '';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({ name: name.trim(), email: email.trim(), program: selectedProgram });
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

      {/* Program Selection */}
      <fieldset className="space-y-3">
        <legend className="block text-sm font-medium text-[var(--color-foreground-subtle)]">
          Program
        </legend>
        {programs.map((program) => {
          const isSelected = selectedProgram === program.id;
          return (
            <button
              key={program.id}
              type="button"
              onClick={() => setSelectedProgram(program.id)}
              className={cn(
                'w-full rounded-xl border p-4 text-left transition-all duration-200',
                isSelected
                  ? 'border-[var(--color-rose-clay)] bg-[var(--color-rose-50)] shadow-[var(--shadow-rose)]'
                  : 'border-[var(--color-border)] bg-[var(--color-background-elevated)] hover:border-[var(--color-rose-clay)]/50'
              )}
            >
              <span className="block font-medium text-[var(--color-foreground)]">
                {program.title}
              </span>
              <span className="text-sm text-[var(--color-foreground-muted)]">
                {program.subtitle} — {program.duration} · {program.dates}
              </span>
            </button>
          );
        })}
      </fieldset>

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
