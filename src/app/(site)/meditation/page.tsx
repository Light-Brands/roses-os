import type { Metadata } from 'next';
import Link from 'next/link';

import { geoLocations } from '@/lib/data';
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
  JsonLd,
  siteConfig,
} from '@/lib/seo';
import PageHero from '@/components/sections/PageHero';

export const metadata: Metadata = {
  title: 'Meditation Courses by City',
  description:
    'Rose Meditation is a clairvoyant meditation practice rooted in aura reading, chakra cleansing, and self-healing. Find live online courses at your local timezone — available in 20+ cities across the Americas, Europe, and beyond.',
  keywords: [
    'rose meditation',
    'meditation course online',
    'aura reading course',
    'meditation classes near me',
    'online meditation course',
    'energy healing course',
    'clairvoyance training',
    'chakra meditation course',
  ],
  openGraph: {
    title: 'Meditation Courses by City | International Aura School',
    description:
      'Find Rose Meditation & Aura Reading courses at your local timezone. Live online classes in 20+ cities worldwide.',
    url: '/meditation',
  },
};

export default function MeditationHubPage() {
  const webPageSchema = generateWebPageSchema({
    title: 'Meditation Courses by City',
    description:
      'Rose Meditation is a clairvoyant meditation practice rooted in aura reading, chakra cleansing, and self-healing. Find live online courses at your local timezone.',
    pathname: '/meditation',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Meditation', url: `${siteConfig.url}/meditation` },
  ]);

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Rose Meditation Course Locations',
    numberOfItems: geoLocations.length,
    itemListElement: geoLocations.map((loc, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: loc.city === 'Online' ? 'Online Courses' : `Meditation in ${loc.city}`,
      url: `${siteConfig.url}/meditation/${loc.slug}`,
    })),
  };

  // Group locations by timezone region
  const onlineLoc = geoLocations.find((l) => l.slug === 'online');
  const cityLocations = geoLocations.filter((l) => l.slug !== 'online');

  const regions: Record<string, typeof cityLocations> = {};
  for (const loc of cityLocations) {
    const region = loc.timezoneLabel.replace(/\s*\(.*\)/, '');
    if (!regions[region]) regions[region] = [];
    regions[region].push(loc);
  }

  return (
    <>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />

      <PageHero
        eyebrow="Find Your Local Schedule"
        title="Meditation Courses by City"
        description="Live online courses at your local timezone — join from anywhere in the world."
      />

      {/* Definitional paragraph for GEO — AI-citable */}
      <section className="pb-12 lg:pb-16">
        <div className="container-premium max-w-3xl mx-auto">
          <p className="text-lg text-[var(--color-foreground-muted)] leading-relaxed">
            Rose Meditation is a clairvoyant meditation practice rooted in aura reading, chakra cleansing, and self-healing. Developed over 30 years and practiced by 5,000+ initiates across 50+ countries, it offers a structured path to inner freedom through live online instruction. All courses are delivered via live video with multi-timezone scheduling — no prior meditation experience required.
          </p>
        </div>
      </section>

      {/* Online option */}
      {onlineLoc && (
        <section className="pb-12 lg:pb-16">
          <div className="container-premium max-w-4xl mx-auto">
            <Link
              href={`/meditation/${onlineLoc.slug}`}
              className="block rounded-2xl border border-rose-200/50 dark:border-rose-800/20 bg-gradient-to-r from-rose-50/80 to-transparent dark:from-rose-950/30 dark:to-transparent p-8 hover:border-rose-300 dark:hover:border-rose-700/40 transition-all duration-300"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-rose-500/70 mb-2">
                Join from Anywhere
              </p>
              <h2 className="font-serif text-2xl mb-2 text-[var(--color-foreground)]">
                Online Courses — All Timezones
              </h2>
              <p className="text-[var(--color-foreground-muted)]">
                Multi-timezone scheduling across the Americas, Europe, and beyond.
              </p>
            </Link>
          </div>
        </section>
      )}

      {/* Location grid by region */}
      <section className="pb-24 lg:pb-32">
        <div className="container-premium max-w-4xl mx-auto">
          <div className="space-y-12">
            {Object.entries(regions).map(([region, locs]) => (
              <div key={region}>
                <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-rose-500/70 mb-6">
                  {region}
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {locs.map((loc) => (
                    <Link
                      key={loc.id}
                      href={`/meditation/${loc.slug}`}
                      className="group rounded-xl border border-rose-200/30 dark:border-rose-800/15 p-5 hover:border-rose-300 dark:hover:border-rose-700/40 hover:shadow-sm transition-all duration-300"
                    >
                      <h3 className="font-serif text-lg text-[var(--color-foreground)] group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                        {loc.city}
                      </h3>
                      <p className="text-sm text-[var(--color-foreground-muted)] mt-1">
                        {loc.country}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
