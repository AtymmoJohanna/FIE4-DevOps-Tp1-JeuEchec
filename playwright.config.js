const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // IMPORTANT : Seulement les tests dans tests/e2e
  testDir: './tests/e2e',
  
  // Ignorer les tests Jest
  testIgnore: [
    '**/src/**/*.test.js',
    '**/src/**/*.spec.js',
    '**/__tests__/**'
  ],
  
  // Seulement les fichiers .spec.js dans tests/e2e
  testMatch: '**/*.spec.js',
  
  timeout: 30 * 1000,
  
  expect: {
    timeout: 5000
  },
  
  fullyParallel: false,
  retries: 1,
  workers: 1,
  
  reporter: [
    ['html'],
    ['list']
  ],
  
  use: {
    baseURL: 'http://localhost:8080',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run serve',
    url: 'http://localhost:8080',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});