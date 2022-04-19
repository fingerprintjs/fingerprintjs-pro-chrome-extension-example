import browser from 'webextension-polyfill';

export async function readFpResult() {
  await browser.runtime.sendMessage({
    msg: 'Content script loaded',
  });

  try {
    let fpResult: any;

    while (!fpResult) {
      const rawResult = document.body.dataset.fpresult;

      if (rawResult) {
        fpResult = JSON.parse(rawResult);
      }

      await browser.runtime.sendMessage({
        msg: 'No result so far...',
      });

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    await browser.runtime.sendMessage({
      msg: 'Got result!',
      data: fpResult,
    });
  } catch (error) {
    await browser.runtime.sendMessage({
      msg: 'Error in content script',
      error,
    });
  }
}

readFpResult().catch(console.error);
