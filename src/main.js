import Vue from 'vue'
import App from './App.vue'
import router from "@/router";
import store from './store'

import FastClick from 'fastclick'
import VueLazyload from "vue-lazyload";

import toast from 'components/common/toast'

Vue.config.productionTip = false
// 新增 事件總線
Vue.prototype.$bus = new Vue()
// 新增 toast 擴充
Vue.use(toast)

// 解決 App裝置 300ms 延遲
FastClick.attach(document.body)

// 使用圖片懶加載
Vue.use(VueLazyload, {
  loading: require('./assets/img/common/placeholder.png')
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
