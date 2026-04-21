import ManualPinGate from '@/components/manuals/ManualPinGate';
import { LanguageProvider } from '@/lib/i18n';

export default function TeachingLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ManualPinGate>{children}</ManualPinGate>
    </LanguageProvider>
  );
}
