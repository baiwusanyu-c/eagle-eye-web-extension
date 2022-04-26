import { readonly, ref } from 'vue'
import type { Ref } from 'vue'

type Cache = Ref<Record<string, unknown>>

const cache = ref({}) as Cache

export enum CACHE_KEYS {
  IS_PHISHING = 'IS_PHISHING',
}

export function useStorage() {
  syncCache()

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
      chrome.storage.sync.set({ [key]: value }, () => {
        syncCache().then(() => {
          resolve()
        })
      })
    })
  }

  function getItem(key: CACHE_KEYS): Promise<unknown> {
    return new Promise(resolve => {
      chrome.storage.sync.get(key, result => {
        resolve(result[key])
      })
    })
  }

  function removeItem(key: CACHE_KEYS | CACHE_KEYS[]): Promise<void> {
    return new Promise(resolve => {
      chrome.storage.sync.remove(key, () => {
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
  // Immediately return a promise and start asynchronous work
  return new Promise((resolve, reject) => {
    // Asynchronously fetch all data from storage.sync.
    chrome.storage.sync.get(null, items => {
      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError)
      }
      // Pass the data retrieved from storage down the promise chain.
      resolve(items)
    })
  })
}
