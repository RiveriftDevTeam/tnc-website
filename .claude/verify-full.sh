#!/usr/bin/env bash
# Full gate (integration phase, before /ship): unit + lint + build + Playwright e2e on the static build + secret scan.
set -euo pipefail
cd "$(dirname "$0")/.."
npm test --silent
npm run lint --silent
npm run build
npx playwright test
gitleaks detect --no-banner
