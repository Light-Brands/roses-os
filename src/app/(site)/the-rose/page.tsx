import type { Metadata } from 'next';
import TheRoseClient from './TheRoseClient';

export const metadata: Metadata = {
  title: 'The Rose',
  description:
    'Discover the Rose — a living path of remembrance through Rose Meditation, Aura Reading, and the 13 domains of coherence. Learn about the lineage, the architecture, and the journey home.',
  keywords: [
    'rose meditation',
    'what is rose meditation',
    'aura reading path',
    'coherence domains',
    'spiritual lineage',
    'inner freedom path',
  ],
  openGraph: {
    title: 'The Rose | ROSES OS',
    description:
      'A living path of remembrance — Rose Meditation, Aura Reading, and the journey to coherent living.',
    url: '/the-rose',
  },
};

export default function TheRosePage() {
  return <TheRoseClient />;
}
