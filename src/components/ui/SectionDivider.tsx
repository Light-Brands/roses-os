'use client';

import { cn } from '@/lib/utils';

interface SectionDividerProps {
  variant: 'line' | 'rose' | 'breath';
  className?: string;
}

export default function SectionDivider({ variant, className }: SectionDividerProps) {
  if (variant === 'breath') {
    return <div className={cn('py-16', className)} aria-hidden="true" />;
  }

  if (variant === 'rose') {
    return (
      <div className={cn('flex items-center justify-center py-10', className)} aria-hidden="true">
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[var(--color-rose-clay)] opacity-50"
        >
          {/* Stylized rose icon - concentric petals */}
          <path
            d="M14 4C14 4 10 8 10 12C10 14.2 11.8 16 14 16C16.2 16 18 14.2 18 12C18 8 14 4 14 4Z"
            fill="currentColor"
            opacity="0.6"
          />
          <path
            d="M14 7C14 7 8 10 8 15C8 18.3 10.7 21 14 21C17.3 21 20 18.3 20 15C20 10 14 7 14 7Z"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M14 10C14 10 6 13 6 18C6 21.9 9.6 24 14 24C18.4 24 22 21.9 22 18C22 13 14 10 14 10Z"
            stroke="currentColor"
            strokeWidth="0.75"
            fill="none"
            opacity="0.25"
          />
        </svg>
      </div>
    );
  }

  // variant === 'line'
  return (
    <div className={cn('container-premium', className)}>
      <hr
        className="border-t border-[var(--color-border)] my-0"
        aria-hidden="true"
      />
    </div>
  );
}
