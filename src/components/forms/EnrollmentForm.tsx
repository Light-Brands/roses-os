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
  /** Program ID passed from the offerings page via query param */
  selectedProgramId?: string;
  className?: string;
}

const inputStyles = cn(
  'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background-elevated)]',
  'px-4 py-3 text-[var(--color-foreground)]',
  'placeholder:text-[var(--color-foreground-faint)]',
  'focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-clay)]',
  'transition-all duration-200'
);

export function EnrollmentForm({ onSubmit, selectedProgramId, className }: EnrollmentFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [programId, setProgramId] = useState(selectedProgramId || programs[0]?.id || '');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const selectedProgram = programs.find((p) => p.id === programId);
  const isValid = name.trim() !== '' && email.trim() !== '' && !!selectedProgram;

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const errors = {
    name: touched.name && name.trim() === '' ? 'Please enter your full name.' : '',
    email: touched.email && email.trim() === ''
      ? 'Please enter your email address.'
      : touched.email && !emailValid
        ? 'Please enter a valid email address.'
        : '',
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true });
    if (!isValid || !selectedProgram || !emailValid) return;
    onSubmit({ name: name.trim(), email: email.trim(), program: selectedProgram.id });
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
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          aria-invalid={!!errors.name || undefined}
          aria-describedby={errors.name ? 'enrollment-name-error' : undefined}
          className={cn(inputStyles, errors.name && 'border-[var(--color-rose-600)]')}
        />
        {errors.name && (
          <p id="enrollment-name-error" className="text-xs text-[var(--color-rose-600)]" role="alert">
            {errors.name}
          </p>
        )}
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
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          aria-invalid={!!errors.email || undefined}
          aria-describedby={errors.email ? 'enrollment-email-error' : undefined}
          className={cn(inputStyles, errors.email && 'border-[var(--color-rose-600)]')}
        />
        {errors.email && (
          <p id="enrollment-email-error" className="text-xs text-[var(--color-rose-600)]" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Program selection */}
      <div className="space-y-2">
        <span className="block text-sm font-medium text-[var(--color-foreground-subtle)]">
          Program
        </span>
        <div className="space-y-2">
          {programs.map((p) => {
            const isActive = programId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setProgramId(p.id)}
                className={cn(
                  'w-full text-left rounded-xl border p-4 transition-all duration-200',
                  isActive
                    ? 'border-[var(--color-rose-clay)] bg-[var(--color-rose-50)] shadow-[var(--shadow-rose)]'
                    : 'border-[var(--color-border)] bg-[var(--color-background-elevated)] hover:border-[var(--color-border-strong)]'
                )}
              >
                <span className="block font-medium text-[var(--color-foreground)]">
                  {p.title}
                </span>
                <span className="text-sm text-[var(--color-foreground-muted)]">
                  {p.subtitle} &mdash; {p.duration}
                </span>
              </button>
            );
          })}
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
