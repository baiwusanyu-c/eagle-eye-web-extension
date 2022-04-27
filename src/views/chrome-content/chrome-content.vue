<script lang="tsx">
  import { defineComponent, ref } from 'vue'
  import { debounce } from 'lodash-es'
  import { MESSAGE_TYPES } from '@/enums'
  import { getHost } from '@/utils/common'
  import { web3Reg } from '@/utils/reg'
  import { CACHE_KEYS, useStorage } from '@/hooks/use-storage'
  import useCommon from '@/hooks/use-common'
  import { SOCIAL_LINK } from '@/enums/link'
  export default defineComponent({
    setup() {
      const showMsg = ref<boolean>(false)
      const openMsg = (): void => {
        showMsg.value = true
      }
      // 获取js的请求信息
      const infos = ref<Array<string>>([])
      const { getItem } = useStorage()
      /**
       * 分析网站
       */
      const analysisWebSite = (): void => {
        getItem(CACHE_KEYS.IS_OPEN).then(res => {
          if (res && res === 'true') {
            // 获取该网站请求的js
            infos.value = filterJsRequestInfo(performance) || []
            // 开启监听
            listenerRequest()
            // 判断是否Web3
            isWeb3WebSite()
            // 分析钓鱼
            // analysisPhishingSite()
          } else {
            observer?.disconnect()
          }
        })
      }
      /**
       * 监听网站新的请求
       */
      let observer: PerformanceObserver | null = null
      const listenerRequest = (): void => {
        if (!PerformanceObserver) {
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
        if (!isWeb3.value) return
        // 发送给background调取接口
        const host = getHost()
        chrome.runtime.sendMessage({
          type: MESSAGE_TYPES.GET_ANALYSIS_RES,
          data: { host, isWeb3: isWeb3.value },
        })
        // 接收background调取接口的结果
        chrome.runtime.onMessage.addListener((request): void => {
          if (request.type === MESSAGE_TYPES.ANALYSIS_RES) {
            console.log(request.data)
            resVal.value = request.data
            openMsg()
            // 关闭监听，提示过了以后，确认了这是钓鱼网站，后续的js请求我们不在关心，这里就关掉监听
            // 关掉、测试关掉后跳转 能否监听
            observer?.disconnect()
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
      const { openWindow } = useCommon()
      return {
        showMsg,
        resVal,
        infos,
        openWindow,
        SOCIAL_LINK,
      }
    },
  })
</script>
<template>
  <be-dialog v-model:is-show="showMsg" titles=" " layout="right">
    <div>
      <div class="flex justify-start h-30px mb-4" style="position: absolute; top: 15px; left: 15px">
        <img alt="" src="../../../public/favicon_32.png" class="mr-4" />
        <h2 class="text-2xl font-bold">Beosin Alert</h2>
      </div>
      <div class="flex justify-center items-center my-8">
        <be-icon
          color="#f43f5e"
          custom-class="mr-4 eagle-warning--icon"
          icon="iconEagleWarning"></be-icon>
        <h1 class="text-amber-500 text-4xl m-0">Malicious Website！</h1>
      </div>
      <div class="my-0 mx-auto mb-8" style="width: 80%">
        <p class="text-base text-left">
          The current site may be a <span class="text-rose-500">fake or phishing or scam</span> web3
          site. There could be damage to your
          <span class="text-rose-500">private keys or funds.</span> Please
          <span class="text-rose-500">close it</span> as soon as possible.
        </p>
      </div>
      <div class="flex justify-start h-50px my-0 mx-auto" style="width: 80%">
        <span class="text-base leading-50px">© Beosin</span>
        <div class="flex items-center eagle-eye--popup--footer ml-4">
          <be-icon
            custom-class="mr-4 cursor-pointer"
            icon="iconTwitter"
            @click="openWindow(SOCIAL_LINK.TWITTER)"></be-icon>
          <be-icon
            custom-class="cursor-pointer"
            icon="iconTelegram"
            @click="openWindow(SOCIAL_LINK.TELERGRAM)"></be-icon>
        </div>
      </div>
    </div>
    <template #footer>
      <be-button type="success" custom-class="eagle-btn" @click="showMsg = false">
        confirm
      </be-button>
    </template>
  </be-dialog>
</template>
<style>
  .eagle-eye-dialog .be-button__mini {
    height: 24px;
    line-height: 24px;
    padding: 0 15px;
    border-radius: 4px;
  }
  #beosin_eagle_eye_dialog .be-dialog-container-head {
    text-align: initial;
  }
  #beosin_eagle_eye_dialog .be-dialog-container-head span {
    @apply text-2xl font-bold;
  }
  #beosin_eagle_eye_dialog .be-dialog-modal {
    z-index: 9998;
  }
  #beosin_eagle_eye_dialog .be-dialog {
    z-index: 9999;
  }
  #beosin_eagle_eye_dialog .be-dialog-container {
    width: 700px;
    height: 420px;
  }
  #beosin_eagle_eye_dialog .eagle-btn {
    box-sizing: border-box;
    min-width: 120px;
    padding: 0 10px;
    color: #fff;
    background: linear-gradient(90deg, #0de3b2 0%, #008ee9 100%);
    opacity: 1;
  }
  #beosin_eagle_eye_dialog .eagle-btn:hover,
  #beosin_eagle_eye_dialog .eagle-btn:focus {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
    opacity: 0.8;
  }
  #beosin_eagle_eye_dialog .be-dialog .be-icon {
    @apply h-6 w-6;
  }
  #beosin_eagle_eye_dialog .eagle-warning--icon .be-icon {
    @apply h-16 w-16;
  }
</style>
