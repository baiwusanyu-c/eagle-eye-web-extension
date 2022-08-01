/*
 * @use-browser.ts
 * @deprecated
 * @author czh
 * @update (czh 2022/4/27)
 */
export default () => {
  // 根据参数设置浏览器插件对象
  const browserInst = import.meta.env.VITE_BROWSER === 'safari' ? browser : chrome
  return {
    browserInst,
  }
}
