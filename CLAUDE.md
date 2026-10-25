# tnc-website — project operating rules (read every session)

TapNConnect public product website (`tapnconnect.ae`): the story, how it works,
who it is for, the one price list, and the Order page with its sales assistant.
README.md is the detailed product/design reference; this file is the rulebook.

## Stack (pinned — do not substitute)
- Node 22 (`.nvmrc`, `engines.node`, Netlify `NODE_VERSION`)
- Next.js 14.1.3, App Router, **JavaScript (no TypeScript)**, `output: 'export'`
  (static HTML in `out/`, `trailingSlash: true`, `images.unoptimized`, basePath
  from `NEXT_PUBLIC_BASE_PATH`) — nothing runs on a server
- React 18.3.1 / react-dom 18.3.1
- Tailwind CSS 3.4.19 + PostCSS 8.5.31 + autoprefixer 10.6.1; design tokens in
  `src/styles/tokens.css` (Gulf Water — same names as the app's tokens)
- three 0.186.1 (vanilla, the scroll-scrubbed landing scene; loaded on idle)
- lucide-react 1.61.0 (only icon set) · fonts via next/font in `src/fonts/{en,ar}.js` (one module per
  language so each preloads only its faces): Bricolage Grotesque + Alexandria (display), geist 1.8.2 +
  IBM Plex Sans Arabic 400 (reading), Caveat 600 + Aref Ruqaa 400 (handwritten notes only)
- Design world "Kept Thread" (docs/plans/site-revamp.md §3): tokens in `src/styles/tokens.css`
  (`--tnc-*` shared with the app, `--tnc-site-*` site-only), `Thread`/`Knot`, `Sticker`, `Photo`
  components; story scene in `src/components/StoryCanvas.js` + `src/components/story/*`
- ESLint 8.57.1 + eslint-config-next 14.1.3 (`next/core-web-vitals`)
- Tests: Node built-in `node:test` (`src/lib/*.test.mjs`, `scripts/*.test.mjs`)
- E2E: @playwright/test 1.64.1 (devDependency, chromium), `playwright.config.mjs`,
  specs in `tests/e2e/*.spec.mjs` (smoke, story, media, order) against the served static build
  (port 4420, or `E2E_PORT`)
- Browser checks: `scripts/check|flow|acts.mjs` via `scripts/pw.mjs` (resolves
  the project's `playwright` first, then global installs)
- **No framer-motion on this site** (CSS transitions only), no analytics SDK in
  the bundle (GTM loads only after consent). These override the plugin's
  frontend-boilerplate defaults (Vite/TS/framer-motion/shadcn) for this repo.
- Structure: `src/app/(en)` + `src/app/(ar)` (two root layouts, Arabic RTL under
  `/ar/…`), `src/screens/` (page bodies), `src/components/`, `src/content/`
  (copy per language + `plans.js` price list + `site.js` addresses),
  `src/lib/` (pure logic: order, seo, analytics), `scripts/` (build + checks)

## Commands (verified working)
- Install: `npm ci`
- Dev: `npm run dev` → http://localhost:4410
- Unit tests (FAST, ~0.2s): `npm test` — order pricing rules + EN/AR key parity
- Lint (~3s): `npm run lint`
- Build (~15s): `npm run build` — prebuild writes `public/llms.txt` +
  `llms-full.txt`; postbuild copies `out/404.html`
- Serve the build: `npm start` (`npx serve out -l 4410`)
- E2E (~15s after a build): `npx playwright test` — serves `out/` itself on
  :4420; desktop + phone; fails on any console error
- Browser checks against a served build:
  `npm run check -- http://localhost:4410 .shots` (every page × EN/AR × phone/desktop × light/dark),
  `npm run flow -- http://localhost:4410 .shots` (Order page end to end),
  `npm run acts -- http://localhost:4410 .shots` (landing story frames)
- Photos: `npm run media` (Unsplash → `public/media/`, credits); story stills: `npm run stills -- <served url>`;
  social images: `npm run og -- <served url>` (both write into public/, so rebuild after)
- Budgets: `npm run vitals -- <served url>` (LCP, CLS, fonts, story frame time; exit 1 over budget)
- Fast gate (~2s): `.claude/verify.sh` (unit + lint)
- Full gate (~30s): `.claude/verify-full.sh` (unit + lint + build + e2e + `gitleaks detect`)
- Design review: Impeccable skills in `.claude/skills/impeccable` (`/impeccable critique|audit|polish …`);
  product context in `PRODUCT.md`

## Project rules (from the codebase)
- **One price list:** `src/content/plans.js` is the only place a price or
  "what you get" line exists. Never hard-code a price elsewhere. Unpriced items
  stay `null` → "priced per order" → a person; never invent a number.
- **Two languages, always:** every copy key lives in BOTH `src/content/en.js`
  and `src/content/ar.js` (`scripts/keys.test.mjs` fails otherwise). Arabic is
  RTL with Latin digits.
- Copy follows the plain-words ban list (`docs/knowledge/plain-words.md` in the
  TapNConnect docs repo).
- Photos are served from the site only (`Photo` component, basePath-aware); CSP `img-src 'self'`.
  No legible third-party brands and no alcohol in frame (plan §3.6).
- Every page: one `h1`, full text in the HTML (nothing injected by script), no
  console errors, no horizontal scroll at 390 px and 1280 px, both themes.
- Respect `prefers-reduced-motion` / `prefers-reduced-transparency`; the 3D
  scene must keep its CSS first paint and text alternative.
- Order page logic stays pure and unit-tested in `src/lib/order.js`; UI in
  `src/components/OrderFlow.js`. Backend contract is in README "The Order page".
- Public env names only (`NEXT_PUBLIC_*`, see `.env.example`); values live in the host's env.

## Where truth lives
- Upstream requirement: REQ-002 product website (`docs/requirements/REQ-002-product-website.md`
  in the TapNConnect docs repo); design notes in that repo's `docs/design/`
- Product spec: `docs/spec.md` (not yet written — README.md is the current description)
- Requirements queue: `docs/requirements/REQ-NNN-*.md` — parked user asks
  with status (parked -> planned -> built); /discover appends, /architect
  promotes to plans, lanes flip to built on completion
- Technical spec: `docs/tech-spec.md`
- Feature briefs: `docs/features/F-XX-*.md` (one file = one agent's work)
- Contracts (types, API schemas, DB schema): `docs/contracts/` — FROZEN once a
  build starts; changing one requires stopping and asking the user
- Environments map: `docs/environments.md` — env | resource group |
  sources | sinks | promotion rule (architect owns; secrets by NAME only)
- Current state: `BUILD_STATUS.md` — the "Not wired yet" list is the backlog
- Runtime telemetry: `.claude/telemetry/` — usage.jsonl + gates.jsonl written
  by hooks, read by /usage and /retro; never hand-edit, never commit
- Reference implementations: `/reference/<integration>/` — cloned examples
  for HARD integrations; the integration-specialist works reference-first
  and STOPS if the needed reference is missing

## GRAPH PROTOCOL
- Query the Graphify graph (`graphify-out/graph.json` via the graph tools)
  to build context; do NOT crawl the repo.
- After completing any feature or fix, re-index via the /graphify skill
  (uses this session's model — never configure an external LLM key) or
  `graphify update .` (local AST, no LLM — on this machine's graphify,
  `graphify extract . --code-only` asks for a key; use `update`). If graphify
  ever prompts for an API key, wrong mode — switch, don't supply a key.
- The graph update is part of the task, not optional.

## Bundled tools (always available)
- context7 MCP (bundled with the plugin): resolve current, version-correct
  library/API docs BEFORE using any fast-moving SDK (Azure, Foundry, React
  ecosystem) — never code against remembered API signatures for these.
- markitdown CLI: convert any docx/pdf/pptx/xlsx the user provides to
  markdown once (`markitdown <file> -o <out>.md`); work from the markdown.
- semgrep: the code-reviewer's scanner — review findings are grounded in
  `semgrep scan` output, not judgment alone.
- gitleaks: secret gate — runs in verify-full and blocks /ship on any
  finding. A committed secret means rotate + purge before anything ships.
- duckdb: data-engineer's local lab — silver/gold transforms are proven
  against sample data locally before touching any cloud workspace.

## Hard rules
- NEVER create a cloud resource that is not in the inventory below. Any
  resource not listed is a bug, not initiative.
## DEPLOYMENT MODE: manual   <!-- kit-init default: manual -->
Full rules: the plugin's `deployment` skill DELIVERY PROTOCOL (the single
source). Summary: every lane ends with the app running LOCALLY, URL shared.
manual -> deploy only on the user's explicit yes. auto -> 100% green e2e
auto-deploys CODE to existing Azure resources (smoke checks, auto-rollback,
BUILD_STATUS.md log); any INFRA delta or DB MIGRATION always requires
explicit user approval — auto moves code, never money or schemas.
- Deploy only after explicit user confirmation of the resource plan table
  (resource | SKU | purpose | est. monthly cost). Teardown only via
  /teardown's hard confirmation. Never deploy or delete silently.
- The GitHub Pages workflow (`.github/workflows/pages.yml`) is manual-only on
  the founder's ask (2026-10-25). Do not restore the push trigger or dispatch
  it without an explicit yes.
- A task is complete ONLY when its acceptance command passes. Show the output.
- Touch ONLY files listed in your feature brief's ownership section. Need a
  foreign file? Message the lead — do not edit it.
- New dependencies require asking the user first.
- Schema changes (db/) go through the data-engineer agent: migration file +
  updated contract, or a rejection with the reuse alternative. Feature work
  never contains ad-hoc DDL.
- Frontend definition of done: dev server runs, target screen renders, browser
  console has zero errors.
- Never commit `.env` files.
- LESSON CAPTURE: whenever the user corrects your approach ("no, always
  X", rejects a plan element, adds a missing step) OR says "lesson: ...",
  append one row to `docs/lessons.md`:
  | date | lane | what happened | correction | suggested target file |
  Log the correction, not the whole story. /retro folds these into the
  plugin's doctrine with the user's approval.
- TELEMETRY MARKER (lead session ONLY — spawned agents NEVER write it; a
  shared marker under parallel writers is exactly the misattribution bug):
  when starting or switching lane work, write
  `.claude/telemetry/context.json`: {"lane","phase","plan_id","feature_id",
  "updated_at"} (nulls allowed).
- SPAWN LOG: before spawning any agent, the lead appends ONE line to
  `.claude/telemetry/spawns.jsonl`:
  {"ts","label","agent_type","feature_id","plan_id","lane","phase"} where
  label = the EXACT spawn name (telemetry joins that agent's tokens on it);
  feature_id only for feature builders, null otherwise. Append-only — never
  rewrite the file. Missing marker or log is fine — events fall back to
  "unattributed", never break.
- NEW-TOOL RULE: if an installed plugin/MCP tool looks useful for the current
  task but no skill in the agentic-team plugin defines HOW to use it, ASK the
  user before first use (what it is, why you want it, proposed usage rule).
  On approval, use it and append the decision to `docs/toolbox.md`
  (tool | when to use | rules). /curate reads toolbox.md and formalizes
  recurring entries into plugin skills.

## Cloud resource inventory (COMPLETE list)
No cloud resources authorized yet — /ship defines them.
(No `infra/` folder. Existing non-Azure hosting config, for context only:
`netlify.toml` — Netlify static site, build `npm run build`, publish `out`, not
yet created; GitHub Pages workflow — manual dispatch only. README's planned
/ship row: Netlify site `tnc-website` (free tier), domain `tapnconnect.ae`
via Cloudflare DNS-only, GTM container id, Turnstile site key.)

## DISPATCHER PROTOCOL (main session — you are a router, not a builder)
When the user types a freeform request (no slash command), NEVER start
implementing directly. Classify first, in one short block:
- INTENT: question | quick fix | feature | prototype | build-scale work
- COMPLEXITY: EASY | HARD (same criteria as /build Phase 4)
- EFFORT: low | medium | high (thinking budget the work needs)
Then route: question -> answer directly (no agents). Quick fix -> /fix
(its triage takes over). Feature-shaped -> /feature. Prototype-shaped
(clickable demo/mockup, frontend-only, hardcoded data) -> /concept
(needs docs/spec.md; otherwise /discover first). Build-scale -> tell
the user to run /discover or /build. Show the routing line
("-> /feature | EASY | effort: low") before proceeding so the user can
overrule. Implement in the main session ONLY if the user explicitly says
"just do it here". A one-line CSS tweak does not deserve frontier
attention at high effort — route it.

## Model routing
- Planning, tech spec, decomposition, HARD features, 2-strike escalations:
  frontier model (Opus/Fable class — whatever the lead session runs).
- EASY features, tests, boilerplate, docs: default teammate model — set the
  cheap tier (Haiku class) in /config once; Sonnet class if quality slips.
- HARD/EASY is tagged per brief by the lead during decomposition (criteria in
  /build Phase 4); the user can overrule any tag at the approval gate.
- EFFORT is tagged per brief/task alongside HARD/EASY and set on the spawned
  agent (effort: low | medium | high):
  low = mechanical (boilerplate, config, styling, copy, simple CRUD);
  medium = standard feature logic, tests, refactors within one module;
  high = algorithms, architecture seams, integrations, debugging unknowns.
  Spawn combos: EASY+low/medium -> cheap model at that effort;
  HARD -> frontier at medium/high; 2-strike escalations -> frontier + high.
- 2-strike rule: two failed attempts on any task -> stop, escalate to the lead
  with the error output. Never attempt a third identical retry. Reassignment
  goes to a FRESH frontier teammate with the error history. On each strike-out
  append {"ts","type":"two_strike","task":"..."} to .claude/telemetry/gates.jsonl.
