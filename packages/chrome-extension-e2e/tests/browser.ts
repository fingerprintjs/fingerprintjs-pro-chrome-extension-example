import type { ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { BrowserContext, chromium } from 'playwright';
import { downloadExtension } from './extensions';
import { thirdPartyExtensions } from './extensionsList';
import { getExtensionPath } from './paths';
import { getExtensionId } from './url';
import { wait } from './wait';
import { startWebsite, waitForWebsite } from './website';

export interface BrowserBag {
  id: string;
  ctx: BrowserContext;
  ctxPath: string;
  websiteProcess: ChildProcess;
}

let browsers: BrowserBag[] = [];

const extensionPath = getExtensionPath();

export async function createBrowser() {
  if (!fs.existsSync(extensionPath)) {
    throw new Error(`Extension path ${extensionPath} does not exist`);
  }

  const browserId = Date.now().toString();

  const { currentTestName } = expect.getState();
  const contextsPath = path.resolve(__dirname, 'contexts');

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

  const browserContext = ctx;
  const websiteProcess = await startWebsite(extensionId);

  browsers.push({
    ctx,
    ctxPath: fullContextPath,
    websiteProcess,
    id: browserId,
  });

  await waitForWebsite();

  if (shouldUseThirdPartyExtensions) {
    for (const extension of thirdPartyExtensions) {
      await extension.install?.(browserContext, extensionId);
    }
  }

  return ctx;
}

export async function waitForExtensions(
  browserContext: BrowserContext,
  attemptLimit = 20
) {
  let attempt = 0;

  while (attempt <= attemptLimit) {
    // Create new page that should trigger our service worker
    const page = await browserContext.newPage();
    await page.goto('https://example.org', {
      waitUntil: 'networkidle',
    });

    const serviceWorkers = browserContext.serviceWorkers();

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
  await Promise.all(
    browsers.map(async ({ ctx, ctxPath, websiteProcess }) => {
      {
        const browser = ctx.browser();

        await ctx.close();
        await browser?.close();
      }

      if (fs.existsSync(ctxPath)) {
        try {
          fs.unlinkSync(ctxPath);
        } catch (error) {
          // Nothing here...
        }
      }

      websiteProcess.kill();
    })
  );

  browsers = [];
}
