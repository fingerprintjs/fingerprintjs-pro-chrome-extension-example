import test, { chromium } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'
import { waitForExtensions } from './waitForExtensions'
import { downloadExtension } from './thirdPartyExtensions'
import { thirdPartyExtensions } from './extensionsList'
import { getExtensionPath } from './paths'
import { getExtensionId } from './url'
import { startWebsite, waitForWebsite } from './website'

const extensionPath = getExtensionPath()
const contextsPath = path.resolve(__dirname, 'contexts')

export const extensionTest = test.extend<{}>({
  context: [
    async ({}, use) => {
      if (!fs.existsSync(extensionPath)) {
        throw new Error(`Extension path ${extensionPath} does not exist`)
      }

      if (!fs.existsSync(contextsPath)) {
        fs.mkdirSync(contextsPath)
      }

      const browserId = Date.now().toString()
      const userDataDir = path.join(contextsPath, browserId.concat('.ctx'))

      const thirdPartyExtensionPaths = await Promise.all(
        thirdPartyExtensions.map((extension) => downloadExtension(extension.id))
      )

      const extensionsToLoad = [extensionPath, ...thirdPartyExtensionPaths].join(',')

      const extensionArgs = [`--disable-extensions-except=${extensionsToLoad}`, `--load-extension=${extensionsToLoad}`]

      const context = await chromium.launchPersistentContext(userDataDir, {
        args: [
          '--window-size=320x240',
          '--ignore-certificate-errors',
          ...extensionArgs,
          '--no-sandbox',
          // Causes crash dumps to be saved locally (in ${userDataDir}/Crashpad/reports)
          '--noerrdialogs',
          // Writes a verbose chrome log at ${userDataDir}/chrome_debug.log, useful for debugging page crashes
          '--enable-logging',
          '--v=1',
        ],
        headless: false,
        bypassCSP: true,
        ignoreHTTPSErrors: true,
        permissions: [],
      })

      context.setDefaultTimeout(50_000)

      await waitForExtensions(context)

      const extensionId = getExtensionId(context)
      const websiteProcess = await startWebsite(extensionId)

      await waitForWebsite()

      console.log('Installing third party extensions')

      for (const extension of thirdPartyExtensions) {
        await extension.install?.(context, extensionId)
      }

      console.log('Context ready')

      await use(context)
      await context.close()
      websiteProcess.kill()
    },
    {
      scope: 'test',
    },
  ],
})
