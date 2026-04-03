'use client';

import { useState, useRef, useCallback } from 'react';
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

  // Empty state — upload prompt
  if (!content.src) {
    if (readOnly) return null;

    return (
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center',
          'border-2 border-dashed rounded-xl',
          'py-10 px-6 cursor-pointer',
          'transition-all duration-200',
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
          {uploading ? 'Uploading...' : dragOver ? 'Drop to upload' : 'Click or drag to upload'}
        </p>
        <p className="text-xs text-[var(--color-foreground-faint)]">
          JPEG, PNG, WebP or GIF up to 5MB
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
      <div className="rounded-xl overflow-hidden bg-[var(--color-background-muted)]">
        <img
          src={content.src}
          alt={content.alt || ''}
          className="w-full h-auto object-contain"
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
