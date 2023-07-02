import { PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({
  path: '../../.env',
});

const config: PlaywrightTestConfig = {
  retries: 3,
  workers: 1,
  reporter: [['junit', { outputFile: 'reports/report.xml' }]],
  timeout: 60_000,
  use: {
    trace: 'on-first-retry',
  },
  fullyParallel: false,
};

export default config;
