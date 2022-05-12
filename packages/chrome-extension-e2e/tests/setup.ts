import { cleanup, createBrowser } from './browser';
import { config } from 'dotenv';
import * as path from 'path';

jest.retryTimes(3);

config({
  path: path.resolve(__dirname, '../../../.env'),
});

beforeEach(async () => {
  await createBrowser();
});

afterEach(async () => {
  await cleanup();
});
