'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TeachingSlide } from '@/lib/data/types';

interface TeachingSlideCardProps {
  slide: TeachingSlide;
  index?: number;
  className?: string;
}

export default function TeachingSlideCard({ slide, index = 0, className }: TeachingSlideCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const hasImage = slide.originalImage || slide.reimaginedImage;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.5,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        'rounded-xl overflow-hidden',
        'bg-[var(--color-surface)]',
        'border border-[var(--color-border-subtle)]',
        className
      )}
    >
      {/* Image Placeholder */}
      <div
        className={cn(
          'relative flex flex-col items-center justify-center gap-3',
          'aspect-[16/10]',
          'bg-[var(--color-background-subtle)]',
          'border-b-2 border-dashed border-[#9C6F6E]/40',
        )}
      >
        <ImageIcon className="w-10 h-10 text-[#9C6F6E]/40" strokeWidth={1.5} />
        <p className="font-serif text-lg text-[#9C6F6E]/70 text-center px-6">
          {slide.concept}
        </p>
        {hasImage && (
          <div className="text-xs text-[var(--color-foreground-faint)] text-center px-6 max-w-md space-y-0.5">
            {slide.reimaginedImage && (
              <p>Reimagined: {slide.reimaginedImage}</p>
            )}
            {slide.originalImage && (
              <p>Original: {slide.originalImage}</p>
            )}
          </div>
        )}
        {!hasImage && slide.imageNote && (
          <p className="text-xs text-[var(--color-foreground-faint)] text-center px-6 max-w-md">
            {slide.imageNote}
          </p>
        )}
        <span className="absolute top-3 left-3 text-[10px] font-medium uppercase tracking-wider text-[#9E956B]/60 bg-[#9E956B]/10 px-2 py-0.5 rounded-full">
          Slide {slide.slideNumber}
        </span>
      </div>

      {/* Teaching Text */}
      <div className="p-5 lg:p-6 space-y-3">
        <h3 className="font-serif font-semibold text-lg lg:text-xl text-[var(--color-foreground)]">
          {slide.concept}
        </h3>
        <div className="text-sm text-[var(--color-foreground-muted)] leading-relaxed whitespace-pre-line">
          {slide.teachingText}
        </div>
        {slide.imageNote && hasImage && (
          <p className="text-xs text-[var(--color-foreground-faint)] italic border-t border-[var(--color-border-subtle)] pt-3 mt-3">
            Designer note: {slide.imageNote}
          </p>
        )}
      </div>
    </motion.div>
  );
}
