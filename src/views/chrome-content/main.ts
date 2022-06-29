import { createApp } from 'vue'
import { loadSvg } from 'vite-plugin-svg-transform-script'
// @ts-ignore
import BeUI from '../../../public/be-ui/be-ui.es.js'
import svgDict from '../../utils/svg-dict'
import content from '../chrome-content/chrome-content.vue'
import '../../assets/style/packages/index.scss'
/**
 * 初始化图标，生成svgDom
 */
loadSvg(svgDict)
/**
 * 创建挂载节点并插入到注入页面下
 * @param id
 */
export function createMountElm(id: string): HTMLElement {
  const mountElm = document.createElement('div')
  mountElm.id = id
  document.body.append(mountElm)
  return mountElm
}
let app = createApp(content)
app.use(BeUI)
let anchorElm = createMountElm('beosin_eagle_eye_dialog')
app.mount(anchorElm)
/**
 * 某些网站可能会删除注入的元素，
 * 这里监听网站的body，发现删除了
 * 就重新创建并挂载vue
 */
const observerByBody = new MutationObserver(data => {
  data.forEach(record => {
    if (record.removedNodes.length > 0) {
      record.removedNodes.forEach((node: Node) => {
        const nodeElm = node as Element
        if (nodeElm.id && nodeElm.id === 'beosin_eagle_eye_dialog') {
          loadSvg(svgDict)
          app = createApp(content)
          app.use(BeUI)
          anchorElm = createMountElm('beosin_eagle_eye_dialog')
          app.mount(anchorElm)
        }
      })
    }
  })
})
observerByBody.observe(document.body, { childList: true })
export { observerByBody }
