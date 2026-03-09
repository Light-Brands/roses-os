import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
  JsonLd,
  siteConfig,
} from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Remember Who You Are | Rose Meditation & Aura Reading Courses Online',
  description:
    'ROSES OS is a living consciousness ecosystem offering Rose Meditation and Aura Reading courses online. Join 5,000+ initiates across 50+ countries on a path to inner freedom and coherence.',
  keywords: [
    'rose meditation',
    'aura reading course',
    'meditation course online',
    'consciousness',
    'inner freedom',
    'spiritual practice',
    'energy healing',
    'aura reading online',
    'coherence',
    'remembrance',
  ],
  openGraph: {
    title: 'ROSES OS — Remember Who You Are',
    description:
      'Rose Meditation & Aura Reading courses online. A living path to inner freedom and coherence.',
    url: siteConfig.url,
  },
};

export default function HomePage() {
  const webPageSchema = generateWebPageSchema({
    title: 'ROSES OS — Remember Who You Are',
    description: siteConfig.description,
    pathname: '',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
  ]);

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  };

  return (
    <>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={websiteSchema} />
      <HomeClient />
    </>
  );
}
