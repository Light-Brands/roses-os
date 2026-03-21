'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// =============================================================================
// SHARED EASE
// =============================================================================

const ease = [0.16, 1, 0.3, 1] as const;

// =============================================================================
// SECTION: Full-Screen Hero
// =============================================================================

function InvitationHero() {
  return (
    <section className="relative min-h-[100svh] min-h-screen flex items-center justify-center bg-[var(--color-section-dark)] text-white overflow-hidden">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      <div className="relative z-10 container-premium text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease }}
          className="text-[11px] font-medium uppercase tracking-[0.2em] text-warm-400 mb-6"
        >
          International Aura School
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease }}
          className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] tracking-tighter text-balance max-w-4xl mx-auto"
        >
          You Have Been
          <br />
          Invited
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease }}
          className="mt-6 text-lg sm:text-xl text-warm-300 max-w-xl mx-auto leading-relaxed"
        >
          A personal doorway into the Rose field. Everything you need to begin is here.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6, ease }}
          className="mt-10"
        >
          <Link
            href="/offerings"
            className={cn(
              'inline-flex items-center gap-2 px-8 py-3.5 rounded-full',
              'bg-warm-100 text-[var(--color-section-dark)]',
              'text-sm font-medium',
              'hover:bg-warm-200',
              'transition-colors duration-200'
            )}
          >
            See Programs
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: What is International Aura School?
// =============================================================================

function WhatIsRosesOS() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding">
      <div className="container-premium max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="label-sacred mb-6"
        >
          What is International Aura School
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-8"
        >
          A living ecosystem for remembering who you are
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          className="text-lg text-[var(--color-foreground-muted)] leading-relaxed"
        >
          International Aura School is a living architecture of technologies, practices, and
          community for coherent living. A way home. A seamless path back to
          the intelligence that already lives within you, waiting to be
          remembered.
        </motion.p>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: Explore Further (replaces ProgramsSection + GuardiansLink)
// =============================================================================

function ExploreFurther() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-[var(--color-background-subtle)]">
      <div className="container-premium max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="space-y-6"
        >
          <p className="text-lg text-[var(--color-foreground-muted)] leading-relaxed">
            Four guardians steward the Rose field, each bringing decades of
            practice and devotion to support your journey.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/offerings"
              className={cn(
                'inline-flex items-center gap-2',
                'text-sm font-medium',
                'text-[var(--color-foreground)]',
                'underline underline-offset-4 decoration-[var(--color-rose-clay)]',
                'hover:text-[var(--color-foreground-muted)]',
                'transition-colors duration-200'
              )}
            >
              Explore Programs
            </Link>
            <span className="hidden sm:inline text-[var(--color-foreground-faint)]">·</span>
            <Link
              href="/guardians"
              className={cn(
                'inline-flex items-center gap-2',
                'text-sm font-medium',
                'text-[var(--color-foreground)]',
                'underline underline-offset-4 decoration-[var(--color-rose-clay)]',
                'hover:text-[var(--color-foreground-muted)]',
                'transition-colors duration-200'
              )}
            >
              Meet the Guardians
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: CTA
// =============================================================================

function FinalCTA() {
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
            The way is open.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/offerings"
              className={cn(
                'px-8 py-3.5 rounded-full',
                'bg-warm-100 text-[var(--color-section-dark)]',
                'text-sm font-medium',
                'hover:bg-warm-200',
                'transition-colors duration-200'
              )}
            >
              See Programs
            </Link>
            <Link
              href="/enroll"
              className={cn(
                'px-8 py-3.5 rounded-full',
                'border-2 border-white/30 text-white',
                'text-sm font-medium',
                'hover:border-white/60 hover:bg-white/5',
                'transition-all duration-200'
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
// INVITATION PAGE
// =============================================================================

export default function InvitationPage() {
  return (
    <>
      <InvitationHero />
      <WhatIsRosesOS />
      <ExploreFurther />
      <FinalCTA />
    </>
  );
}
