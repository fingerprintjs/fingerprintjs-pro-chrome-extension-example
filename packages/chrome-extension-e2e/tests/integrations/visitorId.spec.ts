import { FingerprintStrategy } from 'chrome-extension/src/types';
import { ElementHandle, Page } from 'playwright';
import { getBrowser } from '../browser';
import { navigateToPopup } from '../navigation';
import { wait } from '../wait';

async function selectStrategy(
  page: Page | ElementHandle<HTMLElement | SVGElement>,
  strategy: FingerprintStrategy
) {
  const input = await page.waitForSelector(`input[value="${strategy}"]`);

  await input.click();
}

async function getAndCheckResult(
  page: Page | ElementHandle<HTMLElement | SVGElement>
) {
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
  async function runPopupTest(strategy: FingerprintStrategy) {
    const browser = await getBrowser();
    const page = await browser.newPage();

    await navigateToPopup(page);
    await selectStrategy(page, strategy);

    await getAndCheckResult(page);
  }

  describe('Iframe strategy', () => {
    it('should show visitorId in popup', async () => {
      await runPopupTest(FingerprintStrategy.Iframe);
    });
  });

  describe('New window strategy', () => {
    it('should show visitorId in popup', async () => {
      await runPopupTest(FingerprintStrategy.NewWindow);
    });
  });
});
