'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function Preloader() {
  const [phase, setPhase] = useState<'drawing' | 'exiting' | 'done'>('drawing');
  const bgRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  const reveal = useCallback(() => {
    const bg = bgRef.current;
    if (!bg) return;

    const maxSize = Math.hypot(window.innerWidth, window.innerHeight);
    const duration = 900;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // Ease-out quart for dramatic acceleration
      const eased = 1 - Math.pow(1 - t, 4);
      bg.style.setProperty('--reveal-size', `${eased * maxSize}px`);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPhase('done');
        sessionStorage.setItem('dc-preloader', '1');
        document.body.style.overflow = '';
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (sessionStorage.getItem('dc-preloader') || reducedMotion) {
      setPhase('done');
      window.dispatchEvent(new Event('preloader:done'));
      return;
    }

    document.body.style.overflow = 'hidden';

    // Wait for SVG drawing animations to finish, then exit
    const timer = setTimeout(() => {
      setPhase('exiting');
      window.dispatchEvent(new Event('preloader:done'));

      // Start circle reveal after content begins fading
      setTimeout(() => reveal(), 200);
    }, 2000);

    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.body.style.overflow = '';
    };
  }, [reveal]);

  if (phase === 'done') return null;

  return (
    <div className="preloader" aria-hidden="true">
      {/* Background layer — radial gradient with growing transparent hole */}
      <div ref={bgRef} className="preloader-bg" />

      {/* Content layer — SVG geometric + brand */}
      <div className={`preloader-content${phase === 'exiting' ? ' preloader-content-exit' : ''}`}>
        {/* Architectural geometric — concentric rings, crosshair ticks, center dot */}
        <svg
          className="preloader-graphic"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer ring — draws stroke clockwise from top */}
          <circle
            cx="100" cy="100" r="64"
            strokeWidth="0.75"
            className="loader-ring loader-ring-outer"
          />

          {/* Inner ring — smaller, draws with delay */}
          <circle
            cx="100" cy="100" r="32"
            strokeWidth="0.5"
            className="loader-ring loader-ring-inner"
          />

          {/* Crosshair ticks extending beyond outer ring at N, E, S, W */}
          <line x1="100" y1="22" x2="100" y2="36" strokeWidth="0.5" className="loader-tick loader-tick-1" />
          <line x1="178" y1="100" x2="164" y2="100" strokeWidth="0.5" className="loader-tick loader-tick-2" />
          <line x1="100" y1="178" x2="100" y2="164" strokeWidth="0.5" className="loader-tick loader-tick-3" />
          <line x1="22" y1="100" x2="36" y2="100" strokeWidth="0.5" className="loader-tick loader-tick-4" />

          {/* Diagonal ticks at NE, SE, SW, NW */}
          <line x1="145" y1="55" x2="152" y2="48" strokeWidth="0.4" className="loader-tick loader-tick-5" />
          <line x1="145" y1="145" x2="152" y2="152" strokeWidth="0.4" className="loader-tick loader-tick-6" />
          <line x1="55" y1="145" x2="48" y2="152" strokeWidth="0.4" className="loader-tick loader-tick-7" />
          <line x1="55" y1="55" x2="48" y2="48" strokeWidth="0.4" className="loader-tick loader-tick-8" />

          {/* Center dot */}
          <circle cx="100" cy="100" r="2.5" className="loader-center" />
        </svg>

        <span className="preloader-brand">Digital Cultures</span>
      </div>
    </div>
  );
}
