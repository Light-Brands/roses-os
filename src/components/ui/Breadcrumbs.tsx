'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

// Map slugs to readable labels
const labelMap: Record<string, string> = {
  offerings: 'Programs',
  meditation: 'Meditation',
  community: 'Community',
  'the-rose': 'About',
  guardians: 'Our Team',
  contact: 'Contact',
  invitation: 'Invitation',
  'learn-more': 'Learn More',
  enroll: 'Enroll',
};

function toLabel(segment: string): string {
  if (labelMap[segment]) return labelMap[segment];
  // Convert slug to title case (e.g. "san-francisco" → "San Francisco")
  return segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function Breadcrumbs() {
  const pathname = usePathname();

  // Don't render on the homepage
  if (!pathname || pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  const crumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = toLabel(segment);
    const isLast = index === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="container-premium pt-20 lg:pt-[88px] pb-0"
    >
      <ol className="flex items-center gap-1.5 text-xs text-[var(--color-foreground-muted)]">
        <li>
          <Link
            href="/"
            className="hover:text-[var(--color-foreground)] transition-colors duration-200"
          >
            Home
          </Link>
        </li>
        {crumbs.map(({ href, label, isLast }) => (
          <li key={href} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 opacity-40" />
            {isLast ? (
              <span aria-current="page" className="text-[var(--color-foreground)]">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-[var(--color-foreground)] transition-colors duration-200"
              >
                {label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
