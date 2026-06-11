import Block from './index';
import type { NumberedExerciseContent } from '@/lib/manuals/types';

export default function Preview({ content }: { content: NumberedExerciseContent }) {
  return <Block content={content} onChange={() => {}} readOnly />;
}
