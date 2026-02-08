'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { prefersReducedMotion } from '@/lib/utils';

const ShaderSphereCanvas = dynamic(() => import('./ShaderSphereCanvas'), {
  ssr: false,
});

export default function HeroSphere() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [reducedMotion, setReducedMotion] = useState(false);
  const [containerReady, setContainerReady] = useState(false);
  const [glReady, setGlReady] = useState(false);

  // Wait for container to have non-zero dimensions before mounting Canvas.
  // R3F sizes its canvas from the parent on mount — if the parent has no
  // layout yet (dynamic import + SSR hydration timing), the canvas renders
  // at 0×0 or 300×150 and only corrects on the next resize event.
  const containerCallbackRef = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
    if (!node) return;

    // Check immediately — the container may already be laid out
    if (node.clientWidth > 0 && node.clientHeight > 0) {
      setContainerReady(true);
      return;
    }

    // Otherwise observe until it has size
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setContainerReady(true);
          ro.disconnect();
          return;
        }
      }
    });
    ro.observe(node);
  }, []);

  // After GL is ready, nudge R3F to pick up correct container dimensions.
  // Also nudge again after the scale animation completes (2s duration).
  useEffect(() => {
    if (!glReady) return;
    const id1 = requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
    });
    const id2 = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 2100);
    return () => {
      cancelAnimationFrame(id1);
      clearTimeout(id2);
    };
  }, [glReady]);

  // Track mouse globally (sphere has pointer-events-none)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to [-1, 1]
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Reduced motion preference
  useEffect(() => {
    setReducedMotion(prefersReducedMotion());

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <motion.div
      ref={containerCallbackRef}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={glReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }}
      transition={{
        opacity: { duration: 0.8, ease: 'easeOut' },
        scale: { duration: 2, ease: [0.16, 1, 0.3, 1] },
      }}
      className="hero-sphere-container w-full h-full"
    >
      {containerReady && (
        <ShaderSphereCanvas
          mouseRef={mouseRef}
          reducedMotion={reducedMotion}
          onReady={() => setGlReady(true)}
        />
      )}
    </motion.div>
  );
}
