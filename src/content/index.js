import en from './en.js';
import ar from './ar.js';
import * as homeEn from './pages/home.en.js';
import * as homeAr from './pages/home.ar.js';
import * as howEn from './pages/how.en.js';
import * as howAr from './pages/how.ar.js';
import * as personasEn from './pages/personas.en.js';
import * as personasAr from './pages/personas.ar.js';
import * as pricingEn from './pages/pricing.en.js';
import * as pricingAr from './pages/pricing.ar.js';
import * as orderEn from './pages/order.en.js';
import * as orderAr from './pages/order.ar.js';
import * as trustEn from './pages/trust.en.js';
import * as trustAr from './pages/trust.ar.js';
import * as creditsEn from './pages/credits.en.js';
import * as creditsAr from './pages/credits.ar.js';
export { fill } from './fill.js';

function merge(base, extra) {
  const out = { ...base };
  for (const [k, v] of Object.entries(extra)) out[k] = v && typeof v === 'object' && !Array.isArray(v) && base[k] && typeof base[k] === 'object' ? merge(base[k], v) : v;
  return out;
}
// Each page module has a default export (its copy) and an optional `story` export merged over it.
const pages = (...mods) => mods.reduce((acc, m) => merge(acc, m.story ? merge(m.default, m.story) : m.default), {});
export const dict = {
  en: merge(en, pages(homeEn, howEn, personasEn, pricingEn, orderEn, trustEn, creditsEn)),
  ar: merge(ar, pages(homeAr, howAr, personasAr, pricingAr, orderAr, trustAr, creditsAr)),
};
export function t(lang) { return dict[lang] || dict.en; }
