'use client';

import { useState, useRef } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
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
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  // Empty state — upload prompt
  if (!content.src) {
    if (readOnly) return null;

    return (
      <div
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center',
          'border-2 border-dashed border-[var(--color-border)] rounded-xl',
          'py-12 px-6 cursor-pointer',
          'hover:border-[var(--color-rose-clay)]/40 hover:bg-[var(--color-background-subtle)]/50',
          'transition-colors duration-200'
        )}
      >
        <svg className="w-8 h-8 text-[var(--color-foreground-faint)] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
        </svg>
        <p className="text-sm text-[var(--color-foreground-muted)]">
          {uploading ? 'Uploading...' : 'Click to upload an image'}
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
    <div className="group relative">
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
              className="w-full text-sm text-center text-[var(--color-foreground-muted)] italic bg-transparent outline-none placeholder:text-[var(--color-foreground-faint)]"
            />
          )}
        </div>
      )}

      {/* Replace image button */}
      {!readOnly && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs bg-black/60 text-white px-3 py-1.5 rounded-lg hover:bg-black/80 transition-colors"
          >
            {uploading ? 'Uploading...' : 'Replace'}
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
