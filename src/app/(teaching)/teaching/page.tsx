'use client';

import Link from 'next/link';
import { teachingLevels } from '@/lib/data';
import { openingAgreements, openingSacredCompanion, openingHistory } from '@/lib/data/teaching-slides';
import { PdfExportButton } from '@/components/ui/PdfExportButton';

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
        {/* Title */}
        <div className="space-y-3 text-center mb-12">
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-foreground)]">
            Teacher Visual Aid Manual
          </h1>
          <p className="text-[var(--color-foreground-muted)]">
            A facilitator&apos;s visual companion for teaching Rose Meditation.
          </p>
          <div className="pt-4">
            <PdfExportButton />
          </div>
        </div>

        {/* Opening — Agreements & Virtues */}
        <section className="mb-10 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 lg:p-8">
          <h2 className="font-serif text-xl text-[var(--color-foreground)] mb-3">
            {openingAgreements.title}
          </h2>
          <p className="text-sm text-[var(--color-foreground-muted)] mb-4">
            {openingAgreements.text}
          </p>
          <ul className="space-y-2">
            {openingAgreements.items.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-[var(--color-foreground)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#9E956B] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Opening — Sacred Companion */}
        <section className="mb-10 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 lg:p-8">
          <h2 className="font-serif text-xl text-[var(--color-foreground)] mb-4">
            {openingSacredCompanion.title}
          </h2>
          {openingSacredCompanion.paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-sm text-[var(--color-foreground-muted)] leading-relaxed mb-3"
            >
              {p}
            </p>
          ))}
          <div className="mt-4 border-t border-[var(--color-border-subtle)] pt-4">
            <p className="text-sm font-medium text-[var(--color-foreground)] mb-2">
              {openingSacredCompanion.guidelines.title}
            </p>
            <ul className="space-y-1.5">
              {openingSacredCompanion.guidelines.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-[var(--color-foreground-muted)]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9C6F6E] flex-shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-[var(--color-foreground-muted)] italic mt-4">
            {openingSacredCompanion.closing}
          </p>
        </section>

        {/* Opening — History & Lineage */}
        <section className="mb-12 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 lg:p-8">
          <h2 className="font-serif text-xl text-[var(--color-foreground)] mb-3">
            {openingHistory.title}
          </h2>
          <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed mb-4">
            {openingHistory.text}
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-[#9E956B]">
            <span className="font-serif">Lineage:</span>
            <span className="text-[var(--color-foreground-muted)]">{openingHistory.lineage}</span>
          </div>
        </section>

        {/* Level Selector */}
        <h2 className="font-serif text-2xl text-[var(--color-foreground)] text-center mb-6">
          Select a Teaching Level
        </h2>
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
