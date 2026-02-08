'use client';

import { useEffect, useRef, useCallback } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);
  const pressing = useRef(false);
  const visible = useRef(false);
  const hasText = useRef(false);
  const rafId = useRef(0);

  const sync = useCallback(() => {
    const d = dotRef.current;
    const r = ringRef.current;
    if (!d || !r) return;
    d.classList.toggle('is-hover', hovering.current);
    d.classList.toggle('is-press', pressing.current);
    d.classList.toggle('is-visible', visible.current);
    d.classList.toggle('has-text', hasText.current);
    r.classList.toggle('is-hover', hovering.current || hasText.current);
    r.classList.toggle('is-press', pressing.current);
    r.classList.toggle('is-visible', visible.current);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reducedMotion) return;

    document.documentElement.classList.add('has-custom-cursor');

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (!visible.current) {
        visible.current = true;
        ringPos.current.x = e.clientX;
        ringPos.current.y = e.clientY;
        sync();
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;

      // Check for cursor-text elements (e.g., project cards)
      const cursorTextEl = t.closest('[data-cursor-text]') as HTMLElement | null;
      if (cursorTextEl) {
        const text = cursorTextEl.getAttribute('data-cursor-text') || '';
        if (textRef.current) textRef.current.textContent = text;
        hasText.current = true;
        hovering.current = true;
        sync();
        return;
      }

      // Regular interactive element hover
      if (t.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor]')) {
        hovering.current = true;
        sync();
      }
    };

    const onOut = (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;

      // Leaving cursor-text area
      if (hasText.current && (!related || !related.closest?.('[data-cursor-text]'))) {
        hasText.current = false;
        if (textRef.current) textRef.current.textContent = '';
      }

      // Leaving interactive area
      if (!related || !related.closest?.('a, button, [role="button"], input, textarea, select, label, [data-cursor], [data-cursor-text]')) {
        hovering.current = false;
        sync();
      }
    };

    const onDown = () => { pressing.current = true; sync(); };
    const onUp = () => { pressing.current = false; sync(); };
    const onLeave = () => { visible.current = false; sync(); };
    const onEnter = () => { visible.current = true; sync(); };

    // Ring follows with smooth lerp
    const loop = () => {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut, { passive: true });
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [sync]);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true">
        <span ref={textRef} className="cursor-text" />
      </div>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
