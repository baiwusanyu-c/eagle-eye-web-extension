import type { IAnalysis } from '@/api/analysis'
import { MESSAGE_TYPES } from '@/enums'
import { analysisUrl } from '@/api/analysis'
async function getAnalysis(params: IAnalysis) {
  const tabId = await getCurrentTabId()
  const res = await analysisUrl(params)
  chrome.tabs.sendMessage(Number(tabId), { type: MESSAGE_TYPES.ANALYSIS_RES, data: res })
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
  const tabId = await getCurrentTabId()
  if (!tabId) return
  // 发送给当前激活的 tab
  chrome.tabs.sendMessage(Number(tabId), { type: MESSAGE_TYPES.INFORM_ANALYSIS })
}

export async function getCurrentTabId() {
  const queryOptions = { active: true, currentWindow: true }
  const [tab] = await chrome.tabs.query(queryOptions)
  if (tab && tab.id) {
    return tab.id
  }
  return 0
}
