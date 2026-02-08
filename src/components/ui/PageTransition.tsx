'use client';

import { useEffect, useRef } from 'react';
import { usePageTransition } from '@/lib/transition';

// =============================================================================
// PAGE TRANSITION OVERLAY
// =============================================================================
// A single full-screen div that wipes upward to cover, then continues upward
// to reveal. Inverted theme color for maximum contrast:
//   Light mode → #0A0A0A (near-black)
//   Dark mode  → #F5F5F5 (near-white)
//
// Animation:
//   idle      → parked at translateY(100%)  (below viewport, invisible)
//   covering  → slides to translateY(0%)    (covers screen, 300ms ease-in-out-quart)
//   revealing → slides to translateY(-100%) (exits top, 400ms ease-out-expo)
//   idle      → snaps back to translateY(100%) instantly (no transition)
// =============================================================================

const COVER_EASE = 'cubic-bezier(0.76, 0, 0.24, 1)'; // ease-in-out-quart
const REVEAL_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'; // DC signature ease-out

export function PageTransition() {
  const { phase } = usePageTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    switch (phase) {
      case 'covering':
        // Reset to bottom (no animation)
        el.style.transition = 'none';
        el.style.transform = 'translateY(100%)';
        el.style.pointerEvents = 'auto';
        void el.offsetHeight; // force reflow
        // Slide up to cover
        el.style.transition = `transform 300ms ${COVER_EASE}`;
        el.style.transform = 'translateY(0%)';
        break;

      case 'revealing':
        // Continue upward out of view
        el.style.transition = `transform 400ms ${REVEAL_EASE}`;
        el.style.transform = 'translateY(-100%)';
        break;

      case 'idle':
        // Snap back to bottom instantly
        el.style.transition = 'none';
        el.style.transform = 'translateY(100%)';
        el.style.pointerEvents = 'none';
        break;
    }
  }, [phase]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 z-[9999] bg-[#0A0A0A] dark:bg-[#F5F5F5]"
      style={{
        transform: 'translateY(100%)',
        willChange: 'transform',
        pointerEvents: 'none',
      }}
    />
  );
}
