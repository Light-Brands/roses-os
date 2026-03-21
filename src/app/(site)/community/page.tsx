import type { Metadata } from 'next';
import CommunityClient from './CommunityClient';
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
  JsonLd,
  siteConfig,
} from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Community',
  description:
    'Join the International Aura School community — free weekly gatherings, Rose Meditation guidances, practitioner meetings, and continued programs like Aura for Life and Teachers Training.',
  keywords: [
    'rose meditation community',
    'aura reading practice group',
    'spiritual community online',
    'meditation practitioners',
    'energy healing community',
  ],
  openGraph: {
    title: 'Community | International Aura School',
    description:
      'Free gatherings, ongoing practice, and a network of practitioners devoted to coherent living.',
    url: '/community',
  },
};

export default function CommunityPage() {
  const webPageSchema = generateWebPageSchema({
    title: 'Community',
    description:
      'Free weekly gatherings, Rose Meditation guidances, practitioner meetings, and continued programs.',
    pathname: '/community',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Community', url: `${siteConfig.url}/community` },
  ]);

  return (
    <>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <CommunityClient />
    </>
  );
}
