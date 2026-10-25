// Screenshots of the landing story at each act, desktop and phone, so the scene can be reviewed frame by frame.
// npm run acts -- http://localhost:4410 .shots
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from './pw.mjs';
const base = process.argv[2] || 'http://localhost:4410';
const S = process.argv[3] || '.shots'; fs.mkdirSync(S, { recursive: true });
const STOPS = [0.0, 0.15, 0.26, 0.31, 0.37, 0.505, 0.635, 0.718, 0.975]; // acts 1, 2, 3 (approach), 3 (thread), 4–8 (ScrollStory ACTS)
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const [vw, vh, name] of [[1280, 800, 'desktop'], [390, 844, 'phone']]) {
  const page = await browser.newPage({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1 });
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('main section canvas'), null, { timeout: 15000 }).catch(() => console.log(`${name}: no canvas (stills mode)`));
  await page.waitForTimeout(1200);
  const total = await page.evaluate(() => { const s = document.querySelector('main section'); return s.offsetHeight - innerHeight; });
  for (const p of STOPS) {
    await page.evaluate((y) => scrollTo(0, y), Math.round(total * p)); await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(S, `act-${name}-${String(p).replace('.', '')}.png`) });
  }
  await page.close();
}
await browser.close(); console.log('acts written to', S);
