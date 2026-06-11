'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { cn } from '@/lib/utils';
import type {
  ManualBlock, ManualLanguage, BlockType, BlockContent,
  HeadingContent, TextContent, ImageContent, ImageRowContent,
  CoverContent, CalloutContent, QuoteContent, NumberedExerciseContent,
  CaptionedFigureContent, SpokenInstructionContent, TableContent,
  ContentsContent, FootnoteContent, GlossaryContent,
  SectionContent, TwoColumnSectionContent,
} from '@/lib/manuals/types';
import HeadingBlock from './blocks/HeadingBlock';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
import ImageRowBlock from './blocks/ImageRowBlock';
import DividerBlock from './blocks/DividerBlock';
import PageBreakBlock from './blocks/PageBreakBlock';
import CoverBlock from './blocks/CoverBlock';
import CalloutBlock from './blocks/CalloutBlock';
import QuoteBlock from './blocks/QuoteBlock';
import NumberedExerciseBlock from './blocks/NumberedExerciseBlock';
import CaptionedFigureBlock from './blocks/CaptionedFigureBlock';
import SpokenInstructionBlock from './blocks/SpokenInstructionBlock';
import TableBlock from './blocks/TableBlock';
import TableOfContentsBlock from './blocks/TableOfContentsBlock';
import FootnoteBlock from './blocks/FootnoteBlock';
import GlossaryBlock from './blocks/GlossaryBlock';
import SectionBlock from './blocks/SectionBlock';
import TwoColumnBlock from './blocks/TwoColumnBlock';
import AddBlockMenu from './blocks/AddBlockMenu';
import BlockWrapper from './BlockWrapper';
import { defaultContent as defaultCallout } from './blocks/CalloutBlock/default';
import { defaultContent as defaultQuote } from './blocks/QuoteBlock/default';
import { defaultContent as defaultNumberedExercise } from './blocks/NumberedExerciseBlock/default';
import { defaultContent as defaultCaptionedFigure } from './blocks/CaptionedFigureBlock/default';
import { defaultContent as defaultSpokenInstruction } from './blocks/SpokenInstructionBlock/default';
import { defaultContent as defaultTable } from './blocks/TableBlock/default';
import { defaultContent as defaultContents } from './blocks/TableOfContentsBlock/default';
import { defaultContent as defaultFootnote } from './blocks/FootnoteBlock/default';
import { defaultContent as defaultGlossary } from './blocks/GlossaryBlock/default';
import { defaultContent as defaultCover } from './blocks/CoverBlock/default';

interface BlockEditorProps {
  manualId: string;
  language: ManualLanguage;
  readOnly: boolean;
  onBlocksChange?: (blocks: ManualBlock[]) => void;
}

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error' | 'conflict';

interface ConflictInfo {
  /** ISO timestamp of the conflicting remote update. */
  remoteUpdatedAt: string;
  /** PIN role name of the other editor, when available. */
  otherEditor?: string;
  /** Block id that triggered the conflict. */
  blockId: string;
}

function getDefaultContent(type: BlockType): BlockContent {
  switch (type) {
    case 'heading': return { text: '', level: 2 } as HeadingContent;
    case 'text': return { html: '' } as TextContent;
    case 'image': return { src: '', alt: '', caption: '' } as ImageContent;
    case 'image-row': return {
      images: [{ src: '', alt: '' }, { src: '', alt: '' }, { src: '', alt: '' }],
      caption: '',
    } as ImageRowContent;
    case 'divider': return {};
    case 'page-break': return {};
    case 'cover': return defaultCover();
    case 'callout': return defaultCallout();
    case 'quote': return defaultQuote();
    case 'numbered-exercise': return defaultNumberedExercise();
    case 'captioned-figure': return defaultCaptionedFigure();
    case 'spoken-instruction': return defaultSpokenInstruction();
    case 'table': return defaultTable();
    case 'contents': return defaultContents();
    case 'footnote': return defaultFootnote();
    case 'glossary': return defaultGlossary();
    case 'section': return { schema_version: 2, children: [] };
    case 'two-column-section': return { schema_version: 2, left: [], right: [] };
  }
}

/** Which child list a container edit targets. Sections use 'children'. */
type ChildSide = 'left' | 'right' | 'children';

function getChildArray(block: ManualBlock, side: ChildSide): string[] {
  if (block.block_type === 'two-column-section') {
    const c = block.content as TwoColumnSectionContent;
    return side === 'right' ? (c.right ?? []) : (c.left ?? []);
  }
  const c = block.content as SectionContent;
  return c.children ?? [];
}

function withChildArray(block: ManualBlock, side: ChildSide, nextArr: string[]): BlockContent {
  if (block.block_type === 'two-column-section') {
    const c = block.content as TwoColumnSectionContent;
    return side === 'right' ? { ...c, right: nextArr } : { ...c, left: nextArr };
  }
  const c = block.content as SectionContent;
  return { ...c, children: nextArr };
}

/**
 * Canon page boundary marker — shown in the editor (not the client reading view)
 * wherever a block's `source_page` provenance increments. Visually distinct from
 * the author-insertable "Page Break" block: this is a derived review aid, not a
 * schema block. Render-only.
 */
function PageBoundary({ page }: { page: number }) {
  return (
    <div className="flex items-center gap-3 py-2 select-none" aria-hidden>
      <div className="flex-1 border-t-2 border-dotted border-[var(--color-rose-clay)]/40" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-rose-clay)]/80 px-2 py-0.5 rounded-full bg-[var(--color-rose-50)] dark:bg-[var(--color-rose-950)]/30 border border-[var(--color-rose-clay)]/30">
        Page {page}
      </span>
      <div className="flex-1 border-t-2 border-dotted border-[var(--color-rose-clay)]/40" />
    </div>
  );
}

/** Wrapper per block so each can call useDragControls at the top level */
function SortableBlockItem({
  block,
  index,
  totalBlocks,
  renderBlock,
  onDelete,
  onMoveBlock,
  onDuplicate,
  onAddBlock,
  readOnly,
  pageBoundary,
}: {
  block: ManualBlock;
  index: number;
  totalBlocks: number;
  renderBlock: (block: ManualBlock) => React.ReactNode;
  onDelete: (blockId: string) => void;
  onMoveBlock: (index: number, direction: 'up' | 'down') => void;
  onDuplicate: (index: number) => void;
  onAddBlock: (type: BlockType, afterIndex: number) => void;
  readOnly: boolean;
  pageBoundary: number | null;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={block}
      dragListener={false}
      dragControls={dragControls}
      as="div"
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileDrag={{
        scale: 1.02,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        zIndex: 50,
      }}
    >
      {pageBoundary !== null && <PageBoundary page={pageBoundary} />}
      <BlockWrapper
        blockType={block.block_type}
        onDelete={() => onDelete(block.id)}
        onMoveUp={() => onMoveBlock(index, 'up')}
        onMoveDown={() => onMoveBlock(index, 'down')}
        onDuplicate={() => onDuplicate(index)}
        isFirst={index === 0}
        isLast={index === totalBlocks - 1}
        readOnly={readOnly}
        dragControls={readOnly ? undefined : dragControls}
      >
        {renderBlock(block)}
      </BlockWrapper>

      {!readOnly && (
        <AddBlockMenu onAdd={(type) => onAddBlock(type, index)} />
      )}
    </Reorder.Item>
  );
}

export default function BlockEditor({ manualId, language, readOnly, onBlocksChange }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<ManualBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [conflict, setConflict] = useState<ConflictInfo | null>(null);
  const [lastEditInfo, setLastEditInfo] = useState<{ updated_by: string | null; updated_at: string } | null>(null);
  const saveTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});
  const blocksRef = useRef<ManualBlock[]>([]);
  const blockCount = blocks.length;
  const reorderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Drag reorder: update state immediately, debounce API call. The Reorder list
  // only carries top-level blocks (nested column children are pulled out), so
  // merge the children back before persisting to keep every position unique.
  const handleDragReorder = useCallback((newTop: ManualBlock[]) => {
    const topIds = new Set(newTop.map((b) => b.id));
    const children = blocksRef.current.filter((b) => !topIds.has(b.id));
    const merged = [...newTop, ...children];
    setBlocks(merged);
    if (reorderTimeoutRef.current) clearTimeout(reorderTimeoutRef.current);
    reorderTimeoutRef.current = setTimeout(async () => {
      try {
        await fetch(`/api/manuals/${manualId}/blocks/reorder`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ block_ids: merged.map((b) => b.id), updated_by: 'Editor' }),
        });
      } catch {
        // Will self-correct on next page load
      }
    }, 300);
  }, [manualId]);

  // Fetch blocks
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function fetchBlocks() {
      try {
        const res = await fetch(`/api/manuals/${manualId}/blocks?language=${language}`);
        const json = await res.json();
        if (!cancelled && json.data) {
          setBlocks(json.data);
          if (json.data.length > 0) {
            const sorted = [...json.data].sort((a: ManualBlock, b: ManualBlock) =>
              new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            );
            setLastEditInfo({ updated_by: sorted[0].updated_by, updated_at: sorted[0].updated_at });
          }
        }
      } catch {
        // Failed to fetch
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBlocks();
    return () => { cancelled = true; };
  }, [manualId, language]);

  // Notify parent of blocks changes; keep a ref of the latest blocks for the
  // reorder merge (which runs outside React's render closure).
  useEffect(() => {
    blocksRef.current = blocks;
    onBlocksChange?.(blocks);
  }, [blocks, onBlocksChange]);

  // Auto-save a block (debounced 500ms)
  const saveBlock = useCallback(async (blockId: string, content: BlockContent) => {
    if (saveTimeoutRef.current[blockId]) {
      clearTimeout(saveTimeoutRef.current[blockId]);
    }
    setSaveStatus('unsaved');

    saveTimeoutRef.current[blockId] = setTimeout(async () => {
      setSaveStatus('saving');
      const ifUnmodifiedSince = lastEditInfo?.updated_at;
      try {
        const res = await fetch(`/api/manuals/${manualId}/blocks`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(ifUnmodifiedSince ? { 'If-Unmodified-Since': ifUnmodifiedSince } : {}),
          },
          body: JSON.stringify({
            id: blockId,
            content,
            updated_by: 'Editor',
            client_updated_at: ifUnmodifiedSince,
          }),
        });
        if (res.ok) {
          setSaveStatus('saved');
          setLastEditInfo({ updated_by: 'Editor', updated_at: new Date().toISOString() });
        } else if (res.status === 409) {
          // T-046 + AC14: autosave conflict.
          const body: { other_editor?: string; remote_updated_at?: string } = await res
            .json()
            .catch(() => ({}));
          setSaveStatus('conflict');
          setConflict({
            remoteUpdatedAt: body.remote_updated_at ?? new Date().toISOString(),
            otherEditor: body.other_editor,
            blockId,
          });
        } else {
          setSaveStatus('error');
        }
      } catch {
        setSaveStatus('error');
      }
    }, 500);
  }, [manualId, lastEditInfo]);

  const handleContentChange = useCallback((blockId: string, content: BlockContent) => {
    setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, content } : b)));
    if (!readOnly) saveBlock(blockId, content);
  }, [readOnly, saveBlock]);

  // Insert a freshly-created block at `afterIndex` in the flat list, then persist
  // the new order. `manual_blocks` has a UNIQUE (manual_id, language, position)
  // key (migration 0006), so we CANNOT POST straight into an occupied position —
  // that raises 23505 and the block silently never appears. Instead create the
  // row at a free trailing slot, then let the (collision-free, two-phase) reorder
  // endpoint renumber every row to its final 0..N-1 position.
  const insertCreatedBlock = useCallback(
    async (afterIndex: number, payload: { block_type: BlockType; content: BlockContent }) => {
      const current = blocksRef.current;
      const freePosition = current.length; // above every live position → never collides
      try {
        const res = await fetch(`/api/manuals/${manualId}/blocks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language,
            block_type: payload.block_type,
            content: payload.content,
            position: freePosition,
            updated_by: 'Editor',
          }),
        });
        const json = await res.json();
        const created: ManualBlock | undefined = json.data;
        if (!created) return;

        // Optimistically place the new block in the UI at afterIndex + 1.
        const insertAt = Math.min(Math.max(afterIndex + 1, 0), current.length);
        setBlocks((prev) => {
          const next = [...prev];
          next.splice(insertAt, 0, created);
          return next;
        });

        // Persist the final order across ALL rows (top-level + nested children),
        // so positions stay unique and contiguous.
        const orderIds = current.map((b) => b.id);
        orderIds.splice(insertAt, 0, created.id);
        await fetch(`/api/manuals/${manualId}/blocks/reorder`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ block_ids: orderIds, updated_by: 'Editor' }),
        });
      } catch {
        // Failed — UI will self-correct on next load.
      }
    },
    [manualId, language]
  );

  // Add block
  const handleAddBlock = useCallback(
    (type: BlockType, afterIndex: number) =>
      insertCreatedBlock(afterIndex, { block_type: type, content: getDefaultContent(type) }),
    [insertCreatedBlock]
  );

  // Duplicate block
  const handleDuplicateBlock = useCallback(
    (index: number) => {
      const block = blocksRef.current[index];
      if (!block) return Promise.resolve();
      return insertCreatedBlock(index, { block_type: block.block_type, content: block.content });
    },
    [insertCreatedBlock]
  );

  // Delete block
  const handleDeleteBlock = useCallback(async (blockId: string) => {
    try {
      await fetch(`/api/manuals/${manualId}/blocks`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: blockId }),
      });
      setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    } catch {
      // Failed
    }
  }, [manualId]);

  // Move block
  const handleMoveBlock = useCallback(async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(newIndex, 0, moved);
    setBlocks(newBlocks);

    try {
      await fetch(`/api/manuals/${manualId}/blocks/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ block_ids: newBlocks.map((b) => b.id), updated_by: 'Editor' }),
      });
    } catch {
      setBlocks(blocks);
    }
  }, [blocks, manualId]);

  // ── In-column authoring (M5) ────────────────────────────────────────────────
  // A container (two-column-section / section) owns its children by id in its
  // content arrays. Creating a child = create a flat row, then append its id to
  // the container's array and persist the container. Once the id is in the array,
  // the childIdSet logic below pulls the row out of the top-level list so it only
  // renders inside its column. Move/remove are pure array edits on the container.

  const createBlockRow = useCallback(async (type: BlockType): Promise<ManualBlock | null> => {
    try {
      const res = await fetch(`/api/manuals/${manualId}/blocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, block_type: type, content: getDefaultContent(type), updated_by: 'Editor' }),
      });
      const json = await res.json();
      return (json.data as ManualBlock) ?? null;
    } catch {
      return null;
    }
  }, [manualId, language]);

  const handleAddChild = useCallback(async (containerId: string, side: ChildSide, type: BlockType) => {
    const container = blocksRef.current.find((b) => b.id === containerId);
    if (!container) return;
    const created = await createBlockRow(type);
    if (!created) return;
    const newContent = withChildArray(container, side, [...getChildArray(container, side), created.id]);
    setBlocks((prev) => {
      const withChild = prev.some((b) => b.id === created.id) ? prev : [...prev, created];
      return withChild.map((b) => (b.id === containerId ? { ...b, content: newContent } : b));
    });
    if (!readOnly) saveBlock(containerId, newContent);
  }, [createBlockRow, readOnly, saveBlock]);

  const handleRemoveChild = useCallback(async (containerId: string, side: ChildSide, childId: string) => {
    const container = blocksRef.current.find((b) => b.id === containerId);
    if (!container) return;
    const newContent = withChildArray(container, side, getChildArray(container, side).filter((id) => id !== childId));
    setBlocks((prev) => prev.filter((b) => b.id !== childId).map((b) => (b.id === containerId ? { ...b, content: newContent } : b)));
    if (!readOnly) saveBlock(containerId, newContent);
    try {
      await fetch(`/api/manuals/${manualId}/blocks`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: childId }),
      });
    } catch {
      // Row delete is best-effort; the container no longer references it.
    }
  }, [manualId, readOnly, saveBlock]);

  const handleMoveChild = useCallback((containerId: string, side: ChildSide, childId: string, direction: 'up' | 'down') => {
    const container = blocksRef.current.find((b) => b.id === containerId);
    if (!container) return;
    const arr = [...getChildArray(container, side)];
    const i = arr.indexOf(childId);
    if (i < 0) return;
    const j = direction === 'up' ? i - 1 : i + 1;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    const newContent = withChildArray(container, side, arr);
    setBlocks((prev) => prev.map((b) => (b.id === containerId ? { ...b, content: newContent } : b)));
    if (!readOnly) saveBlock(containerId, newContent);
  }, [readOnly, saveBlock]);

  // Nested layout: two-column / section blocks reference their children by id.
  // Those children must render INSIDE the parent container and be removed from
  // the flat top-level list so they don't also render standalone.
  const blocksById = new Map(blocks.map((b) => [b.id, b]));
  const childIdSet = new Set<string>();
  for (const b of blocks) {
    if (b.block_type === 'two-column-section') {
      const c = b.content as TwoColumnSectionContent;
      [...(c.left ?? []), ...(c.right ?? [])].forEach((id) => childIdSet.add(id));
    } else if (b.block_type === 'section') {
      const c = b.content as SectionContent;
      (c.children ?? []).forEach((id) => childIdSet.add(id));
    }
  }
  const topLevelBlocks = blocks.filter((b) => !childIdSet.has(b.id));

  // Render a container's children inside their column, each wrapped with compact
  // move/remove controls (revealed on hover). The child block itself renders
  // editable via renderBlock, so typing inside a column works as normal.
  const renderColumnChildren = (containerId: string, side: ChildSide, childIds: string[]) =>
    childIds.map((id, idx) => {
      const child = blocksById.get(id);
      if (!child) return null;
      // fill: a figure in a column fills its cell (the cell carries the width).
      return (
        <div key={child.id} className="relative group/nested rounded">
          {!readOnly && (
            <div className="absolute -top-2 right-0 z-10 flex items-center gap-0.5 px-0.5 py-0.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md shadow-sm opacity-0 group-hover/nested:opacity-100 transition-opacity duration-150">
              <button
                type="button"
                title="Move up"
                disabled={idx === 0}
                onClick={() => handleMoveChild(containerId, side, id, 'up')}
                className="w-6 h-6 rounded flex items-center justify-center text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background-subtle)] disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
              </button>
              <button
                type="button"
                title="Move down"
                disabled={idx === childIds.length - 1}
                onClick={() => handleMoveChild(containerId, side, id, 'down')}
                className="w-6 h-6 rounded flex items-center justify-center text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-background-subtle)] disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <button
                type="button"
                title="Remove from column"
                onClick={() => handleRemoveChild(containerId, side, id)}
                className="w-6 h-6 rounded flex items-center justify-center text-[var(--color-foreground-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error)]/10"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}
          {renderBlock(child, { fill: true })}
        </div>
      );
    });

  const renderBlock = (block: ManualBlock, opts?: { fill?: boolean }) => {
    switch (block.block_type) {
      case 'heading':
        return (
          <HeadingBlock
            content={block.content as HeadingContent}
            onChange={(c) => handleContentChange(block.id, c)}
            onLevelChange={(level) => handleContentChange(block.id, { ...(block.content as HeadingContent), level })}
            readOnly={readOnly}
          />
        );
      case 'text':
        return (
          <TextBlock
            content={block.content as TextContent}
            onChange={(c) => handleContentChange(block.id, c)}
            readOnly={readOnly}
          />
        );
      case 'image':
        return (
          <ImageBlock
            content={block.content as ImageContent}
            onChange={(c) => handleContentChange(block.id, c)}
            readOnly={readOnly}
          />
        );
      case 'image-row':
        return (
          <ImageRowBlock
            content={block.content as ImageRowContent}
            onChange={(c) => handleContentChange(block.id, c)}
            readOnly={readOnly}
          />
        );
      case 'divider':
        return <DividerBlock />;
      case 'page-break':
        return <PageBreakBlock />;
      case 'cover':
        return (
          <CoverBlock
            content={block.content as CoverContent}
            onChange={(c) => handleContentChange(block.id, c)}
            readOnly={readOnly}
          />
        );
      case 'callout':
        return (
          <CalloutBlock
            content={block.content as CalloutContent}
            onChange={(c) => handleContentChange(block.id, c)}
            readOnly={readOnly}
          />
        );
      case 'quote':
        return (
          <QuoteBlock
            content={block.content as QuoteContent}
            onChange={(c) => handleContentChange(block.id, c)}
            readOnly={readOnly}
          />
        );
      case 'numbered-exercise':
        return (
          <NumberedExerciseBlock
            content={block.content as NumberedExerciseContent}
            onChange={(c) => handleContentChange(block.id, c)}
            readOnly={readOnly}
          />
        );
      case 'captioned-figure':
        return (
          <CaptionedFigureBlock
            content={block.content as CaptionedFigureContent}
            onChange={(c) => handleContentChange(block.id, c)}
            readOnly={readOnly}
            fill={opts?.fill}
          />
        );
      case 'spoken-instruction':
        return (
          <SpokenInstructionBlock
            content={block.content as SpokenInstructionContent}
            onChange={(c) => handleContentChange(block.id, c)}
            readOnly={readOnly}
          />
        );
      case 'table':
        return (
          <TableBlock
            content={block.content as TableContent}
            onChange={(c) => handleContentChange(block.id, c)}
            readOnly={readOnly}
          />
        );
      case 'contents':
        return (
          <TableOfContentsBlock
            content={block.content as ContentsContent}
            onChange={(c) => handleContentChange(block.id, c)}
            readOnly={readOnly}
          />
        );
      case 'footnote':
        return (
          <FootnoteBlock
            content={block.content as FootnoteContent}
            onChange={(c) => handleContentChange(block.id, c)}
            readOnly={readOnly}
          />
        );
      case 'glossary':
        return (
          <GlossaryBlock
            content={block.content as GlossaryContent}
            onChange={(c) => handleContentChange(block.id, c)}
            readOnly={readOnly}
          />
        );
      case 'section':
        return (
          <SectionBlock
            content={block.content as SectionContent}
            onChange={(c) => handleContentChange(block.id, c)}
            readOnly={readOnly}
            renderChildren={(ids) => renderColumnChildren(block.id, 'children', ids)}
            onAddChild={(type) => handleAddChild(block.id, 'children', type)}
          />
        );
      case 'two-column-section':
        return (
          <TwoColumnBlock
            content={block.content as TwoColumnSectionContent}
            onChange={(c) => handleContentChange(block.id, c)}
            readOnly={readOnly}
            renderChildren={(ids, side) => renderColumnChildren(block.id, side, ids)}
            onAddChild={(side, type) => handleAddChild(block.id, side, type)}
          />
        );
      default:
        return null;
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse py-8">
        <div className="h-10 bg-[var(--color-background-muted)] rounded-lg w-2/3" />
        <div className="h-5 bg-[var(--color-background-muted)] rounded-lg w-full" />
        <div className="h-5 bg-[var(--color-background-muted)] rounded-lg w-5/6" />
        <div className="h-48 bg-[var(--color-background-muted)] rounded-xl w-full" />
        <div className="h-5 bg-[var(--color-background-muted)] rounded-lg w-full" />
        <div className="h-5 bg-[var(--color-background-muted)] rounded-lg w-3/4" />
      </div>
    );
  }

  return (
    <div>
      {/* Conflict banner (T-046 + AC14) */}
      {conflict ? (
        <div
          role="alert"
          aria-live="assertive"
          className="sticky top-0 z-30 -mx-6 px-6 py-3 bg-amber-50 border-b border-amber-300 text-amber-900 flex items-center justify-between gap-3"
        >
          <div className="text-sm">
            <strong>Save conflict.</strong>{' '}
            {conflict.otherEditor ? `${conflict.otherEditor} edited` : 'Another editor changed this block'} at {new Date(conflict.remoteUpdatedAt).toLocaleTimeString()}.
            Your local edits to block {conflict.blockId.slice(0, 8)} are not saved.
          </div>
          <button
            type="button"
            onClick={() => { setConflict(null); window.location.reload(); }}
            className="text-xs bg-white border border-amber-300 rounded px-3 py-1 hover:bg-amber-100"
          >
            Refresh
          </button>
        </div>
      ) : null}
      {/* Status bar — sticky */}
      <div className="sticky top-0 z-20 bg-[var(--color-background)]/90 backdrop-blur-sm border-b border-[var(--color-border)]/50 -mx-6 px-6 py-2 mb-6">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 text-[var(--color-foreground-faint)]">
            {lastEditInfo && (
              <span>
                Last edited{lastEditInfo.updated_by ? ` by ${lastEditInfo.updated_by}` : ''},{' '}
                {formatRelativeTime(lastEditInfo.updated_at)}
              </span>
            )}
            <span className="text-[var(--color-border)]">|</span>
            <span>{blockCount} block{blockCount !== 1 ? 's' : ''}</span>
          </div>

          {!readOnly && (
            <div className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all duration-300',
              saveStatus === 'saved' && 'text-[var(--color-success)]',
              saveStatus === 'saving' && 'text-[var(--color-warning)]',
              saveStatus === 'unsaved' && 'text-[var(--color-warning)]',
              saveStatus === 'error' && 'text-[var(--color-error)] bg-[var(--color-error)]/10'
            )}>
              {saveStatus === 'saving' ? (
                <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M12 2v4m0 12v4m-7-7H2m20 0h-3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1" strokeLinecap="round" />
                </svg>
              ) : (
                <span className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  saveStatus === 'saved' && 'bg-[var(--color-success)]',
                  saveStatus === 'unsaved' && 'bg-[var(--color-warning)]',
                  saveStatus === 'error' && 'bg-[var(--color-error)]'
                )} />
              )}
              <span className="font-medium">
                {saveStatus === 'saved' && 'All changes saved'}
                {saveStatus === 'saving' && 'Saving...'}
                {saveStatus === 'unsaved' && 'Unsaved changes'}
                {saveStatus === 'error' && 'Failed to save — will retry'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Block list */}
      <div className="pr-4">
        {/* Add block at top */}
        {!readOnly && blocks.length > 0 && (
          <AddBlockMenu onAdd={(type) => handleAddBlock(type, -1)} />
        )}

        <Reorder.Group as="div" axis="y" values={topLevelBlocks} onReorder={handleDragReorder}>
          {(() => {
            // Canon page boundaries (editor only): mark each top-level block whose
            // `source_page` provenance differs from the running page. Null-page
            // rows (legacy / interactively added) never start a boundary and never
            // reset the running page.
            let runningPage: number | null = null;
            return topLevelBlocks.map((block) => {
              const index = blocks.indexOf(block);
              const sp = block.source_page ?? null;
              const pageBoundary = !readOnly && sp !== null && sp !== runningPage ? sp : null;
              if (sp !== null) runningPage = sp;
              return (
                <SortableBlockItem
                  key={block.id}
                  block={block}
                  index={index}
                  totalBlocks={blocks.length}
                  renderBlock={renderBlock}
                  onDelete={handleDeleteBlock}
                  onMoveBlock={handleMoveBlock}
                  onDuplicate={handleDuplicateBlock}
                  onAddBlock={handleAddBlock}
                  readOnly={readOnly}
                  pageBoundary={pageBoundary}
                />
              );
            });
          })()}
        </Reorder.Group>

        {/* Empty state */}
        {blocks.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--color-background-subtle)] flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--color-foreground-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            {readOnly ? (
              <p className="text-[var(--color-foreground-muted)]">No content yet for this language.</p>
            ) : (
              <>
                <p className="text-[var(--color-foreground)] font-medium mb-1">Start building this manual</p>
                <p className="text-sm text-[var(--color-foreground-muted)] mb-6">Add headings, text, images, and more.</p>
                <AddBlockMenu onAdd={(type) => handleAddBlock(type, -1)} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
