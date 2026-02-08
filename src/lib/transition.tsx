'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// =============================================================================
// TYPES & CONTEXT
// =============================================================================

type TransitionPhase = 'idle' | 'covering' | 'revealing';

interface TransitionContextValue {
  phase: TransitionPhase;
}

const TransitionContext = createContext<TransitionContextValue>({ phase: 'idle' });

// =============================================================================
// TIMING
// =============================================================================

const COVER_MS = 320;
const REVEAL_MS = 500;

// =============================================================================
// PROVIDER — global click interceptor for seamless page transitions
// =============================================================================

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<TransitionPhase>('idle');
  const router = useRouter();
  const pathname = usePathname();
  const transitioning = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const navigateTo = useCallback(
    (href: string) => {
      if (transitioning.current) return;
      transitioning.current = true;

      // Phase 1: black/white curtain slides up from bottom
      setPhase('covering');

      addTimer(() => {
        // Scroll to top while curtain covers screen
        window.scrollTo(0, 0);
        // Navigate (content swaps behind curtain)
        router.push(href);

        // Phase 2: curtain continues up to reveal new page
        // Double rAF ensures browser has painted new content
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setPhase('revealing');

            addTimer(() => {
              setPhase('idle');
              transitioning.current = false;
            }, REVEAL_MS);
          });
        });
      }, COVER_MS);
    },
    [router, addTimer]
  );

  // ---------------------------------------------------------------------------
  // Global click interceptor — capture phase fires before Next.js Link handler.
  // We call e.preventDefault(); Link checks e.defaultPrevented and skips its
  // own navigation. Other onClick handlers (e.g. mobile menu close) still fire.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as Element).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Skip anything that isn't a simple internal page link
      if (
        href.startsWith('http') ||
        href.startsWith('//') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('/admin') ||
        href.startsWith('/api') ||
        anchor.target === '_blank' ||
        anchor.hasAttribute('download')
      )
        return;

      // Same page — no transition needed
      if (href === pathname) return;

      // Already mid-transition
      if (transitioning.current) return;

      // Respect reduced-motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      e.preventDefault();
      navigateTo(href);
    };

    document.addEventListener('click', handle, true);
    return () => document.removeEventListener('click', handle, true);
  }, [pathname, navigateTo]);

  // Cleanup on unmount
  useEffect(() => clearTimers, [clearTimers]);

  return (
    <TransitionContext.Provider value={{ phase }}>
      {children}
    </TransitionContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function usePageTransition() {
  return useContext(TransitionContext);
}
