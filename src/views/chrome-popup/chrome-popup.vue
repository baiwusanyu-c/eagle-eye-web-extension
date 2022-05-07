<script setup lang="ts">
  import { nextTick, ref } from 'vue'
  import { MESSAGE_TYPES } from '@/enums'
  import { CACHE_KEYS, useStorage } from '@/hooks/use-storage'
  import { LINK, SOCIAL_LINK } from '@/enums/link'
  import useCommon from '@/hooks/use-common'
  const isOpen = ref<string>('true')

  const { getItem, setItem } = useStorage()
  nextTick(() => {
    getItem(CACHE_KEYS.IS_OPEN).then(res => {
      if (res && res === 'true') {
        isOpen.value = 'true'
      } else if (res && res === 'false') {
        isOpen.value = 'false'
      } else {
        isOpen.value = 'true'
        setItem(CACHE_KEYS.IS_OPEN, 'true')
      }
    })
  })

  const handleChange = (data: { newVal: string; oldVal: string }) => {
    // 设置缓存并通知是否开启插件
    setItem(CACHE_KEYS.IS_OPEN, data.newVal.toString()).then(() => {
      chrome.runtime.sendMessage({ type: MESSAGE_TYPES.SET_SWITCH }, response => {
        response('SET_SWITCH response')
      })
    })
  }
  const { openWindow } = useCommon()
</script>

<template>
  <div class="eagle-eye--popup relative">
    <div class="flex justify-start h-30px mb-12">
      <img alt="" src="../../../public/favicon_32.png" class="mr-4" />
      <h2 class="text-2xl font-bold font-alibaba">Beosin Alert</h2>
    </div>
    <div class="w-full h-300px">
      <h2 class="text-3xl mb-8 font-alibaba font-bold">Open Beosin Alert</h2>
      <be-switch
        v-model="isOpen"
        checked-value="true"
        size="large"
        un-checked-value="false"
        @change="handleChange">
      </be-switch>
      <p class="text-base mb-4 mt-16 font-alibaba">Submit Malicious website or message？</p>
      <a
        style="border-radius: 8px"
        class="text-base font-bold pointer-events-auto text-mainG border border-mainG w-140px h-44px block text-center leading-44px"
        :href="LINK.GOOGLE_FEEDBACK"
        target="_blank"
        >FeedBack</a
      >
    </div>
    <div class="flex justify-between border-t-1 border-gray-500/50 relative left-0 bottom-0 h-50px">
      <span class="text-sm font-bold leading-50px">© Beosin</span>
      <div class="flex items-center eagle-eye--popup--footer">
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
</template>

<style>
  .eagle-eye--popup {
    @apply w-388px h-472px p-8;
  }
  .eagle-eye--popup--footer .be-icon {
    @apply h-6 w-6;
  }
  .eagle-eye--popup .be-switch__checked {
    @apply bg-mainG;
  }
  .eagle-eye--popup .be-switch__large {
    height: 40px;
    width: 75px;
  }
  .eagle-eye--popup .be-switch__large .be-switch--circle {
    width: 1rem;
    height: 1rem;
  }
  .eagle-eye--popup .be-switch__unChecked .be-switch--circle {
    position: absolute;
    left: 8px;
    margin-left: 1px;
  }
  .eagle-eye--popup .be-switch__checked .be-switch--circle {
    left: calc(100% - 8px);
  }
</style>
