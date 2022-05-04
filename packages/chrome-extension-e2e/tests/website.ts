import { exec } from 'child_process';
import fetch from 'node-fetch';
import * as path from 'path';
import { wait } from './wait';
import * as https from 'https';

export async function startWebsite(extensionId: string) {
  const root = path.resolve(__dirname, '../../..');

  return exec('yarn run website:start', {
    cwd: root,
    env: {
      ...process.env,
      EXTENSION_IDS: extensionId,
    },
  });
}

export async function waitForWebsite() {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  while (true) {
    try {
      const websiteUrl = process.env.WEBSITE_URL as string;

      const response = await fetch(websiteUrl, {
        agent: httpsAgent,
      });

      if (response.ok) {
        console.log('Website is up');

        return true;
      }
    } catch (error) {
      console.error('Website not ready yet', error);
    }

    await wait(1000);
  }
}
