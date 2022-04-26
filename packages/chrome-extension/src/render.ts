import { Message } from './types';

const logo = chrome.runtime.getURL('assets/logo.png');

export function renderFingerprintSection(target: Element) {
  target.innerHTML = `
    <style>
      @keyframes scan {
      0% {
          top: 0;
      }
  
      50% {
          top: 100%;
      }
  
      100% {
          top: 0;
      }
  }
  
  .fingerprint-container {
      width: 250px;
      text-align: center;
      font-size: 14px;
  }
  
  .fingerprint-container img {
      width: 50px;
      height: auto;
  }
  
  .fingerprint-container .get-fingerprint {
      width: 100px;
      display: inline-block;
      background: transparent;
      position: relative;
  }
  
  .fingerprint-container .get-fingerprint::after {
      content: '';
      display: block;
      width: 100%;
      height: 2px;
      background: #000;
      position: absolute;
      left: 0;
      opacity: 0;
  }
  
  .fingerprint-container .get-fingerprint.loading::after {
      opacity: 1;
      top: 50px;
      animation: scan 2s linear infinite;
  }
  
  .result-container {
      margin-top: 1rem;
  }

</style>
    <div class='fingerprint-container'>
      <button title='Get your fingerprint' class='get-fingerprint'>
        <img src='${logo}' alt=''>
      </button>
      <div class='result-container'>
        Your visitorId:
        <span class='result'></span>
    </div>
  </div>
  `;

  setupFingerprintingProcess(target);
}

function setupFingerprintingProcess(container: Element) {
  const triggerBtn = container.querySelector<HTMLButtonElement>(
    '.get-fingerprint'
  )!;
  const target = container.querySelector('.result')!;

  triggerBtn.addEventListener('click', async () => {
    target.innerHTML = '';
    triggerBtn.disabled = true;
    triggerBtn.classList.add('loading');

    chrome.runtime.sendMessage(
      {
        type: 'get-fingerprint',
      } as Message,

      message => {
        console.log({ message });

        if (target && message?.data?.visitorId) {
          triggerBtn.disabled = false;
          triggerBtn.classList.remove('loading');

          target.innerHTML = `<b>${message.data.visitorId}</b>`;
        }
      }
    );
  });
}
