'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Capacity } from '@/lib/data/types';

// =============================================================================
// ELEVEN CAPACITIES
// Numbered list with scroll-reveal animation per item.
// =============================================================================

interface ElevenCapacitiesProps {
  capacities: Capacity[];
  className?: string;
}

function CapacityItem({ capacity, index }: { capacity: Capacity; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.6,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        'group flex gap-5 lg:gap-6',
        'py-6 lg:py-7',
        'border-b border-[var(--color-border-subtle)]',
        'last:border-b-0'
      )}
    >
      {/* Number */}
      <span
        className={cn(
          'flex-shrink-0',
          'font-serif text-2xl lg:text-3xl leading-none',
          'text-[#C4A86B]/50',
          'w-10 lg:w-12 text-right',
          'transition-colors duration-300',
          'group-hover:text-[#C4A86B]/80'
        )}
      >
        {String(capacity.number).padStart(2, '0')}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-serif font-semibold text-base lg:text-lg text-[var(--color-foreground)] leading-snug mb-1.5">
          {capacity.title}
        </h3>
        <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
          {capacity.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function ElevenCapacities({ capacities, className }: ElevenCapacitiesProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className={cn('section-padding', className)}>
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          {capacities.map((capacity, index) => (
            <CapacityItem
              key={capacity.id}
              capacity={capacity}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
