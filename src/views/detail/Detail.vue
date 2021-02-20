<template>
  <div id="detail">
    <detail-nav-bar ref="navBar" class="detail-nav" @titleClick="titleClick"/>
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-image-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="paramInfo" ref="params"/>
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <goods-list :goods="recommends" ref="recommend"/>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailImageInfo from './childComps/DetailImageInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'
  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'
  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
  import {debounce} from 'common/utils'
  import {itemListenerMixin,backTopMixin} from "common/mixin";

  export default {
    name: "Detail",
    components: {
      DetailSwiper,
      DetailNavBar,
      DetailBaseInfo,
      DetailShopInfo,
      DetailImageInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      GoodsList,
      Scroll
    },
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
        getThemeTopY: null,
        currentIndex: 0,
        // itemImgListener: null
      }
    },
    created() {
      this.iid = this.$route.params.iid
      // 请求详情数据
      getDetail(this.iid).then(res => {
        const data = res.result
        // 获取顶部轮播图
        this.topImages = data.itemInfo.topImages
        // 获取商品信息,这里初始化一个Goods对象，将数据整合同步给子组件
        this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
        // 获取店铺信息
        this.shop = new Shop(data.shopInfo)
        // 获取商品详情
        this.detailInfo = data.detailInfo
        // 获取商品参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
        // 获取一条评论信息
        if(data.rate.cRate !== 0){
          this.commentInfo = data .rate.list[0]
        }
        // // 渲染完上述数据后的回调，有图片存在会有问题
        // this.$nextTick(() => {
        //   this.themeTopYs = []
        //   this.themeTopYs.push(0)
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        // })

      })
      // 请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })

      // 防抖来给themeTopYs数组赋值
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
      },50)
    },
    mixins: [itemListenerMixin,backTopMixin],
    methods: {
      imageLoad() {
        this.$refs.scroll.refresh()
        // 这种方式调用太频繁，采用后面的防抖技术
        // this.themeTopYs = []
        // this.themeTopYs.push(0)
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        // 防抖技术
        this.getThemeTopY()
      },
      // nav-bar发生点击跳转到对应位置
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 300)
      },
      // 监听scroll滚动实现nav-bar的联动
      contentScroll(position) {
        // 是否显示回到顶部
        this.listenShowBackTop(position)
        // 获取当前滚动到的位置
        const positionY = position.y
        let length = this.themeTopYs.length
        for(let i = 0; i < length - 1; i++){
          if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1] )){
            this.currentIndex = i
            this.$refs.navBar.currentIndex = this.currentIndex
          }
        }
      },
      // 加入购物车
      addToCart() {
        const product = {}
        product.image = this.topImages[0]
        product.titile = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid
      }
    },
    mounted() {
      // 基于混入mixins来实现
      // const refresh = debounce(this.$refs.scroll.refresh(), 50)
      // this.itemImgListener = () => {refresh()}
      // this.$bus.$on('itemImageLoad', this.itemImgListener)
    },
    // 由于当前组件在keep alive中被排除，所以取消事件就不能与Home组件一样写在deactivated
    destroyed() {
      this.$bus.$off('itemImageLoad',this.itemImgListener)
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #F0F0F0;
    height: 100vh;
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #F0F0F0;
  }
  /* 实现scroll滚动区域计算 */
  .content {
    height: calc(100% - 44px - 49px);
  }
</style>
