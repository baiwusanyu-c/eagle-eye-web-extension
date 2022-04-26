<script lang="tsx">
  import { defineComponent, ref ,onMounted} from 'vue'
  import { debounce } from 'lodash-es'
  // @ts-ignore
  import { BeMsg } from '../../../public/be-ui/be-ui.es.js'
  import { MESSAGE_TYPES } from '@/enums'
  import { getHost } from '@/utils/common'
  import {web3Reg} from "@/utils/reg";
  import {CACHE_KEYS, useStorage} from "@/hooks/use-storage";

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
      const {getItem} = useStorage()
      /**
       * 分析网站
       */
      const analysisWebSite = (): void => {
          getItem(CACHE_KEYS.IS_OPEN).then(res=>{
              if(res && res === 'true'){
                  // 获取该网站请求的js
                  infos.value = filterJsRequestInfo(performance) || []
                  // 开启监听
                  listenerRequest()
                  // 判断是否Web3
                  isWeb3WebSite()
                  // 分析钓鱼
                  // analysisPhishingSite()
              }else{
                  observer?.disconnect();
              }
          })
      }
      /**
       * 监听网站新的请求
       */
      let observer:PerformanceObserver | null = null
      const listenerRequest = (): void => {
          if(!PerformanceObserver){
              console.warn('this browser not supported API PerformanceObserver')
              return
          }
        // 监听新的请求
        observer = new PerformanceObserver(
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
            if (web3Reg.test(val)) {
              isWeb3.value = true
            }
          })
        } catch (error) {
          console.log(error)
        }
      }
      const resVal = ref({})
      /**
       * 后台请求 是否为钓鱼网站
       */
      const analysisPhishingSite = (): void => {
            if(!isWeb3.value) return
          // 发送给background调取接口
          const host = getHost()
          chrome.runtime.sendMessage({
              type: MESSAGE_TYPES.GET_ANALYSIS_RES,
              data: { host, isWeb3: isWeb3.value },
          })
          // 接收background调取接口的结果
          chrome.runtime.onMessage.addListener((request): void => {
              if(request.type === MESSAGE_TYPES.ANALYSIS_RES){
                  resVal.value = request.data
                  openMsg('success', isWeb3.value.toString(), host)
                  // 关闭监听，提示过了以后，确认了这是钓鱼网站，后续的js请求我们不在关心，这里就关掉监听
                  // 关掉、测试关掉后跳转 能否监听
                  observer?.disconnect();
              }
          })
      }

      // 开始分析
        analysisWebSite()
       chrome.runtime.onMessage.addListener(request => {
           // 接收 是否设置插件开启
           if (request.type === MESSAGE_TYPES.INFORM_ANALYSIS) {
               analysisWebSite()
           }
       })
      return {
        resVal,
        infos,
      }
    },
  })
</script>
<style>
  .eagle-eye-dialog .be-button__mini {
    height: 24px;
    line-height: 24px;
    padding: 0 15px;
    border-radius: 4px;
  }
</style>
