import { createBrowser, getBrowser } from '../browser';
import { navigateToPopup } from '../navigation';
import { Page } from 'playwright';
import { FingerprintStrategy } from 'chrome-extension/src/types';
import { wait } from '../wait';

const options = {
  state: 'attached' as const,
};

async function selectStrategy(page: Page, strategy: FingerprintStrategy) {
  const input = await page.waitForSelector(
    `input[value="${strategy}"]`,
    options
  );

  await input.click();
}

async function getAndCheckResult(page: Page) {
  await page.click('.get-fingerprint');

  const options = {
    state: 'attached' as const,
  };

  while (true) {
    try {
      const result = await page.waitForSelector('.result', options);
      const textContent = await result.textContent();

      if (textContent?.startsWith('Your visitorId')) {
        const visitorIdElement = await result.waitForSelector('b', options);
        const visitorId = await visitorIdElement.textContent();

        console.log({ visitorId });

        expect(visitorId).toBeTruthy();
        expect(visitorId).toHaveLength(20);

        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      await wait(1000);
    }
  }
}

describe('visitorId', () => {
  describe('Iframe strategy', () => {
    it('should show visitorId', async () => {
      const browser = await getBrowser();
      const page = await browser.newPage();

      await navigateToPopup(page);
      await selectStrategy(page, FingerprintStrategy.Iframe);

      await getAndCheckResult(page);
    });
  });

  describe('New window strategy', () => {
    it('should show visitorId', async () => {
      const browser = await createBrowser();
      const page = await browser.newPage();

      await navigateToPopup(page);
      await selectStrategy(page, FingerprintStrategy.NewWindow);

      await getAndCheckResult(page);
    });
  });
});
