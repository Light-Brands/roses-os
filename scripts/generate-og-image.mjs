/**
 * Generate OG image (1200x630) for social sharing previews.
 * Uses the backcover rose mandala on a branded warm background
 * with the site name "ROSES" as text.
 */
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const WIDTH = 1200;
const HEIGHT = 630;

// Brand colors
const BG_COLOR = '#F7F5F2';       // Aura White background
const ACCENT_COLOR = '#9C6F6E';   // Rose Clay

async function generate() {
  // Load and resize the mandala to fit nicely in the OG image
  const mandalaSize = 520;
  const mandala = await sharp(path.join(root, 'public/images/backcover-rose-mandala.png'))
    .resize(mandalaSize, mandalaSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Create an SVG overlay with the text "ROSES" and tagline
  const svgText = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&amp;display=swap');
      </style>
      <!-- Subtle decorative line -->
      <line x1="660" y1="240" x2="660" y2="390" stroke="${ACCENT_COLOR}" stroke-width="1" opacity="0.3"/>

      <!-- Brand name -->
      <text x="780" y="310"
            font-family="Georgia, 'Times New Roman', serif"
            font-size="72"
            font-weight="400"
            letter-spacing="18"
            fill="#3F3E3C"
            text-anchor="start">ROSES</text>

      <!-- Tagline -->
      <text x="784" y="355"
            font-family="Georgia, 'Times New Roman', serif"
            font-size="18"
            font-weight="400"
            letter-spacing="4"
            fill="${ACCENT_COLOR}"
            text-anchor="start">MEDITATION &amp; AURA READING</text>

      <!-- Subtle bottom accent line -->
      <line x1="784" y1="375" x2="1080" y2="375" stroke="${ACCENT_COLOR}" stroke-width="0.5" opacity="0.4"/>

      <!-- URL -->
      <text x="784" y="400"
            font-family="Georgia, 'Times New Roman', serif"
            font-size="14"
            font-weight="400"
            letter-spacing="2"
            fill="#8C7E73"
            text-anchor="start">rosesmeditation.com</text>
    </svg>
  `;

  const svgBuffer = Buffer.from(svgText);

  // Compose the final image
  const result = await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: BG_COLOR,
    },
  })
    .composite([
      // Rose mandala on the left side
      {
        input: mandala,
        left: 50,
        top: Math.round((HEIGHT - mandalaSize) / 2),
      },
      // Text overlay
      {
        input: svgBuffer,
        left: 0,
        top: 0,
      },
    ])
    .jpeg({ quality: 90 })
    .toFile(path.join(root, 'public/og-image.jpg'));

  console.log(`OG image created: ${result.width}x${result.height} (${(result.size / 1024).toFixed(1)} KB)`);
}

generate().catch(console.error);
