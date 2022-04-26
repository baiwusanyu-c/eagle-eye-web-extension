import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import Components from 'unplugin-vue-components/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { r } from './scripts/util'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'ui',
  resolve: {
    alias: {
      '@': r('src'),
    },
  },
  // 指定环境变量文件路径
  envDir: './env/',
  plugins: [
    vue(),
    vueJsx(),
    WindiCSS(),
    Components({
      dts: true,
    }),
  ],
  build: {
    outDir: 'dist/ui',
    sourcemap: true,
    rollupOptions: {
      external: '',
      input: {
        options: r('./options.html'),
        popup: r('./popup.html'),
      },
    },
  },
})
