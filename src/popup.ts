import browser from 'webextension-polyfill';

let currentWindow: browser.Windows.Window;

const triggerBtn = document.querySelector<HTMLButtonElement>('#create_window')!;
const target = document.querySelector('#result')!;

browser.runtime.onMessageExternal.addListener(async message => {
  console.log({ message });

  if (target && message?.data?.visitorId) {
    triggerBtn.disabled = false;

    target.innerHTML = `<b>${message.data.visitorId}</b>`;

    if (currentWindow?.id) {
      await browser.windows.remove(currentWindow.id);
    }
  }
});

triggerBtn.addEventListener('click', async () => {
  target.innerHTML = '';
  triggerBtn.disabled = true;

  currentWindow = await browser.windows.create({
    url: 'https://przemyslawzydek.com',
    state: 'minimized',
    type: 'normal',
  });
});

window.addEventListener('beforeunload', () => {
  if (currentWindow?.id) {
    browser.windows.remove(currentWindow.id);
  }
});
