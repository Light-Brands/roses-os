'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { SLIDE_SIZES, SLIDE_THUMB_SIZES } from '@/lib/image-sizes';

interface Slide {
  src: string;
  title: string;
}

interface TeachingSlidesProps {
  slides: Slide[];
}

export default function TeachingSlides({ slides }: TeachingSlidesProps) {
  const [current, setCurrent] = useState(0);

  const goTo = (index: number) => {
    if (index >= 0 && index < slides.length) setCurrent(index);
  };

  return (
    <div className="space-y-4">
      {/* Slide viewer */}
      <div className="relative rounded-xl border border-[var(--color-border)] bg-white overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full"
            style={{ aspectRatio: '4 / 3' }}
          >
            <Image
              src={slides[current].src}
              alt={slides[current].title}
              fill
              className="object-contain p-6"
              sizes={SLIDE_SIZES}
              priority={current === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={() => goTo(current - 1)}
              disabled={current === 0}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous slide"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => goTo(current + 1)}
              disabled={current === slides.length - 1}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next slide"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Slide info + dots */}
      <div className="flex items-center justify-between">
        <p className="font-serif text-lg text-[var(--color-foreground)]">
          {slides[current].title}
        </p>
        <span className="text-sm text-[var(--color-foreground-muted)]">
          {current + 1} / {slides.length}
        </span>
      </div>

      {/* Thumbnail strip */}
      {slides.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              onClick={() => goTo(i)}
              className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                i === current
                  ? 'border-[var(--color-accent)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-foreground-muted)]'
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                className="object-contain bg-white p-1"
                sizes={SLIDE_THUMB_SIZES}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
