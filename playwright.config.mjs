// E2E against the static build (what ships): serve out/ on its own port. Run `npm run build` first (verify-full does).
import { defineConfig, devices } from '@playwright/test';
const port = Number(process.env.E2E_PORT) || 4420; // a worktree running in parallel sets its own
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: `http://localhost:${port}`, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ],
  webServer: { command: `npx serve out -l ${port}`, url: `http://localhost:${port}/`, reuseExistingServer: !process.env.CI },
});
