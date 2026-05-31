import type { ContentsContent } from '@/lib/manuals/types';

export const defaultContent = (): ContentsContent => ({
  schema_version: 2,
  rows: [{ title: '' }],
});
