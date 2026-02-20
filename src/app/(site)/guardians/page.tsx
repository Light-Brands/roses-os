import type { Metadata } from 'next';
import GuardiansClient from './GuardiansClient';

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
  return <GuardiansClient />;
}
