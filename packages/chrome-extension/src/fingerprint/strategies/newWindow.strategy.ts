import { Message } from '../../types';

/**
 * Obtains visitorId by creating new window to external website.
 *
 * The message is being sent to background script, which creates the window and listens for the message from it.
 * Once it arrives, it returns the result to sender.
 *
 * @see {getFingerprint}
 * */
export function newWindowStrategy() {
  return new Promise<string>((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: 'get-visitor-id',
      } as Message,

      message => {
        console.log({ message });

        if (message?.data?.visitorId) {
          resolve(message.data.visitorId);
        } else {
          reject(new Error('Failed to get visitorId'));
        }
      }
    );
  });
}
