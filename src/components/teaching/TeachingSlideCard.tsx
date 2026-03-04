'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import type { TeachingSlide } from '@/lib/data/types';

interface TeachingSlideCardProps {
  slide: TeachingSlide;
  index?: number;
  className?: string;
}

function getImageSrc(slide: TeachingSlide): string | null {
  const filename = slide.reimaginedImage || slide.originalImage;
  if (!filename) return null;
  return `/rose med images/${filename}`;
}

export default function TeachingSlideCard({ slide, index = 0, className }: TeachingSlideCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useLanguage();

  const imageSrc = getImageSrc(slide);
  const slideT = t?.slides[slide.id];
  const concept = slideT?.concept ?? slide.concept;
  const teachingText = slideT?.teachingText ?? slide.teachingText;

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
      {/* Image Area */}
      {imageSrc ? (
        <div className="relative bg-[var(--color-background-subtle)]">
          <img
            src={imageSrc}
            alt={concept}
            className="w-full h-auto object-contain"
            loading="lazy"
          />
          <span className="absolute top-3 left-3 text-[10px] font-medium uppercase tracking-wider text-[#9E956B]/60 bg-[#9E956B]/10 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {t?.ui.slide ?? 'Slide'} {slide.slideNumber}
          </span>
        </div>
      ) : (
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
            {concept}
          </p>
          {slide.imageNote && (
            <p className="text-xs text-[var(--color-foreground-faint)] text-center px-6 max-w-md">
              {slide.imageNote}
            </p>
          )}
          <span className="absolute top-3 left-3 text-[10px] font-medium uppercase tracking-wider text-[#9E956B]/60 bg-[#9E956B]/10 px-2 py-0.5 rounded-full">
            {t?.ui.slide ?? 'Slide'} {slide.slideNumber}
          </span>
        </div>
      )}

      {/* Teaching Text */}
      <div className="p-5 lg:p-6 space-y-3">
        <h3 className="font-serif font-semibold text-lg lg:text-xl text-[var(--color-foreground)]">
          {concept}
        </h3>
        <div className="text-sm text-[var(--color-foreground-muted)] leading-relaxed whitespace-pre-line">
          {teachingText}
        </div>
        {slide.imageNote && imageSrc && (
          <p className="text-xs text-[var(--color-foreground-faint)] italic border-t border-[var(--color-border-subtle)] pt-3 mt-3">
            {t?.ui.designerNote ?? 'Designer note'}: {slide.imageNote}
          </p>
        )}
      </div>
    </motion.div>
  );
}
