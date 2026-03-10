import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description:
    'The page you are looking for does not exist. Return to ROSES OS to explore Rose Meditation and Aura Reading courses.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-6">
      <div className="text-center max-w-lg space-y-6">
        <p className="text-sm font-medium tracking-widest uppercase text-[var(--color-foreground-muted)]">
          404
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-light text-[var(--color-foreground)]">
          This path doesn&apos;t exist yet
        </h1>
        <p className="text-[var(--color-foreground-muted)] text-sm leading-relaxed">
          The page you&apos;re looking for may have been moved or no longer exists.
          Let us guide you back.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-full bg-[var(--color-rose-500)] text-white text-sm font-medium transition-colors hover:bg-[var(--color-rose-600)]"
          >
            Back to Home
          </Link>
          <Link
            href="/offerings"
            className="inline-flex items-center px-6 py-3 rounded-full border border-[var(--color-border)] text-[var(--color-foreground)] text-sm font-medium transition-colors hover:bg-[var(--color-surface)]"
          >
            View Programs
          </Link>
        </div>
        <div className="pt-4 flex items-center justify-center gap-4 text-xs text-[var(--color-foreground-muted)]">
          <Link href="/meditation" className="hover:text-[var(--color-foreground)] transition-colors">
            Meditation
          </Link>
          <span className="opacity-30">|</span>
          <Link href="/community" className="hover:text-[var(--color-foreground)] transition-colors">
            Community
          </Link>
          <span className="opacity-30">|</span>
          <Link href="/contact" className="hover:text-[var(--color-foreground)] transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
