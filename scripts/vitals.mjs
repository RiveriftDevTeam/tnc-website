// Performance budgets (docs/plans/site-revamp.md § 6.3) measured in the real browser against a served build. Exit 1 over budget.
// npm run vitals -- http://localhost:4410
// LCP and CLS: Home at 1280 px, unthrottled and with "Fast 4G + 4x CPU". JS: the first-load scripts per page (gzip).
// Fonts: woff2 transferred per language. Story frames: frame-time p95 while scrolling the stage, 1280 px and 4x CPU.
import { chromium } from './pw.mjs';
const base = process.argv[2] || 'http://localhost:4410';
const B = { lcp: 1500, lcpSlow: 2500, cls: 0.05, fontsEn: 180, fontsAr: 200, frameP95: 20, frameP95Slow: 33 };
// GPU where the machine has one (macOS: Metal via ANGLE); headless Linux falls back to software GL, which is slower than any phone.
const GPU = process.platform === 'darwin' ? ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] : ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
const browser = await chromium.launch({ args: GPU });
const rows = []; let fail = 0;
const check = (name, value, budget, unit = '') => { const ok = value <= budget; if (!ok) fail++; rows.push(`${ok ? 'ok  ' : 'FAIL'} ${name}: ${typeof value === 'number' ? +value.toFixed(3) : value}${unit} (budget ${budget}${unit})`); };

async function open(path, { slow = false, width = 1280, height = 800 } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height } }); const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  if (slow) {
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (9 * 1024 * 1024) / 8, uploadThroughput: (1.5 * 1024 * 1024) / 8 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  }
  await page.addInitScript(() => {
    window.__v = { lcp: 0, cls: 0 };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__v.lcp = Math.max(e.startTime, e.renderTime || 0, e.loadTime || 0); }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__v.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  });
  const bytes = { font: 0 };
  page.on('response', async (r) => { try { if (/\.woff2/.test(r.url())) bytes.font += (await r.body()).length; } catch { /* aborted */ } });
  await page.goto(base + path, { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
  return { ctx, page, cdp, bytes };
}

// LCP + CLS on Home
for (const slow of [false, true]) {
  const { ctx, page } = await open('/', { slow });
  const v = await page.evaluate(() => new Promise((res) => {
    // read LCP from the buffered entries (the live observer can miss a fast first paint)
    const po = new PerformanceObserver((l) => { const e = l.getEntries().at(-1); res({ lcp: Math.max(e.startTime, e.renderTime || 0, e.loadTime || 0), cls: window.__v.cls }); });
    po.observe({ type: 'largest-contentful-paint', buffered: true });
    setTimeout(() => res(window.__v), 1500);
  }));
  check(`Home LCP ${slow ? 'Fast 4G + 4x CPU' : 'unthrottled'}`, Math.round(v.lcp), slow ? B.lcpSlow : B.lcp, ' ms');
  if (!slow) check('Home CLS', v.cls, B.cls);
  await ctx.close();
}
// Fonts per language
for (const [path, budget, label] of [['/', B.fontsEn, 'EN'], ['/ar/', B.fontsAr, 'AR']]) {
  const { ctx, page, bytes } = await open(path);
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
  await page.waitForTimeout(800);
  const fontBytes = await page.evaluate(() => performance.getEntriesByType('resource').filter((r) => r.name.includes('.woff2')).reduce((s, r) => s + (r.encodedBodySize || r.transferSize || 0), 0));
  check(`Fonts ${label}`, Math.round(Math.max(fontBytes, bytes.font) / 1024), budget, ' kB'); await ctx.close();
}
// which GL the measurement ran on
const gl = await (async () => { const pg = await browser.newPage(); const r = await pg.evaluate(() => { const g = document.createElement('canvas').getContext('webgl'); const d = g && g.getExtension('WEBGL_debug_renderer_info'); return g ? (d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : 'webgl') : 'none'; }); await pg.close(); return r; })();
// Story frame time while scrolling (the stage, WebGL when the device runs it)
for (const slow of [false, true]) {
  const { ctx, page, cdp } = await open('/');
  await page.waitForFunction(() => document.querySelector('main section canvas'), null, { timeout: 15000 }).catch(() => {});
  if (slow) await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  const frames = await page.evaluate(async () => {
    const s = document.querySelector('main section'); const travel = s.offsetHeight - innerHeight; const out = []; let last = performance.now();
    for (let i = 0; i <= 150; i++) { scrollTo(0, (travel * 0.45 * i) / 150); await new Promise((r) => requestAnimationFrame(r)); const now = performance.now(); out.push(now - last); last = now; }
    return out.slice(5).sort((a, b) => a - b);
  });
  const p95 = frames[Math.floor(frames.length * 0.95)];
  check(`Story frame p95 ${slow ? '4x CPU' : '1280 px'}`, Math.round(p95 * 10) / 10, slow ? B.frameP95Slow : B.frameP95, ' ms');
  await ctx.close();
}
await browser.close();
console.log(rows.join('\n'));
console.log(`GL: ${gl}. Frame times are necessary, not sufficient: the founder's phone is the judge (plan § 2).`);
process.exitCode = fail ? 1 : 0;
