import { Message } from './types'

let currentWindow: chrome.windows.Window | undefined

async function closeCurrentWindow() {
  if (currentWindow?.id) {
    try {
      await chrome.windows.remove(currentWindow.id)

      currentWindow = undefined
    } catch (error) {
      console.error(error)
    }
  }
}

async function getFingerprint() {
  await closeCurrentWindow()

  currentWindow = await chrome.windows.create({
    url: process.env.WEBSITE_URL as string,
    type: 'popup',
    focused: false,
  })

  return new Promise((resolve) => {
    const handleExternalMsg = async (externalMessage: any, sender: any) => {
      console.log('Received external message:', { externalMessage, sender })

      if (externalMessage && externalMessage?.data?.visitorId) {
        resolve(externalMessage)

        chrome.runtime.onMessageExternal.removeListener(handleExternalMsg)

        await closeCurrentWindow()
      }
    }

    chrome.runtime.onMessageExternal.addListener(handleExternalMsg)
  })
}

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
  if (message.type === 'get-visitor-id') {
    getFingerprint().then(sendResponse)

    return true
  }
})

let lifeline: any

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'keepAlive') {
    lifeline = port
    setTimeout(keepAliveForced, 295e3) // 5 minutes minus 5 seconds
    port.onDisconnect.addListener(keepAliveForced)
  }
})

function keepAliveForced() {
  lifeline?.disconnect()
  lifeline = null
  keepAlive()
}

async function keepAlive() {
  if (lifeline) {
    return
  }

  for (const tab of await chrome.tabs.query({ url: '*://*/*' })) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id as number },
        func: () => chrome.runtime.connect({ name: 'keepAlive' }),
      })
      chrome.tabs.onUpdated.removeListener(retryOnTabUpdate)
      return
    } catch (e) {}
  }
  chrome.tabs.onUpdated.addListener(retryOnTabUpdate)
}

async function retryOnTabUpdate(tabId: number, info: any) {
  if (info.url && /^(file|https?):/.test(info.url)) {
    keepAlive()
  }
}

keepAlive()
