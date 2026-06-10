'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { setManualAuth } from '@/lib/manuals/pin-auth';

/**
 * Staging-review route (spec 004 T-013, AC12).
 *
 * A direct path to a `__staging` lane in the editor with the PIN injected. The
 * reader manual list (db.ts getManuals) filters `__staging` slugs out, so a staging
 * lane has no link in the normal UI. This route is the door: it injects editor auth
 * into sessionStorage (the same key ManualPinGate reads on mount) and forwards to
 * the existing editor at /manuals/<staging-id>, optionally preselecting the lane's
 * language via ?lang=. Because /api/manuals returns every manual (the staging filter
 * lives only in the reader list), the editor then finds and renders the staged lane.
 *
 * Lives OUTSIDE the (manuals) route group on purpose, so its own render is not
 * blocked by ManualPinGate before it can inject the PIN.
 *
 *   /staging-review/<staging-manual-id>?lang=pt
 */
export default function StagingReviewPage() {
  const params = useParams();
  const search = useSearchParams();
  const router = useRouter();
  const manualId = params.manualId as string;
  const lang = search.get('lang') ?? '';
  // ?role=teacher opens a clean read-only view (no edit chrome) — the right surface
  // for showing the author the staged manual. Default is editor.
  const role = search.get('role') === 'teacher' ? 'teacher' : 'editor';
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Inject the PIN so the staging lane opens without a manual PIN entry.
    setManualAuth(role);
    const dest = `/manuals/${manualId}${lang ? `?lang=${encodeURIComponent(lang)}` : ''}`;
    setDone(true);
    router.replace(dest);
  }, [manualId, lang, role, router]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
      <div className="animate-pulse text-[var(--color-foreground-muted)]">
        {done ? 'Opening staging lane…' : 'Injecting review access…'}
      </div>
    </div>
  );
}
