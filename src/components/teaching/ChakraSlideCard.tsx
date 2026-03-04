'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChakraSlideData } from '@/lib/data/types';

interface ChakraSlideCardProps {
  chakra: ChakraSlideData;
  index?: number;
  className?: string;
}

export default function ChakraSlideCard({ chakra, index = 0, className }: ChakraSlideCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.5,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        'rounded-xl overflow-hidden',
        'bg-[var(--color-surface)]',
        'border border-[var(--color-border-subtle)]',
        className
      )}
    >
      {/* Image Placeholder — tinted with chakra color */}
      <div
        className="relative flex flex-col items-center justify-center gap-3 aspect-[16/10]"
        style={{
          background: `linear-gradient(135deg, ${chakra.chakraColor}10 0%, ${chakra.chakraColor}20 100%)`,
          borderBottom: `2px dashed ${chakra.chakraColor}40`,
        }}
      >
        <ImageIcon
          className="w-10 h-10"
          strokeWidth={1.5}
          style={{ color: `${chakra.chakraColor}60` }}
        />
        <p
          className="font-serif text-lg text-center px-6"
          style={{ color: `${chakra.chakraColor}90` }}
        >
          {chakra.concept}
        </p>
        <p className="text-xs text-[var(--color-foreground-faint)] text-center px-6 max-w-md">
          {chakra.imageNote || `Body illustration — dominant ${chakra.chakraColor} color`}
        </p>
        <span
          className="absolute top-3 left-3 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            color: `${chakra.chakraColor}80`,
            backgroundColor: `${chakra.chakraColor}15`,
          }}
        >
          {chakra.sanskritName}
        </span>
      </div>

      {/* Chakra Content */}
      <div className="p-5 lg:p-6 space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <h3 className="font-serif font-semibold text-lg lg:text-xl text-[var(--color-foreground)]">
            {chakra.sanskritName} — {chakra.concept.replace(' Chakra', '')}
          </h3>
          <p
            className="font-serif text-2xl font-bold"
            style={{ color: chakra.chakraColor }}
          >
            {chakra.coreStatement}
          </p>
        </div>

        {/* Attributes */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          <div>
            <span className="text-[var(--color-foreground-faint)] text-xs uppercase tracking-wider">Color</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="w-3 h-3 rounded-full border border-black/10"
                style={{ backgroundColor: chakra.chakraColor }}
              />
              <span className="text-[var(--color-foreground-muted)]">
                {chakra.element === 'Air' ? 'Green / Pink' : chakra.chakraColor === '#7C3AED' ? 'Violet / White' : ''}
              </span>
            </div>
          </div>
          <div>
            <span className="text-[var(--color-foreground-faint)] text-xs uppercase tracking-wider">Element</span>
            <p className="text-[var(--color-foreground-muted)] mt-0.5">{chakra.element}</p>
          </div>
          <div>
            <span className="text-[var(--color-foreground-faint)] text-xs uppercase tracking-wider">Location</span>
            <p className="text-[var(--color-foreground-muted)] mt-0.5">{chakra.bodyLocation}</p>
          </div>
          <div>
            <span className="text-[var(--color-foreground-faint)] text-xs uppercase tracking-wider">Energy</span>
            <p className="text-[var(--color-foreground-muted)] mt-0.5">{chakra.energy}</p>
          </div>
        </div>

        {/* Focus */}
        <div className="text-sm">
          <span className="text-[var(--color-foreground-faint)] text-xs uppercase tracking-wider">Focus</span>
          <p className="text-[var(--color-foreground)] font-medium mt-0.5">{chakra.focus}</p>
        </div>

        {/* Balanced / Unbalanced */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <span className="text-[var(--color-foreground-faint)] text-xs uppercase tracking-wider">
              Balanced Expression
            </span>
            <ul className="space-y-1">
              {chakra.balanced.map((item) => (
                <li key={item} className="text-[var(--color-foreground-muted)] flex items-start gap-1.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: chakra.chakraColor }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <span className="text-[var(--color-foreground-faint)] text-xs uppercase tracking-wider">
              Unbalanced Expression
            </span>
            <ul className="space-y-1">
              {chakra.unbalanced.map((item) => (
                <li key={item} className="text-[var(--color-foreground-muted)] flex items-start gap-1.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[var(--color-foreground-faint)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Blockages */}
        <div className="text-sm border-t border-[var(--color-border-subtle)] pt-3">
          <span className="text-[var(--color-foreground-faint)] text-xs uppercase tracking-wider">
            Primary Blockages
          </span>
          <p className="text-[var(--color-foreground-muted)] mt-0.5 font-medium">{chakra.blockages}</p>
        </div>

        {/* Extra content (e.g. Heart Chakra's Human/Spiritual Love) */}
        {chakra.extraContent && (
          <div className="text-sm border-t border-[var(--color-border-subtle)] pt-3">
            <div className="text-[var(--color-foreground-muted)] whitespace-pre-line leading-relaxed">
              {chakra.extraContent}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
