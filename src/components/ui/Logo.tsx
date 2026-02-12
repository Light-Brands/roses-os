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
  lg: 'text-xl',
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
    <div className={cn('flex items-center gap-2', className)}>
      <Image
        src="/rose.png"
        alt=""
        width={iconSize}
        height={iconSize}
        className="object-contain shrink-0"
      />
      <span
        className={cn(
          'font-medium tracking-[0.08em] uppercase text-[var(--color-foreground)]',
          sizeMap[size],
          textClassName
        )}
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        ROSE OS
      </span>
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
