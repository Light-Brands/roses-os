'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FormStepper } from '@/components/forms/FormStepper';
import ContributionForm from '@/components/forms/ContributionForm';
import { contributionTiers } from '@/lib/data';

export default function ContributePage() {
  const [submitted, setSubmitted] = useState(false);

  // Scroll to top when submission completes so users see the confirmation
  useEffect(() => {
    if (submitted) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [submitted]);

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
          We trust you to choose what feels right for where you are
          in life. There is no judgment, only gratitude.
        </p>
      </div>

      <ContributionForm
        tiers={contributionTiers}
        onSubmit={() => setSubmitted(true)}
      />

      <div className="text-center pt-2">
        <Link
          href="/enroll"
          className="text-sm text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          &larr; Back to Enrollment
        </Link>
      </div>
    </div>
  );
}
