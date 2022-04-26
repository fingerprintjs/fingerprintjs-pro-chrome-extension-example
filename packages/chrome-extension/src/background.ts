import { Message } from './types';

let currentWindow: chrome.windows.Window | undefined;

async function closeCurrentWindow() {
  if (currentWindow?.id) {
    try {
      await chrome.windows.remove(currentWindow.id);

      currentWindow = undefined;
    } catch (error) {
      console.error(error);
    }
  }
}

async function getFingerprint() {
  await closeCurrentWindow();

  currentWindow = await chrome.windows.create({
    url: process.env.WEBSITE_URL as string,
    type: 'popup',
    focused: false,
  });

  return new Promise(resolve => {
    const handleExternalMsg = async (externalMessage: any, sender: any) => {
      console.log('Received external message:', { externalMessage, sender });

      if (externalMessage && externalMessage?.data?.visitorId) {
        resolve(externalMessage);

        chrome.runtime.onMessageExternal.removeListener(handleExternalMsg);

        await closeCurrentWindow();
      }
    };

    chrome.runtime.onMessageExternal.addListener(handleExternalMsg);
  });
}

chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    if (message.type === 'get-fingerprint') {
      getFingerprint().then(sendResponse);

      return true;
    }
  }
);
