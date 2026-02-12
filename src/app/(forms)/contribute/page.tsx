'use client';

import { useRouter } from 'next/navigation';
import { FormStepper } from '@/components/forms/FormStepper';
import ContributionForm from '@/components/forms/ContributionForm';
import { contributionTiers } from '@/lib/data';

export default function ContributePage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <FormStepper
        steps={['Enroll', 'Contribute', 'Agreements']}
        currentStep={2}
      />

      <div className="space-y-3 text-center">
        <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-foreground)]">
          Choose Your Contribution
        </h1>
        <p className="text-[var(--color-foreground-muted)] max-w-md mx-auto">
          Our income-based model ensures that everyone can participate
          regardless of financial circumstances. Choose the tier that
          feels right for you.
        </p>
      </div>

      <ContributionForm
        tiers={contributionTiers}
        onSubmit={() => router.push('/agreements')}
      />
    </div>
  );
}
