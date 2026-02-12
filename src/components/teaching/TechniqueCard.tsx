'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Technique } from '@/lib/data/types';

// =============================================================================
// TECHNIQUE CARD
// Card for a single teaching technique. Shows title, description,
// and a category badge. Warm background, rounded-xl.
// =============================================================================

interface TechniqueCardProps {
  technique: Technique;
  index?: number;
  className?: string;
}

export default function TechniqueCard({ technique, index = 0, className }: TechniqueCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        'group rounded-xl p-5 lg:p-6',
        'bg-[var(--color-background-subtle)]',
        'border border-[var(--color-border-subtle)]',
        'transition-all duration-300 ease-[var(--ease-smooth)]',
        'hover:shadow-md hover:border-[var(--color-border)]',
        'hover:-translate-y-0.5',
        className
      )}
    >
      {/* Header: title + badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-serif font-semibold text-base lg:text-lg text-[var(--color-foreground)] leading-snug">
          {technique.title}
        </h3>

        {/* Category badge */}
        <span
          className={cn(
            'flex-shrink-0',
            'inline-flex items-center',
            'text-[11px] font-medium uppercase tracking-[0.1em]',
            'px-2.5 py-1 rounded-full',
            'bg-[#9E956B]/10 text-[#9E956B]',
            'border border-[#9E956B]/20'
          )}
        >
          {technique.category}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
        {technique.description}
      </p>

      {/* Level indicator */}
      <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)]">
        <span className="text-xs text-[var(--color-foreground-faint)]">
          Level {technique.level}
        </span>
      </div>
    </motion.div>
  );
}
