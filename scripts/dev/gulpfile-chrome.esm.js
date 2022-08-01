/*
 * @deprecated
 * @author czh
 * @update (czh 2022/7/22)
 */
// 打包方式：串行(series)  并行(parallel)
import path from 'path'
import { dest, parallel, series, src } from 'gulp'
import fs from 'fs-extra'
import { run, withTaskName } from '../utils.js'
function moveToDir(targetDir) {
  return src(path.resolve('../dist/temp/**')).pipe(dest(path.resolve(`../dist/${targetDir}`)))
}

/**
 * Safari插件 重新popup.html资源路径
 * @returns {function(*): string}
 */
const pathRewriter = () => {
  // src 读取，on修改，dest写入
  return src(path.resolve('../dist/temp/ui/popup.html'))
    .on('data', data => {
      let content = data.contents.toString()
      content = content.replaceAll('/ui/', '')
      data.contents = new Buffer(content)
    })
    .pipe(dest(path.resolve(`../dist/temp/ui/`), { overwrite: true }))
}
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
