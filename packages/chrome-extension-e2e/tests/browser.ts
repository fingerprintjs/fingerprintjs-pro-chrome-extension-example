import { BrowserContext, chromium } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';
import { getExtensionPath } from './paths';
import { wait } from './wait';
import type { ChildProcess } from 'child_process';
import { getExtensionId } from './url';
import { startWebsite, waitForWebsite } from './website';
import { downloadExtension } from './extensions';
import { thirdPartyExtensions } from './extensionsList';

let browser: BrowserContext;
let ctxPath: string;
let websiteProcess: ChildProcess;

const extensionPath = getExtensionPath();

export async function getBrowser() {
  if (browser) {
    return browser;
  }

  return createBrowser();
}

export async function createBrowser() {
  if (!fs.existsSync(extensionPath)) {
    throw new Error(`Extension path ${extensionPath} does not exist`);
  }

  const browserId = Date.now().toString();

  const { currentTestName } = expect.getState();
  const contextsPath = path.resolve(__dirname, 'contexts');

  if (browser || ctxPath || websiteProcess) {
    await cleanup();
  }

  if (!fs.existsSync(contextsPath)) {
    fs.mkdirSync(contextsPath);
  }

  const contextId = currentTestName.concat(browserId);
  const fullContextPath = path.join(contextsPath, contextId, '.ctx');

  let thirdPartyExtensionPaths: string[] = [];

  const shouldUseThirdPartyExtensions = process.platform !== 'win32';

  // Third party extensions doesn't seem to be working correctly on windows
  if (shouldUseThirdPartyExtensions) {
    thirdPartyExtensionPaths = await Promise.all(
      thirdPartyExtensions.map(extension => downloadExtension(extension.id))
    );
  }

  const extensionsToLoad = [extensionPath, ...thirdPartyExtensionPaths].join(
    ','
  );

  const extensionArgs = [
    `--disable-extensions-except=${extensionsToLoad}`,
    `--load-extension=${extensionsToLoad}`,
  ];

  const ctx = await chromium.launchPersistentContext(fullContextPath, {
    permissions: [],
    args: [
      '--window-size=320x240',
      '--ignore-certificate-errors',
      ...extensionArgs,
      '--no-sandbox',
      // Causes crash dumps to be saved locally (in ${fullContextPath}/Crashpad/reports)
      '--noerrdialogs',
      // Writes a verbose chrome log at ${fullContextPath}/chrome_debug.log, useful for debugging page crashes
      '--enable-logging',
      '--v=1',
    ],
    headless: false,
    bypassCSP: true,
  });

  await waitForExtensions(ctx);

  const extensionId = getExtensionId(ctx);

  browser = ctx;
  ctxPath = fullContextPath;
  websiteProcess = await startWebsite(extensionId);

  await waitForWebsite();

  if (shouldUseThirdPartyExtensions) {
    for (const extension of thirdPartyExtensions) {
      await extension.install?.(browser, extensionId);
    }
  }

  return ctx;
}

async function waitForExtensions(browser: BrowserContext, attemptLimit = 10) {
  let attempt = 0;

  while (attempt <= attemptLimit) {
    // Create new page that should trigger our service worker
    const page = await browser.newPage();
    await page.goto('https://example.org');

    const serviceWorkers = browser.serviceWorkers();

    await page.close();

    if (serviceWorkers.length > 0) {
      return;
    }

    attempt++;

    await wait(2000);
  }

  throw new Error('Extensions did not load');
}

export async function cleanup() {
  if (browser) {
    await browser.close();
  }

  if (ctxPath && fs.existsSync(ctxPath)) {
    try {
      fs.unlinkSync(ctxPath);
    } catch (error) {
      // Nothing here...
    }
  }

  if (websiteProcess) {
    websiteProcess.kill();
  }
}
