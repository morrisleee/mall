import {ADD_COUNTER, ADD_TO_CART} from "./mutation-types";

export default {
  addCart(context, payload) {
    // new Promise 將執行 結果resolve 返回
    return new Promise((resolve, reject) => {
      // 1.判斷 payload 商品 是否已存在 cartList
      // // 第一種方法
      // let oldProduct = null;
      // for (let item of state.cartList) {
      //   if (item.iid === payload.iid) {
      //     oldProduct = item;
      //   }
      // }
      // 第二種方法
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

      // 2.將商品數量  +1
      if (oldProduct) { //舊商品數量+1
        context.commit(ADD_COUNTER, oldProduct)
        resolve('目前商品數量+1')
      } else { //新商品加入購物車
        payload.count = 1
        context.commit(ADD_TO_CART, payload)
        resolve('新商品加入購物車')
      }
    })
  }
}
