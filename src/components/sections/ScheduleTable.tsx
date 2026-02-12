'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ScheduleStage } from '@/lib/data/types';

type TimezoneKey = 'sanJose' | 'bogota' | 'newYork' | 'brasilia' | 'london' | 'madrid';

const timezoneLabels: Record<TimezoneKey, string> = {
  sanJose: 'San Jose',
  bogota: 'Bogota',
  newYork: 'New York',
  brasilia: 'Brasilia',
  london: 'London',
  madrid: 'Madrid',
};

interface ScheduleTableProps {
  stages: ScheduleStage[];
  className?: string;
}

export default function ScheduleTable({ stages, className }: ScheduleTableProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [timezone, setTimezone] = useState<TimezoneKey>('newYork');
  const [openStages, setOpenStages] = useState<string[]>(
    stages.length > 0 ? [stages[0].id] : []
  );

  const toggleStage = (id: string) => {
    setOpenStages((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

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

      {/* Stages accordion */}
      <div className="space-y-3">
        {stages.map((stage) => {
          const isOpen = openStages.includes(stage.id);

          return (
            <div
              key={stage.id}
              className={cn(
                'border border-[var(--color-border)] rounded-xl overflow-hidden',
                'bg-[var(--color-background-elevated)]',
                'transition-shadow duration-300',
                isOpen && 'shadow-[var(--shadow-md)]'
              )}
            >
              {/* Stage header */}
              <button
                type="button"
                onClick={() => toggleStage(stage.id)}
                aria-expanded={isOpen}
                className={cn(
                  'flex w-full items-center justify-between',
                  'px-5 py-4 md:px-6 md:py-5',
                  'text-left',
                  'hover:bg-[var(--color-background-subtle)]',
                  'transition-colors duration-200',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-rose-clay)]'
                )}
              >
                <div>
                  <h3 className="font-serif text-lg md:text-xl text-[var(--color-foreground)] tracking-tight">
                    {stage.title}
                  </h3>
                  <p className="text-sm text-[var(--color-foreground-faint)] mt-0.5">
                    {stage.dateRange}
                  </p>
                </div>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="shrink-0 ml-4"
                >
                  <ChevronDown className="w-5 h-5 text-[var(--color-foreground-faint)]" />
                </motion.span>
              </button>

              {/* Sessions content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 md:px-6 md:pb-6">
                      {/* Table header */}
                      <div className="grid grid-cols-[1fr_1.5fr_auto] gap-4 pb-3 mb-3 border-b border-[var(--color-border-subtle)]">
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
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: idx * 0.04,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className={cn(
                              'grid grid-cols-[1fr_1.5fr_auto] gap-4 py-2.5',
                              'text-sm',
                              idx < stage.sessions.length - 1 &&
                                'border-b border-[var(--color-border-subtle)]'
                            )}
                          >
                            <span className="text-[var(--color-foreground-subtle)] font-medium">
                              {session.day}
                            </span>
                            <span className="text-[var(--color-foreground-muted)]">
                              {session.duration}
                            </span>
                            <span className="text-[var(--color-foreground-faint)] tabular-nums whitespace-nowrap">
                              {session.time[timezone]}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
