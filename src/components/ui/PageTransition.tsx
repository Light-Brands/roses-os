'use client';

import { useEffect, useRef } from 'react';
import { usePageTransition } from '@/lib/transition';

// =============================================================================
// PAGE TRANSITION — Single panel wipe + Rose logo
// =============================================================================
//
// Cover:  solid panel slides UP from bottom, Rose logo fades in at center
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
      className="fixed inset-0 z-[9999] bg-[var(--color-section-dark)] dark:bg-[#F7F5F2]"
      style={{
        transform: 'translateY(100%)',
        willChange: 'transform',
        pointerEvents: 'none',
      }}
    >
      {/* Rose Logo — centered */}
      <div
        ref={logoRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: 0 }}
      >
        <img
          src="/rose.png"
          alt=""
          width={40}
          height={40}
          className="object-contain"
        />
      </div>
    </div>
  );
}
