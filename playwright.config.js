import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'mestests',
  
  // Timeout pour chaque test
  timeout: 30 * 1000,
  
  // Configurations globales
  expect: {
    timeout: 5000
  },
  
  // Nombre de tentatives en cas d'échec
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter
  reporter: [
    ['html'],
    ['list']
  ],
  
  use: {
    // URL de base pour les tests
    baseURL: 'http://localhost:8080',
    
    // Prendre une capture d'écran en cas d'échec
    screenshot: 'only-on-failure',
    
    // Enregistrer une vidéo en cas d'échec
    video: 'retain-on-failure',
    
    // Trace
    trace: 'on-first-retry',
  },

  // Configuration des projets (navigateurs)
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
    // Tests mobiles
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  // Démarrer le serveur de dev avant les tests
  webServer: {
    command: 'npm run serve',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

