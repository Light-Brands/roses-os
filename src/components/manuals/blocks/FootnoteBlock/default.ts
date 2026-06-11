import type { FootnoteContent } from '@/lib/manuals/types';

export const defaultContent = (): FootnoteContent => ({ schema_version: 2, body: { type: 'doc', content: [{ type: 'paragraph' }] }, notes: {} });
