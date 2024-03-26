import { exec } from 'child_process';
import fetch from 'node-fetch';
import * as path from 'path';
import { wait } from './wait';
import * as https from 'https';

export async function startWebsite(extensionId: string) {
  const root = path.resolve(__dirname, '../../..');

  const proc = exec('pnpm website:start', {
    cwd: root,
    env: {
      ...process.env,
      EXTENSION_IDS: extensionId,
    },
  });

  proc.stdout?.pipe(process.stdout);
  proc.stderr?.pipe(process.stderr);

  return proc;
}

export async function waitForWebsite() {
  let attempts = 0;

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  const websiteUrl = process.env.WEBSITE_URL as string;

  while (true) {
    if (attempts > 0) {
      console.log(
        `Waiting for website to be ready at ${websiteUrl}... (${attempts})`
      );
    }

    try {
      const response = await fetch(websiteUrl, {
        agent: httpsAgent,
      });

      console.log(`Response status code: ${response.status}`);

      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.error(error);
    }

    attempts++;

    await wait(1000);
  }
}
