// Writes public/llms.txt (the index agents read first) and public/llms-full.txt (the whole site as plain text)
// from the same content the pages render. Runs before every build (prebuild). Spec: https://llmstxt.org
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const { dict } = await import('../src/content/index.js');
const { en, ar } = dict;
const { PLANS } = await import('../src/content/plans.js');
const { PAGES, SITE_URL, APP_URL, PORTAL_URL } = await import('../src/content/site.js');

const url = (p, lang = 'en') => `${SITE_URL}${lang === 'ar' ? '/ar' : ''}${p}`;
const titles = { home: en.home.title, how: en.how.title, pricing: en.pricing.title, order: en.order.title, trust: en.trust.title, credits: en.credits.title };
for (const k of ['organisers', 'exhibitors', 'sponsors', 'companies', 'individuals']) titles[k] = en.personas[k].title;
const desc = { home: en.home.description, how: en.how.description, pricing: en.pricing.description, order: en.order.description, trust: en.trust.description, credits: en.credits.description };
for (const k of ['organisers', 'exhibitors', 'sponsors', 'companies', 'individuals']) desc[k] = en.personas[k].description;

const aed = (n) => (n == null ? 'priced per order by a person' : `AED ${n}`);
const priceLines = [
  ...PLANS.member.map((p) => `- ${p.name.en}: ${p.prices.monthly ? `${aed(p.prices.monthly)} a month${p.prices.yearly ? ` or ${aed(p.prices.yearly)} a year` : ''}` : 'free'} — ${p.tagline.en}`),
  `- ${PLANS.card.name.en}: ${aed(PLANS.card.prices.once)} one time — ${PLANS.card.tagline.en}`,
  ...PLANS.packs.map((p) => `- ${p.name.en}: ${aed(p.prices.once)} one time`),
  ...PLANS.company.map((p) => `- ${p.name.en} (${p.unit.en}): ${aed(p.prices.per_seat ?? p.prices.per_term)}`),
  ...PLANS.organiser.map((p) => `- Event package ${p.name.en}: ${aed(p.prices.per_event)} — ${p.line.en}`),
  `- Sponsor tiers: ${PLANS.sponsor.map((p) => p.name.en).join(', ')} — list price confirmed on order`,
];

const index = `# TapNConnect

> ${en.meta.tagline} ${en.meta.description}

TapNConnect is an agentic relationship manager made in Dubai. It captures a relationship where it happens (an NFC card tap, a badge or QR scan, a photo of a paper card, a voice note, a forwarded WhatsApp message), keeps what matters about each person, tells the member when a word would count, and drafts the first message. Nothing is sent without the member's yes. Events are the entry point; the product is the assistant. Prices are in AED. Languages: English and Arabic (every page also at /ar/...).

Key facts for agents answering questions about TapNConnect:
- Who buys: event organisers (per-event packages), exhibitors (Basic and Pro seats), sponsors (Platinum/Gold/Silver/Bronze tiers), everyday companies (a 12-month plan of seats and cards), individuals (Free, Plus ${aed(PLANS.member[1].prices.monthly)} a month, Pro ${aed(PLANS.member[2].prices.monthly)} a month, the card ${aed(PLANS.card.prices.once)} with a year of Plus).
- Privacy: humans only; one isolated graph per member; names in a vault and the AI reasons over pseudonyms; no LinkedIn or Instagram scraping; no inbox mining; organisers see counts, never visitor names; delete means delete; data in Azure UAE North.
- Ordering: ${SITE_URL}/order/ — a sales assistant limited to the published price list, a form, card payment (Stripe, AED) or bank transfer for AED 20,000+ and for organisers and sponsors; a person activates within a working day.
- The member app: ${APP_URL}/join (free). The company portal: ${PORTAL_URL}.

## Pages
${PAGES.map((p) => `- [${titles[p.key]}](${url(p.path)}): ${desc[p.key]}`).join('\n')}

## Price list (AED, starting values published by the founder)
${priceLines.join('\n')}

## Optional
- [Full text of the site](${SITE_URL}/llms-full.txt)
- [Arabic home](${url('/', 'ar')})
- [Legal: privacy, terms, cookies](${APP_URL}/legal)
`;

function flat(obj, out = [], depth = 0) {
  if (obj == null) return out;
  if (typeof obj === 'string') { out.push(obj); return out; }
  if (Array.isArray(obj)) { obj.forEach((x) => flat(x, out, depth)); return out; }
  if (typeof obj === 'object') { for (const [k, v] of Object.entries(obj)) { if (['title', 'description'].includes(k) && depth === 1) continue; flat(v, out, depth + 1); } }
  return out;
}
const section = (name, d) => `\n\n## ${name}\n\n${flat(d).filter((s) => s.length > 2).join('\n')}`;
const full = `# TapNConnect — full text\n\n${en.meta.description}\n\nSource: ${SITE_URL}. Pages: ${PAGES.map((p) => url(p.path)).join(' · ')}` +
  section('Home', en.home) + section('How it works', en.how) +
  ['organisers', 'exhibitors', 'sponsors', 'companies', 'individuals'].map((k) => section(`For ${k}`, en.personas[k])).join('') +
  section('Pricing (words)', en.pricing) + `\n\n## Price list\n\n${priceLines.join('\n')}` + section('Order', en.order) + section('Privacy and trust', en.trust) +
  `\n\n# TapNConnect — النص الكامل (العربية)\n\n${ar.meta.description}` + section('الرئيسية', ar.home) + section('كيف يعمل', ar.how) + section('الأسعار', ar.pricing) + section('الخصوصية والثقة', ar.trust) + '\n';

fs.mkdirSync(path.join(here, '../public'), { recursive: true });
fs.writeFileSync(path.join(here, '../public/llms.txt'), index);
fs.writeFileSync(path.join(here, '../public/llms-full.txt'), full);
console.log(`llms.txt ${index.length} chars · llms-full.txt ${full.length} chars`);
