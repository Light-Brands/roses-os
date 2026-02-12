'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Chakra } from '@/lib/data/types';

// =============================================================================
// CHAKRA CHART
// 7 colored circles in a vertical stack. Click to expand details showing
// balanced, unbalanced, and blockages information.
// =============================================================================

interface ChakraChartProps {
  chakras: Chakra[];
  className?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

function ChakraItem({ chakra }: { chakra: Chakra }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      layout
      className={cn(
        'rounded-xl overflow-hidden',
        'border border-[var(--color-border-subtle)]',
        'bg-[var(--color-background-elevated)]',
        'transition-shadow duration-300',
        isExpanded && 'shadow-md'
      )}
    >
      {/* Clickable header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center gap-4 p-4 lg:p-5',
          'text-left',
          'transition-colors duration-200',
          'hover:bg-[var(--color-background-subtle)]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset',
          'focus-visible:ring-[var(--color-rose-clay)]'
        )}
        aria-expanded={isExpanded}
      >
        {/* Chakra circle */}
        <motion.div
          className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: chakra.color }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-white font-serif font-semibold text-sm lg:text-base drop-shadow-sm">
            {chakra.number}
          </span>
        </motion.div>

        {/* Name + location */}
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-semibold text-base text-[var(--color-foreground)] leading-snug">
            {chakra.name}
          </h3>
          <p className="text-xs text-[var(--color-foreground-faint)]">
            {chakra.sanskritName} &middot; {chakra.location}
          </p>
        </div>

        {/* Element tag */}
        <span
          className={cn(
            'hidden sm:inline-flex',
            'text-xs font-medium px-2.5 py-1 rounded-full',
            'bg-[var(--color-background-subtle)]',
            'text-[var(--color-foreground-muted)]',
            'border border-[var(--color-border-subtle)]'
          )}
        >
          {chakra.element}
        </span>

        {/* Expand indicator */}
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-[var(--color-foreground-faint)]"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      {/* Expandable details */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 lg:px-5 lg:pb-6 pt-0">
              {/* Color bar divider */}
              <div
                className="h-px w-full mb-4 rounded-full opacity-30"
                style={{ backgroundColor: chakra.color }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Balanced */}
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--color-success)] mb-1.5">
                    Balanced
                  </p>
                  <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                    {chakra.balanced}
                  </p>
                </div>

                {/* Unbalanced */}
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--color-warning)] mb-1.5">
                    Unbalanced
                  </p>
                  <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                    {chakra.unbalanced}
                  </p>
                </div>

                {/* Blockages */}
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--color-error)] mb-1.5">
                    Blockages
                  </p>
                  <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                    {chakra.blockages}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ChakraChart({ chakras, className }: ChakraChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className={cn('w-full', className)}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="flex flex-col gap-3"
      >
        {chakras.map((chakra) => (
          <ChakraItem key={chakra.id} chakra={chakra} />
        ))}
      </motion.div>
    </div>
  );
}
