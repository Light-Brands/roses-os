'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Reduce bottom padding so following content sits closer */
  compact?: boolean;
}

export default function PageHero({ eyebrow, title, description, compact }: PageHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section
      ref={ref}
      className={compact
        ? 'pt-22 md:pt-32 lg:pt-36 pb-5 md:pb-10 lg:pb-12'
        : 'pt-32 md:pt-40 lg:pt-48 section-padding'
      }
    >
      <div className="container-premium">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-foreground-faint)] mb-4"
          >
            {eyebrow}
          </motion.p>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[clamp(2.5rem,5vw,4rem)] tracking-tight leading-tight"
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 md:mt-6 text-base md:text-xl text-[var(--color-foreground-muted)] max-w-2xl leading-relaxed"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
