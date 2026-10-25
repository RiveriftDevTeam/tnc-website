# Plan: site revamp ("Kept Thread")

**Status:** APPROVED 2026-10-25 (as written) · **Author:** architect · **Date:** 2026-10-25
**Decisions (user, 2026-10-25):** Q1 warm neutrals + coral primary, petrol and token names kept: **yes** · Q2 fonts (Bricolage Grotesque, Alexandria, Caveat, Aref Ruqaa; Geist + Plex Arabic kept): **yes** · Q4 unsourced numbers: **drop** · Dependencies D1–D6: **declined as recommended** (no new npm deps) · Q3 (Gulf photos) and Q5 (plain-words list): open, non-blocking.
**Scope:** every page of tapnconnect.ae in English and Arabic (Home, How it works, 5 buyer pages, Pricing, Order, Trust, 404, plus a new Photo credits page)
**Lane:** /feature, HARD · **Deployment:** manual, nothing deploys · **Source REQ:** none (direct ask, 2026-10-25)

The ask: rebuild the whole site so it feels playful and warm and is about people, relationships and networking. It should tell a scroll-driven, story-led product story in the style of Apple's product pages, with animation and 3D objects, use real event photography from Unsplash, and work through UX, journeys, copy, fonts and colour properly.

---

## 0. System decomposition (Step 0)

| # | Component | Type | North-star scenario it serves |
|---|---|---|---|
| 1 | Design foundation: tokens, type, motion tokens, shell, header, footer | existing system (restyle) | All: a visitor gets one warm, consistent world on every page |
| 2 | Home scroll story: sticky stage, 7 acts, scroll-scrubbed 3D | new code (replaces `ScrollStory` + `StoryCanvas`) | **N1:** someone who lands on `/` understands in about 60 seconds what TapNConnect does, who it's for, and acts |
| 3 | Story stills: pre-rendered frames of the 3D scene per act | deterministic workflow (build-time script, run by hand) | N1 under reduced motion, without WebGL, or on low-end phones |
| 4 | Photography pipeline: Unsplash → `public/media/` (AVIF/WebP/JPG) + manifest + credits | data pipeline (one-off authoring script, committed output) | N1 and N2: real people at real events |
| 5 | Buyer pages ×5, How it works, Pricing, Trust, 404, Credits | existing system (restyle + new structure) | **N2:** an organiser, exhibitor, sponsor, company or individual reaches their page, sees themselves, trusts it, and orders or starts free |
| 6 | Order page (`OrderFlow` + `src/lib/order.js`) | existing system, **restyle only** | **N3:** the order journey keeps working exactly as it does today |
| 7 | Copy in EN and AR (content modules) | existing system (rewrite) | N1 and N2. AR is written as Arabic copy |
| 8 | Arabic copy review | **human gate** | N2 for Arabic readers |
| 9 | Walking-skeleton review of the story | **human gate** | Proves the riskiest assumption (§2) |
| 10 | SEO and agent surfaces: JSON-LD, `llms.txt`, OG images | existing system (regenerate) | Discovery by search and by AI agents |
| 11 | Checks: e2e specs, `acts`, `check`, `flow`, a new `vitals` script | tool / tests | Proof instead of claims |
| — | Backend, analytics SDK, AI agent, cloud infra | **none.** No AI agent is added; the sales assistant is unchanged | — |

**Scope rule (default-deny):** no CMS, no theme toggle, no accounts, no new tracking, no video, no per-visitor state. A theme toggle and per-page OG images for every route are parked (see §14).

---

## 1. Tags and chunks (summary; detailed steps in §13)

| Chunk | What | Tag | Effort | Parallel? |
|---|---|---|---|---|
| C0a | Foundation: tokens, fonts, motion tokens, Shell/Header/Footer, shared primitives (`Thread`, `Photo`, `Sticker`, `Section`) | **HARD**: it decides the whole world, and every other chunk inherits it | high | first, serial |
| C0b | Content split (per-page copy modules, no copy change) | EASY | low | parallel with C0a (no shared files) |
| C0c | Media pipeline script, downloads, manifest, credits data | EASY | medium | parallel with C0a/C0b (no shared files) |
| C1 | **Walking skeleton:** Home story acts 1–3 end to end (3D + photo + copy + stills + reduced motion + mobile) | **HARD**: WebGL, scroll scrubbing, perf, fallbacks | high | serial; **founder gate** |
| C2 | Home story acts 4–7 + every Home section after the story | HARD | medium | after the C1 gate; parallel with C3–C6 |
| C3 | Buyer page template + 5 buyer pages | EASY | medium | parallel |
| C4 | How it works | EASY | medium | parallel |
| C5 | Pricing + Order restyle (no behaviour change) + `order.spec.mjs` | EASY | medium | parallel |
| C6 | Trust, 404, Credits page | EASY | low | parallel |
| C7 | OG images, JSON-LD, `llms` check, `vitals.mjs`, e2e additions, `acts.mjs` stops | EASY | medium | after C2–C6 |
| C8 | Arabic copy review (native Gulf Arabic writer + founder) | human gate | — | after C2–C6 copy lands |
| C9 | Impeccable critique/polish pass + DESIGN.md by the documenter | EASY | medium | last |

**Zero shared files:** C2–C6 can run in parallel only because C0b splits `en.js`/`ar.js` into per-page modules first. Without the split, every chunk edits the same two copy files. That conflict decides the order, so C0b is not optional.

---

## 2. Solution options (Step 1)

The north-star moment: *a stranger scrolls the first screens and feels "this is about people", then understands the tap → kept → thread → circle story.*

| | A. Photo-led stage with a procedural 3D layer **(chosen)** | B. Full 3D world (stylised figurines in a modelled hall) | C. Static story cards (CSS only) |
|---|---|---|---|
| Mechanism | Real event photos are the backdrop of a sticky stage. A transparent three.js layer adds tactile objects: the tap card, "clay bead" people, a coral thread. Paper "stickers" in HTML carry the assistant's notes. | A modelled 3D hall with figurines and a camera flying through it (GLTF assets, r3f) | Photo + illustration panels revealed by CSS scroll-driven animation; no WebGL |
| Human warmth | High. Real faces carry the warmth and the 3D carries the idea | Medium. Toy people can feel cute or uncanny, and there are no real people | Medium-high. Real photos, but no "magic moment" |
| "3D structures" ask | Met (card, beads, threads, ripple) | Fully met | Not met |
| Ecosystem reality | Vanilla three 0.186 is already in the repo and loads lazily at ~82 kB gzip (measured: largest lazy chunk). CapsuleGeometry, ExtrudeGeometry, TubeGeometry and CanvasTexture are all in core. No asset pipeline | Needs GLTF models nobody here can author, plus @react-three/fiber/drei (~45–60 kB gzip more) and a Draco loader. Big perf risk on phones | Native CSS `animation-timeline` is in Chrome/Edge and Safari 26; Firefox needs the fallback |
| Perf risk | Medium: one canvas, bounded geometry, DPR cap, auto-downgrade | High | Low |
| Effort | High but bounded | Very high, plus outside 3D modelling | Low |
| Score (fit / risk / effort) | **8 / 6 / 6** | 7 / 3 / 2 | 5 / 9 / 9 |

**Pick: A.** It is the only option that delivers both real human imagery and the 3D story inside the pinned stack with no new runtime dependency. C is kept as the built-in fallback (the stills mode in §5.5), so the page never depends on WebGL to tell its story.

**Riskiest assumption:** *a scroll-scrubbed hybrid of real photographs and procedural "clay bead" 3D reads as warm, playful and premium, not gimmicky or cheap, and it feels smooth on a mid-range phone.*
**Evidence type: perceived quality.** Only the founder experiencing the rendered walking skeleton (C1) on their own phone and laptop, in EN and AR, light and dark, can prove it. Frame-time numbers from `vitals.mjs` (p95 ≤ 20 ms at 1280 px, ≤ 33 ms at 4× CPU throttle) are **necessary, not sufficient**: a passing statistic is not evidence that it feels smooth. Until the founder says yes, C2 does not start.

---

## 3. Creative direction

### 3.1 The concept: "Kept Thread"
Every relationship starts with a touch: a tap, a handshake, a laugh at a stand. Normally that thread snaps when the hall empties. TapNConnect is the hand that keeps holding it.

**The signature:** one **coral thread** runs through the whole site. It is the scroll progress line in the story, the divider between sections, the line of every timeline, the underline on links on hover, and the 3D tube that joins two people in Act 3. It ties itself in a small loop (a "knot") wherever two people connect. It is tactile, a bit playful, like a friendship bracelet or a string between two paper cups, and it carries the product's own line, "the thread stays lit".

Around it:
- **Real people** (photos) carry the warmth.
- **Clay beads** (3D) stand for people in the abstract story: matte, round, soft-lit, slightly squishy when they touch. They have no faces, which avoids the uncanny and keeps them playful.
- **Paper stickers** are the assistant's notes: "Marathon on Sunday. Wish him luck?". They are small off-white cards with a soft shadow, tilted ±1.5°, with the note in a handwritten face and the buttons in the UI face. They show the product working, not a description of it.

**How it differs from Gulf Water (today):** Gulf Water is calm and corporate-premium: a fixed teal→sand gradient backdrop, frosted-glass domed cards everywhere, one petrol accent, Geist only, a black "splash" hero, motion only on arrival. Kept Thread keeps the petrol and the pills (so it is still clearly the same product as the app) but adds:
- warm paper ground and full-colour fields instead of a gradient;
- no glass as decoration (glass stays only on the sticky header, where content scrolls under it);
- a second voice colour (coral thread) and a third (saffron sun);
- a display face with character;
- handwriting for human notes;
- real photographs;
- scroll-authored motion instead of fade-ups.

Eyebrows (small uppercase kickers) are removed site-wide. They are a craft-floor ban, so headings speak for themselves.

### 3.2 Colour (strategy: Full palette, with Committed fields in the story)

**Token decision: every existing `--tnc-*` name in `tokens.css` is kept** (it mirrors the app's `tokens.css`). The **accent family values are unchanged** (`--tnc-accent #0B5F6B` / dark `#66D4E0`). The neutrals (`ground`, `sunken`, `backdrop-*`, `splash`) are retuned warmer, and **new site-only tokens** are added with the `--tnc-site-*` prefix so they can never collide with the app. *Founder decision 57/59 named Gulf Water, so retuning neutrals needs the founder's explicit yes (open question Q1).*

| Role | Token | Light | Dark | Use / contrast (measured) |
|---|---|---|---|---|
| Ground (paper) | `--tnc-ground` | `#F6F1EA` | `#12100E` (warm charcoal) | page ground |
| Surface | `--tnc-surface` | `#FFFFFF` | `#1C1915` | stickers, panels |
| Sunken | `--tnc-sunken` | `#EDE5DA` | `#0E0C0A` | wells, inputs |
| Ink | `--tnc-ink` | `#14201F` (kept) | `#F3EDE4` | 14.9:1 / 16.3:1 |
| Ink muted | `--tnc-ink-muted` | `#3E4B49` (kept) | `#C9BFB2` | 8.1:1 / 10.5:1 |
| Ink subtle | `--tnc-ink-subtle` | `#5F6A68` (kept) | `#9A9083` | 5.0:1 / 6.1:1 (5.6:1 on surface) |
| Brand / structure | `--tnc-accent` | `#0B5F6B` (kept) | `#66D4E0` (kept) | links, petrol fields; white on petrol 7.3:1 |
| **Story field** | `--tnc-site-field` | `#0E3B42` (deep petrol night) | `#0A2A2F` | background of the sticky story; replaces black `#0B1716`. Paper ink on it 10.5:1 |
| **Thread** (graphic) | `--tnc-site-thread` | `#E8573F` | `#FF7A5C` | lines, knots, 3D tube, focus ring. 3.2:1 on paper (non-text minimum 3:1 met); 4.75:1 on the field |
| **Thread strong** (text + primary button) | `--tnc-site-thread-strong` | `#C9452F` | `#FF7A5C` | **primary CTA fill** (white text 4.8:1 light; `#12100E` text 7.4:1 dark); coral text links use `#B83A26` (5.1:1) |
| **Sun** | `--tnc-site-sun` | `#FFC24B` | `#FFCF6B` | highlight marks, the "knot" glow, sticker tape; ink on sun 10.4:1 |
| Clay people (3D + avatars) | `--tnc-site-clay-1…6` | `#F3C9A8` peach · `#9ED9CF` mint · `#FFC24B` sun · `#E8573F` coral · `#C4CDF2` lilac · `#F0D9B5` sand | same hues, 8% darker | bead colours; read by the 3D scene from CSS at init |
| Grey-out (the fade) | `--tnc-site-faded` | `#A39C93` | `#4A4540` | faded beads and names in Act 4 |

**One filled control per view** stays a rule. The primary button becomes thread-strong (coral) and the secondary stays tonal petrol. That moves the "act now" colour onto the warm signature, so the CTA is the thread.

**Light or dark by use scene:** people browse this on phones in bright offices and halls, and on laptops at night. Both themes are fully designed. The story stage is always the deep petrol **field** in both themes, because Apple-style stages read best on a dark field and the photos are graded for it. Every section outside the stage follows the theme.

### 3.3 Type

| Role | Latin (EN pages) | Arabic (AR pages) | Why |
|---|---|---|---|
| Display (h1/h2, story lines) | **Bricolage Grotesque**, variable, axes `wght` 200–800 + `opsz` 12–96 (no `wdth`, to save bytes). Display at 700, opsz 96, tracking −0.03em; h2 at 650 | **Alexandria**, variable, `wght` 100–900. Display at 700, h2 at 600 | Bricolage has ink-traps and a slightly quirky grotesque warmth: human and a little playful without looking childish. It is not on the "training-default" list. Alexandria is a confident geometric Arabic with the same energy at heavy weights and its own Latin, so mixed Arabic/Latin lines (brand name, digits) stay even |
| Body / UI | **Geist Sans** (kept; already a dependency, and the app uses it) 400/500 | **IBM Plex Sans Arabic** (kept) 400/500/600 | Plex is on Impeccable's "training-default" list. It is kept on purpose because the app shares it and it reads very well at 15–17 px with Latin digits. It is the reading face, not the voice. The voice is Alexandria |
| Hand (assistant notes, sticker annotations, hand-drawn labels only) | **Caveat** 500/600 | **Aref Ruqaa** 400/700 | Ruqʿa is the script Arabic speakers actually write notes in, so this is a real cultural fit, not a costume. Caveat is the Latin twin. Used only on stickers, never for body or buttons |

- **Loading:** everything goes through `next/font/google`, self-hosted at build. **All six families exist in Next 14.1.3's font list (verified in `font-data.json`).** The Latin display font and Geist are preloaded on EN pages. Alexandria and Plex Arabic are preloaded on AR pages. The hand faces load with `preload: false` and `display: swap`, because they are below the fold except in Act 2.
- **Type scale (fluid):** display `clamp(2.6rem, 7vw, 6rem)` / 0.98 · h1 `clamp(2.1rem, 4.6vw, 3.6rem)` / 1.04 · h2 `clamp(1.6rem, 3vw, 2.4rem)` / 1.12 · lead `clamp(1.06rem, 1.4vw, 1.3rem)` / 1.55 · body 1rem / 1.6 · hand `1.25rem`.
- **Arabic:** line-height is +0.12 over Latin, there is no negative tracking and no uppercase, and digits are Latin (`font-feature-settings` and `lang` already handle this).

### 3.4 Shape language
- **Pills** for buttons and chips (kept; continuity with the app).
- **Photo cards:** radius 28 px, no border. In light theme a soft offset shadow (`0 24px 60px -28px rgb(20 32 31 / .35)`); in dark theme a 1 px warm hairline instead.
- **Stickers:** radius 14 px, surface white, tilt from a set of `[-1.5°, -0.6°, 0.8°, 1.4°]`, shadow `0 10px 24px -12px rgb(20 32 31 / .3)`, optional "tape" strip in sun at 70% opacity.
- **Thread:** stroke 2 px (3 px ≥ 1024 px), round caps, coral. Nodes are 10 px dots. A knot is a 14 px SVG loop. This is one SVG component (`Thread.js`) with `draw` progress driven by CSS scroll-driven animation where supported and IntersectionObserver otherwise.
- **No:** glass cards, gradient text, icon-tile grids as page structure, coloured side borders, hero-metric blocks.

### 3.5 Illustration and 3D language
- Procedural only (no GLTF, no textures except two CanvasTextures): **clay beads** (CapsuleGeometry/SphereGeometry, MeshStandardMaterial roughness 0.85, a soft hemisphere fill plus one warm key light, a cheap fresnel rim in `onBeforeCompile`); **the card** (an ExtrudeGeometry rounded rectangle, bevel 0.02; the face is a CanvasTexture drawn from tokens with the sample member "Layla Nasser / ليلى ناصر"); **the thread** (TubeGeometry along a CatmullRom curve, emissive coral, a pulse uniform); **the tap ripple** (the existing halo/ring shader idea, recoloured).
- Motion feel: beads "breathe" (scale 1 ± 0.015, 4 s) and squash on contact (a 120 ms scale-y 0.9 → spring back). Threads draw on, never pop.

### 3.6 Photography art direction
Candid moments in the middle of a gesture (leaning in, laughing, hands meeting, a badge being shown) in warm available light. People over stages. Rules:
- **No legible third-party logos or brands.** This rejected 5 otherwise good frames (Sony/Tamron booth, Vagaro card, a Rennes business card).
- **No alcohol in frame.** This is for a Gulf audience; it rejected `5eTIH36TVug`.
- No staged office handshakes across a desk.
- Modest dress is fine. Diverse casting.
- Grade: none applied in code. Photos are picked for warmth. In dark theme they sit under a 12% field-colour scrim so they don't glare.

**Honest gap:** the free Unsplash library has almost no Gulf or Arab event-networking photography. Searches for Emirati, Saudi-business and Arab-friends scenes returned religious, tourist or desert imagery, which is wrong for this use. The shortlist is therefore international event photography plus one Dubai locator (Museum of the Future). **Recommendation:** the founder supplies 6–10 photos from their own events (with releases). The slot system in §7 makes each swap a one-line change (Q3).

---

## 4. Information architecture, journeys, communication and action flow

### 4.1 Site map (unchanged routes + one new)
`/` · `/how-it-works/` · `/for/{organisers,exhibitors,sponsors,companies,individuals}/` · `/pricing/` · `/order/` · `/trust/` · **`/credits/` (new: photo credits)** · 404. Each also exists under `/ar/…`. The new page goes into `PAGES` in `site.js`, which feeds the sitemap, the e2e list and the check list automatically.

Header (unchanged structure, restyled): logo · How it works · Who it's for ▾ (5) · Pricing · Privacy | language · Sign in · **Order** (tonal) · **Start free** (primary coral). Over the story the header is transparent with paper text. After 8 px of scroll it becomes paper with the header glass (the one place glass stays).

### 4.2 Journeys per buyer (entry → understanding → trust → action)

| Buyer | Typical entry | Understanding (what they must get) | Trust (what convinces) | Action (where the CTA goes) |
|---|---|---|---|---|
| **Organiser** | Event-industry referral, LinkedIn, direct `/for/organisers/` | "You can prove the relationships your event created, and sell the day after." Story Acts 1–7, then the organiser door, then the organiser page's relationship-report vignette | Counts and aggregates, never visitor names (privacy floor); Trust page; "a person prices it within a working day" | `/order/?kind=organiser` → enquiry (bank transfer, always a person); secondary "Talk to a person" `/order/#person` |
| **Exhibitor** | Organiser's exhibitor pack, search "lead capture trade show" | "Accounts, not scan lists. The Monday hand-over done by Friday." | The accounts vignette (sample figures labelled), CRM in one click, seats priced in `plans.js` | `/order/?kind=exhibitor&seat=…` (card if priced, enquiry otherwise) |
| **Sponsor** | Organiser's sponsor deck | "See what your banner delivered, counted honestly." | "Counted only when on screen. No cookie, no identity." | `/order/?kind=sponsor&tier=…` → enquiry |
| **Company** | Founder sales, search | "Relationships stay with the company when a salesperson leaves." | Employer sees only what was captured for them; data in UAE North | `/order/?kind=company` → enquiry |
| **Individual** (visitor, founder, consultant) | A tap at an event, social, word of mouth | "Stay close to the people you meet; an assistant remembers for you." | Free plan, "nothing sent without your yes", humans only | **Start free** → `profile.tapnconnect.ae/join`; the card → `/order/?kind=individual&plan=card_plus` |

### 4.3 Home: communication flow (in order)
1. **Story stage (sticky, 7 acts; §5).** In order, it says: who it's for and what it is → the hall → the touch → the fade → the thread → the circle → the whole hall wins. The first viewport already holds the h1, the sub-line, both CTAs and the 4 buyer chips (Persuade rule: the action is visible at once).
2. **"Pick your side of the stand."** Four photo doors (organisers, exhibitors, sponsors, visitors), each a large photo card with the buyer's one-liner and the product vignette peeking out as a sticker. A fifth, smaller door for companies. A mosaic, not equal cards.
3. **"One gesture. The assistant does the rest."** The loop (Tap → Keep → Remember → Next step → Outcome) as a horizontal thread with 5 knots. Each knot opens to a sticker that shows the product moment (not icon tiles). Link to How it works.
4. **"Trust first. Business follows."** The year with Layla and Omar: `YearTimeline` rebuilt on the thread. Dates as hand-written labels, stickers for each moment, the thread drawing itself as you scroll. Photo `k7moOgpIkU8` (coffee) at the "coffee next week?" beat.
5. **"The card opens the door. The assistant keeps it open."** The card, restyled CSS-3D tilt (kept as CSS; no second WebGL context), price from `plans.js`, CTA to the card order.
6. **"Your people are yours."** Four privacy promises as a list strung on the thread (not a card grid), with a link to Trust.
7. **"Free for the people you meet. Plans for the ones who sell."** Three member plans from `plans.js` plus "Companies and events: priced per order by a person".
8. **Final ask: "Go meet someone. We'll remember the rest."** Full-bleed photo `l_ExpFwwOEg` (friends laughing over coffee). Start free (primary) and Order for your company (tonal).

**Removed:** the "numbers" section (100+ / 47 days / 0 / 1). These claims have no source in the repo, PRODUCT.md says not to invent any, and it is the banned hero-metric pattern. The "day 47" line in the old story is cut for the same reason (Q4 if the founder has a source).

### 4.4 Shape of every other page
- **Buyer page (one template, 5 pages):**
  1. Hero split: persona photo card with the product vignette sticker overlapping its corner, plus h1, sub-line, primary CTA (pre-selected kind) and "See pricing".
  2. **"Before / with TapNConnect":** two columns that pair the fade with the thread, 3 rows. This replaces the 4 icon tiles.
  3. The journey: 4 steps on the thread.
  4. Packages/prices pulled live from `plans.js` (nulls show "priced per order" in the hand face, with a "Talk to a person" link).
  5. FAQ (native `details`, FAQPage JSON-LD kept).
  6. Final ask on the field colour.
- **How it works:**
  1. Hero with photo `rBDAAw3OoMY` (someone mid-sentence).
  2. "At an event": Before / During / After as three chapters on a horizontal thread (stacked on phone), visitor and exhibitor lanes as two strands.
  3. "And for the organiser" sticker.
  4. "Every day after": the daily rhythm as a day-strip (morning → anytime) with stickers.
  5. "Six ways to capture, one result": 6 tactile tiles that each fold into the same memory sticker (CSS 3D flip).
  6. "What the assistant may do on its own": a **working** toggle demo (local state only).
  7. CTAs.
- **Pricing:** tabs and logic unchanged, restyled. The featured plan gets a sun "most popular" tape. The card has a CSS-3D thumbnail. "Priced per order" in the hand face plus the person link. FAQ.
- **Order:** restyle only (§4.5).
- **Trust:**
  1. Hero line "Your people are yours."
  2. The 8 sections as a promise ledger (numbered only because the order matters to the legal-page mapping).
  3. Photo `oF7dZYCgO3k` (Museum of the Future, Dubai) beside "Your data stays in the UAE".
  4. Legal links.
- **404:** bilingual. "Lost someone? Let's get you back." with a loose thread that re-ties on hover (CSS only), and a link home.
- **Credits (new):** a list of photos with photographer, link and slot. Plain page, one h1.

### 4.5 Action flow and Order integrity
- Every CTA still goes to one of three places: **Start free** (`JOIN_URL`), **Order** (`/order/?kind=…[&plan|seat|pkg|tier]`), **Sign in**. These all go through `Cta.js`, so `cta_click {label,to,placement}` keeps working. New placements: `story-act-1` … `story-act-7`, `door-<persona>`, `final`.
- **Order is restyle-only.** `src/lib/order.js` is not touched. In `OrderFlow.js` only `className` strings, wrapper markup and token-based colours change. The step logic, state, the `POST {BACKEND}/api/public/order` body, the query-string pre-fill and the sales-assistant calls are untouched. Proof: `order.test.mjs` stays green and the new `tests/e2e/order.spec.mjs` (the port of `scripts/flow.mjs`, backlog item 8) passes before and after the restyle. If a restyle needs a markup change that alters the DOM structure the spec relies on, the builder stops and asks.
- Analytics events are unchanged except that `story_beat` values become `act-1…act-7` (they were `act-1…act-5`). Nothing downstream consumes them yet (GTM is not configured).

---

## 5. Home scroll story spec

**Stage:** a section of `h-[640vh]` on desktop (`h-[480vh]` on phone). A sticky `100svh` frame holds four layers, back to front:
1. **Photo layer** (`<picture>` elements cross-faded and scaled by CSS vars)
2. **WebGL canvas** (transparent)
3. **Scrims** (start-side gradient on desktop, bottom gradient on phone)
4. **Act copy** (HTML; every act's text is server-rendered)

Progress `p` (0..1) is read from scroll into a ref. It drives the canvas uniforms and sets CSS custom properties (`--p`, `--act-local`) on the stage element: one `style.setProperty` per frame, no React render per tick. This is the same pattern as today's `ScrollStory`, kept on purpose.

| Act | Range of p | On screen | 3D | Scroll-linked motion | Copy (EN draft) |
|---|---|---|---|---|---|
| **1 · Who it's for** | 0–0.10 | Photo `KVvEpFVq_-U` (busy expo hall) full-bleed under the field scrim. h1, sub-line, 2 CTAs, 4 buyer chips | The **card** floats at the end side, slowly turning (rotY −18° → 10° with p), plus a soft coral ripple every 2.4 s (time-based, stops offscreen) | Photo scale 1.00 → 1.08 | h1 **"Stay close to the people you meet."** Sub: "Tap a card at the stand. TapNConnect keeps who they are and what you promised, and tells you when to say hello again. For visitors, exhibitors, sponsors and the organisers who bring them together." |
| **2 · The hall** | 0.10–0.24 | The photo pushes in and blurs (blur 0 → 6 px, scale → 1.25) | ~60 **clay beads** (24 on phone) rise out of the photo into a loose crowd. The card shrinks into the hand of one bead ("you", coral) | Bead y-offset and opacity follow p in staggered bands | **"A three-day show. A hundred hellos."** |
| **3 · The touch** | 0.24–0.40 | Photo cross-fades to `36g19a7ivrs` (two hands reaching, light ground) at 40% under the field | Two beads (you, coral; Omar, mint) drift together, pause a finger's width apart (a held beat of 0.03 p), touch: squash, ripple ring, and the **thread** draws between them. A paper sticker in the hand face pins to the thread | Bead positions lerp on p; the thread `drawRange` grows with p | **"One tap. The moment is kept."** Sticker: *"Met in person · Gulf Tech Expo · 14 Oct · Hall 4"*. Line: "Who, where, when, and what you promised each other. No form, no app for the visitor." |
| **4 · The fade** | 0.40–0.54 | Photo dims to 20%. Six or so flat 3D business cards pile up and slide away | Every other bead turns `--faded` grey and drifts out; would-be threads show as dotted and dissolve. The coral thread is the only colour left | Grey uniform 0 → 1 with p; the camera dollies back | **"Usually, this is where it ends."** "The hall empties. The cards go in a drawer. By next week the names have faded." |
| **5 · The thread holds** | 0.54–0.70 | Two stickers slide in along the thread: *"Omar's marathon is Sunday. Wish him luck?"* [Send a note] [Not now] → *"3:58! Coffee next week?"* (sample, labelled) | The thread pulses (sun-coloured glow travels along the tube) | Sticker translate along the curve via CSS `offset-path` on the SVG twin of the curve (fallback: translate) | **"This time, the thread holds."** "Your assistant remembers each person, tells you when a word would count, and writes the first draft. Nothing goes out without your yes." |
| **6 · The circle** | 0.70–0.86 | Photo cross-fades to `ZDN-G1xBWHY` (five people talking, warm light) | The thread branches: Omar → Yusuf (introduction knot), then mentor and friend; beads gather into a circle around "you" and regain colour | Branch draw on p; circle radius eases in | **"A year later, they're still around you."** "A friend, a mentor, a client, and the person they introduced." |
| **7 · The whole hall** | 0.86–1.00 | The 4 buyer chips reappear as 4 stickers, and the stage hands off to section 2 | The camera pulls out: your circle is one of many lit circles across the hall (a network of networks) | Camera z and FOV on p; the canvas fades out over the last 0.04 | **"Everyone in the hall leaves with more than a badge scan."** "The visitor keeps a circle. The exhibitor gets accounts. The sponsor sees what it delivered. The organiser can prove it." |

A thin coral **progress thread** runs down the stage's start edge (desktop) or along its bottom (phone), with 7 knots that are focusable links to each act (anchors `#act-1…7`, which scroll to the act's progress). This is also the "skip story" affordance: a "Skip the story" link sits after the CTAs and jumps to `#who`.

### 5.1 Mobile (≤ 767 px)
- The same 7 acts, stage `480vh`.
- Copy sits in the bottom 45% over a bottom scrim; the 3D sits in the top 55%.
- 24 beads, DPR capped at 1.25, no fresnel rim, no shadows.
- Photos use the 800 w variants.
- Chips wrap to two rows. CTAs are full-width and stacked.
- The card is 0.7 scale.

### 5.2 Reduced motion (`prefers-reduced-motion: reduce`)
- No sticky stage and no scrubbing.
- The 7 acts render as normal stacked sections. Each shows its **still** (§5.5) next to the copy, and the photo where the act uses one.
- The thread is drawn statically. The ripple and breathing are off.
- Opacity cross-fades of ≤ 200 ms remain for state changes only.
- No canvas is created.

### 5.3 Reduced transparency
Scrims become solid field colour behind the copy column, and the header has no blur (the existing rule, kept).

### 5.4 Low-end and no WebGL
The capability gate is the existing one (`saveData`, `hardwareConcurrency ≤ 2`, no WebGL) plus `deviceMemory ≤ 2` and a **runtime frame probe**: if the first 45 frames average more than 28 ms, swap to stills mode and log `story_beat {beat:'downgrade'}`.

In stills mode the sticky stage stays (it is cheap) and the canvas is replaced by the act stills cross-faded on `p` with CSS. The story still moves, without WebGL.

### 5.5 Stills (first paint + text alternative + fallback)
`scripts/stills.mjs` (new; Playwright, already present) loads the built Home in a fixed 1600×1000 viewport, sets each act's mid-progress, waits two frames, screenshots the canvas element only with a transparent background, and writes:
- `public/media/story/act-<n>-<theme>.png`, then
- AVIF/WebP siblings via `cwebp` if present (it is on this machine). Otherwise the WebP is generated by a Playwright `canvas.toBlob('image/webp')` call, so there is no dependency.

Act 1's still is the **CSS first paint** behind the hero (it replaces today's dotted gradient), so the LCP element is the h1 text plus the photo, never the canvas. Each act's `aria-describedby` points to a visually hidden one-line description of what the scene shows (the text alternative).

### 5.6 Implementation notes for the builder
- **Rewrite `StoryCanvas.js` and `ScrollStory.js`; keep the patterns:** dynamic import with `ssr:false`, the idle gate, render only on screen (IntersectionObserver plus `visibilitychange`), the progress ref, DPR cap, dispose on unmount.
- The scene reads colours from CSS custom properties at init and on `matchMedia('(prefers-color-scheme: dark)').change`.
- The three.js import list must stay named imports from `three` so tree-shaking holds. **Lazy chunk budget ≤ 100 kB gzip** (today ~82 kB).
- RTL: the stage mirrors (`dir` prop): beads enter from the start side, and the progress thread sits on the start edge.

---

## 6. 3D and motion system

### 6.1 Objects
The card · clay beads (people) · the thread (tube + knots) · business cards (flat boxes, Act 4 only) · the ripple ring. No other 3D on the site. Off Home, depth is CSS 3D (the card tilt, capture-tile flips) and SVG (the thread).

### 6.2 Technique
- One WebGL renderer, only on Home, only inside the stage.
- About 70 draw calls in the worst case on desktop. Use `InstancedMesh` for beads and business cards, so that is 1 call each.
- No post-processing, no shadows (a fake contact shadow is a blurred radial sprite), no environment maps.

### 6.3 Performance budget (held, and measured by `scripts/vitals.mjs`)

| Metric | Budget | Today |
|---|---|---|
| First-load JS per page (Next build report) | **≤ 100 kB** | 95–97 kB |
| Lazy 3D chunk (gzip) | **≤ 100 kB** → corrected: **≤ 155 kB total** | ~82 kB → measured 2026-10-25: three 0.186 ships as two chunks, **147 kB** total at HEAD (84 + 63); C1 = ~151 kB (+story modules 5 kB) |
| LCP (Home, 1280 px, no throttle / "Fast 4G + 4× CPU") | ≤ 1.5 s / ≤ 2.5 s | not measured |
| CLS | ≤ 0.05 | not measured |
| Fonts per page (woff2 transferred) | ≤ 180 kB EN, ≤ 200 kB AR | to measure in C0a |
| LCP image | ≤ 200 kB (AVIF 1600 w) | n/a |
| Home total transfer after 5 s of scroll | ≤ 1.6 MB desktop / ≤ 0.9 MB phone | ~0.5 MB |
| Story frame time p95 (headless, 1280 px / 4× CPU) | ≤ 20 ms / ≤ 33 ms (necessary, not sufficient; see §2) | not measured |

### 6.4 Motion tokens (`tokens.css`, mirrored in `tailwind.config.js` and in a tiny `src/lib/motion.js` for JS)

| Token | Value | Use |
|---|---|---|
| `--tnc-dur-instant` | 120 ms | press, toggle feedback |
| `--tnc-dur-quick` | 200 ms | hover, chip select, exit |
| `--tnc-dur-base` | 320 ms | sticker arrival, tab panel, menu |
| `--tnc-dur-slow` | 560 ms | photo cross-fade, section reveal |
| `--tnc-dur-story` | 800 ms | the one authored entrance (Act 1 card) |
| `--tnc-ease-out` | `cubic-bezier(.16,1,.3,1)` | arrivals |
| `--tnc-ease-in-out` | `cubic-bezier(.65,0,.35,1)` | scrubbed values, cross-fades |
| `--tnc-ease-exit` | `cubic-bezier(.4,0,1,1)` | exits (faster than entrances) |
| `--tnc-ease-pop` | `linear(0, .5 18%, 1.08 40%, .98 62%, 1)` | sticker settle, knot tie: the only "playful" curve, used sparingly |
| `--tnc-tilt-sticker` | `-1.5deg … 1.4deg` (set) | sticker rotation |

Reveal policy: there is no generic fade-up on every section any more (`Reveal.js` keeps working but is used only for lists that appear as lists). Section entrances are the **thread drawing in**: native `animation-timeline: view()` where supported, IntersectionObserver plus a class otherwise. Content is visible by default if JS fails.

---

## 7. Photography

### 7.1 Pipeline
- **Discovery** happened here. `unsplash.com/napi` and the search HTML return 401/403 to scripts and to headless browsers (so `scripts/media-scout.mjs` is broken today), and nothing was done to get around that. Each candidate was then **verified** through the public download endpoint `unsplash.com/photos/<id>/download`. Its redirect gives the CDN id and the photographer slug, and fetching it also counts as a download, as Unsplash asks.
- **New `scripts/media.mjs`** (`npm run media`), run by hand, with its output committed:
  1. Reads `src/content/media.sources.js`: `slot → { id, focal: [x,y], ratio, widths }`.
  2. Resolves each id through the download endpoint.
  3. Fetches sized renditions from `images.unsplash.com/<cdn-id>?w=<w>&h=<h>&fit=crop&crop=focalpoint&fp-x=…&fp-y=…&q=<q>&fm=<avif|webp|jpg>`. **`fm=avif` was verified to return `image/avif`**, so Unsplash's own imgix does the resizing and encoding and **no `sharp` dependency is needed**.
  4. Writes `public/media/<slot>-<w>.<ext>`.
  5. Writes `src/content/media.json`: slot → widths, intrinsic size, dominant colour (`fm=json` metadata), photographer name, profile URL, photo page URL.
  6. Writes `public/media/CREDITS.txt`.
  7. Is idempotent: existing files are skipped.
- **Sizes:** widths 480 / 800 / 1200 / 1600 (+2400 for the two story heroes). Formats AVIF q50, WebP q62, JPG q70 at 1200 only (the `<img src>` fallback). The script fails if any file is over its budget (hero AVIF 1600 ≤ 200 kB, others ≤ 140 kB).
- **`Photo.js`** renders `<picture>` with `srcset`/`sizes`, explicit `width`/`height` (no CLS), the dominant colour as background, `loading="lazy"` except `priority`, `decoding="async"`, alt text from the copy modules, and the **`NEXT_PUBLIC_BASE_PATH` prefix**. Plain `<img src="/media/…">` breaks on the GitHub Pages base path.
- **CSP:** unchanged. Everything is served from `'self'`, so `img-src 'self' data:` is enough.
- **Credits:** the `/credits/` page renders `media.json`, the footer links to it, and `CREDITS.txt` ships too. The Unsplash License does not require attribution; this is a courtesy.
- **Repo weight:** about 22 slots × ~9 files × ~70 kB ≈ 14 MB. Acceptable for a static site. `media.sources.js` keeps it reproducible.

### 7.2 Shortlist (all verified: free Unsplash License, CDN id resolves, viewed on a contact sheet)

| # | Slot | Photo (page) | Photographer | Use |
|---|---|---|---|---|
| 1 | `story-hall` | [KVvEpFVq_-U](https://unsplash.com/photos/KVvEpFVq_-U) busy exhibition hall from above | Euronewsweek Media | Story Act 1–2 backdrop (LCP) |
| 2 | `story-touch` | [36g19a7ivrs](https://unsplash.com/photos/36g19a7ivrs) two hands reaching | Sebastian Dumitru | Story Act 3 |
| 3 | `story-circle` | [ZDN-G1xBWHY](https://unsplash.com/photos/ZDN-G1xBWHY) five people talking, warm light | Antenna | Story Act 6 |
| 4 | `door-organisers` | [g7iSoF8NwYA](https://unsplash.com/photos/g7iSoF8NwYA) crowd at an indoor event stage | Euronewsweek Media | Home door + organiser hero |
| 5 | `door-exhibitors` | [BKpOVik79lA](https://unsplash.com/photos/BKpOVik79lA) visitors at a booth, lanyards | Trans Russia | Home door + exhibitor hero (crop out the Cyrillic booth sign: focal right/bottom) |
| 6 | `door-sponsors` | [NXhweP5ShCg](https://unsplash.com/photos/NXhweP5ShCg) crowd at big branded stands | Trans Russia | Home door + sponsor hero (**check at full size** that no brand is legible after the crop; fallback `EVgsAbL51Rk`) |
| 7 | `door-individuals` | [w5GxcIxT1gE](https://unsplash.com/photos/w5GxcIxT1gE) smiling man showing a blank badge | Jelly Marketing | Home door + individuals hero (the blank badge is where the card sticker lands) |
| 8 | `door-companies` | [OsuDfn4vtLA](https://unsplash.com/photos/OsuDfn4vtLA) people mingling, warm light | Olena Kholina | Companies door + hero |
| 9 | `year-coffee` | [k7moOgpIkU8](https://unsplash.com/photos/k7moOgpIkU8) three people over coffee | Vitaly Gariev | Year timeline "coffee next week?" beat |
| 10 | `final` | [l_ExpFwwOEg](https://unsplash.com/photos/l_ExpFwwOEg) friends laughing, high five over coffee | Toa Heftiba | Home final ask |
| 11 | `how-hero` | [rBDAAw3OoMY](https://unsplash.com/photos/rBDAAw3OoMY) woman mid-sentence with two listeners | Olek Buzunov | How it works hero ("hold to record") |
| 12 | `how-event` | [yTsy3PYFPtc](https://unsplash.com/photos/yTsy3PYFPtc) two men talking at an event | M ACCELERATOR | How it works "During" chapter |
| 13 | `how-organiser` | [3BwoM8zNYwo](https://unsplash.com/photos/3BwoM8zNYwo) panel with audience at tables | Riccardi Media | How it works organiser sticker; organiser page journey |
| 14 | `persona-sponsor-2` | [EVgsAbL51Rk](https://unsplash.com/photos/EVgsAbL51Rk) audience under a big screen, blue light | Stem List | Sponsor page "reach" row |
| 15 | `persona-exhibitor-2` | [bCMpeLcfWPw](https://unsplash.com/photos/bCMpeLcfWPw) man laughing in conversation | Dwayne joe | Exhibitor page "before/with" row |
| 16 | `persona-individual-2` | [vFF-cypxQwY](https://unsplash.com/photos/vFF-cypxQwY) two women hugging in a crowd | Jordi Espinosa | Individuals "a circle that lasts" |
| 17 | `trust-uae` | [oF7dZYCgO3k](https://unsplash.com/photos/oF7dZYCgO3k) Museum of the Future, Dubai | Haris khan | Trust "data stays in the UAE" |
| 18 | `pricing-hands` | [JNwba6cv4e0](https://unsplash.com/photos/JNwba6cv4e0) handshake close-up, warm yellow | A. C. | Pricing "talk to a person" band |
| 19 | `notfound` | [nF8xhLMmg0c](https://unsplash.com/photos/nF8xhLMmg0c) people laughing outdoors | Priscilla Du Preez | 404 |
| 20 | `og` | reuse #1 + #2 | — | OG images (§8) |

**Reserve:** `TfljWjE3iLo` (Filip Rankovic Grobgaard, formal crowd; check for glasses before use), `IhVom0KsuOM` (Amonwat Dumkrut, seated networking), `cuKJre3nyYc` (Jakob Dalbjörn, conference).
**Rejected:** `8wKTIZ1KEzY` (Sony/Tamron logos), `5pNsRJuj8Dc` (Vagaro logo), `fqam4djIni4` (third-party card text), `5eTIH36TVug` (alcohol), desk handshakes (`lZXX-QVdyXY`, `jEpZNyFSQwQ`, `9TF9pMrCFMo`), plus the religious and tourist results from the Gulf searches.

---

## 8. Files

**Ownership is per chunk. A builder touches only its chunk's rows.**

| File | Action | Chunk |
|---|---|---|
| `src/styles/tokens.css` | modify: retune neutrals, add `--tnc-site-*` colours and motion tokens (names kept) | C0a |
| `src/styles/globals.css` | modify: new type scale, buttons (primary = thread), sticker/photo/thread utilities; remove `.backdrop` gradient and `.eyebrow`; keep reduced-motion/transparency rules | C0a |
| `tailwind.config.js` | modify: new colours, `fontFamily.display/hand`, motion durations/easings, radii | C0a |
| `src/components/Shell.js` | modify: font loading (Bricolage, Alexandria, Caveat, Aref Ruqaa), remove backdrop div | C0a |
| `src/components/Header.js`, `Footer.js`, `Cta.js`, `Section.js`, `BrandMark.js` | modify: restyle; Section drops eyebrow; Footer gets a Credits link | C0a |
| `src/components/Thread.js`, `Sticker.js`, `Photo.js` | **create** | C0a (Photo: C0c) |
| `src/lib/motion.js` | **create** (JS mirror of motion tokens, `prefersReducedMotion()`) | C0a |
| `src/content/index.js` | modify: merge per-page modules; same `dict` shape | C0b |
| `src/content/en.js`, `ar.js` | modify: keep shared keys only (meta, nav, footer, cta, notFound) | C0b |
| `src/content/pages/{home,how,personas,pricing,order,trust,credits}.{en,ar}.js` | **create** by moving existing copy (C0b), then rewrite per chunk | C0b → C2–C6 |
| `src/content/en.story.js`, `ar.story.js` | **delete** (moved into `pages/home.*.js`) | C0b |
| `scripts/media.mjs`, `src/content/media.sources.js`, `src/content/media.json`, `public/media/**` | **create** | C0c |
| `scripts/media-scout.mjs`, `.github/workflows/media-scout.yml` | **delete** (superseded; its API returns 401) | C0c |
| `src/components/ScrollStory.js`, `StoryCanvas.js` | **rewrite** | C1 (acts 1–3), C2 (4–7) |
| `src/components/story/*.js` (scene parts: `beads.js`, `card.js`, `thread.js`, `ripple.js`) | **create** (plain modules imported by StoryCanvas; keeps the lazy chunk split) | C1/C2 |
| `scripts/stills.mjs`, `public/media/story/**` | **create** | C1 |
| `src/screens/Home.js`, `src/components/YearTimeline.js`, `TapCard3D.js`, `Vignettes.js` | modify | C2 (Vignettes also read by C3; **C2 owns it**, C3 consumes as-is) |
| `src/screens/Persona.js`, `src/components/Faq.js` | modify | C3 |
| `src/screens/How.js` | modify | C4 |
| `src/screens/Pricing.js`, `src/components/PricingTabs.js`, `src/screens/Order.js`, `src/components/OrderFlow.js` (classNames only) | modify | C5 |
| `tests/e2e/order.spec.mjs` | **create** (port of `scripts/flow.mjs`, with `net::ERR_FAILED` ignored) | C5 |
| `src/screens/Trust.js`, `NotFound.js`, `src/screens/Credits.js`, `src/app/(en)/credits/page.js`, `src/app/(ar)/ar/credits/page.js`, `src/content/site.js` (add `credits` to PAGES) | modify/create | C6 |
| `scripts/og.mjs`, `public/og.png`, `public/og/*.png` | modify/create | C7 |
| `src/lib/seo.js` | modify: per-page OG for Home + 5 buyer pages × 2 langs; Product `image` → card render | C7 |
| `scripts/llms.mjs` | modify: skip `media`/alt keys in `flat()`; add the Credits page to the index | C7 |
| `scripts/acts.mjs`, `scripts/check.mjs` | modify: 7 act stops; add `/credits/` | C7 |
| `scripts/vitals.mjs` | **create** (LCP, CLS, JS kB, fonts kB, transfer, frame-time p95 via CDP throttling; exits 1 over budget) | C7 |
| `tests/e2e/smoke.spec.mjs` | modify: add `/credits/` | C7 |
| `tests/e2e/story.spec.mjs`, `media.spec.mjs` | **create** | C7 |
| `package.json` | modify: scripts `media`, `stills`, `vitals` (**no dependency changes**) | C7 |
| `README.md`, `PRODUCT.md`, `CLAUDE.md` (stack line about tokens/fonts), `BUILD_STATUS.md` | modify at the end | C9 (lead) |
| `DESIGN.md`, `.impeccable/design.json` | **create** by the Impeccable documenter from the built world | C9 |
| `docs/environments.md` | **create** (architect; done with this plan) | — |

**Content keys (added to BOTH languages; `keys.test.mjs` enforces this):**
- `home.acts[7]` with `{h, p, sticker?, desc}`.
- `home.doors.{organisers,exhibitors,sponsors,individuals,companies}.{title,line}`.
- `home.loop.knots[5]`.
- `home.cardBlock`, `home.privacy.items[4]`, `home.final`, `home.skip`.
- `personas.<p>.compare.rows[3].{before,with}`.
- `how.toggle.{on,off,label}`.
- `media.alt.<slot>` (one per slot) and `media.desc.act1…act7` (scene text alternatives).
- `credits.{title,description,h1,intro,by,license}`.
- `notFound.{title,p,home}` (rewritten).

**Removed keys** (both languages): every `eyebrow`, `home.outcomes`, `home.problem.stats`.

**Generated surfaces:**
- **`llms.txt` / `llms-full.txt`**: still generated in prebuild from `dict` (same shape after the split), with the new copy flowing in automatically; alt texts are excluded.
- **JSON-LD**: unchanged types (Organization, WebSite, WebPage, SoftwareApplication + Offers from `plans.js`, Product, HowTo, FAQPage, BreadcrumbList); HowTo steps read the new loop copy; Product image points to the new card render.
- **OG**: `og.mjs` renders the new world (photo #1, coral thread, h1 in Bricolage) for `og.png`, plus `og/<page>-<lang>.png` for Home and the 5 buyer pages. Arabic OG uses Alexandria and RTL.

---

## 9. Dependency decisions (each needs the founder's yes; **the recommendation is no new dependencies**)

| # | Candidate | Cost | What it would buy | No-dependency alternative (recommended) |
|---|---|---|---|---|
| D1 | **GSAP 3 + ScrollTrigger** (free licence since 2025) | about 25 kB gzip core + about 12 kB ScrollTrigger on every page that uses it, so first load goes from ~96 to ~133 kB. That breaks the 100 kB budget unless lazy-loaded | Timeline authoring, pinning helpers | The existing progress-ref pattern (≈1 kB) for the stage, plus native CSS `animation-timeline: view()` with an IntersectionObserver fallback for section entrances. **Decline.** |
| D2 | **framer-motion 11** | about 34 kB gzip (`motion`), or about 20 kB with `LazyMotion` + `domAnimation`, on every client component that uses it | Springs, layout animations | CSS `linear()` spring curve (`--tnc-ease-pop`) and WAAPI for the two stateful animations (sticker settle, toggle). **Decline** (and the repo rule stands). |
| D3 | **Lenis** smooth scroll | about 4 kB gzip | "Buttery" scroll feel | Native scroll. Lenis hijacks wheel and keyboard scrolling, fights `position: sticky` on iOS and reduced-motion users, and is the most common source of "the site feels laggy" complaints. **Decline.** |
| D4 | **@react-three/fiber 8 + drei** | about 45–60 kB gzip on the lazy chunk, plus a re-architecture of the scene | Declarative scene, helpers (RoundedBox, Text) | Vanilla three (already in use): ExtrudeGeometry, TubeGeometry, CanvasTexture. **Decline.** |
| D5 | **sharp** (devDependency) | 0 kB client; about 30 MB install with prebuilt libvips | Local resize/encode/grade | Unsplash's imgix renditions (verified AVIF/WebP). **Decline unless** the founder's own photos (Q3) arrive. Then accept sharp as a **devDependency only**, because those photos won't be on a CDN. |
| D6 | **Lighthouse** CLI | about 80 MB devDependency | Standard scores | `scripts/vitals.mjs` on the existing Playwright + CDP (LCP, CLS, throttling). **Decline.** |
| D7 | **New font families** (Bricolage Grotesque, Alexandria, Caveat, Aref Ruqaa via `next/font/google`) | 0 npm; about 120–170 kB woff2 per language page | The new type voice | n/a. This is a **brand decision**, not a package, and it needs the founder's yes (Q1). |

**Contract changes: none.** The `POST /api/public/order` body, `plans.js` shape (`GET /api/public/plans` mirror), and env names are unchanged. `docs/contracts/` is empty and stays empty.

---

## 10. Perspectives checklist

1. **Functional fit:** covers all five buyers (§4.2), every existing page, the three CTA destinations and the Order journey. **Not covered:**
   - a live price feed (backlog, untouched);
   - testimonials, logos and case studies (none exist, none invented);
   - a theme toggle (parked);
   - Gulf-specific photography (gap, Q3).
2. **Data model:** no db/ and no schema. The only "data" is static: `media.json` (generated manifest) and copy modules. The data-engineer was not consulted because nothing touches db/.
3. **API/contract surface:** nothing in `docs/contracts/` freezes or changes. Internal module boundary change: content split into per-page modules, with the same `dict` shape, so `llms.mjs`, `keys.test.mjs` and every screen keep working. Blast radius: `src/content/index.js` only. `site.js` `PAGES` gains `credits`, which flows into sitemap, hreflang and llms automatically.
4. **Security & auth:**
   - no auth and no secrets;
   - the media script uses only public endpoints and no key;
   - CSP unchanged, no new runtime origins (images self-hosted, fonts self-hosted by next/font);
   - nothing reaches the client that isn't public copy;
   - gitleaks stays in the full gate.
5. **Cost & inventory:**
   - no cloud resources and no inventory change;
   - about 14 MB more static assets in the repo;
   - per-visit transfer rises (Home ≤ 1.6 MB with scroll), well inside Netlify's free tier when it is created (not part of this plan; still a /ship row).
6. **Testability:** the qa-tester asserts:
   - (a) smoke on 22 routes (now including credits): 200, one h1, rtl on /ar, no h-scroll, no console errors;
   - (b) `story.spec`: all 7 act headings are in the **server HTML** (`page.request.get` then parse), the h1 is act 1; under `reducedMotion: 'reduce'` no `<canvas>` exists and 7 stills render; with WebGL removed via `addInitScript`, no canvas, stills shown, no console error; the "Skip the story" link moves focus to `#who`;
   - (c) `media.spec`: every `<img>` has `naturalWidth > 0`, non-empty `alt` unless `aria-hidden`, `srcset` present, and zero requests to non-self image origins;
   - (d) `order.spec`: kind pre-fill → form → review → enquiry fallback message;
   - (e) `npm run check` both themes;
   - (f) `vitals.mjs` budgets (§6.3).
   - Hard to test: "feels warm and smooth". This is not excused; it is gated on the founder (§2).
7. **Deployment shape & topology:**
   - static export, no containers, no migrations, deploy mode manual;
   - `docs/environments.md` created with this plan (local dev, local served build, GitHub Pages manual-only, Netlify planned-not-created; secrets by name only);
   - basePath: `Photo.js` and stills must prefix `NEXT_PUBLIC_BASE_PATH`, and the GitHub Pages build is the check.
8. **Risks:** §11. HARD/EASY + effort tags: §1 and §13.

---

## 11. Risks (top 3 + others)

| # | Risk | Mitigation |
|---|---|---|
| 1 | **Perceived quality:** clay beads plus photos read as gimmicky or cheap, or the scrub feels janky | Walking skeleton (C1) of Acts 1–3, complete with fallbacks, reviewed by the founder on their phone and laptop before any further story work. The kill switch is option C (stills mode): if the 3D fails the review, the stills pipeline already gives a non-WebGL story |
| 2 | **Performance on mid-range Android** (WebGL + large photos + sticky) | DPR cap, bead instancing, 24 beads on phone, runtime frame-probe downgrade to stills, AVIF at 800 w on phone, budgets enforced by `vitals.mjs` (exit 1) |
| 3 | **Arabic voice and cultural fit** (copy, Gulf imagery) | AR copy written as Arabic and reviewed by a native Gulf Arabic copywriter plus the founder (C8 gate). The no-alcohol and no-logo photo rules. Founder-supplied Gulf event photos swap in by slot |
| 4 | Brand drift from the app (decision 57/59) | Token names are kept and the accent values are kept; only neutrals change and site tokens are prefixed. Founder decides (Q1) |
| 5 | Font weight | Two families per language preloaded, the hand face lazy, axes limited (`opsz` only on Bricolage), measured in C0a against ≤ 180/200 kB |
| 6 | Scope size (a whole-site revamp) | Staged chunks with the gate after C1. C2–C6 run in parallel only after the content split |
| 7 | Plain-words ban list is not in this repo | The builder can't check copy against it. Ask the founder to copy `docs/knowledge/plain-words.md` here (Q5). Until then: plain, concrete, no buzzwords |

---

## 12. Copy approach

- **Voice:** a warm colleague who has stood at a lot of stands. Short sentences, concrete nouns (stand, badge, hall, coffee, Sunday), second person, one idea per line. Playfulness comes from the situations (the marathon, "a hundred hellos"), never from puns or exclamation marks. Every claim is either product truth from README/PRODUCT or labelled sample data ("Sample figures"). No invented statistics.
- **Headline system:** one line per screen, at most 9 words, a full stop, no colon headlines. The sub-line is at most 30 words. Stickers carry the specifics. Buttons are verbs ("Start free", "Order for your company", "Talk to a person", "Send a note").
- **Home headlines (EN draft):**
  - h1: *Stay close to the people you meet.* (kept; the founder's tagline)
  - Story: *A three-day show. A hundred hellos.* → *One tap. The moment is kept.* → *Usually, this is where it ends.* → *This time, the thread holds.* → *A year later, they're still around you.* → *Everyone in the hall leaves with more than a badge scan.*
  - Sections: *Pick your side of the stand.* → *One gesture. The assistant does the rest.* → *Trust first. Business follows.* → *The card opens the door. The assistant keeps it open.* → *Your people are yours.* → *Free for the people you meet. Plans for the ones who sell.* → *Go meet someone. We'll remember the rest.*
- **Arabic:** written as Arabic copy in modern standard Arabic with a light Gulf warmth, not translated line by line. The C2–C6 builders draft it; a **native Gulf Arabic copywriter reviews it, then the founder approves it** (C8). Example direction for the reviewer: h1 stays «ابقَ قريبًا ممن تلتقي بهم.»; for "A hundred hellos" use an Arabic image of greetings («مئة سلام وسلام») rather than a calque. Arabic stickers use Aref Ruqaa.

---

## 13. Implementation steps (task-list sized)

**C0a: Foundation (HARD, high; serial first)**
1. Run the Impeccable setup (`impeccable context`), then write the surface brief's direction contract from §3 (Persuade mode). It lives in the brief, not in source.
2. `tokens.css`: retune neutrals; add `--tnc-site-*` colours (light + dark, both selectors) and motion tokens.
3. `tailwind.config.js`: map the new tokens, fonts, durations/easings, radii.
4. `Shell.js`: load Bricolage Grotesque (latin, wght + opsz), Alexandria (arabic), Caveat and Aref Ruqaa (`preload:false`); remove the backdrop.
5. `globals.css`: type scale, buttons (primary = thread-strong), `.sticker`, `.photo-card`, link underline as the thread, themed selection, caret, scrollbar and focus ring (coral); delete `.eyebrow` and `.backdrop`.
6. Create `Thread.js` (SVG path, knots, draw progress via CSS scroll timeline with an IO fallback), `Sticker.js` and `src/lib/motion.js`.
7. Restyle Header (transparent over the story), Footer (+Credits link), Section (no eyebrow), Cta.
8. Measure font bytes per language against budget. Acceptance: `.claude/verify.sh` green; `npm run build`; `npm run check` green on all pages (old screens on new tokens).

**C0b: Content split (EASY, low; parallel with C0a)**
9. Move copy into `src/content/pages/*.{en,ar}.js` without changing words. `index.js` merges them; delete the `*.story.js` files. Acceptance: `npm test` green and `public/llms-full.txt` byte-identical before and after.

**C0c: Media (EASY, medium; parallel)**
10. Write `media.sources.js` (20 slots from §7.2 with focal points) and `scripts/media.mjs`; run it; commit `public/media/**`, `media.json`, `CREDITS.txt`.
11. Create `Photo.js` (basePath-aware). Delete `media-scout.mjs` and its workflow. Acceptance: the script's size check passes, and every slot has avif/webp/jpg.

**C1: Walking skeleton (HARD, high; founder gate)**
12. Rewrite `ScrollStory.js`: stage, 7 act shells (copy for 1–3 final, 4–7 placeholder text from the current story), progress ref + CSS vars, progress thread with anchors, skip link, reduced-motion stacked mode.
13. Rewrite `StoryCanvas.js` + `story/{card,beads,thread,ripple}.js` for Acts 1–3: token colours, RTL mirror, on-screen-only render, frame probe → stills downgrade.
14. Create `scripts/stills.mjs`; generate act stills for both themes; wire the Act 1 still as first paint.
15. Phone tuning (§5.1).
16. Run `npm run acts` and `node scripts/vitals.mjs`, and **put the result in front of the founder** (local URL, plus the shots at `.shots/`). **Stop until the founder says yes.**

**C2: Home complete (HARD, medium)**
17. Acts 4–7 in the scene and the copy; final EN copy for all acts; regenerate stills.
18. Home sections 2–8 (§4.3): doors mosaic with Photo + Vignette stickers, loop on the thread, `YearTimeline` on the thread, `TapCard3D` restyle, privacy list, pricing teaser from `plans.js`, final ask. Remove the numbers section.
19. AR draft copy for Home.

**C3: Buyer pages (EASY, medium)**
20. `Persona.js` template (§4.4), `Faq.js` restyle; copy for 5 pages EN + AR draft; photos per slot; JSON-LD unchanged.

**C4: How it works (EASY, medium)**
21. Chapters on the thread, day strip, capture tiles with CSS flip, working toggle; copy EN + AR draft.

**C5: Pricing + Order (EASY, medium)**
22. Write `tests/e2e/order.spec.mjs` first and run it green on the current UI.
23. Restyle `Pricing.js`, `PricingTabs.js`, `Order.js` and `OrderFlow.js` (classNames and wrappers only). Acceptance: `order.test.mjs` + `order.spec.mjs` + `npm run flow` all green; `git diff src/lib/order.js` is empty.

**C6: Trust, 404, Credits (EASY, low)**
24. Trust ledger + UAE photo; 404 with the thread; Credits page from `media.json`; add `credits` to `PAGES`; EN + AR copy.

**C7: Surfaces and checks (EASY, medium)**
25. `og.mjs` → `og.png` + `og/<page>-<lang>.png`; `seo.js` per-page OG.
26. `llms.mjs` skips alt keys and lists Credits.
27. `vitals.mjs`; `story.spec.mjs` and `media.spec.mjs`; smoke list + `check.mjs` add `/credits/`; `acts.mjs` 7 stops; `package.json` scripts.

**C8: Arabic review (human gate)**
28. A native Gulf Arabic copywriter edits every `*.ar.js` page module; the founder approves; key parity re-checked.

**C9: Polish and documentation (EASY, medium)**
29. `/impeccable critique` then `polish` on Home, one buyer page and Pricing (both themes, both languages, 390/1280).
30. The Impeccable documenter writes `DESIGN.md` + `.impeccable/design.json`.
31. The lead updates README (Design + Performance sections), PRODUCT.md (Brand Commitments: Kept Thread), the CLAUDE.md stack line (fonts), and BUILD_STATUS.md.
32. `graphify update .`

---

## 14. Acceptance

**Command (from the repo root, after `npm ci`):**
```
.claude/verify-full.sh \
 && (npx serve out -l 4410 >/dev/null 2>&1 &) && sleep 2 \
 && npm run check -- http://localhost:4410 .shots \
 && npm run flow  -- http://localhost:4410 .shots \
 && npm run acts  -- http://localhost:4410 .shots \
 && node --no-warnings scripts/vitals.mjs http://localhost:4410
```

**Criteria:**
1. All of the above exit 0. That covers unit (order rules + EN/AR key parity), lint, build, Playwright e2e (smoke on 22 routes × desktop/phone, `story`, `media`, `order`), gitleaks, `check` (every page × EN/AR × phone/desktop × light/dark: no console error, no h-scroll at 390/1280, one h1), `flow`, and `vitals` budgets (§6.3).
2. The Next build report shows first-load JS ≤ 100 kB on every route, and the 3D lazy chunk ≤ 100 kB gzip.
3. `git diff --stat src/lib/order.js` is empty, and `plans.js` is unchanged except through an approved price update.
4. No price or claim appears outside `plans.js` / README / PRODUCT truth (reviewer grep for `AED` and digits outside the allowed modules).
5. Every page's full text is in the static HTML (story spec), with nothing injected by script.
6. **User-observable outcome:** on the founder's phone, a first-time visitor sees what it is, who it's for and both CTAs in the first viewport, can scroll the 7-act story smoothly, and can reach any buyer page and the Order page in at most 2 taps.
7. **Human gates passed:** founder yes on the C1 walking skeleton, native Arabic review signed off (C8), founder yes on the final build.

**Parked (not in this plan; would be REQs):** a theme toggle; OG images for every route; a Gulf event photo shoot; a live price feed; a CMS for copy.

---

## 15. Assumptions

1. The founder accepts retuned warm neutrals and the coral primary CTA while the petrol accent and every token name stay shared with the app (Q1).
2. The Unsplash download endpoint and the `images.unsplash.com` renditions (w/h/fit/crop/fm/q, focal point) keep working as verified on 2026-10-25. If not, D5 (sharp devDependency) is the fallback.
3. The Unsplash License (free commercial use, no attribution required, no selling unaltered copies) covers this use; credits are a courtesy.
4. Next 14.1.3's bundled Google font list (verified) is what `next/font` downloads at build. The build machine has network at build time, as it does today for IBM Plex Sans Arabic.
5. Native CSS scroll-driven animation is a progressive enhancement only; every effect has an IntersectionObserver or static fallback.
6. "Layla", "Omar", "Gulf Tech Expo" and all vignette figures remain clearly labelled sample content.
7. No backend, analytics or order-contract change is needed; `story_beat` values changing to act-1…7 is harmless (no consumer yet).
8. A native Gulf Arabic copywriter is available to review (otherwise C8 blocks the AR release; EN can be reviewed first).
9. The build machine keeps Playwright Chromium available for `stills`, `og`, `check`, `acts` and `vitals` (as today).
10. Deployment stays manual. Nothing in this plan publishes anything.

## 16. Open questions (only the founder can answer)

- **Q1.** Kept Thread retunes the Gulf Water neutrals (decision 57/59) and makes the primary button coral, while keeping the petrol accent and all shared token names. Yes, or keep the Gulf Water neutrals exactly?
- **Q2.** Do you approve the new type: Bricolage Grotesque (EN display), Alexandria (AR display), and Caveat / Aref Ruqaa for handwritten notes, with Geist and IBM Plex Sans Arabic kept for reading?
- **Q3.** Can you supply 6–10 photos from your own Gulf events (GITEX and similar, with consent)? Unsplash has almost none. If yes, sharp comes in as a devDependency to process them (D5).
- **Q4.** The "47 days before a warm lead goes quiet" and "100+ people per show" numbers have no source in the repo. Drop them (the plan's default), or send the source?
- **Q5.** Please copy `docs/knowledge/plain-words.md` from the docs repo into this repo so builders and reviewers can check copy against the ban list.

---

## 17. Amendment A1: the network, the assistant, the value (founder feedback at the C1 review, 2026-10-25)

**Founder's ask:** one thread between two people undersells the product. Show more people joining into a **graph**, the graph settling into **circles**, many circles seen **from one person's point of view**, the **AI assistant saying the right thing at the right time** to strengthen those relationships (TapNConnect as the *relationship OS*), and **what each buyer gains** (organiser, sponsor, exhibitor, company, individual) clearly on the landing page.

### A1.1 Story, now 8 acts (acts 1–3 unchanged from C1)
| Act | p | On screen / 3D | Copy (EN draft) |
|---|---|---|---|
| 1 · Who it's for | 0–0.08 | as C1 | *Stay close to the people you meet.* |
| 2 · The hall | 0.08–0.19 | as C1 | *A three-day show. A hundred hellos.* |
| 3 · The touch | 0.19–0.31 | as C1: one tap, one thread | *One tap. The moment is kept.* |
| 4 · The fade (shortened) | 0.31–0.39 | the crowd greys and drifts; only your thread keeps colour | *Usually, this is where it ends.* |
| 5 · **Every tap, a thread** | 0.39–0.52 | the hall comes back in colour; you tap more people (Sara, Yusuf, a mentor, a client…); a thread draws to each; people you met meet **each other** (introduction threads between nodes): a **graph** forms | *Every tap adds a thread. Soon it's a web.* |
| 6 · **Your circles** | 0.52–0.65 | the graph settles into rings round you, each ring a circle with a hand-written label: *clients · mentors · friends · your team* | *From where you stand, it's your circles.* |
| 7 · **The right word, at the right time** | 0.65–0.82 | sun-coloured pulses travel along threads to one person at a time; a sticker pins at each: Omar's marathon (Sunday) → Sara's promised scope (Thursday) → Yusuf's new job (congratulate) → "Omar can introduce you to Huda" (intro). Each sticker has its *why* line | *Your assistant knows who needs a word today, and writes it. You say yes.* |
| 8 · **Everyone's graph** | 0.82–1.0 | the camera pulls back: your graph is one of many across the hall, linked by shared people; the organiser's view of the whole event's relationship graph | *One hall. Thousands of threads. Everyone leaves with more than a badge scan.* |

Stage height: 760vh desktop / 560vh phone. The progress thread has 8 knots. Stills: 8 per language × theme × orientation.

**3D additions (C2):** about 12 "kept" people around you, plus 4–6 introduction edges between them (tubes, instanced draw where possible); ring layout per circle (3–4 rings, a clay colour per circle); assistant pulses (instanced sun sprites travelling the curves; time-based in the live scene, a fixed position in stills); act 8 adds 6–10 ghost graphs (instanced, low detail) linked by a few long threads. Budget unchanged: frame p95 ≤ 20 ms on GPU, lazy 3D ≤ 155 kB gzip.

### A1.2 New Home section after the story: "What everyone gains"
It replaces the old "Who it is for" doors (§4.3 item 2) and merges the loop section (item 3) into it. For each buyer:
1. a photo card;
2. **the gain in one line**;
3. three concrete outcomes taken from the buyer page's `outcomes` (product truth, not new claims);
4. the buyer's product vignette as a sticker;
5. its CTA.

Order and lines (EN draft):
- **Visitors and professionals:** *A circle that lasts, and an assistant that remembers for you.* Remember · Prepare · Act · Strengthen.
- **Exhibitors:** *Accounts, not scan lists. The Monday hand-over, done by Friday.*
- **Sponsors:** *What your sponsorship delivered, counted honestly, and the people who tapped kept in your circle.*
- **Organisers:** *Prove the relationships your event created, and sell the next edition with it.*
- **Companies:** *Relationship memory that stays when people move on.*

On wide screens this is a sticky left rail of the 5 buyers with the content scrolling on the right. On phones it is stacked cards. Each buyer's block ends with its order or start-free CTA.

### A1.3 Relationship OS framing
Hero sub-line and meta description name the category in plain words: *TapNConnect is the relationship OS for events and the people in them: every tap becomes a thread, and an assistant keeps each one alive.* The footer line stays *The human layer of the agent internet.* The founder confirms the wording.

**Approved 2026-10-25:** A1 as written; category wording = *relationship OS* (A1.3 sentence).

### A1.4 Effects on C2
C2 now covers: acts 4–8 (3D + copy), the "What everyone gains" section, Home sections 3–8 restyled, and stills regenerated (8 acts). C3–C6 are unchanged. Acceptance is unchanged, plus `acts.mjs` with 8 stops.
