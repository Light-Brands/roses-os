'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { TeachingLevel } from '@/lib/data/types';

// =============================================================================
// LEVEL NAV
// Navigation for teaching levels 1/2/3. Side nav on desktop, top tabs on mobile.
// Links to /teaching/level-1, /teaching/level-2, /teaching/level-3.
// =============================================================================

interface LevelNavProps {
  levels: TeachingLevel[];
  activeLevel: number;
  className?: string;
}

function getLevelHref(level: number): string {
  return `/teaching/level-${level}`;
}

export default function LevelNav({ levels, activeLevel, className }: LevelNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        // Mobile: horizontal top tabs
        'flex flex-row lg:flex-col',
        'overflow-x-auto lg:overflow-visible',
        'scrollbar-hide',
        // Desktop: side nav with fixed width
        'lg:w-56 lg:flex-shrink-0',
        // Gap
        'gap-1 lg:gap-1.5',
        className
      )}
      aria-label="Teaching levels"
    >
      {levels.map((level) => {
        const href = getLevelHref(level.level);
        const isActive = level.level === activeLevel || pathname === href;

        return (
          <Link
            key={level.level}
            href={href}
            className={cn(
              'relative flex-shrink-0',
              // Mobile: horizontal tab style
              'px-4 py-2.5 lg:px-4 lg:py-3',
              'rounded-lg lg:rounded-xl',
              // Typography
              'text-sm font-medium whitespace-nowrap lg:whitespace-normal',
              // Transition
              'transition-all duration-200 ease-[var(--ease-smooth)]',
              // Focus
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rose-clay)] focus-visible:ring-offset-2',
              // Active vs inactive
              isActive
                ? cn(
                    'bg-[var(--color-background-elevated)]',
                    'text-[var(--color-foreground)]',
                    'shadow-sm',
                    'border border-[var(--color-border)]'
                  )
                : cn(
                    'text-[var(--color-foreground-muted)]',
                    'hover:text-[var(--color-foreground)]',
                    'hover:bg-[var(--color-background-subtle)]',
                    'border border-transparent'
                  )
            )}
          >
            {/* Active indicator bar */}
            {isActive && (
              <motion.div
                layoutId="level-nav-active"
                className={cn(
                  // Mobile: bottom bar
                  'absolute bottom-0 left-3 right-3 h-0.5 lg:h-auto',
                  // Desktop: left bar
                  'lg:bottom-auto lg:left-0 lg:top-2 lg:bottom-2 lg:right-auto lg:w-0.5',
                  'bg-[#C4A86B] rounded-full'
                )}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}

            <div className="flex flex-col">
              {/* Level number + title */}
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    'font-serif text-xs',
                    isActive ? 'text-[#C4A86B]' : 'text-[var(--color-foreground-faint)]'
                  )}
                >
                  {String(level.level).padStart(2, '0')}
                </span>
                <span>{level.title}</span>
              </span>

              {/* Subtitle (desktop only) */}
              <span
                className={cn(
                  'hidden lg:block',
                  'text-xs mt-0.5',
                  isActive
                    ? 'text-[var(--color-foreground-muted)]'
                    : 'text-[var(--color-foreground-faint)]'
                )}
              >
                {level.subtitle}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
