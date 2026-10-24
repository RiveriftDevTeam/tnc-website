// Drives the Order page end to end in a real browser against a served build (npm run flow -- http://localhost:4410 <shots dir>).
// Checks: deep-link prefill, the scripted conversation, form validation (public mailbox refused), the review doors,
// the honest error when no backend answers, the individual path, and the Arabic mobile menu. Exit 1 on any page error.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from './pw.mjs';
const base = process.argv[2] || 'http://localhost:4410';
const S = process.argv[3] || '.shots';
fs.mkdirSync(S, { recursive: true });
const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
const errors = []; page.on('pageerror', (e) => errors.push(String(e))); page.on('console', (m) => { if (m.type() === 'error' && !/api\/public\/order|ERR_TUNNEL|ERR_NAME_NOT_RESOLVED|ERR_CONNECTION|Failed to fetch/.test(m.text())) errors.push(m.text()); });
const ok = (cond, msg) => { console.log(`${cond ? 'ok ' : 'FAIL'} ${msg}`); if (!cond) errors.push(msg); };

await page.goto(`${base}/order/?kind=exhibitor`, { waitUntil: 'networkidle' });
ok(/event/i.test(await page.locator('.glass p.text-xl').first().innerText()), 'deep link ?kind=exhibitor skips to the event question');
await page.getByRole('button', { name: 'No event' }).click();
await page.getByRole('button', { name: '4', exact: true }).click();
const answer = await page.locator('.arrive p').last().innerText();
ok(/4 Pro seats/.test(answer), `assistant recommends from the list: "${answer.slice(0, 70)}…"`);
await page.screenshot({ path: path.join(S, 'flow-1-answer.png') });
await page.getByRole('button', { name: 'Review the order' }).click(); await page.waitForTimeout(300);
await page.getByRole('button', { name: 'Review the order' }).click(); await page.waitForTimeout(300);
ok((await page.locator('.text-critical').count()) >= 4, 'empty form shows the needed fields');
await page.getByLabel('Legal name as on the trade licence').fill('Acme Trading LLC');
await page.getByLabel('Trade licence number').fill('CN-1234567');
await page.getByLabel('Emirate').selectOption('Dubai');
await page.getByLabel('Your name').fill('Sara Ahmed');
await page.getByLabel('Work e-mail').fill('sara@gmail.com');
await page.getByRole('checkbox').check();
await page.getByRole('button', { name: 'Review the order' }).click(); await page.waitForTimeout(300);
ok(/company e-mail/.test(await page.locator('.text-critical').first().innerText()), 'public mailbox refused for a company order');
await page.getByLabel('Work e-mail').fill('sara@acme.ae');
await page.screenshot({ path: path.join(S, 'flow-2-form.png'), fullPage: true });
await page.getByRole('button', { name: 'Review the order' }).click(); await page.waitForTimeout(400);
const doors = await page.locator('.glass button.btn-primary, .glass button.btn-tonal').allInnerTexts();
ok(doors.includes('Send the order for a quote') && !doors.includes('Pay by card'), `seats without a list price go to a person: ${doors.join(' · ')}`);
await page.screenshot({ path: path.join(S, 'flow-3-review.png'), fullPage: true });
await page.getByRole('button', { name: 'Send the order for a quote' }).click(); await page.waitForTimeout(1500);
const after = (await page.locator('.text-critical').allInnerTexts()).join(' ');
ok(/Couldn’t send the order|Order received/.test(after + (await page.locator('h2').allInnerTexts()).join(' ')), 'submit without a backend shows the honest error (or the receipt when one answers)');

await page.goto(`${base}/order/?kind=individual&plan=plus`, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Plus', exact: true }).click(); await page.getByRole('button', { name: 'Review the order' }).click(); await page.waitForTimeout(300);
await page.getByLabel('Your name').fill('Omar'); await page.getByLabel('Work e-mail').fill('omar@gmail.com'); await page.getByRole('checkbox').check();
await page.getByRole('button', { name: 'Review the order' }).click(); await page.waitForTimeout(400);
const doors2 = await page.locator('.glass button.btn-primary, .glass button.btn-tonal').allInnerTexts();
ok(doors2.includes('Pay by card'), `individual Plus pays by card: ${doors2.join(' · ')}`);
ok(/AED 39/.test(await page.locator('.num').last().innerText()), 'total AED 39 from the price list');

const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
await m.goto(`${base}/ar/`, { waitUntil: 'networkidle' }); await m.getByRole('button', { name: /القائمة/ }).click(); await m.waitForTimeout(300);
ok((await m.locator('#mobile-menu a').count()) > 8, 'Arabic mobile menu opens with every destination');
await m.screenshot({ path: path.join(S, 'flow-4-ar-menu.png') });
await browser.close();
console.log(errors.length ? `\n${errors.length} problem(s):\n${errors.join('\n')}` : '\nflow clean');
process.exit(errors.length ? 1 : 0);
