import { PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({
  path: '../../.env',
});

const config: PlaywrightTestConfig = {
  retries: 3,
  workers: 1,
};

export default config;
