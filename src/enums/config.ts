import type { IOption } from '../utils/types'
// 生产环境
enum productionUrl {
  baseURL = 'https://eagleeye.beosin.com/eagle-eye-ussa/',
}
// 开发环境
enum developmentUrl {
  baseURL = 'http://192.168.0.2:9527',
}
// 测试环境
enum stagingUrl {
  baseURL = 'http://124.71.132.90:9527',
}

const configUrl: IOption = {
  production: productionUrl,
  development: developmentUrl,
  staging: stagingUrl,
}
export default configUrl[String(import.meta.env.VITE_PROJECT_ENV)]
