import type { ManualBlock, HeadingContent, TextContent, ImageContent } from './types';

/** Convert blocks to styled HTML suitable for PDF rendering */
export function blocksToHtml(blocks: ManualBlock[], title: string): string {
  const bodyHtml = blocks.map((block) => {
    switch (block.block_type) {
      case 'heading': {
        const h = block.content as HeadingContent;
        const tag = `h${h.level}`;
        const styles: Record<number, string> = {
          1: 'font-size: 26pt; font-weight: 600; margin: 32px 0 16px;',
          2: 'font-size: 20pt; font-weight: 600; margin: 28px 0 12px;',
          3: 'font-size: 16pt; font-weight: 500; margin: 24px 0 10px;',
        };
        return `<${tag} style="${styles[h.level]} font-family: 'Cormorant Garamond', Georgia, serif; color: #3F3E3C;">${h.text}</${tag}>`;
      }
      case 'text': {
        const t = block.content as TextContent;
        return `<div style="font-size: 11pt; line-height: 1.7; color: #3F3E3C; margin-bottom: 12px;">${t.html}</div>`;
      }
      case 'image': {
        const img = block.content as ImageContent;
        if (!img.src) return '';
        let html = `<div style="text-align: center; margin: 24px 0;">`;
        html += `<img src="${img.src}" alt="${img.alt || ''}" style="max-width: 80%; border-radius: 16px;" />`;
        if (img.caption) {
          html += `<p style="font-size: 9pt; color: #666; font-style: italic; margin-top: 8px;">${img.caption}</p>`;
        }
        html += `</div>`;
        return html;
      }
      case 'divider':
        return `<hr style="border: none; border-top: 1px solid #E8C4BF; margin: 24px 0;" />`;
      case 'page-break':
        return `<div style="page-break-after: always;"></div>`;
      default:
        return '';
    }
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap');
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: 8.5in 11in; margin: 0.75in; }
    html { font-size: 11pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { font-family: 'Inter', -apple-system, sans-serif; color: #3F3E3C; line-height: 1.7; background: white; padding: 0.75in; }
    ul, ol { padding-left: 24px; margin-bottom: 12px; }
    li { margin-bottom: 4px; }
    strong { font-weight: 600; }
    em { font-style: italic; }
  </style>
</head>
<body>
  <div style="text-align: center; margin-bottom: 40px;">
    <h1 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 32pt; font-weight: 600; color: #3F3E3C;">${title}</h1>
    <div style="width: 60px; height: 1px; background: #9C6F6E; margin: 16px auto;"></div>
  </div>
  ${bodyHtml}
</body>
</html>`;
}
