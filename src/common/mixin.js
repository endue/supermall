import {debounce} from "./utils";
import BackTop from 'components/content/backTop/BackTop'

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh(), 50)
    this.itemImgListener = () => {refresh()}
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  }
}

/**
 * 回到顶部组件混入
 * @type {{components: {BackTop}, data(): *, method: {backClick(): void}}}
 */
export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false,
    }
  },
  method: {
    // 回到顶部
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 300)
    },
    listenShowBackTop(position){
      this.isShowBackTop = (-position.y) > 200
    }
  }
}
