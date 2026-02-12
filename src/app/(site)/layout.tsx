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
      <Navigation
        transparent
        items={navItems}
        cta={{ label: 'Begin', href: '/invitation' }}
      />
      <main>{children}</main>
      <Footer />
    </>
  );
}
