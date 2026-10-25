# BUILD_STATUS — tnc-website

_Last updated: 2026-10-25 (site revamp, Lagoon). Branch `feat/site-revamp`; local runs._

## Runs locally (verified 2026-10-25, branch `feat/site-revamp`)
The site is the **Lagoon / Kept Thread** revamp (docs/plans/site-revamp.md + Amendments A1, A2): the 8-act Home story (clay people, the thread, the web, your circles, the assistant, everyone's graph) on a hero video; What everyone gains; scroll journeys on How it works and the five buyer pages; the sand-meets-sea shore with particles; EN + AR; light + dark.

| What | Command | Result |
|---|---|---|
| Unit + lint | `.claude/verify.sh` | green (order rules, EN/AR key parity) |
| Full gate | `.claude/verify-full.sh` | green: build, **78/78** e2e (smoke on 22 routes, story, media, order), gitleaks no leaks |
| Every page × EN/AR × phone/desktop × light/dark | `npm run check` | all pages clean |
| Order journey | `npm run flow` | flow clean |
| Budgets | `npm run vitals` | Home LCP 100 ms (564 ms on 4G + 4x CPU), CLS 0, fonts 158 kB EN / 158 kB AR, story frame p95 17.5 ms (M1 GPU) |
| First-load JS | `npm run build` | Home 98.9 kB, How 99.7 kB, buyer pages 96.5 kB, all ≤ 100 kB |

## Deployed
Nothing live on a production domain.
- GitHub Pages workflow exists (`riveriftdevteam.github.io/tnc-website`), but has been
  **manual-dispatch only since 2026-10-25** (founder's ask). Whether a past run is still served is not verified.
- Netlify (`netlify.toml`) is configured but no site exists yet. That needs a /ship row and the founder's yes.
- No `infra/` folder, no Azure resources.

## Not wired yet (backlog)
1. **Arabic copy review (plan C8).** Every Arabic line is drafted as Arabic, but a native Gulf Arabic copywriter and the founder have not reviewed it.
2. **Gulf event photography.** No free photo of a Gulf exhibition passed the rules (calm, no logos, no alcohol); the founder's own consented event photos would replace slots one line each (`src/content/media.sources.js`). The hero clip is people meeting at a business event, not an exhibition floor.
3. **Order submit backend.** `POST {BACKEND}/api/public/order` doesn't exist. The page shows the honest "Couldn't send the order" fallback.
4. **Licence document upload.** The file is chosen in the browser but never sent. Waiting on multipart or a signed upload URL.
5. **Cloudflare Turnstile** in front of the order submit and sales chat (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` unset).
6. **Live price list.** `src/content/plans.js` uses the founder's sample values (2026-10-14); swap for `GET /api/public/plans`. Seats, the company plan, event packages and sponsor tiers are still `null` (priced per order).
7. **Backend sales agent.** `POST /api/public/sales` is a 404 until `SALES_AGENT_ENABLED=true`; the scripted assistant answers until then.
8. **Analytics.** `NEXT_PUBLIC_GTM_ID` unset; no GA4 funnel yet.
9. **Production deploy.** Netlify site + `tapnconnect.ae` DNS (Cloudflare DNS-only). A /ship row and the founder's yes.
10. **E2E in CI.** `pages.yml` runs unit + lint + build only; add a PR job for `npx playwright test`.
11. **DESIGN.md.** The Impeccable documenter should record the shipped Lagoon world (PRODUCT.md already points to it).
