'use client';

import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TeachingError({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <div className="max-w-md text-center px-6 space-y-6">
        <h2 className="font-serif text-2xl text-[var(--color-foreground)]">
          Something went wrong
        </h2>
        <p className="text-sm text-[var(--color-foreground-muted)]">
          There was an error loading this page. Please try again.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-xl px-6 py-3 text-sm font-medium bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            Try again
          </button>
          <Link
            href="/teaching"
            className="rounded-xl px-6 py-3 text-sm font-medium border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-background-subtle)] transition-colors"
          >
            Back to Teaching
          </Link>
        </div>
      </div>
    </div>
  );
}
