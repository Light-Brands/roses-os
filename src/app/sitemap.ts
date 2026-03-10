import type { MetadataRoute } from 'next';
import { getAllLocationSlugs } from '@/lib/data';
import { siteConfig } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Use a stable date so sitemap doesn't send false freshness signals on every build.
  // Update this when site content is meaningfully changed.
  const lastContentUpdate = new Date('2026-03-10');

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/offerings',
    '/meditation',
    '/community',
    '/the-rose',
    '/guardians',
    '/contact',
    '/invitation',
    '/invitation/learn-more',
    '/enroll',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: lastContentUpdate,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route === '/enroll' || route === '/invitation/learn-more' ? 0.6 : 0.8,
  }));

  const geoRoutes: MetadataRoute.Sitemap = getAllLocationSlugs().map(
    (slug) => ({
      url: `${baseUrl}/meditation/${slug}`,
      lastModified: lastContentUpdate,
      changeFrequency: 'weekly',
      priority: slug === 'online' ? 0.9 : 0.7,
    })
  );

  return [...staticRoutes, ...geoRoutes];
}
