import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { r } from './scripts/util'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: false,
  resolve: {
    alias: {
      '@': r('src'),
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    Components({
      dts: true,
    }),
  ],
  // 指定环境变量文件路径
  envDir: './env/',
  build: {
    outDir: 'dist/scripts/content',
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      entry: r('./src/views/chrome-content/main.ts'),
      name: 'content',
      fileName: 'content',
    },
  },
})
