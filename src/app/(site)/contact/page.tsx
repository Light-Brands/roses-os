import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with International Aura School. Reach out to Dara via WhatsApp or email for questions about Rose Meditation courses, Aura Reading programs, or enrollment.',
  keywords: [
    'contact International Aura School',
    'rose meditation enrollment',
    'aura reading enrollment',
    'spiritual course inquiry',
  ],
  openGraph: {
    title: 'Contact | International Aura School',
    description:
      'Reach out via WhatsApp or email — we are here to support your journey.',
    url: '/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
