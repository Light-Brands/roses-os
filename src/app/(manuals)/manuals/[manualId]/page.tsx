'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useManualAuth } from '@/components/manuals/ManualPinGate';
import BlockEditor from '@/components/manuals/BlockEditor';
import DownloadMenu from '@/components/manuals/DownloadMenu';
import type { Manual, ManualBlock, ManualLanguage } from '@/lib/manuals/types';
import { MANUAL_LANGUAGES } from '@/lib/manuals/types';

export default function ManualEditorPage() {
  const params = useParams();
  const search = useSearchParams();
  const manualId = params.manualId as string;
  const { isEditor } = useManualAuth();

  // An initial ?lang= (e.g. from the staging-review route, T-013) preselects a
  // translation lane; otherwise default to English. Only honored when it names a
  // supported language code.
  const langParam = search.get('lang');
  const initialLang: ManualLanguage =
    langParam && MANUAL_LANGUAGES.some((l) => l.code === langParam)
      ? (langParam as ManualLanguage)
      : 'en';

  const [manual, setManual] = useState<Manual | null>(null);
  const [blocks, setBlocks] = useState<ManualBlock[]>([]);
  const [language, setLanguage] = useState<ManualLanguage>(initialLang);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchManual() {
      try {
        const res = await fetch('/api/manuals');
        const json = await res.json();
        if (json.data) {
          const found = json.data.find((m: Manual) => m.id === manualId);
          if (found) setManual(found);
        }
      } catch {
        // Failed to fetch
      } finally {
        setLoading(false);
      }
    }
    fetchManual();
  }, [manualId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="animate-pulse text-[var(--color-foreground-muted)]">Loading manual...</div>
      </div>
    );
  }

  if (!manual) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center gap-4">
        <p className="text-[var(--color-foreground-muted)]">Manual not found.</p>
        <Link href="/manuals" className="text-sm text-[var(--color-rose-clay)] underline">
          Back to manuals
        </Link>
      </div>
    );
  }

  const filename = `${manual.slug}-${language}`;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/manuals"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Manuals
          </Link>
          <span className="text-[var(--color-border)]">|</span>
          <h1 className="font-serif text-lg text-[var(--color-foreground)]">
            {manual.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Download menu */}
          <DownloadMenu
            blocks={blocks}
            title={manual.title}
            filename={filename}
          />

          {/* Role badge */}
          <span className={cn(
            'text-xs px-3 py-1 rounded-full font-medium',
            isEditor
              ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]'
              : 'bg-[var(--color-info)]/10 text-[var(--color-info)]'
          )}>
            {isEditor ? 'Editor' : 'Teacher'}
          </span>
        </div>
      </header>

      {/* Language selector */}
      <div className="px-6 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-4xl mx-auto flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-[var(--color-foreground-faint)] mr-2">Language:</span>
          {MANUAL_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200',
                language === lang.code
                  ? 'bg-[var(--color-rose-clay)] text-white'
                  : 'bg-[var(--color-background-subtle)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-muted)]'
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <BlockEditor
          key={`${manualId}-${language}`}
          manualId={manualId}
          language={language}
          readOnly={!isEditor}
          onBlocksChange={setBlocks}
        />
      </main>
    </div>
  );
}
