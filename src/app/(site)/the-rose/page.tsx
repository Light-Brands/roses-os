'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { pathLevels, brandQuotes } from '@/lib/data';

import PageHero from '@/components/sections/PageHero';
import PathLevels from '@/components/sections/PathLevels';
import QuoteBlock from '@/components/sections/QuoteBlock';
import InvitationCTA from '@/components/sections/InvitationCTA';

// =============================================================================
// SCROLL-REVEAL TEXT SECTION
// =============================================================================

function RevealSection({
  label,
  title,
  children,
  className,
}: {
  label?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className={cn('section-padding', className)}>
      <div className="container-premium max-w-3xl mx-auto">
        {label && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="label-sacred mb-6"
          >
            {label}
          </motion.p>
        )}
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-6"
          >
            {title}
          </motion.h2>
        )}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg text-[var(--color-foreground-muted)] leading-relaxed space-y-6"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

// =============================================================================
// THE ROSE PAGE
// =============================================================================

export default function TheRosePage() {
  return (
    <>
      {/* 1. Hero */}
      <PageHero
        eyebrow="The Rose"
        title="The Intelligence of Silence"
        description="The Rose is a technology of remembrance. A living practice that reconnects you with the intelligence already present within your body, your breath, and your being. It is not something to learn. It is something to remember."
        image="/page-images/page-the-rose.png"
      />

      {/* 2. The Collapse of Old Paradigms */}
      <RevealSection title="The Old Paradigm Is Dissolving">
        <p>
          For decades, we have been told that more information would save us. More
          knowledge, more productivity, more optimization. We built systems to
          manage every dimension of life, and still, something essential remained
          untouched.
        </p>
        <p>
          The old paradigm was built on the assumption that we are broken and need
          fixing. That healing is a destination. That growth means accumulating
          more. But what if the opposite is true? What if freedom comes not from
          adding, but from remembering what was always here?
        </p>
      </RevealSection>

      {/* 3. The Era of Acceleration */}
      <RevealSection
        label="The Current Moment"
        title="The Era of Acceleration"
        className="bg-[var(--color-background-subtle)]"
      >
        <p>
          We live in a time of unprecedented acceleration. The systems we
          inherited (economic, educational, relational) are rapidly failing to
          meet the depth of what it means to be human. Burnout is epidemic.
          Disconnection is normalized. The nervous system is overwhelmed.
        </p>
        <p>
          Technology promised connection but delivered distraction. Wellness
          culture promised healing but delivered consumption. The acceleration
          continues, and with it, a growing hunger for something real. Something
          that cannot be optimized or automated.
        </p>
      </RevealSection>

      {/* 4. The Next Revolution */}
      <RevealSection
        label="What Is Emerging"
        title="The Next Revolution"
      >
        <p>
          The next revolution is not technological. It is a revolution of inner
          coherence. A return to the body. A remembering of the intelligence that
          lives beneath thought, beneath conditioning, beneath the stories we
          carry about who we are.
        </p>
        <p>
          This revolution does not require a guru, a doctrine, or a belief system.
          It requires only your willingness to be still, to listen, and to let the
          intelligence of silence do what it has always known how to do: bring you
          home.
        </p>
      </RevealSection>

      {/* 5. Introducing The Rose */}
      <RevealSection
        label="The Technology"
        title="Introducing The Rose"
        className="bg-[var(--color-background-subtle)]"
      >
        <p>
          The Rose is a systematic practice rooted in breath, somatic awareness,
          and the cultivation of inner coherence. Developed over decades by
          Angelina Ataide and drawn from a deep lineage of consciousness research,
          it offers a clear, grounded pathway for anyone ready to remember who
          they truly are. The Rose unfolds across three levels. Each one a
          deepening of the relationship with yourself, your body, and the field of
          intelligence that surrounds you.
        </p>
      </RevealSection>

      {/* 6. Path Levels */}
      <PathLevels levels={pathLevels} variant="full" />

      {/* 7. Quote */}
      <QuoteBlock
        quote="What if the intelligence you seek is already within you, waiting to be remembered?"
        variant="fullbleed"
      />

      {/* 8. Invitation CTA */}
      <InvitationCTA />
    </>
  );
}
