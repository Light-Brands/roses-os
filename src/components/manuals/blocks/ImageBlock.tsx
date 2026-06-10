'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { ImageContent } from '@/lib/manuals/types';

interface ImageBlockProps {
  content: ImageContent;
  onChange: (content: ImageContent) => void;
  readOnly: boolean;
}

export default function ImageBlock({ content, onChange, readOnly }: ImageBlockProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/manuals/upload', { method: 'POST', body: formData });
      const json = await res.json();

      if (json.error) {
        setError(json.error);
        return;
      }

      onChange({
        ...content,
        src: json.data.url,
        alt: content.alt || file.name.replace(/\.[^.]+$/, ''),
      });
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [content, onChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleUpload(file);
    }
  }, [handleUpload]);

  // Paste an image from the clipboard (screenshot, copied image, etc.).
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

  // Focus the empty dropzone when it mounts so Ctrl/Cmd+V pastes immediately
  // after adding the block, without clicking first.
  useEffect(() => {
    if (!content.src && !readOnly) dropRef.current?.focus({ preventScroll: true });
  }, [content.src, readOnly]);

  // Empty state — upload prompt
  if (!content.src) {
    if (readOnly) return null;

    return (
      <div
        ref={dropRef}
        tabIndex={0}
        role="button"
        aria-label="Upload image: paste, drop, or click"
        onClick={() => fileInputRef.current?.click()}
        onPaste={handlePaste}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center',
          'border-2 border-dashed rounded-xl',
          'py-10 px-6 cursor-pointer outline-none',
          'transition-all duration-200',
          'focus:border-[var(--color-rose-clay)] focus:bg-[var(--color-rose-50)]/40',
          dragOver
            ? 'border-[var(--color-rose-clay)] bg-[var(--color-rose-50)]/50 dark:bg-[var(--color-rose-950)]/20 scale-[1.01]'
            : 'border-[var(--color-border)] hover:border-[var(--color-rose-clay)]/40 hover:bg-[var(--color-background-subtle)]/50'
        )}
      >
        <svg className="w-10 h-10 text-[var(--color-foreground-faint)] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <p className="text-sm font-medium text-[var(--color-foreground-muted)] mb-1">
          {uploading ? 'Uploading...' : dragOver ? 'Drop to upload' : 'Paste, drop, or click to upload'}
        </p>
        <p className="text-xs text-[var(--color-foreground-faint)]">
          Paste an image with Ctrl/Cmd+V. JPEG, PNG, WebP or GIF up to 5MB.
        </p>
        {error && <p className="text-xs text-[var(--color-error)] mt-2">{error}</p>}
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

  // Image with caption
  return (
    <div className="group/img relative">
      <div className="rounded-xl overflow-hidden bg-[var(--color-background-muted)] mx-auto max-w-md sm:max-w-lg md:max-w-xl">
        <img
          src={content.src}
          alt={content.alt || ''}
          className="block w-full h-auto max-h-[60vh] object-contain"
        />
      </div>

      {/* Caption */}
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
              placeholder="Add a caption..."
              className="w-full text-sm text-center text-[var(--color-foreground-muted)] italic bg-transparent outline-none border-b border-transparent focus:border-[var(--color-border)] pb-1 transition-colors placeholder:text-[var(--color-foreground-faint)]"
            />
          )}
        </div>
      )}

      {/* Replace / alt text controls */}
      {!readOnly && (
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
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
  );
}
