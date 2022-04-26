import browser from 'webextension-polyfill';
import { Message } from './types';

let currentWindow: browser.Windows.Window | undefined;

async function closeCurrentWindow() {
  if (currentWindow?.id) {
    try {
      await browser.windows.remove(currentWindow.id);

      currentWindow = undefined;
    } catch (error) {
      console.error(error);
    }
  }
}

browser.runtime.onMessage.addListener(async (message: Message) => {
  if (message.type === 'get-fingerprint') {
    await closeCurrentWindow();

    currentWindow = await browser.windows.create({
      url: process.env.WEBSITE_URL as string,
      type: 'popup',
      focused: false,
    });

    return new Promise(resolve => {
      const handleExternalMsg = async (externalMessage: any, sender: any) => {
        console.log('Received external message:', { externalMessage, sender });

        if (externalMessage && externalMessage?.data?.visitorId) {
          browser.runtime.onMessageExternal.removeListener(handleExternalMsg);

          await closeCurrentWindow();

          resolve(externalMessage);
        }
      };

      browser.runtime.onMessageExternal.addListener(handleExternalMsg);
    });
  }

  return undefined;
});
