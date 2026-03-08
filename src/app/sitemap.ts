import type { MetadataRoute } from 'next';
import { getAllLocationSlugs } from '@/lib/data';
import { siteConfig } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/offerings',
    '/community',
    '/the-rose',
    '/guardians',
    '/contact',
    '/invitation',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const geoRoutes: MetadataRoute.Sitemap = getAllLocationSlugs().map(
    (slug) => ({
      url: `${baseUrl}/meditation/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: slug === 'online' ? 0.9 : 0.7,
    })
  );

  return [...staticRoutes, ...geoRoutes];
}
