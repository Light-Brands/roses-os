'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function R(min: number, max: number) {
  return min + Math.random() * (max - min);
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOTAL = 20;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ConsciousnessField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reduced) return;

    const w = container.clientWidth;
    const h = container.clientHeight;

    gsap.set(container, { perspective: 600 });

    const petals: HTMLDivElement[] = [];

    for (let i = 0; i < TOTAL; i++) {
      const petal = document.createElement('div');
      petal.style.cssText = `
        position: absolute;
        width: 20px;
        height: 20px;
        background: url(/rose.png) center/contain no-repeat;
        opacity: 0.18;
        pointer-events: none;
        will-change: transform;
      `;

      gsap.set(petal, {
        x: R(0, w),
        y: R(-200, -150),
        z: R(-200, 200),
        xPercent: -50,
        yPercent: -50,
      });

      container.appendChild(petal);
      petals.push(petal);

      // Fall down
      gsap.to(petal, {
        y: h + 100,
        ease: 'none',
        repeat: -1,
        duration: R(6, 15),
        delay: -15,
      });

      // Horizontal sway + Z rotation
      gsap.to(petal, {
        x: '+=80',
        rotationZ: R(0, 180),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        duration: R(4, 8),
      });

      // 3D tumble
      gsap.to(petal, {
        rotationX: R(0, 360),
        rotationY: R(0, 360),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        duration: R(2, 8),
        delay: -5,
      });
    }

    return () => {
      for (const petal of petals) {
        gsap.killTweensOf(petal);
        petal.remove();
      }
    };
  }, [reduced]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
      aria-hidden="true"
    />
  );
}
