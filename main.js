import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import store from '@/store'
import appConfig from '@/utils/appConfig'
import utils from '@/utils/index'
import weChatApi from '@/utils/weChat'
Vue.config.productionTip = false
App.mpType = 'app'
// import '@/utils/vconsole'

// 使用全局混入代码
import appMixin from "@/mixins/appMixin.js"
Vue.use(appMixin)
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif