'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getManualAuth, setManualAuth } from '@/lib/manuals/pin-auth';
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

  // Check existing auth on mount
  useEffect(() => {
    const stored = getManualAuth();
    if (stored) setRole(stored);
    setIsChecking(false);
  }, []);

  const choose = (chosen: ManualRole) => {
    setManualAuth(chosen);
    setRole(chosen);
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
          <p className="text-sm text-[var(--color-foreground-muted)] mb-8 leading-relaxed">
            Which brings you here today?
          </p>

          {/* Role choice */}
          <div className="w-full flex flex-col gap-3">
            <button
              type="button"
              onClick={() => choose('teacher')}
              className={cn(
                'w-full py-3.5 rounded-xl',
                'text-sm font-medium',
                'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]',
                'hover:bg-[var(--color-accent-hover)]',
                'transition-colors duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rose-clay)] focus-visible:ring-offset-2'
              )}
            >
              For Teachers
            </button>
            <button
              type="button"
              onClick={() => choose('editor')}
              className={cn(
                'w-full py-3.5 rounded-xl',
                'text-sm font-medium',
                'bg-transparent border border-[var(--color-border)]',
                'text-[var(--color-foreground)]',
                'hover:border-[var(--color-rose-clay)] hover:text-[var(--color-rose-clay)]',
                'transition-colors duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rose-clay)] focus-visible:ring-offset-2'
              )}
            >
              For Editors
            </button>
          </div>

          <p className="text-xs text-[var(--color-foreground-faint)] mt-8">
            <Link href="/" className="text-[var(--color-rose-clay)] underline underline-offset-2 hover:text-[var(--color-rose-500)] transition-colors">
              Back to Home
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
