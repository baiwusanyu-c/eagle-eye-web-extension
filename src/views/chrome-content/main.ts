import { createApp } from 'vue'
import content from '../chrome-content/chrome-content.vue'
import '../../../public/be-ui/style.css'
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
app.mount(createMountElm('beosin_eagle_eye_dialog'))
