// Downloads the media the site uses (src/content/media.js) into public/media/ through the official APIs and writes
// public/media/CREDITS.md. Run by .github/workflows/media.yml with the free keys UNSPLASH_ACCESS_KEY and
// PEXELS_API_KEY (the build sandbox cannot reach those sites); the files are committed, so the site build never
// depends on a third party. Unsplash API guideline: fetch the photo, hit its download_location, credit the
// photographer with a link. Pexels: free for commercial use, credit appreciated.
import fs from 'node:fs';
import path from 'node:path';
const { MEDIA } = await import('../src/content/media.js');
const OUT = 'public/media'; fs.mkdirSync(OUT, { recursive: true });
const U_KEY = process.env.UNSPLASH_ACCESS_KEY, P_KEY = process.env.PEXELS_API_KEY;
async function save(url, file, headers = {}) {
  const r = await fetch(url, { headers, redirect: 'follow' }); if (!r.ok) throw new Error(`${r.status} ${url}`);
  fs.writeFileSync(file, Buffer.from(await r.arrayBuffer())); return fs.statSync(file).size;
}
const credits = ['# Media credits', '', 'Photos from Unsplash (https://unsplash.com/license) and video from Pexels (https://www.pexels.com/license/). Free to use; credited with thanks.', ''];
for (const [key, m] of Object.entries(MEDIA)) {
  try {
    if (m.unsplash && U_KEY) {
      const r = await fetch(`https://api.unsplash.com/photos/${m.unsplash}`, { headers: { Authorization: `Client-ID ${U_KEY}`, 'Accept-Version': 'v1' } });
      if (!r.ok) throw new Error(`unsplash ${r.status}`);
      const p = await r.json();
      const big = path.join(OUT, `${key}-1920.jpg`), small = path.join(OUT, `${key}-960.jpg`);
      if (!fs.existsSync(big)) { console.log(key, 'big', await save(`${p.urls.raw}&w=1920&q=78&fm=jpg&fit=max`, big)); await fetch(p.links.download_location, { headers: { Authorization: `Client-ID ${U_KEY}` } }).catch(() => {}); }
      if (!fs.existsSync(small)) console.log(key, 'small', await save(`${p.urls.raw}&w=960&q=72&fm=jpg&fit=max`, small));
      credits.push(`- \`${key}\`: photo by [${p.user.name}](${p.user.links.html}?utm_source=tapnconnect&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=tapnconnect&utm_medium=referral) — ${p.links.html}`);
    }
    if (m.pexels && P_KEY) {
      const r = await fetch(`https://api.pexels.com/videos/videos/${m.pexels}`, { headers: { Authorization: P_KEY } });
      if (!r.ok) throw new Error(`pexels ${r.status}`);
      const v = await r.json();
      // the smallest file that is at least 1280 wide keeps the hero loop light
      const f = (v.video_files || []).filter((x) => x.file_type === 'video/mp4' && x.width >= 1280).sort((a, b) => a.width - b.width)[0] || v.video_files[0];
      const file = path.join(OUT, `${key}.mp4`);
      if (!fs.existsSync(file)) console.log(key, 'video', f.width, 'x', f.height, await save(f.link, file));
      credits.push(`- \`${key}\`: video by [${v.user.name}](${v.user.url}) on [Pexels](https://www.pexels.com) — ${v.url}`);
    }
  } catch (e) { console.log(key, 'FAILED', e.message); }
}
fs.writeFileSync(path.join(OUT, 'CREDITS.md'), credits.join('\n') + '\n');
console.log('done');
