// Visual + console check of the static build: every page, both languages, phone and desktop, light and dark.
// Fails (exit 1) on any console error or page error. Screenshots go to the folder given as argv[2] (default .shots).
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from './pw.mjs';
const base = process.argv[2] || 'http://localhost:4410';
const outDir = process.argv[3] || '.shots';
fs.mkdirSync(outDir, { recursive: true });
const paths = ['/', '/how-it-works/', '/for/organisers/', '/for/exhibitors/', '/for/sponsors/', '/for/companies/', '/for/individuals/', '/pricing/', '/order/', '/trust/', '/credits/', '/nope/'];
const all = paths.flatMap((p) => [p, '/ar' + p]);
const browser = await chromium.launch();
let failures = 0; const rows = [];
for (const [vw, name] of [[1280, 'desktop'], [390, 'phone']]) for (const scheme of ['light', 'dark']) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vw === 390 ? 844 : 900 }, colorScheme: scheme, deviceScaleFactor: 1, isMobile: vw === 390, hasTouch: vw === 390 });
  for (const p of all) {
    const page = await ctx.newPage(); const errors = [];
    page.on('console', (m) => { if (m.type() === 'error' && !(p.includes('/nope/') && /404/.test(m.text()))) errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    const res = await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(vw === 1280 && (p === '/' || p === '/ar/') ? 2500 : 400);
    await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('in')));
    await page.waitForTimeout(500);
    const status = res?.status();
    const horizontal = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    const canvas = await page.locator('canvas').count();
    const h1 = await page.locator('h1').count();
    const ld = await page.locator('script[type="application/ld+json"]').count();
    const file = `${name}-${scheme}${p.replace(/\//g, '_') || '_'}.png`;
    if (vw === 1280 ? scheme === 'light' : scheme === 'dark') await page.screenshot({ path: path.join(outDir, file), fullPage: true });
    const bad = errors.length || horizontal || (p !== '/nope/' && p !== '/ar/nope/' && status !== 200) || (p.includes('/nope/') ? h1 !== 2 : h1 !== 1);
    if (bad) failures++;
    rows.push({ p, name, scheme, status, h1, ld, canvas, horizontal, errors });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
for (const r of rows) console.log(`${r.horizontal ? 'HSCROLL ' : ''}${r.errors.length ? 'ERR ' : ''}${r.name}/${r.scheme} ${r.status} h1=${r.h1} ld=${r.ld} canvas=${r.canvas} ${r.p}${r.errors.length ? '\n   ' + r.errors.join('\n   ') : ''}`);
console.log(failures ? `\n${failures} page(s) with problems` : '\nall pages clean');
process.exit(failures ? 1 : 0);
