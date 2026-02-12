import Link from 'next/link';

export default function FormsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
        <Link href="/" className="font-sans text-sm font-medium tracking-wide uppercase text-[var(--color-foreground)]">
          ROSES OS
        </Link>
        <Link href="/invitation" className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors">
          ← Back
        </Link>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-12 lg:py-16">
        {children}
      </main>
    </div>
  );
}
