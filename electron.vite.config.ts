import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import os from "os";
import { resolve } from 'path';
import { viteStaticCopy } from "vite-plugin-static-copy";

import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin() ,
      viteStaticCopy({
        targets: [
          {
            src: `lib/whisper.cpp/${
              process.env.PACKAGE_OS_ARCH || os.arch()
            }/${os.platform()}/*`,
            dest: "lib/whisper",
          },
          {
            src: `lib/whisper.cpp/models/*`,
            dest: "lib/whisper/models",
          },
          {
            src: `lib/youtubedr/${
              process.env.PACKAGE_OS_ARCH || os.arch()
            }/${os.platform()}/*`,
            dest: "lib/youtubedr",
          },
          {
            src: "src/main/db/migrations/*",
            dest: "migrations",
          },
          {
            src: "samples/*",
            dest: "samples",
          },
        ],
      }),]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  }
})
