import { renderFingerprintSection } from './render';

const root = document.createElement('div');
const shadowRoot = root.attachShadow({ mode: 'open' });

const container = document.createElement('main');
container.style.position = 'fixed';
container.style.bottom = '10px';
container.style.right = '10px';
container.style.width = '250px';
container.style.zIndex = '999';
container.style.padding = '10px';
container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
container.style.backgroundColor = '#fff';

shadowRoot.appendChild(container);

document.body.appendChild(root);

renderFingerprintSection(container);
