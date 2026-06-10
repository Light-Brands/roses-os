'use client';

import Link from 'next/link';
import { useManualAuth } from '@/components/manuals/ManualPinGate';

/**
 * "For Editing" shortcut button.
 * Renders only when the visitor entered the For Teachers section with the
 * editor PIN. Jumps straight to /manuals — the shared manual-auth session
 * means the editor lands in edit mode without a second PIN prompt.
 */
export default function EditorLink() {
  const { isEditor } = useManualAuth();

  if (!isEditor) return null;

  return (
    <Link
      href="/manuals"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent)] text-[var(--color-accent-foreground)] text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-all duration-200"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      For Editing
    </Link>
  );
}
