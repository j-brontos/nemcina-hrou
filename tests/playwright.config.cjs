const { defineConfig, devices } = require('@playwright/test');
const path = require('node:path');

module.exports = defineConfig({
  testDir: '.',
  testMatch: ['browser.spec.cjs', 'visual.spec.cjs'],
  webServer: {
    command: 'python3 -m http.server 8765',
    url: 'http://127.0.0.1:8765',
    cwd: path.resolve(__dirname, '..')
  },
  use: { baseURL: 'http://127.0.0.1:8765' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit-mobile', use: { ...devices['iPhone 15'], viewport: {width:393, height:852} } }
  ]
});
