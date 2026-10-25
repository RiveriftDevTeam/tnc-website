// The Order page end to end (port of scripts/flow.mjs): deep-link pre-fill, the scripted conversation, form validation
// (public mailbox refused), the review doors, the honest error when no backend answers, the receipt when one does,
// the individual path, and the Arabic mobile menu. The shared fixture stubs /api/public/* with a 404 (no backend)
// and fails any test that logs a console error.
import { test, expect } from './fixtures.mjs';

const review = (page) => page.getByRole('button', { name: 'Review the order' });

async function fillCompany(page, email) {
  await page.getByLabel('Legal name as on the trade licence').fill('Acme Trading LLC');
  await page.getByLabel('Trade licence number').fill('CN-1234567');
  await page.getByLabel('Emirate').selectOption('Dubai');
  await page.getByLabel('Your name').fill('Sara Ahmed');
  await page.getByLabel('Work e-mail').fill(email);
  await page.getByRole('checkbox').check();
}

// Exhibitor deep link to the review step: kind pre-fill, conversation, empty form, public mailbox, company mailbox.
async function exhibitorToReview(page) {
  await page.goto('/order/?kind=exhibitor');
  await expect(page.getByText(/Which event/i)).toBeVisible();
  await page.getByRole('button', { name: 'No event' }).click();
  await page.getByRole('button', { name: '4', exact: true }).click();
  await expect(page.getByText(/4 Pro seats/)).toBeVisible();
  await review(page).click();
  await review(page).click();
  await expect(page.getByText('Needed').first()).toBeVisible();
  expect(await page.getByText('Needed').count()).toBeGreaterThanOrEqual(4);
  await fillCompany(page, 'sara@gmail.com');
  await review(page).click();
  await expect(page.getByText(/company e-mail/i).first()).toBeVisible();
  await page.getByLabel('Work e-mail').fill('sara@acme.ae');
  await review(page).click();
  await expect(page.getByRole('heading', { name: 'Check before you pay' })).toBeVisible();
}

test('exhibitor: deep link, conversation, validation, and seats without a list price go to a person', async ({ page }) => {
  await exhibitorToReview(page);
  await expect(page.getByRole('button', { name: 'Send the order for a quote' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Pay by card' })).toHaveCount(0);
});

test('no backend answers: the honest error, nothing pretends the order went through', async ({ page }) => {
  await exhibitorToReview(page);
  await page.getByRole('button', { name: 'Send the order for a quote' }).click();
  await expect(page.getByText(/Couldn’t send the order/)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Order received/ })).toHaveCount(0);
});

test('a backend that answers: the receipt carries its reference', async ({ page }) => {
  await page.route(/\/api\/public\/order/, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ order_id: 'x1', reference: 'TNC-TEST-1' }) }));
  await exhibitorToReview(page);
  await page.getByRole('button', { name: 'Send the order for a quote' }).click();
  await expect(page.getByRole('heading', { name: /Order received — TNC-TEST-1/ })).toBeVisible();
});

test('individual: Plus pays by card and the total is AED 39 from the price list', async ({ page }) => {
  await page.goto('/order/?kind=individual&plan=plus');
  await page.getByRole('button', { name: 'Plus', exact: true }).click();
  await review(page).click();
  await page.getByLabel('Your name').fill('Omar');
  await page.getByLabel('Work e-mail').fill('omar@gmail.com');
  await page.getByRole('checkbox').check();
  await review(page).click();
  await expect(page.getByRole('button', { name: 'Pay by card' })).toBeVisible();
  await expect(page.getByTestId('order-total')).toHaveText(/AED\s?39/);
});

test('Arabic: the mobile menu opens with every destination', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/ar/');
  await page.getByRole('button', { name: /القائمة/ }).click();
  await expect(page.locator('#mobile-menu a').first()).toBeVisible();
  expect(await page.locator('#mobile-menu a').count()).toBeGreaterThan(8);
});

test('Arabic order page: RTL, one h1, no horizontal scroll', async ({ page }) => {
  await page.goto('/ar/order/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)).toBe(false);
});
