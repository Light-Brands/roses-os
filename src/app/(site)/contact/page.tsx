import type { Metadata } from 'next';
import ContactClient from './ContactClient';
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
  JsonLd,
  siteConfig,
} from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with ROSES OS. Reach out to Dara via WhatsApp or email for questions about Rose Meditation courses, Aura Reading programs, or enrollment.',
  keywords: [
    'contact ROSES OS',
    'rose meditation enrollment',
    'aura reading enrollment',
    'spiritual course inquiry',
  ],
  openGraph: {
    title: 'Contact | ROSES OS',
    description:
      'Reach out via WhatsApp or email — we are here to support your journey.',
    url: '/contact',
  },
};

export default function ContactPage() {
  const webPageSchema = {
    ...generateWebPageSchema({
      title: 'Contact',
      description:
        'Get in touch with ROSES OS for questions about Rose Meditation courses, Aura Reading programs, or enrollment.',
      pathname: '/contact',
    }),
    '@type': 'ContactPage',
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Contact', url: `${siteConfig.url}/contact` },
  ]);

  const contactPointSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        url: 'https://wa.me/5511996330135',
        email: 'dani.ayoub88@gmail.com',
        availableLanguage: ['English', 'Portuguese'],
      },
    ],
  };

  return (
    <>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={contactPointSchema} />
      <ContactClient />
    </>
  );
}
