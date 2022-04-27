/*
 * @api-test.ts
 * @deprecated
 * @author czh
 * @update (czh 2022/4/24)
 */
import request from '../utils/fetch'
import config from '../enums/config'
// 获取路由信息
export interface IRouterParams {
  systemCode: string
  userId?: string | null
}

export async function getRouterInfo(params: IRouterParams) {
  const res = await request(`${config.baseURL}/beosin-meta/menu/routers`, {
    method: 'GET',
    params,
  })
  return res
}
