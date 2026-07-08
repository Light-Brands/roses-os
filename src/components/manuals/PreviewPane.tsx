'use client';

/**
 * PreviewPane (T-041 + AC11).
 *
 * Client-side live preview of canonical-JSON blocks. Renders read-only block
 * components inside `.manual-preview` so the shared print CSS styles the
 * output identically to what the Chromium adapter will emit at PDF time.
 *
 * Performance budget per AC11: render canonical JSON within 800ms of edit on
 * a 5000ms slow-3G profile. Achieved by:
 *   - Stable component identity per block-id (memoization-safe).
 *   - No data-fetching inside this component (caller supplies blocks).
 *   - No font-await; print CSS imports Inter + Cormorant Garamond inline.
 *
 * The "final check" button (T-043) calls the sister-arc `/api/manuals/[id]/pdf`
 * endpoint when available. Deferred behind a feature flag here; surfaces a
 * helpful disabled state until the sister-arc PR lands on main.
 */

import { useState } from 'react';
import type { ManualBlock } from '@/lib/manuals/types';
import { typography, typographyCssVars } from '@/lib/manuals/typography';

interface PreviewPaneProps {
  blocks: ReadonlyArray<ManualBlock>;
  manualId: string;
  title?: string;
  /** When true and the sister-arc adapter is present, "final check" is enabled. */
  chromiumAdapterAvailable?: boolean;
}

export default function PreviewPane({ blocks, manualId, title, chromiumAdapterAvailable }: PreviewPaneProps) {
  const [running, setRunning] = useState(false);

  const runFinalCheck = async () => {
    if (!chromiumAdapterAvailable) return;
    setRunning(true);
    try {
      const res = await fetch(`/api/manuals/${manualId}/pdf`);
      if (!res.ok) throw new Error(`pdf route returned ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="preview-pane border-l border-stone-200 bg-stone-50 min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: typographyCssVars() }} />
      <div className="sticky top-0 z-10 bg-white border-b border-stone-200 px-4 py-2 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-rose-700">Preview</span>
        <button
          type="button"
          onClick={runFinalCheck}
          disabled={!chromiumAdapterAvailable || running}
          className="text-xs border border-stone-300 rounded px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Final check via Chromium render"
        >
          {running ? 'Rendering…' : 'Final check (Chromium)'}
        </button>
      </div>
      <div className="manual-preview" style={{ fontFamily: typography.fonts.sans, color: typography.palette.ink }}>
        {title ? <h1 className="text-center">{title}</h1> : null}
        {blocks.map((block) => (
          <PreviewBlockRow key={block.id} block={block} />
        ))}
        {blocks.length === 0 ? (
          <p className="text-center text-stone-400 italic mt-12">No blocks yet. Add one from the editor.</p>
        ) : null}
      </div>
    </div>
  );
}

function PreviewBlockRow({ block }: { block: ManualBlock }) {
  switch (block.block_type) {
    case 'heading': {
      const c = block.content as { text: string; level: 1 | 2 | 3; eyebrow?: string };
      const Tag = (`h${c.level}` as 'h1' | 'h2' | 'h3');
      return (
        <>
          {c.eyebrow ? <span className="text-xs uppercase tracking-[0.18em] text-rose-700 block">{c.eyebrow}</span> : null}
          <Tag>{c.text}</Tag>
        </>
      );
    }
    case 'text': {
      const c = block.content as { html?: string };
      return <div dangerouslySetInnerHTML={{ __html: c.html ?? '' }} />;
    }
    case 'image':
    case 'captioned-figure': {
      const c = block.content as { src: string; alt: string; caption?: string; width_pct?: number };
      if (!c.src) return null;
      // Honor width_pct so a small ornament previews small, matching the editor
      // and the exported PDF.
      const pct = typeof c.width_pct === 'number'
        ? Math.min(100, Math.max(2, c.width_pct))
        : undefined;
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.src} alt={c.alt} style={pct !== undefined ? { width: `${pct}%`, height: 'auto' } : undefined} />
          {c.caption ? <figcaption>{c.caption}</figcaption> : null}
        </figure>
      );
    }
    case 'divider':
      return <hr style={{ border: 0, borderTop: `1px solid ${typography.palette.rose_hairline}`, margin: '24px 0' }} />;
    case 'page-break':
      return <div className="page-break" />;
    case 'callout': {
      const c = block.content as { variant?: string; title?: string; body?: { content?: unknown[] } };
      return (
        <div className="callout">
          {c.title ? <strong>{c.title}</strong> : null}
          <p className="text-xs uppercase tracking-wider mt-1">{c.variant ?? 'note'}</p>
        </div>
      );
    }
    case 'numbered-exercise': {
      const c = block.content as { numeral: string; title?: string };
      return (
        <div className="numbered-exercise">
          <div style={{ fontSize: '2.5em', color: typography.palette.terracotta }}>{c.numeral}</div>
          <div>{c.title ?? ''}</div>
        </div>
      );
    }
    case 'spoken-instruction': {
      const c = block.content as { spoken: string };
      return <div className="spoken-instruction">“{c.spoken}”</div>;
    }
    case 'quote': {
      const c = block.content as { attribution?: string };
      return <blockquote>{c.attribution ? `— ${c.attribution}` : '“…”'}</blockquote>;
    }
    case 'cover': {
      const c = block.content as { title: string; author?: string; illustrator?: string; credits?: string; edition?: string; notice?: string };
      return (
        <div className="text-center">
          <h1>{c.title}</h1>
          {c.author ? <p>By {c.author}</p> : null}
          {c.illustrator ? <p style={{ fontStyle: 'italic' }}>Illustrated by {c.illustrator}</p> : null}
          {c.credits ? c.credits.split('\n').map((line, i) => <p key={i} style={{ fontSize: '0.72rem' }}>{line}</p>) : null}
          {c.edition ? <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{c.edition}</p> : null}
          {c.notice ? <p style={{ maxWidth: '30rem', margin: '1rem auto 0', fontSize: '0.65rem', fontStyle: 'italic' }}>{c.notice}</p> : null}
        </div>
      );
    }
    case 'table': {
      const c = block.content as { header: string[]; rows: string[][] };
      return (
        <table style={{ borderCollapse: 'collapse', width: '100%', margin: '16px 0' }}>
          <thead>
            <tr>{c.header.map((h, i) => <th key={i} style={{ border: '1px solid #ccc', padding: '4px 8px' }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {c.rows.map((r, ri) => (
              <tr key={ri}>{r.map((cell, ci) => <td key={ci} style={{ border: '1px solid #ccc', padding: '4px 8px' }}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      );
    }
    case 'glossary': {
      const c = block.content as { entries: Array<{ term: string; definition: string }> };
      return (
        <dl style={{ margin: '16px 0' }}>
          {c.entries.map((e, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '10em 1fr', gap: 8 }}>
              <dt style={{ fontWeight: 600, color: typography.palette.terracotta }}>{e.term}</dt>
              <dd>{e.definition}</dd>
            </div>
          ))}
        </dl>
      );
    }
    default:
      return null;
  }
}
