import type { Metadata } from 'next';
import OfferingsClient from './OfferingsClient';
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateCourseSchema,
  JsonLd,
  siteConfig,
} from '@/lib/seo';

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

const offeringsFAQs = [
  {
    question: 'How much do Rose Meditation courses cost?',
    answer:
      'ROSES OS uses a "pay what feels right" contribution model. Rose Meditation starts at $222 and Aura Reading Level 1 starts at $888. Students choose what feels aligned — there are no fixed prices or paywalls.',
  },
  {
    question: 'What timezones are classes available in?',
    answer:
      'All courses are delivered live online with multi-timezone scheduling. Sessions are available in Pacific Time, Eastern Time, Central/Colombia Time, Brasília Time, GMT, and Central European Time — covering the Americas, Europe, and beyond.',
  },
  {
    question: 'Do I need prior meditation experience?',
    answer:
      'No prior meditation or spiritual experience is required. Rose Meditation is designed for beginners and experienced practitioners alike. The course starts with foundational techniques and progresses step by step.',
  },
  {
    question: 'How are courses delivered?',
    answer:
      'All courses are delivered live online via video conferencing. Each session includes guided meditation, teaching, and Q&A. Courses run over multiple weeks with 2-3 sessions per week, typically 1.5 to 2 hours each.',
  },
];

export default function OfferingsPage() {
  const webPageSchema = generateWebPageSchema({
    title: 'Offerings',
    description:
      'Rose Meditation and Aura Reading courses online — live instruction with multi-timezone support.',
    pathname: '/offerings',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Offerings', url: `${siteConfig.url}/offerings` },
  ]);

  const faqSchema = generateFAQSchema(offeringsFAQs);

  const roseMeditationCourse = generateCourseSchema({
    name: 'Rose Meditation',
    description:
      'A 2-day live online introduction to Rose Meditation — learn the foundational techniques of clairvoyant meditation, chakra cleansing, and aura reading.',
    startDate: '2026-03-17',
    endDate: '2026-03-18',
    price: '222',
    url: `${siteConfig.url}/offerings`,
  });

  const auraReadingCourse = generateCourseSchema({
    name: 'Aura Reading Level 1',
    description:
      'A multi-week live online course in aura reading, energy healing, and clairvoyant perception. Learn to read and cleanse the human energy field.',
    startDate: '2026-03-17',
    endDate: '2026-03-27',
    price: '888',
    url: `${siteConfig.url}/offerings`,
  });

  return (
    <>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={roseMeditationCourse} />
      <JsonLd data={auraReadingCourse} />
      <OfferingsClient />
    </>
  );
}
