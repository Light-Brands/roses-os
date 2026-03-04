'use client';

import Link from 'next/link';
import { teachingLevels } from '@/lib/data';
import { openingAgreements, openingSacredCompanion, openingHistory } from '@/lib/data/teaching-slides';
import { PdfExportButton } from '@/components/ui/PdfExportButton';
import LanguageSelector from '@/components/teaching/LanguageSelector';
import { useLanguage } from '@/lib/i18n';

export default function TeachingPage() {
  const { t } = useLanguage();

  const agreements = t?.opening.agreements ?? openingAgreements;
  const history = t?.opening.history ?? openingHistory;
  const scT = t?.opening.sacredCompanion;
  const guidelinesTitle = scT?.guidelinesTitle ?? openingSacredCompanion.guidelines.title;
  const guidelinesItems = scT?.guidelinesItems ?? openingSacredCompanion.guidelines.items;
  const scTitle = scT?.title ?? openingSacredCompanion.title;
  const scParagraphs = scT?.paragraphs ?? openingSacredCompanion.paragraphs;
  const scClosing = scT?.closing ?? openingSacredCompanion.closing;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="px-6 py-4 border-b border-[var(--color-border)]">
        <Link
          href="/"
          className="font-sans text-sm font-medium tracking-wide uppercase text-[var(--color-foreground)]"
        >
          {t?.ui.rosesOs ?? 'ROSES OS'}
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
        {/* ROSES OS Hero Header */}
        <div className="flex flex-col items-center justify-center mb-12">
          <img
            src="/rose.png"
            alt="ROSES OS"
            width={72}
            height={72}
            className="object-contain mb-4"
          />
          <h1 className="font-serif text-4xl md:text-5xl tracking-wide text-[var(--color-foreground)] mb-2">
            {t?.ui.rosesOs ?? 'ROSES OS'}
          </h1>
          <p className="text-sm uppercase tracking-widest text-[var(--color-foreground-muted)] mb-6">
            {t?.ui.teacherVisualAidManual ?? 'Teacher Visual Aid Manual'}
          </p>
          <p className="text-[var(--color-foreground-muted)] text-center max-w-lg">
            {t?.ui.facilitatorCompanion ?? 'A facilitator\u2019s visual companion for teaching Rose Meditation.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-4">
            <PdfExportButton />
            <LanguageSelector />
          </div>
        </div>

        {/* Opening — Agreements & Virtues */}
        <section className="mb-10 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 lg:p-8">
          <h2 className="font-serif text-xl text-[var(--color-foreground)] mb-3">
            {agreements.title}
          </h2>
          <p className="text-sm text-[var(--color-foreground-muted)] mb-4">
            {agreements.text}
          </p>
          <ul className="space-y-2">
            {agreements.items.map((item: string) => (
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
            {scTitle}
          </h2>
          {scParagraphs.map((p: string, i: number) => (
            <p
              key={i}
              className="text-sm text-[var(--color-foreground-muted)] leading-relaxed mb-3"
            >
              {p}
            </p>
          ))}
          <div className="mt-4 border-t border-[var(--color-border-subtle)] pt-4">
            <p className="text-sm font-medium text-[var(--color-foreground)] mb-2">
              {guidelinesTitle}
            </p>
            <ul className="space-y-1.5">
              {guidelinesItems.map((item: string) => (
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
            {scClosing}
          </p>
        </section>

        {/* Opening — History & Lineage */}
        <section className="mb-12 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 lg:p-8">
          <h2 className="font-serif text-xl text-[var(--color-foreground)] mb-3">
            {history.title}
          </h2>
          <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed mb-4">
            {history.text}
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-[#9E956B]">
            <span className="font-serif">{t?.ui.lineage ?? 'Lineage'}:</span>
            <span className="text-[var(--color-foreground-muted)]">{history.lineage}</span>
          </div>
        </section>

        {/* Level Selector */}
        <h2 className="font-serif text-2xl text-[var(--color-foreground)] text-center mb-6">
          {t?.ui.selectTeachingLevel ?? 'Select a Teaching Level'}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {teachingLevels.map((level) => {
            const levelT = t?.levels[String(level.level)];
            return (
              <Link
                key={level.level}
                href={`/teaching/level-${level.level}`}
                className="group rounded-xl bg-[var(--color-surface)] p-6 transition-shadow hover:shadow-lg border border-[var(--color-border)]"
              >
                <div className="space-y-3">
                  <span className="inline-block text-xs font-medium uppercase tracking-wider text-[var(--color-foreground-muted)]">
                    {t?.ui.level ?? 'Level'} {level.level}
                  </span>
                  <h2 className="font-serif text-xl text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors">
                    {levelT?.title ?? level.title}
                  </h2>
                  <p className="text-sm text-[var(--color-foreground-muted)]">
                    {levelT?.subtitle ?? level.subtitle}
                  </p>
                  <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                    {levelT?.description ?? level.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
