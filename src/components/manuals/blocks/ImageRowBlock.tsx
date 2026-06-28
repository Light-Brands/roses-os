'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { ImageRowContent, ImageRowItem } from '@/lib/manuals/types';
import { useImageUpload } from './useImageUpload';

interface ImageRowBlockProps {
  content: ImageRowContent;
  onChange: (content: ImageRowContent) => void;
  readOnly: boolean;
}

const MIN_IMAGES = 2;
const MAX_IMAGES = 4;

function ImageCell({
  image,
  index,
  readOnly,
  uploading,
  onUpload,
  onRemove,
  canRemove,
}: {
  image: ImageRowItem;
  index: number;
  readOnly: boolean;
  uploading: boolean;
  onUpload: (file: File, index: number) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file, index);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) onUpload(file, index);
  };

  if (!image.src) {
    if (readOnly) return <div className="aspect-square bg-[var(--color-background-muted)] rounded-lg" />;

    return (
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'aspect-square flex flex-col items-center justify-center',
          'border-2 border-dashed rounded-lg cursor-pointer',
          'transition-all duration-200',
          dragOver
            ? 'border-[var(--color-rose-clay)] bg-[var(--color-rose-50)]/50 dark:bg-[var(--color-rose-950)]/20'
            : 'border-[var(--color-border)] hover:border-[var(--color-rose-clay)]/40 hover:bg-[var(--color-background-subtle)]/50'
        )}
      >
        <svg className="w-6 h-6 text-[var(--color-foreground-faint)] mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <p className="text-[10px] text-[var(--color-foreground-muted)] text-center px-2">
          {uploading ? 'Uploading…' : 'Click or drop'}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="group/cell relative rounded-lg overflow-hidden bg-[var(--color-background-muted)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt || ''}
        className="block w-full h-full max-h-[300px] object-contain"
      />
      {!readOnly && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/cell:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[10px] bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md hover:bg-black/80"
            aria-label={`Replace image ${index + 1}`}
          >
            Replace
          </button>
          {canRemove && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-[10px] bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md hover:bg-black/80"
              aria-label={`Remove image ${index + 1}`}
            >
              Remove
            </button>
          )}
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
  );
}

export default function ImageRowBlock({ content, onChange, readOnly }: ImageRowBlockProps) {
  const images = useMemo<ImageRowItem[]>(
    () => (content.images && content.images.length > 0
      ? content.images
      : [{ src: '', alt: '' }, { src: '', alt: '' }]),
    [content.images]
  );
  const { upload, error } = useImageUpload();
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleUpload = useCallback(async (file: File, index: number) => {
    setUploadingIndex(index);
    try {
      const result = await upload(file);
      if (!result) return;
      const next = images.map((img, i) =>
        i === index
          ? { src: result.url, alt: img.alt || file.name.replace(/\.[^.]+$/, '') }
          : img
      );
      onChange({ ...content, images: next });
    } finally {
      setUploadingIndex(null);
    }
  }, [content, images, onChange, upload]);

  const handleRemove = useCallback((index: number) => {
    if (images.length <= MIN_IMAGES) return;
    onChange({ ...content, images: images.filter((_, i) => i !== index) });
  }, [content, images, onChange]);

  const handleAddCell = useCallback(() => {
    if (images.length >= MAX_IMAGES) return;
    onChange({ ...content, images: [...images, { src: '', alt: '' }] });
  }, [content, images, onChange]);

  // Grid columns scale with image count for clean layout (and stack to 2 cols on mobile)
  const gridCols = images.length === 4
    ? 'grid-cols-2 sm:grid-cols-4'
    : images.length === 3
    ? 'grid-cols-1 sm:grid-cols-3'
    : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div className="group/imgrow">
      <div className={cn('grid gap-6 mx-auto max-w-prose', gridCols)}>
        {images.map((image, i) => (
          <ImageCell
            key={i}
            image={image}
            index={i}
            readOnly={readOnly}
            uploading={uploadingIndex === i}
            onUpload={handleUpload}
            onRemove={handleRemove}
            canRemove={images.length > MIN_IMAGES}
          />
        ))}
      </div>

      {error && !readOnly && (
        <p className="text-xs text-[var(--color-error)] mt-2 text-center">{error}</p>
      )}

      {!readOnly && images.length < MAX_IMAGES && (
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={handleAddCell}
            className="text-xs text-[var(--color-foreground-faint)] hover:text-[var(--color-rose-clay)] transition-colors px-2 py-1"
          >
            + Add image to row ({images.length}/{MAX_IMAGES})
          </button>
        </div>
      )}

      {(content.caption || !readOnly) && (
        <div className="mt-2">
          {readOnly ? (
            content.caption && (
              <p className="text-sm text-center text-[var(--color-foreground-muted)] italic">
                {content.caption}
              </p>
            )
          ) : (
            <input
              type="text"
              value={content.caption || ''}
              onChange={(e) => onChange({ ...content, caption: e.target.value })}
              placeholder="Add a caption for the row…"
              className="w-full text-sm text-center text-[var(--color-foreground-muted)] italic bg-transparent outline-none border-b border-transparent focus:border-[var(--color-border)] pb-1 transition-colors placeholder:text-[var(--color-foreground-faint)]"
            />
          )}
        </div>
      )}
    </div>
  );
}
