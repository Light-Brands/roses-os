'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type CTAVariant = 'simple' | 'gradient' | 'split' | 'centered';

interface CTASectionProps {
  variant?: CTAVariant;
  eyebrow?: string;
  title: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image?: { src: string; alt: string };
  stats?: { value: string; label: string }[];
}

export function CTASection({
  variant = 'gradient',
  eyebrow,
  title,
  description,
  primaryCta = { label: 'Get Started', href: '#' },
  secondaryCta,
  image,
  stats,
}: CTASectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-content', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (variant === 'simple') {
    return (
      <section ref={sectionRef} className="section-padding bg-white dark:bg-neutral-950">
        <div className="container-premium">
          <div className="cta-content max-w-3xl mx-auto text-center">
            {eyebrow && (
              <span className="inline-block text-sm font-semibold text-primary-500 mb-4 uppercase tracking-wider">
                {eyebrow}
              </span>
            )}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
              {title}
            </h2>
            {description && (
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-10">
                {description}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button href={primaryCta.href} size="lg" icon={<ArrowRight />}>
                {primaryCta.label}
              </Button>
              {secondaryCta && (
                <Button href={secondaryCta.href} variant="outline" size="lg">
                  {secondaryCta.label}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'gradient') {
    return (
      <section ref={sectionRef} className="section-padding">
        <div className="container-premium">
          <div
            className={cn(
              'cta-content relative overflow-hidden',
              'bg-gradient-to-br from-primary-500 to-secondary-500',
              'rounded-3xl p-8 md:p-12 lg:p-16'
            )}
          >
            {/* Background pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '32px 32px',
              }}
            />

            {/* Glowing orb */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              {eyebrow && (
                <span className="inline-block text-sm font-semibold text-white/80 mb-4 uppercase tracking-wider">
                  {eyebrow}
                </span>
              )}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
                {title}
              </h2>
              {description && (
                <p className="text-lg text-white/80 mb-10">
                  {description}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={primaryCta.href}
                  className={cn(
                    'inline-flex items-center gap-2 px-8 py-4',
                    'bg-white text-primary-600',
                    'font-semibold rounded-xl',
                    'shadow-lg hover:shadow-xl',
                    'hover:bg-neutral-50',
                    'transition-all duration-300'
                  )}
                >
                  {primaryCta.label}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                {secondaryCta && (
                  <Link
                    href={secondaryCta.href}
                    className={cn(
                      'inline-flex items-center gap-2 px-8 py-4',
                      'bg-white/10 text-white',
                      'font-semibold rounded-xl',
                      'border border-white/20',
                      'hover:bg-white/20',
                      'transition-all duration-300'
                    )}
                  >
                    {secondaryCta.label}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'split') {
    return (
      <section
        ref={sectionRef}
        className="section-padding bg-neutral-50 dark:bg-neutral-900"
      >
        <div className="container-premium">
          <div className="cta-content grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {eyebrow && (
                <span className="inline-block text-sm font-semibold text-primary-500 mb-4 uppercase tracking-wider">
                  {eyebrow}
                </span>
              )}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
                {title}
              </h2>
              {description && (
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
                  {description}
                </p>
              )}
              <div className="flex flex-wrap gap-4">
                <Button href={primaryCta.href} size="lg" icon={<ArrowRight />}>
                  {primaryCta.label}
                </Button>
                {secondaryCta && (
                  <Button href={secondaryCta.href} variant="ghost" size="lg">
                    {secondaryCta.label}
                  </Button>
                )}
              </div>
            </div>

            {stats && (
              <div className="grid grid-cols-2 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={cn(
                      'p-6 rounded-2xl',
                      'bg-white dark:bg-neutral-800',
                      'border border-neutral-200 dark:border-neutral-700',
                      'shadow-sm'
                    )}
                  >
                    <div className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Default: centered variant
  return (
    <section
      ref={sectionRef}
      className="section-padding bg-neutral-900 dark:bg-neutral-950"
    >
      <div className="container-premium">
        <div className="cta-content relative">
          {/* Gradient background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full max-w-2xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20 blur-3xl" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            {eyebrow && (
              <span className="inline-block text-sm font-semibold text-primary-400 mb-4 uppercase tracking-wider">
                {eyebrow}
              </span>
            )}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
              {title}
            </h2>
            {description && (
              <p className="text-lg text-neutral-400 mb-10">
                {description}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                href={primaryCta.href}
                variant="gradient"
                size="lg"
                icon={<ArrowRight />}
              >
                {primaryCta.label}
              </Button>
              {secondaryCta && (
                <Button
                  href={secondaryCta.href}
                  variant="outline"
                  size="lg"
                  className="border-neutral-700 text-white hover:bg-neutral-800"
                >
                  {secondaryCta.label}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
