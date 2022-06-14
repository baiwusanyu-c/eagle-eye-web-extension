/*
 * @analysis.ts
 * @deprecated
 * @author czh
 * @update (czh 2022/4/24)
 */
import request from '../utils/fetch'
import config from '../enums/config'
// 获取路由信息
export interface IAnalysis {
  url: string
  is_web3: boolean
}

export async function analysisUrl(params: IAnalysis) {
  const res = await request(`${config.baseURL}/ussa/public/plugin/risk_url/verify`, {
    method: 'POST',
    params,
  })
  return res
}
