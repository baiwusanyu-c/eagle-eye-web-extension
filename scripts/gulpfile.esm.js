/*
 * @deprecated
 * @author czh
 * @update (czh 2022/7/22)
 */
// 打包方式：串行(series)  并行(parallel)
import path from 'path'
import { dest, parallel, series, src } from 'gulp'
import { run, withTaskName } from './utils.js'

function moveToDir(targetDir) {
  return src(path.resolve('../dist/temp/**')).pipe(dest(path.resolve(`../dist/${targetDir}`)))
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
    await run('esno  scripts/manifest.js')
    // 移动打包文件 dist/temp -> dist/chrome
    await moveToDir('chrome')
    // 删除打包文件 dist/temp
    await run('rimraf dist/temp')
  }),
  withTaskName('build:safari-extension', async () => {
    // 打包 chrome 插件 popup
    await run('esno  scripts/browser.js safari && vite build --mode=production')
    // 打包 chrome content
    await run(
      'esno  scripts/browser.js safari && vite build --mode=production --config vite-content.config.ts'
    )
    // 打包 chrome background
    await run(
      'esno  scripts/browser.js safari && vite build --mode=production --config vite-background.config.ts'
    )
    // 移动打包文件 dist/temp -> dist/safari
    await moveToDir('safari')
    // 删除打包文件 dist/temp
    await run('rimraf dist/temp')
  })
)
