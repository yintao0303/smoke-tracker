import App from './App'
import Vue from 'vue'

// 引入Vuex
import store from './store'
Vue.prototype.$store = store

// 引入工具类
import utils from './common/utils/utils.js'
Vue.prototype.$utils = utils

// 引入API接口
import api from './common/api/api.js'
Vue.prototype.$api = api

// 引入全局配置
import config from './common/utils/config.js'
Vue.prototype.$config = config

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
