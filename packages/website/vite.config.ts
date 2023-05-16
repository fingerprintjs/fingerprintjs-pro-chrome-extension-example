import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import mkcert from 'vite-plugin-mkcert';

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

export default defineConfig({
  build: {
    outDir: 'build',
  },
  server: { https: true },
  plugins: [mkcert()],
});
