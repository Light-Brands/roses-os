import type { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';
import ServicesPage from './ServicesPage';

export const metadata: Metadata = genMeta({
  title: 'Services',
  description: 'Branding, web design, social media, strategy, video, photography, print, and art direction — full-service creative from Digital Cultures.',
  pathname: '/services',
});

export default function Page() {
  return <ServicesPage />;
}
