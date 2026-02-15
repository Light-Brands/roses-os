'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FormStepper } from '@/components/forms/FormStepper';
import ContributionForm from '@/components/forms/ContributionForm';
import { contributionTiers } from '@/lib/data';

export default function ContributePage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="space-y-8 text-center py-12">
        <div className="space-y-3">
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-foreground)]">
            Thank You
          </h1>
          <p className="text-[var(--color-foreground-muted)] max-w-md mx-auto">
            Your enrollment is complete. We are honored to welcome you into
            the ROSES OS community. You will receive a confirmation email
            with next steps shortly.
          </p>
        </div>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-full bg-[var(--color-foreground)] text-[var(--color-background)] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <FormStepper
        steps={['Enroll', 'Contribute']}
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
        onSubmit={() => setSubmitted(true)}
      />
    </div>
  );
}
