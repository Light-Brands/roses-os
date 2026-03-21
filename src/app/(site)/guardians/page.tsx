import type { Metadata } from 'next';
import GuardiansClient from './GuardiansClient';
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
  JsonLd,
  siteConfig,
} from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Guardians',
  description:
    'Meet the guardians of International Aura School — Angelina Ataíde, Dara Ayoub, Peggy Mars, Silvia Coelho, and Jennifer Brooke Lawless. Teachers, stewards, and practitioners carrying the Rose Meditation and Aura Reading lineage.',
  keywords: [
    'rose meditation teachers',
    'aura reading teachers',
    'International Aura School guardians',
    'spiritual teachers',
    'energy healing mentors',
  ],
  openGraph: {
    title: 'Guardians | International Aura School',
    description:
      'Meet the guardians who carry and transmit the Rose Meditation and Aura Reading lineage.',
    url: '/guardians',
  },
};

export default function GuardiansPage() {
  const webPageSchema = generateWebPageSchema({
    title: 'Guardians',
    description:
      'Meet the guardians who carry and transmit the Rose Meditation and Aura Reading lineage.',
    pathname: '/guardians',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Guardians', url: `${siteConfig.url}/guardians` },
  ]);

  return (
    <>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <GuardiansClient />
    </>
  );
}
