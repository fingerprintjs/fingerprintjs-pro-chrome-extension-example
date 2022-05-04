import * as path from 'path';

export const getExtensionPath = () =>
  path.resolve(__dirname, '../../chrome-extension/build');
