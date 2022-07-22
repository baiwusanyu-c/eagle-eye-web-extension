import { MESSAGE_TYPES } from '../enums'
import { analysisUrl } from '../api/analysis'
import useBrowser from '../hooks/use-browser'
import type { IAnalysis } from '../api/analysis'
const { browserInst } = useBrowser()
async function getAnalysis(params: IAnalysis) {
  const tabList = await getCurrentTab(params.url)
  const res = await analysisUrl(params)
  tabList.forEach(val => {
    browserInst.tabs.sendMessage(Number(val.id), { type: MESSAGE_TYPES.ANALYSIS_RES, data: res })
  })
}

browserInst.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse('background')
  // content 载入时调用
  // 分析网站是否为钓鱼
  if (request.type === MESSAGE_TYPES.GET_ANALYSIS_RES) {
    getAnalysis({ url: request.data.host, web3_flag: request.data.web3_flag })
    return
  }
  // 接收 是否设置插件开启
  if (request.type === MESSAGE_TYPES.SET_SWITCH) {
    informAnalysis()
    // 中转消息
    return
  }
})

async function informAnalysis() {
  const tabId = await getCurrentActiveTabId()
  if (!tabId) return
  // 发送给当前激活的 tab
  browserInst.tabs.sendMessage(Number(tabId), { type: MESSAGE_TYPES.INFORM_ANALYSIS })
}

export async function getCurrentActiveTabId() {
  const queryOptions = { active: true, currentWindow: true }
  const [tab] = await browserInst.tabs.query(queryOptions)
  if (tab && tab.id) {
    return tab.id
  }
  return 0
}
export async function getCurrentTab(url: string) {
  const tab = await browserInst.tabs.query({})
  if (tab && tab.length > 0) {
    let tabList = []
    tabList = tab.filter(val => {
      return val.url && val.url!.indexOf(url) > -1
    })
    return tabList
  }
  return [{ id: 0 }]
}
