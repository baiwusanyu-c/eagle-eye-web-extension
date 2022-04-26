import { createApp } from 'vue'
import Popup from '@/views/chrome-popup/chrome-popup.vue'
import '../../../public/be-ui/style.css'
// @ts-ignore
import BeUI from '../../../public/be-ui/be-ui.es.js'
const app = createApp(Popup)
app.use(BeUI)
app.mount('#app')
