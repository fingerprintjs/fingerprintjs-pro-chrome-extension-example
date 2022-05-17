import type { BrowserContext, Page } from 'playwright';

export interface ExtensionDefinition {
  id: string;
  install?: (browser: BrowserContext, extensionId: string) => Promise<void>;
  name: string;
}

export const thirdPartyExtensions: ExtensionDefinition[] = [
  {
    id: 'cjpalhdlnbpafiamejdnhcphjbkeiagm',
    name: 'uBlock',
  },
  {
    id: 'mlomiejdfkolichcflejclcbmpeaniij',
    name: 'Ghostery',
    install: async browser => {
      let page: Page | undefined;

      for (const browserPage of browser.pages()) {
        const title = await browserPage.title();

        if (title.toLowerCase().includes('ghostery')) {
          page = browserPage;
          break;
        }
      }

      if (page) {
        await page.click('[href="#setup"]');
        const input = await page.waitForSelector('text=Block Everything', {
          state: 'attached',
        });

        await input.click({
          force: true,
        });

        // Click through the setup wizard
        await page.click('text=Next');
        await page.click('text=Next');
        await page.click('text=Next');
        await page.click('text=Done');
        await page.close();
      } else {
        console.warn('Could not find Ghostery setup page');
      }
    },
  },
];
