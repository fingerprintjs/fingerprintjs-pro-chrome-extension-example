import type { BrowserContext } from 'playwright';

export interface ExtensionDefinition {
  id: string;
  install?: (browser: BrowserContext, extensionId: string) => Promise<void>;
  name: string;
}

export const thirdPartyExtensions: ExtensionDefinition[] = [
  {
    id: 'cjpalhdlnbpafiamejdnhcphjbkeiagm',
    name: 'uBlock',
  },
];
