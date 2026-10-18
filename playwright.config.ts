import { defineConfig, devices } from '@playwright/test'

const PORT = 3100

export default defineConfig({
  testDir: './tests',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure'
  },
  webServer: {
    // Uji hasil build produksi (jalankan `npm run build` terlebih dahulu).
    command: 'node .output/server/index.mjs',
    url: `http://127.0.0.1:${PORT}`,
    env: { PORT: String(PORT), HOST: '127.0.0.1' },
    reuseExistingServer: false,
    timeout: 60_000
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } }
    },
    {
      name: 'laptop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } }
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] }
    },
    {
      name: 'mobile-small',
      use: { ...devices['Pixel 7'], viewport: { width: 360, height: 640 } }
    }
  ]
})
