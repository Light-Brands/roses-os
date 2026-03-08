import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'ROSES OS — Remember Who You Are',
  description:
    'A living consciousness ecosystem of Rose Meditation and Aura Reading courses online. Technologies of remembrance for those ready to live in coherence. Join 5,000+ initiates across 50+ countries.',
  keywords: [
    'rose meditation',
    'aura reading course',
    'aura reading online',
    'energy healing',
    'consciousness',
    'inner freedom',
    'meditation course online',
    'chakra cleansing',
    'clairvoyance training',
    'coherence',
    'spiritual development',
    'roses os',
  ],
  openGraph: {
    title: 'ROSES OS — Remember Who You Are',
    description:
      'Technologies of remembrance — Rose Meditation and Aura Reading courses for those ready to live in coherence.',
    url: '/',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
