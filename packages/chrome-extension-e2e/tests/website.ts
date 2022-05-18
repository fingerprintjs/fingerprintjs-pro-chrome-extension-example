import { exec } from 'child_process';
import fetch from 'node-fetch';
import * as path from 'path';
import { wait } from './wait';
import * as https from 'https';
import ora from 'ora';

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
  const spinner = ora('Waiting for website...').start();

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
        spinner.succeed();

        return true;
      }
    } catch (error) {
      // Nothing here
    }

    await wait(1000);
  }
}
