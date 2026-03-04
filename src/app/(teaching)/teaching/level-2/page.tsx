'use client';

import Link from 'next/link';
import { teachingLevels } from '@/lib/data';
import { level2Slides, chakraSlides, level2CleansingSlides } from '@/lib/data/teaching-slides';
import LevelNav from '@/components/teaching/LevelNav';
import TeachingSlideCard from '@/components/teaching/TeachingSlideCard';
import ChakraSlideCard from '@/components/teaching/ChakraSlideCard';
import { PdfExportButton } from '@/components/ui/PdfExportButton';

export default function Level2Page() {
  const level = teachingLevels[1];

  const sacredSpaceSlides = level2Slides.filter((s) => s.section === 'sacred-space');
  const chakraIntroSlides = level2Slides.filter((s) => s.section === 'chakras');
  const cleansingSlides = level2CleansingSlides.filter((s) => s.section === 'cleansing');
  const goldenStickySlides = level2CleansingSlides.filter((s) => s.section === 'golden-sticky');

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
        <Link
          href="/"
          className="font-sans text-sm font-medium tracking-wide uppercase text-[var(--color-foreground)]"
        >
          ROSES OS
        </Link>
        <Link
          href="/teaching"
          className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          &larr; All Levels
        </Link>
      </header>

      <div className="flex flex-col md:flex-row">
        <aside className="md:w-64 md:min-h-[calc(100vh-57px)] md:border-r border-b md:border-b-0 border-[var(--color-border)] p-4 md:p-6">
          <LevelNav levels={teachingLevels} activeLevel={2} />
        </aside>

        <main className="flex-1 px-6 py-10 lg:py-14 max-w-4xl">
          <div className="space-y-12">
            {/* Header */}
            <div className="space-y-3">
              <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-foreground)]">
                Level 2: {level.title}
              </h1>
              <p className="text-[var(--color-foreground-muted)] max-w-2xl">
                {level.description}
              </p>
              <PdfExportButton className="mt-4" />
            </div>

            {/* Sacred Space Section */}
            <section className="space-y-8">
              <h2 className="font-serif text-2xl text-[var(--color-foreground)]">
                Sacred Space
              </h2>
              {sacredSpaceSlides.map((slide, index) => (
                <TeachingSlideCard
                  key={slide.id}
                  slide={slide}
                  index={index}
                />
              ))}
            </section>

            {/* Chakra Introduction */}
            <section className="space-y-8">
              <h2 className="font-serif text-2xl text-[var(--color-foreground)]">
                The Chakra System
              </h2>
              {chakraIntroSlides.map((slide, index) => (
                <TeachingSlideCard
                  key={slide.id}
                  slide={slide}
                  index={index}
                />
              ))}

              {/* Individual Chakra Slides */}
              <div className="space-y-8">
                {chakraSlides.map((chakra, index) => (
                  <ChakraSlideCard
                    key={chakra.id}
                    chakra={chakra}
                    index={index}
                  />
                ))}
              </div>
            </section>

            {/* Cleansing & Recovery */}
            <section className="space-y-8">
              <h2 className="font-serif text-2xl text-[var(--color-foreground)]">
                Cleansing &amp; Recovery
              </h2>
              {cleansingSlides.map((slide, index) => (
                <TeachingSlideCard
                  key={slide.id}
                  slide={slide}
                  index={index}
                />
              ))}
            </section>

            {/* Golden Sticky Roses */}
            <section className="space-y-8">
              <h2 className="font-serif text-2xl text-[var(--color-foreground)]">
                Golden Sticky Roses
              </h2>
              {goldenStickySlides.map((slide, index) => (
                <TeachingSlideCard
                  key={slide.id}
                  slide={slide}
                  index={index}
                />
              ))}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
