'use client';

import { useState, useCallback } from 'react';

/** Shape returned by POST /api/manuals/upload `data`. */
export interface UploadResult {
  url: string;
  path: string;
  filename: string;
}

/**
 * The single POST-to-`/api/manuals/upload` implementation (T-004, AC4).
 *
 * ImageBlock, ImageRowBlock, and CaptionedFigureBlock all upload images the same
 * way (file picker, drag-drop, clipboard paste). This hook is the one place that
 * actually talks to the upload route, so a grep for the endpoint returns exactly
 * one call site. Each consumer keeps its own placement logic (single src, a row
 * cell, a figure src) and reuses `upload`, `uploading`, and `error` here.
 */
export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File): Promise<UploadResult | null> => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/manuals/upload', { method: 'POST', body: formData });
      const json = await res.json();
      if (json.error) {
        setError(json.error);
        return null;
      }
      return json.data as UploadResult;
    } catch {
      setError('Upload failed. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading, error, setError };
}
