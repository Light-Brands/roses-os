import { Navigation } from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import { navItems } from '@/lib/data';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--color-foreground)] focus:text-[var(--color-background)] focus:text-sm focus:font-medium focus:outline-none"
      >
        Skip to content
      </a>
      <Navigation
        transparent
        items={navItems}
        cta={{ label: 'Begin', href: '/invitation' }}
      />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
