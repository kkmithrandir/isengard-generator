// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';
import { config } from './src/config/config';

const playwrightConfig: PlaywrightTestConfig = {
  timeout: config.test.timeout,
  retries: config.test.retries,
  use: {
    viewport: config.test.viewport,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/test-results.json' }]
  ]
};

export default playwrightConfig;
