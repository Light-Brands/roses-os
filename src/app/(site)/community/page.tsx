'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, ChevronDown, CalendarPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { freePrograms, communityProgramsDetailed } from '@/lib/data';
import type { CommunityProgram, CommunityProgramDetailed, CommunityScheduleMonth } from '@/lib/data';

import PageHero from '@/components/sections/PageHero';
import InvitationCTA from '@/components/sections/InvitationCTA';

// =============================================================================
// EASE CONSTANT
// =============================================================================

const ease = [0.16, 1, 0.3, 1] as const;

// =============================================================================
// GOOGLE CALENDAR URL HELPER
// =============================================================================

const monthMap: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

function generateGoogleCalendarUrl(
  title: string,
  dateStr: string,
  timeStr: string,
  year: number = 2026
): string {
  // Parse date: "Thu, Mar 12" → month + day
  const dateParts = dateStr.split(/,\s*/);
  if (dateParts.length < 2) return '';
  const [monthStr, dayStr] = dateParts[1].trim().split(/\s+/);
  const month = monthMap[monthStr];
  const day = parseInt(dayStr);
  if (!month || isNaN(day)) return '';

  // Parse time: "12:00 – 1:30 pm" → start/end in 24h
  const timeParts = timeStr.split(/\s*[–-]\s*/);
  if (timeParts.length < 2) return '';

  const endMatch = timeParts[1].trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  const startMatch = timeParts[0].trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!endMatch || !startMatch) return '';

  let endHour = parseInt(endMatch[1]);
  const endMin = parseInt(endMatch[2]);
  const endPeriod = endMatch[3].toLowerCase();

  if (endPeriod === 'pm' && endHour !== 12) endHour += 12;
  if (endPeriod === 'am' && endHour === 12) endHour = 0;

  let startHour = parseInt(startMatch[1]);
  const startMin = parseInt(startMatch[2]);

  // Infer start AM/PM: hours 1-6 are PM, 7-11 are AM, 12 is noon
  if (startHour >= 1 && startHour <= 6) startHour += 12;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const startDate = `${year}${pad(month)}${pad(day)}T${pad(startHour)}${pad(startMin)}00`;
  const endDate = `${year}${pad(month)}${pad(day)}T${pad(endHour)}${pad(endMin)}00`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startDate}/${endDate}`,
    ctz: 'America/Costa_Rica',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// =============================================================================
// COMMUNITY SCHEDULE TABLE (month-based, no timezone)
// =============================================================================

function CommunitySchedule({
  months,
  label,
  programTitle,
}: {
  months: CommunityScheduleMonth[];
  label?: string;
  programTitle: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease }}
      className="w-full"
    >
      {label && (
        <p className="label-sacred mb-4">{label}</p>
      )}
      <div className="space-y-3">
        {months.map((month) => (
          <div
            key={month.month}
            className={cn(
              'border border-[var(--color-border)] rounded-xl overflow-hidden',
              'bg-[var(--color-background-elevated)]',
              'shadow-[var(--shadow-md)]'
            )}
          >
            <div className="px-5 py-4 md:px-6 md:py-5">
              <h4 className="font-serif text-lg md:text-xl text-[var(--color-foreground)] tracking-tight">
                {month.month}
              </h4>
            </div>
            <div className="px-5 pb-5 md:px-6 md:pb-6">
              <div className="hidden md:grid grid-cols-[1.5fr_1fr_auto] gap-4 pb-3 mb-3 border-b border-[var(--color-border-subtle)]">
                <span className="label-sacred">Date</span>
                <span className="label-sacred">Time</span>
                <span className="w-8" />
              </div>
              <div className="space-y-2">
                {month.dates.map((session, idx) => {
                  const calUrl = generateGoogleCalendarUrl(
                    programTitle,
                    session.date,
                    session.time
                  );

                  return (
                    <div
                      key={idx}
                      className={cn(
                        'py-2.5 text-sm',
                        idx < month.dates.length - 1 &&
                          'border-b border-[var(--color-border-subtle)]'
                      )}
                    >
                      {/* Mobile layout */}
                      <div className="md:hidden">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-baseline gap-3 min-w-0">
                            <span className="text-[var(--color-foreground-subtle)] font-medium">
                              {session.date}
                            </span>
                            <span className="text-[var(--color-foreground-muted)] shrink-0">
                              {session.time}
                            </span>
                          </div>
                          {calUrl && (
                            <a
                              href={calUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Add to Google Calendar"
                              className={cn(
                                'shrink-0 p-1.5 rounded-lg',
                                'text-[var(--color-foreground-faint)]',
                                'hover:text-[var(--color-rose-clay)]',
                                'hover:bg-rose-50 dark:hover:bg-rose-950/30',
                                'transition-colors duration-200'
                              )}
                            >
                              <CalendarPlus className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Desktop layout */}
                      <div className="hidden md:grid grid-cols-[1.5fr_1fr_auto] gap-4 items-center">
                        <span className="text-[var(--color-foreground-subtle)] font-medium">
                          {session.date}
                        </span>
                        <span className="text-[var(--color-foreground-muted)] tabular-nums">
                          {session.time}
                        </span>
                        {calUrl ? (
                          <a
                            href={calUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Add to Google Calendar"
                            className={cn(
                              'p-1.5 rounded-lg w-8 flex items-center justify-center',
                              'text-[var(--color-foreground-faint)]',
                              'hover:text-[var(--color-rose-clay)]',
                              'hover:bg-rose-50 dark:hover:bg-rose-950/30',
                              'transition-colors duration-200'
                            )}
                          >
                            <CalendarPlus className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="w-8" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// =============================================================================
// INVESTMENT DISPLAY
// =============================================================================

function InvestmentSection({
  investments,
}: {
  investments: CommunityProgramDetailed['investment'];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {investments.map((inv, index) => (
        <motion.div
          key={inv.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1, ease }}
          className={cn(
            'relative text-left rounded-2xl p-6 md:p-7',
            'border-2 border-[var(--color-border)]',
            'bg-[var(--color-background-subtle)]',
            'transition-all duration-300'
          )}
        >
          <span className="font-serif text-lg text-[var(--color-foreground)] tracking-tight block mb-3">
            {inv.label}
          </span>
          <p className="font-serif text-2xl text-[var(--color-foreground)] tracking-tight mb-2">
            {inv.price}
          </p>
          <p className="text-xs font-medium text-[var(--color-foreground-faint)]">
            {inv.period}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

// =============================================================================
// ACTIVITY CARD (for free programs)
// =============================================================================

function ActivityCard({
  program,
  index,
  inView,
}: {
  program: CommunityProgram;
  index: number;
  inView: boolean;
}) {
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
        'transition-all duration-500'
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

      {/* WhatsApp CTA */}
      {program.whatsAppUrl && (
        <div className="mt-5 pt-5 border-t border-rose-200/40 dark:border-rose-800/20">
          <a
            href={program.whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-2.5',
              'text-sm font-medium',
              'text-[var(--color-foreground)]',
              'underline underline-offset-4 decoration-[var(--color-rose-clay)]',
              'hover:text-[var(--color-rose-clay)] transition-colors duration-200'
            )}
          >
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Join WhatsApp Group
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      )}
    </motion.div>
  );
}

// =============================================================================
// DETAILED PROGRAM CARD (for Teacher Training & Aura for Life)
// =============================================================================

function DetailedProgramCard({
  program,
  index,
  inView,
  isSelected,
  isOther,
  onClick,
}: {
  program: CommunityProgramDetailed;
  index: number;
  inView: boolean;
  isSelected: boolean;
  isOther: boolean;
  onClick: () => void;
}) {
  const [scheduleOpen, setScheduleOpen] = useState(false);

  return (
    <div>
      {/* Collapsed card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={
          inView
            ? {
                opacity: isOther ? 0.55 : 1,
                y: 0,
                scale: isOther ? 0.98 : 1,
              }
            : {}
        }
        transition={{ duration: 0.5, delay: index * 0.1, ease }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={onClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick();
            }
          }}
          className={cn(
            'bg-[var(--color-background-subtle)] rounded-2xl p-6 md:p-8 lg:p-10',
            'transition-all duration-300',
            'cursor-pointer hover:shadow-[var(--shadow-md)]',
            isSelected && 'border-2 border-[var(--color-rose-clay)] shadow-[var(--shadow-md)]',
            !isSelected && 'border-2 border-transparent'
          )}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--color-foreground)]">
              {program.title}
            </h3>
            {!isSelected && (
              <ChevronRight className="w-5 h-5 text-[var(--color-foreground-faint)] shrink-0 ml-4" />
            )}
          </div>
          <p className="mt-3 text-base md:text-lg text-[var(--color-foreground-muted)] leading-relaxed">
            {program.intro[0]}
          </p>
        </div>
      </motion.div>

      {/* Expanded content */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease }}
            className="overflow-hidden"
          >
            <div className="mt-8 space-y-12">
              {/* Full introduction */}
              <div>
                <div className="text-base md:text-lg text-[var(--color-foreground-muted)] leading-relaxed space-y-4">
                  {program.intro.slice(1).map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Who is it for / Requirements */}
              <div>
                <p className="label-sacred mb-3">Minimum Requirement</p>
                <p className="text-base text-[var(--color-foreground)] leading-relaxed">
                  {program.requirement}
                </p>
                {program.requirementNote && (
                  <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed mt-2 italic">
                    {program.requirementNote}
                  </p>
                )}
              </div>

              {/* How classes work */}
              <div>
                <p className="label-sacred mb-3">How Do the Classes Work?</p>
                {program.howClassesWork.description && (
                  <p className="text-base text-[var(--color-foreground-muted)] leading-relaxed mb-4">
                    {program.howClassesWork.description}
                  </p>
                )}
                <ul className="space-y-2">
                  {program.howClassesWork.items.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05, ease }}
                      className="flex items-start gap-3 text-sm text-[var(--color-foreground-subtle)]"
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-rose-clay)] shrink-0"
                        aria-hidden="true"
                      />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Supervised practice */}
              <div>
                <p className="label-sacred mb-3">{program.supervisedPractice.title}</p>
                {program.supervisedPractice.description && (
                  <p className="text-base text-[var(--color-foreground-muted)] leading-relaxed mb-4">
                    {program.supervisedPractice.description}
                  </p>
                )}
                <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed mb-3">
                  During these meetings:
                </p>
                <ul className="space-y-2 mb-4">
                  {program.supervisedPractice.items.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05, ease }}
                      className="flex items-start gap-3 text-sm text-[var(--color-foreground-subtle)]"
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-rose-clay)] shrink-0"
                        aria-hidden="true"
                      />
                      {item}
                    </motion.li>
                  ))}
                </ul>
                <div className="text-sm text-[var(--color-foreground-muted)] leading-relaxed italic space-y-3">
                  {program.supervisedPractice.closing.split('\n\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              {/* Structure */}
              <div>
                <p className="label-sacred mb-3">Structure</p>
                <div className="flex flex-wrap gap-x-6 gap-y-3 mb-4 pb-4 border-b border-[var(--color-border)]">
                  <div>
                    <span className="label-sacred block mb-1">Format</span>
                    <span className="text-sm text-[var(--color-foreground-subtle)]">
                      {program.structure.format}
                    </span>
                  </div>
                  <div>
                    <span className="label-sacred block mb-1">Facilitation</span>
                    <span className="text-sm text-[var(--color-foreground-subtle)]">
                      {program.structure.facilitation}
                    </span>
                  </div>
                </div>
                {program.structure.note && (
                  <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed italic">
                    {program.structure.note}
                  </p>
                )}
              </div>

              {/* Investment */}
              <div>
                <p className="label-sacred mb-3">Investment</p>
                <InvestmentSection investments={program.investment} />
              </div>

              {/* Schedule */}
              <div>
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => setScheduleOpen(!scheduleOpen)}
                    className={cn(
                      'inline-flex items-center gap-2 text-sm font-medium',
                      'text-[var(--color-foreground-muted)]',
                      'hover:text-[var(--color-foreground)]',
                      'transition-colors duration-200'
                    )}
                  >
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 transition-transform duration-200',
                        scheduleOpen && 'rotate-180'
                      )}
                    />
                    {scheduleOpen ? 'Hide class schedule' : 'View 2026 class schedule'}
                  </button>
                </div>

                <AnimatePresence>
                  {scheduleOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease }}
                      className="overflow-hidden"
                    >
                      <CommunitySchedule
                        months={program.schedule}
                        label={program.scheduleLabel}
                        programTitle={program.title}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease }}
                className="text-center py-6"
              >
                <p className="text-base text-[var(--color-foreground-muted)] leading-relaxed mb-6 max-w-lg mx-auto">
                  If you feel called to join this program, we invite you to
                  reach out and begin your enrollment.
                </p>
                <Link
                  href="/contact"
                  className={cn(
                    'inline-flex items-center gap-2 px-8 py-3.5 rounded-full',
                    'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]',
                    'text-sm font-medium',
                    'hover:bg-[var(--color-accent-hover)]',
                    'transition-all duration-200',
                    'shadow-sm hover:shadow-md'
                  )}
                >
                  Get in Touch
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============================================================================
// COMMUNITY PAGE
// =============================================================================

export default function CommunityPage() {
  const visionRef = useRef<HTMLElement>(null);
  const visionInView = useInView(visionRef, { once: true, margin: '-100px' });

  const freeRef = useRef<HTMLElement>(null);
  const freeInView = useInView(freeRef, { once: true, margin: '-100px' });

  const paidRef = useRef<HTMLElement>(null);
  const paidInView = useInView(paidRef, { once: true, margin: '-100px' });

  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);

  const handleProgramClick = (id: string) => {
    setSelectedProgramId(selectedProgramId === id ? null : id);
  };

  return (
    <>
      {/* 1. Hero */}
      <PageHero
        eyebrow="Community"
        title="The Living Field"
        description="A network of practitioners devoted to coherent living. Ongoing gatherings, practices, and programs that nourish the field and support your journey."
        image="/page-images/page-community.png"
      />

      {/* 2. Community Vision */}
      <section ref={visionRef} className="section-padding">
        <div className="container-premium max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={visionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="label-sacred mb-6"
          >
            Our Vision
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={visionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-6"
          >
            For Those Called to Coherent Living
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={visionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="text-lg text-[var(--color-foreground-muted)] leading-relaxed space-y-6"
          >
            <p>
              The ROSES OS community is a living field. A gathering of individuals
              who have chosen to walk the path of remembrance together as fellow
              practitioners.
            </p>
            <p>
              We hold space for one another through daily practice, shared inquiry,
              and the quiet commitment to showing up as we are. The community
              exists because the journey home is supported, not solitary.
            </p>
            <p>
              Coherence is the state in which all dimensions of being: body,
              heart, mind, and soul, move as one integrated field. Not a concept
              to understand, but a reality to embody. We believe that coherence
              is contagious. That when one person remembers, it ripples through
              the field and touches everyone around them.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. Free Community Activities */}
      <section ref={freeRef} className="section-padding">
        <div className="container-premium max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={freeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="label-sacred mb-6"
          >
            Free Community Activities
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={freeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-4"
          >
            Open Spaces of Connection & Practice
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={freeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="text-base text-[var(--color-foreground-muted)] leading-relaxed mb-8"
          >
            We offer a few free spaces of connection and practice, open to the
            community, as a way to share the living essence of Aura Reading and
            Rose Meditation. These gatherings are invitations to experience, feel,
            and deepen without pressure, and with care.
          </motion.p>
          <div className="space-y-4">
            {freePrograms.map((program, i) => (
              <ActivityCard
                key={program.id}
                program={program}
                index={i}
                inView={freeInView}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Continued Programs — Progressive Disclosure */}
      <section ref={paidRef} className="section-padding">
        <div className="container-premium max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={paidInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="label-sacred mb-6"
          >
            Continued Programs
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={paidInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="font-serif text-[clamp(1.5rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-4"
          >
            Deepening the Path
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={paidInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="text-base text-[var(--color-foreground-muted)] leading-relaxed mb-8"
          >
            For those ready to go further, these programs offer sustained
            practice, mentorship, and the opportunity to embody and share this
            work at a deeper level.
          </motion.p>

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
                Select a program to view full details, schedule, and investment.
              </motion.p>
            )}
          </AnimatePresence>

          {/* Program cards with progressive disclosure */}
          <div className="space-y-4">
            {communityProgramsDetailed.map((program, i) => (
              <DetailedProgramCard
                key={program.id}
                program={program}
                index={i}
                inView={paidInView}
                isSelected={selectedProgramId === program.id}
                isOther={selectedProgramId !== null && selectedProgramId !== program.id}
                onClick={() => handleProgramClick(program.id)}
              />
            ))}
          </div>

          {/* CTA to Offerings */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={paidInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4, ease }}
            className="text-center mt-12"
          >
            <p className="text-base text-[var(--color-foreground-muted)] leading-relaxed mb-6 max-w-lg mx-auto">
              Looking for our foundational courses? Explore The Rose + Aura 1
              and Aura Reading Level 2 on our offerings page.
            </p>
            <Link
              href="/offerings"
              className={cn(
                'inline-flex items-center gap-2 px-8 py-3.5 rounded-full',
                'border-2 border-[var(--color-rose-clay)] text-[var(--color-rose-clay)]',
                'text-sm font-medium',
                'hover:bg-[var(--color-rose-clay)] hover:text-[var(--color-foreground-on-rose)]',
                'transition-all duration-200',
                'shadow-sm hover:shadow-md'
              )}
            >
              View Current Offerings
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
        </div>
      </section>

      {/* 5. Invitation CTA */}
      <InvitationCTA />
    </>
  );
}
