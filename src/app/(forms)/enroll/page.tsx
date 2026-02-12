'use client';

import { useRouter } from 'next/navigation';
import { FormStepper } from '@/components/forms/FormStepper';
import EnrollmentForm from '@/components/forms/EnrollmentForm';

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
    </div>
  );
}
