import type { Metadata } from 'next';
import OfferingsClient from './OfferingsClient';

export const metadata: Metadata = {
  title: 'Offerings',
  description:
    'Explore Rose Meditation and Aura Reading courses online. Live instruction, multi-timezone support, and a pay-what-feels-right contribution model. Enroll in the next cohort.',
  keywords: [
    'rose meditation course',
    'aura reading course online',
    'energy healing training',
    'clairvoyance course',
    'chakra cleansing meditation',
    'spiritual development program',
  ],
  openGraph: {
    title: 'Offerings | ROSES OS',
    description:
      'Rose Meditation & Aura Reading courses — live online instruction with multi-timezone support.',
    url: '/offerings',
  },
};

export default function OfferingsPage() {
  return <OfferingsClient />;
}
