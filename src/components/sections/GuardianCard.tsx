'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Guardian } from '@/lib/data/types';

interface GuardianCardProps {
  guardian: Guardian;
  className?: string;
}

export default function GuardianCard({ guardian, className }: GuardianCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn('text-center', className)}
    >
      {/* Photo */}
      <div className="mx-auto mb-5 w-32 h-32 md:w-40 md:h-40 relative">
        <div
          className={cn(
            'relative aspect-square rounded-full overflow-hidden',
            'border-[3px] border-white',
            'shadow-[var(--shadow-lg)]'
          )}
        >
          {guardian.image ? (
            <Image
              src={guardian.image}
              alt={guardian.name}
              fill
              sizes="(min-width: 768px) 160px, 128px"
              className="object-cover"
              style={{
                objectPosition: guardian.imagePosition ?? 'center 20%',
                ...(guardian.imageScale ? { transform: `scale(${guardian.imageScale})` } : {}),
              }}
            />
          ) : (
            <div className="w-full h-full bg-[var(--color-background-muted)] flex items-center justify-center">
              <span className="font-serif text-3xl text-[var(--color-foreground-faint)]">
                {guardian.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <h3 className="font-serif text-xl md:text-2xl tracking-tight text-[var(--color-foreground)]">
        {guardian.name}
      </h3>

      {/* Role */}
      <p className="label-sacred mt-2">
        {guardian.role}
      </p>

      {/* Bio */}
      {guardian.bio && (
        <p className="mt-4 text-sm text-[var(--color-foreground-muted)] leading-relaxed max-w-xs mx-auto">
          {guardian.bio}
        </p>
      )}
    </motion.div>
  );
}
