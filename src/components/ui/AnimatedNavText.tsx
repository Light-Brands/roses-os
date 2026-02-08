'use client';

import { cn } from '@/lib/utils';

export interface AnimatedNavTextProps {
  children: string;
  className?: string;
  staggerMs?: number;
  durationMs?: number;
}

/**
 * Per-character staggered slide hover animation.
 * Single overflow-hidden on the whole text — no per-char wrappers,
 * so characters take their natural width and nothing gets clipped.
 * Parent needs class "group".
 */
export function AnimatedNavText({
  children,
  className,
  staggerMs = 18,
  durationMs = 450,
}: AnimatedNavTextProps) {
  const chars = children.split('');

  const charStyle = (i: number): React.CSSProperties => ({
    transitionDuration: `${durationMs}ms`,
    transitionTimingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)',
    transitionDelay: `${i * staggerMs}ms`,
  });

  return (
    <span className={cn('relative inline-flex overflow-hidden leading-tight', className)}>
      {/* Row 1: visible at rest, each char slides up and out on hover */}
      {chars.map((char, i) => (
        <span
          key={`t-${i}`}
          className="inline-block transition-transform group-hover:-translate-y-full"
          style={charStyle(i)}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
      {/* Row 2: starts below, each char slides up into view on hover */}
      <span className="absolute left-0 top-full inline-flex" aria-hidden>
        {chars.map((char, i) => (
          <span
            key={`b-${i}`}
            className="inline-block transition-transform group-hover:-translate-y-full"
            style={charStyle(i)}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </span>
  );
}

export default AnimatedNavText;
