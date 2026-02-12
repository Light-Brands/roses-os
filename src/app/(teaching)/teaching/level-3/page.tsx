'use client';

import Link from 'next/link';
import { teachingLevels, techniques, chakras } from '@/lib/data';
import LevelNav from '@/components/teaching/LevelNav';
import ChakraChart from '@/components/teaching/ChakraChart';
import TechniqueCard from '@/components/teaching/TechniqueCard';

export default function Level3Page() {
  const level = teachingLevels[2];
  const levelTechniques = techniques.filter((t) => t.level === 3);

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
          ← All Levels
        </Link>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar nav on desktop, top tabs on mobile */}
        <aside className="md:w-64 md:min-h-[calc(100vh-57px)] md:border-r border-b md:border-b-0 border-[var(--color-border)] p-4 md:p-6">
          <LevelNav levels={teachingLevels} activeLevel={3} />
        </aside>

        {/* Main content */}
        <main className="flex-1 px-6 py-10 lg:py-14 max-w-4xl">
          <div className="space-y-12">
            <div className="space-y-3">
              <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-foreground)]">
                Level 3: {level.title}
              </h1>
              <p className="text-[var(--color-foreground-muted)] max-w-2xl">
                {level.description}
              </p>
            </div>

            {/* Chakra Chart */}
            <section className="space-y-4">
              <h2 className="font-serif text-2xl text-[var(--color-foreground)]">
                Chakra System
              </h2>
              <ChakraChart chakras={chakras} />
            </section>

            {/* Techniques */}
            <section className="space-y-6">
              <h2 className="font-serif text-2xl text-[var(--color-foreground)]">
                Techniques
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {levelTechniques.map((technique, index) => (
                  <TechniqueCard
                    key={technique.id ?? index}
                    technique={technique}
                    index={index}
                  />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
