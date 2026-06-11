import type { CalloutContent } from '@/lib/manuals/types';

export const defaultContent = (): CalloutContent => ({
  schema_version: 2,
  variant: 'note',
  body: { type: 'doc', content: [{ type: 'paragraph' }] },
});
