'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Program } from '@/lib/data/types';

interface ProgramCardProps {
  program: Program;
  className?: string;
}

export default function ProgramCard({ program, className }: ProgramCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'bg-[var(--color-background-subtle)] rounded-2xl p-6 md:p-8 lg:p-10',
        className
      )}
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="font-serif text-2xl md:text-3xl tracking-tight text-[var(--color-foreground)]">
          {program.title}
        </h3>
        {program.subtitle && (
          <p className="mt-2 text-base md:text-lg text-[var(--color-foreground-muted)] leading-relaxed">
            {program.subtitle}
          </p>
        )}
      </div>

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

      {/* Description */}
      {program.description && (
        <p className="text-base text-[var(--color-foreground-muted)] leading-relaxed mb-6">
          {program.description}
        </p>
      )}

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
  );
}
