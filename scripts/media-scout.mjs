// Media scouting through the official Unsplash and Pexels APIs (free keys; GitHub secrets UNSPLASH_ACCESS_KEY and
// PEXELS_API_KEY). Run by .github/workflows/media-scout.yml because the build sandbox cannot reach those sites.
// For each query it saves small thumbnails plus an index (id, description, author, source page) into scout/, so a
// person (or the agent, after a git pull) can look and pick. Nothing here is published.
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'scout'; fs.mkdirSync(OUT, { recursive: true });
const U_KEY = process.env.UNSPLASH_ACCESS_KEY, P_KEY = process.env.PEXELS_API_KEY;
const UNSPLASH = ['trade show hall', 'exhibition hall visitors', 'expo crowd aisle', 'exhibition booth conversation', 'networking event business', 'conference attendees lanyard', 'exhibition dubai', 'trade fair stand'];
const PEXELS_VIDEO = ['trade show', 'exhibition hall', 'expo visitors', 'networking event', 'business conference crowd', 'convention center'];
const index = { unsplash: [], pexels_videos: [] };
const save = async (url, file, headers = {}) => { const r = await fetch(url, { headers }); if (!r.ok) throw new Error(`${r.status} ${url}`); fs.writeFileSync(file, Buffer.from(await r.arrayBuffer())); };

if (!U_KEY) console.log('UNSPLASH_ACCESS_KEY missing: skipping photos');
for (const q of U_KEY ? UNSPLASH : []) {
  try {
    const r = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=24&orientation=landscape&content_filter=high`, { headers: { Authorization: `Client-ID ${U_KEY}`, 'Accept-Version': 'v1' } });
    if (!r.ok) { console.log('unsplash', q, r.status, (await r.text()).slice(0, 120)); continue; }
    const j = await r.json();
    for (const p of j.results || []) {
      const file = path.join(OUT, `u-${p.id}.jpg`);
      if (!fs.existsSync(file)) await save(`${p.urls.raw}&w=480&q=60&fm=jpg&fit=crop`, file).catch((e) => console.log(e.message));
      index.unsplash.push({ id: p.id, q, alt: p.alt_description || p.description || '', author: p.user?.name, author_url: p.user?.links?.html, page: p.links?.html, w: p.width, h: p.height, thumb: path.basename(file) });
    }
    console.log('unsplash', q, (j.results || []).length);
  } catch (e) { console.log('unsplash', q, e.message); }
}
if (!P_KEY) console.log('PEXELS_API_KEY missing: skipping videos');
for (const q of P_KEY ? PEXELS_VIDEO : []) {
  try {
    const r = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=24&orientation=landscape&size=medium`, { headers: { Authorization: P_KEY } });
    if (!r.ok) { console.log('pexels', q, r.status, (await r.text()).slice(0, 120)); continue; }
    const j = await r.json();
    for (const v of j.videos || []) {
      const file = path.join(OUT, `p-${v.id}.jpg`);
      if (!fs.existsSync(file)) await save(`${v.image}?auto=compress&cs=tinysrgb&w=480`, file).catch((e) => console.log(e.message));
      const hd = (v.video_files || []).filter((f) => f.file_type === 'video/mp4' && f.width <= 1920).sort((a, b) => b.width - a.width)[0];
      index.pexels_videos.push({ id: v.id, q, page: v.url, title: (v.url.match(/\/video\/([^/]+)-\d+\/?$/) || [, ''])[1].replace(/-/g, ' '), duration: v.duration, author: v.user?.name, w: hd?.width, h: hd?.height, thumb: path.basename(file) });
    }
    console.log('pexels', q, (j.videos || []).length);
  } catch (e) { console.log('pexels', q, e.message); }
}
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 2));
const card = (x, kind) => `<figure><img src="${x.thumb}" loading="lazy"><figcaption><b>${kind} ${x.id}</b> · ${x.q}${x.duration ? ` · ${x.duration}s` : ''}<br>${(x.alt || x.title || '').slice(0, 90)}<br><small>${x.author || ''}</small></figcaption></figure>`;
fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html><meta charset="utf-8"><title>media scout</title><style>body{font-family:system-ui;margin:16px}figure{display:inline-block;width:240px;margin:6px;vertical-align:top}img{width:240px;height:160px;object-fit:cover;border-radius:8px}figcaption{font-size:12px}</style><h1>Unsplash photos</h1>${index.unsplash.map((x) => card(x, 'u')).join('')}<h1>Pexels videos</h1>${index.pexels_videos.map((x) => card(x, 'p')).join('')}`);
console.log(`scout: ${index.unsplash.length} photos, ${index.pexels_videos.length} videos`);
