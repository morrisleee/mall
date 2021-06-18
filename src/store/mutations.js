import {ADD_COUNTER, ADD_TO_CART} from "./mutation-types";

export default {
  // mutations 唯一目的就是修改 state 中的狀態
  // mutations 中方法，執行的操作盡可能 單一
  [ADD_COUNTER](state, payload) {
    payload.count++
  },
  [ADD_TO_CART](state, payload) {
    payload.checked = true
    state.cartList.push(payload)
  }
}
