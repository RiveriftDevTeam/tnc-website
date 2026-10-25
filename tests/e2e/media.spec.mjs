// Photos (docs/plans/site-revamp.md § 7): every image loads, has alt text (empty only when hidden from assistive tech),
// photos carry a srcset, and no image comes from another origin (the CSP allows only 'self').
import { test, expect } from './fixtures.mjs';

for (const path of ['/', '/for/organisers/', '/how-it-works/', '/pricing/', '/trust/', '/ar/for/individuals/']) {
  test(`images on ${path}`, async ({ page, baseURL }) => {
    test.setTimeout(60000); // Home has a story's worth of photos and stills
    const foreign = [];
    page.on('request', (r) => { if (r.resourceType() === 'image' && !r.url().startsWith(baseURL) && !r.url().startsWith('data:')) foreign.push(r.url()); });
    await page.goto(path);
    // only images this viewport renders (a photo shown on wide screens only is never fetched on a phone)
    for (const img of await page.locator('main img').filter({ visible: true }).all()) { await img.scrollIntoViewIfNeeded(); await expect.poll(() => img.evaluate((i) => i.complete && i.naturalWidth), { timeout: 8000 }).toBeGreaterThan(0); }
    const imgs = await page.locator('main img').evaluateAll((list) => list.filter((i) => i.getClientRects().length).map((i) => ({
      src: i.currentSrc || i.src, w: i.naturalWidth, alt: i.getAttribute('alt'), hidden: i.getAttribute('aria-hidden') === 'true',
      photo: i.src.includes('/media/') && !i.src.includes('/media/story/'), srcset: !!i.parentElement.querySelector('source[srcset]'),
    })));
    expect(imgs.length).toBeGreaterThan(0);
    for (const i of imgs) {
      expect(i.w, `${i.src} loaded`).toBeGreaterThan(0);
      expect(i.alt !== null, `${i.src} has alt`).toBe(true);
      if (i.alt === '') expect(i.hidden, `${i.src}: empty alt only when hidden`).toBe(true);
      if (i.photo) expect(i.srcset, `${i.src} has a srcset`).toBe(true);
    }
    expect(foreign).toEqual([]);
  });
}
