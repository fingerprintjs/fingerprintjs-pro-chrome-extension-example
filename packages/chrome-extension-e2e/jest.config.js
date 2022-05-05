const path = require('path');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testRegex: 'tests/.+spec.tsx?$',
  testTimeout: 999999,
  setupFilesAfterEnv: [path.resolve(__dirname, 'tests/setup.ts')],
  globals: {
    'ts-jest': {
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    },
  },
};