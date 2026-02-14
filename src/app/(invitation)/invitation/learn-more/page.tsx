'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

import { Navigation } from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import PageHero from '@/components/sections/PageHero';

// =============================================================================
// SHARED EASE
// =============================================================================

const ease = [0.16, 1, 0.3, 1] as const;

// =============================================================================
// SECTION: Overview
// =============================================================================

function OverviewSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding">
      <div className="container-premium max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-6"
        >
          How It Works
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          className="text-lg text-[var(--color-foreground-muted)] leading-relaxed space-y-6"
        >
          <p>
            ROSES OS offers guided programs in Rose Meditation and Aura Reading.
            Each program is held live, online, and designed to meet you exactly
            where you are. No prior experience is needed.
          </p>
          <p>
            We use an income-based contribution model so that financial
            circumstances never stand between you and this work. You choose the
            tier that reflects your current season of life.
          </p>
          <p>
            Before enrolling, you will be asked to accept five sacred agreements
            that hold the integrity of our container: Commitment to Practice,
            Confidentiality, Respect for the Lineage, Personal Responsibility,
            and Community Care.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          className="mt-10"
        >
          <Link
            href="/programs"
            className={cn(
              'inline-flex items-center gap-2',
              'text-sm font-medium',
              'text-[var(--color-foreground)]',
              'underline underline-offset-4 decoration-[var(--color-rose-clay)]',
              'hover:text-[var(--color-foreground-muted)]',
              'transition-colors duration-200'
            )}
          >
            View programs, schedule & contribution details
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: What to Expect
// =============================================================================

function WhatToExpect() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    {
      number: '01',
      title: 'Explore',
      description: 'Read about the programs and find the offering that resonates with where you are.',
    },
    {
      number: '02',
      title: 'Enroll',
      description: 'Complete a brief enrollment form and select your contribution tier.',
    },
    {
      number: '03',
      title: 'Prepare',
      description: 'Accept the five sacred agreements and receive your welcome materials.',
    },
    {
      number: '04',
      title: 'Begin',
      description: 'Join live sessions with the guardians and fellow practitioners.',
    },
  ];

  return (
    <section ref={ref} className="section-padding bg-[var(--color-background-subtle)]">
      <div className="container-premium">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="label-sacred mb-4 text-center"
        >
          Your Journey
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-12 text-center"
        >
          What to expect
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease }}
              className={cn(
                'rounded-xl p-6',
                'bg-[var(--color-background-elevated)]',
                'border border-[var(--color-border-subtle)]'
              )}
            >
              <span className="block font-serif text-2xl text-[#9E956B]/50 mb-3">
                {step.number}
              </span>
              <h3 className="font-serif font-semibold text-base text-[var(--color-foreground)] mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: CTA
// =============================================================================

function ReadyCTA() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-[var(--color-section-dark)] text-white">
      <div className="container-premium">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
            className="font-serif text-[clamp(2rem,5vw,3.5rem)] tracking-tight leading-tight mb-10"
          >
            Ready to begin?
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/enroll"
              className={cn(
                'inline-flex items-center px-8 py-3.5 rounded-full',
                'bg-warm-50 text-[var(--color-section-dark)]',
                'text-sm font-medium',
                'hover:bg-warm-100',
                'transition-colors duration-200'
              )}
            >
              Enroll Now
            </Link>
            <Link
              href="/programs"
              className={cn(
                'px-8 py-3.5 rounded-full',
                'border-2 border-white/30 text-white',
                'text-sm font-medium',
                'hover:border-white/60 hover:bg-white/5',
                'transition-all duration-200'
              )}
            >
              View Programs
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// LEARN MORE PAGE
// =============================================================================

export default function LearnMorePage() {
  return (
    <>
      <Navigation transparent />

      <main>
        {/* 1. Hero */}
        <PageHero
          title="Everything You Need to Know"
          description="A clear overview of how ROSES OS works, what to expect, and how to get started."
        />

        {/* 2. How it works overview */}
        <OverviewSection />

        {/* 3. What to expect steps */}
        <WhatToExpect />

        {/* 4. CTA */}
        <ReadyCTA />

        {/* 5. Back link */}
        <section className="py-10">
          <div className="container-premium">
            <Link
              href="/invitation"
              className={cn(
                'inline-flex items-center gap-2',
                'text-sm font-medium',
                'text-[var(--color-foreground-muted)]',
                'hover:text-[var(--color-foreground)]',
                'transition-colors duration-200'
              )}
            >
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
                  d="M19 12H5m0 0l7-7m-7 7l7 7"
                />
              </svg>
              Back to Invitation
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
