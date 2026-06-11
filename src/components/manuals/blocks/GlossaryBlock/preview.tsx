import Block from './index';
import type { GlossaryContent } from '@/lib/manuals/types';

export default function Preview({ content }: { content: GlossaryContent }) {
  return <Block content={content} onChange={() => {}} readOnly />;
}
