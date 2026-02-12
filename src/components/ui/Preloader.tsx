'use client';

import { useState, useEffect, useRef } from 'react';

// =============================================================================
// PRELOADER — Rose logo on dark, then slides up to reveal site
// =============================================================================
// Matches the page transition visual language: dark panel + Rose mark.
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

    if (sessionStorage.getItem('roses-preloader') || reducedMotion) {
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
          sessionStorage.setItem('roses-preloader', '1');
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
      className="fixed inset-0 z-[10000] bg-[#1A1716]"
      aria-hidden="true"
    >
      <div
        ref={logoRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: 0, transform: 'scale(0.88)' }}
      >
        <img
          src="/rose.png"
          alt=""
          width={48}
          height={48}
          className="object-contain"
        />
      </div>
    </div>
  );
}
