import type { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';
import AboutPage from './AboutPage';

export const metadata: Metadata = genMeta({
  title: 'About',
  description: 'Digital Cultures is a marketing, creative, and design agency based in Paphos, Cyprus. We craft digital experiences that elevate brands.',
  pathname: '/about',
});

export default function Page() {
  return <AboutPage />;
}
