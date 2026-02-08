import type { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';
import ContactPage from './ContactPage';

export const metadata: Metadata = genMeta({
  title: 'Contact',
  description: 'Get in touch with Digital Cultures. We\'d love to hear about your project.',
  pathname: '/contact',
});

export default function Page() {
  return <ContactPage />;
}
