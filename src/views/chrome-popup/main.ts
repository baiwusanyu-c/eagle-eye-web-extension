import { createApp } from 'vue'
import { loadSvg } from 'vite-plugin-svg-transform-script'
import '../../assets/style/packages/be-switch.scss'
import 'virtual:windi.css'

import svgDict from '../../utils/svg-dict'
// @ts-ignore
import BeUI from '../../../public/be-ui/be-ui.es.js'
import Popup from '../../views/chrome-popup/chrome-popup.vue'
/**
 * 初始化图标，生成svgDom
 */
loadSvg(svgDict)
const app = createApp(Popup)
app.use(BeUI)
app.mount('#app')
