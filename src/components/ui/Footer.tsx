'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

// =============================================================================
// DATA
// =============================================================================

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'The Rose', href: '/the-rose' },
  { label: 'Programs', href: '/programs' },
  { label: 'Guardians', href: '/guardians' },
  { label: 'Community', href: '/community' },
  { label: 'Contact', href: '/contact' },
];

// =============================================================================
// FOOTER COMPONENT
// =============================================================================

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: '-50px' });

  return (
    <footer
      ref={footerRef}
      className="relative bg-[var(--color-section-dark)] dark:bg-warm-50 text-warm-300 dark:text-warm-600 overflow-hidden transition-colors duration-200"
    >
      <div className="container-premium py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-warm-800 dark:border-warm-200"
        >
          {/* Nav links — single row */}
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] sm:text-xs text-warm-500 dark:text-warm-400 hover:text-warm-300 dark:hover:text-warm-700 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {/* Credit */}
          <p className="text-[10px] sm:text-[11px] text-warm-500 dark:text-warm-400 tracking-wide shrink-0">
            &copy; {currentYear} ROSES OS · Designed &amp; developed by LIGHT BRANDS
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

export function FooterMinimal() {
  return (
    <footer className="py-8 border-t border-[var(--color-border-subtle)]">
      <div className="container-premium flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[var(--color-foreground-muted)]">
          &copy; {new Date().getFullYear()} ROSES OS
        </p>
      </div>
    </footer>
  );
}
