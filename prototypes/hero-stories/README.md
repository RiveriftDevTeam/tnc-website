# Hero story prototypes

Standalone three.js mocks for the landing hero and the buyer stories, made on 2026-10-27 to settle the
direction before building it into the site. They are not part of the Next build (nothing here is under
`src/` or `public/`) and they never ship. Each page loads the project's pinned three
(`node_modules/three`, 0.186.1) and Google Fonts, so serve from the repo root after `npm ci`:

```sh
python3 -m http.server 4477
# http://localhost:4477/prototypes/hero-stories/member-story.html
```

Every page takes `?t=SECONDS` (one still frame), `?scene=N` (story pages), `?theme=dark`, follows
`prefers-reduced-motion`, and tilts gently with the cursor. Story pages have scene chips and pause at the
bottom left and a Member / Company / Organiser / Sponsor switcher in the header. All names, companies,
the event and every number are fictional; numbers are labelled "Sample". The word "contacts" is never
used on screen: it is "relationships".

## The chosen direction: four story films

| Page | Story |
|---|---|
| `member-story.html` | Handshakes fill a phone (Work / Personal) → six months later rows are swiped "Lost touch", only 2 of 127 reach the CRM, goal in a thought bubble → the AI assistant and its helper agents (Remember, Reconnect, Introduce, Plan) rope them back → a relationship graph and one-at-a-time suggestions → the same six months, all warm, goal done → everyone in the hall gains |
| `company-story.html` | A stuck sales team at a glass tower → the assistant plans who to meet → handshakes on the stand and on the floor land in one pipeline → nurture Met → Client, follow-ups wait for a yes → new clients light up the tower |
| `organiser-story.html` | A busy hall → the empty hall, "What did we actually achieve?" → every conversation lifts into a who-knows-who map and a dashboard → seasons later it is still counting → KPIs: by exhibitor, by sponsor, industry match, top connectors |
| `sponsor-story.html` | The sponsor pays, "What will I actually get?" → banners nobody can measure → the sponsor strip inside every shared profile card → views, clicks and leads counted → a report worth renewing |

Open issues before the build: the clay figures read as wooden mannequins, ropes cross screens diagonally,
a few label overlaps, and button pairs differ per story (decide one rule).

## Parked for other sections

| Page | Use |
|---|---|
| `cards.html` | The pile of business cards fading over six months, one card coming back. Planned for the "one tap / the card is the door" section. |
| `contacts.html` | The phone whose rows drift away; its phone model is the one the story films use. |

## Explored and rejected (`explored/`)

Kept as a record of what the founder turned down, so it is not proposed again.

| Page | Direction | Why it was rejected |
|---|---|---|
| `web-stills.html`, `living.html` | Clay people joined by threads, an assistant pulse warming quiet ones | Read as a blood-donation graphic: people-and-lines is a cliché |
| `loom.html` | Sadu cloth weaving itself, a shuttle as the assistant | Did not land |
| `islands.html` | Islands drifting apart at dusk, a dhow towing them back | Did not land |
| `majlis.html` | Finjan cups going cold, the dallah pouring | Did not land |
