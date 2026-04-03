'use client';

import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getManualAuth, verifyPin } from '@/lib/manuals/pin-auth';
import type { ManualRole } from '@/lib/manuals/types';

// =============================================================================
// MANUAL AUTH CONTEXT
// Provides role info to all children
// =============================================================================

interface ManualAuthContextValue {
  role: ManualRole;
  isEditor: boolean;
}

const ManualAuthContext = createContext<ManualAuthContextValue | null>(null);

export function useManualAuth() {
  const ctx = useContext(ManualAuthContext);
  if (!ctx) throw new Error('useManualAuth must be used within ManualPinGate');
  return ctx;
}

// =============================================================================
// PIN GATE COMPONENT
// =============================================================================

export default function ManualPinGate({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<ManualRole | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check existing auth on mount
  useEffect(() => {
    const stored = getManualAuth();
    if (stored) setRole(stored);
    setIsChecking(false);
  }, []);

  const handleSubmit = useCallback(
    async (submittedPin: string) => {
      if (isVerifying) return;
      setIsVerifying(true);

      const result = await verifyPin(submittedPin);

      if (result.success && result.role) {
        setRole(result.role);
        setError(false);
      } else {
        setError(true);
        setShake(true);
        setPin('');
        inputRef.current?.focus();
        setTimeout(() => setShake(false), 600);
      }

      setIsVerifying(false);
    },
    [isVerifying]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(value);
    setError(false);

    if (value.length === 4) {
      setTimeout(() => handleSubmit(value), 150);
    }
  };

  // Still checking stored auth
  if (isChecking) return null;

  // Authenticated — render children with role context
  if (role) {
    return (
      <ManualAuthContext.Provider value={{ role, isEditor: role === 'editor' }}>
        {children}
      </ManualAuthContext.Provider>
    );
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[var(--color-rose-clay)]">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
                fill="currentColor"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="font-serif text-2xl font-semibold text-[var(--color-foreground)] mb-2">
            Teaching Manuals
          </h2>
          <p className="text-sm text-[var(--color-foreground-muted)] mb-2 leading-relaxed">
            Enter your 4-digit PIN to access the manuals.
          </p>
          <p className="text-xs text-[var(--color-foreground-faint)] mb-8">
            <Link href="/" className="text-[var(--color-rose-clay)] underline underline-offset-2 hover:text-[var(--color-rose-500)] transition-colors">
              Back to Home
            </Link>
          </p>

          {/* PIN input */}
          <form onSubmit={(e) => { e.preventDefault(); if (pin.length === 4) handleSubmit(pin); }} className="w-full">
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
                disabled={isVerifying}
                className={cn(
                  'w-full text-center',
                  'text-3xl font-serif tracking-[0.4em] font-semibold',
                  'bg-transparent',
                  'border-b-2 pb-3',
                  'outline-none',
                  'transition-colors duration-200',
                  'placeholder:text-[var(--color-foreground-faint)]/40',
                  'text-[var(--color-foreground)]',
                  isVerifying && 'opacity-50',
                  error
                    ? 'border-[var(--color-error)]'
                    : 'border-[var(--color-border)] focus:border-[var(--color-rose-clay)]'
                )}
              />
            </motion.div>

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
                  Incorrect PIN. Please try again.
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isVerifying || pin.length < 4}
              className={cn(
                'mt-8 w-full py-3 rounded-xl',
                'text-sm font-medium',
                'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]',
                'hover:bg-[var(--color-accent-hover)]',
                'transition-colors duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rose-clay)] focus-visible:ring-offset-2'
              )}
            >
              {isVerifying ? 'Verifying...' : 'Enter'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
