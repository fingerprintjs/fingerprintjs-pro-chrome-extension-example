import { exec, execSync } from 'child_process';
import fetch from 'node-fetch';
import * as path from 'path';
import { wait } from './wait';
import * as https from 'https';

export async function startWebsite(extensionId: string) {
  const root = path.resolve(__dirname, '../../..');

  execSync('yarn run website:build', {
    stdio: 'inherit',
    cwd: root,
    env: {
      ...process.env,
      VITE_EXTENSION_IDS: extensionId,
    },
  });

  return exec('yarn run website:preview', {
    cwd: root,
  });
}

export async function waitForWebsite() {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  await wait(1500);

  while (true) {
    try {
      const websiteUrl = process.env.WEBSITE_URL as string;

      const response = await fetch(websiteUrl, {
        agent: httpsAgent,
      });

      if (response.ok) {
        return true;
      }
    } catch (error) {
      // Nothing here
    }

    await wait(1000);
  }
}
