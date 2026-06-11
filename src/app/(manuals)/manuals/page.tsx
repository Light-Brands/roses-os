'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useManualAuth } from '@/components/manuals/ManualPinGate';
import { stackBrandName } from '@/components/ui/BrandName';
import type { Manual } from '@/lib/manuals/types';

export default function ManualsPage() {
  const { role, isEditor } = useManualAuth();
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchManuals() {
      try {
        const res = await fetch('/api/manuals');
        const json = await res.json();
        if (json.data) setManuals(json.data);
      } catch {
        // Failed to fetch manuals
      } finally {
        setLoading(false);
      }
    }
    fetchManuals();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <header className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
        <Link
          href="/"
          className="font-sans text-sm font-medium tracking-wide uppercase text-[var(--color-foreground)] leading-tight"
        >
          {stackBrandName()}
        </Link>
        <div className="flex items-center gap-4">
          <span className={cn(
            'text-xs px-3 py-1 rounded-full font-medium',
            isEditor
              ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]'
              : 'bg-[var(--color-info)]/10 text-[var(--color-info)]'
          )}>
            {isEditor ? 'Editor' : 'Teacher'}
          </span>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background-subtle)] transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Home
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 lg:py-16">
        {/* Hero */}
        <div className="flex flex-col items-center justify-center mb-12">
          <img
            src="/rose.png"
            alt="International Aura and Dream School"
            width={56}
            height={56}
            className="object-contain mb-4"
          />
          <h1 className="font-serif text-3xl md:text-4xl tracking-wide text-[var(--color-foreground)] mb-2">
            Teaching Manuals
          </h1>
          <p className="text-sm text-[var(--color-foreground-muted)] text-center max-w-lg">
            {isEditor
              ? 'Select a manual to edit. Choose your language and edit blocks in place.'
              : 'Select a manual to view and download.'}
          </p>
        </div>

        {/* Manual Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 animate-pulse">
                <div className="w-full h-56 bg-[var(--color-background-muted)] rounded-lg mb-4" />
                <div className="h-5 bg-[var(--color-background-muted)] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[var(--color-background-muted)] rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {manuals.map((manual, index) => (
              <motion.div
                key={manual.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={`/manuals/${manual.id}`}
                  className="group block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-200 hover:shadow-lg hover:border-[var(--color-rose-clay)]/30"
                >
                  {manual.cover_image && (
                    <div className="w-full h-56 rounded-lg overflow-hidden mb-4 bg-[var(--color-background-muted)] flex items-center justify-center">
                      <img
                        src={manual.cover_image}
                        alt={manual.title}
                        className="max-h-full max-w-full object-contain shadow-md transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h2 className="font-serif text-xl text-[var(--color-foreground)] group-hover:text-[var(--color-rose-clay)] transition-colors mb-2">
                    {manual.title}
                  </h2>
                  {manual.description && (
                    <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                      {manual.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2 text-xs text-[var(--color-foreground-faint)]">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={isEditor ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                    </svg>
                    {isEditor ? 'Click to edit' : 'Click to view'}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {manuals.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="text-[var(--color-foreground-muted)]">
              No manuals found. Please run the database migration to seed the initial manuals.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
