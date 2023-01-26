import { BrowserContext } from 'playwright';
import { wait } from './wait';
import ora from 'ora';

export async function waitForExtensions(
  browserContext: BrowserContext,
  attemptLimit = 20
) {
  const spinner = ora('Waiting for extensions...').start();

  let attempt = 0;

  while (attempt <= attemptLimit) {
    // Create new page that should trigger our service worker
    const page = await browserContext.newPage();
    await page.goto('https://example.org', {
      waitUntil: 'networkidle',
    });

    const serviceWorkers = browserContext.serviceWorkers();

    await page.close();

    if (serviceWorkers.length > 0) {
      spinner.succeed();

      return;
    }

    attempt++;

    await wait(2000);
  }

  spinner.fail();

  throw new Error('Extensions did not load');
}
