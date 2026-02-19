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
// ACTIVITY CARD
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
      <div className="text-[var(--color-foreground-muted)] leading-relaxed text-sm sm:text-base mb-4 space-y-3">
        {program.description.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
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
      {program.whatsappLink && (
        <a
          href={program.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full',
            'bg-[#25D366] text-white',
            'text-sm font-medium',
            'hover:bg-[#1EBE57]',
            'transition-all duration-200',
            'shadow-sm hover:shadow-md'
          )}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Join WhatsApp Group
        </a>
      )}
    </motion.div>
  );
}

// =============================================================================
// COMMUNITY PAGE (consolidated: vision + programs & activities)
// =============================================================================

export default function CommunityPage() {
  const visionRef = useRef<HTMLElement>(null);
  const visionInView = useInView(visionRef, { once: true, margin: '-100px' });

  const freeRef = useRef<HTMLElement>(null);
  const freeInView = useInView(freeRef, { once: true, margin: '-100px' });

  const paidRef = useRef<HTMLElement>(null);
  const paidInView = useInView(paidRef, { once: true, margin: '-100px' });

  return (
    <>
      {/* 1. Hero */}
      <PageHero
        eyebrow="Community"
        title="The Living Field"
        description="A network of practitioners devoted to coherent living. Ongoing gatherings, practices, and programs that nourish the field and support your journey."
        image="/page-images/page-community.png"
      />

      {/* 2. Community Vision */}
      <section ref={visionRef} className="section-padding">
        <div className="container-premium max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={visionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="label-sacred mb-6"
          >
            Our Vision
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={visionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-6"
          >
            For Those Called to Coherent Living
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={visionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="text-lg text-[var(--color-foreground-muted)] leading-relaxed space-y-6"
          >
            <p>
              The ROSES OS community is a living field. A gathering of individuals
              who have chosen to walk the path of remembrance together as fellow
              practitioners.
            </p>
            <p>
              We hold space for one another through daily practice, shared inquiry,
              and the quiet commitment to showing up as we are. The community
              exists because the journey home is supported, not solitary.
            </p>
            <p>
              Coherence is the state in which all dimensions of being: body,
              heart, mind, and soul, move as one integrated field. Not a concept
              to understand, but a reality to embody. We believe that coherence
              is contagious. That when one person remembers, it ripples through
              the field and touches everyone around them.
            </p>
          </motion.div>
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

      {/* 4. Continued Programs */}
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
