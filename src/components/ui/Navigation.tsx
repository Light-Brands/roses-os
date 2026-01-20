'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme';
import { Logo } from './Logo';

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
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  {
    label: 'Resources',
    href: '#',
    children: [
      { label: 'Documentation', href: '/docs', description: 'Learn how to integrate' },
      { label: 'Blog', href: '/blog', description: 'Latest news and updates' },
      { label: 'Support', href: '/support', description: 'Get help from our team' },
    ],
  },
  { label: 'About', href: '#about' },
];

export function Navigation({
  logo,
  items = defaultItems,
  cta = { label: 'Get Started', href: '#' },
  transparent = false,
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { resolvedTheme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navBackground = transparent && !isScrolled
    ? 'bg-transparent'
    : 'bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg border-b border-neutral-200/50 dark:border-neutral-800/50';

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          navBackground
        )}
      >
        <nav className="container-premium">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            {logo || <Logo size="md" className="z-10" />}

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {items.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg',
                      'text-neutral-600 dark:text-neutral-300',
                      'hover:text-neutral-900 dark:hover:text-white',
                      'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                      'transition-colors duration-200'
                    )}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform duration-200',
                          activeDropdown === item.label && 'rotate-180'
                        )}
                      />
                    )}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {item.children && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                        className={cn(
                          'absolute top-full left-0 mt-2 w-64 p-2',
                          'bg-white dark:bg-neutral-900',
                          'border border-neutral-200 dark:border-neutral-800',
                          'rounded-xl shadow-xl',
                          'origin-top-left'
                        )}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className={cn(
                              'block px-4 py-3 rounded-lg',
                              'hover:bg-neutral-50 dark:hover:bg-neutral-800',
                              'transition-colors duration-200'
                            )}
                          >
                            <span className="block text-sm font-medium text-neutral-900 dark:text-white">
                              {child.label}
                            </span>
                            {child.description && (
                              <span className="block text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                {child.description}
                              </span>
                            )}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={cn(
                  'p-2 rounded-lg',
                  'text-neutral-600 dark:text-neutral-300',
                  'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                  'transition-colors duration-200'
                )}
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* CTA Button */}
              <Link
                href={cta.href}
                className={cn(
                  'hidden sm:flex items-center gap-2 px-5 py-2.5',
                  'bg-neutral-900 dark:bg-white',
                  'text-white dark:text-neutral-900',
                  'text-sm font-medium rounded-xl',
                  'hover:bg-neutral-800 dark:hover:bg-neutral-100',
                  'shadow-sm hover:shadow-md',
                  'transition-all duration-200'
                )}
              >
                {cta.label}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  'lg:hidden p-2 rounded-lg',
                  'text-neutral-600 dark:text-neutral-300',
                  'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                  'transition-colors duration-200'
                )}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className={cn(
                'fixed top-0 right-0 bottom-0 w-full max-w-sm z-50 lg:hidden',
                'bg-white dark:bg-neutral-950',
                'border-l border-neutral-200 dark:border-neutral-800',
                'overflow-y-auto'
              )}
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'p-2 rounded-lg',
                      'text-neutral-600 dark:text-neutral-300',
                      'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                      'transition-colors duration-200'
                    )}
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile Nav Items */}
                <nav className="space-y-2">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'block px-4 py-3 rounded-xl',
                          'text-lg font-medium',
                          'text-neutral-900 dark:text-white',
                          'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                          'transition-colors duration-200'
                        )}
                      >
                        {item.label}
                      </Link>

                      {item.children && (
                        <div className="ml-4 mt-2 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={cn(
                                'block px-4 py-2 rounded-lg',
                                'text-sm text-neutral-600 dark:text-neutral-400',
                                'hover:text-neutral-900 dark:hover:text-white',
                                'hover:bg-neutral-50 dark:hover:bg-neutral-800',
                                'transition-colors duration-200'
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8"
                >
                  <Link
                    href={cta.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'block w-full px-6 py-4 text-center',
                      'bg-neutral-900 dark:bg-white',
                      'text-white dark:text-neutral-900',
                      'font-medium rounded-xl',
                      'hover:bg-neutral-800 dark:hover:bg-neutral-100',
                      'transition-colors duration-200'
                    )}
                  >
                    {cta.label}
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
