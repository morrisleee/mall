<template>
  <div class="cart">
    <!-- 導航 -->
    <nav-bar clas="nav-bar">
      <div class="" slot="center">購物車({{ length }})</div>
    </nav-bar>
    <!-- 商品列表 -->
    <cart-list class=""/>
    <!-- 底部匯總 -->
    <cart-bottom-bar/>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import CartList from "./childComps/CartList";
import CartBottomBar from "./childComps/CartBottomBar";

import {mapGetters} from "vuex"

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    // 1.第一種用法 Array 直接映射使用
    ...mapGetters(['cartLength', 'cartList']),
    // 2.第二種用法 Object 映射後重命名
    ...mapGetters({
      length: 'cartLength',
      list: 'cartList'
    })
  }
}
</script>

<style scoped>
.cart {
  height: 100vh;
}

.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
}
</style>
