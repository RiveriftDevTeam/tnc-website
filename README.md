# TapNConnect product website (`tapnconnect.ae`)

The public website of REQ-002 (`docs/requirements/REQ-002-product-website.md`): the story, how it works, who it is for, the one price list, and the Order page with its sales assistant. Anyone who finds us on the internet lands here; members use the app, companies the portal.

**Status (2026-10-25):** the Kept Thread revamp is built and tested locally on sample price data (branch `feat/site-revamp`); **not deployed** (a Netlify site is a `/ship` row and a founder yes). Home: `github.com/RiveriftDevTeam/tnc-website`.

## Stack (pinned)

Next.js 14.1.3 (App Router, JS) · React 18 · Tailwind 3.4 · `three` 0.186 (the Home story scene, loaded on idle) · `lucide-react` · fonts via next/font, one module per language (`src/fonts/{en,ar}.js`): Bricolage Grotesque / Alexandria (display), Geist / IBM Plex Sans Arabic (reading), Caveat / Aref Ruqaa (handwritten notes only). Node 22. **Static export** (`output: 'export'`): the build is plain HTML, CSS and JS in `out/`; nothing runs on a server, so it is as fast as the CDN. No framer-motion on this site (CSS transitions only); no analytics SDK in the bundle (GTM loads only after a yes).

## Commands

| What | Command |
|---|---|
| Develop | `npm run dev` → http://localhost:4410 |
| Build (writes `public/llms.txt` first, copies `out/404.html` after) | `npm run build` |
| Serve the build | `npm start` |
| Units (order pricing rules, EN/AR key parity) | `npm test` |
| Lint | `npm run lint` |
| Every page, both languages, phone + desktop, light + dark: console errors, horizontal scroll, one h1, structured data | `npm run check -- http://localhost:4410 .shots` |
| The Order page end to end in a browser | `npm run flow -- http://localhost:4410 .shots` |
| The landing story frame by frame, desktop and phone | `npm run acts -- http://localhost:4410 .shots` |
| E2E (smoke on every page, the story, photos, the Order journey) | `npx playwright test` (serves `out/` itself) |
| Fast gate · full gate (unit, lint, build, e2e, gitleaks) | `.claude/verify.sh` · `.claude/verify-full.sh` |
| Performance budgets (LCP, CLS, fonts, story frame time) | `npm run vitals -- http://localhost:4410` |
| Photos (Unsplash, Pexels) and the two video loops into `public/media/` (+ credits) | `npm run media` |
| Story stills (reduced motion, no WebGL, first paint), from a served build | `npm run stills -- http://localhost:4410` then rebuild |
| Social images `public/og.png` + `public/og/<page>-<lang>.png`, from a served build | `npm run og -- http://localhost:4410` then rebuild |

The browser scripts use the project's `@playwright/test` (devDependency) and fall back to a global Playwright (`scripts/pw.mjs`).

## Pages and the journey

English at the root, Arabic under `/ar/…` (RTL, IBM Plex Sans Arabic, Latin digits). Two root layouts (`src/app/(en)`, `src/app/(ar)`), one shell (`src/components/Shell.js`), one copy file per language (`src/content/en.js`, `src/content/ar.js`; `scripts/keys.test.mjs` fails the build if a key is missing in one language).

| Page | Path | Job |
|---|---|---|
| Home | `/` | **the landing story in one WebGL scene scrubbed by scroll** (`ScrollStory` + `StoryCanvas`): the hall full of people → two points of light cross it and touch (one ring) → the hall empties and names grey out → TapNConnect lights the thread and the people you met gather round you; the four buyers as chips on the first screen; then **who it is for** with one product vignette per buyer (`Vignettes`), the loop on one line, the one-year story as a dated timeline (`YearTimeline`), the card in 3D, the numbers, privacy, pricing teaser, the final ask |
| How it works | `/how-it-works/` | before / during / after an event for visitor, exhibitor, organiser; the daily rhythm; six ways to capture; what the assistant may do alone |
| For organisers · exhibitors · sponsors · companies · individuals | `/for/<persona>/` | one page per buyer: the ask, what you get, the journey, packages, questions people ask (FAQ structured data), the order button pre-selecting the kind |
| Pricing | `/pricing/` | three tabs (people · companies and exhibitors · organisers and sponsors) from the one price list |
| Order | `/order/` | the sales assistant → the form → review → pay by card / bank transfer / a person (§ 9.1 of `docs/design/ai-operations-agents-2026-10-09.md`) |
| Privacy and trust | `/trust/` | privacy as a feature, in eight plain sections; links to the legal pages on the member site |
| 404 | `/404/` → `out/404.html` | bilingual |

Every call to action goes to one of three places: **Start free** → `profile.tapnconnect.ae/join`; **Order** → `/order/?kind=…`; **Sign in** → the member site; the portal and legal pages are linked from the footer. Addresses live in `src/content/site.js`, overridable by `NEXT_PUBLIC_*` env names (`.env.example`).

## The price list is one file

`src/content/plans.js` is the only place a price or a "what you get" line exists on this site; it mirrors the shape of `GET /api/public/plans` (E17 § 1.3a, `whatYouGet()`), so connecting is a swap of that module for the live read. Values are the founder's starting values (2026-10-14, D1–D3): Plus AED 39 / 390, Pro AED 99, the card AED 149 with a year of Plus, packs AED 19 / 79, voice top-up AED 9. **Seats, the company plan, event packages and sponsor tiers carry `null`**: the site shows "priced per order" and the Order page sends them to a person, because the site must never invent a number the price list does not hold (sales-agent rule). The home page, the pricing page, the Order page, the sales assistant's answers, the structured data and `llms.txt` all read this file.

## The Order page

`src/components/OrderFlow.js` (UI) + `src/lib/order.js` (pure rules, unit-tested):

1. **The sales assistant** — a scripted conversation (who → which event → how many seats / which tier / which plan → the recommendation), chips for the common answers, a free-text line. It answers only from the price list; a question outside it (discount, integration, invoice, delivery, custom deal) gets "I can't promise that; a person can" and the hand-off. The typed line first posts to the backend Sales agent that E47 O7 built (`POST /api/public/sales { session_id?, turnstile_token, text }` → `{ session_id, reply, chips[], prefill?, handoff? }`, a 404 until `SALES_AGENT_ENABLED=true`); its reply, chips and pre-fill are shown when it answers, and the scripted line answers when it does not.
2. **The form** — pre-filled, every field editable; legal name, licence number and emirate, licence document, website, the admin's name and **work e-mail (public mailboxes refused)**, the policies.
3. **Review and pay** — the total is computed by code from the price list. Card (Stripe Checkout) for priced orders; bank transfer offered at AED 20,000+ and always for organisers and sponsors; anything with a per-order line goes out as an **enquiry** for a person to price.
4. **The receipt** — "Order received — TNC-…; a person checks it within a working day".

**Backend contract the page expects** (not built yet; the admin Orders queue and the Order agent are in `docs/design/ai-operations-agents-2026-10-09.md` § 9.2–9.5):

```
POST {NEXT_PUBLIC_BACKEND_URL}/api/public/order
{ lang, mode: 'card'|'bank'|'enquiry', order: {...form}, lines: [...], total_aed, utm }
→ 200 { order_id, reference: 'TNC-…', checkout_url? }   // checkout_url only for mode 'card'
```

Until it exists the page shows "Couldn't send the order. Write to hello@tapnconnect.ae …" (tested in `scripts/flow.mjs`). The licence file is chosen in the browser but not uploaded until that route accepts multipart or a signed upload URL; Turnstile goes in front of the submit with `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.

## Tracking (`src/lib/analytics.js`)

One door: `track(event, props)` pushes to `window.dataLayer`. Google Tag Manager (`NEXT_PUBLIC_GTM_ID`) loads **only after the visitor says yes** in the footer's one quiet line (Consent Mode v2 defaults denied; the choice is kept in `localStorage`; no banner, no cookie before consent). UTM parameters are kept for the session and sent with an order. Events: `page_view`, `cta_click {label,to,placement}`, `persona_view`, `story_beat`, `pricing_tab`, `plan_select`, `order_start {kind}`, `order_step`, `order_submit {kind,pay,total_aed}`, `order_enquiry`, `lang_switch`, `analytics_consent`. The funnel to read in GA4: `page_view` → `cta_click(placement=hero|pricing-*|persona-*)` → `order_start` → `order_step 2` → `order_submit | order_enquiry`.

## SEO and discoverability by agents

- Per page: title, description, canonical, `hreflang` en / ar / x-default, OpenGraph + Twitter card (`public/og.png`), `robots` max-snippet; `sitemap.xml` with language alternates; `robots.txt` allowing every crawler including the AI ones by name.
- Structured data (JSON-LD, `src/lib/seo.js`): `Organization`, `WebSite`, `WebPage`, `SoftwareApplication` with the member-plan `Offer`s, `Product` for the card, `HowTo` for the loop, `FAQPage` on every persona and pricing page, `BreadcrumbList`.
- **`/llms.txt`** (the index agents read first: what it is, who buys, the price list, every page) and **`/llms-full.txt`** (the whole site as plain text in both languages), generated from the same content on every build (`scripts/llms.mjs`).
- Semantic HTML with one `h1` per page; FAQs are native `details` (no JS); the full text of every page is in the HTML (nothing is injected by script); `prefers-reduced-motion` and `prefers-reduced-transparency` respected; the 3D hero has a CSS first paint and a text alternative.

## Performance

Static HTML; first-load JS ≤ 100 kB on every page (Home 99.8 kB). The 3D scene (three 0.186 ships as two chunks, ~151 kB gzip together) arrives on idle, only when WebGL exists, the device is not low-end and `saveData` is off; it renders only while on screen and hands over to stills if its first frames run slow. Fonts per page ≤ 158 kB (EN and AR, measured). `npm run vitals` checks Home LCP (≤ 1.5 s, ≤ 2.5 s on Fast 4G + 4x CPU), CLS (≤ 0.05), fonts, and story frame time; `npm run check` fails on a console error or a horizontal scrollbar on any page at 390 px or 1280 px. Hashed assets are cached a year (`public/_headers`), with a CSP that allows only Stripe, Turnstile and GTM; every image is served from the site itself.

## Design: "Kept Thread" in Lagoon (2026-10-25, docs/plans/site-revamp.md, Amendments A1–A2)

One turquoise thread runs through the site (Lagoon: sand meets the sea; a fixed shore backdrop with drifting sand and sea-foam particles): the story's progress line, dividers, timelines, link underlines, the knots where people connect, and the 3D tubes between people. Sand ground (a night shore in dark), a deep-sea stage for the story (its buttons sun-on-sand), sun gold for the assistant's pulse, six beach-clay colours for faceless 3D people, paper stickers in a handwritten face for the assistant's notes, calm event photography and two video loops (Unsplash, Pexels; credited on `/credits/`). How it works and the buyer pages tell their journeys as scroll stories (`ScrollScenes`). The petrol accent and every `--tnc-*` token name stay shared with the app; site-only tokens use `--tnc-site-*`. No eyebrows, no glass decoration (the scrolled header only), one filled (coral) control per view.

**The Home story** (`ScrollStory` + `StoryCanvas`, vanilla three, one canvas): eight scroll-scrubbed acts — who it's for (the card turning over the hall) → the hall (clay people rise) → the touch (one thread) → the fade → every tap a thread (a web with introductions) → your circles (four rings: team, friends, mentors, clients) → the right word at the right time (sun pulses run to one person at a time while the assistant's note pins) → everyone's graph (your web among many). The web is one instanced draw call. Every act's words are in the HTML; reduced motion stacks the acts with pre-rendered stills; no WebGL, low-end devices and slow frames cross-fade the stills on the same stage. After the story: **What everyone gains** (visitors, exhibitors, sponsors, organisers, companies: the gain, three outcomes from the buyer pages, the product note, the CTA), the year on the thread, the card, privacy promises, the pricing teaser, the final ask.

## Deploy (when the founder says so)

Netlify static site (`netlify.toml`: `npm run build`, publish `out`, Node 22); DNS `tapnconnect.ae` → Netlify, Cloudflare DNS-only; env names in `.env.example`. A `/ship` row: Netlify site `tnc-website` (free tier), domain, GTM container id, Turnstile site key. Nothing else.
