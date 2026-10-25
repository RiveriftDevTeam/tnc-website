// Media: reads src/content/media.sources.js and writes public/media/, src/content/media.json and public/media/CREDITS.txt.
//  - Unsplash photos: each id is resolved through the public download endpoint (its redirect gives the CDN id), then sized
//    AVIF/WebP renditions (+ one JPG at 1200) are fetched from images.unsplash.com (imgix does the crop and encoding).
//  - Pexels photos (`source: 'pexels'`): the original is fetched from images.pexels.com, cropped around the focal point
//    with ffmpeg and encoded to WebP (cwebp) at each width, plus one JPG at 1200. No AVIF (no encoder on the build
//    machine); media.json records `formats` so Photo.js leaves the AVIF <source> out.
//  - Video loops (`videos` in the sources file): the clip's public download link is fetched, a clean segment is cut and
//    cross-faded into a seamless loop, then encoded to public/media/video/<name>.{mp4,webm} (muted) and a <name>.jpg poster.
// Run by hand (npm run media) and commit the output. Idempotent: existing files are skipped. Exits 1 over budget.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(root, 'public/media');
const VIDEO_OUT = path.join(OUT, 'video');
const JSON_OUT = path.join(root, 'src/content/media.json');
const CACHE = path.join(os.tmpdir(), 'tnc-media');
const mod = await import(pathToFileURL(path.join(root, 'src/content/media.sources.js')).href);
const sources = mod.default;
const videos = mod.videos || {};
const old = fs.existsSync(JSON_OUT) ? JSON.parse(fs.readFileSync(JSON_OUT, 'utf8')) : {};
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(VIDEO_OUT, { recursive: true });
fs.mkdirSync(CACHE, { recursive: true });

// Quality is the starting point; a file over its size limit is re-encoded at a lower quality, down to the floor.
// AVIF is the format almost every visitor gets, so it is held to the plan's budget. For Unsplash slots WebP and JPG are
// fallbacks for old browsers and carry film grain badly (the plan's 140 kB is not reachable at q62/q70), so they get a
// looser ceiling. For Pexels slots WebP is the main format, so it is held to the plan's budget (hero 1600: 200 kB).
const QUALITY = { avif: 50, webp: 62, jpg: 70 };
const FLOOR = { avif: 30, webp: 30, jpg: 45 };
const FALLBACK_W = 1200;
const KB = 1024;
const isPexels = (s) => s.source === 'pexels';
const formatsOf = (s) => (isPexels(s) ? ['webp'] : ['avif', 'webp']);
const limitFor = (s, w, ext) => {
  if (ext === 'jpg' || (ext === 'webp' && !isPexels(s))) return (w >= 2000 ? 500 : 280) * KB;
  const top = Math.max(...s.widths);
  if (top >= 2000 && w === top) return 350 * KB; // the story heroes only, on very wide screens
  if (top >= 2000 && w === 1600) return 200 * KB; // hero 1600
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

async function download(url, file) {
  if (fs.existsSync(file) && fs.statSync(file).size > 0) return file;
  const r = await get(url);
  fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
  return file;
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

// ---- Pexels: local crop + encode -------------------------------------------------------------------------------------
const run = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
function probe(file) {
  const [w, h] = run('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file]).toString().trim().split(',').map(Number);
  return { w, h };
}
/** the crop window (in source pixels) for a slot: the largest window of the slot's ratio, tightened by zoom, centred on the focal point */
function cropBox(src, s) {
  const cw = Math.min(src.w, src.h * s.ratio) / (s.zoom || 1);
  const ch = cw / s.ratio;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  return { cw, ch, cx: clamp(s.focal[0] * src.w - cw / 2, 0, src.w - cw), cy: clamp(s.focal[1] * src.h - ch / 2, 0, src.h - ch) };
}
function dominantColour(file) {
  const b = run('ffmpeg', ['-v', 'error', '-i', file, '-vf', 'scale=1:1:flags=area', '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']);
  return `#${[...b.subarray(0, 3)].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
}
/** encodes one rendition of a Pexels slot; returns bytes. Re-encodes at lower quality until it fits the limit. */
function encodePexels(srcFile, src, s, slot, w, ext, limit) {
  const h = Math.round(w / s.ratio);
  const { cw, ch, cx, cy } = cropBox(src, s);
  if (cw < w * 0.97) throw new Error(`${slot}-${w}: source crop is only ${Math.round(cw)} px wide (needs ${w})`);
  const file = path.join(OUT, `${slot}-${w}.${ext}`);
  const png = path.join(CACHE, `${slot}-${w}.png`);
  const vf = `crop=${cw.toFixed(2)}:${ch.toFixed(2)}:${cx.toFixed(2)}:${cy.toFixed(2)},scale=${w}:${h}:flags=lanczos`;
  run('ffmpeg', ['-v', 'error', '-y', '-i', srcFile, '-vf', vf, '-frames:v', '1', '-update', '1', png]);
  for (let q = QUALITY[ext]; ; q -= 5) {
    if (ext === 'webp') run('cwebp', ['-quiet', '-q', String(q + 8), '-m', '6', '-sharp_yuv', png, '-o', file]);
    else run('ffmpeg', ['-v', 'error', '-y', '-i', png, '-q:v', String(Math.round(2 + (QUALITY.jpg - q) / 4 + 1)), file]);
    const size = fs.statSync(file).size;
    if (size <= limit || q - 5 < FLOOR[ext]) { fs.rmSync(png); return size; }
  }
}

const out = {}; const files = [];
for (const [slot, s] of Object.entries(sources)) {
  const prev = old[slot];
  const source = s.source || 'unsplash';
  const formats = formatsOf(s);
  const same = prev && (prev.source || 'unsplash') === source && prev.id === s.id && prev.ratio === +s.ratio.toFixed(4) && JSON.stringify(prev.focal) === JSON.stringify(s.focal)
    && prev.zoom === (s.zoom || null) && JSON.stringify(prev.widths) === JSON.stringify(s.widths) && JSON.stringify(prev.formats || ['avif', 'webp']) === JSON.stringify(formats);
  const dims = {};
  const want = [];
  for (const w of s.widths) { dims[w] = [w, Math.round(w / s.ratio)]; for (const ext of formats) want.push([w, ext]); }
  want.push([FALLBACK_W, 'jpg']);
  let fetched = 0; let info; let cdn = null; let color;
  if (isPexels(s)) {
    const srcFile = await download(`https://images.pexels.com/photos/${s.id}/pexels-photo-${s.id}.jpeg`, path.join(CACHE, `pexels-${s.id}.jpg`));
    const src = probe(srcFile);
    color = same ? prev.color : dominantColour(srcFile);
    for (const [w, ext] of want) {
      const file = path.join(OUT, `${slot}-${w}.${ext}`);
      const limit = limitFor(s, w, ext);
      if (!same || !fs.existsSync(file) || fs.statSync(file).size === 0 || fs.statSync(file).size > limit) { encodePexels(srcFile, src, s, slot, w, ext, limit); fetched++; }
      files.push({ slot, w, ext, file });
    }
    info = { name: s.photographer, profile: s.profile };
  } else {
    info = same ? { name: prev.photographer, profile: prev.profile } : { ...(await resolve(s.id)) };
    if (!same) await sleep(1000); // polite to the download endpoint
    cdn = same ? prev.cdn : info.cdn;
    color = same ? prev.color : await colour(cdn);
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
  }
  out[slot] = {
    source, id: s.id, cdn, widths: s.widths, formats, dims, ratio: +s.ratio.toFixed(4), focal: s.focal, zoom: s.zoom || null, fallback: FALLBACK_W,
    color, photographer: info.name, profile: info.profile || null,
    page: isPexels(s) ? s.page : `https://unsplash.com/photos/${s.id}`,
    licence: isPexels(s) ? 'Pexels License' : 'Unsplash License',
  };
  fs.writeFileSync(JSON_OUT, JSON.stringify({ ...old, ...out }, null, 2) + '\n'); // saved per slot, so a stopped run resumes
  console.log(`${slot.padEnd(22)} ${(source + ':' + s.id).padEnd(20)} ${fetched ? `made ${fetched}` : 'skipped'}`);
}

async function colour(cdn) {
  const j = await (await get(`https://images.unsplash.com/${cdn}?fm=json&palette=json&colors=1`)).json();
  return j.colors?.[0]?.hex || '#d9d3ca';
}

// ---- Video loops -----------------------------------------------------------------------------------------------------
const VIDEO_LIMIT = 2.5 * 1024 * KB;
const POSTER_LIMIT = 140 * KB;
const videoOut = {};
for (const [name, v] of Object.entries(videos)) {
  const mp4 = path.join(VIDEO_OUT, `${name}.mp4`); const webm = path.join(VIDEO_OUT, `${name}.webm`); const poster = path.join(VIDEO_OUT, `${name}.jpg`);
  const prev = old.video?.[name];
  const same = prev && prev.download === v.download && prev.start === v.start && prev.duration === v.duration && (prev.fade || 0) === (v.fade || 0) && (prev.speed || 1) === (v.speed || 1) && (prev.crop || null) === (v.crop || null) && (prev.width || 1280) === (v.width || 1280) && [mp4, webm, poster].every((f) => fs.existsSync(f) && fs.statSync(f).size > 0);
  if (!same) {
    const srcFile = await download(v.download, path.join(CACHE, `video-${name}-${new URL(v.download).pathname.replace(/\W+/g, '_')}`));
    const speed = v.speed || 1; // < 1 slows the clip down (a short, calm crowd shot reads better a little slower)
    const f = v.fade || 0; const D = v.duration / speed; const L = D - f; // the loop is D - fade seconds long
    const fps = v.fps || 25;
    const scale = `${v.crop ? `crop=${v.crop},` : ''}setpts=PTS/${speed},scale=${v.width || 1280}:-2:flags=lanczos,fps=${fps},format=yuv420p`; // crop (w:h:x:y) frames the clip for its slot
    const cut = ['-ss', String(v.start), '-t', String(v.duration), '-i', srcFile];
    const graph = f > 0
      ? `[0:v]${scale},split[a][b];[a]trim=start=${f}:end=${D},setpts=PTS-STARTPTS[m];[b]trim=start=0:end=${f + 0.2},setpts=PTS-STARTPTS[h];[m][h]xfade=transition=fade:duration=${f}:offset=${(L - f).toFixed(3)},trim=duration=${L},setpts=PTS-STARTPTS[v]`
      : `[0:v]${scale},trim=duration=${D},setpts=PTS-STARTPTS[v]`;
    run('ffmpeg', ['-v', 'error', '-y', ...cut, '-filter_complex', graph, '-map', '[v]', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', String(v.crfMp4 || 28), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4]);
    run('ffmpeg', ['-v', 'error', '-y', ...cut, '-filter_complex', graph, '-map', '[v]', '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', String(v.crfWebm || 38), '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-pix_fmt', 'yuv420p', webm]);
    for (let q = 3; q <= 12; q++) { // the poster is the clip's first frame
      run('ffmpeg', ['-v', 'error', '-y', '-i', mp4, '-frames:v', '1', '-update', '1', '-q:v', String(q), poster]);
      if (fs.statSync(poster).size <= POSTER_LIMIT) break;
    }
  }
  const secs = Number(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4]).toString().trim());
  videoOut[name] = {
    source: v.source, page: v.page, creator: v.creator, creatorUrl: v.creatorUrl || null, licence: v.licence, download: v.download, start: v.start, duration: v.duration, fade: v.fade || 0, speed: v.speed || 1, crop: v.crop || null, width: v.width || 1280,
    seconds: +secs.toFixed(2), bytes: { mp4: fs.statSync(mp4).size, webm: fs.statSync(webm).size, poster: fs.statSync(poster).size },
  };
  console.log(`video ${name.padEnd(8)} ${same ? 'skipped' : 'made'}  ${secs.toFixed(1)} s  mp4 ${(videoOut[name].bytes.mp4 / KB).toFixed(0)} kB  webm ${(videoOut[name].bytes.webm / KB).toFixed(0)} kB  poster ${(videoOut[name].bytes.poster / KB).toFixed(0)} kB`);
}

fs.writeFileSync(JSON_OUT, JSON.stringify({ ...out, ...(Object.keys(videoOut).length ? { video: videoOut } : {}) }, null, 2) + '\n');
const credit = (slot, m) => `${slot}: "${m.photographer}" ${m.profile || ''} ${m.page} (${m.licence})`.replace(/ +/g, ' ');
fs.writeFileSync(path.join(OUT, 'CREDITS.txt'), [
  'Photos and video on tapnconnect.ae, from Unsplash (Unsplash License) and Pexels (Pexels License).',
  'Both licences allow free commercial use without attribution; credit is a courtesy.',
  '', 'Photos', ...Object.entries(out).map(([slot, m]) => credit(slot, m)),
  ...(Object.keys(videoOut).length ? ['', 'Video', ...Object.entries(videoOut).map(([name, v]) => `${name}: "${v.creator}" ${v.page} (${v.licence}; ${v.source})`)] : []),
  '',
].join('\n'));

// Drop renditions of slots in media.sources.js that are no longer wanted (a narrower widths list, an AVIF that a Pexels slot never had)
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
for (const [name, v] of Object.entries(videoOut)) {
  for (const ext of ['mp4', 'webm']) if (v.bytes[ext] > VIDEO_LIMIT) over.push(`video/${name}.${ext} ${(v.bytes[ext] / KB).toFixed(0)} kB > ${VIDEO_LIMIT / KB} kB`);
  if (v.bytes.poster > POSTER_LIMIT) over.push(`video/${name}.jpg ${(v.bytes.poster / KB).toFixed(0)} kB > ${POSTER_LIMIT / KB} kB`);
  if (v.seconds < 8 || v.seconds > 14) over.push(`video/${name} is ${v.seconds} s (8 to 14 s wanted)`);
}
const total = files.reduce((n, f) => n + fs.statSync(f.file).size, 0);
console.log(`${files.length} photo files, ${(total / 1048576).toFixed(1)} MB`);
if (over.length) { console.error(`over budget:\n  ${over.join('\n  ')}`); process.exit(1); }
