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
  webServer: {
    command: 'yarn website:preview',
    cwd: path.resolve(__dirname, '../../'),
    reuseExistingServer: !isCi,
    url: 'http://localhost:8080',
  },
};

export default config;
