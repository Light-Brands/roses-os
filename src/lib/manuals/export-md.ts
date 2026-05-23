import type { ManualBlock, HeadingContent, TextContent, ImageContent } from './types';
import { absolutizeSrc } from './export-utils';

/**
 * Convert blocks to Markdown text.
 *
 * `origin` absolutizes root-relative image paths so the exported `.md`
 * still references images once it leaves the app origin. Defaults to
 * empty, leaving already-absolute URLs untouched.
 */
export function blocksToMarkdown(blocks: ManualBlock[], title: string, origin = ''): string {
  const lines: string[] = [`# ${title}`, ''];

  for (const block of blocks) {
    switch (block.block_type) {
      case 'heading': {
        const h = block.content as HeadingContent;
        const prefix = '#'.repeat(h.level + 1); // +1 because title is #
        lines.push(`${prefix} ${h.text}`, '');
        break;
      }
      case 'text': {
        const t = block.content as TextContent;
        // Convert basic HTML to Markdown
        let md = t.html
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<\/p>\s*<p>/gi, '\n\n')
          .replace(/<p>/gi, '')
          .replace(/<\/p>/gi, '')
          .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
          .replace(/<b>(.*?)<\/b>/gi, '**$1**')
          .replace(/<em>(.*?)<\/em>/gi, '*$1*')
          .replace(/<i>(.*?)<\/i>/gi, '*$1*')
          .replace(/<li>(.*?)<\/li>/gi, '- $1')
          .replace(/<\/?[uo]l>/gi, '')
          .replace(/<[^>]+>/g, '') // Strip remaining tags
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&nbsp;/g, ' ')
          .trim();
        if (md) lines.push(md, '');
        break;
      }
      case 'image': {
        const img = block.content as ImageContent;
        if (img.src) {
          lines.push(`![${img.alt || ''}](${absolutizeSrc(img.src, origin)})`);
          if (img.caption) lines.push(`*${img.caption}*`);
          lines.push('');
        }
        break;
      }
      case 'divider':
        lines.push('---', '');
        break;
      case 'page-break':
        lines.push('', '---', '*(Page Break)*', '---', '');
        break;
    }
  }

  return lines.join('\n');
}

/** Trigger a Markdown file download */
export function downloadMarkdown(blocks: ManualBlock[], title: string, filename: string, origin = '') {
  const md = blocksToMarkdown(blocks, title, origin);
  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
