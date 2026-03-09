import type { Metadata } from 'next';
import TheRoseClient from './TheRoseClient';
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  JsonLd,
  siteConfig,
} from '@/lib/seo';

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
    'spiritual significance of the rose',
    'rose symbolism',
    'oldest spiritual symbol',
    'mystic rose',
    'rose in spirituality',
  ],
  openGraph: {
    title: 'The Rose | ROSES OS',
    description:
      'A living path of remembrance — Rose Meditation, Aura Reading, and the journey to coherent living.',
    url: '/the-rose',
  },
};

const theRoseFAQs = [
  {
    question: 'What is Rose Meditation?',
    answer:
      'Rose Meditation is a clairvoyant meditation practice that uses the image of a rose as a tool for reading and cleansing the human energy field (aura). It is a structured path to inner freedom developed over 30 years and practiced by 5,000+ initiates across 50+ countries.',
  },
  {
    question: 'What is aura reading?',
    answer:
      'Aura reading is the practice of perceiving and interpreting the human energy field — the layers of light, color, and information that surround every person. In the ROSES OS tradition, aura reading is a clairvoyant skill developed through Rose Meditation training.',
  },
  {
    question: 'How does Rose Meditation work?',
    answer:
      'Rose Meditation works by using specific visualization techniques — centered on the image of a rose — to cleanse and balance the chakras, release stored energy, and restore coherence to the aura. Students learn to read their own energy field and develop clairvoyant perception through guided practice.',
  },
  {
    question: 'What are the 13 domains of coherence?',
    answer:
      'The 13 domains of coherence are the foundational areas of life that Rose Meditation addresses — from physical vitality and emotional clarity to spiritual connection and creative expression. Together, they form a holistic map of human flourishing that guides the practice.',
  },
  {
    question: 'What is the spiritual significance of the rose?',
    answer:
      'The rose is the oldest spiritual symbol in the known universe. Across every major tradition — from Rumi\'s Sufi poetry where it represents divine love, to Christianity\'s Mystic Rose, to the Rosicrucian tradition where its unfolding petals symbolize awakening consciousness — the rose has pointed to the same truth: the opening of the soul. In ROSES OS, the rose is the living instrument at the center of the meditation practice.',
  },
  {
    question: 'Why is the rose used in meditation?',
    answer:
      'The rose is used in meditation because its unfolding petals mirror the stages of spiritual development — from potential to realization. Sacred across Sufism, Christianity, Hinduism, and the ancient mystery schools, the rose serves as a universal tool for cleansing the energy field, restoring coherence, and accessing deeper states of awareness. In Rose Meditation, it becomes the central instrument for reading and transforming consciousness.',
  },
];

export default function TheRosePage() {
  const webPageSchema = generateWebPageSchema({
    title: 'The Rose',
    description:
      'A living path of remembrance through Rose Meditation, Aura Reading, and the 13 domains of coherence.',
    pathname: '/the-rose',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'The Rose', url: `${siteConfig.url}/the-rose` },
  ]);

  const faqSchema = generateFAQSchema(theRoseFAQs);

  return (
    <>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <TheRoseClient />
    </>
  );
}
