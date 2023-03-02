import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'//引入被分出去的模块user
import createPersistedState from 'vuex-persistedstate'//引入插件
import utils from '@/utils/index.js'
Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'//vuex提示的插件和持久化的插件一起使用 
const store = new Vuex.Store({
  modules: {//使用模块user
    user,
  },
  //plugins: [createPersistedState()]})，默认存储到localStorage——使用插件
  plugins: debug//vuex提示的插件和持久化的插件一起使用，但plugins得是一个一维数组，不然会解析错误。所以用了三元运算方式
    ? [createPersistedState({ storage: window.localStorage, key: utils.storeKey })]
    : [createPersistedState({ storage: window.localStorage, key: utils.storeKey })],
})
Vue.prototype.$store = store//将store挂载到vue原型上、生成原型链。当其他页面想要用$store方法时，可以去vue原型上找
export default store//然后将store给暴露出去给其他页面使用

