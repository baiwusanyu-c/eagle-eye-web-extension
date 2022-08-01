import path from 'path'
import { spawn } from 'child_process'

export const r = (...args) => path.resolve(__dirname, '..', ...args)
// 自定义每个task的name
export const withTaskName = (name, fn) => Object.assign(fn, { displayName: name })

// 在node中开启一个子进程来运行脚本
export const run = async command => {
  return new Promise(resolve => {
    // 将命令分割 例如：rm -rf 分割为['rm', '-rf'],进行解构[cmd,...args]
    const [cmd, ...args] = command.split(' ')
    const app = spawn(cmd, args, {
      cwd: r('./'),
      stdio: 'inherit',
      shell: true, // 默认情况下 linux才支持 rm -rf  windows安装git bash
    })
    // 在进程已结束并且子进程的标准输入输出流已关闭之后，则触发 'close' 事件
    app.on('close', resolve) //
  })
}

// 重写打包后的@be-ui 路径
export const pathRewriter = format => {
  return id => {
    id = id.replaceAll('@be-ui', `dist/${format}`)
    return id
  }
}
