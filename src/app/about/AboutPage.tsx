'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Navigation } from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import PageHero from '@/components/sections/PageHero';
import ContactCTA from '@/components/sections/ContactCTA';
import { navItems, agencyStats } from '@/lib/data';

// =============================================================================
// VALUES DATA
// =============================================================================

const values = [
  {
    number: '01',
    title: 'Craft Over Speed',
    description:
      'We take the time to get things right. Every decision is intentional, every detail considered.',
  },
  {
    number: '02',
    title: 'Strategy First',
    description:
      'Creative work without strategy is decoration. We think before we design.',
  },
  {
    number: '03',
    title: 'Honest Partnership',
    description:
      'We say what we mean and deliver what we promise. No jargon, no surprises.',
  },
  {
    number: '04',
    title: 'Mediterranean Perspective',
    description:
      'Rooted in Cyprus, connected globally. Our location shapes our outlook — warm, open, and unhurried.',
  },
];

// =============================================================================
// SECTIONS
// =============================================================================

function StorySection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding">
      <div className="container-premium">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] bg-neutral-300 dark:bg-neutral-800 overflow-hidden"
          >
            <Image
              src="/projects/project-1.svg"
              alt="Digital Cultures studio"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Story Text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] tracking-tight leading-tight mb-8">
              We help brands find their voice and show up with confidence.
            </h2>
            <div className="space-y-5 text-[var(--color-foreground-muted)] leading-relaxed">
              <p>
                Digital Cultures is a creative agency based in Paphos, Cyprus. We work with ambitious brands
                — from startups to established businesses — who understand that good design is good business.
              </p>
              <p>
                Our team brings together strategists, designers, developers, and storytellers. We don&apos;t
                believe in bloated teams or unnecessary process. Every project gets senior attention from
                concept through delivery.
              </p>
              <p>
                We&apos;re small by choice. It means we can be selective about the work we take on and give
                each project the focus it deserves.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding">
      <div className="container-premium">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(1.75rem,3vw,2.5rem)] tracking-tight leading-tight mb-14 md:mb-20"
        >
          What we believe
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
          {values.map((value, i) => (
            <motion.div
              key={value.number}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-sm text-[var(--color-foreground-faint)]">
                {value.number} —
              </span>
              <h3 className="text-lg font-medium mt-3 mb-3 tracking-tight">
                {value.title}
              </h3>
              <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="section-padding border-t border-[var(--color-border)]">
      <div className="container-premium">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {agencyStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-center lg:text-left"
            >
              <span className="text-[clamp(2.5rem,5vw,4rem)] tracking-tight leading-none">
                {stat.value}
              </span>
              <p className="mt-2 text-sm text-[var(--color-foreground-muted)] uppercase tracking-[0.15em]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// ABOUT PAGE
// =============================================================================

export default function AboutPage() {
  return (
    <>
      <Navigation
        items={navItems}
        cta={{ label: 'Get in Touch', href: '/contact' }}
      />

      <main>
        <PageHero
          eyebrow="About Us"
          title="Digital Cultures"
          description="A creative agency rooted in Cyprus, building brands that resonate across cultures."
        />

        <StorySection />
        <ValuesSection />
        <StatsSection />
        <ContactCTA />
      </main>

      <Footer />
    </>
  );
}
