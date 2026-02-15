'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { auraForLifePillars, auraForLifeQualities } from '@/lib/data';
import type { AuraForLifePillar } from '@/lib/data';

import PageHero from '@/components/sections/PageHero';
import InvitationCTA from '@/components/sections/InvitationCTA';

// =============================================================================
// EASE CONSTANT
// =============================================================================

const ease = [0.16, 1, 0.3, 1] as const;

// =============================================================================
// PILLAR CARD
// =============================================================================

function PillarCard({
  pillar,
  index,
  inView,
}: {
  pillar: AuraForLifePillar;
  index: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease }}
      className={cn(
        'rounded-2xl p-6 sm:p-8',
        'bg-gradient-to-b from-rose-50/80 to-[var(--color-background)]',
        'dark:from-rose-950/30 dark:to-[var(--color-background)]',
        'border border-rose-200/50 dark:border-rose-800/20',
        'hover:border-rose-300 dark:hover:border-rose-700/40',
        'hover:shadow-lg hover:shadow-rose-500/5',
        'transition-all duration-500'
      )}
    >
      <h3 className="font-serif text-[clamp(1.15rem,2.5vw,1.5rem)] leading-tight tracking-tight mb-3 text-[var(--color-foreground)]">
        {pillar.title}
      </h3>
      <p className="text-[var(--color-foreground-muted)] leading-relaxed text-sm sm:text-base">
        {pillar.description}
      </p>
    </motion.div>
  );
}

// =============================================================================
// AURA FOR LIFE PAGE
// =============================================================================

export default function AuraForLifePage() {
  const introRef = useRef<HTMLElement>(null);
  const introInView = useInView(introRef, { once: true, margin: '-100px' });

  const whoRef = useRef<HTMLElement>(null);
  const whoInView = useInView(whoRef, { once: true, margin: '-100px' });

  const pillarsRef = useRef<HTMLElement>(null);
  const pillarsInView = useInView(pillarsRef, { once: true, margin: '-100px' });

  const qualitiesRef = useRef<HTMLElement>(null);
  const qualitiesInView = useInView(qualitiesRef, {
    once: true,
    margin: '-100px',
  });

  const ctaRef = useRef<HTMLElement>(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: '-100px' });

  return (
    <>
      {/* 1. Hero */}
      <PageHero
        eyebrow="Continued Practice"
        title="Aura for Life"
        description="For those who have walked the Aura Reading path and choose to keep walking. A living program of continued practice, deepening perception, and community."
      />

      {/* 2. Introduction */}
      <section ref={introRef} className="section-padding">
        <div className="container-premium max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="label-sacred mb-6"
          >
            The Path Continues
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-6"
          >
            Aura Reading Is Not Something You Complete — It Is Something You
            Live
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="text-lg text-[var(--color-foreground-muted)] leading-relaxed space-y-6"
          >
            <p>
              The Aura Reading path opens a door that was always there — a
              direct connection to your intuition, your perception, and the
              living field of energy that moves through all things. Completing
              the foundational levels is a powerful beginning. But the real
              depth reveals itself through continued practice.
            </p>
            <p>
              Aura for Life exists for those who have walked the path and know
              that the journey does not end with a certificate or a final
              class. It is a dedicated space where practitioners continue to
              read, practice, grow, and stay connected to the lineage and
              community that holds this work.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. Who Is This For */}
      <section ref={whoRef} className="section-padding">
        <div className="container-premium max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={whoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="label-sacred mb-6"
          >
            Who Is This For
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={whoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-6"
          >
            For Those on the Path
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={whoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="text-lg text-[var(--color-foreground-muted)] leading-relaxed space-y-6"
          >
            <p>
              Aura for Life is for practitioners who have completed the Aura
              Reading path and want to continue deepening their practice. If
              you have walked through the levels — from the first opening of
              perception in Aura 1, through the focused readings of Aura 2,
              and into the relational field of Aura 3 — this program is your
              next step. Not a new level, but a living continuation.
            </p>
            <p>
              This is for those who understand that perception is not a skill
              you acquire once, but a capacity you cultivate throughout your
              life. The more you practice, the more you see. The more you
              see, the more life reveals itself to you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4. Pillars */}
      <section ref={pillarsRef} className="section-padding">
        <div className="container-premium max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={pillarsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="label-sacred mb-6"
          >
            What You Will Find
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={pillarsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-4"
          >
            The Living Structure
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={pillarsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="text-base text-[var(--color-foreground-muted)] leading-relaxed mb-8"
          >
            Aura for Life is built on four pillars that together create a
            sustained, supportive environment for continued growth.
          </motion.p>
          <div className="space-y-4">
            {auraForLifePillars.map((pillar, i) => (
              <PillarCard
                key={pillar.id}
                pillar={pillar}
                index={i}
                inView={pillarsInView}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Qualities of Continued Practice */}
      <section ref={qualitiesRef} className="section-padding">
        <div className="container-premium max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={qualitiesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="label-sacred mb-6"
          >
            Why Continue
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={qualitiesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-8"
          >
            What Grows Through Practice
          </motion.h2>
          <div className="space-y-4">
            {auraForLifeQualities.map((quality, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={qualitiesInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08, ease }}
                className="flex items-start gap-4"
              >
                <span className="mt-1.5 w-2 h-2 rounded-full bg-[var(--color-rose-clay)] shrink-0" />
                <p className="text-base sm:text-lg text-[var(--color-foreground-muted)] leading-relaxed">
                  {quality}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Join CTA */}
      <section ref={ctaRef} className="section-padding">
        <div className="container-premium max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-4"
          >
            Continue the Path
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="text-base text-[var(--color-foreground-muted)] leading-relaxed mb-8 max-w-xl mx-auto"
          >
            If you have completed the Aura Reading path and feel called to
            continue, reach out to learn more about joining Aura for Life.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/contact"
              className={cn(
                'inline-flex items-center gap-2 px-8 py-3.5 rounded-full',
                'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]',
                'text-sm font-medium',
                'hover:bg-[var(--color-accent-hover)]',
                'transition-all duration-200',
                'shadow-sm hover:shadow-md'
              )}
            >
              Talk With Us
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              href="/programs"
              className={cn(
                'inline-flex items-center gap-2 px-8 py-3.5 rounded-full',
                'border-2 border-[var(--color-rose-clay)] text-[var(--color-rose-clay)]',
                'text-sm font-medium',
                'hover:bg-[var(--color-rose-clay)] hover:text-[var(--color-foreground-on-rose)]',
                'transition-all duration-200',
                'shadow-sm hover:shadow-md'
              )}
            >
              View All Programs
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 7. Invitation CTA */}
      <InvitationCTA />
    </>
  );
}
