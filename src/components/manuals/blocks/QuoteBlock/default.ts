import type { QuoteContent } from '@/lib/manuals/types';

export const defaultContent = (): QuoteContent => ({ schema_version: 2, body: { type: 'doc', content: [{ type: 'paragraph' }] } });
