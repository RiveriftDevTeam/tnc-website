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
| 16 | acts + vitals → **founder gate** | C1 | lead | done: founder reviewed 2026-10-25, asked for Amendment A1 (graph, circles, assistant, value) → approved |
| 17–19 | Home complete (acts 4–8 per A1, What everyone gains, sections, AR draft) | C2 | lead | done (84fe360, ca5fb12) |
| 20 | Buyer pages | C3 | builder-c3-personas | done (576cbd8, merged d6162a1) |
| 21 | How it works | C4 | builder-c4c6 | done (197400a, merged d9bdcb5) |
| 22–23 | order.spec + Pricing/Order restyle | C5 | builder-c5 | done (9f03272, merged 481c7aa); order.js and plans.js diff empty |
| 24 | Trust, 404, Credits | C6 | builder-c4c6 | done (197400a) |
| 25–27 | OG, llms, vitals, specs | C7 | lead | done (840b299): og.png + 12 per-page images, story/media specs, credits in checks |
| 28 | Arabic review | C8 | human | **open: needs a native Gulf Arabic copywriter + founder** |
| 29–32 | Polish, DESIGN.md, docs, graph | C9 | lead | done except DESIGN.md (finish review: 8 fixes applied, 0be453d); docs + graph updated |

## Open items (updated after C2–C7)
- ~~First-load JS on Home 102 kB~~: fixed in C2 (TapCard3D CSS-only): Home 99.8 kB.
- `story-hall` (KVvEpFVq_-U) shows book-fair publisher signs (Macmillan, Ingram, Estonia). Shown blurred under a 55% field wash; swap the photo (founder's own, or a reserve). Source is only 1280 px wide, so it is soft on retina.
- `story-circle` (glasses) removed from the story. `how-organiser` also shows wine glasses (How it works, organiser pages). `door-exhibitors` is a weak tight crop. Founder's own Gulf event photos would fix all of these (Q3).
- 404 keeps one h1 per language block (two h1s), as scripts/check.mjs expects; a single h1 would need the check relaxed.
- `personas.hero.seeInside` key is unused (harmless, EN/AR parity holds).

## Amendment A2 (2026-10-25)
| Item | Owner | Status |
|---|---|---|
| D1 Lagoon palette + shore + particles | lead | done (e2e0e7f) |
| D2 calmer photos (15 replaced) + hero/how video loops | builder-d2-media | done (49afe5d, merged) |
| D3 How "At an event" scroll story | builder-d3d4 | done (faa115b, merged) |
| D4 buyer-page scroll journeys ×5 | builder-d3d4 | done (faa115b, merged) |
| D5 integration: hero + How video, alt texts, stills + OG in Lagoon, full acceptance | lead | done |
