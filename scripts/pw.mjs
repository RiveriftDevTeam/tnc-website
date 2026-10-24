// Shared: find Playwright (the project does not depend on it; the cloud image and the dev VM carry it globally).
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
function load() {
  for (const p of ['playwright', '/opt/node-tools/node_modules/playwright', '/opt/node22/lib/node_modules/playwright', '/usr/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright']) { try { return require(p); } catch { /* next */ } }
  throw new Error('playwright not found: npm i -g playwright');
}
export const { chromium, devices } = load();
