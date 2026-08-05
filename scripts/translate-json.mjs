/**
 * Translate every string VALUE in a JSON file into a target language via Gemini,
 * preserving the key structure exactly. Used to produce the /teaching page i18n
 * files (src/content/teaching/<locale>.json) for languages that lacked them.
 *
 *   node scripts/translate-json.mjs --in src/content/teaching/en.json \
 *     --out src/content/teaching/ru.json --name Russian
 */
import { readFileSync, writeFileSync } from 'fs';

function arg(n, d) { const i = process.argv.indexOf(`--${n}`); return i !== -1 ? process.argv[i + 1] : d; }
const IN = arg('in'); const OUT = arg('out'); const NAME = arg('name', 'Russian');

const env = {};
for (const l of readFileSync('.env.local', 'utf-8').split('\n')) { const m = l.match(/^([^#=]+)=(.*)$/); if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, ''); }
const KEY = env.GOOGLE_GEMINI_API_KEY || env.GEMINI_API_KEY;

async function translateChunk(strings) {
  const sys = `Translate each string in the JSON array from English to ${NAME}.
Rules: preserve ALL HTML tags, {placeholders}, punctuation and numbers; proper names and brand names stay as-is; do not add or drop array items.
Return ONLY a JSON array of the same length, translations in the same order.`;
  const MODEL = env.GEMINI_MODEL || process.env.GEMINI_MODEL || 'gemini-flash-latest';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;
  const body = { contents: [{ parts: [{ text: `${sys}\n\n${JSON.stringify(strings)}` }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0 } };
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(`gemini ${res.status}`);
      const j = await res.json();
      const arr = JSON.parse(j.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]');
      if (Array.isArray(arr) && arr.length === strings.length) return arr.map(String);
      throw new Error(`length ${Array.isArray(arr) ? arr.length : 'NaN'} != ${strings.length}`);
    } catch (e) { if (attempt === 2) throw e; await new Promise((r) => setTimeout(r, 1500 * (attempt + 1))); }
  }
}

// Collect string-leaf setters (skip paths, urls, hex colors — translate prose only).
function collect(node, setters) {
  const skip = (s) => /^(\/|https?:|#[0-9a-fA-F]{3,8}$)/.test(s) || /\.(png|jpe?g|svg|webp)$/i.test(s);
  if (Array.isArray(node)) node.forEach((v, i) => { if (typeof v === 'string') { if (!skip(v)) setters.push({ get: () => node[i], set: (t) => (node[i] = t) }); } else collect(v, setters); });
  else if (node && typeof node === 'object') for (const k of Object.keys(node)) { const v = node[k]; if (typeof v === 'string') { if (!skip(v)) setters.push({ get: () => node[k], set: (t) => (node[k] = t) }); } else collect(v, setters); }
}

async function main() {
  const data = JSON.parse(readFileSync(IN, 'utf-8'));
  const setters = [];
  collect(data, setters);
  console.log(`${OUT}: ${setters.length} strings`);
  const CHUNK = 35;
  for (let i = 0; i < setters.length; i += CHUNK) {
    const slice = setters.slice(i, i + CHUNK);
    const out = await translateChunk(slice.map((s) => s.get()));
    slice.forEach((s, k) => s.set(out[k]));
    console.log(`  ${Math.min(i + CHUNK, setters.length)}/${setters.length}`);
  }
  writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n');
  console.log(`✓ wrote ${OUT}`);
}
main().catch((e) => { console.error('translate-json error:', e.message); process.exit(1); });
