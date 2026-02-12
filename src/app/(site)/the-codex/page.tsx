'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  lineageEntries,
  coherenceDomains,
  pathLevels,
  architectureLayers,
  elevenCapacities,
} from '@/lib/data';

import PageHero from '@/components/sections/PageHero';
import QuoteBlock from '@/components/sections/QuoteBlock';
import InvitationCTA from '@/components/sections/InvitationCTA';
import LineageTimeline from '@/components/sections/LineageTimeline';
import DomainGrid from '@/components/sections/DomainGrid';
import PathLevels from '@/components/sections/PathLevels';
import ElevenCapacities from '@/components/sections/ElevenCapacities';

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
          Coherence is the state in which all dimensions of being — body, heart,
          mind, and soul — move as one integrated field. It is not a concept to
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
          birthright. This is not about acquiring something new — it is about
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
// SECTION: Architecture Layers
// =============================================================================

function ArchitectureLayers() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding bg-[var(--color-background-subtle)]">
      <div className="container-premium">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="label-sacred mb-10 text-center"
        >
          Four Layers of the Architecture
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {architectureLayers.map((layer, i) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease }}
              className={cn(
                'group relative rounded-xl p-6',
                'bg-[var(--color-background-elevated)]',
                'border border-[var(--color-border-subtle)]',
                'transition-all duration-300',
                'hover:shadow-md hover:border-[var(--color-border)]',
                'hover:-translate-y-0.5'
              )}
            >
              {/* Layer number */}
              <span
                className={cn(
                  'block font-serif text-3xl leading-none',
                  'text-[#C4A86B]/40 mb-3',
                  'transition-colors duration-300',
                  'group-hover:text-[#C4A86B]/70'
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <h3 className="font-serif font-semibold text-lg text-[var(--color-foreground)] leading-snug mb-2">
                {layer.name}
              </h3>
              <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                {layer.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// THE CODEX PAGE
// =============================================================================

export default function TheCodexPage() {
  return (
    <>
      {/* 1. Hero */}
      <PageHero
        eyebrow="The Codex"
        title="A Living Document of Coherent Being"
        description="The Codex is the philosophical container of ROSES OS — a map of the territory, an articulation of the architecture, and an invitation to remember what has always been true. It is not a rigid doctrine but a living document that deepens as you do."
        image="/page-images/page-the-codex.png"
      />

      {/* 2. What is Coherence? */}
      <WhatIsCoherence />

      {/* 3. Sacred Purpose */}
      <SacredPurpose />

      {/* 4. Lineage */}
      <SectionLabel>Lineage</SectionLabel>
      <LineageTimeline entries={lineageEntries} />

      {/* 5. 13 Domains of Coherence */}
      <SectionLabel>13 Domains of Coherence</SectionLabel>
      <DomainGrid domains={coherenceDomains} />

      {/* 6. The Path */}
      <SectionLabel>The Path</SectionLabel>
      <PathLevels levels={pathLevels} variant="full" />

      {/* 7. Four Layers of the Architecture */}
      <ArchitectureLayers />

      {/* 8. Eleven Capacities */}
      <SectionLabel>Eleven Capacities</SectionLabel>
      <ElevenCapacities capacities={elevenCapacities} />

      {/* 9. Quote */}
      <QuoteBlock
        quote="This is not self-help. This is self-remembrance."
        variant="fullbleed"
      />

      {/* 10. Invitation CTA */}
      <InvitationCTA />
    </>
  );
}
