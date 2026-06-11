'use client';

/**
 * PageTemplate (T-038).
 *
 * Per Kaze's finding (OQ4): corner-frame chrome is page-template responsibility,
 * not block responsibility. Set per-manual via a manual-level config row in M5+.
 *
 * For now the template is a presentational wrapper around manual-page content
 * that draws optional corner brackets, an optional eyebrow strip with the
 * manual title, and an optional footer credit.
 */

import { typography } from '@/lib/manuals/typography';
import type { ReactNode } from 'react';

export interface PageTemplateProps {
  children: ReactNode;
  /** Optional manual title shown in the eyebrow strip. */
  title?: string;
  /** Optional footer credit line. */
  credit?: string;
  /** Toggle corner brackets. Defaults to true. */
  cornerFrame?: boolean;
}

export default function PageTemplate({ children, title, credit, cornerFrame = true }: PageTemplateProps) {
  return (
    <div
      className="relative mx-auto bg-white print:bg-white"
      style={{
        width: '8.5in',
        minHeight: '11in',
        padding: '0.75in',
        fontFamily: typography.fonts.sans,
        color: typography.palette.ink,
      }}
    >
      {cornerFrame && <CornerFrames color={typography.palette.terracotta} />}
      {title ? (
        <div
          className="mb-4"
          style={{
            fontFamily: typography.fonts.eyebrow,
            fontSize: typography.sizes.eyebrow,
            color: typography.palette.terracotta,
            letterSpacing: typography.tracking.eyebrow,
            textTransform: 'uppercase',
          }}
        >
          {title}
        </div>
      ) : null}
      <div>{children}</div>
      {credit ? (
        <div
          className="mt-8 pt-3 border-t"
          style={{
            borderColor: typography.palette.rose_hairline,
            fontFamily: typography.fonts.sans,
            fontSize: typography.sizes.caption,
            color: typography.palette.terracotta,
          }}
        >
          {credit}
        </div>
      ) : null}
    </div>
  );
}

function CornerFrames({ color }: { color: string }) {
  const arm = 24; // px
  const stroke = 1.5;
  const corner = (style: React.CSSProperties) => (
    <svg
      width={arm}
      height={arm}
      style={{ position: 'absolute', pointerEvents: 'none', ...style }}
      aria-hidden="true"
    >
      <path d={`M0 0 L${arm} 0`} stroke={color} strokeWidth={stroke} fill="none" />
      <path d={`M0 0 L0 ${arm}`} stroke={color} strokeWidth={stroke} fill="none" />
    </svg>
  );
  return (
    <>
      {corner({ top: '0.5in', left: '0.5in' })}
      {corner({ top: '0.5in', right: '0.5in', transform: 'scaleX(-1)' })}
      {corner({ bottom: '0.5in', left: '0.5in', transform: 'scaleY(-1)' })}
      {corner({ bottom: '0.5in', right: '0.5in', transform: 'scale(-1, -1)' })}
    </>
  );
}
