'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Reduce bottom padding so following content sits closer */
  compact?: boolean;
  /** Optional decorative accent image src */
  image?: string;
}

export default function PageHero({ eyebrow, title, description, compact, image }: PageHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const hasImage = Boolean(image);

  return (
    <section
      ref={ref}
      className={compact
        ? 'pt-22 md:pt-32 lg:pt-36 pb-5 md:pb-10 lg:pb-12'
        : 'pt-32 md:pt-40 lg:pt-48 section-padding'
      }
    >
      <div
        className={cn(
          'container-premium',
          hasImage &&
            'grid grid-cols-1 lg:grid-cols-[1fr_auto] lg:gap-12 xl:gap-16 items-center min-h-0'
        )}
      >
        <div className={hasImage ? 'lg:min-w-0' : undefined}>
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

        {image && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 lg:mt-0 flex shrink-0 pointer-events-none justify-center lg:justify-end"
          >
            <Image
              src={image}
              alt=""
              width={448}
              height={448}
              className="max-w-sm md:max-w-md w-full h-auto"
              priority={false}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
