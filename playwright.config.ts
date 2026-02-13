import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './packages/web/e2e',
  outputDir: './test-results',
  reporter: [['html', { outputFolder: 'playwright-report' }]],
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev -w packages/web',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
