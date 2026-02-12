'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { CoherenceDomain } from '@/lib/data/types';

// =============================================================================
// DOMAIN GRID
// 13 coherence domains in a responsive grid layout.
// =============================================================================

interface DomainGridProps {
  domains: CoherenceDomain[];
  className?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function DomainGrid({ domains, className }: DomainGridProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className={cn('section-padding', className)}>
      <div className="container-premium">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
        >
          {domains.map((domain) => (
            <motion.div
              key={domain.id}
              variants={cardVariants}
              className={cn(
                'group relative',
                'rounded-xl p-6',
                'bg-[var(--color-background-subtle)]',
                'border border-[var(--color-border-subtle)]',
                'transition-all duration-300 ease-[var(--ease-smooth)]',
                'hover:shadow-md hover:border-[var(--color-border)]',
                'hover:-translate-y-0.5'
              )}
            >
              {/* Domain number */}
              <span
                className={cn(
                  'block font-serif text-3xl lg:text-4xl leading-none',
                  'text-[#C4A86B]/40',
                  'mb-3',
                  'transition-colors duration-300',
                  'group-hover:text-[#C4A86B]/70'
                )}
              >
                {String(domain.number).padStart(2, '0')}
              </span>

              {/* Title */}
              <h3 className="font-serif font-semibold text-base text-[var(--color-foreground)] leading-snug mb-2">
                {domain.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                {domain.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
