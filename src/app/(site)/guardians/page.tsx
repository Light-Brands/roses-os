'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { guardians, brandQuotes } from '@/lib/data';

import PageHero from '@/components/sections/PageHero';
import GuardianCard from '@/components/sections/GuardianCard';
import QuoteBlock from '@/components/sections/QuoteBlock';
import InvitationCTA from '@/components/sections/InvitationCTA';

// =============================================================================
// GUARDIANS PAGE
// =============================================================================

export default function GuardiansPage() {
  const gridRef = useRef<HTMLElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-100px' });

  return (
    <>
      {/* 1. Hero */}
      <PageHero
        eyebrow="Guardians"
        title="The Keepers of the Rose Field"
        description="The Guardians are devoted practitioners and stewards of the Rose technology. Each one brings a unique gift to the field — holding space, guiding practice, and nurturing the community with presence and care."
      />

      {/* 2. Guardian Cards Grid */}
      <section ref={gridRef} className="section-padding">
        <div className="container-premium">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {guardians.map((guardian, i) => (
              <motion.div
                key={guardian.id}
                initial={{ opacity: 0, y: 24 }}
                animate={gridInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <GuardianCard guardian={guardian} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Quote */}
      <QuoteBlock
        quote={brandQuotes[3].text}
        variant="fullbleed"
      />

      {/* 4. Invitation CTA */}
      <InvitationCTA />
    </>
  );
}
