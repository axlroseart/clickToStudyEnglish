import Vue from 'vue'
import App from './App.vue'
import store from './store/index'
import Api from './api'
import * as utils from './utils/index'
import './assets/styles/animate.css'
Vue.config.productionTip = false
Vue.prototype.Api = Api

// 注册全局方法
Vue.mixin({
  methods: {
    _formatSeconds: utils.formatSeconds,
    _checkData: utils.checkData
  }
})

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
