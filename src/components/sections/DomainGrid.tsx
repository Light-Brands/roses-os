'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/Accordion';
import type { CoherenceDomain } from '@/lib/data/types';

// =============================================================================
// DOMAIN GRID
// 13 coherence domains as expandable accordion items.
// Click a domain to reveal its description — only one open at a time.
// =============================================================================

interface DomainGridProps {
  domains: CoherenceDomain[];
  className?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
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
      <div className="container-premium max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <Accordion type="single" variant="separated" className="space-y-2">
            {domains.map((domain) => (
              <motion.div key={domain.id} variants={itemVariants}>
                <AccordionItem
                  value={domain.id}
                  className={cn(
                    '!border-[var(--color-border-subtle)]',
                    '!bg-[var(--color-background-subtle)]',
                    '!rounded-xl',
                    'transition-all duration-300 ease-[var(--ease-smooth)]',
                    'hover:border-[var(--color-border)] hover:shadow-sm'
                  )}
                >
                  <AccordionTrigger
                    value={domain.id}
                    className={cn(
                      'py-5 px-6',
                      'hover:!bg-transparent',
                      'text-[var(--color-foreground)]'
                    )}
                  >
                    <span className="flex items-center gap-4">
                      <span
                        className={cn(
                          'font-serif text-2xl lg:text-3xl leading-none',
                          'text-[#9E956B]/50'
                        )}
                      >
                        {String(domain.number).padStart(2, '0')}
                      </span>
                      <span className="font-serif font-semibold text-base lg:text-lg text-[var(--color-foreground)] leading-snug">
                        {domain.title}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent
                    value={domain.id}
                    className="px-6 pb-5 pt-0"
                  >
                    <div className="pl-[calc(2rem+1rem)] lg:pl-[calc(2.25rem+1rem)]">
                      <p className="text-sm md:text-base text-[var(--color-foreground-muted)] leading-relaxed">
                        {domain.description}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
