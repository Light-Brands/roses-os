'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  programs,
  scheduleStages,
  contributionTiers,
  agreements,
} from '@/lib/data';

import { Navigation } from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import PageHero from '@/components/sections/PageHero';
import ProgramCard from '@/components/sections/ProgramCard';
import ScheduleTable from '@/components/sections/ScheduleTable';
import ContributionTiers from '@/components/sections/ContributionTiers';

// =============================================================================
// SHARED EASE
// =============================================================================

const ease = [0.16, 1, 0.3, 1] as const;

// =============================================================================
// SECTION: Programs Detail
// =============================================================================

function ProgramsDetail() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding">
      <div className="container-premium">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="label-sacred mb-4"
        >
          Programs
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-10"
        >
          What we offer
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: Schedule
// =============================================================================

function ScheduleSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-[var(--color-background-subtle)]">
      <div className="container-premium">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="label-sacred mb-4"
        >
          Schedule
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-10"
        >
          Program timeline
        </motion.h2>
        <div className="max-w-4xl">
          <ScheduleTable stages={scheduleStages} />
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: Contribution Model
// =============================================================================

function ContributionSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding">
      <div className="container-premium">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="label-sacred mb-4"
        >
          Contribution Model
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-4"
        >
          Income-based pricing
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          className="text-base text-[var(--color-foreground-muted)] leading-relaxed max-w-2xl mb-10"
        >
          We believe that access to this work should not be limited by financial
          circumstance. Our contribution model is based on trust and
          self-assessment. Choose the tier that reflects your current season of
          life.
        </motion.p>
        <div className="max-w-4xl">
          <ContributionTiers tiers={contributionTiers} />
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: Agreements
// =============================================================================

function AgreementsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-[var(--color-background-subtle)]">
      <div className="container-premium">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="label-sacred mb-4"
        >
          Our Agreements
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-10"
        >
          Five sacred agreements
        </motion.h2>
        <div className="max-w-3xl space-y-6">
          {agreements.map((agreement, i) => (
            <motion.div
              key={agreement.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease }}
              className={cn(
                'flex gap-5',
                'py-5',
                'border-b border-[var(--color-border-subtle)]',
                'last:border-b-0'
              )}
            >
              <span
                className={cn(
                  'flex-shrink-0 flex items-center justify-center',
                  'w-8 h-8 rounded-full',
                  'bg-[#9E956B]/10 text-[#9E956B]',
                  'font-serif font-semibold text-sm',
                  'border border-[#9E956B]/20'
                )}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-semibold text-base text-[var(--color-foreground)] leading-snug mb-1">
                  {agreement.title}
                </h3>
                <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                  {agreement.description}
                </p>
              </div>
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
    <section ref={ref} className="section-padding bg-rose-950 text-white">
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
          >
            <Link
              href="/enroll"
              className={cn(
                'inline-flex items-center px-8 py-3.5 rounded-full',
                'bg-warm-50 text-rose-950',
                'text-sm font-medium',
                'hover:bg-warm-100',
                'transition-colors duration-200'
              )}
            >
              Enroll Now
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
          description="A detailed look at the ROSES OS programs, schedule, contribution model, and the sacred agreements that hold our container. Take your time. Read what calls to you."
        />

        {/* 2. Detailed program information */}
        <ProgramsDetail />

        {/* 3. Schedule overview */}
        <ScheduleSection />

        {/* 4. Contribution model */}
        <ContributionSection />

        {/* 5. Agreements preview */}
        <AgreementsSection />

        {/* 6. CTA */}
        <ReadyCTA />

        {/* 7. Back link */}
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
