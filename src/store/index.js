import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from "./getters";

// 1.安裝插件
Vue.use(Vuex)

// 2.創建 Store 對象
const state = {
  cartList: []
}
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

// 3.將 Vuex 掛載到 Vue 上
export default store
