import { defineConfig } from 'vite'

import { r } from './scripts/util'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: false,
  resolve: {
    alias: {
      '@': r('src'),
    },
  },
  // 指定环境变量文件路径
  envDir: './env/',
  build: {
    outDir: 'dist/scripts/background',
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      entry: r('./src/scripts/background.ts'),
      name: 'background',
      fileName: 'background',
    },
  },
})
