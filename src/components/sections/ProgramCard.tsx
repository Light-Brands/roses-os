'use client';

import { useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Program } from '@/lib/data/types';

interface ProgramCardProps {
  program: Program;
  className?: string;
  /** When true, only show title, subtitle, and meta — hide description & includes */
  compact?: boolean;
  /** Visual indicator that this card is the active selection */
  selected?: boolean;
  /** Make the card clickable */
  onClick?: () => void;
}

export default function ProgramCard({
  program,
  className,
  compact = false,
  selected = false,
  onClick,
}: ProgramCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const isClickable = !!onClick;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={cn(
        'bg-[var(--color-background-subtle)] rounded-2xl p-6 md:p-8 lg:p-10',
        'transition-all duration-300',
        isClickable && 'cursor-pointer hover:shadow-[var(--shadow-md)]',
        selected && 'border-2 border-[var(--color-rose-clay)] shadow-[var(--shadow-md)]',
        !selected && isClickable && 'border-2 border-transparent',
        className
      )}
    >
      {/* Header */}
      <div className={cn(compact ? 'mb-0' : 'mb-6')}>
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--color-foreground)]">
            {program.title}
          </h3>
          {isClickable && !selected && (
            <ChevronRight className="w-5 h-5 text-[var(--color-foreground-faint)] shrink-0 ml-4" />
          )}
        </div>
        {program.subtitle && (
          <p className="mt-2 text-base md:text-lg text-[var(--color-foreground-muted)] leading-relaxed">
            {program.subtitle}
          </p>
        )}
      </div>

      {/* Description, Meta & Includes — hidden in compact mode */}
      <AnimatePresence>
        {!compact && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            {/* Description — shown first and prominently */}
            {program.description && (
              <p className="text-base md:text-lg text-[var(--color-foreground-muted)] leading-relaxed mb-8">
                {program.description}
              </p>
            )}

            {/* Meta details */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 mb-6 pb-6 border-b border-[var(--color-border)]">
              {program.duration && (
                <div>
                  <span className="label-sacred block mb-1">Duration</span>
                  <span className="text-sm text-[var(--color-foreground-subtle)]">
                    {program.duration}
                  </span>
                </div>
              )}
              {program.dates && (
                <div>
                  <span className="label-sacred block mb-1">Dates</span>
                  <span className="text-sm text-[var(--color-foreground-subtle)]">
                    {program.dates}
                  </span>
                </div>
              )}
              {program.format && (
                <div>
                  <span className="label-sacred block mb-1">Format</span>
                  <span className="text-sm text-[var(--color-foreground-subtle)]">
                    {program.format}
                  </span>
                </div>
              )}
            </div>

            {/* Includes list */}
            {program.includes && program.includes.length > 0 && (
              <div>
                <span className="label-sacred block mb-3">Includes</span>
                <ul className="space-y-2">
                  {program.includes.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -8 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        duration: 0.4,
                        delay: 0.3 + index * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
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
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact meta — only shown in compact mode when not clickable */}
      {compact && !isClickable && (
        <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4">
          {program.duration && (
            <div>
              <span className="label-sacred block mb-1">Duration</span>
              <span className="text-sm text-[var(--color-foreground-subtle)]">
                {program.duration}
              </span>
            </div>
          )}
          {program.dates && (
            <div>
              <span className="label-sacred block mb-1">Dates</span>
              <span className="text-sm text-[var(--color-foreground-subtle)]">
                {program.dates}
              </span>
            </div>
          )}
          {program.format && (
            <div>
              <span className="label-sacred block mb-1">Format</span>
              <span className="text-sm text-[var(--color-foreground-subtle)]">
                {program.format}
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
