import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import WindiCSS from 'vite-plugin-windicss'
import { transformScript } from 'vite-plugin-svg-transform-script'
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
    WindiCSS(),
    Components({
      dts: true,
    }),
    transformScript({
      input: './icon/',
      output: './src/utils/',
      name: 'svg-dict',
      type: 'ts',
      format: 'default',
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
