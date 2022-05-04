import { cleanup, createBrowser } from './browser';
import { config } from 'dotenv';
import * as path from 'path';

config({
  path: path.resolve(__dirname, '../../../.env'),
});

beforeEach(async () => {
  await createBrowser();
});

afterEach(async () => {
  await cleanup();
});
