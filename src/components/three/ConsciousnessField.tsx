'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { prefersReducedMotion } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  phase: number;       // offset for breathing
  breathSpeed: number; // individual rhythm
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const NODE_COUNT = 48;
const CONNECTION_DISTANCE = 140;
const BASE_SPEED = 0.15;

// Rose-tinted palette (from design tokens)
const COLORS = {
  node: [156, 111, 110],       // rose-500 #9C6F6E
  nodeBright: [212, 160, 154], // rose-400 #D4A09A
  line: [156, 111, 110],       // rose-500
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createNode(w: number, h: number): Node {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * BASE_SPEED * 2,
    vy: (Math.random() - 0.5) * BASE_SPEED * 2,
    radius: 1.5 + Math.random() * 2.5,
    baseAlpha: 0.25 + Math.random() * 0.45,
    phase: Math.random() * Math.PI * 2,
    breathSpeed: 0.3 + Math.random() * 0.4,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ConsciousnessField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const sizeRef = useRef({ w: 0, h: 0 });
  const [reduced, setReduced] = useState(false);

  // Detect reduced motion
  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Resize handler — keep DPR-aware sizing
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    sizeRef.current = { w, h };

    // Initialize or redistribute nodes
    if (nodesRef.current.length === 0) {
      nodesRef.current = Array.from({ length: NODE_COUNT }, () => createNode(w, h));
    }
  }, []);

  // Mouse tracking
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Main animation loop
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    if (reduced) {
      // Static render for reduced motion
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        const { w, h } = sizeRef.current;
        ctx.clearRect(0, 0, w, h);
        const nodes = nodesRef.current;
        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CONNECTION_DISTANCE) {
              const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.12;
              const [r, g, b] = COLORS.line;
              ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }
        // Draw nodes
        for (const node of nodes) {
          const [r, g, b] = COLORS.node;
          ctx.fillStyle = `rgba(${r},${g},${b},${node.baseAlpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      return () => window.removeEventListener('resize', handleResize);
    }

    let time = 0;

    const tick = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx) return;

      const { w, h } = sizeRef.current;
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, w, h);
      time += 0.016; // ~60fps

      // Update positions
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        // Wrap around edges with padding
        if (node.x < -20) node.x = w + 20;
        if (node.x > w + 20) node.x = -20;
        if (node.y < -20) node.y = h + 20;
        if (node.y > h + 20) node.y = -20;

        // Gentle mouse attraction
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 1) {
          node.vx += (dx / dist) * 0.008;
          node.vy += (dy / dist) * 0.008;
        }

        // Dampen velocity
        node.vx *= 0.998;
        node.vy *= 0.998;

        // Clamp speed
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > BASE_SPEED * 3) {
          node.vx = (node.vx / speed) * BASE_SPEED * 3;
          node.vy = (node.vy / speed) * BASE_SPEED * 3;
        }
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.15;
            const [r, g, b] = COLORS.line;
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes with breathing
      for (const node of nodes) {
        const breath = Math.sin(time * node.breathSpeed + node.phase);
        const alpha = node.baseAlpha * (0.6 + breath * 0.4);
        const r = node.radius * (0.9 + breath * 0.15);

        // Outer glow
        const [gr, gg, gb] = COLORS.nodeBright;
        ctx.fillStyle = `rgba(${gr},${gg},${gb},${alpha * 0.2})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core
        const [cr, cg, cb] = COLORS.node;
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Bright center
        ctx.fillStyle = `rgba(${gr},${gg},${gb},${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [reduced, handleResize]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      aria-hidden="true"
    />
  );
}
