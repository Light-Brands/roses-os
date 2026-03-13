'use client';

import { useState } from 'react';
import { Printer } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { cn } from '@/lib/utils';

interface PdfPagePrintButtonProps {
  pdfUrl: string;
  pageIndex: number;
  className?: string;
  label?: string;
}

export default function PdfPagePrintButton({
  pdfUrl,
  pageIndex,
  className,
  label = 'Print',
}: PdfPagePrintButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handlePrint() {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(pdfUrl);
      const srcBytes = await res.arrayBuffer();
      const srcDoc = await PDFDocument.load(srcBytes);

      const singlePageDoc = await PDFDocument.create();
      const [copiedPage] = await singlePageDoc.copyPages(srcDoc, [pageIndex]);
      singlePageDoc.addPage(copiedPage);

      const pdfBytes = await singlePageDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      const printWindow = window.open(blobUrl, '_blank');
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          printWindow.focus();
          printWindow.print();
        });
      }
    } catch (err) {
      console.error('Failed to print PDF page:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePrint}
      disabled={loading}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium',
        'bg-[var(--color-background-subtle)] text-[var(--color-foreground)]',
        'border border-[var(--color-border)]',
        'hover:bg-[var(--color-background-muted)]',
        'transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-wait',
        'print:hidden',
        className,
      )}
    >
      <Printer className="h-3.5 w-3.5" />
      <span>{loading ? 'Preparing...' : label}</span>
    </button>
  );
}
