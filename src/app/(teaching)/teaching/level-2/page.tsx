'use client';

import Link from 'next/link';
import { teachingLevels } from '@/lib/data';
import { level2Slides, chakraSlides, level2CleansingSlides } from '@/lib/data/teaching-slides';
import LevelNav from '@/components/teaching/LevelNav';
import TeachingSlideCard from '@/components/teaching/TeachingSlideCard';
import ChakraSlideCard from '@/components/teaching/ChakraSlideCard';
import PrintPageButton from '@/components/teaching/PrintPageButton';
import ManualPdfButton from '@/components/teaching/ManualPdfButton';
import { manualPdfConfigs } from '@/lib/data/manual-pdf-paths';
import { ImageDownloadButton } from '@/components/teaching/ImageDownloadButton';
import LanguageSelector from '@/components/teaching/LanguageSelector';
import LevelNavigation from '@/components/teaching/LevelNavigation';
import EditorLink from '@/components/teaching/EditorLink';
import { useLanguage } from '@/lib/i18n';

export default function Level2Page() {
  const level = teachingLevels[1];
  const { t } = useLanguage();
  const levelT = t?.levels['2'];

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
          {t?.ui.rosesOs ?? 'International Aura School'}
        </Link>
        <div className="flex items-center gap-3">
          <EditorLink manualSlug="rose-meditation-level-2" />
          <Link
            href="/teaching"
            className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            &larr; {t?.ui.allLevels ?? 'All Levels'}
          </Link>
        </div>
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
                {levelT?.title ?? `Level 2: ${level.title}`}
              </h1>
              <p className="text-[var(--color-foreground-muted)] max-w-2xl">
                {levelT?.description ?? level.description}
              </p>
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                <PrintPageButton />
                <ManualPdfButton
                  paths={manualPdfConfigs[1].paths}
                  labels={manualPdfConfigs[1].labels}
                />
                <ImageDownloadButton slides={[...level2Slides, ...chakraSlides, ...level2CleansingSlides]} level={2} />
                <LanguageSelector />
              </div>
            </div>

            {/* Sacred Space Section */}
            <section className="space-y-8">
              <h2 className="font-serif text-2xl text-[var(--color-foreground)]">
                {t?.ui.sacredSpace ?? 'Preparing Your Space'}
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
                {t?.ui.theChakraSystem ?? 'The Chakra System'}
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
                {t?.ui.cleansingAndRecovery ?? 'Cleansing & Recovery'}
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
                {t?.ui.goldenStickyRoses ?? 'Golden Sticky Roses'}
              </h2>
              {goldenStickySlides.map((slide, index) => (
                <TeachingSlideCard
                  key={slide.id}
                  slide={slide}
                  index={index}
                />
              ))}
            </section>

            <LevelNavigation currentLevel={2} />
          </div>
        </main>
      </div>
    </div>
  );
}
