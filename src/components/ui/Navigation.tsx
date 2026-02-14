'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { AnimatedNavText } from './AnimatedNavText';

// =============================================================================
// TYPES
// =============================================================================

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

interface NavigationProps {
  logo?: React.ReactNode;
  items?: NavItem[];
  cta?: { label: string; href: string };
  transparent?: boolean;
}

const defaultItems: NavItem[] = [
  { label: 'The Rose', href: '/the-rose' },
  { label: 'Programs', href: '/programs' },
  { label: 'Guardians', href: '/guardians' },
  { label: 'Community', href: '/community' },
];

// =============================================================================
// SCROLL DIRECTION HOOK
// =============================================================================

function useScrollDirection(threshold = 8) {
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;

    setIsScrolled(currentY > 20);

    // Only trigger hide/show after passing the threshold
    if (Math.abs(currentY - lastScrollY.current) < threshold) return;

    // Scrolling down past the hero area → hide
    if (currentY > lastScrollY.current && currentY > 100) {
      setIsHidden(true);
    }
    // Scrolling up → show
    else if (currentY < lastScrollY.current) {
      setIsHidden(false);
    }

    lastScrollY.current = currentY;
  }, [threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { isHidden, isScrolled };
}

// =============================================================================
// HAMBURGER ICON (animated line morph)
// =============================================================================

function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="relative w-5 h-3.5 flex flex-col justify-between">
      <span
        className={cn(
          'block h-[1.5px] bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center',
          isOpen ? 'translate-y-[5px] rotate-45' : ''
        )}
      />
      <span
        className={cn(
          'block h-[1.5px] bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isOpen ? 'opacity-0 scale-x-0' : ''
        )}
      />
      <span
        className={cn(
          'block h-[1.5px] bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center',
          isOpen ? '-translate-y-[7px] -rotate-45' : ''
        )}
      />
    </div>
  );
}

// =============================================================================
// NAVIGATION
// =============================================================================

export function Navigation({
  logo,
  items = defaultItems,
  cta = { label: 'Begin', href: '/invitation' },
  transparent = false,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isHidden, isScrolled } = useScrollDirection();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Don't hide nav when mobile menu is open
  const shouldHide = isHidden && !isMobileMenuOpen;

  const navBackground =
    transparent && !isScrolled && !isMobileMenuOpen
      ? 'bg-transparent'
      : cn(
          'bg-[var(--color-background)]/80',
          'backdrop-blur-xl backdrop-saturate-150',
          'border-b border-[var(--color-border-subtle)]'
        );

  return (
    <>
      <motion.header
        initial={{ y: '-100%', opacity: 0 }}
        animate={{
          y: shouldHide ? '-100%' : '0%',
          opacity: 1,
        }}
        transition={{
          y: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'transition-[background-color,border-color] duration-300 ease-out',
          navBackground
        )}
      >
        <nav className="container-premium">
          <div className="relative flex items-center h-16 lg:h-[72px] w-full">
            {/* Left: nav links — equal flex so logo stays centered */}
            <div className="hidden lg:flex items-center gap-1 flex-1 min-w-0 justify-start lg:pr-20">
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'group relative px-2 xl:px-4 py-2 text-sm font-medium rounded-lg',
                    'text-[var(--color-foreground-muted)]',
                    'hover:text-[var(--color-foreground)]',
                    'transition-colors duration-200'
                  )}
                >
                  <AnimatedNavText>{item.label}</AnimatedNavText>
                </Link>
              ))}
            </div>

            {/* Logo — left-aligned on mobile/tablet, absolutely centered on desktop */}
            <div className="z-10 flex-shrink-0 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
              {logo || <Logo size="lg" />}
            </div>

            {/* Right: CTA + hamburger — equal flex to balance left */}
            <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
              {/* CTA — pill + circle, fill-sweep on hover */}
              <Link
                href={cta.href}
                className="group hidden sm:flex items-center"
              >
                {/* Pill */}
                <div
                  className={cn(
                    'relative inline-flex items-center rounded-full overflow-hidden',
                    'px-5 py-2.5',
                    'bg-[#9C6F6E]'
                  )}
                >
                  <div
                    className={cn(
                      'absolute inset-0',
                      'bg-[#8A5E5D]',
                      'origin-left scale-x-0 group-hover:scale-x-100',
                      'transition-transform duration-300 ease-out'
                    )}
                  />
                  <span
                    className={cn(
                      'relative z-10 text-sm font-medium tracking-[0.01em]',
                      'text-white',
                      'transition-colors duration-300'
                    )}
                  >
                    <AnimatedNavText>{cta.label}</AnimatedNavText>
                  </span>
                </div>
                {/* Circle */}
                <div
                  className={cn(
                    'relative flex items-center justify-center',
                    'w-10 h-10 rounded-full overflow-hidden',
                    'bg-[#9C6F6E]'
                  )}
                >
                  <div
                    className={cn(
                      'absolute inset-0',
                      'bg-[#8A5E5D]',
                      'origin-left scale-x-0 group-hover:scale-x-100',
                      'transition-transform duration-300 delay-100 ease-out'
                    )}
                  />
                  <ArrowUpRight
                    className={cn(
                      'absolute w-4 h-4 text-white',
                      'transition-all duration-300',
                      'group-hover:translate-x-full group-hover:-translate-y-full group-hover:opacity-0'
                    )}
                    strokeWidth={2.5}
                  />
                  <ArrowUpRight
                    className={cn(
                      'absolute w-4 h-4',
                      'text-white',
                      'transition-all duration-300',
                      '-translate-x-full translate-y-full opacity-0',
                      'group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100'
                    )}
                    strokeWidth={2.5}
                  />
                </div>
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  'lg:hidden p-3 rounded-lg relative z-50 min-w-[44px] min-h-[44px] flex items-center justify-center',
                  'text-[var(--color-foreground)]',
                  'transition-colors duration-200'
                )}
                aria-label="Toggle menu"
              >
                <HamburgerIcon isOpen={isMobileMenuOpen} />
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* =====================================================================
          MOBILE MENU — full-screen overlay
          ===================================================================== */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Panel — slides in from right */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'fixed top-0 right-0 bottom-0 w-full max-w-sm z-40 lg:hidden',
                'bg-[var(--color-background)]/95 backdrop-blur-xl',
                'border-l border-[var(--color-border-subtle)]',
                'overflow-y-auto'
              )}
            >
              {/* Top spacer for the header */}
              <div className="h-16" />

              <div className="px-6 pt-4 pb-10">
                {/* Nav Items */}
                <nav className="space-y-1">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.05 + index * 0.05,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'block py-4',
                          'text-xl sm:text-2xl font-medium',
                          'text-[var(--color-foreground)]',
                          'hover:text-[var(--color-foreground-muted)]',
                          'transition-colors duration-200'
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="my-8 border-t border-[var(--color-border)] origin-left"
                />

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                >
                  <Link
                    href={cta.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'inline-flex items-center gap-2',
                      'px-6 py-3.5 rounded-full',
                      'bg-[#9C6F6E]',
                      'text-white',
                      'text-sm font-medium',
                      'transition-colors duration-200'
                    )}
                  >
                    {cta.label}
                    <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navigation;
