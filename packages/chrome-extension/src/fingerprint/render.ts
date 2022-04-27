import { newWindowStrategy } from './strategies/newWindow.strategy';
import { FingerprintStrategy } from '../types';
import { iframeStrategy } from './strategies/iframe.strategy';

interface State {
  strategy: FingerprintStrategy;
}

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
  
  .result, .get-fingerprint {
      margin-bottom: 1rem;
  }
  
  .strategy-title {
      margin-bottom: 0.5rem;
  }

</style>
    <div class='fingerprint-container'>
      <div class='result-container'>
        <div class='result'>
          Click below to get your visitorId:
        </div>
        <button title='Get your fingerprint' class='get-fingerprint'>
          <img src='${logo}' alt=''>
        </button>
        <div class='radio-section'>
          <div class='strategy-title'>Strategy to obtain visitorId:</div>
         <label>
          <input checked type='radio' name='strategy' value='${FingerprintStrategy.NewWindow}' />
          New window
         </label>
         <label>
          <input type='radio' name='strategy' value='${FingerprintStrategy.Iframe}' />
          Iframe
         </label>
        </div>
    </div>
  </div>
  `;

  setupListeners(target);
}

function setupListeners(container: Element) {
  const state: State = {
    strategy: FingerprintStrategy.NewWindow,
  };

  const getFingerprintBtn = container.querySelector<HTMLButtonElement>(
    '.get-fingerprint'
  )!;
  const resultContainer = container.querySelector('.result')!;
  const strategyRadio = container.querySelectorAll<HTMLInputElement>(
    'input[name="strategy"]'
  );

  strategyRadio.forEach(radio => {
    radio.addEventListener('change', event => {
      state.strategy = (event.target as HTMLInputElement)
        .value as FingerprintStrategy;
    });
  });

  getFingerprintBtn.addEventListener('click', async () => {
    let visitorId: string | undefined;

    resultContainer.innerHTML = '';
    getFingerprintBtn.disabled = true;
    getFingerprintBtn.classList.add('loading');

    switch (state.strategy) {
      case FingerprintStrategy.NewWindow:
        visitorId = await newWindowStrategy();
        break;

      case FingerprintStrategy.Iframe:
        visitorId = await iframeStrategy(container);

        break;
    }

    getFingerprintBtn.disabled = false;
    getFingerprintBtn.classList.remove('loading');

    if (visitorId) {
      resultContainer.innerHTML = `Your visitorId: <b>${visitorId}</b>`;
    }
  });
}
