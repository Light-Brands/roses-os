'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ManualBlock, ManualLanguage, BlockType, BlockContent, HeadingContent, TextContent, ImageContent } from '@/lib/manuals/types';
import HeadingBlock from './blocks/HeadingBlock';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
import DividerBlock from './blocks/DividerBlock';
import PageBreakBlock from './blocks/PageBreakBlock';
import AddBlockMenu from './blocks/AddBlockMenu';
import BlockWrapper from './BlockWrapper';

interface BlockEditorProps {
  manualId: string;
  language: ManualLanguage;
  readOnly: boolean;
  onBlocksChange?: (blocks: ManualBlock[]) => void;
}

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

function getDefaultContent(type: BlockType): BlockContent {
  switch (type) {
    case 'heading': return { text: '', level: 2 } as HeadingContent;
    case 'text': return { html: '' } as TextContent;
    case 'image': return { src: '', alt: '', caption: '' } as ImageContent;
    case 'divider': return {};
    case 'page-break': return {};
  }
}

export default function BlockEditor({ manualId, language, readOnly, onBlocksChange }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<ManualBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [lastEditInfo, setLastEditInfo] = useState<{ updated_by: string | null; updated_at: string } | null>(null);
  const saveTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

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
          // Get last edit info from most recent block
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

  // Notify parent of blocks changes
  useEffect(() => {
    onBlocksChange?.(blocks);
  }, [blocks, onBlocksChange]);

  // Auto-save a block (debounced)
  const saveBlock = useCallback(async (blockId: string, content: BlockContent) => {
    // Clear existing timeout for this block
    if (saveTimeoutRef.current[blockId]) {
      clearTimeout(saveTimeoutRef.current[blockId]);
    }

    setSaveStatus('unsaved');

    saveTimeoutRef.current[blockId] = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        const res = await fetch(`/api/manuals/${manualId}/blocks`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: blockId, content, updated_by: 'Editor' }),
        });

        if (res.ok) {
          setSaveStatus('saved');
          setLastEditInfo({ updated_by: 'Editor', updated_at: new Date().toISOString() });
        } else {
          setSaveStatus('error');
        }
      } catch {
        setSaveStatus('error');
      }
    }, 500);
  }, [manualId]);

  // Handle content change for a block
  const handleContentChange = useCallback((blockId: string, content: BlockContent) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, content } : b))
    );
    if (!readOnly) {
      saveBlock(blockId, content);
    }
  }, [readOnly, saveBlock]);

  // Add a new block
  const handleAddBlock = useCallback(async (type: BlockType, afterIndex: number) => {
    const content = getDefaultContent(type);
    const position = afterIndex + 1;

    try {
      const res = await fetch(`/api/manuals/${manualId}/blocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          block_type: type,
          content,
          position,
          updated_by: 'Editor',
        }),
      });

      const json = await res.json();
      if (json.data) {
        setBlocks((prev) => {
          const newBlocks = [...prev];
          newBlocks.splice(position, 0, json.data);
          return newBlocks;
        });
      }
    } catch {
      // Failed to create block
    }
  }, [manualId, language]);

  // Delete a block
  const handleDeleteBlock = useCallback(async (blockId: string) => {
    try {
      await fetch(`/api/manuals/${manualId}/blocks`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: blockId }),
      });

      setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    } catch {
      // Failed to delete
    }
  }, [manualId]);

  // Move block up/down
  const handleMoveBlock = useCallback(async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(newIndex, 0, moved);
    setBlocks(newBlocks);

    // Persist new order
    try {
      await fetch(`/api/manuals/${manualId}/blocks/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          block_ids: newBlocks.map((b) => b.id),
          updated_by: 'Editor',
        }),
      });
    } catch {
      // Revert on failure
      setBlocks(blocks);
    }
  }, [blocks, manualId]);

  // Render a block by type
  const renderBlock = (block: ManualBlock) => {
    switch (block.block_type) {
      case 'heading':
        return (
          <HeadingBlock
            content={block.content as HeadingContent}
            onChange={(content) => handleContentChange(block.id, content)}
            onLevelChange={(level) => handleContentChange(block.id, { ...(block.content as HeadingContent), level })}
            readOnly={readOnly}
          />
        );
      case 'text':
        return (
          <TextBlock
            content={block.content as TextContent}
            onChange={(content) => handleContentChange(block.id, content)}
            readOnly={readOnly}
          />
        );
      case 'image':
        return (
          <ImageBlock
            content={block.content as ImageContent}
            onChange={(content) => handleContentChange(block.id, content)}
            readOnly={readOnly}
          />
        );
      case 'divider':
        return <DividerBlock />;
      case 'page-break':
        return <PageBreakBlock />;
      default:
        return null;
    }
  };

  // Format relative time
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
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 bg-[var(--color-background-muted)] rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Status bar */}
      <div className="flex items-center justify-between mb-6 text-xs text-[var(--color-foreground-faint)]">
        <div className="flex items-center gap-2">
          {lastEditInfo && (
            <span>
              Last edited{lastEditInfo.updated_by ? ` by ${lastEditInfo.updated_by}` : ''},{' '}
              {formatRelativeTime(lastEditInfo.updated_at)}
            </span>
          )}
        </div>
        {!readOnly && (
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                saveStatus === 'saved' && 'bg-[var(--color-success)]',
                saveStatus === 'saving' && 'bg-[var(--color-warning)]',
                saveStatus === 'unsaved' && 'bg-[var(--color-warning)]',
                saveStatus === 'error' && 'bg-[var(--color-error)]'
              )}
            />
            <span>
              {saveStatus === 'saved' && 'Saved'}
              {saveStatus === 'saving' && 'Saving...'}
              {saveStatus === 'unsaved' && 'Unsaved changes'}
              {saveStatus === 'error' && 'Save failed'}
            </span>
          </div>
        )}
      </div>

      {/* Block list */}
      <div className="pl-14">
        {/* Add block at top */}
        {!readOnly && (
          <div className="group py-1">
            <AddBlockMenu onAdd={(type) => handleAddBlock(type, -1)} />
          </div>
        )}

        <AnimatePresence initial={false}>
          {blocks.map((block, index) => (
            <motion.div
              key={block.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <BlockWrapper
                onDelete={() => handleDeleteBlock(block.id)}
                onMoveUp={() => handleMoveBlock(index, 'up')}
                onMoveDown={() => handleMoveBlock(index, 'down')}
                isFirst={index === 0}
                isLast={index === blocks.length - 1}
                readOnly={readOnly}
              >
                {renderBlock(block)}
              </BlockWrapper>

              {/* Add block between blocks */}
              {!readOnly && (
                <div className="group py-1">
                  <AddBlockMenu onAdd={(type) => handleAddBlock(type, index)} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {blocks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--color-foreground-muted)] mb-2">
              {readOnly ? 'No content yet.' : 'This manual is empty. Click + to add your first block.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
