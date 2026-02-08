'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

// =============================================================================
// DATA
// =============================================================================

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com', external: true },
  { label: 'WhatsApp', href: 'https://wa.me/', external: true },
  { label: 'Instagram', href: 'https://instagram.com', external: true },
  { label: 'Email', href: 'mailto:hello@digitalcultures.co', external: false },
];

// =============================================================================
// LIVE CLOCK — Paphos, Cyprus (EET/EEST)
// =============================================================================

function usePaphosTime() {
  const [time, setTime] = useState('');

  useEffect(() => {
    function update() {
      const now = new Date();
      const formatted = now.toLocaleTimeString('en-GB', {
        timeZone: 'Europe/Nicosia',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setTime(formatted);
    }
    update();
    const interval = setInterval(update, 10_000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

// =============================================================================
// FOOTER COMPONENT
// =============================================================================

export default function Footer() {
  const time = usePaphosTime();
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: '-100px' });

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: isInView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <footer
      ref={footerRef}
      className="relative bg-neutral-950 dark:bg-white text-neutral-300 dark:text-neutral-600 overflow-hidden transition-colors duration-200"
    >
      {/* ─── TOP SECTION ─── */}
      <div className="container-premium pt-14 sm:pt-20 md:pt-32 lg:pt-40">
        {/* Upper row: link columns + contact pills */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-10 lg:gap-12">
          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-8 sm:gap-x-16 md:gap-x-20">
            {/* Links */}
            <motion.div {...fadeUp(0)}>
              <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 mb-4 sm:mb-5">
                Links
              </h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 dark:text-neutral-500 hover:text-white dark:hover:text-neutral-900 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Socials */}
            <motion.div {...fadeUp(0.06)}>
              <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 mb-4 sm:mb-5">
                Socials
              </h4>
              <ul className="space-y-3">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-sm text-neutral-400 dark:text-neutral-500 hover:text-white dark:hover:text-neutral-900 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Local Time */}
            <motion.div {...fadeUp(0.12)}>
              <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 mb-4 sm:mb-5">
                Local Time
              </h4>
              <p className="text-sm text-neutral-300 dark:text-neutral-700">
                {time || '--:--'} <span className="text-neutral-500 dark:text-neutral-400">EET</span>
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Paphos, Cyprus</p>
            </motion.div>

            {/* Version / Info */}
            <motion.div {...fadeUp(0.18)}>
              <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 mb-4 sm:mb-5">
                Version
              </h4>
              <p className="text-sm text-neutral-300 dark:text-neutral-700">
                {currentYear} &copy; Edition
              </p>
            </motion.div>
          </div>

          {/* Contact pills */}
          <motion.div
            {...fadeUp(0.15)}
            className="flex flex-col sm:flex-row flex-wrap items-start gap-3"
          >
            <a
              href="tel:+35799123456"
              className={cn(
                'inline-flex items-center gap-2 px-5 py-2.5 rounded-full w-full sm:w-auto justify-center sm:justify-start',
                'border border-neutral-700 dark:border-neutral-300 hover:border-neutral-500 dark:hover:border-neutral-500',
                'text-sm text-neutral-300 dark:text-neutral-600 hover:text-white dark:hover:text-neutral-900',
                'transition-all duration-200'
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              +357 99 123 456
            </a>
            <a
              href="mailto:hello@digitalcultures.co"
              className={cn(
                'inline-flex items-center px-5 py-2.5 rounded-full w-full sm:w-auto justify-center sm:justify-start',
                'border border-neutral-700 dark:border-neutral-300 hover:border-neutral-500 dark:hover:border-neutral-500',
                'text-sm text-neutral-300 dark:text-neutral-600 hover:text-white dark:hover:text-neutral-900',
                'transition-all duration-200'
              )}
            >
              hello@digitalcultures.co
            </a>
          </motion.div>
        </div>
      </div>

      {/* ─── LOGO + BOTTOM BAR ─── */}
      <div className="container-premium mt-16 sm:mt-24 md:mt-40 lg:mt-52 pb-10 sm:pb-16 md:pb-20">
        {/* Logo — centered */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-10 md:mb-16"
        >
          <Image
            src="/dc-logo.svg"
            alt="Digital Cultures"
            width={36}
            height={36}
            className="transition-all duration-200"
            style={{
              filter: 'brightness(0) saturate(100%) invert(53%) sepia(18%) saturate(1400%) hue-rotate(210deg) brightness(88%) contrast(90%)',
            }}
          />
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col items-center gap-4 pt-6 border-t border-neutral-800 dark:border-neutral-200"
        >
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 tracking-wide">
            &copy; {currentYear} Digital Cultures. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link
              href="/privacy"
              className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-300 dark:hover:text-neutral-700 transition-colors duration-200 tracking-wide"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-300 dark:hover:text-neutral-700 transition-colors duration-200 tracking-wide"
            >
              Terms of Service
            </Link>
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 tracking-wide">
            Designed &amp; developed by{' '}
            <a
              href="https://oraclestudios.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-300 dark:hover:text-neutral-700 transition-colors duration-200"
            >
              Oracle Studios
            </a>
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
