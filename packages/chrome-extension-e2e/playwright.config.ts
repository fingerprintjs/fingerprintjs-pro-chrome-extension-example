import { PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: '../../.env',
});

const isCi = process.env.CI === 'true';

const config: PlaywrightTestConfig = {
  fullyParallel: false,
  retries: isCi ? 3 : 0,
  workers: 1,
  reporter: [['junit', { outputFile: 'reports/report.xml' }]],
  timeout: 60_000,
  use: {
    trace: 'on-first-retry',
  },
  webServer: {
    url: 'https://localhost:8080',
    ignoreHTTPSErrors: true,
    cwd: path.resolve(__dirname, '../../'),
    command: 'yarn website:preview',
  },
};

export default config;
