import { PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';

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
};

export default config;
