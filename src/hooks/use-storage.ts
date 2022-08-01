import { readonly, ref } from 'vue'
import useBrowser from './use-browser'
import type { Ref } from 'vue'

type Cache = Ref<Record<string, unknown>>

const cache = ref({}) as Cache

export enum CACHE_KEYS {
  IS_OPEN = 'IS_OPEN', // 是否开启插件
}

export function useStorage() {
  syncCache()
  const { browserInst } = useBrowser()
  async function syncCache() {
    try {
      const items = await getAllStorageSyncData()
      cache.value = Object.assign({}, cache.value, items)
    } catch (error) {
      console.error(error)
    }
  }

  function setItem(key: CACHE_KEYS, value: unknown): Promise<void> {
    return new Promise(resolve => {
      browserInst.storage.sync.set({ [key]: value }, () => {
        syncCache().then(() => {
          resolve()
        })
      })
    })
  }

  function getItem(key: CACHE_KEYS): Promise<unknown> {
    return new Promise(resolve => {
      browserInst.storage.sync.get(key, (result: any) => {
        resolve(result[key])
      })
    })
  }

  function removeItem(key: CACHE_KEYS | CACHE_KEYS[]): Promise<void> {
    return new Promise(resolve => {
      browserInst.storage.sync.remove(key, () => {
        syncCache().then(() => {
          resolve()
        })
      })
    })
  }

  return {
    CACHE_KEYS: readonly(CACHE_KEYS),
    cache: readonly(cache),
    setItem,
    getItem,
    removeItem,
  }
}

function getAllStorageSyncData() {
  const { browserInst } = useBrowser()
  // Immediately return a promise and start asynchronous work
  return new Promise((resolve, reject) => {
    // Asynchronously fetch all data from storage.sync.
    browserInst.storage.sync.get(null, (items: any) => {
      // Pass any observed errors down the promise chain.
      if (browserInst.runtime.lastError) {
        return reject(browserInst.runtime.lastError)
      }
      // Pass the data retrieved from storage down the promise chain.
      resolve(items)
    })
  })
}
