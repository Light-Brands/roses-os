'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  programs,
  paidPrograms,
  scheduleStages,
  roseMeditationScheduleStages,
  aura2ScheduleStages,
  contributionTiers,
  roseMeditationTiers,
} from '@/lib/data';
import type { ScheduleStage, ContributionTier, TimeZoneEntry, CommunityProgram, ProgramDetailSection } from '@/lib/data/types';

import PageHero from '@/components/sections/PageHero';
import ProgramCard from '@/components/sections/ProgramCard';
import ScheduleTable from '@/components/sections/ScheduleTable';
import ContributionTiers from '@/components/sections/ContributionTiers';
import InvitationCTA from '@/components/sections/InvitationCTA';
import SubscribeCalendar from '@/components/ui/SubscribeCalendar';
import SummaryDownloadButton from '@/components/ui/SummaryDownloadButton';
import PaidProgramsDownloadButton from '@/components/ui/PaidProgramsDownloadButton';

// =============================================================================
// TIMEZONE SELECTOR (for continued programs)
// =============================================================================

type TimezoneKey = keyof TimeZoneEntry;

const timezoneLabels: Record<TimezoneKey, string> = {
  sanJose: 'San Jose',
  bogota: 'Bogota',
  newYork: 'New York',
  brasilia: 'Brasilia',
  london: 'London',
  madrid: 'Madrid',
};

const timezoneAbbreviations: Record<TimezoneKey, string> = {
  sanJose: 'CST',
  bogota: 'COT',
  newYork: 'EST',
  brasilia: 'BRT',
  london: 'GMT',
  madrid: 'CET',
};

// =============================================================================
// CONTINUED PROGRAM CARD
// =============================================================================

function ContinuedProgramCard({
  program,
  index,
  inView,
  expanded,
  onToggle,
}: {
  program: CommunityProgram;
  index: number;
  inView: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}) {
  const hasDetails = program.scheduleCycles || program.investment;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease }}
      className={cn(
        'rounded-2xl p-6 sm:p-8',
        'bg-gradient-to-b from-rose-50/80 to-[var(--color-background)]',
        'dark:from-rose-950/30 dark:to-[var(--color-background)]',
        'border border-rose-200/50 dark:border-rose-800/20',
        'hover:border-rose-300 dark:hover:border-rose-700/40',
        'hover:shadow-lg hover:shadow-rose-500/5',
        'transition-all duration-500',
        expanded && 'border-rose-300 dark:border-rose-700/40 shadow-lg shadow-rose-500/5'
      )}
    >
      <h3 className="font-serif text-[clamp(1.15rem,2.5vw,1.5rem)] leading-tight tracking-tight mb-3 text-[var(--color-foreground)]">
        {program.title}
      </h3>
      <div className="text-[var(--color-foreground-muted)] leading-relaxed text-sm sm:text-base mb-4 space-y-3">
        {program.description.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      {program.facilitation && (
        <p className="text-sm text-[var(--color-foreground-muted)] mb-4">
          <span className="font-medium text-[var(--color-foreground-subtle)]">Facilitation:</span>{' '}
          {program.facilitation}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        {program.schedule && (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
              'bg-rose-100/80 dark:bg-rose-900/30',
              'text-rose-700 dark:text-rose-300',
              'border border-rose-200/60 dark:border-rose-800/30'
            )}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {program.schedule}
          </span>
        )}
        {program.audience && (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
              'bg-[#9E956B]/10 dark:bg-[#9E956B]/15',
              'text-[#7A7352] dark:text-[#C4BA8A]',
              'border border-[#9E956B]/20 dark:border-[#9E956B]/25'
            )}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {program.audience}
          </span>
        )}
      </div>
      {(program.whatsappLink || program.calendarLink) && (
        <div className="flex flex-wrap gap-3 mt-5">
          {program.whatsappLink && (
            <a
              href={program.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center gap-2 px-5 py-2.5 rounded-full',
                'bg-[#25D366] text-white',
                'text-sm font-medium',
                'hover:bg-[#1EBE57]',
                'transition-all duration-200',
                'shadow-sm hover:shadow-md'
              )}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Join WhatsApp Group
            </a>
          )}
          {program.calendarLink && program.googleCalendarUrl && (
            <SubscribeCalendar
              googleCalendarUrl={program.googleCalendarUrl}
              icsUrl={program.calendarLink}
            />
          )}
        </div>
      )}

      {/* View Details toggle for programs with schedule/investment */}
      {hasDetails && onToggle && (
        <button
          onClick={onToggle}
          className={cn(
            'mt-6 inline-flex items-center gap-2',
            'text-sm font-medium',
            'text-[var(--color-foreground-muted)]',
            'hover:text-[var(--color-foreground)]',
            'transition-colors duration-200'
          )}
        >
          {expanded ? 'Hide Schedule & Investment' : 'View 2026 Schedule & Investment'}
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform duration-300',
              expanded && 'rotate-180'
            )}
          />
        </button>
      )}
    </motion.div>
  );
}

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
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<TimezoneKey>('newYork');
  const gridRef = useRef<HTMLElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-100px' });
  const continuedRef = useRef<HTMLElement>(null);
  const continuedInView = useInView(continuedRef, { once: true, margin: '-100px' });

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

  const handleContinuedToggle = (id: string) => {
    setExpandedProgramId((prev) => (prev === id ? null : id));
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

      {/* Download PDF Guide */}
      <div className="flex justify-center py-6 print:hidden">
        <SummaryDownloadButton variant="light" />
      </div>

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

      {/* 3. Continued Programs — Go Deeper */}
      <section ref={continuedRef} className="section-padding">
        <div className="container-premium max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={continuedInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="label-sacred mb-6"
          >
            Continued Programs
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={continuedInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-4"
          >
            Deepening the Path
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={continuedInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="text-base text-[var(--color-foreground-muted)] leading-relaxed mb-8"
          >
            For those ready to go further, these programs offer sustained
            practice, mentorship, and the opportunity to embody and share this
            work at a deeper level.
          </motion.p>
          <div className="space-y-4">
            {paidPrograms.map((program, i) => {
              const isExpanded = expandedProgramId === program.id;

              return (
                <div key={program.id}>
                  <ContinuedProgramCard
                    program={program}
                    index={i}
                    inView={continuedInView}
                    expanded={isExpanded}
                    onToggle={() => handleContinuedToggle(program.id)}
                  />

                  {/* Expanded: Schedule + Investment */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease }}
                        className="overflow-hidden"
                      >
                        {/* Detail sections (requirements, how classes work, etc.) */}
                        {program.detailSections && program.detailSections.length > 0 && (
                          <div className="mt-8 mb-4 space-y-6">
                            {program.detailSections.map((section, sIdx) => (
                              <div key={sIdx}>
                                <p className="label-sacred mb-2">{section.heading}</p>
                                <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                                  {section.body}
                                </p>
                                {section.bullets && (
                                  <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-foreground-muted)]">
                                    {section.bullets.map((bullet, bIdx) => (
                                      <li key={bIdx} className="flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400/60 shrink-0" />
                                        {bullet}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Schedule section */}
                        {program.scheduleCycles && (
                          <div className="mt-8 mb-8">
                            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                              <div>
                                <p className="label-sacred mb-3">Schedule</p>
                                <h3 className="font-serif text-[clamp(1.25rem,3vw,2rem)] leading-tight tracking-tight">
                                  2026 Class Schedule
                                </h3>
                              </div>
                              <div className="flex items-center">
                                <label className="label-sacred mr-3" htmlFor={`tz-select-${program.id}`}>
                                  Timezone
                                </label>
                                <div className="relative">
                                  <select
                                    id={`tz-select-${program.id}`}
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value as TimezoneKey)}
                                    className={cn(
                                      'appearance-none cursor-pointer',
                                      'bg-[var(--color-background-subtle)] border border-[var(--color-border)]',
                                      'rounded-lg px-4 py-2 pr-9',
                                      'text-sm text-[var(--color-foreground-subtle)]',
                                      'focus-premium',
                                      'transition-colors duration-200'
                                    )}
                                  >
                                    {(Object.keys(timezoneLabels) as TimezoneKey[]).map((tz) => (
                                      <option key={tz} value={tz}>
                                        {timezoneLabels[tz]}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-foreground-faint)] pointer-events-none"
                                    aria-hidden="true"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              {program.scheduleCycles.map((cycle) => (
                                <div
                                  key={cycle.id}
                                  className={cn(
                                    'border border-[var(--color-border)] rounded-xl overflow-hidden',
                                    'bg-[var(--color-background-elevated)]',
                                    'shadow-[var(--shadow-md)]'
                                  )}
                                >
                                  {/* Cycle header */}
                                  <div className="px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5">
                                    <h4 className="font-serif text-base sm:text-lg md:text-xl text-[var(--color-foreground)] tracking-tight">
                                      {cycle.title}
                                    </h4>
                                  </div>

                                  {/* Month groups */}
                                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 md:px-6 md:pb-6">
                                    {cycle.months.map((month, monthIdx) => (
                                      <div key={month.month} className={cn(monthIdx > 0 && 'mt-4')}>
                                        <p className="label-sacred mb-2 text-xs">
                                          {month.month}
                                        </p>
                                        <div className="space-y-1">
                                          {month.sessions.map((session, sIdx) => (
                                            <div
                                              key={sIdx}
                                              className={cn(
                                                'flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-3 py-2.5 sm:py-2 text-sm',
                                                sIdx < month.sessions.length - 1 &&
                                                  'border-b border-[var(--color-border-subtle)]'
                                              )}
                                            >
                                              <span className="text-[var(--color-foreground-subtle)] font-medium">
                                                {session.date}
                                              </span>
                                              <span className="text-[var(--color-foreground-muted)] tabular-nums shrink-0 text-xs sm:text-sm">
                                                {session.time[timezone]}{' '}
                                                <span className="text-[var(--color-foreground-faint)] text-xs">{timezoneAbbreviations[timezone]}</span>
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Investment section */}
                        {program.investment && (
                          <div className="pt-6 pb-4">
                            <p className="label-sacred mb-3">Investment</p>
                            <h3 className="font-serif text-[clamp(1.25rem,3vw,2rem)] leading-tight tracking-tight mb-6">
                              {program.title}
                            </h3>

                            <div className={cn(
                              'grid gap-4',
                              program.investment.length === 3
                                ? 'sm:grid-cols-3'
                                : 'sm:grid-cols-2'
                            )}>
                              {program.investment.map((option) => (
                                <div
                                  key={option.id}
                                  className={cn(
                                    'rounded-xl p-5',
                                    'border border-[var(--color-border)]',
                                    'bg-[var(--color-background-elevated)]',
                                    'shadow-[var(--shadow-md)]',
                                    'text-center'
                                  )}
                                >
                                  <p className="font-serif text-lg text-[var(--color-foreground)] mb-1">
                                    {option.label}
                                  </p>
                                  <p className="text-xs text-[var(--color-foreground-faint)] mb-3">
                                    {option.period}
                                  </p>
                                  <p className="font-serif text-2xl text-[var(--color-foreground)] tracking-tight">
                                    {option.price}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Download Additional Programs Guide */}
          <div className="flex justify-center pt-8 print:hidden">
            <PaidProgramsDownloadButton variant="light" />
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA */}
      <InvitationCTA />
    </>
  );
}
