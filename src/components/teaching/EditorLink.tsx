'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useManualAuth } from '@/components/manuals/ManualPinGate';
import type { Manual } from '@/lib/manuals/types';

interface EditorLinkProps {
  /**
   * Slug of the manual this view maps to (e.g. "rose-meditation-level-1").
   * When provided, the button deep-links to that manual in the editor.
   * When omitted, it links to the manuals index.
   */
  manualSlug?: string;
}

/**
 * "For Editing" shortcut button.
 * Renders only when the visitor entered the For Teachers section with the
 * editor PIN. The shared manual-auth session means the editor lands in edit
 * mode without a second PIN prompt.
 *
 * The /manuals/[manualId] route resolves by DB id, so for a deep link we
 * resolve the manual's id from its slug. Until resolved (or if not found),
 * the button falls back to the manuals index so it is never a dead link.
 */
export default function EditorLink({ manualSlug }: EditorLinkProps) {
  const { isEditor } = useManualAuth();
  const [manualId, setManualId] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditor || !manualSlug) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/manuals');
        const json = await res.json();
        const match = (json.data as Manual[] | undefined)?.find((m) => m.slug === manualSlug);
        if (!cancelled && match) setManualId(match.id);
      } catch {
        // Leave fallback href in place
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isEditor, manualSlug]);

  if (!isEditor) return null;

  const href = manualSlug && manualId ? `/manuals/${manualId}` : '/manuals';

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent)] text-[var(--color-accent-foreground)] text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-all duration-200"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      For Editing
    </Link>
  );
}
