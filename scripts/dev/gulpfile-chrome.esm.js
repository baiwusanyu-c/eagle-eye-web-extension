/*
 * @deprecated
 * @author czh
 * @update (czh 2022/7/22)
 */
// 打包方式：串行(series)  并行(parallel)
import { series } from 'gulp'

import { run, withTaskName } from '../utils.js'

export default series(
  withTaskName('clean', async () => run('pnpm run clean')), // 删除dist目录
  // 打包 chrome
  withTaskName('dev:chrome-extension', async () => {
    // 打包 chrome 插件 popup
    run('esno  scripts/browser.js chrome && vite build --watch --mode=production')
    // 打包 chrome content
    run(
      'esno  scripts/browser.js chrome && vite build --watch --mode=production --config vite-content.config.ts'
    )
    // 打包 chrome background
    run(
      'esno  scripts/browser.js chrome && vite build --watch --mode=production --config vite-background.config.ts'
    )
    // 打包 chrome manifest
    run('esno  scripts/manifest-chrome.js')
  })
)
