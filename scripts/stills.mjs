// Renders the Home story scene to still frames, one per act, for the stills mode, reduced motion and the first paint
// (docs/plans/site-revamp.md § 5.5). Run against a served build: npm run stills -- http://localhost:4410
// Writes public/media/story/act-<n>-<lang>-<theme>[-p].webp (landscape 1600x1000, portrait 800x1400), transparent.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from './pw.mjs';

const base = process.argv[2] || 'http://localhost:4410';
const out = path.join(process.cwd(), 'public', 'media', 'story');
fs.mkdirSync(out, { recursive: true });
const ACT_P = [0.04, 0.15, 0.31, 0.37, 0.505, 0.635, 0.718, 0.975]; // a settled moment inside each act (src/components/ScrollStory.js ACTS)
const SHAPES = [['', 1600, 1000], ['-p', 800, 1400]];

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
let written = 0;
for (const lang of ['en', 'ar']) for (const theme of ['light', 'dark']) for (const [suffix, width, height] of SHAPES) {
  const page = await browser.newPage({ viewport: { width, height }, colorScheme: theme, deviceScaleFactor: 1 });
  const errors = []; page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`${base}${lang === 'ar' ? '/ar/' : '/'}?stills=1`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__story, null, { timeout: 20000 });
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
  for (const [i, p] of ACT_P.entries()) {
    const url = await page.evaluate((p) => window.__story.capture(p), p);
    const png = path.join(out, `act-${i + 1}-${lang}-${theme}${suffix}.png`);
    fs.writeFileSync(png, Buffer.from(url.split(',')[1], 'base64'));
    execFileSync('cwebp', ['-quiet', '-q', '78', '-alpha_q', '85', '-m', '6', png, '-o', png.replace(/\.png$/, '.webp')]);
    fs.unlinkSync(png); written++;
  }
  if (errors.length) { console.error(`${lang}/${theme}${suffix}:`, errors.join('\n')); process.exitCode = 1; }
  await page.close();
}
await browser.close();
const kb = fs.readdirSync(out).reduce((s, f) => s + fs.statSync(path.join(out, f)).size, 0) / 1024;
console.log(`${written} stills -> public/media/story (${Math.round(kb)} kB)`);
