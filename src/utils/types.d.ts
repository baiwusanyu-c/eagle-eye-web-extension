/*
 * @types.d.ts
 * @deprecated
 * @author czh
 * @update (czh 2022/4/21)
 */
declare namespace Config {
  type PropKeys = 'grayscale'
  interface ConfigItem {
    value: boolean | number
    label: string
    description?: string
  }
  type Root = {
    [key in PropKeys]: ConfigItem
  }
}

/*declare namespace Config {
  interface ConfigItem {
    value: boolean | number
    label: string
    description?: string
  }
}*/
export interface IOption {
  [key: string]: any
}
