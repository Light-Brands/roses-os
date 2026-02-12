'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// =============================================================================
// PASSWORD GATE
// Client-side PIN gate for teaching content. Password: 4444.
// Stores auth in sessionStorage under 'roses-teaching-auth'.
// =============================================================================

const CORRECT_PIN = '4444';
const STORAGE_KEY = 'roses-teaching-auth';

interface PasswordGateProps {
  children: React.ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      setIsAuthed(stored === 'true');
    } catch {
      setIsAuthed(false);
    }
  }, []);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (pin === CORRECT_PIN) {
        try {
          sessionStorage.setItem(STORAGE_KEY, 'true');
        } catch {
          // Proceed even if sessionStorage fails
        }
        setIsAuthed(true);
        setError(false);
      } else {
        setError(true);
        setShake(true);
        setPin('');
        inputRef.current?.focus();
        setTimeout(() => setShake(false), 600);
      }
    },
    [pin]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(value);
    setError(false);

    // Auto-submit when 4 digits entered
    if (value.length === 4) {
      // Delay slightly so the user sees the last digit
      setTimeout(() => {
        if (value === CORRECT_PIN) {
          try {
            sessionStorage.setItem(STORAGE_KEY, 'true');
          } catch {
            // Proceed even if sessionStorage fails
          }
          setIsAuthed(true);
          setError(false);
        } else {
          setError(true);
          setShake(true);
          setPin('');
          inputRef.current?.focus();
          setTimeout(() => setShake(false), 600);
        }
      }, 150);
    }
  };

  // Still loading
  if (isAuthed === null) {
    return null;
  }

  // Authenticated - show children
  if (isAuthed) {
    return <>{children}</>;
  }

  // Gate overlay
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed inset-0 z-[var(--z-modal)]',
          'flex items-center justify-center',
          'bg-[var(--color-rose-50)] dark:bg-[var(--color-rose-950)]'
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center px-6 max-w-sm w-full"
        >
          {/* Rose emblem */}
          <div
            className={cn(
              'w-16 h-16 rounded-full mb-8',
              'bg-[var(--color-rose-clay)]/10',
              'border border-[var(--color-rose-clay)]/20',
              'flex items-center justify-center'
            )}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[var(--color-rose-clay)]"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
                fill="currentColor"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="font-serif text-2xl font-semibold text-[var(--color-foreground)] mb-2">
            Sacred Teachings
          </h2>
          <p className="text-sm text-[var(--color-foreground-muted)] mb-8 leading-relaxed">
            Enter your 4-digit access code to continue.
          </p>

          {/* PIN input */}
          <form onSubmit={handleSubmit} className="w-full">
            <motion.div
              animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={pin}
                onChange={handleChange}
                autoFocus
                placeholder="----"
                aria-label="Access code"
                className={cn(
                  'w-full text-center',
                  'text-3xl font-serif tracking-[0.4em] font-semibold',
                  'bg-transparent',
                  'border-b-2 pb-3',
                  'outline-none',
                  'transition-colors duration-200',
                  'placeholder:text-[var(--color-foreground-faint)]/40',
                  'text-[var(--color-foreground)]',
                  error
                    ? 'border-[var(--color-error)]'
                    : 'border-[var(--color-border)] focus:border-[var(--color-rose-clay)]'
                )}
              />
            </motion.div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 text-sm text-[var(--color-error)]"
                  role="alert"
                >
                  Incorrect code. Please try again.
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit button (for non-auto-submit / accessibility) */}
            <button
              type="submit"
              className={cn(
                'mt-8 w-full py-3 rounded-xl',
                'text-sm font-medium',
                'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]',
                'hover:bg-[var(--color-accent-hover)]',
                'transition-colors duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rose-clay)] focus-visible:ring-offset-2'
              )}
            >
              Enter
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
