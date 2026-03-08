'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import type { ChakraSlideData } from '@/lib/data/types';

interface ChakraSlideCardProps {
  chakra: ChakraSlideData;
  index?: number;
  className?: string;
}

export default function ChakraSlideCard({ chakra, index = 0, className }: ChakraSlideCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useLanguage();

  const chakraT = t?.chakras[chakra.id];
  const concept = chakraT?.concept ?? chakra.concept;
  const focus = chakraT?.focus ?? chakra.focus;
  const energy = chakraT?.energy ?? chakra.energy;
  const bodyLocation = chakraT?.bodyLocation ?? chakra.bodyLocation;
  const balanced = chakraT?.balanced ?? chakra.balanced;
  const unbalanced = chakraT?.unbalanced ?? chakra.unbalanced;
  const blockages = chakraT?.blockages ?? chakra.blockages;
  const extraContent = chakraT?.extraContent ?? chakra.extraContent;

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
      {/* Image area — show reimagined/original image if available, otherwise show placeholder */}
      {(() => {
        const hasOwnImage = chakra.reimaginedImage || chakra.originalImage;
        const imageSrc = hasOwnImage
          ? `/rose med images/${chakra.reimaginedImage || chakra.originalImage}`
          : null;

        if (imageSrc) {
          return (
            <div
              className="relative aspect-[16/10] bg-white"
              style={{
                borderBottom: `2px solid ${chakra.chakraColor}40`,
              }}
            >
              <img
                src={imageSrc}
                alt={concept}
                className="w-full h-full object-contain"
                loading="lazy"
              />
              <span
                className="absolute top-3 left-3 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-sm"
                style={{
                  color: `${chakra.chakraColor}80`,
                  backgroundColor: `${chakra.chakraColor}15`,
                }}
              >
                {chakra.sanskritName}
              </span>
            </div>
          );
        }

        return (
          <div
            className={cn(
              'relative flex flex-col items-center justify-center gap-3',
              'aspect-[16/10]',
              'bg-[var(--color-background-subtle)]',
            )}
            style={{
              borderBottom: `2px dashed ${chakra.chakraColor}40`,
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${chakra.chakraColor}15` }}
            >
              <ImageIcon className="w-6 h-6" style={{ color: `${chakra.chakraColor}60` }} strokeWidth={1.5} />
            </div>
            <p className="font-serif text-lg text-center px-6" style={{ color: `${chakra.chakraColor}90` }}>
              {concept}
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
        );
      })()}

      {/* Chakra Content */}
      <div className="p-5 lg:p-6 space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <h3 className="font-serif font-semibold text-lg lg:text-xl text-[var(--color-foreground)]">
            {chakra.sanskritName} — {concept.replace(' Chakra', '')}
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
            <span className="text-[var(--color-foreground-faint)] text-xs uppercase tracking-wider">{t?.ui.color ?? 'Color'}</span>
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
            <span className="text-[var(--color-foreground-faint)] text-xs uppercase tracking-wider">{t?.ui.element ?? 'Element'}</span>
            <p className="text-[var(--color-foreground-muted)] mt-0.5">{chakra.element}</p>
          </div>
          <div>
            <span className="text-[var(--color-foreground-faint)] text-xs uppercase tracking-wider">{t?.ui.location ?? 'Location'}</span>
            <p className="text-[var(--color-foreground-muted)] mt-0.5">{bodyLocation}</p>
          </div>
          <div>
            <span className="text-[var(--color-foreground-faint)] text-xs uppercase tracking-wider">{t?.ui.energy ?? 'Energy'}</span>
            <p className="text-[var(--color-foreground-muted)] mt-0.5">{energy}</p>
          </div>
        </div>

        {/* Focus */}
        <div className="text-sm">
          <span className="text-[var(--color-foreground-faint)] text-xs uppercase tracking-wider">{t?.ui.focus ?? 'Focus'}</span>
          <p className="text-[var(--color-foreground)] font-medium mt-0.5">{focus}</p>
        </div>

        {/* Balanced / Unbalanced */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <span className="text-[var(--color-foreground-faint)] text-xs uppercase tracking-wider">
              {t?.ui.balancedExpression ?? 'Balanced Expression'}
            </span>
            <ul className="space-y-1">
              {balanced.map((item) => (
                <li key={item} className="text-[var(--color-foreground-muted)] flex items-start gap-1.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: chakra.chakraColor }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <span className="text-[var(--color-foreground-faint)] text-xs uppercase tracking-wider">
              {t?.ui.unbalancedExpression ?? 'Unbalanced Expression'}
            </span>
            <ul className="space-y-1">
              {unbalanced.map((item) => (
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
            {t?.ui.primaryBlockages ?? 'Primary Blockages'}
          </span>
          <p className="text-[var(--color-foreground-muted)] mt-0.5 font-medium">{blockages}</p>
        </div>

        {/* Extra content (e.g. Heart Chakra's Human/Spiritual Love) */}
        {extraContent && (
          <div className="text-sm border-t border-[var(--color-border-subtle)] pt-3">
            <div className="text-[var(--color-foreground-muted)] whitespace-pre-line leading-relaxed">
              {extraContent}
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}
