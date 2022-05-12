import { BrowserContext } from 'playwright';
import { URL } from 'url';
import { readManifest } from './manifest';

export const getBackgroundWorker = (browser: BrowserContext) => {
  const [worker] = browser.serviceWorkers();

  return worker;
};

export const getExtensionUrl = (browser: BrowserContext, path = '') => {
  const worker = getBackgroundWorker(browser);

  return new URL(worker.url().replace('/background.js', '').concat(path));
};

export const getExtensionId = (browser: BrowserContext) => {
  const worker = getBackgroundWorker(browser);

  return worker.url().split('/')[2];
};

export const getPopupUrl = async (browser: BrowserContext) => {
  const manifest = await readManifest();

  return getExtensionUrl(browser, `/${manifest.action?.default_popup}`);
};
