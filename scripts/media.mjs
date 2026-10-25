// Photos: reads src/content/media.sources.js, resolves each Unsplash id through the public download endpoint
// (its redirect gives the CDN id), fetches sized AVIF/WebP renditions (+ one JPG at 1200) from images.unsplash.com,
// and writes public/media/<slot>-<w>.<ext>, src/content/media.json and public/media/CREDITS.txt.
// Run by hand (npm run media) and commit the output. Idempotent: existing files are skipped. Exits 1 over budget.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(root, 'public/media');
const JSON_OUT = path.join(root, 'src/content/media.json');
const sources = (await import(pathToFileURL(path.join(root, 'src/content/media.sources.js')).href)).default;
const old = fs.existsSync(JSON_OUT) ? JSON.parse(fs.readFileSync(JSON_OUT, 'utf8')) : {};
fs.mkdirSync(OUT, { recursive: true });

// Quality is the starting point; a file over its size limit is refetched at a lower quality, down to the floor.
// AVIF is the format almost every visitor gets, so it is held to the plan's budget. WebP and JPG are fallbacks for
// old browsers and carry film grain badly (the plan's 140 kB is not reachable at q62/q70), so they get a looser ceiling.
const QUALITY = { avif: 50, webp: 62, jpg: 70 };
const FLOOR = { avif: 30, webp: 40, jpg: 45 };
const FALLBACK_W = 1200;
const KB = 1024;
const limitFor = (s, w, ext) => {
  if (ext !== 'avif') return (w === 2400 ? 500 : 280) * KB;
  if (w === 2400) return 350 * KB; // the two story heroes only, on very wide screens
  if (s.widths.includes(2400) && w === 1600) return 200 * KB; // hero AVIF 1600
  return 140 * KB;
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** fetch with one retry; a second failure stops the whole run (two-strike) */
async function get(url, opts = {}) {
  let last;
  for (let i = 0; i < 2; i++) {
    try {
      const r = await fetch(url, opts);
      if (r.status >= 200 && r.status < 400) return r;
      last = `${r.status} ${url}`;
      if (r.status === 429) await sleep(20000);
    } catch (e) { last = `${e.message} ${url}`; }
    await sleep(1500);
  }
  throw new Error(`failed twice: ${last}`);
}

async function resolve(id) {
  const r = await get(`https://unsplash.com/photos/${id}/download`, { redirect: 'manual' });
  const m = /\/(photo-[\w-]+)/.exec(r.headers.get('location') || '');
  if (!m) throw new Error(`no CDN id in the redirect for ${id}`);
  const page = await (await get(`https://unsplash.com/photos/${id}`)).text();
  const name = /Photo by ([^<"]+?) on Unsplash/.exec(page)?.[1];
  const handle = /href="\/@([\w.-]+)/.exec(page)?.[1];
  if (!name) throw new Error(`no photographer found on the page for ${id}`);
  const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');
  return { cdn: m[1], name: decode(name).replace(/\p{Extended_Pictographic}|\p{Regional_Indicator}/gu, '').trim(), profile: handle ? `https://unsplash.com/@${handle}` : null };
}

function rendition(cdn, s, w, ext, q = QUALITY[ext]) {
  const h = Math.round(w / s.ratio);
  const [x, y] = s.focal;
  return `https://images.unsplash.com/${cdn}?w=${w}&h=${h}&fit=crop&crop=focalpoint&fp-x=${x}&fp-y=${y}${s.zoom ? `&fp-z=${s.zoom}` : ''}&q=${q}&fm=${ext}`;
}

const out = {}; const credits = []; const files = [];
for (const [slot, s] of Object.entries(sources)) {
  const prev = old[slot];
  const same = prev && prev.id === s.id && prev.ratio === +s.ratio.toFixed(4) && JSON.stringify(prev.focal) === JSON.stringify(s.focal) && prev.zoom === (s.zoom || null)
    && JSON.stringify(prev.widths) === JSON.stringify(s.widths);
  const info = same ? prev : { ...(await resolve(s.id)) };
  if (!same) await sleep(1000); // polite to the download endpoint
  const cdn = same ? prev.cdn : info.cdn;
  const color = same ? prev.color : await colour(cdn);
  const dims = {};
  const want = [];
  for (const w of s.widths) { dims[w] = [w, Math.round(w / s.ratio)]; want.push([w, 'avif'], [w, 'webp']); }
  want.push([FALLBACK_W, 'jpg']);
  let fetched = 0;
  for (const [w, ext] of want) {
    const file = path.join(OUT, `${slot}-${w}.${ext}`);
    const limit = limitFor(s, w, ext);
    if (!same || !fs.existsSync(file) || fs.statSync(file).size === 0 || fs.statSync(file).size > limit) {
      for (let q = QUALITY[ext]; ; q -= 5) {
        const r = await get(rendition(cdn, s, w, ext, q));
        const type = r.headers.get('content-type') || '';
        if (!type.includes(ext === 'jpg' ? 'jpeg' : ext)) throw new Error(`${slot}-${w}.${ext}: unexpected content-type ${type}`);
        const buf = Buffer.from(await r.arrayBuffer());
        fs.writeFileSync(file, buf);
        await sleep(250);
        if (buf.length <= limit || q - 5 < FLOOR[ext]) break;
      }
      fetched++;
    }
    files.push({ slot, w, ext, file });
  }
  out[slot] = {
    id: s.id, cdn, widths: s.widths, dims, ratio: +s.ratio.toFixed(4), focal: s.focal, zoom: s.zoom || null, fallback: FALLBACK_W,
    color, photographer: same ? prev.photographer : info.name, profile: same ? prev.profile : info.profile, page: `https://unsplash.com/photos/${s.id}`,
  };
  fs.writeFileSync(JSON_OUT, JSON.stringify({ ...old, ...out }, null, 2) + '\n'); // saved per slot, so a stopped run resumes
  console.log(`${slot.padEnd(22)} ${s.id.padEnd(12)} ${fetched ? `fetched ${fetched}` : 'skipped'}`);
  credits.push(`${slot}: "${out[slot].photographer}" ${out[slot].profile || ''} ${out[slot].page}`.replace(/ +/g, ' '));
}

async function colour(cdn) {
  const j = await (await get(`https://images.unsplash.com/${cdn}?fm=json&palette=json&colors=1`)).json();
  return j.colors?.[0]?.hex || '#d9d3ca';
}

fs.writeFileSync(JSON_OUT, JSON.stringify(out, null, 2) + '\n');
fs.writeFileSync(path.join(OUT, 'CREDITS.txt'), `Photos on tapnconnect.ae, from Unsplash (Unsplash License: free to use; credit is a courtesy).\n\n${credits.join('\n')}\n`);

// Drop renditions of slots in media.sources.js that are no longer wanted (a narrower widths list, say)
const keep = new Set(files.map((f) => path.basename(f.file)));
for (const name of fs.readdirSync(OUT)) {
  const m = /^(.+)-\d+\.(avif|webp|jpg)$/.exec(name);
  if (m && sources[m[1]] && !keep.has(name)) { fs.unlinkSync(path.join(OUT, name)); console.log(`removed ${name}`); }
}

// Budget check (the limits above)
const over = [];
for (const f of files) {
  const size = fs.statSync(f.file).size;
  const limit = limitFor(sources[f.slot], f.w, f.ext);
  if (size > limit) over.push(`${path.relative(root, f.file)} ${(size / KB).toFixed(0)} kB > ${limit / KB} kB`);
}
const total = files.reduce((n, f) => n + fs.statSync(f.file).size, 0);
console.log(`${files.length} files, ${(total / 1048576).toFixed(1)} MB`);
if (over.length) { console.error(`over budget:\n  ${over.join('\n  ')}`); process.exit(1); }
