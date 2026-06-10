'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import { navItems } from '@/lib/data';

// =============================================================================
// DATA
// =============================================================================

const navLinks = [
  { label: 'Home', href: '/' },
  ...navItems,
];

// =============================================================================
// FOOTER COMPONENT
// =============================================================================

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: '-50px' });

  return (
    <footer
      ref={footerRef}
      className="relative bg-[var(--color-section-dark)] dark:bg-warm-50 text-warm-300 dark:text-warm-600 overflow-hidden transition-colors duration-200"
    >
      <div className="container-premium py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main footer grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-10 border-b border-warm-800 dark:border-warm-200">
            {/* Col 1: Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="font-serif text-xl text-white dark:text-warm-900 mb-3">International Aura and Dream School</p>
              <p className="text-sm text-warm-500 dark:text-warm-400 leading-relaxed max-w-xs">
                A living operating system for spiritual development. Rose Meditation, Aura Reading, and the journey to coherent living.
              </p>
              {/* Trust signals */}
              <div className="flex items-center gap-6 mt-6">
                <div>
                  <p className="font-serif text-lg text-white dark:text-warm-900">30+</p>
                  <p className="text-[10px] uppercase tracking-wider text-warm-600 dark:text-warm-400">Years</p>
                </div>
                <div>
                  <p className="font-serif text-lg text-white dark:text-warm-900">5,000+</p>
                  <p className="text-[10px] uppercase tracking-wider text-warm-600 dark:text-warm-400">Initiates</p>
                </div>
                <div>
                  <p className="font-serif text-lg text-white dark:text-warm-900">50+</p>
                  <p className="text-[10px] uppercase tracking-wider text-warm-600 dark:text-warm-400">Countries</p>
                </div>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-warm-500 dark:text-warm-400 mb-4">Navigate</p>
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    aria-current={pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)) ? 'page' : undefined}
                    className="text-sm text-warm-400 dark:text-warm-500 hover:text-warm-200 dark:hover:text-warm-700 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Col 3: Contact */}
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-warm-500 dark:text-warm-400 mb-4">Contact</p>
              <div className="flex flex-col gap-3">
                <a
                  href="https://wa.me/5511996330135"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-warm-400 dark:text-warm-500 hover:text-warm-200 dark:hover:text-warm-700 transition-colors duration-200"
                >
                  WhatsApp
                </a>
                <a
                  href="mailto:dani.ayoub88@gmail.com"
                  className="text-sm text-warm-400 dark:text-warm-500 hover:text-warm-200 dark:hover:text-warm-700 transition-colors duration-200"
                >
                  dani.ayoub88@gmail.com
                </a>
                <Link
                  href="/enroll"
                  className="text-sm text-rose-400 hover:text-rose-300 transition-colors duration-200"
                >
                  Start Enrollment →
                </Link>
              </div>
            </div>

            {/* Col 4: Social (placeholders) */}
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-warm-500 dark:text-warm-400 mb-4">Follow</p>
              <div className="flex flex-col gap-3">
                <span className="text-sm text-warm-600 dark:text-warm-300 italic">Coming soon</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6">
            <p className="text-[10px] sm:text-[11px] text-warm-500 dark:text-warm-400 tracking-wide">
              &copy; {currentYear} International Aura and Dream School
            </p>
            <p className="text-[10px] sm:text-[11px] text-warm-600 dark:text-warm-300 tracking-wide">
              Designed &amp; developed by LIGHT BRANDS
            </p>
          </div>
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
          &copy; {new Date().getFullYear()} International Aura and Dream School
        </p>
      </div>
    </footer>
  );
}
