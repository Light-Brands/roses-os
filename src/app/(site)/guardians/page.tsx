'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { guardians, brandQuotes } from '@/lib/data';

import PageHero from '@/components/sections/PageHero';
import GuardianCard from '@/components/sections/GuardianCard';
import QuoteBlock from '@/components/sections/QuoteBlock';
import InvitationCTA from '@/components/sections/InvitationCTA';

// =============================================================================
// PHILOSOPHICAL FOUNDATION MODAL
// =============================================================================

function PhilosophicalFoundationModal({ onClose }: { onClose: () => void }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 32 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'relative z-10 w-full max-w-2xl max-h-[85vh] mx-4',
          'bg-[var(--color-background)] rounded-2xl shadow-2xl',
          'overflow-y-auto overscroll-contain'
        )}
      >
        {/* Close button */}
        <div className="sticky top-0 z-10 flex justify-end p-4 pb-0">
          <button
            onClick={onClose}
            className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center',
              'bg-[var(--color-background)] shadow-sm border border-[var(--color-border)]',
              'text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]',
              'transition-colors duration-200'
            )}
            aria-label="Close"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-8 md:px-12 pb-12 pt-2">
          <p className="label-sacred mb-4">Philosophical Foundation</p>
          <h2 className="font-serif text-[clamp(1.5rem,3.5vw,2.25rem)] leading-tight tracking-tight mb-10">
            The Technologies of Remembrance
          </h2>

          <div className="space-y-12 text-[var(--color-foreground-muted)] leading-relaxed">
            {/* The Collapse of the Old Paradigms */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl text-[var(--color-foreground)] tracking-tight">
                The Collapse of the Old Paradigms
              </h3>
              <p>
                Every philosophy, ancient practice, religious system, psychological
                framework, and spiritual tradition that carried humanity through the
                centuries was perfect for its time.
              </p>
              <p>
                They were the wakes behind the boats of bold, brave, embodied spirits
                who dared to shape reality through the raw truth of the present moment.
              </p>
              <p>
                None of these paths were meant to harden into dogma. Dogma inevitably
                opens the door to manipulation, distortion, and the erosion of truth.
              </p>
              <p>
                Every great master embodied one thing above all else:{' '}
                <strong className="text-[var(--color-foreground)]">presence</strong>.
              </p>
              <p>
                Before history turned them into ascended figures, they first descended
                fully into the human experience. They remembered themselves as children
                of the Divine, supported by unseen forces, entrusted with a simple
                responsibility: to live in alignment with their most raw, unfiltered,
                and luminous nature.
              </p>
              <p>
                They were not extraordinary. They were radically ordinary. Fully human.
                Fully present. And that is what made them extraordinary.
              </p>
              <p>
                Their power did not come from doctrine or belief, but from how they met,
                embraced, and transformed the unfiltered reality of their time. Their
                presence awakened something real in those around them.
              </p>
              <p>
                With time, that living presence was imitated. Imitation became repetition.
                Repetition became a ritual. Ritual became tradition. And tradition, once
                separated from original presence, hardened into systems that preserved the
                form while losing the essence.
              </p>
              <p>
                These traditions were powerful, sincere, and deeply transformative. They
                shaped our evolution and carried us to this moment.
              </p>
              <p>
                <strong className="text-[var(--color-foreground)]">
                  But what brought us here will not take us where we need to go next.
                </strong>
              </p>
              <p>
                Humanity now lives at a speed, level of complexity, and degree of
                cognitive overload that none of the old systems were designed to hold.
                Not because they were wrong, but because they were crafted for realities
                that no longer exist.
              </p>
              <p>
                It is like attempting to climb Mount Everest today with equipment from
                the 1800s. Yes, with enough preparation, suffering, isolation, pain,
                unnecessary risk, and sheer will, someone could still reach the summit.
                A few did.
              </p>
              <p>
                But no one would choose those tools today unless they were attached to
                struggle, consciously seeking hardship for its own sake.
              </p>
              <p>
                Why carry more weight than required? Why rely on slower, heavier, riskier
                methods when lighter, safer, more precise, and more joyful technologies
                exist — tools that reach the same summit without fragmenting the body,
                the emotions or the mind.
              </p>
              <p>
                This does not make the path easier. It makes it{' '}
                <strong className="text-[var(--color-foreground)]">simpler</strong>.
                And simplicity is the bedrock of the universe.
              </p>
              <p>
                From simplicity, sophistication emerges. From simplicity arise beauty,
                coherence, and everything worth sustaining.
              </p>
            </div>

            {/* The Era of Acceleration */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl text-[var(--color-foreground)] tracking-tight">
                The Era of Acceleration
              </h3>
              <p>
                The old systems were stepping stones. They carried us here. But they
                were not designed for this era. Not for this acceleration. Not for this
                level of noise and fragmentation. Not for the complexity of the modern
                mind and heart.
              </p>
              <p>
                We do not need more complicated paths. We do not need more dogma, more
                identity, more philosophy, or more beliefs.
              </p>
              <p>
                <strong className="text-[var(--color-foreground)]">
                  We need technologies that meet this moment.
                </strong>
              </p>
              <p>
                Technologies that are simple, precise, effective, non-hierarchical, and
                scalable. Technologies aligned with a world awakening faster than its
                old frameworks can support. Technologies that restore joy, play, and
                connection as natural expressions of coherence and presence.
              </p>
              <p>
                As outer technologies evolve at quantum speed, our inner technologies
                must rise to meet them. As above, so below.
              </p>
              <p>
                These are not reinterpretations of the past. They are not hybrids,
                updates, or new-age collages of ancient traditions.{' '}
                <strong className="text-[var(--color-foreground)]">
                  They are the evolution.
                </strong>
              </p>
              <p>
                They are the contemporary architecture of heartware and soulware. The
                tools required for the quantum leap humanity is being asked to make now.
              </p>
              <p>
                Born from presence. Refined through coherence. Anchored in lived
                experience. They meet the world as it is — not as it was centuries ago.
              </p>
              <p>
                <strong className="text-[var(--color-foreground)]">
                  People are not failing. The tools are outdated.
                </strong>
              </p>
              <p>
                It is time to stop repeating the past and expecting a different future.
                It is time to choose what actually matches the world we live in now.
              </p>
            </div>

            {/* The Next Great Revolution */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl text-[var(--color-foreground)] tracking-tight">
                The Next Great Revolution
              </h3>
              <p>
                The next great revolution will not be technological alone. It will be a{' '}
                <strong className="text-[var(--color-foreground)]">
                  revolution of consciousness
                </strong>.
              </p>
              <p>
                Not a return to the past, but an evolution of the human that matches the
                velocity of the world it has created.
              </p>
              <p>
                We stand at a threshold no previous generation has faced. Outer
                technologies accelerating beyond inner maturity. Artificial intelligence
                shaping perception. Algorithms influencing emotion. Systems competing for
                the most precious resource of all:{' '}
                <strong className="text-[var(--color-foreground)]">attention</strong>.
              </p>
              <p>
                In every previous era, humanity expanded its tools to meet its needs.
                Today, our tools have outgrown us. They are faster than our nervous
                systems, louder than our intuition, and more persuasive than our inner
                voice.
              </p>
              <p>
                This is why the next revolution cannot be external. It must be internal.
                It must restore the coherence, clarity, and presence that allow a human
                being to remain sovereign in a world designed to fragment the mind.
              </p>
              <p>
                This revolution is not a preference. It is an evolutionary necessity.
              </p>
              <p>
                Every era has been carried forward by a symbol: fire, writing,
                mathematics, printing, electricity, the microchip. For this era, the
                symbol is{' '}
                <strong className="text-[var(--color-foreground)]">
                  consciousness itself
                </strong>.
              </p>
              <p>
                And the architecture that carries consciousness forward returns now in
                its simplest, purest, most contemporary form.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// =============================================================================
// GUARDIANS PAGE
// =============================================================================

const DIEGO_ID = '2';

export default function GuardiansPage() {
  const gridRef = useRef<HTMLElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-100px' });
  const [showPhilosophy, setShowPhilosophy] = useState(false);

  return (
    <>
      {/* 1. Hero */}
      <PageHero
        eyebrow="Guardians"
        title="The Keepers of the Rose Field"
        description="The Guardians are devoted practitioners and stewards of the Rose technology. Each one brings a unique gift to the field, holding space, guiding practice, and nurturing the community with presence and care."
        image="/page-images/page-guardians.png"
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

                {/* Diego: link to philosophical foundation */}
                {guardian.id === DIEGO_ID && (
                  <div className="text-center mt-3">
                    <button
                      onClick={() => setShowPhilosophy(true)}
                      className={cn(
                        'text-xs tracking-[0.1em] uppercase font-medium',
                        'text-[var(--color-foreground-faint)]',
                        'hover:text-[var(--color-foreground-muted)]',
                        'transition-colors duration-200',
                        'underline underline-offset-4 decoration-[var(--color-border)]',
                        'hover:decoration-[var(--color-foreground-faint)]'
                      )}
                    >
                      Di&apos;s Letter: Philosophical Foundation
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Philosophical Foundation Modal */}
      <AnimatePresence>
        {showPhilosophy && (
          <PhilosophicalFoundationModal
            onClose={() => setShowPhilosophy(false)}
          />
        )}
      </AnimatePresence>

      {/* 4. Quote */}
      <QuoteBlock
        quote={brandQuotes[3].text}
        variant="fullbleed"
      />

      {/* 5. Invitation CTA */}
      <InvitationCTA />
    </>
  );
}
