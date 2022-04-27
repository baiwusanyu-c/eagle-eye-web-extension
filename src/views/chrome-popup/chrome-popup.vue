<script setup lang="ts">
  import { nextTick, ref } from 'vue'
  import { MESSAGE_TYPES } from '@/enums'
  import { CACHE_KEYS, useStorage } from '@/hooks/use-storage'
  import { LINK, SOCIAL_LINK } from '@/enums/link'
  import useCommon from '@/hooks/use-common'
  const isOpen = ref<string>('false')
  const { getItem, setItem } = useStorage()
  nextTick(() => {
    getItem(CACHE_KEYS.IS_OPEN).then(res => {
      if (res && res === 'true') {
        isOpen.value = res
      } else {
        setItem(CACHE_KEYS.IS_OPEN, 'false')
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
    <div class="flex justify-start h-30px mb-4">
      <img alt="" src="../../../public/favicon_32.png" class="mr-4" />
      <h2 class="text-2xl font-bold">Beosin Alert</h2>
    </div>
    <div class="w-full h-350px p-4 pr-0">
      <h2 class="text-lg mb-4">Open Beosin Alert</h2>
      <be-switch
        v-model="isOpen"
        checked-value="true"
        size="large"
        un-checked-value="false"
        @change="handleChange">
      </be-switch>
      <p class="text-base mb-4 mt-16 text-gray-500">Submit Malicious website or message？</p>
      <a class="text-base text-sky-400 pointer-events-auto" :href="LINK.GOOGLE_FEEDBACK"
        >FeedBack</a
      >
    </div>
    <div class="flex justify-between border-t-1 border-gray-500/50 relative left-0 bottom-0 h-50px">
      <span class="text-lg leading-50px">© Beosin</span>
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
    @apply w-350px h-450px p-4;
  }
  .eagle-eye--popup--footer .be-icon {
    @apply h-6 w-6;
  }
</style>
