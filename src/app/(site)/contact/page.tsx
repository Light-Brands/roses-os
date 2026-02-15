'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

import PageHero from '@/components/sections/PageHero';

// =============================================================================
// CONTACT PAGE
// =============================================================================

export default function ContactPage() {
  const contentRef = useRef<HTMLElement>(null);
  const contentInView = useInView(contentRef, { once: true, margin: '-100px' });

  return (
    <>
      {/* 1. Hero */}
      <PageHero
        eyebrow="Contact"
        title="Reach Out"
        description="We welcome your questions and inquiries. Whether you are exploring the programs, seeking clarity on the path, or simply feel called to connect, we are here."
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
                    href="https://wa.me/"
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
            </motion.div>
          </div>
        </div>
      </section>

    </>
  );
}
