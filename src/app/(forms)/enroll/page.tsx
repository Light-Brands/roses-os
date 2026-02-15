'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function EnrollPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-foreground)]">
          Begin Your Enrollment
        </h1>
        <p className="text-[var(--color-foreground-muted)] max-w-md mx-auto">
          Welcome to ROSES OS. To begin the enrollment process, reach out to{' '}
          <span className="font-medium text-[var(--color-foreground)]">Dara</span>,
          our Guardian of Community &amp; Programs.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-8 max-w-md mx-auto"
      >
        {/* WhatsApp */}
        <div className="text-center">
          <p className="label-sacred mb-2">WhatsApp</p>
          <a
            href="https://wa.me/5511996330135"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-2 text-[var(--color-foreground)]',
              'underline underline-offset-4 decoration-[var(--color-rose-clay)]',
              'hover:text-[var(--color-rose-clay)] transition-colors duration-200'
            )}
          >
            Message Dara on WhatsApp
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        {/* Email */}
        <div className="text-center">
          <p className="label-sacred mb-2">Email</p>
          <a
            href="mailto:dani.ayoub88@gmail.com?subject=ROSES%20OS%20Enrollment"
            className={cn(
              'inline-flex items-center gap-2 text-[var(--color-foreground)]',
              'underline underline-offset-4 decoration-[var(--color-rose-clay)]',
              'hover:text-[var(--color-rose-clay)] transition-colors duration-200'
            )}
          >
            dani.ayoub88@gmail.com
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
