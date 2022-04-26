import * as FpJS from '@fingerprintjs/fingerprintjs-pro';

const extensionIds = ['godljapfbfdimjjiknaefidkghojnahp'];

function sendMessage(msg: string, data: any) {
  if (typeof chrome?.runtime?.sendMessage !== 'function') {
    console.warn('Looks like chrome API is not available.');

    return;
  }

  extensionIds.forEach(extensionId =>
    chrome.runtime.sendMessage(extensionId, {
      msg,
      data,
      external: true,
    })
  );
}

async function main() {
  const heading = document.querySelector('.heading')!;

  if (typeof chrome?.runtime?.sendMessage !== 'function') {
    heading.textContent =
      'Looks like chrome API is not available, you might need to switch to chromium based browser.';
    heading.classList.add('error');

    return;
  }

  const fp = await FpJS.load({
    apiKey: process.env.API_KEY as string,
  });

  const result = await fp.get({
    extendedResult: true,
  });

  sendMessage('fp-result', result);

  heading.textContent =
    "You've been verified! This page will close in a while...";
}

main().catch(console.error);
