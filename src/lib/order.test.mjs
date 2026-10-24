import test from 'node:test';
import assert from 'node:assert/strict';
import { priceOrder, paymentOptions, validate, validEmail, emptyOrder, isPublicMailbox } from './order.js';

test('individual Plus is priced from the list, card pays by card', () => {
  const o = { ...emptyOrder('individual'), plan: 'plus' };
  const p = priceOrder(o, 'en');
  assert.equal(p.total, 39); assert.equal(p.perOrder, false);
  assert.deepEqual(paymentOptions(o, p), ['card']);
});
test('seats without a list price go to a person, never a made-up number', () => {
  const o = { ...emptyOrder('exhibitor'), seatsPro: 4, seatsBasic: 2, cards: 10 };
  const p = priceOrder(o, 'en');
  assert.equal(p.total, 0); assert.equal(p.perOrder, true);
  assert.deepEqual(paymentOptions(o, p), ['enquiry']);
  assert.equal(p.lines.length, 3);
});
test('organisers and sponsors always go to a person', () => {
  for (const kind of ['organiser', 'sponsor']) {
    const o = emptyOrder(kind); const p = priceOrder(o, 'ar');
    assert.deepEqual(paymentOptions(o, p), ['enquiry']);
  }
});
test('public mailboxes are refused for company orders', () => {
  assert.equal(isPublicMailbox('x@gmail.com'), true);
  assert.equal(validEmail('x@gmail.com'), 'publicMailbox');
  assert.equal(validEmail('x@acme.ae'), null);
  assert.equal(validEmail('nope'), 'email');
  const o = { ...emptyOrder('exhibitor'), legalName: 'Acme', licence: '1', emirate: 'Dubai', name: 'A', email: 'a@gmail.com', policies: true };
  assert.equal(validate(o).email, 'publicMailbox');
  const ind = { ...emptyOrder('individual'), name: 'A', email: 'a@gmail.com', policies: true };
  assert.deepEqual(validate(ind), {});
});
