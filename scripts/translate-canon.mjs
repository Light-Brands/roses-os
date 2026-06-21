/**
 * Translate a canon-blocks lane from English into a target language via Gemini.
 *
 * Structure, images, layout, ids and positions are kept identical — ONLY the
 * human-readable text fields are translated (heading text, paragraph html with
 * tags preserved, callout body, contents titles, table cells, cover title/sub,
 * image alt). This is a faithful translation of the EN canon rebuild, so every
 * language inherits the corrected order + two-/three-column layout for free.
 *
 * AI translation is a starting point teachers refine in the editor (same policy
 * as the ES/PT student-manual translations).
 *
 *   node scripts/translate-canon.mjs --slug rose-meditation-level-1 --lang el --name Greek
 *   -> writes _qie-output/roses-os/canon-blocks/<slug>-<lang>.json
 */
import { readFileSync, writeFileSync } from 'fs';

function arg(n, d) { const i = process.argv.indexOf(`--${n}`); return i !== -1 ? process.argv[i + 1] : d; }
const SLUG = arg('slug', 'rose-meditation-level-1');
const LANG = arg('lang', 'el');
const NAME = arg('name', 'Greek');
const SRC = `_qie-output/roses-os/canon-blocks/${SLUG}-en.json`;
const OUT = `_qie-output/roses-os/canon-blocks/${SLUG}-${LANG}.json`;

const env = {};
for (const l of readFileSync('.env.local', 'utf-8').split('\n')) { const m = l.match(/^([^#=]+)=(.*)$/); if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, ''); }
const KEY = env.GOOGLE_GEMINI_API_KEY || env.GEMINI_API_KEY;
if (!KEY) { console.error('no gemini key'); process.exit(1); }

async function translateChunk(strings) {
  const sys = `Translate each string in the JSON array from English to ${NAME}.
Rules: preserve ALL HTML tags, attributes and entities exactly (translate only visible text between tags); keep numbers, list structure and punctuation; do not add or drop array items; proper names stay as-is.
Return ONLY a JSON array of the same length, translations in the same order.`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`;
  const body = { contents: [{ parts: [{ text: `${sys}\n\n${JSON.stringify(strings)}` }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0 } };
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(`gemini ${res.status}`);
      const j = await res.json();
      const txt = j.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]';
      const arr = JSON.parse(txt);
      if (Array.isArray(arr) && arr.length === strings.length) return arr.map(String);
      throw new Error(`length ${Array.isArray(arr) ? arr.length : 'NaN'} != ${strings.length}`);
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
}

// Collect translatable text with setters.
function collect(blocks) {
  const jobs = [];
  const add = (v, apply) => { if (typeof v === 'string' && v.trim()) jobs.push({ v, apply }); };
  for (const b of blocks) {
    const c = b.content || {};
    switch (b.block_type) {
      case 'heading': add(c.text, (t) => (c.text = t)); break;
      case 'text': add(c.html, (t) => (c.html = t)); break;
      case 'callout': (c.body?.content || []).forEach((p) => (p.content || []).forEach((n) => { if (n.type === 'text') add(n.text, (t) => (n.text = t)); })); break;
      case 'contents': (c.rows || []).forEach((r) => add(r.title, (t) => (r.title = t))); break;
      case 'table':
        (c.header || []).forEach((h, i) => add(h, (t) => (c.header[i] = t)));
        (c.rows || []).forEach((row) => row.forEach((cell, i) => add(cell, (t) => (row[i] = t))));
        break;
      case 'cover': add(c.title, (t) => (c.title = t)); add(c.subtitle, (t) => (c.subtitle = t)); add(c.author, (t) => (c.author = t)); break;
      case 'image': add(c.alt, (t) => (c.alt = t)); break;
    }
  }
  return jobs;
}

async function main() {
  const doc = JSON.parse(readFileSync(SRC, 'utf-8'));
  const blocks = doc.data;
  const jobs = collect(blocks);
  console.log(`${SLUG} ${LANG}: ${jobs.length} strings to translate`);
  const CHUNK = 35;
  for (let i = 0; i < jobs.length; i += CHUNK) {
    const slice = jobs.slice(i, i + CHUNK);
    const out = await translateChunk(slice.map((j) => j.v));
    slice.forEach((j, k) => j.apply(out[k]));
    console.log(`  ${Math.min(i + CHUNK, jobs.length)}/${jobs.length}`);
  }
  // language tag on each row
  for (const b of blocks) b.language = LANG;
  writeFileSync(OUT, JSON.stringify({ slug: SLUG, language: LANG, data: blocks }, null, 2));
  console.log(`✓ wrote ${OUT}`);
}
main().catch((e) => { console.error('translate error:', e.message); process.exit(1); });
