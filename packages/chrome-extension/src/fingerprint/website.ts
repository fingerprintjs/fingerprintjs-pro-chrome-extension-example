export function getWebsiteURL() {
  const baseUrl = import.meta.env.VITE_WEBSITE_URL;

  if (!baseUrl) {
    throw new Error('WEBSITE_URL is not provided in .env file');
  }

  const url = new URL(baseUrl);

  if (import.meta.env.VITE_ADD_EXTENSION_ID_TO_URL === 'true') {
    const extensionId = chrome.runtime.id;

    if (!extensionId) {
      throw new Error('Extension ID is not available');
    }

    url.searchParams.set('extensionIds', extensionId);
  }

  return url.toString();
}
