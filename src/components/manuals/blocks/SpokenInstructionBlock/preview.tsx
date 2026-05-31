import Block from './index';
import type { SpokenInstructionContent } from '@/lib/manuals/types';

export default function Preview({ content }: { content: SpokenInstructionContent }) {
  return <Block content={content} onChange={() => {}} readOnly />;
}
