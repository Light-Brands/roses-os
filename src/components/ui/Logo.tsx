'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  href?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  textClassName?: string;
  onClick?: () => void;
}

const sizeMap = {
  sm: { image: 120, text: 'text-base' },
  md: { image: 160, text: 'text-xl' },
  lg: { image: 240, text: 'text-2xl' },
};

export function Logo({
  href = '/',
  className,
  size = 'md',
  showText = false,
  textClassName,
  onClick,
}: LogoProps) {
  const sizes = sizeMap[size];
  const logoContent = (
    <div className={cn('flex items-center gap-2', className)}>
      <Image
        src="/oracle-logo.webp"
        alt="Oracle"
        width={sizes.image}
        height={sizes.image}
        className="object-contain invert dark:invert-0 transition-all duration-200"
        priority
      />
      {showText && (
        <span
          className={cn(
            'font-bold text-neutral-900 dark:text-white tracking-tight',
            sizes.text,
            textClassName
          )}
        >
          Oracle
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="inline-flex">
        {logoContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="inline-flex">
        {logoContent}
      </button>
    );
  }

  return logoContent;
}
