'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroCenteredProps {
  badge?: { text: string; href?: string };
  title: string;
  titleHighlight?: string;
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string; icon?: 'arrow' | 'play' };
  trustedBy?: { label: string; logos: React.ReactNode[] };
}

export function HeroCentered({
  badge,
  title,
  titleHighlight,
  description,
  primaryCta = { label: 'Get Started', href: '#' },
  secondaryCta,
  trustedBy,
}: HeroCenteredProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title words
      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll('.word');
        gsap.from(words, {
          y: 100,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.2,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Split title into words for animation
  const renderTitle = () => {
    const parts = titleHighlight
      ? title.split(titleHighlight)
      : [title];

    return parts.map((part, i) => (
      <span key={i}>
        {part.split(' ').map((word, j) => (
          <span key={j} className="word inline-block overflow-hidden">
            <span className="inline-block">{word}&nbsp;</span>
          </span>
        ))}
        {i < parts.length - 1 && titleHighlight && (
          <span className="word inline-block overflow-hidden">
            <span className="inline-block gradient-text">{titleHighlight}&nbsp;</span>
          </span>
        )}
      </span>
    ));
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-neutral-50 dark:bg-neutral-950" />
      <div className="absolute inset-0 mesh-gradient opacity-70 dark:opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-neutral-950" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-500/10 dark:bg-secondary-500/20 rounded-full blur-3xl animate-pulse-glow delay-1000" />

      <div className="container-premium relative z-10 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {badge.href ? (
                <Link
                  href={badge.href}
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 mb-8',
                    'bg-primary-50 dark:bg-primary-950/50',
                    'text-primary-600 dark:text-primary-400',
                    'text-sm font-medium rounded-full',
                    'border border-primary-200 dark:border-primary-800',
                    'hover:bg-primary-100 dark:hover:bg-primary-900/50',
                    'transition-colors duration-200'
                  )}
                >
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                  {badge.text}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <span
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 mb-8',
                    'bg-primary-50 dark:bg-primary-950/50',
                    'text-primary-600 dark:text-primary-400',
                    'text-sm font-medium rounded-full',
                    'border border-primary-200 dark:border-primary-800'
                  )}
                >
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                  {badge.text}
                </span>
              )}
            </motion.div>
          )}

          {/* Title */}
          <h1
            ref={titleRef}
            className={cn(
              'text-4xl sm:text-5xl md:text-6xl lg:text-7xl',
              'font-extrabold tracking-tighter leading-none',
              'text-neutral-900 dark:text-white',
              'mb-8'
            )}
          >
            {renderTitle()}
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={cn(
              'text-lg md:text-xl',
              'text-neutral-600 dark:text-neutral-400',
              'max-w-2xl mx-auto mb-12',
              'leading-relaxed'
            )}
          >
            {description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href={primaryCta.href}
              className={cn(
                'group flex items-center gap-2 px-8 py-4',
                'bg-neutral-900 dark:bg-white',
                'text-white dark:text-neutral-900',
                'text-base font-semibold rounded-2xl',
                'shadow-lg hover:shadow-xl',
                'hover:bg-neutral-800 dark:hover:bg-neutral-100',
                'transition-all duration-300'
              )}
            >
              {primaryCta.label}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className={cn(
                  'flex items-center gap-2 px-8 py-4',
                  'text-neutral-700 dark:text-neutral-300',
                  'text-base font-semibold rounded-2xl',
                  'border-2 border-neutral-200 dark:border-neutral-700',
                  'hover:border-neutral-300 dark:hover:border-neutral-600',
                  'hover:bg-neutral-50 dark:hover:bg-neutral-800',
                  'transition-all duration-300'
                )}
              >
                {secondaryCta.icon === 'play' && (
                  <Play className="w-5 h-5 fill-current" />
                )}
                {secondaryCta.label}
                {secondaryCta.icon === 'arrow' && <ArrowRight className="w-5 h-5" />}
              </Link>
            )}
          </motion.div>

          {/* Trusted By */}
          {trustedBy && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-20"
            >
              <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-6">
                {trustedBy.label}
              </p>
              <div className="flex items-center justify-center flex-wrap gap-8 opacity-60">
                {trustedBy.logos}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroCentered;
