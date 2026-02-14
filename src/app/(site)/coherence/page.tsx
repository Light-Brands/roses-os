'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { lineageEntries } from '@/lib/data';

import PageHero from '@/components/sections/PageHero';
import LineageTimeline from '@/components/sections/LineageTimeline';
import InvitationCTA from '@/components/sections/InvitationCTA';

// =============================================================================
// FADE-UP EASE — shared easing
// =============================================================================

const ease = [0.16, 1, 0.3, 1] as const;

// =============================================================================
// SECTION: What is Coherence?
// =============================================================================

function WhatIsCoherence() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding">
      <div className="container-premium max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-6"
        >
          What is Coherence?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="text-lg text-[var(--color-foreground-muted)] leading-relaxed"
        >
          Coherence is the state in which all dimensions of being (body, heart,
          mind, and soul) move as one integrated field. It is not a concept to
          understand but a reality to embody, a felt sense of alignment that
          transforms every layer of life.
        </motion.p>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION: Sacred Purpose
// =============================================================================

function SacredPurpose() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-[var(--color-background-subtle)]">
      <div className="container-premium max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="label-sacred mb-6"
        >
          Sacred Purpose
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="text-lg text-[var(--color-foreground-muted)] leading-relaxed"
        >
          ROSES OS exists to remember what was never lost. It is a living
          document, a field of practice, and a sacred container designed to
          support human beings in returning to the coherence that is their
          birthright. This is not about acquiring something new. It is about
          uncovering what has always been present, beneath the noise, the
          conditioning, and the forgetting.
        </motion.p>
      </div>
    </section>
  );
}

// =============================================================================
// SECTION LABEL — reusable
// =============================================================================

function SectionLabel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="container-premium">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease }}
        className="label-sacred mb-2"
      >
        {children}
      </motion.p>
    </div>
  );
}

// =============================================================================
// COHERENCE PAGE
// =============================================================================

export default function CoherencePage() {
  return (
    <>
      {/* 1. Hero */}
      <PageHero
        eyebrow="Coherence"
        title="A Living Document of Coherent Being"
        description="Coherence is the foundation of ROSES OS — a living invitation to remember the wholeness that has always been present, and to embody it in every dimension of being."
        image="/page-images/page-the-codex.png"
      />

      {/* 2. What is Coherence? */}
      <WhatIsCoherence />

      {/* 3. Sacred Purpose */}
      <SacredPurpose />

      {/* 4. Lineage */}
      <SectionLabel>Lineage</SectionLabel>
      <LineageTimeline entries={lineageEntries} />

      {/* 5. Invitation CTA */}
      <InvitationCTA />
    </>
  );
}
