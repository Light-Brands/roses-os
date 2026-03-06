'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Image, Upload, Trash2, RefreshCw, FileText, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PdfImageInfo {
  index: number;
  page: number;
  name: string;
  width: number;
  height: number;
}

interface PdfImageEditorProps {
  manualPaths?: string[];
  className?: string;
}

const DEFAULT_MANUALS = [
  'rose-meditation-level-1-final.pdf',
  'roses-level-1-manual-en.pdf',
  'roses-level-1-manual-es.pdf',
  'roses-level-1-manual-pt.pdf',
  'roses-level-1-manual-el.pdf',
  'ROSES-OS-Level-1-Manual-EN.pdf',
  'ROSES-OS-Level-2-Manual-EN.pdf',
  'ROSES-OS-Level-3-Manual-EN.pdf',
];

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function PdfImageEditor({
  manualPaths = DEFAULT_MANUALS,
  className,
}: PdfImageEditorProps) {
  const [selectedPdf, setSelectedPdf] = useState(manualPaths[0] || '');
  const [images, setImages] = useState<PdfImageInfo[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  // Add image form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addPage, setAddPage] = useState(1);
  const [addX, setAddX] = useState(64);
  const [addY, setAddY] = useState(100);
  const [addWidth, setAddWidth] = useState(300);
  const [addHeight, setAddHeight] = useState(200);

  const fetchImages = useCallback(async () => {
    if (!selectedPdf) return;
    setStatus('loading');
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('action', 'list');
      formData.append('pdfPath', selectedPdf);

      const res = await fetch('/api/pdf/edit', { method: 'POST', body: formData });
      const json = await res.json();

      if (json.error) {
        setStatus('error');
        setMessage(json.error);
        return;
      }

      setImages(json.data.images);
      setPageCount(json.data.pageCount);
      setStatus('success');
    } catch {
      setStatus('error');
      setMessage('Failed to fetch images');
    }
  }, [selectedPdf]);

  const handleReplace = async (imageInfo: PdfImageInfo) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      setStatus('loading');
      setMessage(`Replacing image on page ${imageInfo.page}...`);

      try {
        const formData = new FormData();
        formData.append('action', 'replace');
        formData.append('pdfPath', selectedPdf);
        formData.append('image', file);
        formData.append('page', String(imageInfo.page));
        // Use approximate positions based on image dimensions
        formData.append('x', '64');
        formData.append('y', '100');
        formData.append('width', String(imageInfo.width || 300));
        formData.append('height', String(imageInfo.height || 200));

        const res = await fetch('/api/pdf/edit', { method: 'POST', body: formData });
        const json = await res.json();

        if (json.error) {
          setStatus('error');
          setMessage(json.error);
          return;
        }

        setStatus('success');
        setMessage(`Image replaced on page ${imageInfo.page}`);
        fetchImages();
      } catch {
        setStatus('error');
        setMessage('Failed to replace image');
      }
    };
    input.click();
  };

  const handleRemove = async (imageInfo: PdfImageInfo) => {
    if (!confirm(`Remove image "${imageInfo.name}" from page ${imageInfo.page}?`)) return;

    setStatus('loading');
    setMessage(`Removing image from page ${imageInfo.page}...`);

    try {
      const formData = new FormData();
      formData.append('action', 'remove');
      formData.append('pdfPath', selectedPdf);
      formData.append('page', String(imageInfo.page));
      formData.append('x', '64');
      formData.append('y', '100');
      formData.append('width', String(imageInfo.width || 300));
      formData.append('height', String(imageInfo.height || 200));

      const res = await fetch('/api/pdf/edit', { method: 'POST', body: formData });
      const json = await res.json();

      if (json.error) {
        setStatus('error');
        setMessage(json.error);
        return;
      }

      setStatus('success');
      setMessage(`Image removed from page ${imageInfo.page}`);
      fetchImages();
    } catch {
      setStatus('error');
      setMessage('Failed to remove image');
    }
  };

  const handleAdd = async (file: File) => {
    setStatus('loading');
    setMessage(`Adding image to page ${addPage}...`);

    try {
      const formData = new FormData();
      formData.append('action', 'add');
      formData.append('pdfPath', selectedPdf);
      formData.append('image', file);
      formData.append('page', String(addPage));
      formData.append('x', String(addX));
      formData.append('y', String(addY));
      formData.append('width', String(addWidth));
      formData.append('height', String(addHeight));

      const res = await fetch('/api/pdf/edit', { method: 'POST', body: formData });
      const json = await res.json();

      if (json.error) {
        setStatus('error');
        setMessage(json.error);
        return;
      }

      setStatus('success');
      setMessage(`Image added to page ${addPage}`);
      setShowAddForm(false);
      fetchImages();
    } catch {
      setStatus('error');
      setMessage('Failed to add image');
    }
  };

  const buttonClass = cn(
    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium',
    'bg-[var(--color-background-subtle)] text-[var(--color-foreground)]',
    'border border-[var(--color-border)]',
    'hover:bg-[var(--color-background-muted)]',
    'transition-all duration-200',
  );

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center gap-3">
        <FileText className="h-5 w-5 text-[#9C6F6E]" />
        <h3 className="font-semibold text-lg">PDF Image Editor</h3>
      </div>

      {/* PDF Selection */}
      <div className="flex items-center gap-3">
        <select
          value={selectedPdf}
          onChange={(e) => {
            setSelectedPdf(e.target.value);
            setImages([]);
            setStatus('idle');
          }}
          className={cn(
            'rounded-xl px-4 py-2 text-sm',
            'bg-[var(--color-background-subtle)] text-[var(--color-foreground)]',
            'border border-[var(--color-border)]',
          )}
        >
          {manualPaths.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchImages}
          className={buttonClass}
          disabled={status === 'loading'}
        >
          <RefreshCw className={cn('h-4 w-4', status === 'loading' && 'animate-spin')} />
          {status === 'loading' ? 'Loading...' : 'Load Images'}
        </motion.button>
      </div>

      {/* Status Message */}
      {message && (
        <p className={cn(
          'text-sm px-4 py-2 rounded-lg',
          status === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        )}>
          {message}
        </p>
      )}

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-[var(--color-foreground-muted)]">
            {images.length} images found across {pageCount} pages
          </p>

          <div className="divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] overflow-hidden">
            {images.map((img) => (
              <div key={img.index} className="flex items-center justify-between px-4 py-3 bg-[var(--color-background-subtle)]">
                <div className="flex items-center gap-3">
                  <Image className="h-4 w-4 text-[#9E956B]" />
                  <div>
                    <span className="text-sm font-medium">Page {img.page}</span>
                    <span className="text-xs text-[var(--color-foreground-muted)] ml-2">
                      {img.name} ({img.width}x{img.height})
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleReplace(img)}
                    className="p-2 rounded-lg hover:bg-[var(--color-background-muted)] transition-colors"
                    title="Replace image"
                  >
                    <Upload className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRemove(img)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    title="Remove image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Image */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className={buttonClass}
        >
          <Plus className="h-4 w-4" />
          Add Image to PDF
        </motion.button>

        {showAddForm && (
          <div className="rounded-xl border border-[var(--color-border)] p-4 space-y-3 bg-[var(--color-background-subtle)]">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <label className="space-y-1">
                <span className="text-xs font-medium">Page</span>
                <input
                  type="number"
                  min={1}
                  max={pageCount || 999}
                  value={addPage}
                  onChange={(e) => setAddPage(Number(e.target.value))}
                  className="w-full rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium">X</span>
                <input
                  type="number"
                  value={addX}
                  onChange={(e) => setAddX(Number(e.target.value))}
                  className="w-full rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium">Y</span>
                <input
                  type="number"
                  value={addY}
                  onChange={(e) => setAddY(Number(e.target.value))}
                  className="w-full rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium">Width</span>
                <input
                  type="number"
                  value={addWidth}
                  onChange={(e) => setAddWidth(Number(e.target.value))}
                  className="w-full rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium">Height</span>
                <input
                  type="number"
                  value={addHeight}
                  onChange={(e) => setAddHeight(Number(e.target.value))}
                  className="w-full rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-sm"
                />
              </label>
            </div>
            <div>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAdd(file);
                }}
                className="text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
