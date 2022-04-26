import { MESSAGE_TYPES } from '@/enums'

async function r() {
  const tabId = await getCurrentTabId()
  fetch('http://124.71.132.90:9527/beosin-meta/menu/routers?systemCode=beosin-eye', {
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    method: 'GET',
  })
    .then(t => {
      return t.json()
    })
    .then(res => {
      chrome.tabs.sendMessage(Number(tabId), res)
    })
    .catch((err: Error) => {
      console.error(err)
    })
}

chrome.runtime.onMessage.addListener(request => {
  // content 载入时调用
  // 分析网站是否为钓鱼
  if (request.type === MESSAGE_TYPES.GET_ANALYSIS_RES) {
    r()
  }
})

async function getCurrentTabId() {
  const queryOptions = { active: true, currentWindow: true }
  const [tab] = await chrome.tabs.query(queryOptions)
  return tab.id
}
