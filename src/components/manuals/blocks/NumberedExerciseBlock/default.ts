import type { NumberedExerciseContent } from '@/lib/manuals/types';

export const defaultContent = (): NumberedExerciseContent => ({ schema_version: 2, numeral: '1', body: { type: 'doc', content: [{ type: 'paragraph' }] } });
