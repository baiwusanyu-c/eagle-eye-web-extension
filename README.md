#eagle-eye-front 态势感知浏览器插件  
该插件谷歌浏览器、edge、Safari 浏览器，它能够识别用户访问的网址，智能提示用户危险虚拟货币钓鱼网站 ##主要技術依賴
**Vue3.2 + Vite2.x + typeScript4.5**

| 名称      | 版本   | 説明               |
| --------- | ------ | ------------------ |
| Vue       | ^3.2.3 | 前端開發框架       |
| vite      | ^2.9.x | 工程化開發打包框架 |
| windi.css | ^3.4.3 | css 原子化樣式庫   |
| be-ui     | -      | 内部 UI 組件庫     |

##package 指令

`chrome:dev`  
**开发启动 chrome 插件**

`safari:dev`  
**开发启动 safari 插件**

`build`  
**基于 vite、gulp 的打包工具，它将同时打包 Safari 与 Chrome 插件**

`clean`  
**使用 rimraf 清除 dist**

`lint:ts`  
**esLint 代碼校验**

`lint:ts-fix`  
**esLint 代碼校验修復**

`prettier:fix`,  
**prettier 格式修復**

`prepare`  
**husky 初始化**

## 目錄結構

- node_modules 項目依賴
- Beosin-Alert safar 插件项目文件夹
- public 公共文件
- icon 图标 svg 文件
- docs 开发文档
- env 环境变量文件夹
- script 打包脚本
- src
  api Api 封裝

  assets 存放静态文件

  components 存放公用组件

  enums 环境配置枚舉，包含後臺幾口，第三方鏈接

  utils 配置与公共方法

  hooks 一些 hooks 方法

  views 页面

- .gitignore 指定文件无需提交到 git 上

- package.json 项目描述及依赖

- package-lock.json 版本管理使用的文件

- vite.config.ts vite 配置文件
- vite-background.config.ts background.ts 打包 配置文件
- vite-content.config.ts content 打包 配置文件

### 配置 hasky 与 commitlint

- npm install -save-dev @commitlint/cli @commitlint/config-conventional
- 新建文件 commitlint.config.js，内容：module.exports = {extends: ['@commitlint/config-conventional']}
- npm install husky --save-dev
- npm set-script prepare "husky install"
- npm run prepare
- npx husky add .husky/pre-commit "npm exec lint-staged"
- git add .husky/pre-commit
- npx husky add .husky/commit-msg "npx --no -- commitlint --edit $1"
- 在 package.json 配置

```
"lint-staged": {
    "*.{vue,js,ts,jsx,tsx,md,json}": [
      "pretty-quick --staged",
      "eslint --fix",
      "git add"
    ]
  },
```

- 提交时执行命令例如 git commit -am "feat: 项目添加 commitlint 本地校验配置" 或 git commit -m "feat: 项目添加 commitlint 本地校验配置"

### 配置 eslint 校验

#### 1.安装依赖

- eslint": "^8.10.0",
- eslint-config-prettier": "^8.5.0",
- eslint-plugin-prettier": "^4.0.0",
- eslint-plugin-vue": "^8.5.0",
- prettier": "2.5.1",
- pretty-quick: "v3.1.3 ",
- @typescript-eslint/eslint-plugin": "^5.10.0",
- @typescript-eslint/parser": "^5.10.0",
- @vue/eslint-config-prettier": "^7.0.0",
- @vue/eslint-config-typescript": "^10.0.0",

#### 2.创建脚本 .eslinttrc.js、.eslintignore、.prettierignore、.prettierrc

#### 3.在脚本中配置对应格式校验规则和格式化规则具体参考相应官方文档

#### 4.编写脚本指令 lint:ts 与 lint:ts-fix

## 谷歌浏览器插件扩展文档参考链接

- [v2 版本中文文档](http://chrome.cenchy.com/index.html)
- [v3 版本英文文档](https://developer.chrome.com/docs/extensions/)
