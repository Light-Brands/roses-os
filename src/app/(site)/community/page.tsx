'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

import PageHero from '@/components/sections/PageHero';
import InvitationCTA from '@/components/sections/InvitationCTA';

// =============================================================================
// COMMUNITY PAGE
// =============================================================================

export default function CommunityPage() {
  const visionRef = useRef<HTMLElement>(null);
  const visionInView = useInView(visionRef, { once: true, margin: '-100px' });

  const participateRef = useRef<HTMLElement>(null);
  const participateInView = useInView(participateRef, { once: true, margin: '-100px' });

  return (
    <>
      {/* 1. Hero */}
      <PageHero
        eyebrow="Community"
        title="The Living Field"
        description="A network of practitioners devoted to coherent living. Supporting one another in the remembrance of what is real, what is true, and what is possible."
        image="/page-images/page-community.png"
      />

      {/* 2. Community Vision */}
      <section ref={visionRef} className="section-padding">
        <div className="container-premium max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={visionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="label-sacred mb-6"
          >
            Our Vision
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={visionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-6"
          >
            For Those Called to Coherent Living
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={visionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-[var(--color-foreground-muted)] leading-relaxed space-y-6"
          >
            <p>
              The ROSES OS community is not a membership club or a social network.
              It is a living field. A gathering of individuals who have chosen to
              walk the path of remembrance together. Here, you are not a follower.
              You are a fellow practitioner.
            </p>
            <p>
              We hold space for one another through daily practice, shared inquiry,
              and the quiet commitment to showing up as we are. The community
              exists because the journey home is supported, not solitary. We believe
              that coherence is contagious. That when one person remembers, it
              ripples through the field and touches everyone around them.
            </p>
            <p>
              <Link
                href="/coherence"
                className="underline underline-offset-4 decoration-[var(--color-rose-clay)] hover:text-[var(--color-foreground)] transition-colors duration-200"
              >
                Explore Coherence
              </Link>
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. How to Participate */}
      <section ref={participateRef} className="section-padding">
        <div className="container-premium max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={participateInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="label-sacred mb-6"
          >
            How to Participate
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={participateInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-6"
          >
            Join Through Practice
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={participateInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-[var(--color-foreground-muted)] leading-relaxed space-y-6"
          >
            <p>
              The doorway into the community is through the programs. When you
              enroll in The Rose or any of our offerings, you become part of a
              living field of practitioners. From there, the community grows
              organically, through shared practice, ongoing gatherings, and the
              quiet bonds that form when people walk this path together.
            </p>
            <p>
              If you feel called, we invite you to explore our{' '}
              <Link
                href="/offerings"
                className="underline underline-offset-4 decoration-[var(--color-rose-clay)] hover:text-[var(--color-foreground)] transition-colors duration-200"
              >
                current offerings
              </Link>{' '}
              and find the offering that resonates with where you are right now.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4. Invitation CTA */}
      <InvitationCTA />
    </>
  );
}
