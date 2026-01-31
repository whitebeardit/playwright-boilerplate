import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'api',
      testMatch: /tests\/api\/.*\.spec\.ts/,
      use: {
        baseURL: 'https://jsonplaceholder.typicode.com',
        extraHTTPHeaders: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      },
      timeout: 15000,
    },
    {
      name: 'ui',
      testMatch: /tests\/ui\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://playwright.dev',
      },
      timeout: 30000,
    },
  ],
});
