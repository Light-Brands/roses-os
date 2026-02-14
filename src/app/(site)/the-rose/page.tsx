'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

import PageHero from '@/components/sections/PageHero';
import QuoteBlock from '@/components/sections/QuoteBlock';
import InvitationCTA from '@/components/sections/InvitationCTA';
import { Tabs, TabsList, TabTrigger, TabContent } from '@/components/ui/Tabs';

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
        description="The Rose is a technology of remembrance. A living practice that reconnects you with the intelligence already present within your body, your breath, and your being. Something already within you, waiting to be remembered."
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
          The next revolution is one of inner coherence. A return to the body. A
          remembering of the intelligence that lives beneath thought, beneath
          conditioning, beneath the stories we carry about who we are. It
          requires only your willingness to be still, to listen, and to let the
          intelligence of silence do what it has always known how to do: bring
          you home.
        </p>
      </RevealSection>

      {/* 5. Introducing The Rose */}
      <RevealSection
        label="The Technology"
        title="Introducing The Rose"
        className="bg-[var(--color-background-subtle)]"
      >
        <p>
          The Rose is a systematic practice rooted in imagination, awareness,
          and the cultivation of inner coherence. Developed over decades by
          Angelina Ataíde and drawn from a deep lineage of consciousness research,
          it offers a clear, grounded pathway for anyone ready to remember who
          they truly are. The path unfolds through two main practices — Rose
          Meditation and Aura Reading — each one a deepening of the relationship
          with yourself, your energy, and the field of intelligence that surrounds
          you.
        </p>
      </RevealSection>

      {/* 6. Rose Meditation & Aura Tabs */}
      <section className="section-padding">
        <div className="container-premium max-w-4xl mx-auto">
          <Tabs defaultValue="rose-meditation" variant="underline" size="lg">
            <TabsList className="justify-center mb-8">
              <TabTrigger value="rose-meditation">Rose Meditation</TabTrigger>
              <TabTrigger value="aura">Aura Reading</TabTrigger>
            </TabsList>

            {/* Rose Meditation Tab */}
            <TabContent value="rose-meditation">
              <div className="space-y-6">
                <p className="text-lg text-[var(--color-foreground-muted)] leading-relaxed">
                  Rose Meditation is the foundational practice of the ROSES OS
                  path. It begins with grounding, aura awareness, and energetic
                  cleansing — learning to root yourself, separate your energy from
                  others, and receive the nourishing forces of Earth and Cosmos.
                  The practice deepens into the subtle body, where you discover
                  what your aura carries, transmute past and present energies,
                  cleanse the seven chakras and aura layers, and release energetic
                  ties. It culminates in spiritual activation — working with
                  spiritual agreements, freeing yourself from energetic cords,
                  transcending limiting beliefs, and learning Reality Creation
                  through the Mock Up technique.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 pt-2">
                  {[
                    'Grounding & presence',
                    'Aura cleansing & protection',
                    'Energy separation',
                    'Earth & Cosmic circuits',
                    'Chakra & aura layer cleansing',
                    'Energetic tie release',
                    'Sacred space creation',
                    'Environmental protection',
                    'Spiritual agreements & cords',
                    'Belief transcendence',
                    'Mental program cleansing',
                    'Reality Creation (Mock Up)',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 text-sm text-[var(--color-foreground-muted)] py-1"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#9E956B]/50 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabContent>

            {/* Aura Reading Tab */}
            <TabContent value="aura">
              <div className="space-y-6">
                <p className="text-lg text-[var(--color-foreground-muted)] leading-relaxed">
                  Aura Reading course teaches you to see, feel, and listen to the
                  energy that moves within you and surrounds you, revealing that
                  everything in life begins as energy and that awareness gives you
                  the power to transform it.
                </p>
                <p className="text-lg text-[var(--color-foreground-muted)] leading-relaxed">
                  It is as well a conscious conversation between essences. By
                  reading another person&apos;s aura, you support their journey of
                  growth and healing while receiving mirrors and insights that
                  illuminate your own path. Each reading becomes a conscious
                  exchange where both the reader and the person being read are
                  touched and transformed.
                </p>
                <p className="text-lg text-[var(--color-foreground-muted)] leading-relaxed">
                  This transformation becomes possible by awakening your
                  clairvoyance, clairsentience, clairaudience, and other subtle
                  senses. These abilities allow you to connect directly with what
                  is real and receive guidance that leads to freedom, clarity, and
                  growth.
                </p>
              </div>
            </TabContent>
          </Tabs>
        </div>
      </section>

      {/* 7. Quote */}
      <QuoteBlock
        quote="This journey is an invitation into intuition, presence, and truth—a gateway into the mystery of who you are and who you are becoming."
        variant="fullbleed"
      />

      {/* 10. Invitation CTA */}
      <InvitationCTA />
    </>
  );
}
