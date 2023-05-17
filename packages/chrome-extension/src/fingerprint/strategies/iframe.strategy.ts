import { getWebsiteURL } from '../website';

/**
 * Obtains visitorId by creating new iframe in the DOM, then listening for message from it.
 * */
export function iframeStrategy(container: Element) {
  const iframe = document.createElement('iframe');

  iframe.style.width = '100%';
  iframe.style.height = '200px';
  iframe.style.border = 'none';
  iframe.src = getWebsiteURL();

  return new Promise<string>(resolve => {
    const handler = (event: MessageEvent) => {
      console.log(event);

      if (event.data?.data?.visitorId) {
        window.removeEventListener('message', handler);

        iframe.remove();

        resolve(event.data.data.visitorId);
      }
    };

    window.addEventListener('message', handler);

    container.appendChild(iframe);
  });
}
