'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { CaptionedFigureContent } from '@/lib/manuals/types';
import { useImageUpload } from '../useImageUpload';

interface Props {
  content: CaptionedFigureContent;
  onChange: (content: CaptionedFigureContent) => void;
  readOnly: boolean;
  /** When nested inside a column cell, the figure fills its cell (100%) rather
   *  than its page-relative width_pct — the cell already carries the proportion
   *  (matches the reconstruction preview, ARCHITECTURE D-13). */
  fill?: boolean;
}

export default function CaptionedFigureBlock({ content, onChange, readOnly, fill }: Props) {
  // The reconstruction carries the figure's real page-relative width as
  // `width_pct` (figure width / page width). Honor it at top level so a small
  // ornament renders small instead of full-bleed; fill the cell when nested.
  const rawPct = (content as { width_pct?: number }).width_pct;
  const widthPct = fill
    ? 100
    : typeof rawPct === 'number'
      ? Math.min(100, Math.max(3, rawPct))
      : 100;

  const { upload, uploading, error } = useImageUpload();
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // T-005 (AC4): replace the image in place through the shared upload hook —
  // the same button every other image block has, instead of a paste-a-URL field.
  // Row-only write here; the recipe write-through that survives a reconstruction
  // re-run is T-008 (D-24).
  const handleUpload = useCallback(async (file: File) => {
    const result = await upload(file);
    if (!result) return;
    onChange({ ...content, src: result.url, alt: content.alt || file.name.replace(/\.[^.]+$/, '') });
  }, [content, onChange, upload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleUpload(file);
  }, [handleUpload]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          handleUpload(file);
          return;
        }
      }
    }
  }, [handleUpload]);

  // Focus the empty dropzone on mount so Ctrl/Cmd+V pastes immediately.
  useEffect(() => {
    if (!content.src && !readOnly) dropRef.current?.focus({ preventScroll: true });
  }, [content.src, readOnly]);

  return (
    <figure className="my-4">
      {content.src ? (
        <div className="group/fig relative flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.src}
            alt={content.alt}
            className="rounded-lg"
            style={{ width: `${widthPct}%`, maxWidth: '100%' }}
          />
          {!readOnly && (
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover/fig:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg hover:bg-black/80 transition-colors shadow-sm"
              >
                {uploading ? 'Uploading...' : 'Replace image'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}
        </div>
      ) : readOnly ? (
        <div className="aspect-[4/3] w-full bg-stone-100 rounded-lg flex items-center justify-center text-stone-400 text-sm">
          Image placeholder
        </div>
      ) : (
        <div
          ref={dropRef}
          tabIndex={0}
          role="button"
          aria-label="Upload figure: paste, drop, or click"
          onClick={() => fileInputRef.current?.click()}
          onPaste={handlePaste}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            'aspect-[4/3] w-full flex flex-col items-center justify-center',
            'border-2 border-dashed rounded-lg cursor-pointer outline-none',
            'transition-all duration-200 text-sm',
            dragOver
              ? 'border-[var(--color-rose-clay)] bg-[var(--color-rose-50)]/50'
              : 'border-stone-300 text-stone-400 hover:border-[var(--color-rose-clay)]/40 hover:bg-[var(--color-background-subtle)]/50'
          )}
        >
          {uploading ? 'Uploading...' : dragOver ? 'Drop to upload' : 'Paste, drop, or click to upload'}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {!readOnly && (
        <div className="mt-2 space-y-1">
          {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
          <input
            type="text"
            value={content.alt}
            onChange={(e) => onChange({ ...content, alt: e.target.value })}
            placeholder="Alt text (for accessibility)"
            className="w-full text-xs bg-transparent border-b border-stone-300 px-0 py-1 focus:outline-none"
            aria-label="Image alt text"
          />
        </div>
      )}

      {content.caption && readOnly && (
        <figcaption className="mt-2 text-sm text-center text-[var(--color-foreground-muted)] italic">
          {content.caption}
        </figcaption>
      )}
    </figure>
  );
}
