/*
 * @api-test.ts
 * @deprecated
 * @author czh
 * @update (czh 2022/4/24)
 */
import request from '../utils/request'
import config from '../enums/config'
// 获取路由信息
export interface IRouterParams {
  systemCode: string
  userId?: string | null
}

export function getRouterInfo(params: IRouterParams) {
  return request({
    url: `${config.baseURL}/beosin-meta/menu/routers`,
    method: 'get',
    params,
  })
}
