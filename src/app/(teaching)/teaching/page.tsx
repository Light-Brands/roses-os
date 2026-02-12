'use client';

import Link from 'next/link';
import { teachingLevels } from '@/lib/data';

export default function TeachingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="px-6 py-4 border-b border-[var(--color-border)]">
        <Link
          href="/"
          className="font-sans text-sm font-medium tracking-wide uppercase text-[var(--color-foreground)]"
        >
          ROSES OS
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
        <div className="space-y-3 text-center mb-12">
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-foreground)]">
            Teacher Visual Aid Manual
          </h1>
          <p className="text-[var(--color-foreground-muted)]">
            Select a teaching level to begin.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {teachingLevels.map((level) => (
            <Link
              key={level.level}
              href={`/teaching/level-${level.level}`}
              className="group rounded-xl bg-[var(--color-surface)] p-6 transition-shadow hover:shadow-lg border border-[var(--color-border)]"
            >
              <div className="space-y-3">
                <span className="inline-block text-xs font-medium uppercase tracking-wider text-[var(--color-foreground-muted)]">
                  Level {level.level}
                </span>
                <h2 className="font-serif text-xl text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors">
                  {level.title}
                </h2>
                <p className="text-sm text-[var(--color-foreground-muted)]">
                  {level.subtitle}
                </p>
                <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                  {level.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
