<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"
                    ref="nav"
                    @titleClick="titleClick"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <detail-bottom-bar @addToCart="addToCart"/>
<!--    <toast :message="message" :show="show"></toast>-->
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
// import Toast from "components/common/toast/Toast";

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail";
import {itemListenerMixin, backTopMixin} from "common/mixin";
import {mapActions} from "vuex"

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    // Toast
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      currentIndex: 0,
      message: '',
      show: false
    }
  },
  created() {
    // 1.保存傳入的 iid
    this.iid = this.$route.params.iid
    // 2.根據 iid 請求詳情數據
    getDetail(this.iid).then(res => {
      // 1.獲取數據
      const data = res.result
      // 2. 獲取 頂部輪播圖片數據
      this.topImages = data.itemInfo.topImages
      // 3. 獲取 商品訊息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      // 4. 獲取 店舖訊息
      this.shop = new Shop(data.shopInfo)
      // 5. 保存 商品詳情數據
      this.detailInfo = data.detailInfo
      // 6. 獲取 商品參數訊息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      // 7. 獲取 評論訊息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }

      // // 更新 NavBar 的 offsetTop 使用 this.$nextTick()
      // // 根據最新數據，對應的 DOM 已經被渲染
      // // 但圖片尚未讀取完成 (offsetTop 值不正確時，皆因圖片問題)
      // this.$nextTick(() => {
      //   this.themeTopYs = []
      //   this.themeTopYs.push(0)
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      //   console.log(this.themeTopYs);
      // })
    })
    // 3.請求推薦數據
    getRecommend().then(res => {
      this.recommends = res.data.list
    })
  },
  methods: {
    ...mapActions(['addCart']),
    imageLoad() {
      this.$refs.scroll.refresh()

      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44)
      this.themeTopYs.push(Number.MAX_VALUE)
      console.log(this.themeTopYs);
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 300)
    },
    contentScroll(position) {

      // 1.獲取 Y 值
      const positionY = -position.y

      // 2.positionY 和 主題中值 進行對比
      // themeTopYs = [0, 1000, 2000, 3000]
      // 0 < postitionY < 1000 , index = 0
      // 1000 <= postitionY < 2000 , index = 1
      // 2000 <= postitionY < 3000 , index = 2
      // 3000 <= postitionY , index = 3

      let length = this.themeTopYs.length

      for (let i = 0; i < length - 1; i++) {
        /** 普通方法
         * ( (1) && ( (2.1) || (2.2) ) )
         *  條件一  this.currentIndex !== i 判斷currentIndex 與 i 防止頻繁賦值
         *  條件二  ((2.1) || (2.2))
         */
        // if (this.currentIndex !== i && ((i < length - 1 && this.themeTopYs[i] <= positionY && positionY < this.themeTopYs[i + 1]) || (i === length - 1 && this.themeTopYs[i] <= positionY))) {
        // }

        /** hack 方法
         *  themeTopYs = [0, 1000, 2000, 3000, Number.MAX_VALUE]
         *  0 < postitionY < 1000 , index = 0
         *  1000 <= postitionY < 2000 , index = 1
         *  2000 <= postitionY < 3000 , index = 2
         *  3000 <= postitionY , index = 3
         */
        if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY > this.themeTopYs[i - 1])) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex
        }
        this.isShowBackTop = -position.y > 1000
      }
    },
    addToCart() {
      // 1.獲取 加入購物車 需要顯示的訊息
      const product = {}
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      // // 2.將商品 加入 購物車中 (1.Promise 2.mapActions)
      // // .them 接收執行結果
      // this.$store.dispatch('addCart', product).then(res => {
      //   console.log(res);
      // })
      // mapActions 後，可直接使用
      this.addCart(product).then(res => {
        // this.show = true;
        // this.message = res;
        //
        // setTimeout(() => {
        //   this.show = false;
        //   this.message = ''
        // }, 1500)

        this.$toast.show(res, 1500)
      })
    }
  },
  mounted() {
  },
  // // 更新 NavBar offsetTop update 每次內容更新都會調用 更新頻率過快
  update() {
    //   // update 每次內容更新都會調用
    //   // 因此調用時，先將 themeTopYs 為空，否則 [] 會不斷增加
    //   this.themeTopYs = []
    //   this.themeTopYs.push(0)
    //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
    //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
    //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
  },
  destroyed() {
    this.$bus.$off('itemImageLoad', this.itemImageListener)
  }
}
</script>

<style scoped>

#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px - 49px);
}
</style>
