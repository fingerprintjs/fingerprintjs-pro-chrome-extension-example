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
  globalSetup: path.resolve(__dirname, './tests/setup.ts'),
  use: {
    trace: 'on-first-retry',
  },
};

export default config;
