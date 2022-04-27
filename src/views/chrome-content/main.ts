import { createApp } from 'vue'
import 'virtual:windi.css'
import { loadSvg } from 'vite-plugin-svg-transform-script'
// @ts-ignore
import BeUI from '../../../public/be-ui/be-ui.es.js'
import '../../../public/be-ui/style.css'
import svgDict from '../../utils/svg-dict'
import content from '../chrome-content/chrome-content.vue'
/**
 * 初始化图标，生成svgDom
 */
loadSvg(svgDict)
/**
 * 创建挂载节点并插入到注入页面下
 * @param id
 */
function createMountElm(id: string): HTMLElement {
  const mountElm = document.createElement('div')
  mountElm.id = id
  document.body.append(mountElm)
  return mountElm
}
const app = createApp(content)
app.use(BeUI)
app.mount(createMountElm('beosin_eagle_eye_dialog'))
