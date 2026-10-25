# Product

<!-- impeccable:product-schema 1 -->
<!-- Drafted by /kit-init from README.md (2026-10-25); facts are the README's, not yet confirmed in an /impeccable init interview. -->

## Platform

web

## Users
Anyone who finds TapNConnect on the internet. The site is how they first meet the product (members use the app, companies use the portal). Four kinds of buyer, each with their own page:
- **Event organisers**: buy event packages for the people at their event.
- **Exhibitors**: buy seats and cards for the team on their stand.
- **Sponsors**: buy sponsor tiers and reach.
- **Companies**: buy the company plan for staff who network all year.
- **Individuals**: start free, or buy Plus / Pro / the card.

They come to learn what the product is, see whether it fits them, find the price, and order.

## Product Purpose
Tell the story of TapNConnect (`tapnconnect.ae`), explain how it works, show who it is for and the one price list, and take orders through the Order page and its sales assistant. Success is the funnel `page_view` → `cta_click` → `order_start` → `order_submit | order_enquiry`, plus **Start free** sign-ups on the member site.

## Positioning
At an event, a touch of the card or phone keeps the contact. Normally the hall empties and the names fade. With TapNConnect the thread stays lit, and the people you met are still around you a year later.

## Operating Context
- Every call to action goes to one of three places: **Start free** (`profile.tapnconnect.ae/join`), **Order** (`/order/?kind=…`), and **Sign in** (the member site). The portal and legal pages are linked from the footer.
- The Order page has three steps: a scripted sales assistant (it can hand off to the backend sales agent), a pre-filled form (company licence, work e-mail only), then review and pay (card, bank transfer at AED 20,000+ and always for organisers and sponsors, or an enquiry for a person to price).
- AI agents read the site through `llms.txt` / `llms-full.txt` and structured data.

## Capabilities and Constraints
- Two languages: English at the root, Arabic under `/ar/` (RTL, Latin digits). Every copy key exists in both languages.
- A static export (no server). First-load JS is about 95 kB per page. The 3D scene loads on idle and only on capable devices.
- **One price list** (`src/content/plans.js`). The site never invents a number. Seats, the company plan, event packages and sponsor tiers are *priced per order*.
- Analytics only after consent (Consent Mode v2, no banner, no cookie before a yes).
- Open: the order backend, licence upload, Turnstile key, live price feed and production domain are not wired yet (see BUILD_STATUS.md).

## Brand Commitments
- Name: TapNConnect. Domain `tapnconnect.ae`.
- Copy follows the plain-words ban list (`docs/knowledge/plain-words.md` in the TapNConnect docs repo).
- Founder's direction (2026-10-24): the first screen says what the product is and who it is for. Use product pictures instead of paragraphs.
- The visual system is recorded in code (`src/styles/tokens.css`, "Gulf Water", shared with the app). Run `/impeccable document` to capture it in DESIGN.md.

## Evidence on Hand
- Starting prices from the founder (2026-10-14): Plus AED 39 / 390, Pro AED 99, the card AED 149 with a year of Plus, packs AED 19 / 79, voice top-up AED 9.
- No testimonials, customer logos, case studies or usage numbers are in the repo. Don't invent any.

## Product Principles
1. Never promise what the price list or a person hasn't. When in doubt, hand off to a person.
2. Say what it is and who it's for first, and show it rather than describe it.
3. Equal standing for both languages.
4. Fast and honest by default: static, consent before tracking, the full text in the HTML.

## Accessibility & Inclusion
Respect `prefers-reduced-motion` and `prefers-reduced-transparency`. The 3D scene has a CSS first paint and a text alternative. Each page has one `h1` and semantic HTML. There's no horizontal scroll at 390 px. Both themes are designed.
