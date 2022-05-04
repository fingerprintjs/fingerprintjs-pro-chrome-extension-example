import { BrowserContext, chromium } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';
import { getExtensionPath } from './paths';
import { wait } from './wait';
import type { ChildProcess } from 'child_process';
import { getExtensionId } from './url';
import { startWebsite, waitForWebsite } from './website';

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

  if (browser || ctxPath) {
    await cleanup();
  }

  if (!fs.existsSync(contextsPath)) {
    fs.mkdirSync(contextsPath);
  }

  const contextId = currentTestName.concat(browserId);
  const fullContextPath = path.join(contextsPath, contextId, '.ctx');

  const ctx = await chromium.launchPersistentContext(fullContextPath, {
    permissions: [],
    args: [
      '--window-size=320x240',
      '--ignore-certificate-errors',
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
      '--no-sandbox',
      // Causes crash dumps to be saved locally (in ${userDataDir}/Crashpad/reports)
      '--noerrdialogs',
      // Writes a verbose chrome log at ${userDataDir}/chrome_debug.log, useful for debugging page crashes
      '--enable-logging',
      '--v=1',
    ],
    headless: false,
    bypassCSP: true,
  });

  // Wait for extensions to load
  await wait(1500);

  const extensionId = getExtensionId(ctx);

  browser = ctx;
  ctxPath = fullContextPath;
  websiteProcess = await startWebsite(extensionId);

  await waitForWebsite();

  return ctx;
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
