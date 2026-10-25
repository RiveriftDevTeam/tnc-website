# Environments: tnc-website

_Owner: architect. Created 2026-10-25 from CLAUDE.md, README.md and BUILD_STATUS.md. The BA has not run a topology interview, so this records the current facts only.
Secrets are listed by NAME only. Deployment mode: **manual**: nothing deploys without the founder's explicit yes._

| Env | Host / resource group | Sources | Sinks | Promotion rule |
|---|---|---|---|---|
| local-dev | developer machine, `npm run dev` → http://localhost:4410 | repo working tree; `.env.local` (optional, `NEXT_PUBLIC_*` only) | browser only; order POST goes to `NEXT_PUBLIC_BACKEND_URL` (default `https://service.tapnconnect.ae`, route not built, so the page shows its fallback) | n/a |
| local-build | `npm run build` → `out/`, served by `npm start` (:4410) or Playwright (:4420) | repo at HEAD | same as local-dev | `.claude/verify-full.sh` green before anything is offered for deploy |
| github-pages (preview) | GitHub Pages, `riveriftdevteam.github.io/tnc-website`, workflow `.github/workflows/pages.yml` | `main` branch, build env `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BASE_PATH=/tnc-website` | public static site | **manual dispatch only**, on the founder's yes (paused 2026-10-25) |
| production | Netlify site `tnc-website` (free tier). **Not created.** Domain `tapnconnect.ae` via Cloudflare DNS-only | `main`, `netlify.toml` (`npm run build`, publish `out`, Node 22) | public static site; GTM after consent | /ship row + founder's explicit yes; not authorised yet |

**Public env names (values live in the host's env, never in the repo):** `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BASE_PATH`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_PORTAL_URL`, `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. No server-side secrets exist; the site is a static export.

**Authoring-time external sources (not runtime):** `unsplash.com/photos/<id>/download` and `images.unsplash.com` are read by `scripts/media.mjs` (planned, docs/plans/site-revamp.md). The output is committed to `public/media/`. There are no runtime image origins, and the CSP stays `img-src 'self' data:`.
