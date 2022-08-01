import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: false,
  // 指定环境变量文件路径
  envDir: './env/',
  build: {
    outDir: 'dist/temp/scripts/background',
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      entry: './src/scripts/background.ts',
      name: 'background',
      fileName: 'background',
    },
  },
})
