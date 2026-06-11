import Block from './index';
import type { CoverContent } from '@/lib/manuals/types';

export default function Preview({ content }: { content: CoverContent }) {
  return <Block content={content} onChange={() => {}} readOnly />;
}
