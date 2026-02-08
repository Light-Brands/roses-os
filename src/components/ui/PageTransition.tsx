'use client';

import { useEffect, useRef } from 'react';
import { usePageTransition } from '@/lib/transition';

// =============================================================================
// PAGE TRANSITION — Single panel wipe + DC logo
// =============================================================================
//
// Cover:  solid panel slides UP from bottom, DC logo fades in at center
// Reveal: logo fades out, panel continues UP out of view
//
// Colors: inverted theme — black in light mode, white in dark mode
// =============================================================================

const COVER_EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';
const REVEAL_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export function PageTransition() {
  const { phase } = usePageTransition();
  const panelRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const logo = logoRef.current;
    if (!panel || !logo) return;

    switch (phase) {
      case 'covering':
        // Reset to below viewport
        panel.style.transition = 'none';
        panel.style.transform = 'translateY(100%)';
        panel.style.pointerEvents = 'auto';
        logo.style.transition = 'none';
        logo.style.opacity = '0';
        logo.style.transform = 'scale(0.88)';
        void panel.offsetHeight; // reflow
        // Slide up to cover
        panel.style.transition = `transform 320ms ${COVER_EASE}`;
        panel.style.transform = 'translateY(0%)';
        // Logo fades in once panel mostly covers
        logo.style.transition = 'opacity 180ms ease 160ms, transform 180ms ease 160ms';
        logo.style.opacity = '1';
        logo.style.transform = 'scale(1)';
        break;

      case 'revealing':
        // Fade logo out
        logo.style.transition = 'opacity 120ms ease';
        logo.style.opacity = '0';
        // Panel continues up after brief hold
        panel.style.transition = `transform 420ms ${REVEAL_EASE} 80ms`;
        panel.style.transform = 'translateY(-100%)';
        break;

      case 'idle':
        // Snap back instantly
        panel.style.transition = 'none';
        panel.style.transform = 'translateY(100%)';
        panel.style.pointerEvents = 'none';
        logo.style.transition = 'none';
        logo.style.opacity = '0';
        break;
    }
  }, [phase]);

  return (
    <div
      ref={panelRef}
      aria-hidden="true"
      className="fixed inset-0 z-[9999] bg-[#0A0A0A] dark:bg-[#F5F5F5]"
      style={{
        transform: 'translateY(100%)',
        willChange: 'transform',
        pointerEvents: 'none',
      }}
    >
      {/* DC Logo — centered */}
      <div
        ref={logoRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: 0 }}
      >
        <svg
          width="42"
          height="42"
          viewBox="0 0 107.52 107.55"
          className="text-white dark:text-[#0A0A0A]"
          fill="currentColor"
        >
          <path d="M0,107.53V0c9.92-.18,19.68,2.61,28.06,7.82,21.17,13.16,30.81,38.12,23.36,62.21-6.81,22.03-28.06,38.26-51.42,37.5Z" />
          <path d="M107.52,107.53h-48.72c-.35-22.93,16.52-43.22,38.87-47.65,2.94-.58,5.31-.76,8.3-.82.34,0,1.55-.44,1.55.11v48.36Z" />
          <path d="M107.52,0v48.48c-21.14.54-40.51-14.4-46.68-34.32-1.44-4.64-2.11-9.3-2.28-14.16h48.96Z" />
        </svg>
      </div>
    </div>
  );
}
