'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  programs,
  scheduleStages,
  roseMeditationScheduleStages,
  aura2ScheduleStages,
  contributionTiers,
  roseMeditationTiers,
} from '@/lib/data';
import type { ScheduleStage, ContributionTier } from '@/lib/data/types';

import PageHero from '@/components/sections/PageHero';
import ProgramCard from '@/components/sections/ProgramCard';
import ScheduleTable from '@/components/sections/ScheduleTable';
import ContributionTiers from '@/components/sections/ContributionTiers';

// =============================================================================
// PROGRAM → SCHEDULE MAPPING
// =============================================================================

const programSchedules: Record<string, ScheduleStage[]> = {
  '1': scheduleStages,
  '2': aura2ScheduleStages,
  '3': roseMeditationScheduleStages,
};

// =============================================================================
// PROGRAM → CONTRIBUTION TIER MAPPING
// =============================================================================

const programTiers: Record<string, ContributionTier[]> = {
  '1': contributionTiers,
  '2': contributionTiers,
  '3': roseMeditationTiers,
};

// =============================================================================
// EASE CONSTANT
// =============================================================================

const ease = [0.16, 1, 0.3, 1] as const;

// =============================================================================
// OFFERINGS PAGE — Progressive Disclosure
// Programs → Schedule → Contribution → Enroll
// =============================================================================

export default function OfferingsClient() {
  return (
    <Suspense>
      <OfferingsContent />
    </Suspense>
  );
}

function OfferingsContent() {
  const searchParams = useSearchParams();
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
    null
  );
  const gridRef = useRef<HTMLElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-100px' });

  // Auto-select program from URL query param (e.g. /offerings?program=1)
  useEffect(() => {
    const programParam = searchParams.get('program');
    if (programParam && programs.some((p) => p.id === programParam)) {
      setSelectedProgramId(programParam);
    }
  }, [searchParams]);

  const handleProgramClick = (id: string) => {
    if (selectedProgramId === id) {
      setSelectedProgramId(null);
    } else {
      setSelectedProgramId(id);
    }
  };

  const selectedProgram = programs.find((p) => p.id === selectedProgramId);

  return (
    <>
      {/* 1. Hero */}
      <PageHero
        eyebrow="Offerings"
        title="Current Offerings"
        description="Guided pathways into the Rose field. Each program is a living invitation to deepen your practice, remember your coherence, and step into a community devoted to inner freedom."
        image="/page-images/page-programs.png"
      />

      {/* 2. Programs — progressive disclosure */}
      <section ref={gridRef} className="section-padding">
        <div className="container-premium max-w-3xl mx-auto">
          {/* Prompt */}
          <AnimatePresence>
            {!selectedProgramId && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease }}
                className="text-center text-[var(--color-foreground-muted)] mb-8"
              >
                Choose a program to explore its schedule, contribution, and what is included.
              </motion.p>
            )}
          </AnimatePresence>

          {/* Program cards */}
          <div className="space-y-4">
            {programs.map((program, i) => {
              const isSelected = selectedProgramId === program.id;
              const isOther = selectedProgramId !== null && !isSelected;

              return (
                <div key={program.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={
                      gridInView
                        ? {
                            opacity: isOther ? 0.55 : 1,
                            y: 0,
                            scale: isOther ? 0.98 : 1,
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      ease,
                    }}
                  >
                    <ProgramCard
                      program={program}
                      compact={!isSelected}
                      selected={isSelected}
                      onClick={() => handleProgramClick(program.id)}
                    />
                  </motion.div>

                  {/* Expanded content: Schedule → Contribution → CTA */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease }}
                        className="overflow-hidden"
                      >
                        {/* Schedule section */}
                        <div className="mt-8 mb-8">
                          <p className="label-sacred mb-3">Schedule</p>
                          <h3 className="font-serif text-[clamp(1.25rem,3vw,2rem)] leading-tight tracking-tight mb-2">
                            {program.title}
                          </h3>
                          <p className="text-sm text-[var(--color-foreground-muted)] mb-6">
                            {program.dates}
                          </p>
                          <ScheduleTable
                            stages={programSchedules[program.id] || []}
                          />
                        </div>

                        {/* Contribution section */}
                        <div className="pt-6 pb-4">
                          <p className="label-sacred mb-3">
                            Contribution
                          </p>
                          <h3 className="font-serif text-[clamp(1.25rem,3vw,2rem)] leading-tight tracking-tight mb-3">
                            Pay What Feels Right
                          </h3>
                          <p className="text-base text-[var(--color-foreground-muted)] leading-relaxed mb-8 max-w-2xl">
                            We trust you to choose the contribution that
                            feels right for where you are in life. There is
                            no judgment, only gratitude. Each tier sustains
                            this work and keeps it accessible to all who
                            are called.
                          </p>
                          <ContributionTiers tiers={programTiers[program.id] || contributionTiers} />
                          <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed mt-6 text-center italic">
                            Repeating a class? Your contribution is 50% of the original price.
                          </p>
                        </div>

                        {/* Enroll CTA */}
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.5,
                            delay: 0.3,
                            ease,
                          }}
                          className="text-center py-10"
                        >
                          <h3 className="font-serif text-[clamp(1.25rem,3vw,2rem)] leading-tight tracking-tight mb-3">
                            Ready to Begin?
                          </h3>
                          <p className="text-base text-[var(--color-foreground-muted)] leading-relaxed mb-6 max-w-lg mx-auto">
                            If something in these words resonates, we
                            invite you to take the next step. Enrollment
                            is open and we are here to support your
                            journey.
                          </p>
                          <Link
                            href={`/enroll?program=${program.id}`}
                            className={cn(
                              'inline-flex items-center gap-2 px-8 py-3.5 rounded-full',
                              'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]',
                              'text-sm font-medium',
                              'hover:bg-[var(--color-accent-hover)]',
                              'transition-all duration-200',
                              'shadow-sm hover:shadow-md'
                            )}
                          >
                            Enroll Now
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
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </Link>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
