import { defineConfig } from 'vite';
import * as dotenv from 'dotenv';
import * as path from 'path';
import pkg from './package.json';
import { viteStaticCopy } from 'vite-plugin-static-copy';

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

function parseVersion(version: string) {
  const safeVersion = version.split('-')[0];

  return {
    version: safeVersion,
    versionName: version,
  };
}

function transformManifest(content: string | Buffer) {
  const { version, versionName } = parseVersion(pkg.version);

  const manifest = JSON.parse(content.toString());

  manifest.externally_connectable.matches = [
    `${process.env.VITE_WEBSITE_URL}*`,
  ];

  manifest.version = version;
  manifest.version_name = versionName;

  return JSON.stringify(manifest);
}

export default defineConfig({
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'index.html'),
        background: path.resolve(__dirname, 'src/background.ts'),
        content: path.resolve(__dirname, './src/contentRoot.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].js',
        inlineDynamicImports: false,
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, 'manifest.json'),
          dest: './',
          transform: transformManifest,
        },
      ],
    }),
  ],
});
