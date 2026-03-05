'use client';

import { useState } from 'react';
import { ImageDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TeachingSlide } from '@/lib/data/types';

interface ImageDownloadButtonProps {
  slides: TeachingSlide[];
  level: number;
  className?: string;
}

/** Collect unique image filenames from slides (both original and reimagined). */
function getImageFilenames(slides: TeachingSlide[]): string[] {
  const filenames = new Set<string>();
  for (const slide of slides) {
    if (slide.reimaginedImage) filenames.add(slide.reimaginedImage);
    if (slide.originalImage) filenames.add(slide.originalImage);
  }
  return Array.from(filenames);
}

export function ImageDownloadButton({ slides, level, className }: ImageDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const filenames = getImageFilenames(slides);

  if (filenames.length === 0) return null;

  async function handleDownload() {
    setDownloading(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      const results = await Promise.allSettled(
        filenames.map(async (filename) => {
          const url = `/rose med images/${filename}`;
          const response = await fetch(url);
          if (!response.ok) return;
          const blob = await response.blob();
          zip.file(filename, blob);
        }),
      );

      // Check that at least one image was added
      const added = results.filter((r) => r.status === 'fulfilled').length;
      if (added === 0) {
        alert('No images could be loaded. Please try again.');
        return;
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `roses-os-level-${level}-images.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Image download failed:', err);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={cn(
        'inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium',
        'bg-[var(--color-background-subtle)] text-[var(--color-foreground)]',
        'border border-[var(--color-border)]',
        'hover:bg-[var(--color-background-muted)]',
        'transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'print:hidden',
        'text-sm',
        className,
      )}
    >
      <ImageDown className="h-4 w-4" />
      <span>{downloading ? 'Preparing download\u2026' : `Download Images (${filenames.length})`}</span>
    </button>
  );
}
