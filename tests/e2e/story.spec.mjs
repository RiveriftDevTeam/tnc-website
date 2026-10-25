// The Home story (docs/plans/site-revamp.md § 5, Amendment A1): every act's words are in the server HTML, and the story
// still tells itself without motion or WebGL (stills), with no console errors.
import { test, expect } from './fixtures.mjs';
import { dict } from '../../src/content/index.js';

for (const lang of ['en', 'ar']) {
  const path = lang === 'ar' ? '/ar/' : '/';
  const acts = dict[lang].home.acts;
  test(`${lang}: all ${acts.length} acts are in the server HTML, act 1 is the h1`, async ({ page }) => {
    const html = await (await page.request.get(path)).text();
    for (const a of acts) expect(html).toContain(a.h.replace(/&/g, '&amp;').replace(/'/g, '&#x27;'));
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(acts[0].h);
  });
}

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('acts stack with their stills, no canvas', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main canvas')).toHaveCount(0);
    const stills = page.locator('main picture img[src*="/media/story/"]');
    await expect(stills).toHaveCount(dict.en.home.acts.length);
    for (const img of await stills.all()) { await img.scrollIntoViewIfNeeded(); await expect.poll(() => img.evaluate((i) => i.naturalWidth)).toBeGreaterThan(0); }
  });
});

test('without WebGL the stage cross-fades stills instead', async ({ page }) => {
  await page.addInitScript(() => { HTMLCanvasElement.prototype.getContext = () => null; delete window.WebGLRenderingContext; });
  await page.goto('/');
  await page.waitForTimeout(1500);
  await expect(page.locator('main canvas')).toHaveCount(0);
  await expect(page.locator('main picture img[src*="/media/story/act-1-"]').first()).toBeVisible();
});

test('"Skip the story" lands on what everyone gains', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: dict.en.home.skip }).click();
  await expect(page).toHaveURL(/#who$/);
  await expect(page.getByRole('heading', { name: dict.en.home.gains.h2 })).toBeInViewport();
});
