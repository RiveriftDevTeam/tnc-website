// Media scouting, run by GitHub Actions (.github/workflows/media-scout.yml) because the build sandbox cannot reach
// Unsplash or Pexels. For each query it saves small thumbnails plus an index (id, description, author, source page)
// into scout/, so a person (or the agent, after a git pull) can look at them and pick. Nothing here is published.
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'scout'; fs.mkdirSync(OUT, { recursive: true });
const UNSPLASH = ['trade show', 'exhibition hall', 'expo crowd', 'exhibition booth visitors', 'networking event', 'business handshake event', 'conference lanyard badge', 'exhibition dubai'];
const PEXELS_VIDEO = ['trade show', 'exhibition', 'expo', 'networking event', 'business conference crowd', 'handshake event'];
const index = { unsplash: [], pexels_videos: [] };
const ua = { 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) tnc-website-media-scout' };
const save = async (url, file) => { const r = await fetch(url, { headers: ua }); if (!r.ok) throw new Error(`${r.status} ${url}`); fs.writeFileSync(file, Buffer.from(await r.arrayBuffer())); };

for (const q of UNSPLASH) {
  try {
    const r = await fetch(`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(q)}&per_page=24&orientation=landscape`, { headers: ua });
    if (!r.ok) { console.log('unsplash', q, r.status); continue; }
    const j = await r.json();
    for (const p of j.results || []) {
      const file = path.join(OUT, `u-${p.id}.jpg`);
      if (!fs.existsSync(file)) await save(`${p.urls.raw}&w=480&q=60&fm=jpg&fit=crop`, file).catch((e) => console.log(e.message));
      index.unsplash.push({ id: p.id, q, alt: p.alt_description || p.description || '', author: p.user?.name, author_url: p.user?.links?.html, page: p.links?.html, w: p.width, h: p.height, thumb: path.basename(file), download: `https://unsplash.com/photos/${p.id}/download?force=true` });
    }
    console.log('unsplash', q, (j.results || []).length);
  } catch (e) { console.log('unsplash', q, e.message); }
}
for (const q of PEXELS_VIDEO) {
  try {
    const r = await fetch(`https://www.pexels.com/search/videos/${encodeURIComponent(q)}/`, { headers: ua });
    if (!r.ok) { console.log('pexels', q, r.status); continue; }
    const html = await r.text();
    const seen = new Set();
    for (const m of html.matchAll(/https:\/\/images\.pexels\.com\/videos\/(\d+)\/[^"'\s?]+\.(?:jpe?g|png)/g)) {
      const id = m[1]; if (seen.has(id)) continue; seen.add(id);
      const file = path.join(OUT, `p-${id}.jpg`);
      if (!fs.existsSync(file)) await save(`${m[0]}?auto=compress&cs=tinysrgb&w=480`, file).catch((e) => console.log(e.message));
      const titleM = html.match(new RegExp(`href="(/video/[^"]*-${id}/)"[^>]*>`)); const slug = titleM ? titleM[1] : `/video/${id}/`;
      index.pexels_videos.push({ id, q, page: `https://www.pexels.com${slug}`, title: slug.replace(/^\/video\//, '').replace(/-\d+\/$/, '').replace(/-/g, ' '), thumb: path.basename(file), download: `https://www.pexels.com/download/video/${id}/` });
      if (seen.size >= 24) break;
    }
    console.log('pexels', q, seen.size);
  } catch (e) { console.log('pexels', q, e.message); }
}
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 2));
const card = (x, kind) => `<figure><img src="${x.thumb}" loading="lazy"><figcaption><b>${kind} ${x.id}</b> · ${x.q}<br>${(x.alt || x.title || '').slice(0, 90)}<br><small>${x.author || ''}</small></figcaption></figure>`;
fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html><meta charset="utf-8"><title>media scout</title><style>body{font-family:system-ui;margin:16px}figure{display:inline-block;width:240px;margin:6px;vertical-align:top}img{width:240px;height:160px;object-fit:cover;border-radius:8px}figcaption{font-size:12px}</style><h1>Unsplash photos</h1>${index.unsplash.map((x) => card(x, 'u')).join('')}<h1>Pexels videos</h1>${index.pexels_videos.map((x) => card(x, 'p')).join('')}`);
console.log(`scout: ${index.unsplash.length} photos, ${index.pexels_videos.length} videos`);
