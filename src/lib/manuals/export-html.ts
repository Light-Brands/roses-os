import type {
  ManualBlock, HeadingContent, TextContent, ImageContent, ImageRowContent,
  CoverContent, CalloutContent, QuoteContent, NumberedExerciseContent,
  CaptionedFigureContent, SpokenInstructionContent, TableContent,
  ContentsContent, FootnoteContent, GlossaryContent, SectionContent,
  TwoColumnSectionContent, TiptapDoc, TiptapNode,
} from './types';

// ── helpers ──────────────────────────────────────────────────────────────────

function esc(s: string | undefined): string {
  return (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Resolve an image src so it loads inside the print window. Public-folder paths
 *  ("/reconstruction/...", "/uploads/...") need the app origin; data: and http(s)
 *  URLs are used as-is. */
function resolveSrc(src: string | undefined, origin: string): string {
  if (!src) return '';
  if (src.startsWith('/')) return origin + src;
  return src;
}

function nodeToHtml(n: TiptapNode): string {
  switch (n.type) {
    case 'text': {
      let h = esc(n.text);
      for (const m of n.marks ?? []) {
        if (m.type === 'bold') h = `<strong>${h}</strong>`;
        else if (m.type === 'italic') h = `<em>${h}</em>`;
        else if (m.type === 'link' && m.attrs && typeof m.attrs.href === 'string') h = `<a href="${esc(m.attrs.href)}">${h}</a>`;
      }
      return h;
    }
    case 'paragraph': return `<p>${(n.content ?? []).map(nodeToHtml).join('')}</p>`;
    case 'bulletList': return `<ul>${(n.content ?? []).map(nodeToHtml).join('')}</ul>`;
    case 'orderedList': return `<ol>${(n.content ?? []).map(nodeToHtml).join('')}</ol>`;
    case 'listItem': return `<li>${(n.content ?? []).map(nodeToHtml).join('')}</li>`;
    case 'hardBreak': return '<br/>';
    default: return (n.content ?? []).map(nodeToHtml).join('');
  }
}

function docToHtml(doc: TiptapDoc | undefined): string {
  if (!doc || !doc.content) return '';
  return doc.content.map(nodeToHtml).join('');
}

// ── main ─────────────────────────────────────────────────────────────────────

/**
 * Convert blocks to styled, self-contained HTML for print / PDF. Handles every
 * block type (not just the original v1 five), resolves image paths to absolute
 * URLs so they load in the print window, renders TipTap rich-text bodies, and
 * resolves two-column / section children inline. `origin` should be the app
 * origin (window.location.origin) so public-folder images load.
 */
export function blocksToHtml(blocks: ManualBlock[], title: string, origin = ''): string {
  const byId = new Map(blocks.map((b) => [b.id, b]));
  const childIds = new Set<string>();
  for (const b of blocks) {
    if (b.block_type === 'two-column-section') {
      const c = b.content as TwoColumnSectionContent;
      [...(c.left ?? []), ...(c.right ?? [])].forEach((id) => childIds.add(id));
    } else if (b.block_type === 'section') {
      const c = b.content as SectionContent;
      (c.children ?? []).forEach((id) => childIds.add(id));
    }
  }
  const top = blocks.filter((b) => !childIds.has(b.id));

  const imgTag = (src: string | undefined, alt: string | undefined, style: string) =>
    src ? `<img src="${esc(resolveSrc(src, origin))}" alt="${esc(alt)}" style="${style}" />` : '';

  function renderIds(ids: string[]): string {
    return ids.map((id) => { const c = byId.get(id); return c ? renderBlock(c) : ''; }).join('');
  }

  function renderBlock(block: ManualBlock): string {
    switch (block.block_type) {
      case 'heading': {
        const h = block.content as HeadingContent;
        const tag = `h${h.level}`;
        const eyebrow = h.eyebrow ? `<span class="eyebrow">${esc(h.eyebrow)}</span>` : '';
        return `${eyebrow}<${tag}>${esc(h.text)}</${tag}>`;
      }
      case 'text': {
        const t = block.content as TextContent;
        return `<div class="text">${t.doc ? docToHtml(t.doc) : (t.html ?? '')}</div>`;
      }
      case 'image': {
        const c = block.content as ImageContent;
        if (!c.src) return '';
        return `<figure class="figure">${imgTag(c.src, c.alt, 'max-width:80%;border-radius:12px;')}${c.caption ? `<figcaption>${esc(c.caption)}</figcaption>` : ''}</figure>`;
      }
      case 'captioned-figure': {
        const c = block.content as CaptionedFigureContent;
        if (!c.src) return '';
        return `<figure class="figure">${imgTag(c.src, c.alt, 'max-width:80%;border-radius:12px;')}${c.caption ? `<figcaption>${esc(c.caption)}</figcaption>` : ''}${c.credit ? `<figcaption class="credit">${esc(c.credit)}</figcaption>` : ''}</figure>`;
      }
      case 'image-row': {
        const c = block.content as ImageRowContent;
        const imgs = (c.images ?? []).filter((i) => i.src).map((i) => imgTag(i.src, i.alt, 'width:100%;border-radius:8px;')).join('');
        if (!imgs) return '';
        return `<figure class="figure"><div class="image-row">${imgs}</div>${c.caption ? `<figcaption>${esc(c.caption)}</figcaption>` : ''}</figure>`;
      }
      case 'cover': {
        const c = block.content as CoverContent;
        const align = c.align === 'left' ? 'left' : 'center';
        return `<div class="cover" style="text-align:${align};">`
          + (c.eyebrow ? `<div class="cover-eyebrow">${esc(c.eyebrow)}</div>` : '')
          + (c.cover_image ? imgTag(c.cover_image, c.title, 'max-width:60%;margin:12px auto;display:block;') : '')
          + `<h1 class="cover-title">${esc(c.title)}</h1>`
          + (c.subtitle ? `<div class="cover-subtitle">${esc(c.subtitle)}</div>` : '')
          + (c.author ? `<div class="cover-credit">${esc(c.author)}</div>` : '')
          + (c.illustrator ? `<div class="cover-credit"><em>Illustrated by ${esc(c.illustrator)}</em></div>` : '')
          + `</div>`;
      }
      case 'callout': {
        const c = block.content as CalloutContent;
        return `<div class="callout callout-${esc(c.variant)}">`
          + (c.title ? `<div class="callout-title">${esc(c.title)}</div>` : '')
          + (!c.hideLabel && !c.title ? `<div class="callout-label">${esc(c.variant)}</div>` : '')
          + `<div class="callout-body">${docToHtml(c.body)}</div></div>`;
      }
      case 'quote': {
        const c = block.content as QuoteContent;
        return `<blockquote class="quote">${docToHtml(c.body)}${c.attribution ? `<cite>— ${esc(c.attribution)}</cite>` : ''}</blockquote>`;
      }
      case 'numbered-exercise': {
        const c = block.content as NumberedExerciseContent;
        return `<div class="exercise"><div class="exercise-num">${esc(c.numeral)}</div><div class="exercise-body">`
          + (c.title ? `<div class="exercise-title">${esc(c.title)}</div>` : '')
          + `${docToHtml(c.body)}</div></div>`;
      }
      case 'spoken-instruction': {
        const c = block.content as SpokenInstructionContent;
        return `<div class="spoken"><span class="spoken-mark">&#10047;</span> <span class="spoken-line">&ldquo;${esc(c.spoken)}&rdquo;</span>${c.prose ? `<div class="spoken-prose">${docToHtml(c.prose)}</div>` : ''}</div>`;
      }
      case 'table': {
        const c = block.content as TableContent;
        const head = `<tr>${(c.header ?? []).map((h) => `<th>${esc(h)}</th>`).join('')}</tr>`;
        const body = (c.rows ?? []).map((r) => `<tr>${r.map((cell) => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('');
        return `<table class="table"><thead>${head}</thead><tbody>${body}</tbody></table>${c.caption ? `<p class="caption">${esc(c.caption)}</p>` : ''}`;
      }
      case 'contents': {
        const c = block.content as ContentsContent;
        const rows = (c.rows ?? []).map((r) => `<div class="toc-row"><span class="toc-num">${esc(r.numeral)}</span><span class="toc-title">${esc(r.title)}</span><span class="toc-page">${esc(r.page)}</span></div>`).join('');
        return `<div class="contents">${c.eyebrow ? `<div class="eyebrow">${esc(c.eyebrow)}</div>` : ''}${rows}</div>`;
      }
      case 'footnote': {
        const c = block.content as FootnoteContent;
        const notes = Object.entries(c.notes ?? {}).map(([k, v]) => `<div class="footnote-def"><sup>${esc(k)}</sup> ${esc(v)}</div>`).join('');
        return `<div class="footnote">${docToHtml(c.body)}<div class="footnote-notes">${notes}</div></div>`;
      }
      case 'glossary': {
        const c = block.content as GlossaryContent;
        const items = (c.entries ?? []).map((e) => `<div class="glossary-row"><dt>${esc(e.term)}</dt><dd>${esc(e.definition)}</dd></div>`).join('');
        return `<dl class="glossary">${items}</dl>`;
      }
      case 'section': {
        const c = block.content as SectionContent;
        return `<section class="section">${c.title ? `<h3 class="section-title">${esc(c.title)}</h3>` : ''}${renderIds(c.children ?? [])}</section>`;
      }
      case 'two-column-section': {
        const c = block.content as TwoColumnSectionContent;
        const [lp, rp] = c.proportions ?? [1, 1];
        const total = lp + rp;
        return `<div class="two-col" style="grid-template-columns:${(lp / total) * 100}% ${(rp / total) * 100}%;">`
          + `<div class="col">${renderIds(c.left ?? [])}</div><div class="col">${renderIds(c.right ?? [])}</div></div>`;
      }
      case 'divider':
        return `<hr class="divider" />`;
      case 'page-break':
        return `<div class="page-break"></div>`;
      default:
        return '';
    }
  }

  const bodyHtml = top.map(renderBlock).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${esc(title)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap');
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: 8.5in 11in; margin: 0.75in; }
    html { font-size: 11pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { font-family: 'Inter', -apple-system, sans-serif; color: #3F3E3C; line-height: 1.6; background: #fff; padding: 0.5in; }
    h1, h2, h3 { font-family: 'Cormorant Garamond', Georgia, serif; color: #523737; line-height: 1.2; }
    h1 { font-size: 26pt; font-weight: 600; margin: 28px 0 14px; }
    h2 { font-size: 20pt; font-weight: 600; margin: 24px 0 12px; }
    h3 { font-size: 16pt; font-weight: 500; margin: 20px 0 10px; }
    p { margin-bottom: 10px; }
    ul, ol { padding-left: 22px; margin-bottom: 10px; }
    li { margin-bottom: 4px; }
    strong { font-weight: 600; } em { font-style: italic; }
    a { color: #9C6F6E; }
    .eyebrow { display:block; font-size: 9pt; text-transform: uppercase; letter-spacing: 0.18em; color: #9C6F6E; margin-bottom: 4px; }
    .text { margin-bottom: 12px; }
    .figure { text-align: center; margin: 20px 0; }
    .figure img { display: inline-block; height: auto; }
    .figure figcaption { font-size: 9pt; color: #777; font-style: italic; margin-top: 6px; }
    .figure figcaption.credit { font-size: 8pt; color: #999; }
    .image-row { display: flex; gap: 8px; justify-content: center; }
    .cover { margin: 24px 0 32px; }
    .cover-eyebrow { font-size: 9pt; text-transform: uppercase; letter-spacing: 0.2em; color: #9C6F6E; margin-bottom: 8px; }
    .cover-title { font-size: 34pt; }
    .cover-subtitle { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 15pt; color: #9C6F6E; margin: 6px 0; }
    .cover-credit { font-size: 11pt; color: #5A5856; margin-top: 4px; }
    .callout { background: #FBF3F0; border: 1px solid #E8C4BF; border-radius: 10px; padding: 12px 16px; margin: 16px 0; color: #6E4A49; }
    .callout-label { font-size: 8pt; text-transform: uppercase; letter-spacing: 0.12em; color: #B08A88; margin-bottom: 4px; }
    .callout-title { font-weight: 600; margin-bottom: 4px; }
    .callout-body p:last-child { margin-bottom: 0; }
    .quote { border-left: 3px solid #E8C4BF; padding: 4px 0 4px 16px; margin: 16px 0; font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 14pt; color: #5A5856; }
    .quote cite { display:block; font-style: normal; font-size: 10pt; color: #9C6F6E; margin-top: 6px; }
    .exercise { display: grid; grid-template-columns: auto 1fr; gap: 14px; align-items: start; margin: 16px 0; }
    .exercise-num { font-family: 'Cormorant Garamond', serif; font-size: 30pt; line-height: 1; color: #C58B83; }
    .exercise-title { font-family: 'Cormorant Garamond', serif; font-size: 14pt; font-weight: 600; color: #523737; margin-bottom: 4px; }
    .spoken { margin: 14px 0; }
    .spoken-mark { color: #C58B83; }
    .spoken-line { font-weight: 600; }
    .spoken-prose { margin-top: 6px; }
    .table { border-collapse: collapse; width: 100%; margin: 16px 0; font-size: 10pt; }
    .table th, .table td { border: 1px solid #E0D8D4; padding: 5px 9px; text-align: left; }
    .table th { background: #FBF3F0; font-weight: 600; }
    .caption { font-size: 9pt; color: #777; font-style: italic; }
    .contents { margin: 16px 0; }
    .toc-row { display: grid; grid-template-columns: 2.5em 1fr auto; gap: 8px; padding: 3px 0; align-items: baseline; }
    .toc-num { font-family: 'Cormorant Garamond', serif; color: #C58B83; }
    .toc-page { color: #9C6F6E; }
    .footnote { font-size: 9pt; color: #5A5856; margin: 12px 0; }
    .footnote-notes { margin-top: 6px; }
    .glossary { margin: 16px 0; }
    .glossary-row { display: grid; grid-template-columns: 10em 1fr; gap: 10px; margin-bottom: 6px; }
    .glossary dt { font-weight: 600; color: #C58B83; }
    .section { border-left: 2px solid #E8C4BF; padding-left: 14px; margin: 16px 0; }
    .section-title { color: #9C6F6E; }
    .two-col { display: grid; gap: 18px; align-items: start; margin: 16px 0; }
    .two-col .col { min-width: 0; }
    .divider { border: none; border-top: 1px solid #E8C4BF; margin: 22px 0; }
    .page-break { page-break-after: always; }
  </style>
</head>
<body>
  <div style="text-align:center; margin-bottom: 28px;">
    <h1 style="font-size:30pt;">${esc(title)}</h1>
    <div style="width:60px; height:1px; background:#9C6F6E; margin:14px auto;"></div>
  </div>
  ${bodyHtml}
  <script>
    // Wait for images to load before printing, otherwise the print fires with
    // blank figures.
    window.addEventListener('load', function () {
      var imgs = Array.prototype.slice.call(document.images);
      Promise.all(imgs.map(function (img) {
        if (img.complete) return null;
        return new Promise(function (res) { img.onload = img.onerror = res; });
      })).then(function () { setTimeout(function () { window.print(); }, 150); });
    });
  </script>
</body>
</html>`;
}
