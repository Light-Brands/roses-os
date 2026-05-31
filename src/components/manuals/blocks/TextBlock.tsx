'use client';

/**
 * TextBlock — v2.
 *
 * Spec 001-richer-block-editor T-021 + AC8.
 *
 * The legacy contentEditable surface (browser execCommand-driven) is replaced
 * by the TipTap-backed engine wrapper in `src/lib/manuals/richtext/engine.tsx`.
 *
 * Writes canonical JSON to `content.doc` (v2 schema). The legacy `content.html`
 * field is kept in step for backward-compat readers (export-html.ts + read-only
 * surfaces that have not yet migrated). Both fields stay in sync on every edit.
 *
 * AC8: the browser execCommand API is no longer called from this file.
 */

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { TextContent, TiptapDoc } from '@/lib/manuals/types';
import { RichTextEditor, RichTextPreview } from '@/lib/manuals/richtext/engine';
import { deserializeTextContent, canonicalToHtml } from '@/lib/manuals/richtext/deserializer';
import { emptyDoc } from '@/lib/manuals/richtext/serializer';

interface TextBlockProps {
  content: TextContent;
  onChange: (content: TextContent) => void;
  readOnly: boolean;
}

export default function TextBlock({ content, onChange, readOnly }: TextBlockProps) {
  const initialDoc = useMemo<TiptapDoc>(
    () => deserializeTextContent(content),
    [content],
  );

  const handleChange = (doc: TiptapDoc) => {
    onChange({
      schema_version: 2,
      html: canonicalToHtml(doc),
      doc,
    });
  };

  if (readOnly) {
    if (content.doc) {
      return (
        <div className={cn('rt-preview', 'text-[var(--color-foreground)] leading-relaxed')}>
          <RichTextPreview doc={content.doc} />
        </div>
      );
    }
    // Legacy v1 read path: trust the stored html.
    return (
      <div
        className="text-[var(--color-foreground)] leading-relaxed [&_strong]:font-semibold [&_em]:italic [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
        dangerouslySetInnerHTML={{ __html: content.html ?? '' }}
      />
    );
  }

  return (
    <div className="group/text relative">
      <div
        className={cn(
          'text-[var(--color-foreground)] leading-relaxed min-h-[1.5em]',
          '[&_strong]:font-semibold [&_em]:italic',
          '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-1',
          '[&_li]:py-0.5',
          'rounded-lg px-3 -mx-3 py-2 transition-colors border border-transparent hover:border-[var(--color-border)]/50 focus-within:border-[var(--color-rose-clay)]/30 focus-within:bg-[var(--color-rose-50)]/30 dark:focus-within:bg-[var(--color-rose-950)]/20',
        )}
      >
        <RichTextEditor
          initialDoc={initialDoc.content?.length ? initialDoc : emptyDoc()}
          onChange={handleChange}
          placeholder="Start typing…"
          ariaLabel="Text block"
        />
      </div>
    </div>
  );
}
