'use client';

import { useState, useEffect, useRef } from 'react';

// =============================================================================
// PRELOADER — DC logo on black, then slides up to reveal site
// =============================================================================
// Matches the page transition visual language: black panel + DC mark.
// Logo fades in → holds → logo fades out → panel slides up.
// Total: ~1.6s (vs old geometric preloader at ~2.9s)
// =============================================================================

const REVEAL_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export function Preloader() {
  const [done, setDone] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (sessionStorage.getItem('dc-preloader') || reducedMotion) {
      setDone(true);
      window.dispatchEvent(new Event('preloader:done'));
      return;
    }

    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    const logo = logoRef.current;
    if (!panel || !logo) return;

    const t = (fn: () => void, ms: number) => {
      timers.current.push(setTimeout(fn, ms));
    };

    // Logo fades in
    requestAnimationFrame(() => {
      logo.style.transition = `opacity 500ms ease, transform 500ms ${REVEAL_EASE}`;
      logo.style.opacity = '1';
      logo.style.transform = 'scale(1)';
    });

    // After hold, begin exit
    t(() => {
      window.dispatchEvent(new Event('preloader:done'));

      // Fade logo out
      logo.style.transition = 'opacity 180ms ease';
      logo.style.opacity = '0';

      // Panel slides up to reveal site
      t(() => {
        panel.style.transition = `transform 500ms ${REVEAL_EASE}`;
        panel.style.transform = 'translateY(-100%)';

        t(() => {
          setDone(true);
          sessionStorage.setItem('dc-preloader', '1');
          document.body.style.overflow = '';
        }, 500);
      }, 120);
    }, 1100);

    return () => {
      timers.current.forEach(clearTimeout);
      document.body.style.overflow = '';
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[10000] bg-[#0A0A0A]"
      aria-hidden="true"
    >
      <div
        ref={logoRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: 0, transform: 'scale(0.88)' }}
      >
        <svg
          width="52"
          height="52"
          viewBox="0 0 107.52 107.55"
          fill="white"
        >
          <path d="M0,107.53V0c9.92-.18,19.68,2.61,28.06,7.82,21.17,13.16,30.81,38.12,23.36,62.21-6.81,22.03-28.06,38.26-51.42,37.5Z" />
          <path d="M107.52,107.53h-48.72c-.35-22.93,16.52-43.22,38.87-47.65,2.94-.58,5.31-.76,8.3-.82.34,0,1.55-.44,1.55.11v48.36Z" />
          <path d="M107.52,0v48.48c-21.14.54-40.51-14.4-46.68-34.32-1.44-4.64-2.11-9.3-2.28-14.16h48.96Z" />
        </svg>
      </div>
    </div>
  );
}
