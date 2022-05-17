import { config } from 'dotenv';
import * as path from 'path';
import { cleanup } from './browser';

jest.retryTimes(3);

config({
  path: path.resolve(__dirname, '../../../.env'),
});

afterEach(async () => {
  await cleanup();
});
