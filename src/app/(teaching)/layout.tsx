import PasswordGate from '@/components/teaching/PasswordGate';

export default function TeachingLayout({ children }: { children: React.ReactNode }) {
  return <PasswordGate>{children}</PasswordGate>;
}
