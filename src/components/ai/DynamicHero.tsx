'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface DynamicHeroProps {
  /** Base headline to show while loading or as fallback */
  baseHeadline: string;
  /** Base description for fallback */
  baseDescription: string;
  /** User context for personalization */
  userContext?: {
    industry?: string;
    role?: string;
    interests?: string[];
    previousVisit?: boolean;
  };
  /** Whether to enable AI personalization */
  enableAI?: boolean;
  /** API endpoint for AI content generation */
  apiEndpoint?: string;
  /** Primary CTA */
  primaryCTA: { label: string; href: string };
  /** Secondary CTA */
  secondaryCTA?: { label: string; href: string };
  /** Additional class names */
  className?: string;
}

interface AIContent {
  headline: string;
  description: string;
  ctaLabel?: string;
}

/**
 * Dynamic Hero Component with AI-Powered Personalization
 *
 * Features:
 * - Personalizes headline and description based on user context
 * - Graceful fallback to static content
 * - Loading state with skeleton
 * - Caches personalized content
 * - Respects user privacy (no tracking without consent)
 */
export function DynamicHero({
  baseHeadline,
  baseDescription,
  userContext,
  enableAI = true,
  apiEndpoint = '/api/ai/personalize',
  primaryCTA,
  secondaryCTA,
  className,
}: DynamicHeroProps) {
  const [content, setContent] = useState<AIContent | null>(null);
  const [isLoading, setIsLoading] = useState(enableAI);
  const [isPersonalized, setIsPersonalized] = useState(false);

  // Fetch personalized content
  useEffect(() => {
    if (!enableAI || !userContext) {
      setIsLoading(false);
      return;
    }

    // Check cache first
    const cacheKey = `hero_${JSON.stringify(userContext)}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      try {
        const parsedCache = JSON.parse(cached);
        setContent(parsedCache);
        setIsPersonalized(true);
        setIsLoading(false);
        return;
      } catch {
        // Invalid cache, continue to fetch
      }
    }

    // Fetch personalized content
    const fetchContent = async () => {
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            baseHeadline,
            baseDescription,
            userContext,
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();

        if (data.headline && data.description) {
          setContent(data);
          setIsPersonalized(true);

          // Cache the result
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
        }
      } catch (error) {
        console.warn('AI personalization failed, using fallback:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Slight delay to prevent flash
    const timer = setTimeout(fetchContent, 100);
    return () => clearTimeout(timer);
  }, [enableAI, userContext, apiEndpoint, baseHeadline, baseDescription]);

  const headline = content?.headline || baseHeadline;
  const description = content?.description || baseDescription;
  const ctaLabel = content?.ctaLabel || primaryCTA.label;

  return (
    <section
      className={cn(
        'relative min-h-[80vh] flex items-center justify-center',
        'px-4 py-20 lg:py-32',
        'overflow-hidden',
        className
      )}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-950/20 dark:to-transparent" />

      {/* Animated orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary-500/10 blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-secondary-500/10 blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* AI badge */}
        {isPersonalized && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Personalized for you</span>
          </motion.div>
        )}

        {/* Headline */}
        <div className="relative min-h-[120px] lg:min-h-[160px]">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-12 lg:h-16 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse mx-auto max-w-3xl" />
              <div className="h-12 lg:h-16 bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse mx-auto max-w-2xl" />
            </div>
          ) : (
            <motion.h1
              key={headline}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-tight"
            >
              {headline}
            </motion.h1>
          )}
        </div>

        {/* Description */}
        <div className="relative min-h-[80px] mt-6">
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mx-auto max-w-xl" />
              <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mx-auto max-w-lg" />
            </div>
          ) : (
            <motion.p
              key={description}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
            >
              {description}
            </motion.p>
          )}
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <Button
            href={primaryCTA.href}
            variant="gradient"
            size="lg"
            icon={isLoading ? <Loader2 className="animate-spin" /> : undefined}
          >
            {ctaLabel}
          </Button>

          {secondaryCTA && (
            <Button href={secondaryCTA.href} variant="outline" size="lg">
              {secondaryCTA.label}
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default DynamicHero;
