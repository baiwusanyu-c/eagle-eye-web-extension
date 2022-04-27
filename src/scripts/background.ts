import { MESSAGE_TYPES } from '@/enums'
import { getRouterInfo } from '@/api/api-test'

async function r() {
  const tabId = await getCurrentTabId()
  const res = await getRouterInfo({ systemCode: 'beosin-eye' })
  chrome.tabs.sendMessage(Number(tabId), { type: MESSAGE_TYPES.ANALYSIS_RES, data: res })
}

chrome.runtime.onMessage.addListener(request => {
  // content 载入时调用
  // 分析网站是否为钓鱼
  if (request.type === MESSAGE_TYPES.GET_ANALYSIS_RES) {
    r()
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

async function getCurrentTabId() {
  const queryOptions = { active: true, currentWindow: true }
  const [tab] = await chrome.tabs.query(queryOptions)
  if (tab && tab.id) {
    return tab.id
  }
  return 0
}
