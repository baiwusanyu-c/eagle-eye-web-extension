import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { transformScript } from 'vite-plugin-svg-transform-script'
import { r } from './scripts/util'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: false,
  css: {
    // css预处理器
    preprocessorOptions: {
      scss: {
        // 引入 var.scss 这样就可以在全局中使用 var.scss中预定义的变量了
        additionalData: `
            @import "./src/assets/style/common/var.scss";
            @import "./src/assets/style/common/config.scss";
            @import "./src/assets/style/common/mixin.scss";
            @import "./src/assets/style/common/common.scss";
            @import "./src/assets/style/common/animate.scss";
            `,
      },
    },
  },
  plugins: [
    vue(),
    vueJsx(),
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
