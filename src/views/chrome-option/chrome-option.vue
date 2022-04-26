<script lang="ts" setup>
  import { watch } from 'vue'
  import { useStorage } from '@/hooks/use-storage'

  const { cache } = useStorage()
  watch(cache, val => {
    console.warn(val)
  })
</script>

<template>
  <div>
    <!-- <button @click="() => setItem(CACHE_KEYS.GRAY_LIST, [Date.now()])">Hello</button> -->
    <!-- <pre>{{ cache }}</pre> -->
  </div>
</template>
