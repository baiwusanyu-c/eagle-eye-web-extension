/*
 * @request.ts
 * @deprecated
 * @author czh
 * @update (czh 2021/9/29)
 */
import axios from 'axios'
import qs from 'qs'
import config from '../enums/config'

// create an axios instance
const service = axios.create({
  baseURL:
    String(import.meta.env.VITE_PROJECT_ENV) === 'production'
      ? `${config.baseURL}/hermit/back/`
      : config.baseURL,
  timeout: 50000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config: any) => {
    if (config.method === 'post' && config.url !== '/auth/oauth/login') {
      config.data = config.params
      config.headers['Content-Type'] = 'application/json;charset=UTF-8'
      config.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
      delete config.params
      if (config.otherParams) {
        config.data = qs.stringify(config.data)
      }
    }
    return config
  },
  error => {
    console.error(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200 && res.code !== '0000' && res.code !== '0400' && res.code !== '9999') {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        console.warn(res.msg || res.message)
      }
      if (res.code === 401 || res.code === 920000003) {
        console.warn(res.msg || res.message)
      }
      return Promise.reject(new Error(res.msg || res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    return Promise.reject(error)
  }
)
export default service
