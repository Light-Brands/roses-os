'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroSplitProps {
  eyebrow?: string;
  title: string;
  description: string;
  features?: string[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  imagePosition?: 'left' | 'right';
  stats?: { value: string; label: string }[];
}

export function HeroSplit({
  eyebrow,
  title,
  description,
  features,
  primaryCta = { label: 'Get Started', href: '#' },
  secondaryCta,
  image,
  imagePosition = 'right',
  stats,
}: HeroSplitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate image with parallax effect
      if (imageRef.current) {
        gsap.from(imageRef.current, {
          scale: 1.1,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.3,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const contentOrder = imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2';
  const imageOrder = imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1';

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-neutral-50 dark:bg-neutral-950"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(var(--color-neutral-300)) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container-premium relative z-10 py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className={cn('space-y-8', contentOrder)}>
            {/* Eyebrow */}
            {eyebrow && (
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                  'inline-block px-4 py-1.5',
                  'bg-primary-100 dark:bg-primary-900/30',
                  'text-primary-700 dark:text-primary-300',
                  'text-sm font-semibold rounded-full uppercase tracking-wider'
                )}
              >
                {eyebrow}
              </motion.span>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={cn(
                'text-4xl sm:text-5xl lg:text-6xl',
                'font-bold tracking-tight leading-tight',
                'text-neutral-900 dark:text-white'
              )}
            >
              {title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={cn(
                'text-lg lg:text-xl',
                'text-neutral-600 dark:text-neutral-400',
                'leading-relaxed'
              )}
            >
              {description}
            </motion.p>

            {/* Features */}
            {features && (
              <motion.ul
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-3"
              >
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </motion.ul>
            )}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link
                href={primaryCta.href}
                className={cn(
                  'group inline-flex items-center gap-2 px-8 py-4',
                  'bg-primary-500 hover:bg-primary-600',
                  'text-white text-base font-semibold rounded-xl',
                  'shadow-primary hover:shadow-primary-lg',
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
                    'inline-flex items-center gap-2 px-8 py-4',
                    'text-neutral-700 dark:text-neutral-300',
                    'text-base font-semibold rounded-xl',
                    'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                    'transition-all duration-300'
                  )}
                >
                  {secondaryCta.label}
                </Link>
              )}
            </motion.div>

            {/* Stats */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-8 pt-8 border-t border-neutral-200 dark:border-neutral-800"
              >
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl font-bold text-neutral-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-500">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Image */}
          <div
            ref={imageRef}
            className={cn('relative', imageOrder)}
          >
            <div className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-transparent z-10 mix-blend-overlay" />

              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary-500/20 rounded-full blur-2xl" />

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className={cn(
                'absolute -bottom-6 -left-6 lg:-left-12',
                'bg-white dark:bg-neutral-900',
                'p-4 rounded-2xl shadow-xl',
                'border border-neutral-100 dark:border-neutral-800'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Ready to go
                  </div>
                  <div className="text-xs text-neutral-500">
                    Production ready
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSplit;
