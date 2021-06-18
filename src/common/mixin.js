import {debounce} from "./utils"
import BackTop from "components/content/backTop/BackTop"


export const itemListenerMixin = {
  data() {
    return {
      itemImageListener: null
    }
  },
  mounted() {
    // 防抖動 防止 refresh 重複調用
    const refresh = debounce(this.$refs.scroll.refresh, 100)
    // 保存 監聽事件
    this.itemImageListener = () => {
      refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImageListener)
    console.log('mixin refresh');
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false,
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 1000)
    },
  }
}
