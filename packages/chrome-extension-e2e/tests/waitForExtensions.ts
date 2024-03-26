import { BrowserContext } from 'playwright'
import { wait } from './wait'

export async function waitForExtensions(browserContext: BrowserContext, attemptLimit = 20) {
  let attempt = 0

  while (attempt <= attemptLimit) {
    // Create new page that should trigger our service worker
    const page = await browserContext.newPage()
    await page.goto('https://example.org', {
      waitUntil: 'networkidle',
    })

    const serviceWorkers = browserContext.serviceWorkers()

    await page.close()

    if (serviceWorkers.length > 0) {
      return
    }

    attempt++

    await wait(2000)
  }

  throw new Error('Extensions did not load')
}
