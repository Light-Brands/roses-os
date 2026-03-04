'use client';

import { useLanguage, LOCALES } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  className?: string;
}

export default function LanguageSelector({ className }: LanguageSelectorProps) {
  const { locale, setLocale } = useLanguage();

  return (
    <div className={cn('inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] p-0.5', className)}>
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          className={cn(
            'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
            locale === code
              ? 'bg-[#9E956B]/15 text-[#9E956B]'
              : 'text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]'
          )}
          title={label}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
