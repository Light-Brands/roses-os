import type { Metadata } from 'next';
import CommunityClient from './CommunityClient';

export const metadata: Metadata = {
  title: 'Community',
  description:
    'Join the ROSES OS community — free weekly gatherings, Rose Meditation guidances, practitioner meetings, and continued programs like Aura for Life and Teachers Training.',
  keywords: [
    'rose meditation community',
    'aura reading practice group',
    'spiritual community online',
    'meditation practitioners',
    'energy healing community',
  ],
  openGraph: {
    title: 'Community | ROSES OS',
    description:
      'Free gatherings, ongoing practice, and a network of practitioners devoted to coherent living.',
    url: '/community',
  },
};

export default function CommunityPage() {
  return <CommunityClient />;
}
