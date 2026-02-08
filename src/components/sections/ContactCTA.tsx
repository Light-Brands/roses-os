'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ContactCTA() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="bg-neutral-950 dark:bg-white text-white dark:text-neutral-900 transition-colors duration-200"
    >
      <div className="container-premium section-padding">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2rem,4vw,3rem)] tracking-tight leading-tight"
          >
            Let&apos;s create something together
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-lg text-neutral-400 dark:text-neutral-500 leading-relaxed"
          >
            Whether you have a clear brief or just a spark of an idea, we&apos;d love to hear from you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/contact"
              className={cn(
                'px-8 py-3.5 rounded-full',
                'bg-white dark:bg-neutral-900',
                'text-neutral-900 dark:text-white',
                'text-sm font-medium',
                'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                'transition-colors duration-200'
              )}
            >
              Start a Project
            </Link>
            <a
              href="mailto:hello@digitalcultures.co"
              className={cn(
                'px-8 py-3.5 rounded-full',
                'text-sm font-medium',
                'border border-neutral-700 dark:border-neutral-300',
                'text-neutral-300 dark:text-neutral-600',
                'hover:border-neutral-500 dark:hover:border-neutral-500',
                'hover:text-white dark:hover:text-neutral-900',
                'transition-all duration-200'
              )}
            >
              hello@digitalcultures.co
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
