// Shared fixture: a page that logs a console error or throws fails the test. Calls to our backend are stubbed
// (it is another service and not built yet), so the page's own fallback path is what gets exercised.
import { test as base, expect } from '@playwright/test';
export const test = base.extend({
  page: async ({ page }, use) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error' && !/404|api\/public/.test(m.text())) errors.push(m.text()); });
    await page.route(/\/api\/public\//, (route) => route.fulfill({ status: 404, body: '' }));
    await use(page);
    expect(errors, 'console / page errors').toEqual([]);
  },
});
export { expect };
