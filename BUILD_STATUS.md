# BUILD_STATUS — tnc-website

_Last updated: 2026-10-25 (kit-init). Source: README, git log (4 commits, latest `7b689ec`), local runs._

## Runs locally (verified 2026-10-25)
| What | Command | Result |
|---|---|---|
| Install | `npm ci` | ok (npm audit reports advisories, not triaged) |
| Unit tests | `npm test` | 5/5 order-rule tests pass + EN/AR key parity, ~0.2s |
| Lint | `npm run lint` | no warnings or errors |
| Build | `npm run build` | ok, static export to `out/`, first-load JS ~95–97 kB per page |
| Dev server | `npm run dev` | 200 on http://localhost:4410 |
| E2E smoke | `npx playwright test` | 40/40 (20 pages × desktop/phone): status 200, one h1, RTL on /ar, no h-scroll, no console errors |
| Full gate | `.claude/verify-full.sh` | green in ~27s, gitleaks: no leaks |
| Order flow script | `npm run flow` | every step ok. One `net::ERR_FAILED` on the real order POST isn't in the script's ignore list, so the script reports 1 problem |

Built pages (EN + AR): Home (scroll-driven 3D story), How it works, 5 persona
pages (organisers, exhibitors, sponsors, companies, individuals), Pricing (3 tabs),
Order (sales assistant → form → review → pay), Trust, bilingual 404; sitemap,
robots, JSON-LD, `llms.txt` / `llms-full.txt`, OG image.

## Deployed
Nothing live on a production domain.
- GitHub Pages workflow exists (`riveriftdevteam.github.io/tnc-website`), but has been
  **manual-dispatch only since 2026-10-25** (founder's ask). Whether a past run is still served is not verified.
- Netlify (`netlify.toml`) is configured but no site exists yet. That needs a /ship row and the founder's yes.
- No `infra/` folder, no Azure resources.

## Not wired yet (backlog)
1. **Order submit backend.** `POST {BACKEND}/api/public/order` doesn't exist. The page shows the
   "Couldn't send the order" fallback. Backend work lives in another repo, but this site may need contract updates.
2. **Licence document upload.** The file is chosen in the browser but never sent. Waiting on multipart or a signed upload URL.
3. **Cloudflare Turnstile** in front of the order submit and sales chat (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` unset).
4. **Live price list.** `src/content/plans.js` uses the founder's sample values (2026-10-14). Swap it for `GET /api/public/plans`.
   Seats, the company plan, event packages and sponsor tiers are still `null` (priced per order).
5. **Backend sales agent.** `POST /api/public/sales` returns 404 until `SALES_AGENT_ENABLED=true`. The scripted assistant answers until then.
6. **Analytics.** `NEXT_PUBLIC_GTM_ID` unset; no GA4 funnel yet.
7. **Production deploy.** Netlify site + `tapnconnect.ae` DNS (Cloudflare DNS-only). Needs a /ship row and the founder's yes.
8. **E2E in CI and per-feature specs.** `pages.yml` runs only unit + lint + build. Add a PR job for `npx playwright test`.
   The e2e suite is only a smoke test today. Port `scripts/flow.mjs` (Order journey) into `tests/e2e/order.spec.mjs`,
   and add `net::ERR_FAILED` to its ignore list.
9. **Repo home.** README says the folder came from the docs repo (REQ-002 open question 1). The README status line still says
   "lives in the docs repo" and needs updating.
