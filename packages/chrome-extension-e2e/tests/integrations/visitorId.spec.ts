import { FingerprintStrategy } from 'chrome-extension/src/types';
import { ElementHandle, Page } from 'playwright';
import { navigateToPopup } from '../navigation';
import { extensionTest } from '../setupPw';
import { wait } from '../wait';

const { expect, describe } = extensionTest;

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
  async function runTest(
    page: Page,
    strategy: FingerprintStrategy,
    place: 'contentScript' | 'popup'
  ) {
    if (place === 'contentScript') {
      await page.goto('https://example.org', {
        waitUntil: 'networkidle',
      });
    } else {
      await navigateToPopup(page);
    }

    await selectStrategy(
      await page.waitForSelector('.fingerprint-container'),
      strategy
    );

    await getAndCheckResult(page);
  }

  describe('Iframe strategy', () => {
    extensionTest(
      'should show visitorId in content script',
      async ({ page }) => {
        await runTest(page, FingerprintStrategy.Iframe, 'contentScript');
      }
    );

    extensionTest('should show visitorId in popup', async ({ page }) => {
      await runTest(page, FingerprintStrategy.Iframe, 'popup');
    });
  });

  describe('New window strategy', () => {
    extensionTest(
      'should show visitorId in content script',
      async ({ page }) => {
        await runTest(page, FingerprintStrategy.NewWindow, 'contentScript');
      }
    );

    extensionTest('should show visitorId in popup', async ({ page }) => {
      await runTest(page, FingerprintStrategy.NewWindow, 'popup');
    });
  });
});
