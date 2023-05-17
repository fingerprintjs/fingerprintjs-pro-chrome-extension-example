import * as FpJS from '@fingerprintjs/fingerprintjs-pro';
import { showVersion } from './version';

const heading = document.querySelector('.heading')!;

showVersion(document.querySelector('.version')!);

const isChromeApiAvailable = () =>
  typeof chrome?.runtime?.sendMessage === 'function';

const isIframe = () => window.parent !== window;

function setError(message: string) {
  heading.textContent = message;
  heading.classList.add('error');
}

function getExtensionIds() {
  const extensionIds = (import.meta.env.VITE_EXTENSION_IDS ?? '').split(
    ','
  ) as string[];

  const search = new URLSearchParams(location.search);

  const extensionIdsFromQuery = search.get('extensionIds')?.split(',') ?? [];

  return [...extensionIds, ...extensionIdsFromQuery];
}

function sendMessage(msg: string, data: any) {
  const message = {
    msg,
    data,
    external: true,
  };

  if (isIframe()) {
    window.parent.postMessage(message, '*');
  } else {
    if (!isChromeApiAvailable()) {
      console.warn('Looks like chrome API is not available.');

      return;
    }

    // TODO - Run one website process during tests and pass extension id in query somehow
    getExtensionIds().forEach(extensionId =>
      chrome.runtime.sendMessage(extensionId, message)
    );
  }
}

async function main() {
  const apiKey = import.meta.env.VITE_API_KEY as string;

  if (!apiKey) {
    setError('API key is not provided, please check your .env file.');

    return;
  }

  if (!isChromeApiAvailable() && !isIframe()) {
    setError(
      'Looks like chrome API is not available, you might need to switch to chromium based browser.'
    );

    return;
  }

  const fp = await FpJS.load({
    apiKey: apiKey,
    endpoint: import.meta.env.VITE_API_ENDPOINT,
  });

  const result = await fp.get({
    extendedResult: true,
  });

  sendMessage('fp-result', result);

  heading.textContent =
    "You've been verified! This page will close in a while...";
}

main().catch(console.error);
