import { defineConfig ,loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import Components from 'unplugin-vue-components/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { transformScript } from 'vite-plugin-svg-transform-script'
import { r } from './scripts/util'
// https://vitejs.dev/config/
export default defineConfig(()=>{
  return   {
    base: 'ui',
    // 指定环境变量文件路径
    envDir: './env/',
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
  }
})
