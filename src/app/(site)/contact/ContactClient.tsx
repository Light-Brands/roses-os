'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

import PageHero from '@/components/sections/PageHero';

// =============================================================================
// CONTACT PAGE
// =============================================================================

export default function ContactClient() {
  const contentRef = useRef<HTMLElement>(null);
  const contentInView = useInView(contentRef, { once: true, margin: '-100px' });

  return (
    <>
      {/* 1. Hero */}
      <PageHero
        eyebrow="General Inquiries"
        title="Get in Touch"
        description="Have questions about our programs, partnerships, or anything else? We are here to help. For enrollment, visit our enrollment page."
        image="/page-images/page-contact.png"
      />

      {/* 2. Reach Out Directly */}
      <section ref={contentRef} className="section-padding">
        <div className="container-premium">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-serif text-2xl tracking-tight mb-8 text-center">
                Reach Out Directly
              </h2>

              <div className="space-y-8">
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
                    href="mailto:dani.ayoub88@gmail.com?subject=ROSES%20OS%20Inquiry"
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
              </div>

              {/* Enrollment link */}
              <div className="mt-12 pt-8 border-t border-[var(--color-border-subtle)] text-center">
                <p className="text-sm text-[var(--color-foreground-muted)] mb-3">
                  Looking to enroll in a program?
                </p>
                <Link
                  href="/enroll"
                  className={cn(
                    'inline-flex items-center gap-2 px-6 py-3 rounded-full',
                    'bg-[var(--color-rose-500)] text-white',
                    'text-sm font-medium',
                    'hover:bg-[var(--color-rose-600)]',
                    'transition-colors duration-200'
                  )}
                >
                  Start Enrollment
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </>
  );
}
