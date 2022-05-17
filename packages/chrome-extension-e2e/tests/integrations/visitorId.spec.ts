import { FingerprintStrategy } from 'chrome-extension/src/types';
import { ElementHandle, Page } from 'playwright';
import { getBrowser } from '../browser';
import { wait } from '../wait';

async function selectStrategy(
  page: Page | ElementHandle,
  strategy: FingerprintStrategy
) {
  const input = await page.waitForSelector(`input[value="${strategy}"]`);

  await input.click();
}

async function getAndCheckResult(page: Page | ElementHandle) {
  await page.click('.get-fingerprint');

  while (true) {
    try {
      const result = await page.waitForSelector('.result');
      const textContent = await result.textContent();

      if (textContent?.startsWith('Your visitorId')) {
        const visitorIdElement = await result.waitForSelector('b');
        const visitorId = await visitorIdElement.textContent();

        expect(visitorId).toBeTruthy();
        expect(visitorId).toHaveLength(20);

        return;
      }
    } finally {
      await wait(1000);
    }
  }
}

describe('visitorId', () => {
  async function runTest(strategy: FingerprintStrategy) {
    const browser = await getBrowser();
    const page = await browser.newPage();

    await page.goto('https://example.org', {
      waitUntil: 'networkidle',
    });

    await selectStrategy(
      await page.waitForSelector('.fingerprint-container'),
      strategy
    );

    await getAndCheckResult(page);
  }

  describe('Iframe strategy', () => {
    it('should show visitorId', async () => {
      await runTest(FingerprintStrategy.Iframe);
    });
  });

  describe('New window strategy', () => {
    it('should show visitorId', async () => {
      await runTest(FingerprintStrategy.NewWindow);
    });
  });
});
