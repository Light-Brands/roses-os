'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { programs, scheduleStages, contributionTiers } from '@/lib/data';

import PageHero from '@/components/sections/PageHero';
import ProgramCard from '@/components/sections/ProgramCard';
import ScheduleTable from '@/components/sections/ScheduleTable';
import ContributionTiers from '@/components/sections/ContributionTiers';
import InvitationCTA from '@/components/sections/InvitationCTA';

// =============================================================================
// PROGRAMS PAGE
// =============================================================================

export default function ProgramsPage() {
  const gridRef = useRef<HTMLElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-100px' });

  const scheduleRef = useRef<HTMLElement>(null);
  const scheduleInView = useInView(scheduleRef, { once: true, margin: '-100px' });

  const contributionRef = useRef<HTMLElement>(null);
  const contributionInView = useInView(contributionRef, { once: true, margin: '-100px' });

  const ctaRef = useRef<HTMLElement>(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: '-100px' });

  return (
    <>
      {/* 1. Hero */}
      <PageHero
        eyebrow="Programs"
        title="Current Offerings"
        description="Guided pathways into the Rose field — each program is a living invitation to deepen your practice, remember your coherence, and step into a community devoted to inner freedom."
      />

      {/* 2. Program Cards Grid */}
      <section ref={gridRef} className="section-padding">
        <div className="container-premium">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {programs.map((program, i) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 24 }}
                animate={gridInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <ProgramCard program={program} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Schedule */}
      <section
        ref={scheduleRef}
        className="section-padding bg-[var(--color-background-subtle)]"
      >
        <div className="container-premium max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={scheduleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="label-sacred mb-4"
          >
            Schedule
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={scheduleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-8"
          >
            Program Schedule
          </motion.h2>
          <ScheduleTable stages={scheduleStages} />
        </div>
      </section>

      {/* 4. Contribution */}
      <section ref={contributionRef} className="section-padding">
        <div className="container-premium max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={contributionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="label-sacred mb-4"
          >
            Contribution
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={contributionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-4"
          >
            Income-Based Model
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={contributionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-[var(--color-foreground-muted)] leading-relaxed mb-10 max-w-2xl"
          >
            We believe this work should be accessible to everyone who is called.
            Our income-based contribution model ensures that your financial season
            is honored while sustaining the ecosystem for all.
          </motion.p>
          <ContributionTiers tiers={contributionTiers} />
        </div>
      </section>

      {/* 5. Enroll CTA */}
      <section ref={ctaRef} className="section-padding bg-[var(--color-background-subtle)]">
        <div className="container-premium">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-4"
            >
              Ready to Begin?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-[var(--color-foreground-muted)] leading-relaxed mb-8"
            >
              If something in these words resonates, we invite you to take the
              next step. Enrollment is open and we are here to support your journey.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href="/enroll"
                className={cn(
                  'inline-flex items-center gap-2 px-8 py-3.5 rounded-full',
                  'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]',
                  'text-sm font-medium',
                  'hover:bg-[var(--color-accent-hover)]',
                  'transition-all duration-200',
                  'shadow-sm hover:shadow-md'
                )}
              >
                Enroll Now
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Invitation CTA */}
      <InvitationCTA />
    </>
  );
}
