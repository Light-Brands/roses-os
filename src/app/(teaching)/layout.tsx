import PasswordGate from '@/components/teaching/PasswordGate';
import { LanguageProvider } from '@/lib/i18n';

export default function TeachingLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <PasswordGate>{children}</PasswordGate>
    </LanguageProvider>
  );
}
