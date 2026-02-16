'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { agreements } from '@/lib/data';

export default function EnrollPage() {
  const contentRef = useRef<HTMLElement>(null);
  const contentInView = useInView(contentRef, { once: true, margin: '-100px' });

  const agreementsRef = useRef<HTMLElement>(null);
  const agreementsInView = useInView(agreementsRef, { once: true, margin: '-100px' });

  return (
    <div className="space-y-12">
      {/* 1. Hero with Image */}
      <div className="space-y-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-foreground-faint)] mb-4">
            Enrollment
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-foreground)]">
            Begin Your Enrollment
          </h1>
          <p className="mt-4 text-[var(--color-foreground-muted)] max-w-md mx-auto">
            Welcome to ROSES OS. To begin the enrollment process, reach out to{' '}
            <span className="font-medium text-[var(--color-foreground)]">Dara</span>,
            our Guardian of Community &amp; Programs.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center pointer-events-none"
        >
          <Image
            src="/page-images/page-enroll.png"
            alt=""
            width={448}
            height={448}
            className="max-w-xs md:max-w-sm w-full h-auto"
            priority={false}
          />
        </motion.div>
      </div>

      {/* 2. Reach Out Directly */}
      <section ref={contentRef}>
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
          </div>
        </motion.div>
      </section>

      {/* 3. Agreements */}
      <section ref={agreementsRef} className="rounded-lg bg-[var(--color-background-subtle)] p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={agreementsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="label-sacred mb-3 text-center">Agreements</p>
          <h2 className="font-serif text-2xl tracking-tight mb-8 text-center">
            Our Shared Agreements
          </h2>

          <div className="space-y-6">
            {agreements.map((agreement, i) => (
              <motion.div
                key={agreement.id}
                initial={{ opacity: 0, y: 16 }}
                animate={agreementsInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <h3 className="font-serif text-lg tracking-tight mb-1">
                  {agreement.title}
                </h3>
                <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                  {agreement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
