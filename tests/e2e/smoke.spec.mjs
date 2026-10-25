// Every page in both languages renders, has exactly one h1 and no horizontal scroll.
import { test, expect } from './fixtures.mjs';
const paths = ['/', '/how-it-works/', '/for/organisers/', '/for/exhibitors/', '/for/sponsors/', '/for/companies/', '/for/individuals/', '/pricing/', '/order/', '/trust/'];
for (const p of paths.flatMap((x) => [x, '/ar' + x])) {
  test(`renders ${p}`, async ({ page }) => {
    const res = await page.goto(p);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    if (p.startsWith('/ar')) await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)).toBe(false);
  });
}
