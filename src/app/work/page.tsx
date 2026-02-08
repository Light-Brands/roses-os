import type { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/seo';
import WorkPage from './WorkPage';

export const metadata: Metadata = genMeta({
  title: 'Work',
  description: 'Selected projects from Digital Cultures — branding, web design, social media, and creative direction for brands across Cyprus and beyond.',
  pathname: '/work',
});

export default function Page() {
  return <WorkPage />;
}
