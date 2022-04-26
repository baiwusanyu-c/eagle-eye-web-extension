<script lang="tsx">
  import { defineComponent, ref } from 'vue'
  import { debounce } from 'lodash-es'
  // @ts-ignore
  import { BeMsg } from '../../../public/be-ui/be-ui.es.js'
  import { MESSAGE_TYPES } from '@/enums'
  import { getHost } from '@/utils/common'
  import { CACHE_KEYS, useStorage } from '@/hooks/use-storage'

  const msgBox = BeMsg.service
  export default defineComponent({
    setup() {
      const openMsg = (type: string, title: string, host: string): void => {
        msgBox({
          customClass: 'eagle-eye-dialog',
          titles: title,
          msgType: type,
          bodyRender: () => {
            return (
              <p style="font-size:14px;font-weight:400;font-family: Microsoft YaHei;letter-spacing: 2px;">
                自然选择号！前进四！{host}
              </p>
            )
          },
        })
      }
      // 获取js的请求信息
      const infos = ref<Array<string>>([])
      /**
       * 分析网站
       */
      const analysisWebSite = (): void => {
        // 获取该网站请求的js
        infos.value = filterJsRequestInfo(performance) || []
        // 开启监听
        listenerRequest()
        // 判断是否Web3
        isWeb3WebSite()
        // 分析钓鱼
        // analysisPhishingSite()
      }
      /**
       * 监听网站新的请求
       */
      const listenerRequest = (): void => {
        // 监听新的请求
        const observer = new PerformanceObserver(
          debounce(list => {
            infos.value = infos.value.concat(filterJsRequestInfo(list) || [])
            // 判断是否Web3
            isWeb3WebSite()
            // 分析钓鱼
            analysisPhishingSite()
          }, 2000)
        )
        observer.observe({ entryTypes: ['resource'] })
      }
      /**
       * 过滤出js请求
       * @param list
       */
      const filterJsRequestInfo = (list: PerformanceObserverEntryList): Array<string> | void => {
        if (list) {
          return list
            .getEntriesByType('resource')
            .filter(val => {
              return val.name.indexOf('.js') >= 0
            })
            .map(val => val.name)
        }
      }
      const isWeb3 = ref<boolean>(false)
      const isWeb3WebSite = (): void => {
        try {
          infos.value.forEach(val => {
            if (/[w|W][E|e][B|b]3/.test(val)) {
              isWeb3.value = true
            }
          })
        } catch (error) {
          console.log(error)
        }
      }
      const resVal = ref({})
      const isPhishing = ref<string>('')
      const { setItem, getItem } = useStorage()
      /**
       * 后台请求 是否为钓鱼网站
       */
      const analysisPhishingSite = (): void => {
        // 取缓存记录，如果以前判断过是钓鱼网站，就不调接口查询
        getItem(CACHE_KEYS.IS_PHISHING).then(res => {
          isPhishing.value = res as string
          if (isPhishing.value === 'true') {
            openMsg('success', isWeb3.value.toString(), 'cache')
            return
          }
          const host = getHost()
          chrome.runtime.sendMessage({
            type: MESSAGE_TYPES.GET_ANALYSIS_RES,
            data: { host, isWeb3: isWeb3.value },
          })
          chrome.runtime.onMessage.addListener((res): void => {
            resVal.value = res
            // if (res && isPhishing.value !== 'true') {
            //   setItem(CACHE_KEYS.IS_PHISHING, 'true')
            // }
            setItem(CACHE_KEYS.IS_PHISHING, 'true')
            openMsg('success', isWeb3.value.toString(), host)
          })
        })
      }
      // 开始分析
      analysisWebSite()
      return {
        resVal,
        infos,
      }
    },
  })
</script>
<template>
  <div>
    {{ resVal }}
    {{ infos }}
  </div>
</template>
<style>
  .eagle-eye-dialog .be-button__mini {
    height: 24px;
    line-height: 24px;
    padding: 0 15px;
    border-radius: 4px;
  }
</style>
