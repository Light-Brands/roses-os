import Block from './index';
import type { TableContent } from '@/lib/manuals/types';

export default function Preview({ content }: { content: TableContent }) {
  return <Block content={content} onChange={() => {}} readOnly />;
}
