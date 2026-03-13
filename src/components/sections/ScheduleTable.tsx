'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ScheduleStage } from '@/lib/data/types';

type TimezoneKey = 'mexicoCity' | 'newYork' | 'brasilia' | 'london';

const timezoneLabels: Record<TimezoneKey, string> = {
  mexicoCity: 'Mexico City',
  newYork: 'New York',
  brasilia: 'Brasilia',
  london: 'London',
};

const timezoneAbbreviations: Record<TimezoneKey, string> = {
  mexicoCity: 'CST',
  newYork: 'EST',
  brasilia: 'BRT',
  london: 'GMT',
};

interface ScheduleTableProps {
  stages: ScheduleStage[];
  className?: string;
}

export default function ScheduleTable({ stages, className }: ScheduleTableProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [timezone, setTimezone] = useState<TimezoneKey>('newYork');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn('w-full', className)}
    >
      {/* Timezone selector */}
      <div className="flex items-center justify-end mb-6">
        <label className="label-sacred mr-3" htmlFor="tz-select">
          Timezone
        </label>
        <div className="relative">
          <select
            id="tz-select"
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

      {/* Stages — all shown open */}
      <div className="space-y-3">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={cn(
              'border border-[var(--color-border)] rounded-xl overflow-hidden',
              'bg-[var(--color-background-elevated)]',
              'shadow-[var(--shadow-md)]'
            )}
          >
            {/* Stage header */}
            <div className="px-5 py-4 md:px-6 md:py-5">
              <h3 className="font-serif text-lg md:text-xl text-[var(--color-foreground)] tracking-tight">
                {stage.title}
              </h3>
              <p className="text-sm text-[var(--color-foreground-faint)] mt-0.5">
                {stage.dateRange}
              </p>
            </div>

            {/* Sessions content */}
            <div className="px-5 pb-5 md:px-6 md:pb-6">
              {/* Table header – hidden on mobile, shown on md+ */}
              <div className="hidden md:grid grid-cols-[1.5fr_1fr_1.5fr] gap-4 pb-3 mb-3 border-b border-[var(--color-border-subtle)]">
                <span className="label-sacred">Day</span>
                <span className="label-sacred">Duration</span>
                <span className="label-sacred">Time</span>
              </div>

              {/* Session rows */}
              <div className="space-y-2">
                {stage.sessions.map((session, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.3,
                      delay: idx * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={cn(
                      'py-2.5 text-sm',
                      idx < stage.sessions.length - 1 &&
                        'border-b border-[var(--color-border-subtle)]'
                    )}
                  >
                    {/* Mobile layout: stacked rows */}
                    <div className="md:hidden">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[var(--color-foreground-subtle)] font-medium">
                          {session.day}
                        </span>
                        <span className="text-[var(--color-foreground-muted)] shrink-0">
                          {session.duration}
                        </span>
                      </div>
                      <p className="text-[var(--color-foreground-faint)] tabular-nums text-xs mt-1">
                        {session.time[timezone]}{' '}
                        <span className="text-[var(--color-foreground-faint)] text-xs">{timezoneAbbreviations[timezone]}</span>
                      </p>
                    </div>

                    {/* Desktop layout: 3-column grid */}
                    <div className="hidden md:grid grid-cols-[1.5fr_1fr_1.5fr] gap-4">
                      <span className="text-[var(--color-foreground-subtle)] font-medium">
                        {session.day}
                      </span>
                      <span className="text-[var(--color-foreground-muted)]">
                        {session.duration}
                      </span>
                      <span className="text-[var(--color-foreground-faint)] tabular-nums whitespace-nowrap">
                        {session.time[timezone]}{' '}
                        <span className="text-xs">{timezoneAbbreviations[timezone]}</span>
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* WhatsApp footnote */}
      <p className="text-xs text-[var(--color-foreground-faint)] mt-4 italic">
        * For the most up-to-date information on times and dates, please check the WhatsApp channel.
      </p>
    </motion.div>
  );
}
