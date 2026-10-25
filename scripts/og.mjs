// Social images (1200x630) in the Kept Thread world, rendered on the served build so the real fonts and tokens are used:
// the page's headline beside the "your circles" still from the story. Run after a build: npm run og -- http://localhost:4410
// Writes public/og.png (Home, English) and public/og/<page>-<lang>.png for Home and the five buyer pages. Rebuild afterwards.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from './pw.mjs';
import { dict } from '../src/content/index.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const base = process.argv[2] || 'http://localhost:4410';
const outDir = path.join(here, '../public/og'); fs.mkdirSync(outDir, { recursive: true });
const PAGES = ['home', 'organisers', 'exhibitors', 'sponsors', 'companies', 'individuals'];
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const browser = await chromium.launch();
for (const lang of ['en', 'ar']) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(`${base}${lang === 'ar' ? '/ar/' : '/'}`, { waitUntil: 'networkidle' }); // the page's fonts and tokens
  for (const key of PAGES) {
    const d = dict[lang];
    const h1 = key === 'home' ? d.home.acts[0].h : d.personas[key].hero.h1;
    const line = key === 'home' ? d.home.acts[4].h : d.home.gains.items[key].title;
    const still = `${base}/media/story/act-6-${lang}-dark.webp`;
    await page.evaluate(({ h1, line, still, ar }) => {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.innerHTML = `
        <div style="position:fixed;inset:0;background:var(--tnc-site-field);color:var(--tnc-site-field-ink);overflow:hidden;font-family:var(--font-geist-sans),var(--font-arabic)">
          <img src="${still}" style="position:absolute;${ar ? 'left' : 'right'}:-260px;top:-150px;width:1300px;height:auto;${ar ? 'transform:scaleX(-1);' : ''}opacity:.95">
          <div style="position:absolute;inset:0;background:linear-gradient(${ar ? '270deg' : '90deg'},var(--tnc-site-field) 38%,transparent 78%)"></div>
          <div dir="${ar ? 'rtl' : 'ltr'}" style="position:absolute;inset:0;padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between">
            <div style="display:flex;align-items:center;gap:14px;font-family:var(--display);font-weight:700;font-size:30px">
              <svg width="40" height="40" viewBox="0 0 32 32"><rect x="1" y="1" width="30" height="30" rx="9" fill="#66D4E0"/><circle cx="16" cy="16" r="4" fill="var(--tnc-site-thread)"/><circle cx="16" cy="16" r="8.5" fill="none" stroke="#04262B" stroke-opacity=".7" stroke-width="1.6"/></svg> TapNConnect
            </div>
            <div style="max-width:640px">
              <div style="font-family:var(--hand);font-size:30px;color:var(--tnc-site-sun)">${line}</div>
              <h1 style="font-family:var(--display);font-weight:700;font-size:${h1.length > 48 ? 54 : 70}px;line-height:${ar ? 1.25 : 1.02};letter-spacing:${ar ? 0 : '-0.03em'};margin:14px 0 0">${h1}</h1>
            </div>
            <div style="display:flex;align-items:center;gap:16px;font-size:22px;opacity:.75"><span style="display:inline-block;width:120px;height:3px;border-radius:3px;background:var(--tnc-site-thread)"></span>tapnconnect.ae</div>
          </div>
        </div>`;
    }, { h1: esc(h1), line: esc(line), still, ar: lang === 'ar' });
    await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
    await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(150);
    const file = path.join(outDir, `${key}-${lang}.png`);
    await page.screenshot({ path: file, type: 'png' });
    if (key === 'home' && lang === 'en') fs.copyFileSync(file, path.join(here, '../public/og.png'));
  }
  await page.close();
}
await browser.close();
console.log(`og.png + ${PAGES.length * 2} images in public/og/`);
