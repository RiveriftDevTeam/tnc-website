// Every English key has an Arabic twin of the same shape (arrays the same length).
import test from 'node:test';
import assert from 'node:assert/strict';
import en from '../src/content/en.js';
import ar from '../src/content/ar.js';
function walk(a, b, path = '') {
  if (Array.isArray(a)) { assert.ok(Array.isArray(b), `${path} should be an array in ar`); assert.equal(a.length, b.length, `${path} length`); a.forEach((x, i) => walk(x, b[i], `${path}[${i}]`)); return; }
  if (a && typeof a === 'object') { for (const k of Object.keys(a)) { assert.ok(k in b, `${path}.${k} missing in ar`); walk(a[k], b[k], `${path}.${k}`); } return; }
  assert.equal(typeof a, typeof b, `${path} type`);
}
test('ar mirrors en', () => { walk(en, ar); });
