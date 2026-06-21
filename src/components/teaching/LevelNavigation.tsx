'use client';

import Link from 'next/link';
import { teachingLevels } from '@/lib/data';
import { useLanguage } from '@/lib/i18n';

interface LevelNavigationProps {
  currentLevel: number;
}

export default function LevelNavigation({ currentLevel }: LevelNavigationProps) {
  const { t } = useLanguage();

  const prevLevel = teachingLevels.find((l) => l.level === currentLevel - 1);
  const nextLevel = teachingLevels.find((l) => l.level === currentLevel + 1);

  if (!prevLevel && !nextLevel) return null;

  const levelTitle = (lvl: { level: number; title: string }) =>
    t?.levels?.[String(lvl.level) as '1' | '2' | '3']?.title ?? lvl.title;

  return (
    <div className="border-t border-[var(--color-border)] pt-10">
      <div className={`grid gap-4 ${prevLevel && nextLevel ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
        {prevLevel && (
          <Link
            href={`/teaching/level-${prevLevel.level}`}
            className="group flex items-center justify-between rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-6 py-5 transition-all duration-200 hover:border-[var(--color-border)] hover:shadow-sm"
          >
            <span className="text-[var(--color-foreground-muted)] transition-transform duration-200 group-hover:-translate-x-1">
              &larr;
            </span>
            <div className="space-y-1 text-right">
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-foreground-faint)]">
                {t?.ui.previousLevel ?? 'Previous'}
              </span>
              <p className="font-serif text-lg text-[var(--color-foreground)]">
                {levelTitle(prevLevel)}
              </p>
            </div>
          </Link>
        )}
        {nextLevel && (
          <Link
            href={`/teaching/level-${nextLevel.level}`}
            className={`group flex items-center justify-between rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-6 py-5 transition-all duration-200 hover:border-[var(--color-border)] hover:shadow-sm ${prevLevel ? '' : 'sm:col-start-1'}`}
          >
            <div className="space-y-1">
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-foreground-faint)]">
                {t?.ui.nextLevel ?? 'Next'}
              </span>
              <p className="font-serif text-lg text-[var(--color-foreground)]">
                {levelTitle(nextLevel)}
              </p>
            </div>
            <span className="text-[var(--color-foreground-muted)] transition-transform duration-200 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
