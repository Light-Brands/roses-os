'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n/types';
import { teachersAidPdfConfig } from '@/lib/data/manual-pdf-paths';
import { teachersAidPages } from '@/lib/data/teachers-aid-pages';
import { PdfExportButton } from '@/components/ui/PdfExportButton';
import LanguageSelector from '@/components/teaching/LanguageSelector';
import PdfPagePrintButton from '@/components/teaching/PdfPagePrintButton';

/** Group pages by section for visual separation. */
function groupBySection(pages: typeof teachersAidPages) {
  const groups: { section: string; pages: typeof teachersAidPages }[] = [];
  for (const page of pages) {
    const last = groups[groups.length - 1];
    if (last && last.section === page.section) {
      last.pages.push(page);
    } else {
      groups.push({ section: page.section, pages: [page] });
    }
  }
  return groups;
}

export default function TeachersAidPage() {
  const { locale, t } = useLanguage();
  const pdfUrl =
    teachersAidPdfConfig.paths[locale as Locale] ?? teachersAidPdfConfig.paths.en ?? '';

  const groups = groupBySection(teachersAidPages);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
        <Link
          href="/"
          className="font-sans text-sm font-medium tracking-wide uppercase text-[var(--color-foreground)]"
        >
          {t?.ui.rosesOs ?? 'ROSES OS'}
        </Link>
        <Link
          href="/teaching"
          className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          &larr; {t?.ui.allLevels ?? 'All Levels'}
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 lg:py-14">
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-foreground)]">
            {t?.ui.teacherVisualAidManual ?? 'Teacher Visual Aid Manual'}
          </h1>
          <p className="text-[var(--color-foreground-muted)] max-w-lg mx-auto">
            Print individual pages from the Teachers Aid PDF. Click the print
            button next to any page to open it in a print-ready view.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2 print:hidden">
            <PdfExportButton />
            <LanguageSelector />
          </div>
        </div>

        {/* Page list grouped by section */}
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.section}>
              <h2 className="font-serif text-lg text-[var(--color-foreground)] mb-3 border-b border-[var(--color-border-subtle)] pb-2">
                {group.section}
              </h2>
              <ul className="space-y-2">
                {group.pages.map((page) => (
                  <li
                    key={page.pageIndex}
                    className="flex items-center justify-between rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-subtle)] px-4 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-background-subtle)] flex items-center justify-center text-xs font-medium text-[var(--color-foreground-muted)]">
                        {page.displayPage}
                      </span>
                      <span className="text-sm text-[var(--color-foreground)] truncate">
                        {page.title}
                      </span>
                    </div>
                    <PdfPagePrintButton
                      pdfUrl={pdfUrl}
                      pageIndex={page.pageIndex}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
