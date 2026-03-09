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
    'Meet the guardians of ROSES OS — Angelina Ataíde, Dara Ayoub, Diego Dosal, and Peggy Mars. Teachers, stewards, and practitioners carrying the Rose Meditation and Aura Reading lineage.',
  keywords: [
    'rose meditation teachers',
    'aura reading teachers',
    'ROSES OS guardians',
    'spiritual teachers',
    'energy healing mentors',
  ],
  openGraph: {
    title: 'Guardians | ROSES OS',
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
