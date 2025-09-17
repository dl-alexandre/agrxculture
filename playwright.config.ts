import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 30000,
  
  use: {
    baseURL: `http://localhost:4321${process.env.BASE_PATH ?? '/'}`,
    serviceWorkers: 'block',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile testing for agricultural users
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    // Low-end Android for farm regions
    {
      name: 'Low-end Android',
      use: {
        ...devices['Galaxy S5'],
        // Simulate slower network conditions
        launchOptions: {
          args: ['--simulate-outdated-no-au-prompt-on-older-versions']
        }
      },
    },
  ],

  webServer: {
    command: 'npm run preview -- --port 4321 --host',
    url: `http://localhost:4321${process.env.BASE_PATH ?? '/'}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
});