'use client';

import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ManualDownloadButtonProps {
  href: string;
  label?: string;
  coverImage?: string;
  className?: string;
}

export function ManualDownloadButton({
  href,
  label = 'Student Manual',
  coverImage,
  className,
}: ManualDownloadButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium print:hidden',
        'bg-[var(--color-background-subtle)] text-[var(--color-foreground)]',
        'border border-[var(--color-border)]',
        'hover:bg-[var(--color-background-muted)]',
        'transition-all duration-200',
        'text-sm',
        className,
      )}
    >
      {coverImage ? (
        <img src={coverImage} alt="" className="h-8 w-auto rounded-sm object-cover" />
      ) : (
        <BookOpen className="h-4 w-4" />
      )}
      <span>Download the {label}</span>
    </a>
  );
}
