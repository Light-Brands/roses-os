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
  sm: { width: 32, height: 32, text: 'text-sm' },
  md: { width: 40, height: 40, text: 'text-base' },
  lg: { width: 56, height: 56, text: 'text-xl' },
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
    <div className={cn('flex items-center gap-3', className)}>
      <Image
        src="/dc-logo.svg"
        alt="Digital Cultures"
        width={sizes.width}
        height={sizes.height}
        className="transition-all duration-200"
        style={{
          filter: 'brightness(0) saturate(100%) invert(53%) sepia(18%) saturate(1400%) hue-rotate(210deg) brightness(88%) contrast(90%)',
        }}
        priority
      />
      {showText && (
        <span
          className={cn(
            'font-medium text-foreground tracking-tight',
            sizes.text,
            textClassName
          )}
        >
          Digital Cultures
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
