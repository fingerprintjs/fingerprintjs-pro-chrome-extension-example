import browser from 'webextension-polyfill';

console.log('Hello from background!');

browser.runtime.onMessageExternal.addListener(async (message, sender) => {
  console.log({ message, sender });
});
