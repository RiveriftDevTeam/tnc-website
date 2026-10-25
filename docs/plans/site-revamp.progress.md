# Progress: site-revamp

Task list for docs/plans/site-revamp.md §13. No task-list tool in the 2026-10-25 session, so `.claude/verify.sh` runs by hand at each chunk boundary.

| # | Item | Chunk | Owner | Status |
|---|---|---|---|---|
| 1 | Impeccable context + direction contract | C0a | lead | done |
| 2 | tokens.css retune + site tokens + motion tokens | C0a | lead | done |
| 3 | tailwind.config.js | C0a | lead | done |
| 4 | Shell.js fonts, backdrop removed | C0a | lead | done |
| 5 | globals.css type/buttons/sticker/thread | C0a | lead | done |
| 6 | Thread.js, Sticker.js, motion.js | C0a | lead | done |
| 7 | Header, Footer, Section, Cta restyle | C0a | lead | done (Footer Credits link moves to C6 with the page) |
| 8 | Font bytes measured; C0a acceptance | C0a | lead | done: EN 108 kB / AR 156 kB woff2; verify, build, check, e2e 40/40 green |
| 9 | Content split into pages/*.{en,ar}.js | C0b | builder-c0b-content | done |
| 10 | media.sources.js + media.mjs + downloads | C0c | builder-c0c-media | done: 19 slots, 163 files, 17 MB; door-sponsors → EVgsAbL51Rk (brands); quality steps down to meet size caps |
| 11 | Photo.js; media-scout removed | C0c | builder-c0c-media | done (fetchpriority lowercased by lead) |
| 12 | ScrollStory rewrite (stage, acts, progress thread, skip, reduced motion) | C1 | lead | done |
| 13 | StoryCanvas + story/* acts 1–3 | C1 | lead | done (acts 4–7 hold the act 3 pose until C2) |
| 14 | stills.mjs + first paint | C1 | lead | done: 56 stills (2 langs × 2 themes × landscape/portrait), 2.4 MB |
| 15 | Phone tuning | C1 | lead | done: 24 people, DPR 1.25, no rim, card higher/smaller in portrait |
| 16 | acts + vitals → **founder gate** | C1 | lead | vitals green; WAITING for founder |
| 17–19 | Home complete (acts 4–7, sections, AR draft) | C2 | | blocked on gate |
| 20 | Buyer pages | C3 | | blocked on gate |
| 21 | How it works | C4 | | blocked on gate |
| 22–23 | order.spec + Pricing/Order restyle | C5 | | blocked on gate |
| 24 | Trust, 404, Credits | C6 | | blocked on gate |
| 25–27 | OG, llms, vitals, specs | C7 | | blocked |
| 28 | Arabic review | C8 | human | blocked |
| 29–32 | Polish, DESIGN.md, docs, graph | C9 | | blocked |

## Open after C1 (carry into C2)
- First-load JS on Home is **102 kB** (budget 100). The extra is chunk 733 (Home's old sections: Reveal, lucide, TapCard3D). C2 rewrites those sections; re-measure there.
- `story-hall` (KVvEpFVq_-U) shows book-fair publisher signs (Macmillan, Ingram, Estonia). Shown blurred under a 55% field wash; swap the photo (founder's own, or a reserve). Source is only 1280 px wide, so it is soft on retina.
- `story-circle` has people holding glasses (no-alcohol rule); `door-exhibitors` is a weak tight crop. Both are C2/C3 slots, so decide before then.
