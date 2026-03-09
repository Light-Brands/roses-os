'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

import PageHero from '@/components/sections/PageHero';
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
// ANIMATED CARD FOR GRID SECTIONS
// =============================================================================

function RevealCard({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <h3 className="font-serif text-xl md:text-2xl tracking-tight mb-3">
        {title}
      </h3>
      <div className="text-lg text-[var(--color-foreground-muted)] leading-relaxed space-y-3">
        {children}
      </div>
    </motion.div>
  );
}

// =============================================================================
// THE ROSE PAGE
// =============================================================================

export default function TheRoseClient() {
  return (
    <>
      {/* 1. Hero */}
      <PageHero
        eyebrow="The Rose"
        title="When the Rose Awakens, Genius Awakens"
        description="The Rose restores coherence across emotional, mental, and energetic systems, making intuition precise and presence sovereign. Simple and decentralized, it frees you from endless healing and returns you to natural alignment."
        image="/page-images/page-the-rose.png"
      />

      {/* 2. What the Rose Is */}
      <RevealSection
        label="The Technology"
        title="What the Rose Is"
      >
        <p>
          The Rose is a simple, living inner technology.{' '}
          <span className="font-medium text-[var(--color-foreground)]">It restores awareness.</span>{' '}
          <span className="font-medium text-[var(--color-foreground)]">It restores coherence.</span>{' '}
          <span className="font-medium text-[var(--color-foreground)]">It restores real choice.</span>
        </p>
        <p>
          It doesn&apos;t fight the noise and fragmentation. It quietly
          dissolves the conditions that keep chaos alive.
        </p>
      </RevealSection>

      {/* 3. The Two Questions */}
      <RevealSection
        title="The Two Questions"
        className="bg-[var(--color-background-subtle)]"
      >
        <p>The Rose asks two questions:</p>
        <ol className="list-decimal list-inside space-y-2 pl-1">
          <li>
            <span className="font-medium text-[var(--color-foreground)]">
              Are you aware of your inner state at this moment?
            </span>
          </li>
          <li>
            <span className="font-medium text-[var(--color-foreground)]">
              Do you feel coherent inside? If not, how can you restore it?
            </span>
          </li>
        </ol>
        <p>
          No belief needed. Just an honest awareness and presence. When even a
          trace of coherence returns, clarity grows, and choice becomes real
          again.
        </p>
      </RevealSection>

      {/* 4. Who This Is For */}
      <RevealSection
        label="Who This Is For"
        title="For Those Ready to Remember"
      >
        <p>
          For those who feel the world accelerating and know the tools they
          inherited were not built for this moment.
        </p>
        <p>
          For founders, creators, parents, healers, and leaders who need
          clarity, intuition, and inner stability to move through complexity
          without losing themselves.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          {[
            {
              name: 'The Rose',
              desc: 'awakens perception.',
            },
            {
              name: 'Aura',
              desc: 'empowers relationship.',
            },
            {
              name: 'Together',
              desc: 'they restore coherence, love, and confidence.',
            },
          ].map((item) => (
            <div key={item.name} className="text-center">
              <p className="font-serif text-lg text-[var(--color-foreground)]">
                {item.name}
              </p>
              <p className="text-sm text-[var(--color-foreground-muted)] mt-1">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* 5. You Feel It */}
      <QuoteBlock
        quote="This journey is an invitation into intuition, presence, and truth. A gateway into the mystery of who you are and who you are becoming."
        variant="fullbleed"
      />

      <RevealSection>
        <p>
          What brought us here won&apos;t get us there. The Rose and Aura
          cleanse your bodies, protect your energy, restore clarity, and return
          you to your essence.
        </p>
        <p>
          Not techniques, but instruments of consciousness, reminding you
          that you are the mountain, not the summit.
        </p>
        <p className="text-[var(--color-foreground)] font-medium">
          If life calls you into sovereignty, joy, and presence, the way is
          open.
        </p>
      </RevealSection>

      {/* 6. Rose Meditation & Aura Reading descriptions */}
      <section className="section-padding">
        <div className="container-premium max-w-3xl mx-auto space-y-16">
          <RevealCard title="" delay={0}>
            <p className="label-sacred mb-2">Main Technologies & Practices</p>
          </RevealCard>
          <RevealCard title="Rose Meditation" delay={0.1}>
            <p>
              An initiatic path to remember who you are. Through the simple yet
              powerful technology of the roses, you will learn how to cleanse and
              protect your Aura, so that you no longer live like a sponge,
              absorbing energies that don&apos;t belong to you.
            </p>
            <p>
              Everyday, we are surrounded by energies: from people, memories,
              situations, environments, even our own thoughts. When we are
              unaware, these energies stick to us, creating confusion, heaviness,
              and programs that cloud who we truly are.
            </p>
            <p>
              By cleansing and protecting your energy field, you begin to live in
              the presence of your own essence. You recover your vitality, raise
              your vibration, and create space for your soul to manifest with
              clarity and power.
            </p>
          </RevealCard>

          <RevealCard title="Aura Reading" delay={0.2}>
            <p>
              Aura Reading course teaches you to see, feel, and listen to the
              energy that moves within you and surrounds you, revealing that
              everything in life begins as energy and that awareness gives you
              the power to transform it.
            </p>
            <p>
              It is as well a conscious conversation between essences. By reading
              another person&apos;s aura, you support their journey of growth
              and healing while receiving mirrors and insights that illuminate
              your own path. Each reading becomes a conscious exchange where both
              the reader and the person being read are touched and transformed.
            </p>
            <p>
              This transformation becomes possible by awakening your
              clairvoyance, clairsentience, clairaudience, and other subtle
              senses. These abilities allow you to connect directly with what is
              real and receive guidance that leads to freedom, clarity, and
              growth.
            </p>
          </RevealCard>
        </div>
      </section>

      {/* Quote — Aura */}
      <QuoteBlock
        quote="The aura is not just about colors. It contains all the information about who you truly are. You just need to learn how to see it."
        variant="fullbleed"
      />

      {/* 7. What This Journey Awakens in You */}
      <section className="section-padding">
        <div className="container-premium max-w-5xl mx-auto">
          <RevealCard title="" delay={0}>
            <p className="label-sacred mb-2">What This Journey Awakens in You</p>
          </RevealCard>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mt-10">
            <RevealCard title="Intuition" delay={0.1}>
              <p>
                You learn to listen to truth with clarity and simplicity.
                Limiting beliefs and unconscious patterns dissolve. Your
                decisions become aligned, precise, and guided.
              </p>
            </RevealCard>
            <RevealCard title="Leadership" delay={0.2}>
              <p>
                It deepens your capacity to feel, support, and relate.
                Leadership rooted in coherence, empowerment, and trust. You
                read your own field and the energy around you with discernment
                and self-mastery.
              </p>
            </RevealCard>
            <RevealCard title="Highest Potential" delay={0.3}>
              <p>
                You access the brilliance of your original design. You live
                your life from pure integrity. These belong to every human who
                remembers who they are.
              </p>
            </RevealCard>
          </div>
          <RevealCard title="" delay={0.4}>
            <p className="text-center pt-6 font-medium text-[var(--color-foreground)]">
              No prior experience is needed. Only presence.
            </p>
          </RevealCard>
        </div>
      </section>

      {/* 8. The Rose as Sacred Symbol */}
      <RevealSection
        label="The Oldest Symbol"
        title="The Rose in Spiritual Tradition"
      >
        <p>
          The rose is the oldest spiritual symbol in the known universe. Across every
          tradition and culture, its unfolding petals have represented the same truth:
          the awakening of consciousness, from potential to full realization.
        </p>
        <p className="text-[var(--color-foreground)] font-medium">
          ROSES OS carries this lineage forward. The rose is not a metaphor — it is the living
          instrument at the center of the practice.
        </p>
      </RevealSection>

      {/* 9. The Frequency */}
      <RevealSection
        label="The Frequency"
        title="A Frequency You Cultivate"
        className="bg-[var(--color-background-subtle)]"
      >
        <p>
          The Rose is a frequency you cultivate.
        </p>
        <p>
          No belief required. Only presence and willingness to return to your
          essence. Then choose yourself, clarity, and freedom. From there, life
          becomes creative and reaching.
        </p>
      </RevealSection>

      {/* 9. Invitation CTA */}
      <InvitationCTA />
    </>
  );
}
