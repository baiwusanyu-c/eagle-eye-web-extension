<script lang="tsx">
  import { defineComponent, nextTick, ref } from 'vue'
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
      const { getItem, setItem } = useStorage()
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
            analysisPhishingSite()
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
          }, 1500) as PerformanceObserverCallback
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
      const analysisRes = ref<{ source_name: string; source_url: string }>({
        source_name: '',
        source_url: '',
      })
      const analysisPhishingSite = async () => {
        // 发送给background调取接口
        const host = getHost()
        chrome.runtime.sendMessage({
          type: MESSAGE_TYPES.GET_ANALYSIS_RES,
          data: { host, web3_flag: isWeb3.value },
        })
        // 接收background调取接口的结果
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
          if (request.type === MESSAGE_TYPES.ANALYSIS_RES) {
            console.log(request.data.data)
            const res = request.data.data
            if (res.detection_result === ANALYSIS_RES.UNSECURITY) {
              analysisRes.value.source_name = res.source_name
              analysisRes.value.source_url = res.source_url
              openMsg()
              // 关闭监听，提示过了以后，确认了这是钓鱼网站，后续的js请求我们不在关心，这里就关掉监听
              // 关掉、测试关掉后跳转 能否监听
              observer?.disconnect()
            }
          }
          sendResponse()
        })
      }

      // 开始分析
      nextTick(() => {
        getItem(CACHE_KEYS.IS_OPEN).then(res => {
          if ((res && res === 'true') || res === undefined) {
            setItem(CACHE_KEYS.IS_OPEN, 'true')
            analysisWebSite()
          }
        })
      })
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        sendResponse()
        // 接收 是否设置插件开启
        if (request.type === MESSAGE_TYPES.INFORM_ANALYSIS) {
          analysisWebSite()
        }
      })
      const { openWindow } = useCommon()
      return {
        analysisRes,
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
        <h2 class="font-alibaba eagle-eye-dialog--text">Beosin Alert</h2>
      </div>
      <div>
        <div class="eagle-eye-dialog--body__icon">
          <h1 class="font-alibaba eagle-eye-dialog--text">Malicious Website!</h1>
        </div>
        <div class="eagle-eye-dialog--body__info">
          <p class="font-alibaba eagle-eye-dialog--text eagle-eye-dialog--info">
            The current site may be <span class="font-alibaba">fake or phishing.</span>
          </p>
          <p class="font-alibaba eagle-eye-dialog--text eagle-eye-dialog--info">
            It could steal your <span class="font-alibaba"> private keys and funds.</span>
          </p>
          <p class="font-alibaba eagle-eye-dialog--text eagle-eye-dialog--info">
            Please stay vigilant!
          </p>
        </div>
      </div>
      <img alt="" src="/src/assets/img/heck.png" class="bg-heck--img" />
    </div>
    <template #footer>
      <div class="eagle-eye-dialog--body__footer">
        <div class="eagle-eye--popup__footer">
          <span class="beosin-eagle-eye-logo font-alibaba eagle-eye-dialog--text">© Beosin</span>
          <be-icon
            custom-class="eagle-twitter--icon"
            icon="iconTwitter"
            @click="openWindow(SOCIAL_LINK.TWITTER)"></be-icon>
          <be-icon
            icon="iconTelegram"
            custom-class="eagle-telegram--icon"
            @click="openWindow(SOCIAL_LINK.TELERGRAM)"></be-icon>
        </div>
        <p
          v-if="analysisRes.source_name"
          class="font-alibaba eagle-eye-dialog--text eagle-eye-dialog--source">
          Thanks to
          <a
            :href="`https://${analysisRes.source_url}`"
            class="font-alibaba"
            style="text-decoration: underline; font-weight: bold"
            target="_blank"
            >{{ analysisRes.source_name }}</a
          >
          fo for supporting this result.
        </p>
      </div>
      <be-button
        type="success"
        custom-class="eagle-confirm--btn font-alibaba"
        round="8"
        @click="showMsg = false">
        <p class="font-alibaba">Got it</p>
      </be-button>
    </template>
  </be-dialog>
</template>
<style>
  #beosin_eagle_eye_dialog {
    position: fixed;
    z-index: 198910146;
  }

  .eagle-eye-dialog .be-button__mini {
    height: 24px;
    line-height: 24px;
    padding: 0 15px;
    border-radius: 4px;
  }

  #beosin_eagle_eye_dialog .eagle-eye-dialog--title {
    position: absolute;
    top: 32px;
    left: 32px;
    display: flex;
    margin-bottom: 16px;
    -webkit-box-pack: start;
    justify-content: flex-start;
    height: 30px;
    align-items: center;
  }

  #beosin_eagle_eye_dialog .eagle-eye-dialog--title h2 {
    font-size: 24px;
    line-height: 32px;
    font-weight: 700;
    color: #303133;
    margin-top: 0;
    margin-bottom: 0;
  }
  #beosin_eagle_eye_dialog .eagle-eye-dialog--body__icon {
    width: 60%;
    background-color: #efb507;
    border-radius: 4px;
    height: 60px;

    margin-top: 32px;
    margin-bottom: 32px;
    letter-spacing: 2px;
  }
  #beosin_eagle_eye_dialog .eagle-eye-dialog--body__icon h1 {
    color: white;
    font-size: 48px;
    line-height: 60px;
    font-weight: bold;
    text-align: left;
    padding-left: 16px;
  }

  #beosin_eagle_eye_dialog .eagle-eye-dialog--body__info {
    width: 46%;
  }

  #beosin_eagle_eye_dialog .eagle-eye-dialog--body__info p {
    text-align: left;
    font-size: 16px;
    line-height: 28px;
    margin-top: 0;
    margin-bottom: 16px;
    color: #1d263b;
  }

  #beosin_eagle_eye_dialog .eagle-eye-dialog--body__info span {
    background-color: #e6e3e3;
    padding: 0 4px;
    border-radius: 2px;
  }
  #beosin_eagle_eye_dialog .be-dialog .be-dialog--container .be-dialog--footer__right {
    align-items: flex-end;
    height: auto;
    justify-content: space-between;
  }
  #beosin_eagle_eye_dialog .eagle-eye-dialog--body__footer {
    display: flex;
    -webkit-box-pack: start;
    justify-content: flex-start;
    flex-direction: column;
  }

  #beosin_eagle_eye_dialog .eagle-eye-dialog--body__footer .beosin-eagle-eye-logo {
    line-height: 50px;
    font-size: 14px;
    font-weight: bold;

    margin-right: 16px;
  }

  #beosin_eagle_eye_dialog .be-dialog--container__head {
    text-align: initial;
    font-weight: 700;
    padding: 16px 20px;
  }

  #beosin_eagle_eye_dialog .be-dialog--container__head span {
    font-size: 24px;
    line-height: 32px;
  }

  #beosin_eagle_eye_dialog .eagle-eye--popup__footer {
    -webkit-box-align: center;
    align-items: center;
    display: flex;
  }

  #beosin_eagle_eye_dialog .be-dialog--container {
    width: 940px;
    height: 400px;
    background-image: url('../src/assets/img/heck.png');
    min-width: initial;
    border-radius: 16px;
  }
  #beosin_eagle_eye_dialog .be-dialog--container .be-dialog--title {
    border-radius: 16px;
  }
  #beosin_eagle_eye_dialog .be-dialog--container .be-dialog--body {
    padding: 16px 32px;
  }
  #beosin_eagle_eye_dialog .be-dialog--container .be-dialog--footer {
    padding: 16px 32px 32px 32px;
  }
  #beosin_eagle_eye_dialog .eagle-confirm--btn {
    box-sizing: border-box;
    width: 176px;
    height: 44px;
    padding: 0 10px;
    color: #fff;
    background: #1cd2a9;
    opacity: 1;
    position: absolute;
    right: 32px;
    bottom: 32px;
  }
  #beosin_eagle_eye_dialog .eagle-confirm--btn p {
    font-size: 18px;
    margin-bottom: 0 !important;
    margin-top: 0 !important;
    color: #ffffff;
    outline: 0;
    font-weight: bold;
  }
  #beosin_eagle_eye_dialog .eagle-confirm--btn:hover,
  #beosin_eagle_eye_dialog .eagle-confirm--btn:focus {
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
  #beosin_eagle_eye_dialog .eagle-eye-dialog--title img {
    width: 32px;
    height: 32px;
  }
  #beosin_eagle_eye_dialog .eagle-warning--icon .be-icon {
    height: 64px;
    width: 64px;
  }
  #beosin_eagle_eye_dialog .bg-heck--img {
    position: absolute;
    top: 43px;
    right: 46px;
    width: 320px;
    height: 320px;
  }
  #beosin_eagle_eye_dialog .be-dialog--icon__close {
    line-height: 32px;
    margin-top: 12px;
    margin-right: 6px;
  }
  .eagle-eye-dialog--info {
    margin-bottom: 0 !important;
  }
  .eagle-eye-dialog--text,
  .eagle-eye-dialog--text a {
    color: #1d263b;
  }

  /* 适配 */
  @media screen and (min-width: 100px) and (max-width: 1000px) {
    #beosin_eagle_eye_dialog .be-dialog--container {
      width: 500px;
    }
    #beosin_eagle_eye_dialog .eagle-eye-dialog--body__icon {
      height: auto;
      margin-top: 22px;
      margin-bottom: 22px;
    }
    #beosin_eagle_eye_dialog .eagle-eye-dialog--body__icon h1 {
      line-height: 40px;
      font-size: 32px;
    }
    #beosin_eagle_eye_dialog .eagle-eye-dialog--body__footer .beosin-eagle-eye-logo {
      line-height: 24px;
    }
    #beosin_eagle_eye_dialog .be-dialog--container .be-dialog--footer {
      padding-top: 0;
    }
    #beosin_eagle_eye_dialog .be-dialog--container .be-dialog--body {
      padding-bottom: 0;
    }
    #beosin_eagle_eye_dialog .bg-heck--img {
      right: -15px;
      width: 50%;
      height: 63%;
      bottom: 10%;
      top: initial;
    }
    .eagle-eye-dialog--source {
      width: 60%;
    }
  }
</style>
