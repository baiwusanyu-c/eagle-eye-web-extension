<script lang="tsx">
  import { defineComponent, ref } from 'vue'
  import { debounce } from 'lodash-es'
  import { ANALYSIS_RES, MESSAGE_TYPES } from '@/enums'
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
            infos.value = infos.value.concat(filterJsRequestInfo(list))
            // 判断是否Web3
            isWeb3WebSite()
            // 分析钓鱼
            analysisPhishingSite()
          }, 2000) as PerformanceObserverCallback
        )
        observer.observe({ entryTypes: ['resource'] })
      }
      /**
       * 过滤出js请求
       * @param list
       */
      const filterJsRequestInfo = (list: PerformanceObserverEntryList): Array<string> => {
        if (list) {
          return list
            .getEntriesByType('resource')
            .filter(val => {
              return val.name.indexOf('.js') >= 0
            })
            .map(val => val.name)
        }
        return []
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
            if (request.data.data === ANALYSIS_RES.UNSECURITY) {
              openMsg()
              // 关闭监听，提示过了以后，确认了这是钓鱼网站，后续的js请求我们不在关心，这里就关掉监听
              // 关掉、测试关掉后跳转 能否监听
              observer?.disconnect()
            }
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
      <div class="eagle-eye-dialog--title">
        <img alt="" src="../../../public/favicon_32.png" />
        <h2 class="">Beosin Alert</h2>
      </div>

      <div class="eagle-eye-dialog--body__icon">
        <be-icon
          color="#f43f5e"
          custom-class="eagle-warning--icon"
          icon="iconEagleWarning"></be-icon>
        <h1>Malicious Website！</h1>
      </div>
      <div class="eagle-eye-dialog--body__info">
        <p>
          The current site may be a <span>fake or phishing or scam</span> web3 site. There could be
          damage to your <span>private keys or funds.</span> Please <span>close it</span> as soon as
          possible.
        </p>
      </div>
      <div class="eagle-eye-dialog--body__footer">
        <span class="logo">© Beosin</span>
        <div class="eagle-eye--popup__footer">
          <be-icon
            custom-class="eagle-twitter--icon"
            icon="iconTwitter"
            @click="openWindow(SOCIAL_LINK.TWITTER)"></be-icon>
          <be-icon
            icon="iconTelegram"
            custom-class="eagle-telegram--icon"
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
  #beosin_eagle_eye_dialog {
    position: fixed;
    z-index: 198910146;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
      'Courier New', monospace sans-serif;
  }

  .eagle-eye-dialog .be-button__mini {
    height: 24px;
    line-height: 24px;
    padding: 0 15px;
    border-radius: 4px;
  }

  #beosin_eagle_eye_dialog .eagle-eye-dialog--title {
    position: absolute;
    top: 15px;
    left: 15px;
    display: flex;
    margin-bottom: 16px;
    -webkit-box-pack: start;
    justify-content: flex-start;
    height: 30px;
    align-items: center;
    font-family: inherit;
  }

  #beosin_eagle_eye_dialog .eagle-eye-dialog--title h2 {
    font-size: 24px;
    line-height: 32px;
    font-weight: 700;
    color: #303133;
    font-family: inherit;
    margin-top: 0;
    margin-bottom: 0;
  }

  #beosin_eagle_eye_dialog .eagle-eye-dialog--body__icon {
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    display: flex;
    margin-top: 32px;
    margin-bottom: 32px;
  }

  #beosin_eagle_eye_dialog .eagle-eye-dialog--body__icon h1 {
    margin: 0;
    color: rgba(245, 158, 11, 1);
    font-size: 36px;
    line-height: 40px;
    padding: 0;
    font-family: inherit;
  }

  #beosin_eagle_eye_dialog .eagle-eye-dialog--body__info {
    margin: 0 auto 32px auto;
    width: 80%;
  }

  #beosin_eagle_eye_dialog .eagle-eye-dialog--body__info p {
    text-align: left;
    font-size: 16px;
    line-height: 24px;
    margin-top: 0;
    margin-bottom: 16px;
    color: #303133;
    font-family: inherit;
  }

  #beosin_eagle_eye_dialog .eagle-eye-dialog--body__info span {
    color: rgba(244, 63, 94, 1);
    font-family: inherit;
  }

  #beosin_eagle_eye_dialog .eagle-eye-dialog--body__footer {
    width: 80%;
    display: flex;
    margin: 0 auto;
    height: 50px;
    -webkit-box-pack: start;
    justify-content: flex-start;
  }

  #beosin_eagle_eye_dialog .eagle-eye-dialog--body__footer .logo {
    line-height: 50px;
    font-size: 16px;
    font-family: inherit;
  }

  #beosin_eagle_eye_dialog .be-dialog--container__head {
    text-align: initial;
    font-weight: 700;
  }

  #beosin_eagle_eye_dialog .be-dialog--container__head span {
    font-size: 24px;
    line-height: 32px;
    font-family: inherit;
  }

  #beosin_eagle_eye_dialog .eagle-eye--popup__footer {
    -webkit-box-align: center;
    align-items: center;
    display: flex;
    margin-left: 16px;
  }

  #beosin_eagle_eye_dialog .be-dialog--container {
    width: 700px;
    height: 420px;
  }
  #beosin_eagle_eye_dialog .be-dialog--container .be-dialog--body,
  #beosin_eagle_eye_dialog .be-dialog--container .be-dialog--footer {
    padding: 16px 20px;
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
    height: 24px;
    width: 24px;
    cursor: pointer;
  }

  #beosin_eagle_eye_dialog .eagle-twitter--icon,
  #beosin_eagle_eye_dialog .eagle-telegram--icon {
    height: 24px;
    width: 24px;
  }

  #beosin_eagle_eye_dialog .eagle-warning--icon,
  #beosin_eagle_eye_dialog .eagle-twitter--icon,
  #beosin_eagle_eye_dialog .eagle-eye-dialog--title img {
    margin-right: 16px;
  }

  #beosin_eagle_eye_dialog .eagle-warning--icon .be-icon {
    height: 64px;
    width: 64px;
  }
</style>
