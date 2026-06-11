import CalloutBlock from './index';
import type { CalloutContent } from '@/lib/manuals/types';

export default function CalloutPreview({ content }: { content: CalloutContent }) {
  return <CalloutBlock content={content} onChange={() => {}} readOnly />;
}
