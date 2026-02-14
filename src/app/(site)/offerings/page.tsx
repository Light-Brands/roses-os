'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { pathLevels } from '@/lib/data';

import PageHero from '@/components/sections/PageHero';
import QuoteBlock from '@/components/sections/QuoteBlock';
import InvitationCTA from '@/components/sections/InvitationCTA';

// =============================================================================
// AURA LEVEL CARD
// =============================================================================

function AuraLevelCard({
  level,
  index,
  isInView,
}: {
  level: (typeof pathLevels)[number];
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        'relative rounded-2xl p-8 md:p-10',
        'bg-[var(--color-background-subtle)]',
        'border border-[var(--color-border)]',
        'transition-shadow duration-300',
        'hover:shadow-[var(--shadow-md)]'
      )}
    >
      {/* Level indicator */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className={cn(
            'flex items-center justify-center',
            'w-10 h-10 rounded-full',
            'bg-[#9E956B]/10 text-[#9E956B]',
            'font-serif font-semibold text-base',
            'border border-[#9E956B]/20'
          )}
        >
          {index + 1}
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-foreground-faint)]">
          Level {index + 1}
        </p>
      </div>

      {/* Title & subtitle */}
      <h3 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--color-foreground)] mb-2">
        {level.title}
      </h3>
      <p className="text-base text-[var(--color-foreground-faint)] italic mb-5">
        {level.subtitle}
      </p>

      {/* Description */}
      <p className="text-base text-[var(--color-foreground-muted)] leading-relaxed mb-6">
        {level.description}
      </p>

      {/* Focus areas */}
      {level.focus.length > 0 && (
        <div>
          <span className="label-sacred block mb-3">Focus Areas</span>
          <ul className="space-y-2">
            {level.focus.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-[var(--color-foreground-muted)]"
              >
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#9E956B]/50 shrink-0"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}

// =============================================================================
// OFFERINGS PAGE
// =============================================================================

export default function OfferingsPage() {
  const introRef = useRef<HTMLElement>(null);
  const introInView = useInView(introRef, { once: true, margin: '-100px' });

  const levelsRef = useRef<HTMLElement>(null);
  const levelsInView = useInView(levelsRef, { once: true, margin: '-100px' });

  const ctaRef = useRef<HTMLElement>(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: '-100px' });

  // Aura levels 1, 2 & 3 correspond to pathLevels indices 3, 4, 5 (levels 4, 5, 6)
  const auraLevels = pathLevels.filter((l) => l.level >= 4 && l.level <= 6);

  return (
    <>
      {/* 1. Hero */}
      <PageHero
        eyebrow="Offerings"
        title="The Aura Path"
        description="A progressive journey into the energetic body. Each level deepens your capacity to perceive, heal, and navigate the subtle field of consciousness that surrounds and moves through all things."
        image="/page-images/page-offerings.png"
      />

      {/* 2. Introduction */}
      <section ref={introRef} className="section-padding bg-[var(--color-background-subtle)]">
        <div className="container-premium max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="label-sacred mb-6"
          >
            The Journey
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-6"
          >
            Three Levels of Deepening
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-[var(--color-foreground-muted)] leading-relaxed space-y-6"
          >
            <p>
              The Aura path unfolds across three levels, each building on
              the last. Beginning with the foundational practices of Rose
              Meditation, the journey extends into reading the energetic body,
              deepening perceptual capacity, and ultimately navigating the
              relational and healing dimensions of the subtle field.
            </p>
            <p>
              Every level is taught live, in community, and supported by the
              guardians of this lineage. The path is designed for those who are
              ready to move beyond concept and into direct experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. Aura Levels */}
      <section ref={levelsRef} className="section-padding">
        <div className="container-premium">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={levelsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="label-sacred mb-4 text-center"
          >
            Aura Reading
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={levelsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-12 text-center"
          >
            The Levels
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {auraLevels.map((level, i) => (
              <AuraLevelCard
                key={level.id}
                level={level}
                index={i}
                isInView={levelsInView}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Quote */}
      <QuoteBlock
        quote="The aura is not something you learn to see. It is something you remember how to feel."
        variant="fullbleed"
      />

      {/* 5. Current Program CTA */}
      <section ref={ctaRef} className="section-padding">
        <div className="container-premium">
          <div className="max-w-2xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="label-sacred mb-4"
            >
              Currently Enrolling
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-4"
            >
              The Rose + Aura 1
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-[var(--color-foreground-muted)] leading-relaxed mb-8"
            >
              The first level is now open. Eleven days combining Rose Meditation
              1, 2 & 3 with Aura Reading Level 1: a complete foundation for
              the journey ahead.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href="/programs"
                className={cn(
                  'inline-flex items-center gap-2 px-8 py-3.5 rounded-full',
                  'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]',
                  'text-sm font-medium',
                  'hover:bg-[var(--color-accent-hover)]',
                  'transition-all duration-200',
                  'shadow-sm hover:shadow-md'
                )}
              >
                View Program Details
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
        </div>
      </section>

      {/* 6. Invitation CTA */}
      <InvitationCTA />
    </>
  );
}
