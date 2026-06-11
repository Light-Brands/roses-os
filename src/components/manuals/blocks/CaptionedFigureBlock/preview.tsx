import Block from './index';
import type { CaptionedFigureContent } from '@/lib/manuals/types';

export default function Preview({ content }: { content: CaptionedFigureContent }) {
  return <Block content={content} onChange={() => {}} readOnly />;
}
