'use client';

import { FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ManualDownloadButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export function ManualDownloadButton({
  href,
  label = 'Student Manual',
  className,
}: ManualDownloadButtonProps) {
  return (
    <a
      href={href}
      download
      className={cn(
        'inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium',
        'bg-[var(--color-background-subtle)] text-[var(--color-foreground)]',
        'border border-[var(--color-border)]',
        'hover:bg-[var(--color-background-muted)]',
        'transition-all duration-200',
        'print:hidden',
        'text-sm',
        className,
      )}
    >
      <FileDown className="h-4 w-4" />
      <span>{label}</span>
    </a>
  );
}
