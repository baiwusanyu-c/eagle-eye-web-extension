/*
 * @deprecated
 * @author czh
 * @update (czh 2022/7/22)
 */
// 打包方式：串行(series)  并行(parallel)
import path from 'path'
import { dest, parallel, series, src } from 'gulp'
import fs from 'fs-extra'
import { run, withTaskName } from './utils.js'
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
  withTaskName('build:chrome-extension', async () => {
    // 打包 chrome 插件 popup
    await run('esno  scripts/browser.js chrome && vite build --mode=production')
    // 打包 chrome content
    await run(
      'esno  scripts/browser.js chrome && vite build --mode=production --config vite-content.config.ts'
    )
    // 打包 chrome background
    await run(
      'esno  scripts/browser.js chrome && vite build --mode=production --config vite-background.config.ts'
    )
    // 打包 chrome manifest
    await run('esno  scripts/manifest-chrome.js')
    // 移动打包文件 dist/temp -> dist/chrome
    await moveToDir('chrome')
    // 删除打包文件 dist/temp
    await run('rimraf dist/temp')
  }),
  withTaskName('build:safari-extension', async () => {
    // 打包 safari 插件 popup
    await run('esno  scripts/browser.js safari && vite build --mode=production')
    // 打包 safari content
    await run(
      'esno  scripts/browser.js safari && vite build --mode=production --config vite-content.config.ts'
    )
    // 打包 safari background
    await run(
      'esno  scripts/browser.js safari && vite build --mode=production --config vite-background.config.ts'
    )
    // 打包 safari manifest
    await run('esno  scripts/manifest-safari.js')
    // 移动打包文件 dist/temp -> dist/safari
    await moveToDir('safari')
    await pathRewriter()
    // safari插件打包后移动到苹果项目下
    await run('gulp -f scripts/move-dist.esm.js')
    // 删除打包文件 dist/temp
    await run('rimraf dist/temp')
  })
)
