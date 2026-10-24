// Screenshots of the landing story at each act, desktop and phone, so the scene can be reviewed frame by frame.
// npm run acts -- http://localhost:4410 .shots
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from './pw.mjs';
const base = process.argv[2] || 'http://localhost:4410';
const S = process.argv[3] || '.shots'; fs.mkdirSync(S, { recursive: true });
const STOPS = [0.0, 0.14, 0.3, 0.36, 0.5, 0.7, 0.9];
const browser = await chromium.launch();
for (const [vw, vh, name] of [[1280, 800, 'desktop'], [390, 844, 'phone']]) {
  const page = await browser.newPage({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1 });
  await page.goto(`${base}/`, { waitUntil: 'networkidle' }); await page.waitForTimeout(2500);
  const total = await page.evaluate(() => { const s = document.querySelector('section[aria-label]'); return s.offsetHeight - innerHeight; });
  for (const p of STOPS) {
    await page.evaluate((y) => scrollTo(0, y), Math.round(total * p)); await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(S, `act-${name}-${String(p).replace('.', '')}.png`) });
  }
  await page.close();
}
await browser.close(); console.log('acts written to', S);
