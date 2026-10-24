// How heavy is a page? Bytes over the wire for the home page, before and after the 3D scene arrives.
import { chromium } from './pw.mjs';
const base = process.argv[2] || 'http://localhost:4410';
const browser = await chromium.launch();
for (const p of ['/', '/pricing/', '/order/']) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }); const page = await ctx.newPage();
  const sizes = new Map(); page.on('response', async (r) => { try { const b = await r.body(); sizes.set(r.url(), (sizes.get(r.url()) || 0) + b.length); } catch {} });
  const t0 = Date.now(); await page.goto(base + p, { waitUntil: 'load' }); const load = Date.now() - t0;
  const firstLoad = [...sizes.values()].reduce((a, b) => a + b, 0);
  await page.waitForTimeout(3000);
  const total = [...sizes.values()].reduce((a, b) => a + b, 0);
  const three = [...sizes.entries()].filter(([u]) => /chunks\/\d+/.test(u)).sort((a, b) => b[1] - a[1])[0];
  console.log(`${p}  load ${load} ms · ${(firstLoad / 1024).toFixed(0)} KB at load · ${(total / 1024).toFixed(0)} KB after 3 s (uncompressed; largest lazy chunk ${three ? (three[1] / 1024).toFixed(0) + ' KB' : '-'})`);
  await ctx.close();
}
await browser.close();
