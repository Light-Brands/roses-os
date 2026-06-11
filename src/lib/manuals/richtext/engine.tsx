'use client';

/**
 * Rich-text engine wrapper (T-018).
 *
 * Wraps TipTap behind a stable canonical-JSON surface. Callers pass an initial
 * canonical doc + an onChange that receives canonical JSON; the wrapper does
 * not expose TipTap's editor instance.
 *
 * Discipline rules per Kaze:
 *   - Closed marks: bold, italic, link only.
 *   - Closed nodes: paragraph, bulletList, orderedList, listItem, hardBreak.
 *   - No toolbar surface.
 *   - No headings (block-level headings live in HeadingBlock, not inside a text node).
 *
 * AC8: this engine REPLACES `document.execCommand` in TextBlock.tsx.
 */

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { TiptapDoc } from '../types';
import { canonicalToTiptap, tiptapToCanonical } from './serializer';
import { sanitizePaste } from './paste-sanitizer';

export interface RichTextEditorProps {
  initialDoc: TiptapDoc;
  onChange: (doc: TiptapDoc) => void;
  placeholder?: string;
  /** ARIA label for the editable region (announced to screen readers). */
  ariaLabel?: string;
}

export function RichTextEditor({ initialDoc, onChange, placeholder, ariaLabel }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        strike: false,
        code: false,
      }),
    ],
    content: canonicalToTiptap(initialDoc),
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => {
      const json = e.getJSON();
      onChange(tiptapToCanonical(json as unknown as TiptapDoc));
    },
    editorProps: {
      attributes: {
        'aria-label': ariaLabel ?? 'Rich text editor',
        role: 'textbox',
        'aria-multiline': 'true',
        class: 'rt-engine-content',
      },
      handlePaste: (_view, event) => {
        const clipboard = event.clipboardData;
        if (!clipboard) return false;
        const html = clipboard.getData('text/html');
        const text = clipboard.getData('text/plain');
        const sanitized = sanitizePaste(html, text);
        if (sanitized === null) return false;
        event.preventDefault();
        const editorRef = editor;
        if (editorRef) {
          editorRef.commands.insertContent(sanitized);
        }
        return true;
      },
    },
  });

  if (!editor) {
    return (
      <div className="rt-engine-placeholder" data-placeholder={placeholder ?? ''}>
        {placeholder ?? ''}
      </div>
    );
  }
  return <EditorContent editor={editor} />;
}

/** Read-only renderer for the preview pane (does not mount an editor). */
export function RichTextPreview({ doc }: { doc: TiptapDoc }) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: false, codeBlock: false, blockquote: false, horizontalRule: false, strike: false, code: false })],
    content: canonicalToTiptap(doc),
    editable: false,
    immediatelyRender: false,
  });
  if (!editor) return null;
  return <EditorContent editor={editor} />;
}
