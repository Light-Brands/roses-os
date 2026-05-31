import Block from './index';
import type { FootnoteContent } from '@/lib/manuals/types';

export default function Preview({ content }: { content: FootnoteContent }) {
  return <Block content={content} onChange={() => {}} readOnly />;
}
