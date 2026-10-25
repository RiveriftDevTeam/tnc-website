#!/usr/bin/env bash
# Fast gate (<60s) run by the TaskCompleted hook: unit tests (order rules, EN/AR key parity) + lint.
set -euo pipefail
cd "$(dirname "$0")/.."
npm test --silent
npm run lint --silent
