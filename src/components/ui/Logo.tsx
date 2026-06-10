'use client';

import Link from 'next/link';
import Image from 'next/image';
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
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-[11px] sm:text-xs md:text-sm lg:text-sm xl:text-base',
};

export function Logo({
  href = '/',
  className,
  size = 'md',
  showText = false,
  textClassName,
  onClick,
}: LogoProps) {
  const iconSize = size === 'lg' ? 36 : size === 'md' ? 30 : 24;
  const logoContent = (
    <div className={cn('flex items-center gap-2 min-w-0', className)}>
      <Image
        src="/rose.png"
        alt=""
        width={iconSize}
        height={iconSize}
        className="object-contain shrink-0"
      />
      <span
        className={cn(
          'font-medium tracking-[0.04em] sm:tracking-[0.06em] md:tracking-[0.08em] uppercase text-[var(--color-foreground)] leading-tight',
          sizeMap[size],
          textClassName
        )}
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        International Aura and Dream School
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="inline-flex min-w-0">
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
