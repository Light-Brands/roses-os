'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroMinimalProps {
  announcement?: { text: string; href?: string };
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  showScrollIndicator?: boolean;
}

export function HeroMinimal({
  announcement,
  title,
  subtitle,
  primaryCta = { label: 'Start Building', href: '#' },
  secondaryCta,
  showScrollIndicator = true,
}: HeroMinimalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split title into characters for animation
      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll('.char');
        gsap.from(chars, {
          y: 50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.02,
          ease: 'power3.out',
          delay: 0.3,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Split title into characters
  const renderTitle = () => {
    return title.split('').map((char, i) => (
      <span key={i} className="char inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-neutral-950"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-primary-950/50 dark:via-neutral-950 dark:to-secondary-950/50" />

        {/* Animated orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-400/30 dark:bg-primary-500/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary-400/30 dark:bg-secondary-500/20 rounded-full blur-[100px]"
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                           linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      <motion.div
        style={{ opacity, scale, y }}
        className="container-premium relative z-10 pt-32 pb-20 text-center"
      >
        {/* Announcement */}
        {announcement && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            {announcement.href ? (
              <Link
                href={announcement.href}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2',
                  'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm',
                  'text-neutral-700 dark:text-neutral-300',
                  'text-sm font-medium rounded-full',
                  'border border-neutral-200/50 dark:border-neutral-800/50',
                  'shadow-sm hover:shadow-md',
                  'transition-all duration-300'
                )}
              >
                <Sparkles className="w-4 h-4 text-primary-500" />
                {announcement.text}
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <span
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2',
                  'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm',
                  'text-neutral-700 dark:text-neutral-300',
                  'text-sm font-medium rounded-full',
                  'border border-neutral-200/50 dark:border-neutral-800/50'
                )}
              >
                <Sparkles className="w-4 h-4 text-primary-500" />
                {announcement.text}
              </span>
            )}
          </motion.div>
        )}

        {/* Title */}
        <h1
          ref={titleRef}
          className={cn(
            'text-5xl sm:text-6xl md:text-7xl lg:text-8xl',
            'font-extrabold tracking-tighter',
            'text-neutral-900 dark:text-white',
            'mb-6'
          )}
        >
          {renderTitle()}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={cn(
              'text-xl md:text-2xl',
              'text-neutral-500 dark:text-neutral-400',
              'max-w-2xl mx-auto mb-12',
              'font-light tracking-tight'
            )}
          >
            {subtitle}
          </motion.p>
        )}

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href={primaryCta.href}
            className={cn(
              'group relative inline-flex items-center gap-2 px-8 py-4',
              'bg-neutral-900 dark:bg-white',
              'text-white dark:text-neutral-900',
              'text-base font-semibold rounded-full',
              'overflow-hidden',
              'transition-all duration-300'
            )}
          >
            {/* Gradient hover effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              {primaryCta.label}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className={cn(
                'inline-flex items-center gap-2 px-8 py-4',
                'text-neutral-600 dark:text-neutral-400',
                'text-base font-medium rounded-full',
                'hover:text-neutral-900 dark:hover:text-white',
                'transition-colors duration-300'
              )}
            >
              {secondaryCta.label}
            </Link>
          )}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      {showScrollIndicator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
              Scroll
            </span>
            <div className="w-6 h-10 rounded-full border-2 border-neutral-300 dark:border-neutral-700 flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-600 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

export default HeroMinimal;
