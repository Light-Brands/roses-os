'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { agreements } from '@/lib/data';
import { FormStepper } from '@/components/forms/FormStepper';

const ease = [0.16, 1, 0.3, 1] as const;

export default function EnrollPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, submitted]);

  const agreementsRef = useRef<HTMLElement>(null);
  const agreementsInView = useInView(agreementsRef, { once: true, margin: '-100px' });

  if (submitted) {
    return (
      <div className="space-y-8 text-center py-12">
        <div className="space-y-3">
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-foreground)]">
            Thank You for Reaching Out
          </h1>
          <p className="text-[var(--color-foreground-muted)] max-w-md mx-auto">
            Thank you for reaching out. We are honored by your interest in
            the International Aura and Dream School community. We will be in touch with you shortly.
          </p>
        </div>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-full bg-[var(--color-foreground)] text-[var(--color-background)] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <FormStepper
        steps={['Agreements', 'Contact Dara']}
        currentStep={currentStep}
      />

      {/* ================================================================
          STEP 1: Agreements
          ================================================================ */}
      {currentStep === 1 && (
        <div className="space-y-12">
          {/* Hero */}
          <div className="space-y-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-foreground-faint)] mb-4">
                Step 1
              </p>
              <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-foreground)]">
                Our Shared Agreements
              </h1>
              <p className="mt-4 text-[var(--color-foreground-muted)] max-w-md mx-auto">
                Before joining, please review the agreements that guide our community.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
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

          {/* Agreements List */}
          <section ref={agreementsRef} className="rounded-lg bg-[var(--color-background-subtle)] p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={agreementsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease }}
            >
              <div className="space-y-6">
                {agreements.map((agreement, i) => (
                  <motion.div
                    key={agreement.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={agreementsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 + i * 0.08,
                      ease,
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

          {/* Next Step */}
          <div className="text-center">
            <button
              onClick={() => setCurrentStep(2)}
              className={cn(
                'px-8 py-3.5 rounded-full',
                'bg-[var(--color-rose-500)] text-white',
                'text-sm font-medium',
                'hover:bg-[var(--color-rose-600)]',
                'transition-colors duration-200'
              )}
            >
              I Agree — Continue
            </button>
          </div>
        </div>
      )}

      {/* ================================================================
          STEP 2: Contact Dara
          ================================================================ */}
      {currentStep === 2 && (
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-center space-y-3"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-foreground-faint)]">
              Step 2
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-foreground)]">
              Connect with Dara
            </h1>
            <p className="text-[var(--color-foreground-muted)] max-w-md mx-auto">
              Reach out to{' '}
              <span className="font-medium text-[var(--color-foreground)]">Dara</span>,
              our Guardian of Community &amp; Programs, to discuss your enrollment
              and find the right program for you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="space-y-8"
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

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setCurrentStep(1)}
              className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors"
            >
              &larr; Back to Agreements
            </button>
            <button
              onClick={() => setSubmitted(true)}
              className={cn(
                'px-8 py-3.5 rounded-full',
                'bg-[var(--color-rose-500)] text-white',
                'text-sm font-medium',
                'hover:bg-[var(--color-rose-600)]',
                'transition-colors duration-200'
              )}
            >
              Complete Enrollment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
