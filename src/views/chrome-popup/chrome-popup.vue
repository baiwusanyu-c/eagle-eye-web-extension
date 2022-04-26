<script setup lang="ts">
import {nextTick, ref} from 'vue'
import {MESSAGE_TYPES} from "@/enums";
import {CACHE_KEYS, useStorage} from "@/hooks/use-storage";


const isOpen = ref<string>('false')
  const {getItem,setItem} = useStorage()
  nextTick(()=>{
      getItem(CACHE_KEYS.IS_OPEN).then(res=>{
          if(res && res === 'true'){
              isOpen.value = res
          }else{
              setItem(CACHE_KEYS.IS_OPEN,'false')
          }
      })
  })

  const handleChange = (data: { newVal:string,oldVal:string } ) => {
     // 设置缓存并通知是否开启插件
      setItem(CACHE_KEYS.IS_OPEN, data.newVal.toString()).then(()=>{
          chrome.runtime.sendMessage({ type: MESSAGE_TYPES.SET_SWITCH}, response => {
              console.log('SET_SWITCH response')
          })
      })
  }


</script>

<template>
  <div class="eagle-eye--popup">
      {{isOpen}}
    <be-switch
        checkedValue="true"
        unCheckedValue="false"
        v-model = 'isOpen'
        @change = 'handleChange'>
    </be-switch>

  </div>
</template>

<style>
  .eagle-eye--popup {
    @apply w-350px h-500px
  }

</style>
