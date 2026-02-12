'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface InvitationCTAProps {
  className?: string;
}

export default function InvitationCTA({ className }: InvitationCTAProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className={cn(
        'bg-warm-950 text-white',
        className
      )}
    >
      <div className="container-premium section-padding">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(2rem,5vw,3.5rem)] tracking-tight leading-tight"
          >
            The way is open.<br />
            Welcome home.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10"
          >
            <Link
              href="/invitation"
              className={cn(
                'inline-flex items-center px-8 py-3.5 rounded-full',
                'bg-warm-50 text-warm-950',
                'text-sm font-medium',
                'hover:bg-warm-100',
                'transition-colors duration-200'
              )}
            >
              Enter the Rose Field
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
