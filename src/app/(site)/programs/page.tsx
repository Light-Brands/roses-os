'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { freePrograms, paidPrograms } from '@/lib/data';
import type { CommunityProgram } from '@/lib/data';

import PageHero from '@/components/sections/PageHero';
import InvitationCTA from '@/components/sections/InvitationCTA';

// =============================================================================
// EASE CONSTANT
// =============================================================================

const ease = [0.16, 1, 0.3, 1] as const;

// =============================================================================
// PROGRAM CARD
// =============================================================================

function ActivityCard({
  program,
  index,
  inView,
}: {
  program: CommunityProgram;
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
        {program.title}
      </h3>
      <p className="text-[var(--color-foreground-muted)] leading-relaxed text-sm sm:text-base mb-4">
        {program.description}
      </p>
      <div className="flex flex-wrap gap-3">
        {program.schedule && (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
              'bg-rose-100/80 dark:bg-rose-900/30',
              'text-rose-700 dark:text-rose-300',
              'border border-rose-200/60 dark:border-rose-800/30'
            )}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {program.schedule}
          </span>
        )}
        {program.audience && (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
              'bg-[#9E956B]/10 dark:bg-[#9E956B]/15',
              'text-[#7A7352] dark:text-[#C4BA8A]',
              'border border-[#9E956B]/20 dark:border-[#9E956B]/25'
            )}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {program.audience}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// =============================================================================
// PROGRAMS PAGE
// =============================================================================

export default function ProgramsPage() {
  const introRef = useRef<HTMLElement>(null);
  const introInView = useInView(introRef, { once: true, margin: '-100px' });

  const freeRef = useRef<HTMLElement>(null);
  const freeInView = useInView(freeRef, { once: true, margin: '-100px' });

  const paidRef = useRef<HTMLElement>(null);
  const paidInView = useInView(paidRef, { once: true, margin: '-100px' });

  return (
    <>
      {/* 1. Hero */}
      <PageHero
        eyebrow="Programs"
        title="Ongoing Programs & Activities"
        description="The living heartbeat of our community. Ongoing gatherings, practices, and programs that nourish the field and support your journey — whether you are just arriving or have been walking this path for years."
        image="/page-images/page-programs.png"
      />

      {/* 2. Intro */}
      <section ref={introRef} className="section-padding">
        <div className="container-premium max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="label-sacred mb-6"
          >
            Nourishing the Community
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-6"
          >
            Activities That Keep the Field Alive
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="text-lg text-[var(--color-foreground-muted)] leading-relaxed"
          >
            Beyond the foundational courses, ROSES OS offers a constellation of
            ongoing programs and activities. Some are freely open to all, others
            are dedicated spaces for practitioners who want to continue
            deepening. Together, they form the living rhythm of this community.
          </motion.p>
        </div>
      </section>

      {/* 3. Free Activities */}
      <section ref={freeRef} className="section-padding">
        <div className="container-premium max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={freeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="label-sacred mb-6"
          >
            Free Activities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={freeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-4"
          >
            Open to All
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={freeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="text-base text-[var(--color-foreground-muted)] leading-relaxed mb-8"
          >
            These gatherings are offered freely as a gift to the community.
            Whether you are new to the Rose field or a long-time practitioner,
            there is a place for you here.
          </motion.p>
          <div className="space-y-4">
            {freePrograms.map((program, i) => (
              <ActivityCard
                key={program.id}
                program={program}
                index={i}
                inView={freeInView}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Paid Programs */}
      <section ref={paidRef} className="section-padding">
        <div className="container-premium max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={paidInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="label-sacred mb-6"
          >
            Continued Programs
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={paidInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-4"
          >
            Deepening the Path
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={paidInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="text-base text-[var(--color-foreground-muted)] leading-relaxed mb-8"
          >
            For those ready to go further, these programs offer sustained
            practice, mentorship, and the opportunity to embody and share this
            work at a deeper level.
          </motion.p>
          <div className="space-y-4">
            {paidPrograms.map((program, i) => (
              <ActivityCard
                key={program.id}
                program={program}
                index={i}
                inView={paidInView}
              />
            ))}
          </div>

          {/* CTA to Offerings */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={paidInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4, ease }}
            className="text-center mt-12"
          >
            <p className="text-base text-[var(--color-foreground-muted)] leading-relaxed mb-6 max-w-lg mx-auto">
              Looking for our foundational courses? Explore The Rose + Aura 1
              and Aura Reading Level 2 on our offerings page.
            </p>
            <Link
              href="/offerings"
              className={cn(
                'inline-flex items-center gap-2 px-8 py-3.5 rounded-full',
                'border-2 border-[var(--color-rose-clay)] text-[var(--color-rose-clay)]',
                'text-sm font-medium',
                'hover:bg-[var(--color-rose-clay)] hover:text-[var(--color-foreground-on-rose)]',
                'transition-all duration-200',
                'shadow-sm hover:shadow-md'
              )}
            >
              View Current Offerings
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
          </motion.div>
        </div>
      </section>

      {/* 5. Invitation CTA */}
      <InvitationCTA />
    </>
  );
}
