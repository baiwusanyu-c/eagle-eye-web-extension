/*
 * @use-common.ts
 * @deprecated
 * @author czh
 * @update (czh 2022/4/27)
 */
export default () => {
  const openWindow = (strUrl: string, winName = '_blank'): void => {
    // 模拟a标签点击，实现无糖浏览器下的新开tab
    const aDom = document.createElement('a')
    aDom.href = strUrl
    aDom.target = winName
    document.body.appendChild(aDom)
    aDom.click()
    document.body.removeChild(aDom)
  }
  return {
    openWindow,
  }
}
