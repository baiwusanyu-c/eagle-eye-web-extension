const path = require('path')
const { readFileSync, exists, mkdir, writeFile } = require('fs')
const projectRoot = path.resolve(__dirname, '../')

function getCmdParams() {
  const envScript = process.argv[process.argv.length - 1]
  return {
    env: envScript,
  }
}
function buildEnvVar() {
  const { env } = getCmdParams()
  const filePath = `${projectRoot}/env`
  // 读取config.ts
  let readFileInfo = readFileSync(`${filePath}/.env`, {
    withFileTypes: true,
  }).toString()
  // 根据命令参数修改要导出的环境变量
  const replaceTargetInfo = readFileInfo.split(' = ')[0]
  readFileInfo = `${replaceTargetInfo} = '${env}'`
  // 生成文件覆盖
  exists(filePath, isExist => {
    if (!isExist) {
      mkdir(filePath, () => {
        writeFile('.env', readFileInfo, err => {
          if (err) {
            console.log(err)
            return
          }
          console.log('BROWSER_ENV was updated!')
        })
      })
    } else {
      writeFile(`${filePath}/.env`, readFileInfo, err => {
        if (err) {
          console.log(err)
          return
        }
        console.log('BROWSER_ENV was updated!')
      })
    }
  })
}
buildEnvVar()
