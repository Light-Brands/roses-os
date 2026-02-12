'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FormStepper } from '@/components/forms/FormStepper';
import EnrollmentForm from '@/components/forms/EnrollmentForm';
import { cn } from '@/lib/utils';

export default function EnrollPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <FormStepper
        steps={['Enroll', 'Contribute', 'Agreements']}
        currentStep={1}
      />

      <div className="space-y-3 text-center">
        <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-foreground)]">
          Begin Your Enrollment
        </h1>
        <p className="text-[var(--color-foreground-muted)] max-w-md mx-auto">
          Welcome to ROSES OS. Please share your details below to begin
          the enrollment process.
        </p>
      </div>

      <EnrollmentForm onSubmit={() => router.push('/contribute')} />

      {/* Divider */}
      <div className="flex items-center gap-4 pt-2">
        <div className="h-px flex-1 bg-[var(--color-border)]" />
        <span className="text-xs uppercase tracking-widest text-[var(--color-foreground-faint)]">
          or reach out directly
        </span>
        <div className="h-px flex-1 bg-[var(--color-border)]" />
      </div>

      {/* Dara Contact Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'rounded-2xl border border-[var(--color-border)] bg-[var(--color-rose-50)]',
          'p-6 text-center space-y-4'
        )}
      >
        <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed max-w-sm mx-auto">
          Prefer to connect immediately? Reach out to{' '}
          <span className="font-medium text-[var(--color-foreground)]">Dara</span>,
          our Guardian of Community &amp; Programs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* WhatsApp Button */}
          <a
            href="https://wa.me/5511996330135"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-2.5 rounded-xl px-5 py-2.5',
              'bg-[#25D366] text-white text-sm font-medium',
              'hover:bg-[#1ebe5b] transition-colors duration-200',
              'shadow-sm hover:shadow-md'
            )}
          >
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Message Dara on WhatsApp
          </a>

          {/* Email Button */}
          <a
            href="mailto:dani.ayoub88@gmail.com"
            className={cn(
              'inline-flex items-center gap-2.5 rounded-xl px-5 py-2.5',
              'border border-[var(--color-rose-clay)] text-[var(--color-rose-clay)]',
              'text-sm font-medium',
              'hover:bg-[var(--color-rose-clay)] hover:text-[var(--color-foreground-on-rose)]',
              'transition-colors duration-200'
            )}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            dani.ayoub88@gmail.com
          </a>
        </div>
      </motion.div>
    </div>
  );
}
