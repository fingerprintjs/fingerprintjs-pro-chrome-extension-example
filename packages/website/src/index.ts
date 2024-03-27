import * as FpJS from '@fingerprintjs/fingerprintjs-pro'
import { showVersion } from './version'

showVersion(document.querySelector('.version')!)

const extensionIds = (process.env.EXTENSION_IDS ?? '').split(',')

const isChromeApiAvailable = () => typeof chrome?.runtime?.sendMessage === 'function'

const isIframe = () => window.parent !== window

function sendMessage(msg: string, data: any) {
  const message = {
    msg,
    data,
    external: true,
  }

  if (isIframe()) {
    window.parent.postMessage(message, '*')
  } else {
    if (!isChromeApiAvailable()) {
      console.warn('Looks like chrome API is not available.')

      return
    }

    extensionIds.forEach((extensionId) => chrome.runtime.sendMessage(extensionId, message))
  }
}

async function main() {
  const heading = document.querySelector('.heading')!

  if (!isChromeApiAvailable() && !isIframe()) {
    heading.textContent = 'Looks like chrome API is not available, you might need to switch to chromium based browser.'
    heading.classList.add('error')

    return
  }

  const fp = await FpJS.load({
    apiKey: process.env.API_KEY as string,
    endpoint: process.env.API_ENDPOINT,
  })

  const result = await fp.get({
    extendedResult: true,
  })

  sendMessage('fp-result', result)

  heading.textContent = "You've been verified! This page will close in a while..."
}

main().catch(console.error)
