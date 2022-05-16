import { getBrowser } from '../browser';
import { navigateToPopup } from '../navigation';
import { Page, ElementHandle } from 'playwright';
import { FingerprintStrategy } from 'chrome-extension/src/types';
import { wait } from '../wait';

const contentScriptUrl = 'https://example.org/';

async function selectStrategy(
  page: Page | ElementHandle<HTMLElement | SVGElement>,
  strategy: FingerprintStrategy
) {
  const input = await page.waitForSelector(`input[value="${strategy}"]`);

  await input.click({
    force: true,
  });
}

async function getAndCheckResult(
  page: Page | ElementHandle<HTMLElement | SVGElement>
) {
  await page.click('.get-fingerprint', {
    force: true,
  });

  while (true) {
    try {
      const result = await page.waitForSelector('.result').catch(() => null);
      const textContent = await result?.textContent();

      if (textContent?.startsWith('Your visitorId')) {
        const visitorIdElement = await result?.waitForSelector('b');
        const visitorId = await visitorIdElement?.textContent();

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
  describe('Content script', () => {
    const runTest = async (strategy: FingerprintStrategy) => {
      const browser = await getBrowser();
      const page = await browser.newPage();

      await page.goto(contentScriptUrl, {
        waitUntil: 'networkidle',
      });

      await selectStrategy(
        await page.waitForSelector('.fingerprint-container'),
        strategy
      );

      await getAndCheckResult(page);
    };

    it('should show visitorId via iframe strategy', async () => {
      await runTest(FingerprintStrategy.Iframe);
    });

    it('should show visitorId via new window strategy', async () => {
      await runTest(FingerprintStrategy.NewWindow);
    });
  });

  describe('Popup', () => {
    const runTest = async (strategy: FingerprintStrategy) => {
      const browser = await getBrowser();
      const page = await browser.newPage();

      await navigateToPopup(page);
      await selectStrategy(page, strategy);

      await getAndCheckResult(page);
    };

    it('should show visitorId via iframe strategy', async () => {
      await runTest(FingerprintStrategy.Iframe);
    });

    it('should show visitorId via new window strategy', async () => {
      await runTest(FingerprintStrategy.NewWindow);
    });
  });
});
