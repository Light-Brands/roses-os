import Block from './index';
import type { QuoteContent } from '@/lib/manuals/types';

export default function Preview({ content }: { content: QuoteContent }) {
  return <Block content={content} onChange={() => {}} readOnly />;
}
