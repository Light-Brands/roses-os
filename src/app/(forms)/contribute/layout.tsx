import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contribute',
  description:
    'Support the ROSES OS community through your contribution — choose a tier that resonates and help sustain the living path.',
};

export default function ContributeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
